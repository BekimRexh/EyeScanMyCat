import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { styles } from '../styles';

interface AppGeneralButtonProps {
  onPress: () => void;
  text?: string;
  children?: React.ReactNode;
  buttonStyle?: object;
  textStyle?: object;
  contentStyle?: object;
  IconComponent?: React.ElementType; 
  iconName?: string;
  iconSize?: number; 
  iconColor?: string; 
  borderRadius?: number;
  disabled?: boolean; 
}

const AppGeneralButton: React.FC<AppGeneralButtonProps> = ({
  onPress,
  text,
  children,
  buttonStyle,
  textStyle,
  contentStyle,
  IconComponent, 
  iconName, 
  iconSize = 24, 
  iconColor = '#2F4F4F', 
  borderRadius,
  disabled = false, 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonTheme2, 
        localStyles.shadow, 
        buttonStyle, 
        disabled && localStyles.disabledButton 
      ]}
      onPress={!disabled ? onPress : undefined}
      activeOpacity={disabled ? 1 : 0.7} 
      disabled={disabled} 
    >
      <View style={[localStyles.buttonContent, contentStyle]}>
       
        {IconComponent && iconName && (
          <IconComponent
            name={iconName}
            size={iconSize}
            color={disabled ? '#A9A9A9' : iconColor} 
            borderRadius={borderRadius}
          />
        )}

        
        {children ? (
          <View style={localStyles.contentWrapper}>{children}</View>
        ) : (
          <Text style={[
            styles.buttonText2, 
            textStyle, 
            disabled && localStyles.disabledText 
          ]}>
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AppGeneralButton;

const localStyles = StyleSheet.create({
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  contentWrapper: {
    marginLeft: 5,
  },
  shadow: {
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    elevation: 8, 
  },
  disabledButton: {
    opacity: 0.5, 
  },
  disabledText: {
    color: '#A9A9A9', 
  },
});
