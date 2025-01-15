import { Animated } from 'react-native';

// Function to handle press animations
export const useButtonAnimation = () => {
  const animatedValue = new Animated.Value(1); // For button scaling
  const showTickAnimation = new Animated.Value(0); // For tick icon animation
  const textOpacity = new Animated.Value(1); // For text opacity

  const handlePressIn = () => {
    // Scale down the button when pressed
    Animated.spring(animatedValue, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (callback?: () => void) => {
    // Fade out the text
    Animated.timing(textOpacity, {
      toValue: 0, // Fade out text
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Scale back the button and show the tick
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        // Start tick icon animation after text fades out
        Animated.spring(showTickAnimation, {
          toValue: 1, // Animate tick to appear
          useNativeDriver: true,
        }).start(() => {
          // After tick icon animation, execute callback (e.g., navigation)
          if (callback) {
            setTimeout(callback, 10);
          }
        });
      });
    });
  };

  return { animatedValue, showTickAnimation, textOpacity, handlePressIn, handlePressOut };
};