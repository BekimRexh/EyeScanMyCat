import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreenComponent from './splashScreen'; 
import { ScanStateProvider } from './ScanStateContext';

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false); 
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  const preloadResources = async () => {
    
    const fontAssets = Font.loadAsync({
      'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
      'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
      'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    });
  
    await fontAssets;
  };
  

  useEffect(() => {
    const prepareApp = async () => {
      try {
        console.log("Here")
       
        await preloadResources();
        setIsAppReady(true);
        SplashScreen.hideAsync(); 

      } catch (error) {
        console.warn('Error loading resources:', error);
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady || !isSplashComplete) {
    return (
      <View style={styles.container}>
        <SplashScreenComponent
          onAnimationComplete={() => setIsSplashComplete(true)} 
        />
      </View>
    );
  }

  return (
    <ScanStateProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Slot />
          </View>
        </View>
      </GestureHandlerRootView>
    </ScanStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', 
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#f8f8f8', 
  },
});
