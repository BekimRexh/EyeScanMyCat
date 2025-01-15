import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import { Video } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

// Define the props interface
interface SplashScreenProps {
  onAnimationComplete: () => void; // Function type with no arguments and no return value
}

const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Animation for fading out
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const preventSplashHide = async () => {
      await SplashScreen.preventAutoHideAsync();
    };
    preventSplashHide();
  }, []);

  const onPlaybackStatusUpdate = async (status) => {
    if (status.didJustFinish) {
      try {
        // Pause the video at its last frame
        if (videoRef.current) {
          await videoRef.current.setPositionAsync(status.durationMillis);
          await videoRef.current.pauseAsync();
        }

        // Start fade-out animation for the video
        Animated.timing(fadeAnim, {
          toValue: 0, // Fully transparent
          duration: 2500, // Duration of fade-out effect
          useNativeDriver: true,
        }).start(() => {
          SplashScreen.hideAsync();
          onAnimationComplete(); // Notify RootLayout that splash is complete
        });
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
    onAnimationComplete(); // Notify RootLayout even on error
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, ...styles.videoWrapper }}>
        <Video
          ref={videoRef}
          source={require('../assets/animations/meowmediclogo2.mp4')}
          resizeMode="contain"
          rate={1.5} // Start the video at 1.5x speed
          shouldPlay
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={handleVideoError}
          style={styles.video}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Background remains white
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
});

export default SplashScreenComponent;
