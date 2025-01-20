import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Alert, AccessibilityInfo } from 'react-native';
import { Video } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const videoRef = useRef<Video>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); 
        const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setReduceMotion(isReduceMotionEnabled);
      } catch (error) {
        console.warn('Error during splash setup:', error);
      }
    };

    init();
  }, []);

  const onPlaybackStatusUpdate = async (status: any) => {
    if (status.didJustFinish) {
      try {
        
        if (videoRef.current) {
          await videoRef.current.setPositionAsync(status.durationMillis);
          await videoRef.current.pauseAsync();
        }

        
        if (!reduceMotion) {
          Animated.timing(fadeAnim, {
            toValue: 0, 
            duration: 2500, 
            useNativeDriver: true,
          }).start(() => {
            SplashScreen.hideAsync();
            onAnimationComplete();
          });
        } else {
          
          SplashScreen.hideAsync();
          onAnimationComplete();
        }
      } catch (error) {
        console.error('Error during fade-out:', error);
        SplashScreen.hideAsync();
        onAnimationComplete();
      }
    }
  };

  const handleVideoError = () => {
    Alert.alert('Error', 'Failed to load the splash screen video.');
    SplashScreen.hideAsync();
    onAnimationComplete();
  };

  return (
    <View style={styles.container}>
      {reduceMotion ? (
        
        <View style={styles.staticSplash}>
          
          <View style={styles.staticLogo} />
        </View>
      ) : (
        <Animated.View style={[styles.videoWrapper, { opacity: fadeAnim }]}>
          <Video
            ref={videoRef}
            source={require('../assets/animations/meowmediclogo2.mp4')}
            resizeMode="contain"
            rate={1.5} 
            shouldPlay
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            onError={handleVideoError}
            style={styles.video}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  staticSplash: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
  },
  staticLogo: {
    width: 150, 
    height: 150,
    backgroundColor: '#cccccc', 
    borderRadius: 75,
  },
});

export default SplashScreenComponent;
