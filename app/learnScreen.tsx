import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VerticalStack from './learnScreen/fullContent/learnScreenStyle1'; // Import VerticalStack
import { HEADER_HEIGHT, TOTAL_FOOTER_SPACE, CONTENT_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_HORIZONTAL, LAYOUT_MARGIN_VERTICAL } from '../assets/utils/dimensions';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SwipableStack from '../components/SwipableStack';

const LearnScreen: React.FC = () => {
  const router = useRouter();


  return (
    <View style={localStyles.container}>
      {/* Content Area */}
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
                              title: 'Eye Concerns', // Same character length as 'Caring for Eyes'
                              subtitle: 'Tips for Concerns',
                              text1: `With a **low/moderate chance of conjunctivitis**, your cat's eyes may need attention. **Watch for tearing, squinting, or slight crustiness.** Gently clean around their eyes with a cotton ball dipped in **cooled** boiled water and monitor for excessive pawing, tearing, redness, or swelling over the next few days.`,
                              text2: `**Vet follow-up:** If you notice any changes and symptoms worsen, schedule a vet visit to rule out infection or irritation.`,
                              imageUri: require('../assets/images/cats/petowner.jpg'),
                              backgroundColor1: '#ffebd6', // Soft peach
                              backgroundColor2: '#ffe0cc', // Light coral
                              youtubeLink: 'https://www.youtube.com/watch?v=ONp64XkZAQs'
                            },
                            {
                              id: '2',
                              title: 'Severe Cases', // Same character length as 'Caring for Eyes'
                              subtitle: 'When to Seek Immediate Help',
                              text1: `Persistent redness, cloudiness, or **heavy discharge** may signal serious issues like **infections**, corneal ulcers, or glaucoma, which could lead to vision loss if untreated. With a **high chance of conjunctivitis**, consult your vet immediately.`,
                              text2: `**Products to expect:** Your vet might recommend artificial tears, antibiotic drops; topical antiviral drugs may also be used.`,
                              imageUri: require('../assets/images/cats/vet.jpg'),
                              backgroundColor1: '#f3e5f5', // Soft lavender
                              backgroundColor2: '#d1c4e9', // Light violet
                              youtubeLink: 'https://www.youtube.com/watch?v=CHv77mw-iP0'
                            },
                            {
                              id: '3',
                              title: 'Other Issues', // Same character length as 'Caring for Eyes'
                              subtitle: 'Conditions To Know',
                              text1: `Not all eye conditions are the same. **Uveitis** often causes light sensitivity and squinting, while **cataracts** lead to cloudiness in the eye. **Glaucoma** may cause a swollen appearance or visible pain. **Early identification** is key to preventing further complications.`,
                              text2: `**Compare symptoms:** Signs like redness or discharge may resemble conjunctivitis but could indicate other conditions.`,
                              imageUri: require('../assets/images/cats/lowConjunct.jpg'),
                              backgroundColor1: '#e8f5e9', // Light mint green
                              backgroundColor2: '#c8e6c9', // Soft pale green
                              youtubeLink: 'https://www.youtube.com/watch?v=QFWBprLYA8s'
                            },
                            {
                              id: '4',
                              title: 'Caring for Eyes', // Finished and not touched
                              subtitle: 'An Owner\'s Guide',
                              text1: `Make it a habit to check your cat's eyes regularly. **Check weekly:** Look for clean, bright eyes with equal-sized pupils. Ensure the outer area is white, and the iris is evenly colored. **Clean if needed:** Use a cotton wool ball dipped in **cooled** boiled water to gently clean the inner corners of their eyes while their eyes are closed.`,
                              text2: `**Look out for:** Excessive discharge, cloudiness, redness, or pawing at the eyes. If you notice these, consult your vet.`,
                              imageUri: require('../assets/images/cats/discharge.jpg'),
                              backgroundColor1: '#e3f2fd', // Light baby blue
                              backgroundColor2: '#bbdefb', // Soft sky blue
                              youtubeLink: 'https://www.youtube.com/watch?v=BZ110Pa4PFU&t=2s'
                            },                          
                          ]}
                        />
                      )
                    }
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

export default LearnScreen;

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
