import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';
import { styles } from '../styles';

interface ConfirmButtonProps {
  buttonText: string;
  onPress: () => void;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ buttonText, onPress }) => {
  return (
    <View style={localStyles.container}>
      <AwesomeButton
        height={30} 
        width={null} 
        stretch 
        backgroundColor="#5ca7c465" 
        backgroundDarker="#87CEEB" 
        borderRadius={20} 
        raiseLevel={5} 
        onPress={onPress} 
      >
        <Text style={styles.buttonText2}>{buttonText}</Text>
      </AwesomeButton>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmButton;



