import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VerticalStack from './termsScreenAgree/fullContent/termsAgreeStyle1'; // Import VerticalStack
import { HEADER_HEIGHT, TOTAL_FOOTER_SPACE, CONTENT_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_HORIZONTAL, LAYOUT_MARGIN_VERTICAL } from '../assets/utils/dimensions';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const TermsAgreeScreen: React.FC = () => {
return (
  <View style={localStyles.container}>
    {/* Content Area */}
    <View style={localStyles.contentContainer}>
      <VerticalStack
        rowHeights={[1]} // Adjusted row heights
        rows={[
          // Second row: Display the results text
          {
            columnLayoutType: 'equal',
            items: [
              {
                  type: 'terms'
              },
            ],
          },
        ]}
      />
    </View>
  </View>
);
};

export default TermsAgreeScreen;

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
