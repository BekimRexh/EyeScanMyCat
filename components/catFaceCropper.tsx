

import * as tf from '@tensorflow/tfjs';

import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';

export async function cropCatFace(uri: string): Promise<{ croppedUri: string | null; croppingCoordinates: { x: number; y: number; width: number; height: number } }> {
  try {
    console.log('Running Cat Face Detection');

    
    const rotatedImage = await ImageManipulator.manipulateAsync(uri, [{ rotate: 0 }]);
    const portraitImageUri = rotatedImage.uri;
    console.log('Portrait image path:', portraitImageUri);

    
    const model = await loadTensorflowModel(require('../assets/newCatDetectionFiles/cat_crop/cat_face_crop_model.tflite'));
    console.log('Model loaded successfully.');

    
    const { inputTensor, originalSize } = await preprocessImageForCrop(portraitImageUri);
    console.log('Image preprocessed:', originalSize);

    
    const prediction = await model.run([inputTensor]); 
    console.log('Raw model output:', prediction);

    
    
    const bbox = Array.from(prediction[0] as Float32Array).map((val) => {
      const normalized = Math.max(0, Math.min(val, 1)); 
      console.log(`Prediction value: ${val}, Normalized: ${normalized}`);
      return normalized;
    });
    console.log('Bounding box prediction (normalized):', bbox);

   
    const [x_min, y_min, width_norm, height_norm] = bbox;
    const [originalWidth, originalHeight] = originalSize;

    const xMinOriginal = Math.round(x_min * originalWidth);
    const yMinOriginal = Math.round(y_min * originalHeight);
    const xMaxOriginal = Math.round((x_min + width_norm) * originalWidth);
    const yMaxOriginal = Math.round((y_min + height_norm) * originalHeight);

    console.log('Denormalized bounding box coordinates:', {
      xMinOriginal,
      yMinOriginal,
      xMaxOriginal,
      yMaxOriginal,
    });

    
    const xMinClamped = Math.max(0, Math.min(xMinOriginal, originalWidth - 1));
    const yMinClamped = Math.max(0, Math.min(yMinOriginal, originalHeight - 1));
    const xMaxClamped = Math.max(0, Math.min(xMaxOriginal, originalWidth - 1));
    const yMaxClamped = Math.max(0, Math.min(yMaxOriginal, originalHeight - 1));

    

    console.log('Clamped bounding box coordinates:', {
      xMinClamped,
      yMinClamped,
      xMaxClamped,
      yMaxClamped,
    });

     
     const widthOriginal = xMaxClamped - xMinClamped;
     const heightOriginal = yMaxClamped - yMinClamped;
 
     const boxRatio = widthOriginal / originalWidth;
     const rightIncreaseFactor = 0.6 + (1 - boxRatio) * 0.6; 
 
     const xMinAdjusted = Math.max(0, xMinClamped - 0.2 * widthOriginal);
     const xMaxAdjusted = Math.min(originalWidth - 1, xMaxClamped + rightIncreaseFactor * widthOriginal);
     const yMinAdjusted = Math.max(0, yMinClamped - 0.2 * heightOriginal);
     const yMaxAdjusted = Math.min(originalHeight - 1, yMaxClamped + 0.2 * heightOriginal);
 
     const widthAdjusted = xMaxAdjusted - xMinAdjusted;
     const heightAdjusted = yMaxAdjusted - yMinAdjusted;
 
     console.log('Adjusted bounding box coordinates:', {
       xMinAdjusted,
       yMinAdjusted,
       xMaxAdjusted,
       yMaxAdjusted,
       widthAdjusted,
       heightAdjusted,
     });
 
     if (widthAdjusted <= 0 || heightAdjusted <= 0) {
       throw new Error('Invalid bounding box dimensions: width or height is zero or negative.');
     }
 
     
     const croppedUri = await cropImage(
       portraitImageUri,
       Math.round(xMinAdjusted),
       Math.round(yMinAdjusted),
       Math.round(widthAdjusted),
       Math.round(heightAdjusted)
     );
     console.log('Cropped image saved:', croppedUri);
 
     
     return {
       croppedUri,
       croppingCoordinates: {
         x: Math.round(xMinAdjusted),
         y: Math.round(yMinAdjusted),
         width: Math.round(widthAdjusted),
         height: Math.round(heightAdjusted),
       },
     };
  } catch (error) {
    console.error('Error detecting and cropping cat face:', error);
    return {
      croppedUri: null,
      croppingCoordinates: { x: 0, y: 0, width: 0, height: 0 },
    };
  }
}


const preprocessImageForCrop = async (
  uri: string
): Promise<{ inputTensor: Float32Array; originalSize: [number, number] }> => {
  try {
    const response = await fetch(uri);
    const imageData = await response.arrayBuffer();
    const decodedImage = jpeg.decode(new Uint8Array(imageData), { useTArray: true });
    const { width, height, data } = decodedImage;

    console.log(`Original image dimensions: ${width}x${height}`);

    
    const resizedWidth = 224;
    const resizedHeight = 224;
    const normalizedData = new Float32Array(resizedWidth * resizedHeight * 3);

    
    for (let y = 0; y < resizedHeight; y++) {
      for (let x = 0; x < resizedWidth; x++) {
        const destIdx = (y * resizedWidth + x) * 3;
        const srcIdx =
          ((Math.floor((y * height) / resizedHeight)) * width + Math.floor((x * width) / resizedWidth)) * 4;

        normalizedData[destIdx] = data[srcIdx] / 255; 
        normalizedData[destIdx + 1] = data[srcIdx + 1] / 255;
        normalizedData[destIdx + 2] = data[srcIdx + 2] / 255; 
      }
    }

    console.log('Normalized data length:', normalizedData.length);
    return {
      inputTensor: normalizedData, 
      originalSize: [width, height], 
    };
  } catch (error) {
    console.error('Error preprocessing image for crop:', error);
    throw error;
  }
};


const cropImage = async (uri: string, x: number, y: number, width: number, height: number): Promise<string> => {
  console.log(`Cropping image with coordinates: x=${x}, y=${y}, width=${width}, height=${height}`);
  const croppedImage = await ImageManipulator.manipulateAsync(uri, [
    { crop: { originX: x, originY: y, width, height } },
  ]);
  return croppedImage.uri;
};
