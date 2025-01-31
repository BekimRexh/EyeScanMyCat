import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import { CONTENT_HEIGHT, CONTENT_WIDTH, HEADER_HEIGHT } from '../../assets/utils/dimensions';

interface IconThemedButtonProps {
  name: string;
  type?: 'primary' | 'secondary' | 'danger';
  IconComponent?: React.ElementType;
  iconName?: string;
  iconSizeMultiplier?: number;
  iconColor?: string;
  borderRadiusMultiplier?: number;
  paddingLeftMultiplier?: number;
  paddingRightMultiplier?:number;
  heightMultiplier?: number;
  widthMultiplier?: number;
  backgroundColor?: string;
  backgroundDarker?: string;
  raiseLevel?: number;
  textColor?: string;
  paddingTopMultiplier?: number;
  paddingBottomMultiplier?: number;
  disabled?: boolean;
  onPress: () => void;
}

const IconThemedButton: React.FC<IconThemedButtonProps> = ({
  name = 'rick',
  type = 'primary',
  IconComponent,
  iconName,
  iconSizeMultiplier = 1.03,
  iconColor = '#2F4F4F',
  borderRadiusMultiplier = 0.14,
  heightMultiplier = 0.3,
  widthMultiplier = 0.22,
  backgroundColor = '#5ca7c445',
  backgroundDarker = '#f0f4f6',
  raiseLevel = 2.5,
  textColor = '#FFFFFF',
  paddingTopMultiplier = 0.05,
  paddingBottomMultiplier = 0.05,
  paddingLeftMultiplier = 0,
  paddingRightMultiplier = 0,
  disabled = false,
  onPress,
}) => {
  const buttonHeight = HEADER_HEIGHT * heightMultiplier;
  const buttonWidth = CONTENT_WIDTH * widthMultiplier;
  const iconSize = buttonHeight * iconSizeMultiplier;
  const borderRadius = HEADER_HEIGHT * borderRadiusMultiplier;
  const paddingTop = HEADER_HEIGHT * paddingTopMultiplier;
  const paddingBottom = HEADER_HEIGHT * paddingBottomMultiplier;
  const paddingLeft = CONTENT_WIDTH*  paddingLeftMultiplier;
  const paddingRight = CONTENT_WIDTH*  paddingRightMultiplier;

  return (
    <View style={[styles.shadowContainer, { borderRadius }]}>
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
        paddingTop={paddingTop*1.1}
        paddingBottom={paddingBottom}
        paddingHorizontal={-30}
        disabled={disabled}
      >
        <View>
          {IconComponent && iconName && (
            <IconComponent
              name={iconName}
              size={iconSize}
              color={disabled ? '#A9A9A9' : iconColor}
              paddingLeft={paddingLeft}
              paddingRight={paddingRight}
              marginRight='-10'
              marginLeft='-10'
              marginBottom='-10'
              marginTop='-10'
            />
          )}
        </View>
      </ThemedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: CONTENT_HEIGHT*0.01, 
    },
    shadowOpacity: 0.35, 
    shadowRadius: 4.65, 
    elevation: 8, 
  },
});

export default IconThemedButton;



