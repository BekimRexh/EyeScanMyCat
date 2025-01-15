import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function TwoContainerTrickExample() {
  // animate opacity with native driver
  const opacityAnim = useRef(new Animated.Value(0)).current; 

  // animate width with JS driver
  const widthAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // 1) Fade in (native driver)
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true, 
    }).start();

    // 2) Animate width (JS driver)
    Animated.timing(widthAnim, {
      toValue: 150,
      duration: 1000,
      useNativeDriver: false, 
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Outer Animated.View for opacity (native driver) */}
      <Animated.View style={{ opacity: opacityAnim }}>
        
        {/* Inner Animated.View for width (JS driver) */}
        <Animated.View
          style={[
            styles.box, 
            { width: widthAnim }, // must be JS driver
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: 50,
    backgroundColor: 'blue',
  },
});
