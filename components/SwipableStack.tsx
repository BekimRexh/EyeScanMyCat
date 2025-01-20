import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../assets/utils/dimensions';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  Linking,
} from 'react-native';
import { Gesture, GestureDetector, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { useReducedMotion } from 'react-native-reanimated';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



const THRESHOLD = CONTENT_WIDTH;



const MAX_STACK_OFFSET = 1;
const HORIZONTAL_GAP = CONTENT_WIDTH * 0.21;

const CARD_WIDTH = CONTENT_WIDTH * 0.89;
const CARD_HEIGHT = CONTENT_HEIGHT * 1.05;


const CONTAINER_WIDTH = CARD_WIDTH + HORIZONTAL_GAP * MAX_STACK_OFFSET;

const CONTAINER_HEIGHT = CARD_HEIGHT;

function clamp(value: number, minVal: number, maxVal: number) {
  'worklet';
  return Math.min(Math.max(value, minVal), maxVal);
}

type CardData = {
  id: string;
  title: string;
  text1?: string; 
  text2?: string; 
  subtitle?: string; 
  imageUri: string;
  backgroundColor1: string;
  backgroundColor2: string;
  youtubeLink?: string; 
};

interface SwipableStackProps {
  cards: CardData[];
}

export default function SolitaireSwipableStack({ cards: initialCards }: SwipableStackProps) {
  const [cards, setCards] = useState(initialCards);
  const [swipedCards, setSwipedCards] = useState<CardData[]>([]);

  
  const [topCardIndex, setTopCardIndex] = useState(0); 

  const shouldReduceMotion = useReducedMotion(); 

  const moveCardToBottom = (swipedCard: CardData) => {
    setCards((prevCards) => {
      const remainingCards = prevCards.slice(0, -1); 
      return [swipedCard, ...remainingCards]; 
    });
    setTopCardIndex((prevIndex) => (prevIndex + 1) % initialCards.length);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.stackContainer}>
        {cards.map((card, index) => {
          const isTop = index === cards.length - 1;
          const isSecond = index === cards.length - 2;

          
          if (!isTop && !isSecond) return null;
          const cardWidth = isSecond ? CARD_WIDTH - HORIZONTAL_GAP : CARD_WIDTH;

          const offsetX = isSecond ? HORIZONTAL_GAP / 2 : 0; 

          return (
            <SolitaireCard
              key={card.id}
              card={card}
              isTop={isTop}
              offsetX={offsetX}
              onSwiped={() => moveCardToBottom(card)}
              cardsLeft={cards.length}
              shouldReduceMotion={shouldReduceMotion}
            />
          );
        })}
      </View>

      
      <View style={styles.dotsContainer}>
        {initialCards.map((_, i) => {
          const isActive = i === topCardIndex; 
          return <View key={i} style={[styles.dot, isActive && styles.dotActive]} />;
        })}
      </View>
    </View>
  );
}

