import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import CircularMenuButton from '../components/buttons/CircularMenuButton';
import { Entypo, AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { CONTENT_HEIGHT, CONTENT_WIDTH } from '../assets/utils/dimensions';
import { useReducedMotion } from 'react-native-reanimated'; 

const { width } = Dimensions.get('window');



const circleSize = Math.min(CONTENT_WIDTH * 0.75, CONTENT_HEIGHT * 0.35);
const buttonSize = circleSize * 0.45; 
const radius = circleSize * 0.58; 


const TIP_WIDTH = Math.min(width * 0.85, 320);

export default function HomeScreen() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion(); 


  const scrollX = useRef(new Animated.Value(0)).current;


  const originalTips = [
    { text: "Regular eye scans can prevent serious conditions.", 
      image: require('../assets/images/tipCats/tip1.jpg') },
    { text: 'Keep your cat hydrated to prevent eye dryness.',
      image: require('../assets/images/tipCats/tip2.jpg') },
    { text: 'Watch for redness—it could be an early sign of issues.',
      image: require('../assets/images/tipCats/tip3.jpg') },
    { text: 'Healthy diets support better eye health for cats.',
      image: require('../assets/images/tipCats/tip4.jpg') },
    { text: 'Pawing at the face might indicate eye irritation.',
      image: require('../assets/images/tipCats/tip5.jpg') },
    { text: 'Dim lights can help cats with light sensitivity.',
      image: require('../assets/images/tipCats/tip6.jpg') },
    { text: 'Regular vet visits are essential for healthy eyes.',
      image: require('../assets/images/tipCats/tip7.jpg') },
    { text: 'A clean environment reduces eye infection risks.',
      image: require('../assets/images/tipCats/tip8.jpg') },
    { text: 'Monitor for unusual discharge around the eyes.',
      image: require('../assets/images/tipCats/tip9.jpg') },
    { text: 'Eye contact helps build trust with your cat.',
      image: require('../assets/images/tipCats/tip10.jpg') },
  ];

  
  const tips = [...originalTips, ...originalTips]; 



  const totalContentWidth = tips.length * TIP_WIDTH; 

  useEffect(() => {
    if (shouldReduceMotion) {
      
      scrollX.setValue(0);
      return;
    }

    scrollX.setValue(160); 
    const segmentWidth = TIP_WIDTH;
    const duration = 800;
    const pauseDuration = 7000;
    const totalWidth = -(originalTips.length * TIP_WIDTH);
    const resetDuration = 4000; 

    let currentTip = 0;

    const animateSegment = () => {
      if (currentTip < originalTips.length) {
        const nextPosition = -(currentTip * segmentWidth) + 160;
        currentTip += 1;

        Animated.timing(scrollX, {
          toValue: nextPosition,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setTimeout(animateSegment, pauseDuration);
          }
        });
      } else {
       
        Animated.timing(scrollX, {
          toValue: 160, 
          duration: resetDuration,
          easing: Easing.ease, 
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            currentTip = 0; 
            setTimeout(animateSegment, pauseDuration);
          }
        });
      }
    };

    animateSegment();

    return () => scrollX.stopAnimation();
  }, [scrollX, shouldReduceMotion]);

 
  const revolveAnim = useRef(new Animated.Value(0)).current;

  const revolve = revolveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const revolveBack = revolveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      
      revolveAnim.setValue(0);
      return;
    }

    const rotationLoop = Animated.loop(
      Animated.timing(revolveAnim, {
        toValue: 1,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotationLoop.start();

    return () => {
      rotationLoop.stop();
    };
  }, [revolveAnim, shouldReduceMotion]);

  
  return (
    <View style={styles.container}>
      {/* Row for Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/images/eyeScanMyCatFullLogo.png')}
          style={styles.footerLogo}
          resizeMode="contain"
        />
      </View>

      {/* Row for Circle Menu */}
      <View style={styles.circleMenuWrapper}>
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.rotatingParent,
              shouldReduceMotion
                ? {} 
                : { transform: [{ rotate: revolve }] },
            ]}
          >
            {[
              {
                onPress: () => router.push('/aboutScreen'),
                iconName: 'questioncircleo',
                text: 'About',
                IconComponent: AntDesign,
              },
              {
                onPress: () => router.push('/termsScreen'),
                iconName: 'text-document',
                text: 'Terms',
                IconComponent: Entypo,
              },
              {
                onPress: () => router.push('/ScanScreenNew'),
                iconName: 'camera',
                text: 'Scan',
                IconComponent: AntDesign,
              },
              {
                onPress: () => router.push('/howItWorksScreen'),
                iconName: 'paw',
                text: 'Guide',
                IconComponent: FontAwesome5,
              },
              {
                onPress: () => router.push('/learnScreen'),
                iconName: 'cat',
                text: 'Learn',
                IconComponent: FontAwesome6,
              },
            ].map((btn, i) => {
              const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              return (
                <View
                  key={i}
                  style={[
                    styles.buttonWrapper,
                    {
                      left: x + circleSize / 2 - buttonSize / 2,
                      top: y + circleSize / 2 - buttonSize / 2,
                    },
                  ]}
                >
                  <Animated.View
                    style={
                      shouldReduceMotion
                        ? {}
                        : { transform: [{ rotate: revolveBack }] }
                    }
                  >
                    <CircularMenuButton
                      onPress={btn.onPress}
                      iconName={btn.iconName}
                      IconComponent={btn.IconComponent}
                      buttonStyle={{
                        width: buttonSize,
                        height: buttonSize,
                      }}
                      iconSize={CONTENT_HEIGHT * 0.09}
                    />
                    <Text style={styles.circularButtonText}>{btn.text}</Text>
                  </Animated.View>
                </View>
              );
            })}
          </Animated.View>
        </View>
      </View>

      
      <View style={styles.marqueeWrapper}>
        <Animated.View
          style={[
            styles.marqueeContent,
            {
              width: totalContentWidth,
              transform: shouldReduceMotion
                ? [{ translateX: 0 }] 
                : [{ translateX: scrollX }],
            },
          ]}
        >
          {tips.map((tip, idx) => (
            <View
              key={idx}
              style={[
                styles.marqueeItem,
                { width: TIP_WIDTH },
              ]}
            >
              <Image
                source={tip.image}
                style={styles.tipImage}
                resizeMode="cover"
              />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    justifyContent: 'space-between', 
  },


  circleMenuWrapper: {
    marginTop: CONTENT_HEIGHT * -0.01,
    flex: 3, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: '#c7e1eb65',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  rotatingParent: {
    position: 'absolute',
    width: circleSize,
    height: circleSize,
  },
  buttonWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  circularButtonText: {
    fontSize: CONTENT_HEIGHT * 0.025,
    color: '#2F4F4F',
    marginTop: 5,
    textAlign: 'center',
  },

 
  marqueeWrapper: {
    flex: 2.5, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: CONTENT_HEIGHT * -0.1,
    marginBottom: CONTENT_HEIGHT * -0.02,
    height: CONTENT_HEIGHT * 0.3, 
    overflow: 'hidden',
  },
  marqueeContent: {
    flexDirection: 'row',
  },
  marqueeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  tipImage: {
    width: '90%',
    height: '70%',
    borderRadius: 50,
    marginBottom: 5,
  },
  tipText: {
    fontSize: CONTENT_HEIGHT * 0.028,
    fontFamily: 'Quicksand-Regular',
    color: '#2F4F4F',
    textAlign: 'center',
    maxWidth: '85%',
    marginTop: CONTENT_HEIGHT * 0.01,
  },


  logoWrapper: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLogo: {
    marginTop: CONTENT_HEIGHT * 0.1,
    width: CONTENT_WIDTH * 0.8,
    height: CONTENT_HEIGHT * 0.3,
  },
});
