import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function TwoContainerTrickExample() {
 
  const opacityAnim = useRef(new Animated.Value(0)).current; 

  
  const widthAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true, 
    }).start();

    
    Animated.timing(widthAnim, {
      toValue: 150,
      duration: 1000,
      useNativeDriver: false, 
    }).start();
  }, []);

  return (
    <View style={styles.container}>
     
      <Animated.View style={{ opacity: opacityAnim }}>
        
        
        <Animated.View
          style={[
            styles.box, 
            { width: widthAnim }, 
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
