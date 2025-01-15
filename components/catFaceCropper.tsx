// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
// import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
// import * as jpeg from 'jpeg-js';
// import * as FileSystem from 'expo-file-system';
// import * as ImageManipulator from 'expo-image-manipulator';

// export async function cropCatFace(uri: string): Promise<{ croppedUri: string | null; croppingCoordinates: { x: number; y: number; width: number; height: number } }> {
//   try {
//     await tf.ready();
//     console.log("Running Cat Face Detection");

//     // **Step 1: Normalize orientation to portrait using ImageManipulator**
//     const rotatedImage = await ImageManipulator.manipulateAsync(uri, [{ rotate: 0 }]);
//     const portraitImageUri = rotatedImage.uri;
//     console.log("Portrait image path:", portraitImageUri);

//     // **Step 2: Load the TensorFlow model**
//     const modelJson = require('../assets/catFaceDetectionFiles/cat_face_crop_model/model.json');
//     const modelWeights = [require('../assets/catFaceDetectionFiles/cat_face_crop_model/group1-shard1of1.bin')];
//     const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
//     console.log("Model loaded successfully.");

//     // **Step 3: Preprocess the portrait image**
//     const { imageTensor, originalImageTensor, originalSize } = await preprocessImageForCrop(portraitImageUri);
//     console.log("Image preprocessed:", originalSize);

//     // **Step 4: Run model to get bounding box prediction**
//     const prediction = model.predict(imageTensor) as tf.Tensor;
//     const bbox = Array.from(prediction.dataSync());
//     console.log("Bounding box prediction (normalized):", bbox);

//     // **Step 5: Denormalize the bounding box to match the original image dimensions**
//     const [x_min, y_min, width_norm, height_norm] = bbox.map((val) => Math.max(0, Math.min(val, 1)));
//     const [originalWidth, originalHeight] = originalSize;

//     const xMinOriginal = Math.round(x_min * originalWidth);
//     const yMinOriginal = Math.round(y_min * originalHeight);
//     const xMaxOriginal = Math.round((x_min + width_norm) * originalWidth);
//     const yMaxOriginal = Math.round((y_min + height_norm) * originalHeight);

//     const xMinClamped = Math.max(0, Math.min(xMinOriginal, originalWidth - 1));
//     const yMinClamped = Math.max(0, Math.min(yMinOriginal, originalHeight - 1));
//     const xMaxClamped = Math.max(0, Math.min(xMaxOriginal, originalWidth - 1));
//     const yMaxClamped = Math.max(0, Math.min(yMaxOriginal, originalHeight - 1));

//     // **Sliding scale logic for bounding box adjustment**
//     const widthOriginal = xMaxClamped - xMinClamped;
//     const heightOriginal = yMaxClamped - yMinClamped;

//     const boxRatio = widthOriginal / originalWidth;
//     const rightIncreaseFactor = 0.6 + (1 - boxRatio) * 0.6; // Base increase is 60%, max increase is 120%

//     const xMinAdjusted = Math.max(0, xMinClamped - 0.2 * widthOriginal);
//     const xMaxAdjusted = Math.min(originalWidth - 1, xMaxClamped + rightIncreaseFactor * widthOriginal);
//     const yMinAdjusted = Math.max(0, yMinClamped - 0.2 * heightOriginal);
//     const yMaxAdjusted = Math.min(originalHeight - 1, yMaxClamped + 0.2 * heightOriginal);

//     const widthAdjusted = xMaxAdjusted - xMinAdjusted;
//     const heightAdjusted = yMaxAdjusted - yMinAdjusted;

//     if (widthAdjusted <= 0 || heightAdjusted <= 0) {
//       throw new Error('Invalid bounding box dimensions: width or height is zero or negative.');
//     }

//     // **Step 6: Crop the image using the adjusted bounding box**
//     const croppedTensor = tf.slice(
//       originalImageTensor,
//       [Math.round(yMinAdjusted), Math.round(xMinAdjusted), 0],
//       [Math.round(heightAdjusted), Math.round(widthAdjusted), 3]
//     );

//     console.log("Image cropped:", croppedTensor.shape);

//     // **Step 7: Save the cropped image to a file**
//     const croppedImageUri = await saveTensorAsImage(croppedTensor);
//     console.log("Cropped image saved:", croppedImageUri);

