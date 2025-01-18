import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import Header from '../header/header';
import Footer from '../footer/Footer';
import { useRouter } from 'expo-router';
import { GestureDetector } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';

import { Svg, Path } from 'react-native-svg';
import {
  HEADER_HEIGHT,
  TOTAL_FOOTER_SPACE,
  CONTENT_HEIGHT,
  CONTENT_WIDTH,
  LAYOUT_MARGIN_HORIZONTAL,
  LAYOUT_MARGIN_VERTICAL,
} from '../../../assets/utils/dimensions';
import IconThemedButton from '../../../components/buttons/IconThemedButton';
import TextThemedButton from '../../../components/buttons/TextThemedButton';
import HorizontalSlider from '../../../components/slider/HorizontalSlider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useScanState } from '../../ScanStateContext';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

// ---------------------------------------------------------------------
// 1) Add these props so you can control "please wait" logic from above:
// ---------------------------------------------------------------------
interface VerticalStackProps {
  rows?: any[];
  rowLayoutType?: 'equal' | 'topHeavy' | 'bottomHeavy' | 'middleHeavy';
  rowHeights?: number[];
  columnGap?: number;

  // NEW PROPS
  isScanningInProgress?: boolean;   // Are we in the middle of scanning?
  desiredRoute?: string | null;     // Where do we want to navigate after scanning ends?
  setDesiredRoute?: (route: string) => void; // Function to set the route
}

