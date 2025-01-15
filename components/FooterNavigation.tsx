import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const FooterNavigation = () => {
  const { theme } = useTheme(); 

  const buttons = [
    { name: 'home', label: 'Home', icon: 'home' },
    { name: 'scan', label: 'Scan', icon: 'camera' },
    { name: 'history', label: 'History', icon: 'history' },
  ];

  return (
    <View style={styles.footer}>
      {buttons.map((btn) => (
        <View key={btn.name} style={styles.navButton}>
          <FontAwesome5 name={btn.icon} size={24} color={theme.colors.text} />
          <Text style={[styles.footerText, { color: theme.colors.text }]}>{btn.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default FooterNavigation;

const styles = StyleSheet.create({
  footer: {
    height: 70, 
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});