//     // Return both the cropped URI and the cropping coordinates
//     return {
//       croppedUri: croppedImageUri,
//       croppingCoordinates: {
//         x: Math.round(xMinAdjusted),
//         y: Math.round(yMinAdjusted),
//         width: Math.round(widthAdjusted),
//         height: Math.round(heightAdjusted),
//       },
//     };
//   } catch (error) {
//     console.error('Error detecting and cropping cat face:', error);
//     return {
//       croppedUri: null,
//       croppingCoordinates: { x: 0, y: 0, width: 0, height: 0 },
//     };
//   }
// }

// // Helper to preprocess image for cropping
// const preprocessImageForCrop = async (
//   uri: string
// ): Promise<{ imageTensor: tf.Tensor; originalImageTensor: tf.Tensor; originalSize: [number, number] }> => {
//   try {
//     const response = await fetch(uri);
//     const imageData = await response.arrayBuffer();
//     const imageTensor = decodeJpeg(new Uint8Array(imageData), 3);
//     const originalWidth = imageTensor.shape[1];
//     const originalHeight = imageTensor.shape[0];

//     const resizedForModel = tf.image.resizeBilinear(imageTensor, [224, 224]);
//     const normalizedImage = resizedForModel.div(255.0);
//     const batchedImage = normalizedImage.expandDims(0);

//     return {
//       imageTensor: batchedImage, 
//       originalImageTensor: imageTensor, 
//       originalSize: [originalWidth, originalHeight]
//     };
//   } catch (error) {
//     console.error('Error preprocessing image for crop:', error);
//     throw error;
//   }
// };

// // Helper to save a tensor as an image file
// const saveTensorAsImage = async (tensor: tf.Tensor): Promise<string> => {
//   const imageData = tensor.dataSync();
//   const [height, width, channels] = tensor.shape;

//   if (channels !== 3) {
//     throw new Error('Expected a tensor with 3 channels (RGB).');
//   }

//   const rawImageData = {
//     data: new Uint8Array(height * width * 4),
//     width: width,
//     height: height,
//   };

//   let pixelIndex = 0;
//   for (let i = 0; i < imageData.length; i += 3) {
//     rawImageData.data[pixelIndex++] = imageData[i];     
//     rawImageData.data[pixelIndex++] = imageData[i + 1]; 
//     rawImageData.data[pixelIndex++] = imageData[i + 2]; 
//     rawImageData.data[pixelIndex++] = 255;              
//   }

//   const jpegImage = jpeg.encode(rawImageData, 90);
//   const path = `${FileSystem.cacheDirectory}cropped-image.jpg`;

//   await FileSystem.writeAsStringAsync(path, jpegImage.data.toString('base64'), {
//     encoding: FileSystem.EncodingType.Base64,
//   });

//   return path;
// };

import * as tf from '@tensorflow/tfjs';

import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';

