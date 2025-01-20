import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VerticalStack from './resultsScreen/fullContent/resultsScreenStyle1'; 
import { HEADER_HEIGHT, TOTAL_FOOTER_SPACE, CONTENT_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_HORIZONTAL, LAYOUT_MARGIN_VERTICAL } from '../assets/utils/dimensions';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const ResultsScreen: React.FC = () => {
  const router = useRouter();
  const { croppedUri, result } = useLocalSearchParams();
  console.log(result)

  
const resultValue = Array.isArray(result) ? result[0] : result;




const getResultCategory = (result: number): string => {
if (result < 0.5) return 'Healthy';
if (result < 0.65) return 'Low Chance';
if (result < 0.8) return 'Moderate Chance';
return 'High Chance';
};

const resultCategory = getResultCategory(parseFloat(resultValue));

  return (
    <View style={localStyles.container}>
      {/* Content Area */}
      <View style={localStyles.contentContainer}>
        <VerticalStack
          rowHeights={[1, 1]} 
          rows={[
           
            {
              columnLayoutType: 'equal',
              items: [
                {
                  type: 'showStaticImage',
                  props: {
                    imageUrl: croppedUri,
                  },
                },
              ],
            },
            
            {
              columnLayoutType: 'equal',
              items: [
                {
                    type: 'resultsText',
                    props: {
                      result: resultCategory,
                      icon: (
                        <MaterialCommunityIcons
                          name="arrow-down-right"
                          size={36}
                          color="#5ca7c495"
                        />
                      ),
                      extraText: "Explore Further Here",
                      iconPosition: "right",
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

export default ResultsScreen;

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
