// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
// import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
// import { Asset } from 'expo-asset';
// import * as FileSystem from 'expo-file-system';

// // Function to run conjunctivitis detection
// export async function detectConjunctivitis(uri: string): Promise<string> {
//   try {
//     await tf.ready();
//     console.log("Running Conjunctivitis Detection");

//     console.log("Downloading model...");
//     // Load model JSON and weights
//     const modelJson = require('../assets/catFaceDetectionFiles/conjunctivitis_model/model.json');
//     const modelWeights = [
//       require('../assets/catFaceDetectionFiles/conjunctivitis_model/group1-shard1of1.bin'),
//     ];
//     // console.log('Model JSON:', modelJson);
//     // console.log('Model weights URIs:', modelWeights);

//     // Load the model
//     const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
//     // console.log("Model loaded successfully:", model);

//     // Preprocess the image
//     console.log("Preprocessing image...");
//     const imageTensor = await preprocessImage(uri);
//     console.log("Image preprocessed:", imageTensor.shape);

//     // Run inference
//     console.log("Running inference...");
//     const prediction = model.predict(imageTensor) as tf.Tensor;
//     const result = prediction.dataSync()[0];
//     console.log("Inference result:", result);

//     // Return result as string
//     return result.toString();
//   } catch (error) {
//     console.error('Error detecting conjunctivitis:', error);
//     return 'Error in analysis';
//   }
// }

// // Function to preprocess the input image
// const preprocessImage = async (uri: string) => {
//   try {
//     console.log(`Fetching image from URI: ${uri}`);
//     const response = await fetch(uri);
//     console.log(`Image fetch response status: ${response.status}`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch image at URI: ${uri}, Status: ${response.status}`);
//     }

//     const imageData = await response.arrayBuffer();
//     console.log(`Image data length: ${imageData.byteLength}`);

//     // Decode and process the image
//     const imageTensor = decodeJpeg(new Uint8Array(imageData), 3);
//     console.log("Image decoded:", imageTensor.shape);

//     const resizedImage = tf.image.resizeBilinear(imageTensor, [512, 512]);
//     console.log("Image resized:", resizedImage.shape);

//     const normalizedImage = resizedImage.div(255.0);
//     console.log("Image normalized.");

//     const batchedImage = normalizedImage.expandDims(0);
//     console.log("Image batched:", batchedImage.shape);

//     return batchedImage;
//   } catch (error) {
//     console.error('Error preprocessing image:', error);
//     throw error;
//   }
// };


import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as jpeg from 'jpeg-js';
import * as FileSystem from 'expo-file-system';

// Function to run conjunctivitis detection
export async function detectConjunctivitis(uri: string): Promise<string> {
  try {
    console.log('Running Conjunctivitis Detection');

    // **Step 1: Load the TensorFlow Lite model**
    const model = await loadTensorflowModel(require('../assets/newCatDetectionFiles/cat_conjunct/cat_conjunt_model.tflite'));
    console.log('Model loaded successfully.');

    // **Step 2: Preprocess the image**
    console.log('Preprocessing image...');
    const imageTensor = await preprocessImage(uri);
    console.log('Image preprocessed.');

    // **Step 3: Run inference**
    console.log('Running inference...');
    const prediction = await model.run([imageTensor]);
    console.log('Prediction:', prediction);

    // **Step 4: Extract result**
    const result = prediction[0]; // Adjust based on your model's output
    console.log('Inference result:', result);

    return result.toString();
  } catch (error) {
    console.error('Error detecting conjunctivitis:', error);
    return 'Error in analysis';
  }
}

// Function to preprocess the input image
const preprocessImage = async (uri: string): Promise<Float32Array> => {
    try {
      console.log(`Fetching image from URI: ${uri}`);
      const response = await fetch(uri);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image at URI: ${uri}, Status: ${response.status}`);
      }
  
      const imageData = await response.arrayBuffer();
      console.log(`Image data length: ${imageData.byteLength}`);
  
      // Decode and process the image
      const decodedImage = jpeg.decode(new Uint8Array(imageData), { useTArray: true });
      const { width, height, data } = decodedImage;
  
      console.log(`Decoded image dimensions: ${width}x${height}`);
  
      // Normalize pixel values to [0, 1]
      const normalizedData = new Float32Array(512 * 512 * 3); // Fixed size for [512, 512, 3]
      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 512; x++) {
          const destIdx = (y * 512 + x) * 3;
          const srcIdx = ((y * height) / 512 | 0) * width * 4 + ((x * width) / 512 | 0) * 4;
          normalizedData[destIdx] = data[srcIdx] / 255;       // R
          normalizedData[destIdx + 1] = data[srcIdx + 1] / 255; // G
          normalizedData[destIdx + 2] = data[srcIdx + 2] / 255; // B
        }
      }
  
      return normalizedData; // Return the normalized tensor data
    } catch (error) {
      console.error('Error preprocessing image:', error);
      throw error;
    }
  };
  

