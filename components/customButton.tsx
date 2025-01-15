import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useButtonAnimation } from './animations';
import { FontAwesome } from '@expo/vector-icons'; // For tick icon

const CustomButton = ({ title, onPress }) => {
  const { animatedValue, showTickAnimation, textOpacity, handlePressIn, handlePressOut } = useButtonAnimation();

  // Apply animated width and scale
  const animatedStyle = {
    transform: [{ scale: animatedValue }], // Other animations
  };

  const tickStyle = {
    opacity: showTickAnimation,
    transform: [
      {
        scale: showTickAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1], // Start hidden, then scale to full size
        }),
      },
    ],
  };

  const textStyle = {
    opacity: textOpacity, // Control the opacity of the text
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={() => handlePressOut(onPress)} // Pass the callback
      style={styles.buttonWrapper}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        <Animated.View style={tickStyle}>
          <FontAwesome name="check" size={30} color="white" />
        </Animated.View>
        <Animated.Text style={[styles.buttonText, textStyle]}>{title}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    minHeight: 40,
    minWidth: 180,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#ADD8E6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.44,
    shadowRadius: 5.0,
    elevation: 24, // Android shadow
    borderWidth: 2, // Specify a border width
    borderColor: '#003972', // Specify the border color
  },
  buttonText: {
    fontSize: 22,
    fontFamily: 'Quicksand_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: '#003972',
    position: 'absolute',
  },
});

export default CustomButton;