function SolitaireCard({
  card,
  isTop,
  offsetX,
  onSwiped,
  cardsLeft,
  shouldReduceMotion,
}: {
  card: CardData;
  isTop: boolean;
  offsetX: number;
  onSwiped: () => void;
  cardsLeft: number;
  shouldReduceMotion: boolean;
}) {
  const translateX = useSharedValue(0); 
  const translateY = useSharedValue(0); 
  const rotateZ = useSharedValue(0);
  const positionX = useSharedValue(offsetX); 

  const isLastCard = cardsLeft === 1;

  const wiggle = () => {
    translateX.value = withSequence(
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 50 })
    );
  };

  const panGesture = Gesture.Pan()
    .enabled(isTop && !shouldReduceMotion)
    .onBegin(() => {
      
    })
    .onUpdate((event) => {
      if (!shouldReduceMotion) {
        translateX.value = event.translationX;
        const newTranslateY = translateY.value + event.translationY;
        translateY.value = clamp(newTranslateY, 0, 0);
        rotateZ.value = (event.translationX / 10) * (Math.PI / 180);
      }
    })
    .onEnd((event) => {
      if (!shouldReduceMotion) {
        const distanceX = translateX.value;
        const velocityX = event.velocityX;

        if (isLastCard) {
          runOnJS(wiggle)();
          translateY.value = withSpring(0);
          rotateZ.value = withSpring(0);
          return;
        }

        if (Math.abs(distanceX) > THRESHOLD || Math.abs(velocityX) > 800) {
          const direction = distanceX > 0 ? 1 : -1;
          translateX.value = withTiming(
            direction * CONTENT_WIDTH * 1.5, 
            { duration: 500 },
            () => {
              runOnJS(onSwiped)();
            }
          );
        } else {
          translateX.value = withSpring(0); 
          translateY.value = withSpring(0);
          rotateZ.value = withSpring(0);
        }
      }
    });

  
  useEffect(() => {
    if (!shouldReduceMotion) {
      positionX.value = withTiming(offsetX, { duration: 300 });
    } else {
      positionX.value = offsetX;
      translateX.value = 0;
      translateY.value = 0;
      rotateZ.value = 0;
    }
  }, [offsetX, shouldReduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value + translateX.value }, 
      { translateY: translateY.value },
      { rotateZ: `${rotateZ.value}rad` },
    ],
  }));

  const [availableWidth, setAvailableWidth] = React.useState(CONTENT_WIDTH);

  
  function splitText(text: string, maxLength: number): [string, string] {
    if (!text) return ['', '']; 
    if (text.length <= maxLength) return [text, '']; 
    const splitIndex = text.lastIndexOf(' ', maxLength); 
    return [text.slice(0, splitIndex), text.slice(splitIndex + 1)];
  }

  function handleContainerLayout(event: any) {
    const { width } = event.nativeEvent.layout;
    setAvailableWidth(width); 
  }

  
  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/); 
    return parts.map((part, index) => {
      const trimmedPart = part.trim(); 
      if (trimmedPart.startsWith('**') && trimmedPart.endsWith('**')) {
        return (
          <Text key={index} style={styles.textBold}>
            {trimmedPart.slice(2, -2)} 
          </Text>
        );
      }
      return (
        <Text key={index} style={styles.text}>
          {trimmedPart} 
        </Text>
      );
    });
  };

  const renderTextWithBoldNoJustify = (text: string) => {
    const tapGesture = Gesture.Tap()
      .onStart(() => {
        console.log('Tap registered');
       
      });
    const parts = text.split(/(\*\*.*?\*\*)/); 
    return (
      <>
        {parts.map((part, index) => {
          const trimmedPart = part.trim(); 
          if (trimmedPart.startsWith('**') && trimmedPart.endsWith('**')) {
            return (
              <Text key={index} style={styles.textBold}>
                {trimmedPart.slice(2, -2)} 
              </Text>
            );
          }
          return (
            <Text key={index} style={styles.textNoJustify}>
              {trimmedPart} 
            </Text>
            
          );
        })}
      </>
    );
  };
  

  

  

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        
        <View style={[styles.topContainer, { backgroundColor: card.backgroundColor1 }]}>
         
          <View style={styles.leftColumn}>
            {card.subtitle && (
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>{card.subtitle}</Text>
              </View>
            )}
            {card.text1 && (
              <View style={styles.text1Container}>
                <Text style={styles.textNoJustify}>
                  {renderTextWithBoldNoJustify(card.text1)}
                </Text>
              </View>
            )}
          </View>
  
         
          <View style={styles.titleColumn}>
            <Text style={styles.title}>{card.title}</Text>
          </View>
        </View>
  
        
        {isTop && card.youtubeLink && (
          <View style={styles.videoLinkContainer}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); 
                console.log('Link tapped');
                if (card.youtubeLink) {
                  Linking.openURL(card.youtubeLink).catch((err) =>
                    console.error('Failed to open URL:', err)
                  );
                }
              }}
            >
              <Text
                style={[
                  styles.textBoldLink,
                  { color: '#468fcd95' },
                ]}
              >
                Video Here
              </Text>
            </TouchableOpacity>
          </View>
        )}

  
        
        <View style={[styles.bottomContainer, { backgroundColor: card.backgroundColor2 }]}>
          <View style={styles.rightColumn}>
            {card.text2 && <Text style={styles.textNoJustify}>{renderTextWithBoldNoJustify(card.text2)}</Text>}
          </View>
          <View style={styles.leftColumnImage}>
            <Image
              source={
                typeof card.imageUri === 'string'
                  ? { uri: card.imageUri }
                  : card.imageUri
              }
              style={styles.image}
            />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
  
  
}
  
  


