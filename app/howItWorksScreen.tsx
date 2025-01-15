import React from 'react';
import { StyleSheet, View } from 'react-native';
import VerticalStack from './howItWorksScreen/fullContent/howStyle1'; // Import VerticalStack
import SwipableStack from '../components/SwipableStack';

const HowScreen: React.FC = () => {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.contentContainer}>
        <VerticalStack
          rowHeights={[1]} // Adjusted row heights
          rows={[
            {
              columnLayoutType: 'equal',
              items: [
                {
                  type: 'view',
                  props: {
                    style: { alignItems: 'center', justifyContent: 'center' },
                    children: (
                      <SwipableStack
                        cards={[
                          
                          {
                            id: '1',
                            title: 'Interpreting Results',
                            subtitle: 'Understanding the Predictions',
                            text1: `The app provides a **prediction tool**, not a diagnosis. Consult the **"Learn More"** page for details from vets about what to watch for and what actions to take. Predictions may be affected by: **Other eye conditions** with similar symptoms, like redness or discharge.`,
                            text2: `Always consult a vet if the app predicts a **chance of conjunctivitis** or if symptoms persist.`,
                            imageUri: require('../assets/images/howImages/thinking.jpg'),
                            backgroundColor1: '#e3f2fd',
                            backgroundColor2: '#bbdefb',
                          }, 
                          {
                            id: '4',
                            title: 'Getting the Best Results',
                            subtitle: 'Tips for Accurate Detection',
                            text1: `For best results: Use **high-quality images**. Ensure your cat is **awake** and facing the camera. Avoid photos of **sleeping cats** or those winking after waking up. If detection fails, try retaking the photo or upload a clearer image from your gallery. **Note:** The app applies **strict detection criteria**.`,
                            text2: `Photos with cats that are **far away** or in **poor lighting** may not work. Use a **clear, well-lit image**, and try again if needed.`,
                            imageUri: require('../assets/images/howImages/squinting.jpg'),
                            backgroundColor1: '#e8f5e9',
                            backgroundColor2: '#c8e6c9',
                          }, 
                          {
                            id: '3',
                            title: 'What It Checks',
                            subtitle: 'Checking for Conjunctivitis',
                            text1: `The app is designed to look for signs of **conjunctivitis** by comparing your cat's face with examples of healthy cats and cats with different levels of conjunctivitis. It knows what to look for thanks to training on hundreds of cat photos.`,
                            text2: `The app is designed to predict **conjunctivitis only** and does not detect other eye conditions or problems.`,
                            imageUri: require('../assets/images/howImages/cropcat.jpg'),
                            backgroundColor1: '#f3e5f5',
                            backgroundColor2: '#d1c4e9',
                          },                                      
                          {
                            id: '2',
                            title: 'Finding Your Cat',
                            subtitle: 'Detecting Your Cat in Photos',
                            text1: `The app uses a smart **cat detection system** to figure out if your cat is in the photo. It has been trained on lots of photos of cats and non-cats to make sure it gets it right! Once your cat is found, the app zooms in and crops the photo to focus just on your cat's face.`,
                            text2: `The app was trained to find a cat's face using special examples called **bounding boxes** for better accuracy.`,
                            imageUri: require('../assets/images/howImages/ai.jpg'),
                            backgroundColor1: '#ffebd6',
                            backgroundColor2: '#ffe0cc',
                          },
                          
                        ]}
                      />
                    ),
                  },
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

export default HowScreen;

export const unstable_settings = {
  headerShown: false,
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
