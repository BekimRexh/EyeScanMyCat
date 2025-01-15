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
  IconComponent?: React.ElementType; // Optional: The icon component (FontAwesome, MaterialCommunityIcons, etc.)
  iconName?: string; // Optional: The name of the icon (e.g., "home", "cat")
  iconSize?: number; // Optional: Size of the icon
  iconColor?: string; // Optional: Color of the icon
  borderRadius?: number;
  disabled?: boolean; // **Support for 'disabled' prop**
}

const AppGeneralButton: React.FC<AppGeneralButtonProps> = ({
  onPress,
  text,
  children,
  buttonStyle,
  textStyle,
  contentStyle,
  IconComponent, // Optional icon component
  iconName, // Icon name to render
  iconSize = 24, // Default icon size
  iconColor = '#2F4F4F', // Default icon color
  borderRadius,
  disabled = false, // Default disabled to false
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonTheme2, 
        localStyles.shadow, // Added 3D shadow styles
        buttonStyle, 
        disabled && localStyles.disabledButton // Apply the disabled style
      ]}
      onPress={!disabled ? onPress : undefined} // Prevent onPress if disabled
      activeOpacity={disabled ? 1 : 0.7} // Disable touch feedback when disabled
      disabled={disabled} // Disables TouchableOpacity's internal functionality
    >
      <View style={[localStyles.buttonContent, contentStyle]}>
        {/* Conditionally render the icon if the IconComponent and iconName are provided */}
        {IconComponent && iconName && (
          <IconComponent
            name={iconName}
            size={iconSize}
            color={disabled ? '#A9A9A9' : iconColor} // Change icon color when disabled
            borderRadius={borderRadius}
          />
        )}

        {/* Render children or text depending on what's provided */}
        {children ? (
          <View style={localStyles.contentWrapper}>{children}</View>
        ) : (
          <Text style={[
            styles.buttonText2, 
            textStyle, 
            disabled && localStyles.disabledText // Style for disabled text
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
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 6 }, // Shadow position
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 6, // How blurred the shadow is
    elevation: 8, // Android shadow
  },
  disabledButton: {
    opacity: 0.5, // Reduce opacity to visually indicate it's disabled
  },
  disabledText: {
    color: '#A9A9A9', // Dim the text color when disabled
  },
});
