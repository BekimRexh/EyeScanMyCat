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

// Screen Dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Card size

// Flick threshold
const THRESHOLD = CONTENT_WIDTH;

// We'll show up to 3 "fanned" cards behind the top card,
// each offset by 40 px on the right side
const MAX_STACK_OFFSET = 1;
const HORIZONTAL_GAP = CONTENT_WIDTH * 0.21;

const CARD_WIDTH = CONTENT_WIDTH * 0.89;
const CARD_HEIGHT = CONTENT_HEIGHT * 1.05;

// The container width => base card width + enough offset for 3 behind
const CONTAINER_WIDTH = CARD_WIDTH + HORIZONTAL_GAP * MAX_STACK_OFFSET;
// We don't need a large container height if not stacking vertically
const CONTAINER_HEIGHT = CARD_HEIGHT;

function clamp(value: number, minVal: number, maxVal: number) {
  'worklet';
  return Math.min(Math.max(value, minVal), maxVal);
}

type CardData = {
  id: string;
  title: string;
  text1?: string; // New prop for additional text
  text2?: string; // New prop for additional text
  subtitle?: string; // New prop for subtitle
  imageUri: string;
  backgroundColor1: string;
  backgroundColor2: string;
  youtubeLink?: string; // Add YouTube link
};

interface SwipableStackProps {
  cards: CardData[];
}

