

import { loadTensorflowModel } from 'react-native-fast-tflite';
import * as jpeg from 'jpeg-js';
import * as FileSystem from 'expo-file-system';


export async function detectConjunctivitis(uri: string): Promise<string> {
  try {
    console.log('Running Conjunctivitis Detection');

    
    const model = await loadTensorflowModel(require('../assets/newCatDetectionFiles/cat_conjunct/cat_conjunt_model.tflite'));
    console.log('Model loaded successfully.');

    
    console.log('Preprocessing image...');
    const imageTensor = await preprocessImage(uri);
    console.log('Image preprocessed.');

    
    console.log('Running inference...');
    const prediction = await model.run([imageTensor]);
    console.log('Prediction:', prediction);

    
    const result = prediction[0]; 
    console.log('Inference result:', result);

    return result.toString();
  } catch (error) {
    console.error('Error detecting conjunctivitis:', error);
    return 'Error in analysis';
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
  
      
      const normalizedData = new Float32Array(512 * 512 * 3); 
      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 512; x++) {
          const destIdx = (y * 512 + x) * 3;
          const srcIdx = ((y * height) / 512 | 0) * width * 4 + ((x * width) / 512 | 0) * 4;
          normalizedData[destIdx] = data[srcIdx] / 255;      
          normalizedData[destIdx + 1] = data[srcIdx + 1] / 255; 
          normalizedData[destIdx + 2] = data[srcIdx + 2] / 255; 
        }
      }
  
      return normalizedData; 
    } catch (error) {
      console.error('Error preprocessing image:', error);
      throw error;
    }
  };
  

