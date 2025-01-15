import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../styles'; // Adjust the import path as necessary

interface CircularMenuButtonProps {
  onPress: () => void;
  iconName: string;
  iconSize?: number;
  iconColor?: string;
  buttonStyle?: object;
  iconStyle?: object;
  IconComponent: React.ComponentType<any>; // Accepts any icon library component
}

const CircularMenuButton: React.FC<CircularMenuButtonProps> = ({
  onPress,
  iconName,
  iconSize = 40,
  iconColor = '#2F4F4F',
  buttonStyle,
  iconStyle,
  IconComponent,
}) => {
  return (
    <TouchableOpacity
      style={[styles.circularButtonTheme, buttonStyle]}
      onPress={onPress}
    >
      <IconComponent
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={iconStyle}
      />
    </TouchableOpacity>
  );
};

export default CircularMenuButton;
