import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from '../header/header';
import Footer from '../footer/Footer';
import { useRouter } from 'expo-router';
import { CameraView } from 'expo-camera';
import { GestureDetector } from 'react-native-gesture-handler';
import { Svg, Path } from 'react-native-svg';
import { HEADER_HEIGHT, TOTAL_FOOTER_SPACE, CONTENT_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_HORIZONTAL, LAYOUT_MARGIN_VERTICAL } from '../../../assets/utils/dimensions';
import IconThemedButton from '../../../components/buttons/IconThemedButton';
import HorizontalSlider from '../../../components/slider/HorizontalSlider';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';



const VerticalStack: React.FC<{ 
  rows?: any[], 
  rowLayoutType?: 'equal' | 'topHeavy' | 'bottomHeavy' | 'middleHeavy',
  rowHeights?: number[], 
  columnGap?: number, 
}> = ({ rows = [], rowLayoutType = 'equal', rowHeights = [], columnGap = -0.19 }) => {
  
  const availableHeight = CONTENT_HEIGHT; 
  const availableWidth = CONTENT_WIDTH;  
  const rowCount = rows.length || 1;

  
  const rowGapFraction = 0.02; 
  const desiredRowGap = availableHeight * rowGapFraction;
  const totalRowGapSpace = (rowCount - 1) * desiredRowGap;

  let calculatedRowHeights: number[];

  if (rowHeights.length === rowCount) {
   
    const totalCustomHeight = rowHeights.reduce((sum, ratio) => sum + ratio, 0);
    calculatedRowHeights = rowHeights.map(ratio => (ratio / totalCustomHeight) * (availableHeight - totalRowGapSpace));
  } else if (rowLayoutType === 'equal') {
    
    const totalRowHeight = availableHeight - totalRowGapSpace;
    const rowHeight = totalRowHeight / rowCount;
    calculatedRowHeights = Array(rowCount).fill(rowHeight);
  } else if (rowLayoutType === 'topHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const topRowHeight = adjustedHeight * 0.7; 
    const otherRowHeight = (adjustedHeight - topRowHeight) / (rowCount - 1);
    calculatedRowHeights = [topRowHeight, ...Array(rowCount - 1).fill(otherRowHeight)];
  } else if (rowLayoutType === 'bottomHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const bottomRowHeight = adjustedHeight * 0.7; 
    const otherRowHeight = (adjustedHeight - bottomRowHeight) / (rowCount - 1);
    calculatedRowHeights = [...Array(rowCount - 1).fill(otherRowHeight), bottomRowHeight];
  } else if (rowLayoutType === 'middleHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const middleRowHeight = adjustedHeight * 0.7; 
    const otherRowHeight = (adjustedHeight - middleRowHeight) / (rowCount - 1);
    const middleIndex = Math.floor(rowCount / 2);
    calculatedRowHeights = Array(rowCount)
      .fill(otherRowHeight)
      .map((height, index) => (index === middleIndex ? middleRowHeight : height));
  }
  

  return (
    <View style={styles.container}>
      
      <Header 
        items={[
          {
            type: 'iconButton',
            props: {
              name: 'rick',
              IconComponent: Entypo, 
              iconName: 'text-document',
              heightMultiplier: 0.18,
              widthMultiplier:0.17,
              borderRadiusMultiplier: 0.11,
              iconSizeMultiplier:0.9,
              onPress: () => router.push('/termsScreen'),
            },
          },
          { type: 'image', props: { source: require('../../../assets/images/eyeScanMyCatFullLogo.png') } },
          {
            type: 'iconButton',
            props: {
              name: 'rick',
              IconComponent: AntDesign, 
              iconName: 'questioncircleo',
              heightMultiplier: 0.18,
              widthMultiplier:0.17,
              borderRadiusMultiplier: 0.11,
              iconSizeMultiplier:0.9,

              onPress: () => router.push('/aboutScreen')
            },
          },
        ]} 
        layoutType="equal" 
      />

      
      <View style={{ height: CONTENT_HEIGHT }}>
        {rows.map((row, rowIndex) => {
          const rowHeight = calculatedRowHeights[rowIndex];
          const { items, columnLayoutType = 'equal' } = row;

          const columnCount = items.length || 1;

         
          const desiredColumnGap = availableWidth * columnGap;
          const totalColumnGapSpace = (columnCount - 1) * desiredColumnGap;

        
          const adjustedColumnWidth = availableWidth - totalColumnGapSpace;
          const columnWidths = Array(columnCount).fill(adjustedColumnWidth / columnCount);

          if (columnLayoutType === 'leftWide') {
            columnWidths[0] = adjustedColumnWidth * 0.6; 
            columnWidths.fill(adjustedColumnWidth * 0.4 / (columnCount - 1), 1);
          } else if (columnLayoutType === 'rightWide') {
            columnWidths[columnWidths.length - 1] = adjustedColumnWidth * 0.6; 
            columnWidths.fill(adjustedColumnWidth * 0.4 / (columnCount - 1), 0, columnWidths.length - 1);
          }

          return (
            <View 
              key={rowIndex} 
              style={[
                styles.rowContainer, 
                { height: rowHeight, marginBottom: rowIndex !== rowCount - 1 ? desiredRowGap : 0 } 
              ]}
            >
              {items.map((item, colIndex) => (
                <View 
                  key={colIndex} 
                  style={{
                    width: columnWidths[colIndex],
                    marginRight: colIndex !== columnCount - 1 ? desiredColumnGap : 0, 
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {renderVerticalItem(item, rowHeight, columnWidths[colIndex])}
                </View>
              ))}
            </View>
          );
        })}
      </View>


      
      <Footer 
        buttons={[
          { line1: 'Home', onPress: () => router.push('/HomeScreen') },
          { line1: 'How It', line2: 'Works', onPress: () => router.push('/howItWorksScreen') }
        ]}
        layoutType="leftWide" 
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
            height: rowHeight, 
            width: columnWidth, 
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

    case 'camera':
      return (
        
          <View style={styles.cameraContainer}>
            <GestureDetector gesture={props.tapGesture}>
              <CameraView
                ref={props.cameraRef}
                style={styles.camera}
                facing={props.facing}
                autofocus={props.isRefreshing ? 'off' : 'on'}
                zoom={props.zoom}
              >
                {props.focusSquare?.visible && (
                  <View 
                    style={[
                      styles.focusSquare, 
                      { top: props.focusSquare.y - 25, left: props.focusSquare.x - 25 }
                    ]}
                  />
                )}
              </CameraView>
            </GestureDetector>
         
        </View>
      );

        case 'cameraSVG': 
          return (
            <View
              style={[
                styles.cameraContainer,
                { height: rowHeight, width: columnWidth }, 
              ]}
            >
              <GestureDetector gesture={props.tapGesture}>
                <CameraView
                  ref={props.cameraRef}
                  style={styles.camera}
                  facing={props.facing}
                  autofocus={props.isRefreshing ? 'off' : 'on'}
                  zoom={props.zoom}
                >
                  {props.focusSquare?.visible && (
                    <View 
                      style={[
                        styles.focusSquare, 
                        { top: props.focusSquare.y - 25, left: props.focusSquare.x - 25 }
                      ]}
                    />
                  )}
                </CameraView>
              </GestureDetector>

                
                <View style={[styles.svgContainer]}>
                  <Svg
                  style={styles.svgOverlay}
                  viewBox="0 0 24 24"
                >
                  <Path
                    fill="transparent"
                    stroke="#9FC6D6" 
                    strokeWidth="0.15" 
                    d="M3.03675 2.49516C3.262 2.10996 3.7152 1.92062 4.14754 2.03109C5.97557 2.49817 7.55118 3.2517 9.03129 4.3653C9.96974 4.05942 10.9671 3.8947 12 3.8947C13.0328 3.8947 14.0302 4.05942 14.9687 4.3653C16.4488 3.2517 18.0244 2.49817 19.8524 2.03109C20.2848 1.92062 20.738 2.10996 20.9632 2.49516C21.6136 3.60735 21.682 4.84507 21.5423 5.95618C21.4242 6.89524 21.1479 7.81637 20.8761 8.60644C21.5951 10.0574 22 11.7048 22 13.4473C22 14.0796 21.9465 14.6779 21.8433 15.242L22.7737 15.0259C23.3117 14.9009 23.8491 15.2357 23.974 15.7737C24.099 16.3117 23.7642 16.8491 23.2262 16.974L21.0977 17.4685C20.7875 18.072 20.4027 18.6166 19.9517 19.1014L20.6281 19.7012C21.0414 20.0677 21.0793 20.6997 20.7129 21.1129C20.3465 21.5261 19.7144 21.5641 19.3012 21.1976L18.3886 20.3884C16.6081 21.5099 14.358 22 12 22C9.64192 22 7.39187 21.5099 5.61135 20.3884L4.69872 21.1977C4.2855 21.5641 3.65348 21.5261 3.28705 21.1129C2.92063 20.6997 2.95856 20.0677 3.37179 19.7012L4.04822 19.1014C3.59721 18.6166 3.21244 18.072 2.90229 17.4685L0.773707 16.974C0.235747 16.8491 -0.0990517 16.3117 0.0259144 15.7737C0.150881 15.2357 0.688289 14.9009 1.22625 15.0259L2.15669 15.242C2.05349 14.6779 1.99998 14.0796 1.99998 13.4473C1.99998 11.7048 2.40488 10.0574 3.12385 8.60644C2.85211 7.81637 2.57578 6.89524 2.45771 5.95618C2.318 4.84507 2.38635 3.60735 3.03675 2.49516Z"
                  />
                </Svg>
              </View>
            </View>
          );

      
      case 'iconButton':
        const buttonHeight = props.heightMultiplier ? rowHeight * props.heightMultiplier : rowHeight;
        const buttonWidth = props.widthMultiplier ? columnWidth * props.widthMultiplier : columnWidth;
      
        return (
          <IconThemedButton 
            {...props} 
            height={buttonHeight} 
            width={buttonWidth} 
          />
        );

    case 'zoomSlider':
      return (
        <View>
          <HorizontalSlider 
            {...props}
            width={columnWidth/1.5}   
          />
        </View>
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
    paddingBottom:LAYOUT_MARGIN_VERTICAL*5
  },
  text: {
    fontFamily: 'Quicksand-Regular',
    color: '#2F4F4F',
    textAlign: 'center',
  },
  cameraContainer: { 
    width: '100%', 
    height: '107%', 
    marginTop: -LAYOUT_MARGIN_VERTICAL*9,
    borderRadius: 40, 
    overflow: 'hidden', 
    borderWidth: 0, 
    borderColor: '#9FC6D6',
    backgroundColor: '#000000', 
    justifyContent: 'center', 
    alignItems: 'center',
    pointerEvents: 'auto', 
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  focusSquare: {
    position: 'absolute',
    
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  svgContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
    pointerEvents:"none"
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: CONTENT_WIDTH*-0.5,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents:"none"
  },
  boxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 50, 
    height: 50, 
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default VerticalStack;
