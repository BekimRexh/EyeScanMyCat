
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';
import VerticalStack from './indexScreen/fullContent/indexStyle1';
import { useReducedMotion } from 'react-native-reanimated';

const FADE_DURATION = 1500; 
const IMAGE_DURATION = 10000; 

export default function Index() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shouldReduceMotion = useReducedMotion(); 


  const imageSources = [
    require('../assets/images/portraitCats/cat1.jpg'),
    require('../assets/images/portraitCats/cat2.jpg'),
    require('../assets/images/portraitCats/cat3.jpg'),
    require('../assets/images/portraitCats/cat4.jpg'),
    require('../assets/images/portraitCats/cat5.jpg'),
    require('../assets/images/portraitCats/cat6.jpg'),
    require('../assets/images/portraitCats/cat7.jpg'),
    require('../assets/images/portraitCats/cat8.jpg'),
    require('../assets/images/portraitCats/cat9.jpg'),
    require('../assets/images/portraitCats/cat10.jpg'),
  ];

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const interval = setInterval(() => {
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: FADE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageSources.length);

        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FADE_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      });
    }, IMAGE_DURATION);

    return () => clearInterval(interval); 
  }, [fadeAnim, shouldReduceMotion]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <VerticalStack
          rowLayoutType="equal"
          columnLayoutType="equal"
          rows={[
            [
              {
                type: 'view',
                props: {
                  children: shouldReduceMotion ? (
                    <Image
                      source={imageSources[currentImageIndex]}
                      style={styles.imageStyle}
                      resizeMode="cover"
                    />
                  ) : (
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <Image
                        source={imageSources[currentImageIndex]}
                        style={styles.imageStyle}
                        resizeMode="cover"
                      />
                    </Animated.View>
                  ),
                },
              },
            ],
          ]}
        />
      </View>
    </View>
  );
}

export const unstable_settings = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageStyle: {
    width: '100%',
    height: '98%',
    borderRadius: 40,
  },
});
