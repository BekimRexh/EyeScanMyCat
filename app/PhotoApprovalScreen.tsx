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
  | 'idle'            // Not scanning
  | 'loadingCircle'   // Spinner only, no text
  | 'loadingExpanded' // Spinner + text (“finding your cat…” etc.)
  | 'error';

export default function PhotoApprovalScreen() {
  // ----------------------------------------------------
  // Props & local state
  // ----------------------------------------------------
  const { imageUri } = useLocalSearchParams();
  const [imageUrl, setImageUrl] = useState(
    Array.isArray(imageUri) ? imageUri[0] : imageUri
  );


  // const [imageUrl, setImageUri] = useState<string | null>(null);

  const [isConverted, setIsConverted] = useState(false); // Track if conversion has been done

  useEffect(() => {
    const convertToJpeg = async () => {
      if (!imageUrl || isConverted) return; // Skip if already converted

      try {
        console.log('Converting image to JPEG...');
        // Convert the image to JPEG
        const response = await ImageResizer.createResizedImage(
          imageUrl, // Input URI
          800,      // Width
          800,      // Height
          'JPEG',   // Format
          100       // Quality
        );

        // Update the state with the converted URI
        setImageUrl(response.uri);
        setIsConverted(true); // Mark as converted
        console.log('Image converted successfully:', response.uri);
      } catch (error) {
        console.error('Error converting image to JPEG:', error);
      }
    };

    convertToJpeg();
  }, [imageUrl, isConverted]); // Dependency array includes `isConverted`

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

  // The user’s global scanning state
  const { scanState, setScanState } = useScanState();

  // ----------------------------------------------------
  // NEW: Store a “desired route” if user wants to navigate away mid-scan
  // ----------------------------------------------------
  const [desiredRoute, setDesiredRoute] = useState<string | null>(null);

  // `isScanningInProgress` = true if we are not idle
  const isScanningInProgress = scanStatus !== 'idle';

  // ----------------------------------------------------
  // Effect to handle a pending route if scanning finishes
  // ----------------------------------------------------
  useEffect(() => {
    if (!isScanningInProgress && desiredRoute) {
      // scanning is done, and user had wanted to navigate
      router.push(desiredRoute);
      setDesiredRoute(null); // clear it out
    }
  }, [isScanningInProgress, desiredRoute]);

  // ----------------------------------------------------
  // Main scanning effect
  // ----------------------------------------------------
  useEffect(() => {
    // Only run if we’re supposed to be scanning
    if (!scanState.someKey) return;

    let isCancelled = false;

    (async () => {
      try {
        // 1) Start scanning
        setLoading(true);
        setScanStatus('loadingCircle');
        setScanText('');

        // 2) Verify there's an image
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

        // Optional small delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (isCancelled) return;

        // Step 1: Detect cat
        setShowHorizontalScanBar(true);

        // After 2s, change loading text
        setTimeout(() => {
          if (!isCancelled) {
            setScanStatus('loadingExpanded');
            setScanText('Detecting cat...');
          }
        }, 2000);

        // Give it 5s total
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const detectCatPromise = detectCat(imageUrl);
        const detectCatWithDelay = new Promise((resolve) =>
          setTimeout(resolve, 5000)
        ).then(() => detectCatPromise);

        const catDetected = await detectCatWithDelay;

        if (isCancelled || !scanState.someKey) {
          // user canceled or navigated away
          setLoading(false);
          setScanStatus('idle');
          setScanText('');
          setShowHorizontalScanBar(false);
          return;
        }

        if (!catDetected) {
          // Could not detect cat
          setScanStatus('error');
          setShowHorizontalScanBar(false);
          setScanText('No Cat Found: Retake Photo');
          await new Promise((resolve) => setTimeout(resolve, 5000));

          setLoading(false);
          setScanStatus('idle');
          setScanState((prev) => ({ ...prev, someKey: false }));
          return;
        }

        // Step 2: Crop cat
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

        // Wait 5s with the bounding box
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setCroppedUri(result.croppedUri);

        // Step 3: Conjunctivitis detection
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

        // All done => go to results
        router.push({
          pathname: '/resultsScreen',
          params: {
            croppedUri: result.croppedUri,
            result: conjunctivitisResult,
          },
        });

        // Cleanup
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

  // ----------------------------------------------------
  // Render
  // ----------------------------------------------------
  return (
    <View style={localStyles.container}>
      <View style={localStyles.contentContainer}>
        <VerticalStack
          /* Pass the scanning & route info to VerticalStack */
          isScanningInProgress={isScanningInProgress}
          desiredRoute={desiredRoute}
          setDesiredRoute={setDesiredRoute}

          /* We keep your existing props */
          rowHeights={[9, 1.5, 0.8]}
          rows={[
            // First row: showImage
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
                    // showBoundingBoxAnimation: showBoundingBoxSquare,
                    boundingBox: boundingBox,
                  },
                },
              ],
            },
            // Second row: Requirements or BeginScanButton
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
            // Third row: Confirm button
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
