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
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';


const VerticalStack: React.FC<{ 
  rows?: any[], 
  rowLayoutType?: 'equal' | 'topHeavy' | 'bottomHeavy' | 'middleHeavy',
  rowHeights?: number[], 
  columnGap?: number, 
}> = ({ rows = [], rowLayoutType = 'equal', rowHeights = [], columnGap = 0.09 }) => {
  
  const availableHeight = CONTENT_HEIGHT*1.03; 
  const availableWidth = CONTENT_WIDTH;  
  const rowCount = rows.length || 1;


  const rowGapFraction = -0.02; 
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

      {/* Main Content Area */}
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
      

      case 'carousel': {
        
        const data = props.data || [
          {
            level: 'Healthy',
            description:
              'Your cat appears healthy, showing no visible signs of conjunctivitis.',
          },
          {
            level: 'Low Chance',
            description:
              'Mild signs of conjunctivitis, slight redness or tearing. Monitor closely.',
          },
          {
            level: 'Moderate Chance',
            description:
              'Noticeable signs of redness, tearing, or crustiness. Consult a vet soon.',
          },
          {
            level: 'High Chance',
            description:
              'Strong signs of conjunctivitis—squinting, redness. Seek vet care ASAP.',
          },
        ];
      
        
        const [activeIndex, setActiveIndex] = useState(0);
      
       
        const cardWidth = columnWidth * 0.7; 
        const cardSpacing = cardWidth * 0.9; 
      
        
        const handleScroll = (event: any) => {
          const offsetX = event.nativeEvent.contentOffset.x;
         
          const index = Math.round(offsetX / cardSpacing);
          setActiveIndex(index);
        };
      
        return (
          <View style={[{ width: columnWidth, height: rowHeight }, styles.carouselContainer]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={handleScroll}
              contentContainerStyle={{
                
                paddingHorizontal: columnWidth * 0.15,
                alignItems: 'center',
              }}
            >
              {data.map((itemData, index) => {
                
                const overlapMargin = index === 0 ? 0 : -cardWidth * 0.25; 
                return (
                  <View
                    key={index}
                    style={[
                      styles.carouselCard,
                      {
                        width: cardWidth,
                        marginLeft: overlapMargin,
                        marginRight: cardWidth * 0.2, 
                      },
                    ]}
                  >
                    <Text style={styles.carouselTitle}>{itemData.level}</Text>
                    <Text style={styles.carouselDescription}>{itemData.description}</Text>
                  </View>
                );
              })}
            </ScrollView>
      
            {/* 4) Dots at bottom (overlay or below) */}
            <View style={styles.dotsContainer}>
              {data.map((_, i) => {
                const isActive = i === activeIndex;
                return (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      { 
                        backgroundColor: isActive ? '#2F4F4F' : '#AAA',
                        transform: [{ scale: isActive ? 1.2 : 1 }],
                      },
                    ]}
                  />
                );
              })}
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
                width: columnWidth * 1.2, 
              },
            ]}
          >
            <Text
              style={[
                styles.requirementText,
                {
                  fontSize: rowHeight * 0.25,
                  fontFamily: 'Quicksand-Bold',
                  marginBottom: rowHeight * 0.05, 
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
                  marginBottom: rowHeight * 0.08, 
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
                  marginBottom: rowHeight * 0.08, 

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
                  marginBottom: rowHeight * 0.08, 
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
              
              scaleFactorX = cameraContainerDimensions.height / imageDimensions.height;
              scaleFactorY = scaleFactorX;
              offsetX =
                (cameraContainerDimensions.width -
                  imageDimensions.width * scaleFactorX) /
                2;
            } else {
              
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
                        borderRadius: 10, 
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
                  blurRadius={10} 
                />
                {/* Static image overlay */}
                <Image
                  source={{ uri: props.imageUrl }}
                  style={styles.croppedCamera}
                  resizeMode="contain" 
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
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    bottom: CONTENT_HEIGHT*-0.034, 
    transform: [
      { translateX: CONTENT_WIDTH*-0.06 }, 
      { scaleY: CONTENT_HEIGHT*0.0033 }, 
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
    fontSize: CONTENT_HEIGHT * 0.025, 
    color: '#2F4F4F', 
    fontFamily: 'Quicksand-Regular', 
    paddingLeft: CONTENT_WIDTH*0.04
  },
  textContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  resultsTextContainer: {
    padding: LAYOUT_MARGIN_HORIZONTAL,
    paddingTop:LAYOUT_MARGIN_HORIZONTAL/2,
    paddingBottom:LAYOUT_MARGIN_HORIZONTAL/2,
    backgroundColor: '#F4F3F3',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: LAYOUT_MARGIN_VERTICAL,
  },
  resultsTextTitle: {
    fontSize: CONTENT_HEIGHT * 0.04,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: CONTENT_HEIGHT * 0.01,
    textAlign: 'center',
  },
  resultsTextResult: {
    color: '#9FC6D6', 
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  carouselCard: {
    backgroundColor: '#F4F3F3',
    borderRadius: 10,
    padding: LAYOUT_MARGIN_HORIZONTAL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  carouselTitle: {
    fontSize: CONTENT_HEIGHT * 0.04,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: CONTENT_HEIGHT * 0.01,
    textAlign: 'center',
  },
  carouselDescription: {
    fontSize: CONTENT_HEIGHT * 0.024,
    color: '#2F4F4F',
    lineHeight: CONTENT_HEIGHT * 0.035,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    marginTop: 8, 
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#AAA',
  },
  resultsTextDescription: {
    fontSize: CONTENT_HEIGHT * 0.024,
    color: '#2F4F4F',
    lineHeight: CONTENT_HEIGHT * 0.035,
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
    zIndex: -1, 
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
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: -160,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', 
  },
  requirementsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: LAYOUT_MARGIN_HORIZONTAL, 
    marginBottom: LAYOUT_MARGIN_VERTICAL*2
  },
  requirementText: {
    textAlign: 'center',
    color: '#2F4F4F',
    fontFamily: 'Quicksand-Regular',
  },
  horizontalScanBar: {
    position: 'absolute',
    top:0, 
    left:0,
    right:15,
    height: '100%', 
    backgroundColor: '#F4F3F3', 
    width: 5,
    zIndex: 2,
  },
  
  verticalScanBar: {
    position: 'absolute',
    top:0,
    left: 0, 
    width: '100%', 
    backgroundColor: '#F4F3F3', 
    height: 5,
    zIndex: 2,
  },
  
  
  
});

export default VerticalStack;
