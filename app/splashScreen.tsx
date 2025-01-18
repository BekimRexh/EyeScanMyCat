import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Alert, AccessibilityInfo } from 'react-native';
import { Video } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Animation for fading out
  const videoRef = useRef<Video>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Prevent auto-hide
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
        // Pause the video at the last frame
        if (videoRef.current) {
          await videoRef.current.setPositionAsync(status.durationMillis);
          await videoRef.current.pauseAsync();
        }

        // Start fade-out animation for the video
        if (!reduceMotion) {
          Animated.timing(fadeAnim, {
            toValue: 0, // Fully transparent
            duration: 2500, // Duration of fade-out effect
            useNativeDriver: true,
          }).start(() => {
            SplashScreen.hideAsync();
            onAnimationComplete();
          });
        } else {
          // Skip animation and hide splash screen immediately
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
        // Static splash screen for users with "Reduce Motion" enabled
        <View style={styles.staticSplash}>
          {/* Replace with your static splash image or logo */}
          <View style={styles.staticLogo} />
        </View>
      ) : (
        <Animated.View style={[styles.videoWrapper, { opacity: fadeAnim }]}>
          <Video
            ref={videoRef}
            source={require('../assets/animations/meowmediclogo2.mp4')}
            resizeMode="contain"
            rate={1.5} // Playback speed
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
    backgroundColor: '#ffffff', // Ensure white background
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
    backgroundColor: '#ffffff', // Match your splash screen background
  },
  staticLogo: {
    width: 150, // Adjust as needed
    height: 150,
    backgroundColor: '#cccccc', // Placeholder for your static logo
    borderRadius: 75,
  },
});

export default SplashScreenComponent;
