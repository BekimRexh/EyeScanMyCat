import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { ThemedButton } from 'react-native-really-awesome-button';
import IconThemedButton from '../../../components/buttons/IconThemedButton';
import { HEADER_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_VERTICAL, LAYOUT_MARGIN_HORIZONTAL } from '../../../assets/utils/dimensions';

type HeaderItem = {
  type: 'button' | 'image' | 'text' | 'icon' | 'iconButton'; 
  props: any;
};


interface HeaderProps {
  items?: HeaderItem[];
  layoutType?: 'leftWide' | 'rightWide' | 'equal'; 
  onLayout?: (event: any) => void; 
}

export default function Header({ items = [], layoutType = 'equal', onLayout }: HeaderProps) {
  const availableWidth = CONTENT_WIDTH;
  const itemCount = items.length || 1;

  
  const gapFraction = 0.15; 
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
              style={[styles.image, { width: itemWidths[index]*1.8, height: HEADER_HEIGHT * 0.3 }]}
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
          {item.type === 'iconButton' && (
            <IconThemedButton
              {...item.props} 
              height={HEADER_HEIGHT * 0.3}
              width={itemWidths[index]/1.1}
            />
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
    
    borderBottomColor: '#E0E0E0',
    paddingTop: LAYOUT_MARGIN_VERTICAL*0.8,
    paddingHorizontal: LAYOUT_MARGIN_HORIZONTAL,
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: CONTENT_WIDTH,
    height: HEADER_HEIGHT, 
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
