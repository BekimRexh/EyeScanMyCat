import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from '../header/header';
import Footer from '../footer/Footer';
import { useRouter } from 'expo-router';
import { HEADER_HEIGHT, TOTAL_FOOTER_SPACE, CONTENT_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_HORIZONTAL, LAYOUT_MARGIN_VERTICAL } from '../../../assets/utils/dimensions';

const VerticalStack: React.FC<{ 
  rows?: any[], 
  rowLayoutType?: 'equal' | 'topHeavy' | 'bottomHeavy' | 'middleHeavy', 
  columnLayoutType?: 'equal' | 'leftWide' | 'rightWide' 
}> = ({ rows = [], rowLayoutType = 'equal', columnLayoutType = 'equal' }) => {
  
  const rowCount = rows.length || 1; 
  const router = useRouter();
  const BASE_HEIGHT = CONTENT_HEIGHT / rowCount; 

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        items={[{ type: 'image', props: { source: require('../../../assets/images/eyeScanMyCatFullLogo.png') } }]} 
        layoutType="equal" 
      />

      {/* Main Content Area */}
      <View style={{ height: CONTENT_HEIGHT }}>
        {rows.map((rowItems, rowIndex) => {
          let rowHeight = BASE_HEIGHT;

        
          if (rowLayoutType === 'topHeavy' && rowIndex === 0) {
            rowHeight = ((rowCount + 0.6) / rowCount) * BASE_HEIGHT; 
          } else if (rowLayoutType === 'topHeavy' && rowIndex !== 0) {
            rowHeight = ((rowCount - 0.6) / rowCount) * BASE_HEIGHT; 
          } else if (rowLayoutType === 'bottomHeavy' && rowIndex === rowCount - 1) {
            rowHeight = ((rowCount + 0.6) / rowCount) * BASE_HEIGHT; 
          } else if (rowLayoutType === 'bottomHeavy' && rowIndex !== rowCount - 1) {
            rowHeight = ((rowCount - 0.6) / rowCount) * BASE_HEIGHT; 
          } else if (rowLayoutType === 'middleHeavy') {
            const middleIndex = Math.floor(rowCount / 2);
            if (rowIndex === middleIndex) {
              rowHeight = ((rowCount + 0.6) / rowCount) * BASE_HEIGHT; 
            } else {
              rowHeight = ((rowCount - 0.6) / rowCount) * BASE_HEIGHT; 
            }
          }

          return (
            <View key={rowIndex} style={{ height: rowHeight, justifyContent: 'center' }}>
              <View style={styles.rowContainer}>
                {rowItems.map((item, colIndex) => {
                  const columnCount = rowItems.length;
                  let columnWidth = CONTENT_WIDTH / columnCount; 

                  
                  if (columnLayoutType === 'leftWide' && colIndex === 0) {
                    columnWidth = ((columnCount + 0.6) / columnCount) * (CONTENT_WIDTH / columnCount); 
                  } else if (columnLayoutType === 'leftWide' && colIndex !== 0) {
                    columnWidth = ((columnCount - 0.6) / columnCount) * (CONTENT_WIDTH / columnCount); 
                  } else if (columnLayoutType === 'rightWide' && colIndex === columnCount - 1) {
                    columnWidth = ((columnCount + 0.6) / columnCount) * (CONTENT_WIDTH / columnCount); 
                  } else if (columnLayoutType === 'rightWide' && colIndex !== columnCount - 1) {
                    columnWidth = ((columnCount - 0.6) / columnCount) * (CONTENT_WIDTH / columnCount); 
                  }

                  return (
                    <View 
                      key={colIndex} 
                      style={{ width: columnWidth, justifyContent: 'center', alignItems: 'center' }}
                    >
                      {renderVerticalItem(item, rowHeight, columnWidth)}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <Footer 
        buttons={[
          { line1: 'Get Started', onPress: () => {try {
            router.push('/termsAgreeScreen');
          } catch (error) {
            console.error('Error navigating to Home:', error);
          }} },
         
        ]}
        layoutType="equal" 
      />
    </View>
  );
};

const renderVerticalItem = (item: any, rowHeight: number, columnWidth: number) => {
  const { type, props } = item;

  switch (type) {
    case 'view':
      return (
        <View 
          style={[{ 
            height: rowHeight * 1.09, 
            width: columnWidth * 1, 
            backgroundColor: 'transparent', 
            borderRadius: 10
          }, props.style]}
        >
          {props.children}
        </View>
      );
    case 'text':
      return (
        <Text style={[styles.text, { fontSize: rowHeight * 0.15 }, props.style]}>
          {props.text}
        </Text>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT_MARGIN_HORIZONTAL,
  },
  text: {
    fontFamily: 'Quicksand-Regular',
    color: '#2F4F4F',
    textAlign: 'center',
  },
});

export default VerticalStack;
