import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AntDesign } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { useReducedMotion } from 'react-native-reanimated';

import { HEADER_HEIGHT, CONTENT_WIDTH, CONTENT_HEIGHT } from '../../assets/utils/dimensions';

export type ScanStatus = 'idle' | 'loadingCircle' | 'loadingExpanded' | 'error';

interface BeginScanButtonProps {
  onPress: () => void;
  loading: boolean;
  scanStatus: ScanStatus;
  scanText?: string;
  heightMultiplier?: number;
  widthMultiplier?: number;
  iconSizeMultiplier?: number;
}

export default function BeginScanButton({
  onPress,
  loading,
  scanStatus,
  scanText = '',
  heightMultiplier = 0.55,
  widthMultiplier = 0.85,
  iconSizeMultiplier = 0.5,
}: BeginScanButtonProps) {
  /**
   * --------------------------------------------------------
   * 1) Dimensions
   * --------------------------------------------------------
   */
  const buttonHeight = HEADER_HEIGHT * heightMultiplier;
  const buttonWidth = CONTENT_WIDTH * widthMultiplier;
  const halfWidth = buttonWidth / 2.5;

  /**
   * --------------------------------------------------------
   * 2) Shared Values
   * --------------------------------------------------------
   */
  const widthAnim = useSharedValue(buttonWidth);
  const fadeIdleIcons = useSharedValue(1);
  const fadeExpandedText = useSharedValue(0);
  const spinAnim = useSharedValue(0);

  const isDisabled = scanStatus !== 'idle'; // Disable if not in idle state

  const shouldReduceMotion = useReducedMotion(); // Detect if reduced motion is preferred

  /**
   * --------------------------------------------------------
   * 3) Animated Styles
   * --------------------------------------------------------
   */
  const animatedButtonStyle = useAnimatedStyle(() => ({
    width: widthAnim.value,
    height: buttonHeight,
    borderRadius: buttonHeight / 2,
    opacity: isDisabled ? 0.85 : 1,
  }));

  const idleIconsStyle = useAnimatedStyle(() => ({
    opacity: fadeIdleIcons.value,
  }));

  const expandedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeExpandedText.value,
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${spinAnim.value * 360}deg`,
      },
    ],
  }));

  const expandedRowStyle = useAnimatedStyle(() => ({
    opacity: fadeExpandedText.value,
  }));

  /**
   * --------------------------------------------------------
   * 4) Handle Width and Fade Animations
   * --------------------------------------------------------
   */
  useEffect(() => {
    if (shouldReduceMotion) {
      if (scanStatus === 'idle') {
        widthAnim.value = buttonWidth;
        fadeIdleIcons.value = 1;
        fadeExpandedText.value = 0;
      } else if (scanStatus === 'loadingCircle') {
        fadeIdleIcons.value = withTiming(0, { duration: 300 });
        widthAnim.value = withTiming(halfWidth, { duration: 400 });
        fadeExpandedText.value = 0;
      } else if (scanStatus === 'loadingExpanded' || scanStatus === 'error') {
        widthAnim.value = withTiming(buttonWidth * 1.1, { duration: 400 });
        fadeExpandedText.value = withTiming(1, { duration: 300 });
      }
      return;
    }

    if (scanStatus === 'idle') {
      widthAnim.value = withTiming(buttonWidth, {
        duration: 400,
        easing: Easing.inOut(Easing.quad),
      });
      fadeIdleIcons.value = withTiming(1, { duration: 400 });
      fadeExpandedText.value = withTiming(0, { duration: 400 });
    } else if (scanStatus === 'loadingCircle') {
      fadeIdleIcons.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
      widthAnim.value = withTiming(halfWidth, {
        duration: 400,
        easing: Easing.inOut(Easing.quad),
      });
      fadeExpandedText.value = withTiming(0, { duration: 400 });
    } else if (scanStatus === 'loadingExpanded' || scanStatus === 'error') {
      widthAnim.value = withTiming(buttonWidth * 1.1, {
        duration: 400,
        easing: Easing.inOut(Easing.quad),
      }, () => {
        fadeExpandedText.value = withTiming(1, {
          duration: 300,
          easing: Easing.inOut(Easing.quad),
        });
      });
    }
  }, [
    scanStatus,
    buttonWidth,
    halfWidth,
    widthAnim,
    fadeIdleIcons,
    fadeExpandedText,
    shouldReduceMotion,
  ]);

  /**
   * --------------------------------------------------------
   * 5) Spinner Animation
   * --------------------------------------------------------
   */
  useEffect(() => {
    if (loading && !shouldReduceMotion) {
      spinAnim.value = withRepeat(
        withTiming(1, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1, // Infinite
        false
      );
    } else {
      cancelAnimation(spinAnim);
      spinAnim.value = 0;
    }
  }, [loading, spinAnim, shouldReduceMotion]);

  /**
   * --------------------------------------------------------
   * 6) Handle Press
   * --------------------------------------------------------
   */
  const handlePress = () => {
    if (!isDisabled && !shouldReduceMotion) {
      // Sequence animations: fade out icons and shrink button
      fadeIdleIcons.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      }, () => {
        widthAnim.value = withTiming(halfWidth, {
          duration: 400,
          easing: Easing.inOut(Easing.quad),
        }, () => {
          runOnJS(onPress)();
          // Optionally reset animations or handle post-press state
          fadeIdleIcons.value = withTiming(1, { duration: 300 });
        });
      });
    } else if (!isDisabled && shouldReduceMotion) {
      onPress();
    }
  };

  /**
   * --------------------------------------------------------
   * 7) Render
   * --------------------------------------------------------
   */
  const iconSize = buttonHeight * iconSizeMultiplier;
  const isIdle = scanStatus === 'idle';
  const isCircleMode = scanStatus === 'loadingCircle';
  const isExpandedMode = scanStatus === 'loadingExpanded';
  const isErrorMode = scanStatus === 'error';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedButton, animatedButtonStyle]}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={!isDisabled ? handlePress : undefined}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          {/** IDLE Icons */}
          {isIdle && (
            <Animated.View style={idleIconsStyle}>
              <View style={styles.textContainer}>
                <Text style={styles.sideText}>Begin Scan</Text>
                <View style={styles.iconWrapper}>
                  <Svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    style={[styles.svgIcon, { width: iconSize, height: iconSize }]}
                  >
                    <Path
                      d="M10.165,12.211A.75.75,0,0,1,10.791,11h2.418a.75.75,0,0,1,.626,1.211l-1.209,1.5a.815.815,0,0,1-1.252,0ZM1.051,15.316a1,1,0,0,1,.633-1.265l.363-.121C2.019,13.623,2,13.314,2,13V2a1,1,0,0,1,1.515-.857L8.037,3.855A8.578,8.578,0,0,1,12,3a8.588,8.588,0,0,1,3.964.855l4.521-2.712A1,1,0,0,1,22,2V13c0,.314-.019.623-.047.93l.363.121a1,1,0,0,1-.632,1.9l-.119-.04a9.94,9.94,0,0,1-1.4,2.843l.541.541a1,1,0,0,1-1.414,1.414l-.442-.442a9.948,9.948,0,0,1-13.7,0l-.442.442a1,1,0,0,1-1.414-1.414l.541-.541a9.94,9.94,0,0,1-1.4-2.843C1.659,16.123,1.214,15.8,1.051,15.316Z"
                      fill="#F0F8FF"
                    />
                  </Svg>
                  <MaterialCommunityIcons
                    name="scan-helper"
                    size={iconSize * 1.4}
                    color="#F0F8FF"
                  />
                  {!shouldReduceMotion && <AnimatedScanLine iconSize={iconSize} />}
                </View>
              </View>
            </Animated.View>
          )}

          {/** SPINNER => ALWAYS MOUNTED => Hide/Show or Position */}
          {loading && (
            <Animated.View
              style={[
                spinnerStyle,
                isCircleMode ? styles.circleSpinner : styles.hiddenSpinner,
              ]}
            >
              <AntDesign
                name="loading2"
                size={iconSize * 1.2}
                color="#2F4F4F"
              />
            </Animated.View>
          )}

          {/** If expanded => text + spinner in a row */}
          {isExpandedMode && (
            <Animated.View style={[styles.expandedRow, expandedTextStyle]}>
              <Text style={styles.expandedText}>
                {scanText || 'Processing...'}
              </Text>

              {loading && (
                <Animated.View style={[spinnerStyle, { marginLeft: 8 }]}>
                  <AntDesign
                    name="loading2"
                    size={iconSize * 1.2}
                    color="#2F4F4F"
                  />
                </Animated.View>
              )}
            </Animated.View>
          )}

          {/* ERROR Mode */}
          {isErrorMode && (
            <Animated.View style={[styles.expandedRow, expandedTextStyle]}>
              <Text style={styles.expandedText}>
                {scanText || 'Scan Error: Retake Photo'}
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/** Animated scan line for the idle icons */
function AnimatedScanLine({ iconSize }: { iconSize: number }) {
  const lineAnim = useSharedValue(-iconSize * 0.3);
  const shouldReduceMotion = useReducedMotion();

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lineAnim.value }],
    width: iconSize * 1.4,
  }));

  useEffect(() => {
    if (shouldReduceMotion) {
      lineAnim.value = 0;
      return;
    }

    lineAnim.value = withRepeat(
      withTiming(iconSize * 0.4, {
        duration: 2100,
        easing: Easing.inOut(Easing.quad),
      }),
      -1, // Infinite
      true // Reverse
    );
  }, [iconSize, lineAnim, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.scanLine,
        scanLineStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    // center for demo
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedButton: {
    backgroundColor: '#5ca7c440',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    marginTop: CONTENT_HEIGHT * 0.18,
    shadowOffset: { width: -20, height: -2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
    borderColor: '#5ca7c495',
    borderWidth: 0,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    // Original "Start" / "Scan" icons 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sideText: {
    fontSize: CONTENT_WIDTH * 0.08,
    color: '#2F4F4F',
    // fontWeight: 'bold',
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    paddingHorizontal: CONTENT_WIDTH * 0.03,
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginRight: CONTENT_WIDTH * 0.08,
  },
  svgIcon: {
    position: 'absolute',
  },
  scanLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#f00',
    left: 0,
    right: 0,
  },

  /** SPINNER STYLES */
  circleSpinner: {
    // center spinner in the circle
    position: 'absolute',
  },
  hiddenSpinner: {
    // hide (or set width/height=0) if we want only the second spinner
    // in expanded mode
    width: 0,
    height: 0,
    overflow: 'hidden',
  },

  /** EXPANDED MODE ROW */
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  expandedText: {
    fontSize: CONTENT_WIDTH * 0.06,
    marginRight: CONTENT_WIDTH * 0.05,
    color: '#2F4F4F',
    // fontWeight: 'bold',
    fontFamily: 'Quicksand-Regular',
  },
});
