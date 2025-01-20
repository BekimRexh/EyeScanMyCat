import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { CONTENT_HEIGHT, CONTENT_WIDTH, HEADER_HEIGHT } from '../../assets/utils/dimensions'; // Use your existing constants

interface HorizontalSliderProps {
  width?: number; 
  onChange: (value: number) => void;
}

const HorizontalSlider: React.FC<HorizontalSliderProps> = ({ width = CONTENT_WIDTH * 0.8, onChange }) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const startX = useRef(sliderPosition);

  const handleGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    let newPosition = startX.current + translationX;

    
    newPosition = Math.max(0, Math.min(newPosition, width));
    setSliderPosition(newPosition);

    
    let zoomValue = (newPosition / width) ** 0.5; 
    zoomValue = Math.min(Math.max(0, 0.3 * zoomValue), 1); 
    onChange(zoomValue);
  };

  const handleStateChange = (event: any) => {
    const { state } = event.nativeEvent;
    if (state === State.BEGAN) {
      startX.current = sliderPosition;
    }
  };

  
  const tickMarks = [0, 0.25, 0.5, 0.75, 1];
  const edgePadding = width * 0.02; 

  return (
    <View style={[localStyles.sliderContainer, { width }]}>
      <View style={[localStyles.sliderTrack, { width }]}>
        
        <View style={[localStyles.trackPadding, { width: edgePadding }]} />
        
        <View style={localStyles.tickContainer}>
          {tickMarks.map((tick, index) => (
            <View 
              key={index} 
              style={[
                localStyles.tickMark, 
                { left: `${tick * 100}%`, transform: [{ translateX: -0.5 }] }
              ]}
            >
              <Text style={localStyles.tickLabel}>{Math.round(tick * 100)}%</Text>
            </View>
          ))}
        </View>

        <View style={[localStyles.trackPadding, { width: edgePadding }]} />
      </View>

      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <View 
          style={[
            localStyles.sliderHandle, 
            { left: sliderPosition - HEADER_HEIGHT * 0.1 + edgePadding }
          ]}
        >
          
          <View style={localStyles.ridgesContainer}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={localStyles.ridge} />
            ))}
          </View>
        </View>
      </PanGestureHandler>
    </View>
  );
};

const localStyles = StyleSheet.create({
  sliderContainer: {
    height: HEADER_HEIGHT * 0.52, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderTrack: {
    marginTop:CONTENT_HEIGHT*0.02,
    height: HEADER_HEIGHT * 0.05, 
    backgroundColor: '#555', 
    borderRadius: HEADER_HEIGHT * 0.05,
    position: 'relative', 
  },
  trackPadding: {
    height: '100%', 
    backgroundColor: 'transparent',
  },
  sliderHandle: {
    width: HEADER_HEIGHT * 0.27,
    height: HEADER_HEIGHT * 0.13,
    // backgroundColor: '#94c5d8',
    backgroundColor: 'linear-gradient(to right, #d9e7fc,rgb(30, 90, 114))', 

    borderRadius: HEADER_HEIGHT * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 0.4,
    borderColor: 'rgba(92, 167, 196, 0.5)',
    position: 'absolute',
    top: HEADER_HEIGHT * 0.23, 
  },
  ridgesContainer: {
    position: 'absolute',
    width: '90%',
    height: '60%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ridge: {
    width: '80%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 5,
  },
  tickContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: HEADER_HEIGHT * 0.05,
  },
  tickMark: {
    position: 'absolute',
    height: HEADER_HEIGHT * 0.06,
    width: HEADER_HEIGHT * 0.01,
    backgroundColor: '#fff',
    bottom: 1,
  },
  tickLabel: {
    fontSize: HEADER_HEIGHT * 0.07,
    color: '#b9b9b9',
    position: 'absolute',
    bottom: -HEADER_HEIGHT * 0.15,
    textAlign: 'center',
    width: HEADER_HEIGHT * 0.5,
    marginLeft: -HEADER_HEIGHT * 0.25,
  },
});

export default HorizontalSlider;
