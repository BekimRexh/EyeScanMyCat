import { Animated } from 'react-native';


export const useButtonAnimation = () => {
  const animatedValue = new Animated.Value(1); 
  const showTickAnimation = new Animated.Value(0); 
  const textOpacity = new Animated.Value(1); 

  const handlePressIn = () => {
    
    Animated.spring(animatedValue, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (callback?: () => void) => {
    
    Animated.timing(textOpacity, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
       
        Animated.spring(showTickAnimation, {
          toValue: 1, 
          useNativeDriver: true,
        }).start(() => {
          
          if (callback) {
            setTimeout(callback, 10);
          }
        });
      });
    });
  };

  return { animatedValue, showTickAnimation, textOpacity, handlePressIn, handlePressOut };
};