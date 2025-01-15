import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import IconThemedButton from '../../../components/buttons/IconThemedButton';
import { HEADER_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_VERTICAL, LAYOUT_MARGIN_HORIZONTAL } from '../../../assets/utils/dimensions';

type HeaderItem = {
  type: 'button' | 'image' | 'text' | 'icon'; 
  props: any; 
}

interface HeaderProps {
  items?: HeaderItem[];
  layoutType?: 'leftWide' | 'rightWide' | 'equal'; 
  onLayout?: (event: any) => void; 
}

export default function Header({ items = [], layoutType = 'equal', onLayout }: HeaderProps) {
  const availableWidth = CONTENT_WIDTH;
  const itemCount = items.length || 1;

  // Fractional gap to scale with device width
  const gapFraction = 0.06; 
  const desiredGap = availableWidth * gapFraction;
  const totalGapSpace = (itemCount - 1) * desiredGap;

  let itemWidths: number[] = [];

  if (layoutType === 'equal') {
    const totalItemWidth = availableWidth - totalGapSpace;
    const itemWidth = totalItemWidth / itemCount;
    itemWidths = Array(itemCount).fill(itemWidth);
  } else {
    const adjustedWidth = availableWidth - totalGapSpace;

    if (itemCount === 2) {
      const wideWidth = adjustedWidth * 0.6;
      const otherWidth = adjustedWidth - wideWidth;
      if (layoutType === 'leftWide') {
        itemWidths = [wideWidth, otherWidth];
      } else {
        itemWidths = [otherWidth, wideWidth];
      }
    } else if (itemCount >= 3) {
      const normalWidth = adjustedWidth / (itemCount + 1);
      const wideWidth = 2 * normalWidth;

      if (layoutType === 'leftWide') {
        itemWidths = [wideWidth, ...Array(itemCount - 1).fill(normalWidth)];
      } else {
        itemWidths = [...Array(itemCount - 1).fill(normalWidth), wideWidth];
      }
    }
  }

  return (
    <View style={[styles.headerContainer]} onLayout={onLayout}>
      {items.map((item, index) => (
        <View key={index} style={[styles.itemWrapper, { width: itemWidths[index] }]}>
          {item.type === 'image' && (
            <Image 
              source={item.props.source} 
              style={styles.image} 
              resizeMode="contain"
            />
          )}
          {item.type === 'text' && (
            <Text style={styles.text}>{item.props.text}</Text>
          )}
          {item.type === 'icon' && (
            <Image 
              source={item.props.source} 
              style={styles.icon} 
              resizeMode="contain"
            />
          )}
          {item.type === 'button' && (
            <IconThemedButton
              name="rick"
              type="primary"
              borderRadiusMultiplier={0.4}
              textColor="#FFFFFF"
              backgroundColor="#5ca7c445"
              backgroundDarker="#f0f4f6"
              raiseLevel={3}
              onPress={item.props.onPress || (() => {})}
              heightMultiplier={HEADER_HEIGHT * 0.7}
              widthMultiplier={itemWidths[index]}
              paddingTopMultiplier={HEADER_HEIGHT * 0.05}
              paddingBottomMultiplier={HEADER_HEIGHT * 0.05}
            >
              <View style={styles.textWrapper}>
                <Text style={styles.buttonText}>{item.props.line1}</Text>
                {item.props.line2 && <Text style={styles.buttonText}>{item.props.line2}</Text>}
              </View>
            </IconThemedButton>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    height: HEADER_HEIGHT,
    // borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingTop: LAYOUT_MARGIN_VERTICAL*4,
    paddingHorizontal: LAYOUT_MARGIN_HORIZONTAL,
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: CONTENT_WIDTH*0.5,
    height: HEADER_HEIGHT*0.5, 
  },
  icon: {
    width: CONTENT_WIDTH, 
    height: HEADER_HEIGHT, 
  },
  text: {
    fontFamily: 'Quicksand-Regular',
    fontSize: HEADER_HEIGHT * 0.18, 
    textAlign: 'center',
  },
  textWrapper: {
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Quicksand-Regular',
    fontSize: HEADER_HEIGHT * 0.18, 
    lineHeight: HEADER_HEIGHT * 0.3, 
  },
});
