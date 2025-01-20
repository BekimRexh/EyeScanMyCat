


import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as jpeg from 'jpeg-js';


export async function detectCat(uri: string): Promise<boolean> {
  try {
    console.log('Running Cat Detection');

    
    const model = await loadTensorflowModel(
      require('../assets/newCatDetectionFiles/cat_body/cat_body_model.tflite')
    );
    console.log('Model loaded successfully.');

    
    console.log('Preprocessing image...');
    const inputTensor = await preprocessImage(uri);
    

    
    console.log('Running inference...');
    const outputs = await model.run([inputTensor]);
   

    
    const detected = decodePredictions(outputs, 0.5);
    console.log(`Detection result: ${detected ? 'Cat detected' : 'No cat detected'}`);
    return detected;
  } catch (error) {
    console.error('Error detecting cat:', error);
    return false;
  }
}


const preprocessImage = async (uri: string): Promise<Float32Array> => {
  try {
    console.log(`Fetching image from URI: ${uri}`);
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error(`Failed to fetch image at URI: ${uri}, Status: ${response.status}`);
    }

    const imageData = await response.arrayBuffer();
    console.log(`Image data length: ${imageData.byteLength}`);

    
    const decodedImage = jpeg.decode(new Uint8Array(imageData), { useTArray: true });
    const { width, height, data } = decodedImage;

    console.log(`Decoded image dimensions: ${width}x${height}`);

    
    const normalizedData = new Float32Array(640 * 640 * 3); 
    for (let y = 0; y < 640; y++) {
      for (let x = 0; x < 640; x++) {
        const destIdx = (y * 640 + x) * 3;
        const srcIdx = ((y * height) / 640 | 0) * width * 4 + ((x * width) / 640 | 0) * 4;
        normalizedData[destIdx] = data[srcIdx] / 255;       
        normalizedData[destIdx + 1] = data[srcIdx + 1] / 255; 
        normalizedData[destIdx + 2] = data[srcIdx + 2] / 255; 
      }
    }

    console.log('Normalized image data prepared.');
    return normalizedData; 
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
};


const decodePredictions = (outputs: any, confidenceThreshold: number): boolean => {
  console.log("========== Inference Debug Information ==========");

  
  const detectionTensor = outputs[0];
  if (!detectionTensor) {
    console.error("No tensor detected in outputs.");
    return false;
  }

  
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

  

  
  const confidenceScores = reshapedDetections[0][4]; 
  

  
  const maxConfidence = Math.max(...confidenceScores);
  console.log(`Maximum Confidence Score: ${maxConfidence}`);

  
  for (let i = 0; i < confidenceScores.length; i++) {
    if (confidenceScores[i] > confidenceThreshold) {
      console.log(`Detection found with confidence ${confidenceScores[i]} at index ${i}`);
      return true;
    }
  }

  console.log("No detections found above the confidence threshold.");
  return false;
};