const VerticalStack: React.FC<VerticalStackProps> = ({
  rows = [],
  rowLayoutType = 'equal',
  rowHeights = [],
  columnGap = 0.09,

  // NEW PROPS
  isScanningInProgress = false,
  desiredRoute = null,
  setDesiredRoute = () => {},
}) => {
  const router = useRouter();
  const { setScanState } = useScanState();

  // Keep the same row/column layout logic
  const availableHeight = CONTENT_HEIGHT * 1.02;
  const availableWidth = CONTENT_WIDTH;
  const rowCount = rows.length || 1;

  const rowGapFraction = 0.03;
  const desiredRowGap = availableHeight * rowGapFraction;
  const totalRowGapSpace = (rowCount - 1) * desiredRowGap;

  // ---------------------------------------------------------------------
  // 2) Local state to show a "Please Wait" overlay if user taps mid-scan
  // ---------------------------------------------------------------------
  const [showPleaseWait, setShowPleaseWait] = useState(false);

  let calculatedRowHeights: number[];

  if (rowHeights.length === rowCount) {
    const totalCustomHeight = rowHeights.reduce((sum, ratio) => sum + ratio, 0);
    calculatedRowHeights = rowHeights.map(
      (ratio) =>
        (ratio / totalCustomHeight) * (availableHeight - totalRowGapSpace)
    );
  } else if (rowLayoutType === 'equal') {
    const totalRowHeight = availableHeight - totalRowGapSpace;
    const rowHeight = totalRowHeight / rowCount;
    calculatedRowHeights = Array(rowCount).fill(rowHeight);
  } else if (rowLayoutType === 'topHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const topRowHeight = adjustedHeight * 0.7;
    const otherRowHeight = (adjustedHeight - topRowHeight) / (rowCount - 1);
    calculatedRowHeights = [
      topRowHeight,
      ...Array(rowCount - 1).fill(otherRowHeight),
    ];
  } else if (rowLayoutType === 'bottomHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const bottomRowHeight = adjustedHeight * 0.7;
    const otherRowHeight = (adjustedHeight - bottomRowHeight) / (rowCount - 1);
    calculatedRowHeights = [
      ...Array(rowCount - 1).fill(otherRowHeight),
      bottomRowHeight,
    ];
  } else if (rowLayoutType === 'middleHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const middleRowHeight = adjustedHeight * 0.7;
    const otherRowHeight = (adjustedHeight - middleRowHeight) / (rowCount - 1);
    const middleIndex = Math.floor(rowCount / 2);
    calculatedRowHeights = Array(rowCount)
      .fill(otherRowHeight)
      .map((height, index) => (index === middleIndex ? middleRowHeight : height));
  }

  // ---------------------------------------------------------------------
  // Footer button logic:
  // If scanning is in progress, we show "please wait" & set desiredRoute.
  // Otherwise, just navigate immediately.
  // ---------------------------------------------------------------------
  const handlePress = (destination: string) => {
    // 1) Turn off scanning, if you want
    setScanState({ someKey: false });

    // 2) If we are scanning, show the overlay and store the user’s desired route
    if (isScanningInProgress) {
      setShowPleaseWait(true);
      setDesiredRoute?.(destination);
    } else {
      // 3) If not scanning, just navigate right away
      router.push(destination);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
          {
            type: 'image',
            props: {
              source: require('../../../assets/images/eyeScanMyCatFullLogo.png'),
            },
          },
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
              onPress: () => router.push('/aboutScreen'),
            },
          },
        ]}
        layoutType="equal"
      />

      {/* Main Content */}
      <View style={{ height: CONTENT_HEIGHT }}>
        {rows.map((row, rowIndex) => {
          const rowHeight = calculatedRowHeights[rowIndex];
          const { items, columnLayoutType = 'equal' } = row;
          const columnCount = items.length || 1;

          const desiredColumnGap = availableWidth * columnGap;
          const totalColumnGapSpace = (columnCount - 1) * desiredColumnGap;
          const adjustedColumnWidth = availableWidth - totalColumnGapSpace;

          const columnWidths = Array(columnCount).fill(
            adjustedColumnWidth / columnCount
          );

          if (columnLayoutType === 'leftWide') {
            columnWidths[0] = adjustedColumnWidth * 0.6;
            columnWidths.fill(
              (adjustedColumnWidth * 0.4) / (columnCount - 1),
              1
            );
          } else if (columnLayoutType === 'rightWide') {
            columnWidths[columnWidths.length - 1] =
              adjustedColumnWidth * 0.6;
            columnWidths.fill(
              (adjustedColumnWidth * 0.4) / (columnCount - 1),
              0,
              columnWidths.length - 1
            );
          }

          return (
            <View
              key={rowIndex}
              style={[
                styles.rowContainer,
                {
                  height: rowHeight,
                  marginBottom:
                    rowIndex !== rowCount - 1 ? desiredRowGap : 0,
                },
              ]}
            >
              {items.map((item, colIndex) => (
                <View
                  key={colIndex}
                  style={{
                    width: columnWidths[colIndex],
                    marginRight:
                      colIndex !== columnCount - 1
                        ? desiredColumnGap
                        : 0,
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

      {/* Footer */}
      <Footer
        buttons={[
          {
            line1: 'Home',
            onPress: () => handlePress('/HomeScreen'),
          },
          {
            line1: 'Retake',
            line2: 'Photo',
            onPress: () => handlePress('/ScanScreenNew'),
          },
        ]}
        layoutType="leftWide"
      />

      {/* ---------------------------------------------------------------------
          "Please Wait" overlay if scanning not yet finished
         --------------------------------------------------------------------- */}
      {showPleaseWait && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayBackground} />
          <View style={styles.overlayContent}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.overlayText}>Please Wait...</Text>
          </View>
        </View>
      )}
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
        <Text style={[styles.text, { fontSize: rowHeight * 0.20 }, props.style]}>
          {props.text}
        </Text>
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

      case 'textButton':
        const textButtonHeight = props.heightMultiplier ? rowHeight * props.heightMultiplier : rowHeight;
        const textButtonWidth = props.widthMultiplier ? columnWidth * props.widthMultiplier : columnWidth;
  
        return (
          <View style={styles.confirmContainer}>
            <TextThemedButton
              {...props}
              height={textButtonHeight}
              width={textButtonWidth}
            />
          </View>
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

      case 'requirements':
  return (
    <View
      style={[
        styles.requirementsContainer,
        {
          height: rowHeight,
          padding: rowHeight * 0.1,
          width: columnWidth * 1.2, // Ensure it takes up most of the column width
        },
      ]}
    >
      <Text
        style={[
          styles.requirementText,
          {
            fontSize: rowHeight * 0.25,
            fontFamily: 'Quicksand-Bold',
            marginBottom: rowHeight * 0.05, // Add spacing after the header
          },
        ]}
      >
        For accurate results:
      </Text>
      <Text
        style={[
          styles.requirementText,
          {
            fontSize: rowHeight * 0.2,
            marginBottom: rowHeight * 0.08, // Add spacing between lines
          },
        ]}
      >
        • Ensure your cat is close to the camera.
      </Text>
      <Text
        style={[
          styles.requirementText,
          {
            fontSize: rowHeight * 0.2,
            marginBottom: rowHeight * 0.08, // Add spacing between lines

          },
        ]}
      >
        • Ensure your cat is facing the camera.
      </Text>
      <Text
        style={[
          styles.requirementText,
          {
            fontSize: rowHeight * 0.2,
            marginBottom: rowHeight * 0.08, // Add spacing between lines
          },
        ]}
      >
        • Ensure your cat's face is well-lit.
      </Text>
      <Text
        style={[
          styles.requirementText,
          {
            fontSize: rowHeight * 0.2,
          },
        ]}
      >
        • Avoid blurry images.
      </Text>
    </View>
  );


  // case 'showImage': {
  //   const adjustedHeight = CONTENT_HEIGHT/1.15; // Calculate new percentage

  //   const cameraContainerStyle = props.cameraContainer
  // ? {
  //     width: '100%',
  //     height: adjustedHeight,
  //     marginTop: -LAYOUT_MARGIN_VERTICAL * -7,
  //     borderRadius: 40,
  //     overflow: 'hidden',
  //     borderWidth: 0,
  //     borderColor: '#9FC6D6',
  //     backgroundColor: '#000000',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   }
  // : {
  //     width: '100%',
  //     height: '107%',
  //     marginTop: -LAYOUT_MARGIN_VERTICAL * 9,
  //     borderRadius: 40,
  //     overflow: 'hidden',
  //     borderWidth: 0,
  //     borderColor: '#9FC6D6',
  //     backgroundColor: '#000000',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   };

  //   const [cameraContainerDimensions, setCameraContainerDimensions] = useState({
  //     width: 0,
  //     height: 0,
  //     x: 0,
  //     y: 0,
  //   });
  
  //   const [imageDimensions, setImageDimensions] = useState({
  //     width: 0,
  //     height: 0,
  //   });
  
  //   const horizontalScanPosition = useSharedValue(0);
  //   const verticalScanPosition = useSharedValue(0);
  
  //   const horizontalAnimatedStyle = useAnimatedStyle(() => ({
  //     transform: [{ translateX: horizontalScanPosition.value }],
  //   }));
  
  //   const verticalAnimatedStyle = useAnimatedStyle(() => ({
  //     transform: [{ translateY: verticalScanPosition.value }],
  //   }));
  
  //   const animatedX = useSharedValue(0);
  //   const animatedY = useSharedValue(0);
  //   const animatedWidth = useSharedValue(cameraContainerDimensions.width);
  //   const animatedHeight = useSharedValue(cameraContainerDimensions.height);

    
  
  //   const animatedStyle = useAnimatedStyle(() => ({
  //     left: animatedX.value,
  //     top: animatedY.value,
  //     width: animatedWidth.value,
  //     height: animatedHeight.value,
  //   }));
  
  //   useEffect(() => {
  //     if (props.imageUrl) {
  //       Image.getSize(props.imageUrl, (width, height) => {
  //         setImageDimensions({ width, height });
  //       });
  //     }
  //   }, [props.imageUrl]);
  
  //   useEffect(() => {
  //     if (props.showHorizontalAnimation) {
  //       horizontalScanPosition.value = withRepeat(
  //         withTiming(cameraContainerDimensions.width - 15, { duration: 4000 }),
  //         -1,
  //         true
  //       );
  //     } else {
  //       horizontalScanPosition.value = 0;
  //     }
  
  //     if (props.showVerticalAnimation) {
  //       verticalScanPosition.value = withRepeat(
  //         withTiming(cameraContainerDimensions.height - 15, { duration: 4000 }),
  //         -1,
  //         true
  //       );
  //     } else {
  //       verticalScanPosition.value = 0;
  //     }
  //   }, [
  //     props.showHorizontalAnimation,
  //     props.showVerticalAnimation,
  //     cameraContainerDimensions,
  //   ]);
  
  //   useEffect(() => {
  //     if (props.showBoundingBoxAnimation && props.boundingBox) {
  //       const aspectRatioImage = imageDimensions.width / imageDimensions.height;
  //       const aspectRatioContainer =
  //         cameraContainerDimensions.width / cameraContainerDimensions.height;
  
  //       let scaleFactorX = 1;
  //       let scaleFactorY = 1;
  //       let offsetX = 0;
  //       let offsetY = 0;
  
  //       if (aspectRatioImage > aspectRatioContainer) {
  //         // Image is wider than the container
  //         scaleFactorX = cameraContainerDimensions.height / imageDimensions.height;
  //         scaleFactorY = scaleFactorX;
  //         offsetX =
  //           (cameraContainerDimensions.width -
  //             imageDimensions.width * scaleFactorX) /
  //           2;
  //       } else {
  //         // Image is taller than the container
  //         scaleFactorY = cameraContainerDimensions.width / imageDimensions.width;
  //         scaleFactorX = scaleFactorY;
  //         offsetY =
  //           (cameraContainerDimensions.height -
  //             imageDimensions.height * scaleFactorY) /
  //           2;
  //       }
  
  //       const targetBox = {
  //         x: offsetX + props.boundingBox.x * scaleFactorX,
  //         y: offsetY + props.boundingBox.y * scaleFactorY,
  //         width: props.boundingBox.width * scaleFactorX,
  //         height: props.boundingBox.height * scaleFactorY,

  //         // Clamp to ensure bounding box is within the container
          
  //       };
  
  //       // Animate the bounding box
  //       animatedX.value = withTiming(targetBox.x, { duration: 2000 });
  //       animatedY.value = withTiming(targetBox.y, { duration: 2000 });
  //       animatedWidth.value = withTiming(targetBox.width, { duration: 2000 });
  //       animatedHeight.value = withTiming(targetBox.height, { duration: 2000 });
        
  //       console.log('Image Dimensions (Original):', imageDimensions);
  //       console.log('Container Dimensions:', cameraContainerDimensions);
  //       console.log('Aspect Ratios - Image:', aspectRatioImage, 'Container:', aspectRatioContainer);
  //       console.log('Scaling Factors:', { scaleFactorX, scaleFactorY });
  //       console.log('Offsets:', { offsetX, offsetY });
  //       console.log('Bounding Box (Original):', props.boundingBox);
  //       console.log('Bounding Box (Mapped to Screen):', targetBox);

  //     }
  //   }, [
  //     props.showBoundingBoxAnimation,
  //     props.boundingBox,
  //     imageDimensions,
  //     cameraContainerDimensions,
  //   ]);
  
  //   return (
  //     <View
  //       style={[styles.cameraContainer, cameraContainerStyle as ViewStyle]}
  //       onLayout={(event) => {
  //         const { width, height, x, y } = event.nativeEvent.layout;
  //         setCameraContainerDimensions({ width, height, x, y });
  //       }}
  //     >
  //       {props.croppedUri ? (
  //       <>
  //         {/* Enlarged blurred background */}
  //         <Image
  //           source={{ uri: props.croppedUri }}
  //           style={styles.enlargedBlurredBackground}
  //           blurRadius={4}
  //         />
  //         {/* Cropped image with resizeMode: contain */}
  //         <Image source={{ uri: props.croppedUri }} style={styles.croppedCamera} />
  //       </>
  //     ) : props.imageUrl ? (
  //         <>
  //           <Image source={{ uri: props.imageUrl }} style={styles.camera} />
  //           {props.showHorizontalAnimation && (
  //             <Animated.View
  //               style={[styles.horizontalScanBar, horizontalAnimatedStyle]}
  //             />
  //           )}
  //           {props.showVerticalAnimation && (
  //             <Animated.View
  //               style={[styles.verticalScanBar, verticalAnimatedStyle]}
  //             />
  //           )}
  //           {props.showBoundingBoxAnimation && (
  //             <Animated.View
  //               style={[
  //                 animatedStyle,
  //                 {
  //                   position: 'absolute',
  //                   borderColor: '#F4F3F3',
  //                   borderWidth: 2,
  //                   borderRadius: 10, // Add rounded corners
  //                 },
  //               ]}
  //             />
  //           )}
  //         </>
  //       ) : (
  //         <Text style={{ color: '#F4F3F3', textAlign: 'center' }}>No image provided</Text>
  //       )}
  //     </View>
  //   );
  // }
  
  case 'showImage': {
    const shouldReduceMotion = useReducedMotion(); // Detect if reduced motion is preferred
  
    const adjustedHeight = CONTENT_HEIGHT / 1.15; // Calculate new percentage
  
    const cameraContainerStyle = props.cameraContainer
      ? {
          width: '100%',
          height: adjustedHeight,
          marginTop: -LAYOUT_MARGIN_VERTICAL * -7,
          borderRadius: 40,
          overflow: 'hidden',
          borderWidth: 0,
          borderColor: '#9FC6D6',
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
        }
      : {
          width: '100%',
          height: '107%',
          marginTop: -LAYOUT_MARGIN_VERTICAL * 9,
          borderRadius: 40,
          overflow: 'hidden',
          borderWidth: 0,
          borderColor: '#9FC6D6',
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
        };
  
    const [cameraContainerDimensions, setCameraContainerDimensions] = useState({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    });
  
    const [imageDimensions, setImageDimensions] = useState({
      width: 0,
      height: 0,
    });
  
    const horizontalScanPosition = useSharedValue(0);
    const verticalScanPosition = useSharedValue(0);
  
    const horizontalAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: horizontalScanPosition.value }],
    }));
  
    const verticalAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: verticalScanPosition.value }],
    }));
  
    useEffect(() => {
      if (props.imageUrl) {
        Image.getSize(props.imageUrl, (width, height) => {
          setImageDimensions({ width, height });
        });
      }
    }, [props.imageUrl]);
  
    useEffect(() => {
      if (shouldReduceMotion) {
        horizontalScanPosition.value = 0;
        verticalScanPosition.value = 0;
        return;
      }
  
      if (props.showHorizontalAnimation) {
        horizontalScanPosition.value = withRepeat(
          withTiming(cameraContainerDimensions.width - 15, { duration: 4000 }),
          -1,
          true
        );
      } else {
        horizontalScanPosition.value = 0;
      }
  
      if (props.showVerticalAnimation) {
        verticalScanPosition.value = withRepeat(
          withTiming(cameraContainerDimensions.height - 15, { duration: 4000 }),
          -1,
          true
        );
      } else {
        verticalScanPosition.value = 0;
      }
    }, [
      props.showHorizontalAnimation,
      props.showVerticalAnimation,
      cameraContainerDimensions,
      shouldReduceMotion,
      horizontalScanPosition,
      verticalScanPosition,
    ]);
  
    return (
      <View
        style={[styles.cameraContainer, cameraContainerStyle as ViewStyle]}
        onLayout={(event) => {
          const { width, height, x, y } = event.nativeEvent.layout;
          setCameraContainerDimensions({ width, height, x, y });
        }}
      >
        {props.croppedUri ? (
          <>
            {/* Enlarged blurred background */}
            <Image
              source={{ uri: props.croppedUri }}
              style={styles.enlargedBlurredBackground}
              blurRadius={4}
            />
            {/* Cropped image with resizeMode: contain */}
            <Image source={{ uri: props.croppedUri }} style={styles.croppedCamera} />
          </>
        ) : props.imageUrl ? (
          <>
            <Image source={{ uri: props.imageUrl }} style={styles.camera} />
            {!shouldReduceMotion && props.showHorizontalAnimation && (
              <Animated.View style={[styles.horizontalScanBar, horizontalAnimatedStyle]} />
            )}
            {!shouldReduceMotion && props.showVerticalAnimation && (
              <Animated.View style={[styles.verticalScanBar, verticalAnimatedStyle]} />
            )}
          </>
        ) : (
          <Text style={{ color: '#F4F3F3', textAlign: 'center' }}>
            No image provided
          </Text>
        )}
      </View>
    );
  }
  
  


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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:CONTENT_HEIGHT*0.01
    
  },
  cameraContainer: { 
    width: '100%', 
    height: '107%', 
    marginTop: -LAYOUT_MARGIN_VERTICAL*9,
    borderRadius: 40, 
    overflow: 'hidden', 
    borderWidth: 4, 
    borderColor: '#9FC6D6',
    backgroundColor: '#000000', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // resizeMode:"contain"
  },
  croppedCamera:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    resizeMode:"contain"
  },
  enlargedBlurredBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    zIndex: -1, // Ensures it stays behind the cropped image
  },
  focusSquare: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  svgContainer: {
    flex: 1, // Allow the SVG to scale dynamically
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure it renders above the camera feed
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: -160,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // Prevent the SVG from blocking touch events
  },
  requirementsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: LAYOUT_MARGIN_HORIZONTAL, // Dynamically adjust padding
    marginBottom: LAYOUT_MARGIN_VERTICAL*-0.2
  },
  requirementText: {
    textAlign: 'center',
    color: '#2F4F4F',
    fontFamily: 'Quicksand-Regular',
  },
  confirmContainer: {
    marginTop: CONTENT_HEIGHT*0.031,
  },
  horizontalScanBar: {
    position: 'absolute',
    top:0, // Starts at the top of the container
    left:0,
    right:15,
    height: '100%', // Full height of the container
    backgroundColor: '#F4F3F3', // Customize the color
    width: 5,
    zIndex: 2,
  },
  
  verticalScanBar: {
    position: 'absolute',
    top:0,
    left: 0, // Starts at the left of the container
    width: '100%', // Full width of the container
    backgroundColor: '#F4F3F3', // Customize the color
    height: 5,
    zIndex: 2,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayContent: {
    padding: 20,
    backgroundColor: '#333333',
    borderRadius: 10,
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  
  
  
});

export default VerticalStack;