export default function SolitaireSwipableStack({ cards: initialCards }: SwipableStackProps) {
  const [cards, setCards] = useState(initialCards);
  const [swipedCards, setSwipedCards] = useState<CardData[]>([]);

  // Figure out which card is on top => used for dot highlighting
  const [topCardIndex, setTopCardIndex] = useState(0); // Track the top card index

  const shouldReduceMotion = useReducedMotion(); // Detect if reduced motion is preferred

  const moveCardToBottom = (swipedCard: CardData) => {
    setCards((prevCards) => {
      const remainingCards = prevCards.slice(0, -1); // Remove top card
      return [swipedCard, ...remainingCards]; // Add swiped card to the bottom
    });
    setTopCardIndex((prevIndex) => (prevIndex + 1) % initialCards.length);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.stackContainer}>
        {cards.map((card, index) => {
          const isTop = index === cards.length - 1;
          const isSecond = index === cards.length - 2;

          // Render only the top two cards; hide others by scaling them down and moving them out of view
          if (!isTop && !isSecond) return null;
          const cardWidth = isSecond ? CARD_WIDTH - HORIZONTAL_GAP : CARD_WIDTH;

          const offsetX = isSecond ? HORIZONTAL_GAP / 2 : 0; // Slight offset for the second card

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

      {/* Looping dots */}
      <View style={styles.dotsContainer}>
        {initialCards.map((_, i) => {
          const isActive = i === topCardIndex; // Highlight the current top card
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
  const translateX = useSharedValue(0); // Gesture-driven translation
  const translateY = useSharedValue(0); // Gesture-driven translation
  const rotateZ = useSharedValue(0);
  const positionX = useSharedValue(offsetX); // Stack-driven translation

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
      // Initialize starting values for swipe
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
            direction * CONTENT_WIDTH * 1.5, // Move off-screen
            { duration: 500 },
            () => {
              runOnJS(onSwiped)();
            }
          );
        } else {
          translateX.value = withSpring(0); // Snap back
          translateY.value = withSpring(0);
          rotateZ.value = withSpring(0);
        }
      }
    });

  // Animate the position to match the top card's position smoothly
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
      { translateX: positionX.value + translateX.value }, // Add stack and gesture translations
      { translateY: translateY.value },
      { rotateZ: `${rotateZ.value}rad` },
    ],
  }));

  const [availableWidth, setAvailableWidth] = React.useState(CONTENT_WIDTH);

  // Add the splitText function here
  function splitText(text: string, maxLength: number): [string, string] {
    if (!text) return ['', '']; // Handle empty text gracefully
    if (text.length <= maxLength) return [text, '']; // No need to split
    const splitIndex = text.lastIndexOf(' ', maxLength); // Split at the nearest space
    return [text.slice(0, splitIndex), text.slice(splitIndex + 1)];
  }

  function handleContainerLayout(event: any) {
    const { width } = event.nativeEvent.layout;
    setAvailableWidth(width); // Store available container width
  }

  // Helper function to parse text with bold markers (e.g., **bold**)
  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/); // Split by **bold** markers
    return parts.map((part, index) => {
      const trimmedPart = part.trim(); // Trim any extra spaces
      if (trimmedPart.startsWith('**') && trimmedPart.endsWith('**')) {
        return (
          <Text key={index} style={styles.textBold}>
            {trimmedPart.slice(2, -2)} {/* Remove the ** markers */}
          </Text>
        );
      }
      return (
        <Text key={index} style={styles.text}>
          {trimmedPart} {/* Ensure no extra spaces */}
        </Text>
      );
    });
  };

  const renderTextWithBoldNoJustify = (text: string) => {
    const tapGesture = Gesture.Tap()
      .onStart(() => {
        console.log('Tap registered');
        // Linking.openURL(youtubeLink);
      });
    const parts = text.split(/(\*\*.*?\*\*)/); // Split by **bold** markers
    return (
      <>
        {parts.map((part, index) => {
          const trimmedPart = part.trim(); // Trim any extra spaces
          if (trimmedPart.startsWith('**') && trimmedPart.endsWith('**')) {
            return (
              <Text key={index} style={styles.textBold}>
                {trimmedPart.slice(2, -2)} {/* Remove the ** markers */}
              </Text>
            );
          }
          return (
            <Text key={index} style={styles.textNoJustify}>
              {trimmedPart} {/* Ensure no extra spaces */}
            </Text>
            
          );
        })}
      </>
    );
  };
  

  // Dynamically split the card.text1 into two parts

  

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Top Container: Two Columns */}
        <View style={[styles.topContainer, { backgroundColor: card.backgroundColor1 }]}>
          {/* Left Column: Subtitle and Text */}
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
  
          {/* Right Column: Title */}
          <View style={styles.titleColumn}>
            <Text style={styles.title}>{card.title}</Text>
          </View>
        </View>
  
        {/* "Video Here" Link */}
        {isTop && card.youtubeLink && (
          <View style={styles.videoLinkContainer}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // Prevent parent gesture from triggering
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

  
        {/* Bottom Half: Image */}
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
  
  

// --- STYLES ---
const styles = StyleSheet.create({
  // Wrapper for the entire component
  wrapper: {
    alignItems: 'center',
  },
  videoLinkContainer: {
    position: 'absolute',
    top: '56%', // Adjust to align between the top and bottom containers
    left: '31%', // Center horizontally
    transform: [{ translateX: -50 }, { translateY: -50 }], // Center with respect to its own dimensions
    zIndex: 10, // Ensure it stays above other components
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stack container for holding cards
  stackContainer: {
    width: CONTENT_WIDTH,
    height: CONTENT_HEIGHT,
    marginTop: CONTENT_HEIGHT * -0.07,
  },

  // Card container
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent', // Ensures a visible background for text
  },

  // Parent container for top and bottom sections
  parentContainer: {
    flex: 1,
    flexDirection: 'column', // Stack children vertically
  },

  // --- TOP CONTAINER STYLES ---
  topContainer: {
    flexDirection: 'row', // Creates two columns
    flex: Math.pow(CONTENT_HEIGHT, -1.18) * 2700,
    justifyContent: 'space-between',
    backgroundColor: '#5ca7c430', // Debugging background
    borderRadius: 30,
    marginBottom: CONTENT_HEIGHT*0.06,
    overflow: 'hidden',

  },

  // Left column for subtitle and text1
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    marginRight: CARD_WIDTH * -0.17,
    alignItems: 'center', // Ensures the text stays in the middle
    marginLeft: CARD_WIDTH*0.11,
    
  },

  // Title column for the right side
  titleColumn: {
    flex: 1,
    justifyContent: 'center', // Vertically centers the rotated title
    marginLeft: CARD_WIDTH * -0.5, // Optional padding for spacing
    marginRight: CARD_WIDTH *0.18,
    paddingLeft:CARD_WIDTH*-0.01,
    // paddingVertical:100,
  },
  
  title: {
    fontSize: CONTENT_HEIGHT * 0.04,
    color: '#1C211C',
    fontFamily: 'Quicksand-Regular',
    transform: [{ rotate: '90deg' }], // Rotates the text block
    textAlign: 'center', // Ensures words flow properly in the rotated text
    lineHeight: CONTENT_HEIGHT * 0.05, // Adjusts spacing between lines
    writingDirection: 'ltr', // Ensures proper left-to-right text flow
    backgroundColor: '#bbdefb45',
    // borderRadius: 30,
    paddingVertical:8,
    width:'235%'

  },
  // Subtitle container
  subtitleContainer: {
    marginTop:CARD_HEIGHT * 0.01,
    },

  // Subtitle text styles
  subtitle: {
    fontSize: CONTENT_HEIGHT * 0.035,
    fontFamily: 'Quicksand-Bold',
    color: '#1C211C',
    textAlign: 'center',
  },

  // Container for text1 (additional text)
  text1Container: {
    marginTop: CARD_HEIGHT * 0.01,
  },

  // --- BOTTOM CONTAINER STYLES ---
  bottomContainer: {
    flex: 1,
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-between', // Spacing between columns
    alignItems: 'center', // Align items vertically
    backgroundColor: '#5ca7c455', // Debugging background
    borderRadius: 30

  },

  // Left column for the image
  leftColumnImage: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    width: '110%', // Full width
    // height: '100%', // Full height
  },
  // Right column for vertical title
  rightColumn: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: CARD_WIDTH * 0.08,
    marginRight: CARD_WIDTH * 0.04,
    marginTop:CARD_HEIGHT*0.01,
    marginBottom:CARD_HEIGHT*0.02
  },

  // Image container
  image: {
    width: '100%', // Full width
    height: '100%', // Full height
    backgroundColor: '#ccc', // Debugging background
    borderRadius: 30
    // resizeMode: 'contain', // Ensure the whole image fits within the dimensions

    
  },

  // Right column for text2
  rightColumnText: {
    flex: 1.2,
    justifyContent: 'flex-start',
    marginTop: CARD_HEIGHT * 0.02,
    marginLeft: CARD_WIDTH * 0.05,
    marginRight: CARD_WIDTH * 0.01,
    backgroundColor: 'transparent',
  },

  // --- TEXT STYLES ---
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

  // --- DOT INDICATOR STYLES ---
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

  // --- DEBUGGING STYLES ---
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

