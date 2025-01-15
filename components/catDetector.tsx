// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
// // import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';

// class L2 {
//   static className = 'L2';
//   constructor(private l2: number = 0.001) {}
//   apply(x: tf.Tensor) {
//     return tf.mul(this.l2, tf.sum(tf.square(x)));
//   }
//   getConfig() {
//     return { l2: this.l2 };
//   }
//   static fromConfig(cls: any, config: any) {
//     return new cls(config.l2);
//   }
// }

// tf.serialization.registerClass(L2);

// export async function detectCat(uri: string): Promise<boolean> {
//   try {
//     await tf.ready();

//     const modelJson = require('../assets/catFaceDetectionFiles/cat_detect_model/model.json');
//     const modelWeights = [
//       require('../assets/catFaceDetectionFiles/cat_detect_model/group1-shard1of1.bin'),
//     ];
//     const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));

//     const inputTensor = await preprocessImage(uri);
//     const predictions = model.execute(inputTensor) as tf.Tensor;

//     // Add the debug logic here
//     return await decodePredictions(predictions, 0.5);
//   } catch (error) {
//     console.error('Error detecting cat face:', error);
//     return false;
//   }
// }

// const preprocessImage = async (uri: string) => {
//   const response = await fetch(uri);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch image at URI: ${uri}, Status: ${response.status}`);
//   }

//   const imageData = await response.arrayBuffer();
//   const imageTensor = decodeJpeg(new Uint8Array(imageData), 3);
//   const resizedImage = tf.image.resizeBilinear(imageTensor, [640, 640]);
//   const normalizedImage = resizedImage.div(255.0);
//   const batchedImage = normalizedImage.expandDims(0);

//   return batchedImage;
// };

// const decodePredictions = async (predictions: tf.Tensor, confidenceThreshold: number): Promise<boolean> => {
//   console.log("========== Inference Debug Information ==========");

//   // Print out the raw predictions shape (should be [1, 5, 8400] for YOLO-like output)
//   console.log("Raw Predictions Tensor Shape:", predictions.shape);

//   // Squeeze batch dimension [1,5,8400] -> [5,8400]
//   const squeezedPredictions = predictions.squeeze();
//   console.log("Squeezed Predictions Tensor Shape:", squeezedPredictions.shape);

//   // Extract coordinates and confidence from the squeezed predictions
//   const [xCenter, yCenter, width, height, confidence] = tf.split(squeezedPredictions, 5, 0); 

//   // Convert confidence to a JS array and print a sample for inspection
//   const confidenceArray = (await confidence.array()) as number[];
//   // console.log("Confidence values (first 10):", confidenceArray.slice(0, 10));

//   // Find indices with confidence > threshold
//   let detected = false;
//   console.log(`\nChecking for detections with confidence > ${confidenceThreshold}...\n`);

//   const confidenceVals = confidence.dataSync(); // Float32Array of length 8400
//   console.log("Max confidence:", Math.max(...confidenceVals));

//   for (let i = 0; i < confidenceVals.length; i++) {
//     if (confidenceVals[i] > confidenceThreshold) {
//       detected = true;
//       console.log(`Object detected at index ${i} with confidence: ${confidenceVals[i]}`);
//       break;
//     }
//   }
//   if (!detected) {
//     console.log("No objects detected above the confidence threshold.");
//   }

//   return detected;
// };


import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as jpeg from 'jpeg-js';

// Main function to detect cats using TFLite
export async function detectCat(uri: string): Promise<boolean> {
  try {
    console.log('Running Cat Detection');

    // **Step 1: Load the TensorFlow Lite model**
    const model = await loadTensorflowModel(
      require('../assets/newCatDetectionFiles/cat_body/cat_body_model.tflite')
    );
    console.log('Model loaded successfully.');

    // **Step 2: Preprocess the image**
    console.log('Preprocessing image...');
    const inputTensor = await preprocessImage(uri);
    console.log('Image preprocessed.');

    // **Step 3: Run inference**
    console.log('Running inference...');
    const outputs = await model.run([inputTensor]);
    console.log('Raw model outputs:', outputs);

    // **Step 4: Decode predictions with confidence threshold**
    const detected = decodePredictions(outputs, 0.5);
    console.log(`Detection result: ${detected ? 'Cat detected' : 'No cat detected'}`);
    return detected;
  } catch (error) {
    console.error('Error detecting cat:', error);
    return false;
  }
}

// Preprocess image to create a tensor compatible with the TFLite model
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

    // Normalize pixel values to [0, 1] for a fixed size of 640x640
    const normalizedData = new Float32Array(640 * 640 * 3); // Assuming the YOLO model expects [640, 640, 3]
    for (let y = 0; y < 640; y++) {
      for (let x = 0; x < 640; x++) {
        const destIdx = (y * 640 + x) * 3;
        const srcIdx = ((y * height) / 640 | 0) * width * 4 + ((x * width) / 640 | 0) * 4;
        normalizedData[destIdx] = data[srcIdx] / 255;       // R
        normalizedData[destIdx + 1] = data[srcIdx + 1] / 255; // G
        normalizedData[destIdx + 2] = data[srcIdx + 2] / 255; // B
      }
    }

    console.log('Normalized image data prepared.');
    return normalizedData; // Return the normalized tensor data
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
};

// Decode predictions to determine if a cat face is detected
const decodePredictions = (outputs: any, confidenceThreshold: number): boolean => {
  console.log("========== Inference Debug Information ==========");

  // Check if outputs[0] is an array or an object
  const detectionTensor = outputs[0];
  if (!detectionTensor) {
    console.error("No tensor detected in outputs.");
    return false;
  }

  // Reshape flat detection tensor to [1, 5, 8400] if needed
  const flatDetections = Array.isArray(detectionTensor) ? detectionTensor : Object.values(detectionTensor);
  if (flatDetections.length !== 1 * 5 * 8400) {
    console.error("Unexpected tensor size:", flatDetections.length);
    return false;
  }

  const reshapedDetections: number[][][] = [];
  for (let i = 0; i < 1; i++) {
    reshapedDetections.push([]);
    for (let j = 0; j < 5; j++) {
      reshapedDetections[i].push(flatDetections.slice(j * 8400, (j + 1) * 8400));
    }
  }

  // console.log("Reshaped detection tensor:", reshapedDetections);

  // Process confidence scores from the reshaped tensor
  const confidenceScores = reshapedDetections[0][4]; // Focus on the 5th row (confidence scores) for all 8400 cells
  console.log("Confidence scores for detections:", confidenceScores);

  // Find the maximum confidence score
  const maxConfidence = Math.max(...confidenceScores);
  console.log(`Maximum Confidence Score: ${maxConfidence}`);

  // Check if any detection exceeds the confidence threshold
  for (let i = 0; i < confidenceScores.length; i++) {
    if (confidenceScores[i] > confidenceThreshold) {
      console.log(`Detection found with confidence ${confidenceScores[i]} at index ${i}`);
      return true;
    }
  }

  console.log("No detections found above the confidence threshold.");
  return false;
};


