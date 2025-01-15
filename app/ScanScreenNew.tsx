
import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, Dimensions  } from 'react-native';
import { useRouter } from 'expo-router';
import Header from './indexScreen/header/header';
import Footer from './indexScreen/footer/Footer';
import VerticalStack from './scanScreen/fullContent/scanStyle1'; // Import VerticalStack
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { HEADER_HEIGHT, TOTAL_FOOTER_SPACE, CONTENT_HEIGHT, CONTENT_WIDTH, LAYOUT_MARGIN_HORIZONTAL, LAYOUT_MARGIN_VERTICAL } from '../assets/utils/dimensions';



const ScanScreen: React.FC = () => {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const [focusSquare, setFocusSquare] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
  const [zoom, setZoom] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  


  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

   // Ask for permission when the component mounts
   useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant photo library permissions to use this feature.');
      } else {
        setPermissionGranted(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  if (!permission) {
    return (
      <View style={localStyles.container}>
        <Text style={localStyles.message}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={localStyles.container}>
        <Text style={localStyles.message}>We need your permission to show the camera</Text>
        <Button
          title="Grant Permission"
          onPress={() => requestPermission()}
        />
      </View>
    );
  }

  const handleLibraryImage = async (imageUri: string) => {
    try {
      // Navigate to PhotoApprovalScreen with the selected image
      router.push({
        pathname: '/PhotoApprovalScreen',
        params: { imageUri }, // Pass image URI to the next screen
      });
    } catch (error) {
      console.error('Error navigating to PhotoApprovalScreen with image:', error);
      Alert.alert('Error', 'An error occurred while selecting the photo.');
    }
  };
  
  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo?.uri) {
          Alert.alert('Error', 'Failed to capture photo. Please try again.');
          return;
        }
        router.push({
          pathname: '/PhotoApprovalScreen',
          params: { imageUri: photo.uri }, // Pass image URI to the next screen
        });
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Error', 'An error occurred while capturing the photo.');
      }
    }
  };

  const handleTap = (event: any) => {
    console.log("Tapped")
    'worklet';
    const { x, y } = event; 
    runOnJS(setFocusSquare)({ visible: true, x, y });
    runOnJS(setIsRefreshing)(true);

    setTimeout(() => {
      runOnJS(setFocusSquare)((prevState) => ({ ...prevState, visible: false }));
    }, 400);
  };

  const tapGesture = Gesture.Tap()
    .onEnd(runOnJS(handleTap))
    .shouldCancelWhenOutside(false);

  const handleZoomChange = (value: number) => {
    setZoom(value); 
  };

  const handlePhotoLibraryAccess = async () => {
    try {
      if (!permissionGranted) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'You need to grant photo library permissions to use this feature.');
          return;
        }
        setPermissionGranted(true);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        handleLibraryImage(imageUri); // Process the image and navigate
      }
    } catch (error) {
      console.error('Error accessing photo library:', error);
    }
  };

  return (
    <View style={localStyles.container}>
      {/* Content Area */}
      <View style={localStyles.contentContainer}>
        <VerticalStack 
          rowHeights={[10, 1, 1]}
          rows={[
            // First row: Camera
            { 
              columnLayoutType: 'equal', 
              items: [
                { 
                  type: 'cameraSVG', 
                  props: { 
                    cameraRef: cameraRef,
                    tapGesture: tapGesture,
                    facing: facing,
                    isRefreshing: isRefreshing,
                    zoom: zoom,
                    focusSquare: focusSquare
                  } 
                }
              ]
            },
            // Second row: Custom buttons or other content
            { 
              columnLayoutType: 'equal', 
              items: [
                {
                  type: 'iconButton',
                  props: {
                    name: 'rick',
                    IconComponent: MaterialIcons,
                    // heightMultiplier: 0.9,
                    // widthMultiplier:0.2,
                    iconName: 'insert-photo',
                    // iconSize: 35,
                    onPress: () => handlePhotoLibraryAccess(),
                  },
                },
                {
                  type: 'iconButton',
                  props: {
                    name: 'rick',
                    IconComponent: MaterialIcons,
                    // iconSizeMultiplier:1.1,
                    // heightMultiplier: 0.5,
                    // widthMultiplier:0.3,
                    iconName: 'camera',
                    // iconSize: 80,
                    onPress: () => handleCapture(),
                  },
                },
                {
                  type: 'iconButton',
                  props: {
                    name: 'rick',
                    IconComponent: MaterialIcons,
                    // heightMultiplier: 0.9,
                    // widthMultiplier:0.7,
                    iconName: 'flip-camera-ios',
                    // iconSize: 40,
                    onPress: () => setFacing((prevFacing) => (prevFacing === 'back' ? 'front' : 'back')),

                  },
                }
              ]
            },
            { 
              columnLayoutType: 'equal', 
              items: [
                {
                  type: 'zoomSlider',
                  props: {
                    onChange:handleZoomChange
                  },
                }
              ]
            },
          ]}
        />
      </View>
    </View>
  );
};

export default ScanScreen;

export const unstable_settings = {
  headerShown: false,
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text: { 
    color: 'white', 
    textAlign: 'center' 
  },
  message: {
    textAlign: 'center',
    color: 'white'
  },
});

