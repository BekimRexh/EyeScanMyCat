import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import IconThemedButton from '../../../components/buttons/IconThemedButton';
import { FOOTER_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_VERTICAL, LAYOUT_MARGIN_HORIZONTAL } from '../../../assets/utils/dimensions';
import { ThemedButton } from 'react-native-really-awesome-button';


interface ButtonType {
  line1: string; 
  line2?: string; 
  onPress: () => void;
}

interface FooterProps {
  buttons?: ButtonType[];
  layoutType?: 'leftWide' | 'rightWide' | 'equal'; 
}

export default function Footer({ buttons = [], layoutType = 'equal' }: FooterProps) {
  const availableWidth = CONTENT_WIDTH;
  const buttonCount = buttons.length || 1;

  
  const gapFraction = 0.06; 
  const desiredGap = availableWidth * gapFraction;
  const totalGapSpace = (buttonCount - 1) * desiredGap;
  
  let buttonWidths: number[] = [];

  if (layoutType === 'equal') {
    const totalButtonWidth = availableWidth - totalGapSpace;
    const buttonWidth = totalButtonWidth / buttonCount;
    buttonWidths = Array(buttonCount).fill(buttonWidth);
  } else {
    
    const adjustedWidth = availableWidth - totalGapSpace;

    if (buttonCount === 2) {
      
      const wideWidth = adjustedWidth * 0.6;
      const otherWidth = adjustedWidth - wideWidth; 
      if (layoutType === 'leftWide') {
        buttonWidths = [wideWidth, otherWidth];
      } else {
        buttonWidths = [otherWidth, wideWidth];
      }
    } else if (buttonCount >= 3) {
     

      const normalWidth = adjustedWidth / (buttonCount + 1);
      const wideWidth = 2 * normalWidth;

      if (layoutType === 'leftWide') {
       
        buttonWidths = [wideWidth, ...Array(buttonCount - 1).fill(normalWidth)];
      } else {
        
        buttonWidths = [...Array(buttonCount - 1).fill(normalWidth), wideWidth];
      }
    }
  }

   return (
    <View style={styles.footerContainer}>
      {buttons.map((button, index) => (
        <View key={index} style={[styles.buttonWrapper, { width: buttonWidths[index] }]}>
          <ThemedButton
            name="rick"
            type="primary"
            borderRadius={FOOTER_HEIGHT * 0.4}
            textColor="#FFFFFF"
            backgroundColor="#5ca7c445"
            backgroundDarker="#f0f4f6"
            raiseLevel={3}
            onPress={button.onPress || (() => {})}
            height={FOOTER_HEIGHT * 0.5}
            width={buttonWidths[index]}
            paddingTop={FOOTER_HEIGHT * 0.05}
            paddingBottom={FOOTER_HEIGHT * 0.05}
          >
            <View style={styles.textWrapper}>
              <Text style={styles.buttonText}>{button.line1}</Text>
              {button.line2 && <Text style={styles.buttonText}>{button.line2}</Text>}
            </View>
          </ThemedButton>
        </View>
      ))}
    </View>
  );

  
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    backgroundColor: '#F0F8FF',
    height: FOOTER_HEIGHT,
    
    borderTopColor: '#E0E0E0',
    paddingBottom: LAYOUT_MARGIN_VERTICAL,
    paddingHorizontal: LAYOUT_MARGIN_HORIZONTAL,
  },
  buttonWrapper: {
    justifyContent: 'center',
  },
  textWrapper: {
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Quicksand-Regular',
    fontSize: FOOTER_HEIGHT * 0.15, 
    lineHeight: FOOTER_HEIGHT * 0.2, 
  },
});
