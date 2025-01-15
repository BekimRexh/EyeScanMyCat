import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { CONTENT_WIDTH, HEADER_HEIGHT } from '../../assets/utils/dimensions';

interface TextThemedButtonProps {
  name: string; // Button name identifier
  type?: 'primary' | 'secondary' | 'danger'; // Button type (optional)
  buttonText: string; // Text to display on the button
  textSizeMultiplier?: number; // Multiplier for text size relative to button height
  textColor?: string; // Text color for the button
  borderRadiusMultiplier?: number; // Border radius multiplier for dynamic styling
  heightMultiplier?: number; // Button height multiplier
  widthMultiplier?: number; // Button width multiplier
  backgroundColor?: string; // Background color for the button
  backgroundDarker?: string; // Background color when button is pressed
  raiseLevel?: number; // Button elevation when pressed
  disabled?: boolean; // Disabled state of the button
  onPress: () => void; // Function to handle button press
}

const TextThemedButton: React.FC<TextThemedButtonProps> = ({
  name = 'rick',
  type = 'primary',
  buttonText,
  textSizeMultiplier = 0.45, // Multiplier for text size
  textColor = '#2F4F4F',
  borderRadiusMultiplier = 0.2,
  heightMultiplier = 0.35,
  widthMultiplier = 0.23,
  backgroundColor = '#5ca7c445',
  backgroundDarker = '#f0f4f6',
  raiseLevel = 2.5,
  disabled = false,
  onPress,
}) => {
  // Calculate button dimensions
  const buttonHeight = HEADER_HEIGHT * heightMultiplier;
  const buttonWidth = CONTENT_WIDTH * widthMultiplier;
  const borderRadius = HEADER_HEIGHT * borderRadiusMultiplier;
  const textSize = buttonHeight * textSizeMultiplier;

  return (
    <ThemedButton
      name={name}
      type={type}
      borderRadius={borderRadius}
      textColor={textColor}
      backgroundColor={backgroundColor}
      backgroundDarker={backgroundDarker}
      raiseLevel={raiseLevel}
      onPress={!disabled ? onPress : undefined}
      height={buttonHeight}
      width={buttonWidth}
      disabled={disabled}
    >
      <View style={styles.textWrapper}>
        <Text style={[styles.buttonText, { fontSize: textSize, color: disabled ? '#A9A9A9' : textColor }]}>
          {buttonText}
        </Text>
      </View>
    </ThemedButton>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    color: '#2F4F4F',

  },
});

export default TextThemedButton;

// import React from 'react';
// import { View, Text, StyleSheet, Pressable } from 'react-native';
// import { CONTENT_WIDTH, HEADER_HEIGHT } from '../../assets/utils/dimensions';

// interface TextThemedButtonProps {
//   name: string; // Button name identifier
//   type?: 'primary' | 'secondary' | 'danger'; // Button type (optional)
//   buttonText: string; // Text to display on the button
//   textSizeMultiplier?: number; // Multiplier for text size relative to button height
//   textColor?: string; // Text color for the button
//   borderRadiusMultiplier?: number; // Border radius multiplier for dynamic styling
//   heightMultiplier?: number; // Button height multiplier
//   widthMultiplier?: number; // Button width multiplier
//   backgroundColor?: string; // Background color for the button
//   backgroundDarker?: string; // Background color when button is pressed
//   raiseLevel?: number; // Button elevation when pressed
//   disabled?: boolean; // Disabled state of the button
//   onPress: () => void; // Function to handle button press
// }

// const TextThemedButton: React.FC<TextThemedButtonProps> = ({
//   name = 'rick',
//   type = 'primary',
//   buttonText,
//   textSizeMultiplier = 0.45,
//   textColor = '#2F4F4F',
//   borderRadiusMultiplier = 0.2,
//   heightMultiplier = 0.35,
//   widthMultiplier = 0.23,
//   backgroundColor = '#5ca7c445',
//   backgroundDarker = '#f0f4f6',
//   raiseLevel = 2.5,
//   disabled = false,
//   onPress,
// }) => {
//   // Calculate button dimensions
//   const buttonHeight = HEADER_HEIGHT * heightMultiplier;
//   const buttonWidth = CONTENT_WIDTH * widthMultiplier;
//   const borderRadius = HEADER_HEIGHT * borderRadiusMultiplier;
//   const textSize = buttonHeight * textSizeMultiplier;

//   return (
//     <Pressable
//       onPress={!disabled ? onPress : undefined}
//       style={({ pressed }) => [
//         styles.button,
//         {
//           height: buttonHeight,
//           width: buttonWidth,
//           borderRadius,
//           backgroundColor: pressed && !disabled ? backgroundDarker : backgroundColor,
//         },
//         disabled && styles.disabled,
//       ]}
//     >
//       <View style={styles.textWrapper}>
//         <Text
//           style={[
//             styles.buttonText,
//             { fontSize: textSize, color: disabled ? '#A9A9A9' : textColor },
//           ]}
//         >
//           {buttonText}
//         </Text>
//       </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2, // Mimics the "raiseLevel"
//   },
//   disabled: {
//     backgroundColor: '#A9A9A9',
//   },
//   textWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontFamily: 'Quicksand-Regular',
//     textAlign: 'center',
//     color: '#2F4F4F',
//   },
// });

// export default TextThemedButton;

