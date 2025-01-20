import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import BeginScanButton from '../components/buttons/BeginScanButton';
import VerticalStack from './photoApprovalScreen/fullContent/photoApprovalStyle1';
import AnimatedCircleOval from '../components/buttons/CircleComponent';

import { detectCat } from '../components/catDetector';
import { cropCatFace } from '../components/catFaceCropper';
import { detectConjunctivitis } from '../components/conjunctivitisDetection';

import { useScanState } from './ScanStateContext';
import ImageResizer from 'react-native-image-resizer';

type ScanStatus = 
  | 'idle'            
  | 'loadingCircle'   
  | 'loadingExpanded' 
  | 'error';

export default function PhotoApprovalScreen() {
  
  
  
  const { imageUri } = useLocalSearchParams();
  const [imageUrl, setImageUrl] = useState(
    Array.isArray(imageUri) ? imageUri[0] : imageUri
  );


 

  const [isConverted, setIsConverted] = useState(false); 

  useEffect(() => {
    const convertToJpeg = async () => {
      if (!imageUrl || isConverted) return; 

      try {
        console.log('Converting image to JPEG...');
        
        const response = await ImageResizer.createResizedImage(
          imageUrl, 
          800,     
          800,     
          'JPEG',   
          100       
        );

        
        setImageUrl(response.uri);
        setIsConverted(true); 
        console.log('Image converted successfully:', response.uri);
      } catch (error) {
        console.error('Error converting image to JPEG:', error);
      }
    };

    convertToJpeg();
  }, [imageUrl, isConverted]); 

  const [loading, setLoading] = useState(true);
  const [showScanButton, setShowScanButton] = useState(true);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(true);
  const [showConfirmButton, setShowConfirmButton] = useState(true);
  const [cameraContainer, setCameraContainer] = useState(false);

  const [showHorizontalScanBar, setShowHorizontalScanBar] = useState(false);
  const [showVerticalScanBar, setShowVerticalScanBar] = useState(false);
  const [showBoundingBoxSquare, setShowBoundingBoxSquare] = useState(false);
  const [boundingBox, setBoundingBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanText, setScanText] = useState<string>('');

  
  const { scanState, setScanState } = useScanState();

  
 
  
  const [desiredRoute, setDesiredRoute] = useState<string | null>(null);

 
  const isScanningInProgress = scanStatus !== 'idle';

  
  
  useEffect(() => {
    if (!isScanningInProgress && desiredRoute) {
      
      router.push(desiredRoute);
      setDesiredRoute(null); 
    }
  }, [isScanningInProgress, desiredRoute]);


  useEffect(() => {
    
    if (!scanState.someKey) return;

    let isCancelled = false;

    (async () => {
      try {
       
        setLoading(true);
        setScanStatus('loadingCircle');
        setScanText('');

        
        if (!imageUrl) {
          if (!isCancelled) {
            setScanStatus('error');
            setScanText('No Photo: Please Retake');
            setLoading(false);
            setScanStatus('idle');
            setShowHorizontalScanBar(false);
            setScanState((prev) => ({ ...prev, someKey: false }));
          }
          return;
        }

      
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (isCancelled) return;

        
        setShowHorizontalScanBar(true);

        
        setTimeout(() => {
          if (!isCancelled) {
            setScanStatus('loadingExpanded');
            setScanText('Detecting cat...');
          }
        }, 2000);

        
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const detectCatPromise = detectCat(imageUrl);
        const detectCatWithDelay = new Promise((resolve) =>
          setTimeout(resolve, 5000)
        ).then(() => detectCatPromise);

        const catDetected = await detectCatWithDelay;

        if (isCancelled || !scanState.someKey) {
         
          setLoading(false);
          setScanStatus('idle');
          setScanText('');
          setShowHorizontalScanBar(false);
          return;
        }

        if (!catDetected) {
          
          setScanStatus('error');
          setShowHorizontalScanBar(false);
          setScanText('No Cat Found: Retake Photo');
          await new Promise((resolve) => setTimeout(resolve, 5000));

          setLoading(false);
          setScanStatus('idle');
          setScanState((prev) => ({ ...prev, someKey: false }));
          return;
        }

       
        setScanStatus('loadingCircle');
        setScanText('');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setShowHorizontalScanBar(false);
        setShowVerticalScanBar(true);
        setScanStatus('loadingExpanded');
        setScanText('Locating cat face...');

        const cropCatFacePromise = cropCatFace(imageUrl);
        const cropCatFaceWithDelay = new Promise((resolve) =>
          setTimeout(resolve, 5000)
        ).then(() => cropCatFacePromise);

        const result = await cropCatFaceWithDelay;

        if (isCancelled || !scanState.someKey) {
          setLoading(false);
          setScanStatus('idle');
          setScanText('');
          setShowHorizontalScanBar(false);
          setShowVerticalScanBar(false);
          return;
        }

        if (!result?.croppedUri || !result?.croppingCoordinates) {
          setScanStatus('error');
          setScanText('Cropping Error: Retake Photo');
          setLoading(false);
          setScanStatus('idle');
          setScanText('');
          setShowHorizontalScanBar(false);
          setShowVerticalScanBar(false);
          setScanState((prev) => ({ ...prev, someKey: false }));
          return;
        }

        setShowHorizontalScanBar(false);
        setShowVerticalScanBar(false);
        setShowBoundingBoxSquare(true);
        setBoundingBox(result.croppingCoordinates);

        
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setCroppedUri(result.croppedUri);

       
        setScanStatus('loadingCircle');
        setScanText('');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setScanStatus('loadingExpanded');
        setScanText('Assessing eye health...');

        const detectConjunctivitisPromise = detectConjunctivitis(result.croppedUri);
        const detectConjunctivitisWithDelay = new Promise((resolve) =>
          setTimeout(resolve, 5000)
        ).then(() => detectConjunctivitisPromise);

        const conjunctivitisResult = await detectConjunctivitisWithDelay;

        if (isCancelled || !scanState.someKey) {
          setLoading(false);
          setScanStatus('idle');
          setScanText('');
          setShowVerticalScanBar(false);
          setShowHorizontalScanBar(false);
          return;
        }

        
        router.push({
          pathname: '/resultsScreen',
          params: {
            croppedUri: result.croppedUri,
            result: conjunctivitisResult,
          },
        });

       
        setLoading(false);
        setScanStatus('idle');
        setScanText('');
        setShowVerticalScanBar(false);
        setShowHorizontalScanBar(false);
        setScanState({ someKey: false });
      } catch (error) {
        console.error('Error capturing or detecting face:', error);
        if (!isCancelled) {
          setScanStatus('error');
          setScanText('Scan Error: Retake Photo');
          setLoading(false);
          setScanStatus('idle');
          setScanText('');
          setShowVerticalScanBar(false);
          setShowHorizontalScanBar(false);
          setScanState((prev) => ({ ...prev, someKey: false }));
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [scanState.someKey, imageUrl]);

  
  return (
    <View style={localStyles.container}>
      <View style={localStyles.contentContainer}>
        <VerticalStack
         
          isScanningInProgress={isScanningInProgress}
          desiredRoute={desiredRoute}
          setDesiredRoute={setDesiredRoute}

          
          rowHeights={[9, 1.5, 0.8]}
          rows={[
           
            {
              columnLayoutType: 'equal',
              items: [
                {
                  type: 'showImage',
                  props: {
                    croppedUri: croppedUri,
                    imageUrl: imageUrl,
                    cameraContainer: cameraContainer,
                    showHorizontalAnimation: showHorizontalScanBar,
                    showVerticalAnimation: showVerticalScanBar,
                    
                    boundingBox: boundingBox,
                  },
                },
              ],
            },
           
            showRequirements
              ? {
                  columnLayoutType: 'equal',
                  items: [
                    {
                      type: 'requirements',
                      props: {
                        onConfirm: () => setShowRequirements(false),
                      },
                    },
                  ],
                }
              : {
                  columnLayoutType: 'equal',
                  items: [
                    {
                      type: 'view',
                      props: {
                        style: localStyles.scanButtonRow,
                        children: (
                          <BeginScanButton
                            onPress={() => {
                              setScanState((prev) => ({ ...prev, someKey: true }));
                            }}
                            loading={loading}
                            scanStatus={scanStatus}
                            scanText={scanText}
                          />
                        ),
                      },
                    },
                  ],
                },
            
            {
              columnLayoutType: 'equal',
              items: [
                showConfirmButton && {
                  type: 'textButton',
                  props: {
                    heightMultiplier: 0.23,
                    widthMultiplier: 0.4,
                    buttonText: 'Confirm',
                    backgroundColor: '#E2EAF4',
                    onPress: () => {
                      setShowRequirements(false);
                      setShowConfirmButton(false);
                      setCameraContainer(true);
                    },
                  },
                },
              ].filter(Boolean),
            },
          ]}
        />
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scanButtonRow: {
    alignItems: 'center',
  },
});
