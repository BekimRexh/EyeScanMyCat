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
        height={30} // Custom height
        width={null} // Full width
        stretch // Ensures the button fills its parent width
        backgroundColor="#5ca7c465" // Background color for the button
        backgroundDarker="#87CEEB" // Color for the 3D effect
        borderRadius={20} // Rounded corners
        raiseLevel={5} // 3D effect level
        onPress={onPress} // Pass the onPress function from props
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
    color: '#fff', // Customize text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmButton;


// import React from 'react';
// import { View, Text, StyleSheet, Pressable } from 'react-native';
// import { styles } from '../styles';

// interface ConfirmButtonProps {
//   buttonText: string;
//   onPress: () => void;
// }

// const ConfirmButton: React.FC<ConfirmButtonProps> = ({ buttonText, onPress }) => {
//   return (
//     <View style={localStyles.container}>
//       <Pressable
//         onPress={onPress}
//         style={({ pressed }) => [
//           localStyles.button,
//           {
//             backgroundColor: pressed ? '#87CEEB' : '#5ca7c465',
//           },
//         ]}
//       >
//         <Text style={[styles.buttonText2, localStyles.buttonText]}>{buttonText}</Text>
//       </Pressable>
//     </View>
//   );
// };

// const localStyles = StyleSheet.create({
//   container: {
//     marginTop: 10,
//     marginBottom: 10,
//     alignItems: 'center',
//     width: '100%',
//   },
//   button: {
//     height: 30, // Custom height
//     width: '100%', // Full width
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20, // Rounded corners
//     elevation: 5, // Mimics the "raiseLevel"
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ConfirmButton;
