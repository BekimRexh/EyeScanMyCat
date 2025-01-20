import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { CONTENT_WIDTH, HEADER_HEIGHT } from '../../assets/utils/dimensions';

interface TextThemedButtonProps {
  name: string; 
  type?: 'primary' | 'secondary' | 'danger'; 
  buttonText: string; 
  textSizeMultiplier?: number; 
  textColor?: string; 
  borderRadiusMultiplier?: number; 
  heightMultiplier?: number; 
  widthMultiplier?: number; 
  backgroundColor?: string; 
  backgroundDarker?: string; 
  raiseLevel?: number; 
  disabled?: boolean; 
  onPress: () => void; 
}

const TextThemedButton: React.FC<TextThemedButtonProps> = ({
  name = 'rick',
  type = 'primary',
  buttonText,
  textSizeMultiplier = 0.45, 
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