const styles = StyleSheet.create({
  
  wrapper: {
    alignItems: 'center',
  },
  videoLinkContainer: {
    position: 'absolute',
    top: '56%', 
    left: '31%', 
    transform: [{ translateX: -50 }, { translateY: -50 }], 
    zIndex: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  
  stackContainer: {
    width: CONTENT_WIDTH,
    height: CONTENT_HEIGHT,
    marginTop: CONTENT_HEIGHT * -0.07,
  },

  
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent', 
  },

  
  parentContainer: {
    flex: 1,
    flexDirection: 'column', 
  },

  
  topContainer: {
    flexDirection: 'row', 
    flex: Math.pow(CONTENT_HEIGHT, -1.18) * 2700,
    justifyContent: 'space-between',
    backgroundColor: '#5ca7c430', 
    borderRadius: 30,
    marginBottom: CONTENT_HEIGHT*0.06,
    overflow: 'hidden',

  },

  
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    marginRight: CARD_WIDTH * -0.17,
    alignItems: 'center', 
    marginLeft: CARD_WIDTH*0.11,
    
  },

  
  titleColumn: {
    flex: 1,
    justifyContent: 'center', 
    marginLeft: CARD_WIDTH * -0.5, 
    marginRight: CARD_WIDTH *0.18,
    paddingLeft:CARD_WIDTH*-0.01,
    
  },
  
  title: {
    fontSize: CONTENT_HEIGHT * 0.04,
    color: '#1C211C',
    fontFamily: 'Quicksand-Regular',
    transform: [{ rotate: '90deg' }], 
    textAlign: 'center', 
    lineHeight: CONTENT_HEIGHT * 0.05, 
    writingDirection: 'ltr', 
    backgroundColor: '#bbdefb45',
    
    paddingVertical:8,
    width:'235%'

  },
  
  subtitleContainer: {
    marginTop:CARD_HEIGHT * 0.01,
    },

  
  subtitle: {
    fontSize: CONTENT_HEIGHT * 0.035,
    fontFamily: 'Quicksand-Bold',
    color: '#1C211C',
    textAlign: 'center',
  },

  
  text1Container: {
    marginTop: CARD_HEIGHT * 0.01,
  },

  
  bottomContainer: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#5ca7c455', 
    borderRadius: 30

  },

  
  leftColumnImage: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    width: '110%', 
    
  },
  
  rightColumn: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: CARD_WIDTH * 0.08,
    marginRight: CARD_WIDTH * 0.04,
    marginTop:CARD_HEIGHT*0.01,
    marginBottom:CARD_HEIGHT*0.02
  },

  
  image: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#ccc', 
    borderRadius: 30
    

    
  },

  
  rightColumnText: {
    flex: 1.2,
    justifyContent: 'flex-start',
    marginTop: CARD_HEIGHT * 0.02,
    marginLeft: CARD_WIDTH * 0.05,
    marginRight: CARD_WIDTH * 0.01,
    backgroundColor: 'transparent',
  },

  
  text: {
    fontSize: CONTENT_HEIGHT * 0.028,
    color: '#1C211C',
    fontFamily: 'Quicksand-Regular',
    textAlign: 'justify',
  },

  textNoJustify: {
    fontSize: CONTENT_HEIGHT * 0.028,
    color: '#1C211C',
    fontFamily: 'Quicksand-Regular',
    
  },

  textBold: {
    fontSize: CONTENT_HEIGHT * 0.028,
    color: '#1C211C',
    fontFamily: 'Quicksand-Bold',
  },
  textBoldLink: {
    fontSize: CONTENT_HEIGHT * 0.028,
    color: '#1C211C',
    fontFamily: 'Quicksand-Bold',
    padding:CONTENT_HEIGHT*0.105
  },

  
  dotsContainer: {
    flexDirection: 'row',
    marginTop: CONTENT_HEIGHT * 0.07,
    marginBottom: CONTENT_HEIGHT * -0.02
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CCC',
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: '#333',
    transform: [{ scale: 1.2 }],
  },


  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