export async function cropCatFace(uri: string): Promise<{ croppedUri: string | null; croppingCoordinates: { x: number; y: number; width: number; height: number } }> {
  try {
    console.log('Running Cat Face Detection');

    // Step 1: Normalize orientation to portrait using ImageManipulator
    const rotatedImage = await ImageManipulator.manipulateAsync(uri, [{ rotate: 0 }]);
    const portraitImageUri = rotatedImage.uri;
    console.log('Portrait image path:', portraitImageUri);

    // Step 2: Load the TensorFlow Lite model
    const model = await loadTensorflowModel(require('../assets/newCatDetectionFiles/cat_crop/cat_face_crop_model.tflite'));
    console.log('Model loaded successfully.');

    // Step 3: Preprocess the image
    const { inputTensor, originalSize } = await preprocessImageForCrop(portraitImageUri);
    console.log('Image preprocessed:', originalSize);

    // Step 4: Run model to get bounding box prediction
    const prediction = await model.run([inputTensor]); // Pass the tensor as an array
    console.log('Raw model output:', prediction);

    // Extract bounding box from prediction
    // Ensure prediction is a flat array of numbers
    // Explicitly convert prediction[0] to a number array
    const bbox = Array.from(prediction[0] as Float32Array).map((val) => {
      const normalized = Math.max(0, Math.min(val, 1)); // Ensure normalized values
      console.log(`Prediction value: ${val}, Normalized: ${normalized}`);
      return normalized;
    });
    console.log('Bounding box prediction (normalized):', bbox);

    // **Step 5: Denormalize the bounding box to match the original image dimensions**
//     const [x_min, y_min, width_norm, height_norm] = bbox.map((val) => Math.max(0, Math.min(val, 1)));
//     const [originalWidth, originalHeight] = originalSize;

//     const xMinOriginal = Math.round(x_min * originalWidth);
//     const yMinOriginal = Math.round(y_min * originalHeight);
//     const xMaxOriginal = Math.round((x_min + width_norm) * originalWidth);
//     const yMaxOriginal = Math.round((y_min + height_norm) * originalHeight);

    // Step 5: Denormalize the bounding box to match the original image dimensions
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

    // Clamp coordinates to ensure they are within the image boundaries
    const xMinClamped = Math.max(0, Math.min(xMinOriginal, originalWidth - 1));
    const yMinClamped = Math.max(0, Math.min(yMinOriginal, originalHeight - 1));
    const xMaxClamped = Math.max(0, Math.min(xMaxOriginal, originalWidth - 1));
    const yMaxClamped = Math.max(0, Math.min(yMaxOriginal, originalHeight - 1));

    // const widthAdjusted = xMaxClamped - xMinClamped;
    // const heightAdjusted = yMaxClamped - yMinClamped;

    console.log('Clamped bounding box coordinates:', {
      xMinClamped,
      yMinClamped,
      xMaxClamped,
      yMaxClamped,
    });

     // Sliding scale logic for bounding box adjustment
     const widthOriginal = xMaxClamped - xMinClamped;
     const heightOriginal = yMaxClamped - yMinClamped;
 
     const boxRatio = widthOriginal / originalWidth;
     const rightIncreaseFactor = 0.6 + (1 - boxRatio) * 0.6; // Base increase is 60%, max increase is 120%
 
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
 
     // Step 6: Crop the image using the adjusted bounding box
     const croppedUri = await cropImage(
       portraitImageUri,
       Math.round(xMinAdjusted),
       Math.round(yMinAdjusted),
       Math.round(widthAdjusted),
       Math.round(heightAdjusted)
     );
     console.log('Cropped image saved:', croppedUri);
 
     // Return the cropped URI and cropping coordinates
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

// Helper to preprocess image for cropping
const preprocessImageForCrop = async (
  uri: string
): Promise<{ inputTensor: Float32Array; originalSize: [number, number] }> => {
  try {
    const response = await fetch(uri);
    const imageData = await response.arrayBuffer();
    const decodedImage = jpeg.decode(new Uint8Array(imageData), { useTArray: true });
    const { width, height, data } = decodedImage;

    console.log(`Original image dimensions: ${width}x${height}`);

    // Create a Float32Array for the resized image [224x224x3]
    const resizedWidth = 224;
    const resizedHeight = 224;
    const normalizedData = new Float32Array(resizedWidth * resizedHeight * 3);

    // Resize and normalize pixel values to [0, 1]
    for (let y = 0; y < resizedHeight; y++) {
      for (let x = 0; x < resizedWidth; x++) {
        const destIdx = (y * resizedWidth + x) * 3;
        const srcIdx =
          ((Math.floor((y * height) / resizedHeight)) * width + Math.floor((x * width) / resizedWidth)) * 4;

        normalizedData[destIdx] = data[srcIdx] / 255; // R
        normalizedData[destIdx + 1] = data[srcIdx + 1] / 255; // G
        normalizedData[destIdx + 2] = data[srcIdx + 2] / 255; // B
      }
    }

    console.log('Normalized data length:', normalizedData.length);
    return {
      inputTensor: normalizedData, // Flattened Float32Array
      originalSize: [width, height], // Original dimensions for reference
    };
  } catch (error) {
    console.error('Error preprocessing image for crop:', error);
    throw error;
  }
};

// Helper to crop an image
const cropImage = async (uri: string, x: number, y: number, width: number, height: number): Promise<string> => {
  console.log(`Cropping image with coordinates: x=${x}, y=${y}, width=${width}, height=${height}`);
  const croppedImage = await ImageManipulator.manipulateAsync(uri, [
    { crop: { originX: x, originY: y, width, height } },
  ]);
  return croppedImage.uri;
};
