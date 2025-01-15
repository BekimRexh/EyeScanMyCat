import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ViewStyle, ScrollView  } from 'react-native';
import Header from '../header/header';
import Footer from '../footer/Footer';
import { useRouter, router } from 'expo-router';
import { GestureDetector } from 'react-native-gesture-handler';
import { Svg, Path } from 'react-native-svg';
import { HEADER_HEIGHT, TOTAL_FOOTER_SPACE, CONTENT_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_HORIZONTAL, LAYOUT_MARGIN_VERTICAL } from '../../../assets/utils/dimensions';
import IconThemedButton from '../../../components/buttons/IconThemedButton';
import TextThemedButton from '../../../components/buttons/TextThemedButton';
import HorizontalSlider from '../../../components/slider/HorizontalSlider';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';



const VerticalStack: React.FC<{ 
  rows?: any[], 
  rowLayoutType?: 'equal' | 'topHeavy' | 'bottomHeavy' | 'middleHeavy',
  rowHeights?: number[], // New prop for custom row heights
  columnGap?: number, 
}> = ({ rows = [], rowLayoutType = 'equal', rowHeights = [], columnGap = 0.09 }) => {
  
  const availableHeight = CONTENT_HEIGHT*1.02; // Total available height for rows
  const availableWidth = CONTENT_WIDTH;  // Total available width for columns
  const rowCount = rows.length || 1;

  // Fractional gap for rows
  const rowGapFraction = -0.02; 
  const desiredRowGap = availableHeight * rowGapFraction;
  const totalRowGapSpace = (rowCount - 1) * desiredRowGap;

  let calculatedRowHeights: number[];

  if (rowHeights.length === rowCount) {
    // Use provided rowHeights if they match the row count
    const totalCustomHeight = rowHeights.reduce((sum, ratio) => sum + ratio, 0);
    calculatedRowHeights = rowHeights.map(ratio => (ratio / totalCustomHeight) * (availableHeight - totalRowGapSpace));
  } else if (rowLayoutType === 'equal') {
    // Default to equal heights
    const totalRowHeight = availableHeight - totalRowGapSpace;
    const rowHeight = totalRowHeight / rowCount;
    calculatedRowHeights = Array(rowCount).fill(rowHeight);
  } else if (rowLayoutType === 'topHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const topRowHeight = adjustedHeight * 0.7; // 80% for the top row
    const otherRowHeight = (adjustedHeight - topRowHeight) / (rowCount - 1);
    calculatedRowHeights = [topRowHeight, ...Array(rowCount - 1).fill(otherRowHeight)];
  } else if (rowLayoutType === 'bottomHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const bottomRowHeight = adjustedHeight * 0.7; // 80% for the bottom row
    const otherRowHeight = (adjustedHeight - bottomRowHeight) / (rowCount - 1);
    calculatedRowHeights = [...Array(rowCount - 1).fill(otherRowHeight), bottomRowHeight];
  } else if (rowLayoutType === 'middleHeavy') {
    const adjustedHeight = availableHeight - totalRowGapSpace;
    const middleRowHeight = adjustedHeight * 0.7; // 80% for the middle row
    const otherRowHeight = (adjustedHeight - middleRowHeight) / (rowCount - 1);
    const middleIndex = Math.floor(rowCount / 2);
    calculatedRowHeights = Array(rowCount)
      .fill(otherRowHeight)
      .map((height, index) => (index === middleIndex ? middleRowHeight : height));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        items={[
          {
            type: 'iconButton',
            props: {
              name: 'rick',
              IconComponent: Entypo, // Replace with your icon library
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
              IconComponent: AntDesign, // Replace with your icon library
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

      {/* Main Content Area */}
      <View style={{ height: CONTENT_HEIGHT }}>
        {rows.map((row, rowIndex) => {
          const rowHeight = calculatedRowHeights[rowIndex];
          const { items, columnLayoutType = 'equal' } = row;

          const columnCount = items.length || 1;

          // Column gap calculation
          const desiredColumnGap = availableWidth * columnGap;
          const totalColumnGapSpace = (columnCount - 1) * desiredColumnGap;

          // Adjusted width for columns
          const adjustedColumnWidth = availableWidth - totalColumnGapSpace;
          const columnWidths = Array(columnCount).fill(adjustedColumnWidth / columnCount);

          if (columnLayoutType === 'leftWide') {
            columnWidths[0] = adjustedColumnWidth * 0.6; // Wide column
            columnWidths.fill(adjustedColumnWidth * 0.4 / (columnCount - 1), 1);
          } else if (columnLayoutType === 'rightWide') {
            columnWidths[columnWidths.length - 1] = adjustedColumnWidth * 0.6; // Wide column
            columnWidths.fill(adjustedColumnWidth * 0.4 / (columnCount - 1), 0, columnWidths.length - 1);
          }

          return (
            <View 
              key={rowIndex} 
              style={[
                styles.rowContainer, 
                { height: rowHeight, marginBottom: rowIndex !== rowCount - 1 ? desiredRowGap : 0 } // Row gaps
              ]}
            >
              {items.map((item, colIndex) => (
                <View 
                  key={colIndex} 
                  style={{
                    width: columnWidths[colIndex],
                    marginRight: colIndex !== columnCount - 1 ? desiredColumnGap : 0, // Column gaps
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
          { line1: 'Home', onPress: () => router.push('/HomeScreen') },
          { line1: 'Scan', line2: 'Now', onPress: () => router.push('/ScanScreenNew') }
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

      case 'text': {
        const { textLine1, textLine2, icon, iconPosition = 'left', style, iconStyle } = props;
      
        return (
          <View style={[styles.textContainer, style]}>
            {icon && iconPosition === 'left' && (
              <View style={[styles.iconContainer, iconStyle]}>{icon}</View>
            )}
            <View style={styles.textContent}>
              <Text style={[styles.text, { fontSize: rowHeight * 0.2 }]}>
                {textLine1}
              </Text>
              {textLine2 && (
                <Text style={[styles.text, { fontSize: rowHeight * 0.2 }]}>
                  {textLine2}
                </Text>
              )}
            </View>
            {icon && iconPosition === 'right' && (
              <View style={[styles.iconContainer, iconStyle]}>{icon}</View>
            )}
          </View>
        );
      }
      

      case 'resultsText': {
        const resultDescriptions: { [key: string]: string } = {
          Healthy:
            "Your cat appears healthy, showing no visible signs of conjunctivitis. Their eyes look clear, normal, and free from redness, tearing, or crustiness. Visit the 'Learn More' page for tips on maintaining their eye health.",
          "Low Chance":
            "Your cat shows mild signs of conjunctivitis, such as slight redness or tearing. These signs may result from winking, sleeping, or being far from the camera. Retake the photo or monitor your cat closely for changes.",
          "Moderate Chance":
            "Your cat displays noticeable signs of conjunctivitis, including redness, tearing, or crustiness around the eye. These symptoms are less likely to be a mistake, so consulting a vet for advice is strongly recommended.",
          "High Chance":
            "Your cat shows strong signs of conjunctivitis, including squinting, visible redness, or significant tearing. These symptoms are unlikely due to camera factors and may indicate another eye condition. Seek veterinary care immediately for a thorough diagnosis.",
        };
      
        const { result, icon, style, iconStyle, extraText, iconPosition = 'left' } = props;
      
        const description = resultDescriptions[result] || "No result available.";
      
        return (
          <View style={[styles.resultsTextContainer, style]}>
            {/* Main result and description */}
            <Text style={styles.resultsTextTitle}>
              Conjunctivitis Result: <Text style={styles.resultsTextResult}>{result}</Text>
            </Text>
            <Text style={styles.resultsTextDescription}>{description}</Text>
        
            {/* Icon and extra text with overlapping icon */}
            {icon || extraText ? (
              <View style={styles.iconTextContainer}>
                {icon && (
                  <View
                    style={[
                      styles.iconContainer,
                      iconStyle,
                      iconPosition === 'right' && styles.iconRight,
                      iconPosition === 'left' && styles.iconLeft,
                    ]}
                  >
                    {icon}
                  </View>
                )}
                {extraText && (
                  <View style={styles.extraTextContainer}>
                    <FontAwesome name="paw" size={CONTENT_HEIGHT*0.07} color="#9FC6D6" />
                    <Text style={styles.extraText}>{extraText}</Text>
                  </View>
                )}
              </View>
            ) : null}
          </View>
        );
      }        
      

      case 'aboutMe': {
        const [scrollIndicatorTop, setScrollIndicatorTop] = useState(0);
      
        return (
          <View style={styles.resultsTextContainer}>
            <Text style={styles.resultsTextTitle}>About the Creator</Text>
      
            <View style={styles.scrollContainer}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false} // Hide native scrollbar
                onScroll={(event) => {
                  const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
                  const scrollHeight = contentSize.height - layoutMeasurement.height;
                
                  if (scrollHeight > 0) {
                    // Calculate the scroll position as a percentage
                    const scrollPosition = contentOffset.y / scrollHeight;
                
                    // Calculate the max scrollbar position based on the proportion of visible height
                    const scrollBarHeight = CONTENT_HEIGHT * 0.2; // Height of the custom scrollbar
                    const maxIndicatorTop = layoutMeasurement.height - scrollBarHeight;
                
                    // Ensure the scrollbar position stays within bounds
                    setScrollIndicatorTop(
                      Math.min(Math.max(scrollPosition * maxIndicatorTop, 0), maxIndicatorTop)
                    );
                  }
                }}
                
                scrollEventThrottle={16} // Ensures smooth tracking
              >
                <Text style={styles.resultsTextDescription}>
                  Hi, I’m Bekim Rexhepi, this app was inspired by my little Devon Rex boy, Alfie. He is so wonderful and mischievous but often struggles with conjunctivitis due to his underlying calicivirus and herpesvirus. Watching him go through flare-ups has been tough, but it’s also what motivated me to create something that could help other pet parents like me.
                </Text>
                <Image
                  source={require('../../../assets/images/cats/alfie.jpg')}
                  style={styles.imageStyle}
                />
                <Text style={styles.resultsTextDescription}>
                  Conjunctivitis is surprisingly common in cats and, if not caught early, can lead to serious problems like vision loss. I know firsthand how challenging it can be to get veterinary care or get the right advice, whether it’s due to high costs, living in a rural area, or the stress of taking your furry companion to the clinic. This app is not just a tool but also my master’s project for Bath University, aimed at empowering pet parents with an easy-to-use solution for detecting and understanding eye conditions right from home.
                </Text>
                <Text style={styles.resultsTextDescription}>
                </Text>
                <Text style={styles.resultsTextDescription}>
                  Alfie has been my biggest inspiration for this project, and my hope is that it helps other pets and their loving owners feel supported and reassured. After all, our furry friends deserve the best care we can give them!
                </Text>
              </ScrollView>
              {/* Custom Scroll Indicator */}
              <View style={[styles.scrollIndicator, { top: scrollIndicatorTop }]} />
            </View>
          </View>
        );
      }
      
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
          <TextThemedButton
            {...props}
            height={textButtonHeight}
            width={textButtonWidth}
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

      case 'showImage': {
        const cameraContainerStyle = props.cameraContainer
      ? {
          width: '100%',
          height: '125%',
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
      
        const animatedX = useSharedValue(0);
        const animatedY = useSharedValue(0);
        const animatedWidth = useSharedValue(cameraContainerDimensions.width);
        const animatedHeight = useSharedValue(cameraContainerDimensions.height);
      
        const animatedStyle = useAnimatedStyle(() => ({
          left: animatedX.value,
          top: animatedY.value,
          width: animatedWidth.value,
          height: animatedHeight.value,
        }));
      
        useEffect(() => {
          if (props.imageUrl) {
            Image.getSize(props.imageUrl, (width, height) => {
              setImageDimensions({ width, height });
            });
          }
        }, [props.imageUrl]);
      
        useEffect(() => {
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
        ]);
      
        useEffect(() => {
          if (props.showBoundingBoxAnimation && props.boundingBox) {
            const aspectRatioImage = imageDimensions.width / imageDimensions.height;
            const aspectRatioContainer =
              cameraContainerDimensions.width / cameraContainerDimensions.height;
      
            let scaleFactorX = 1;
            let scaleFactorY = 1;
            let offsetX = 0;
            let offsetY = 0;
      
            if (aspectRatioImage > aspectRatioContainer) {
              // Image is wider than the container
              scaleFactorX = cameraContainerDimensions.height / imageDimensions.height;
              scaleFactorY = scaleFactorX;
              offsetX =
                (cameraContainerDimensions.width -
                  imageDimensions.width * scaleFactorX) /
                2;
            } else {
              // Image is taller than the container
              scaleFactorY = cameraContainerDimensions.width / imageDimensions.width;
              scaleFactorX = scaleFactorY;
              offsetY =
                (cameraContainerDimensions.height -
                  imageDimensions.height * scaleFactorY) /
                2;
            }
      
            const targetBox = {
              x: offsetX + props.boundingBox.x * scaleFactorX,
              y: offsetY + props.boundingBox.y * scaleFactorY,
              width: props.boundingBox.width * scaleFactorX,
              height: props.boundingBox.height * scaleFactorY,
            };
      
            // Animate the bounding box
            animatedX.value = withTiming(targetBox.x, { duration: 2000 });
            animatedY.value = withTiming(targetBox.y, { duration: 2000 });
            animatedWidth.value = withTiming(targetBox.width, { duration: 2000 });
            animatedHeight.value = withTiming(targetBox.height, { duration: 2000 });
          }
        }, [
          props.showBoundingBoxAnimation,
          props.boundingBox,
          imageDimensions,
          cameraContainerDimensions,
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
                {props.showHorizontalAnimation && (
                  <Animated.View
                    style={[styles.horizontalScanBar, horizontalAnimatedStyle]}
                  />
                )}
                {props.showVerticalAnimation && (
                  <Animated.View
                    style={[styles.verticalScanBar, verticalAnimatedStyle]}
                  />
                )}
                {props.showBoundingBoxAnimation && (
                  <Animated.View
                    style={[
                      animatedStyle,
                      {
                        position: 'absolute',
                        borderColor: '#F4F3F3',
                        borderWidth: 2,
                        borderRadius: 10, // Add rounded corners
                      },
                    ]}
                  />
                )}
              </>
            ) : (
              <Text style={{ color: '#F4F3F3', textAlign: 'center' }}>No image provided</Text>
            )}
          </View>
        );
      }
    
      case 'showStaticImage': {
        return (
          <View style={styles.cameraContainer}>
            {props.imageUrl ? (
              <>
                {/* Enlarged blurred background */}
                <Image
                  source={{ uri: props.imageUrl }}
                  style={styles.enlargedBlurredBackground}
                  blurRadius={10} // Higher blur radius for better effect
                />
                {/* Static image overlay */}
                <Image
                  source={{ uri: props.imageUrl }}
                  style={styles.croppedCamera}
                  resizeMode="contain" // Ensure the image is contained within bounds
                />
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
    // paddingVertical:CONTENT_HEIGHT*0.01
    
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: CONTENT_HEIGHT*-0.01,
    position: 'relative', // Ensure the icon is positioned relative to this container
  },
  iconContainer: {
    position: 'absolute',
    bottom: CONTENT_HEIGHT*-0.034, // Adjust to overlap the container's bottom border
    transform: [
      { translateX: CONTENT_WIDTH*-0.06 }, // Adjust for icon width
      { scaleY: CONTENT_HEIGHT*0.0033 }, // Stretch the icon vertically
    ],
  },
  
  iconLeft: {
    left: '10%',
  },
  iconRight: {
    left: '90%',
  },
  extraTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: CONTENT_WIDTH*0.07,
    paddingTop:CONTENT_HEIGHT * 0.02
  },
  extraText: {
    fontSize: CONTENT_HEIGHT * 0.025, // Set the font size for the additional text
    color: '#2F4F4F', // Text color (dark grey)
    fontFamily: 'Quicksand-Regular', // Replace with your desired font family
    paddingLeft: CONTENT_WIDTH*0.04
  },
  textContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  resultsTextContainer: {
    padding: LAYOUT_MARGIN_HORIZONTAL,
    alignItems:'center',
    justifyContent:'center',
    // paddingTop:LAYOUT_MARGIN_HORIZONTAL,
    // paddingBottom:LAYOUT_MARGIN_HORIZONTAL,
    height:'115%',
    width:'115%',
    backgroundColor: 'transparent',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom:CONTENT_HEIGHT*0.04,
  },
  imageStyle: {
    marginTop: CONTENT_HEIGHT*0.02,
    width: CONTENT_WIDTH * 0.5, // Adjust based on your design
    height: CONTENT_HEIGHT * 0.3, // Adjust based on your design
    borderRadius: 30, // Optional for circular images
    marginBottom: CONTENT_HEIGHT*0.03,
    marginLeft:CONTENT_WIDTH*0.23
    // resizeMode: 'contain', // Ensure the image scales properly

  },
  resultsTextTitle: {
    fontSize: CONTENT_HEIGHT * 0.04,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: CONTENT_HEIGHT * 0.01,
    textAlign: 'center',
  },
  resultsTextResult: {
    color: '#9FC6D6', // Different color for result text
  },
  resultsTextDescription: {
    fontSize: CONTENT_HEIGHT * 0.028,
    color: '#2F4F4F',
    lineHeight: CONTENT_HEIGHT * 0.045,
    textAlign: 'center',
  },
  scrollContainer: {
    position: 'relative',
    height: '95%', // Adjust as needed
    width: '100%',
  },
  scrollIndicator: {
    position: 'absolute',
    right: CONTENT_WIDTH*-0.05,
    width: CONTENT_WIDTH*0.015,
    height: CONTENT_HEIGHT*0.17,
    backgroundColor: '#3498db85', // Scrollbar color
    borderRadius: 2.5,
  },
  
  scrollView: {
    maxHeight: CONTENT_HEIGHT, // Adjust this value for the scrollable area's height
  },
  scrollContent: {
    paddingVertical: 10,
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
    marginBottom: LAYOUT_MARGIN_VERTICAL*2
  },
  requirementText: {
    textAlign: 'center',
    color: '#2F4F4F',
    fontFamily: 'Quicksand-Regular',
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
  
  
  
});

export default VerticalStack;
