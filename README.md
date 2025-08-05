# 🐱 EyeScanMyCat – Cat Eye Disease Detection App

EyeScanMyCat is a mobile app that helps cat owners screen for potential eye diseases using AI. The app uses a TensorFlow Lite model trained on images of healthy and unhealthy cat eyes, and runs entirely on-device — no internet connection needed.

📱 Available on the **iOS App Store**.

---

## 🧠 Features

- Detects signs of eye disease from a photo of your cat
- Works fully offline using TensorFlow Lite
- Clean, user-friendly mobile UI
- Built using React Native and Expo

---

## 🛠️ Tech Stack

| Area                  | Tools Used                                     |
|-----------------------|------------------------------------------------|
| ML Model              | TensorFlow / TensorFlow Lite, Keras            |
| Image Preprocessing   | OpenCV, Haar Cascades                          |
| App Development       | React Native, Expo                             |
| Deployment            | Apple App Store                                |
| Model Conversion      | TFLite quantization for mobile compatibility   |

---

## 🧪 How It Works

1. **Image Capture**  
   The user takes or uploads a photo of their cat’s face.

2. **Eye Detection**  
   OpenCV’s Haar Cascade is used to detect and crop the eye region.

3. **Prediction**  
   The cropped eye is passed to a TensorFlow Lite CNN model to classify it as **healthy** or **potentially unhealthy**.

4. **Results**  
   The app returns a simple explanation and a recommendation to consult a vet if signs of disease are detected.

---

## 📊 Model Details

- **Architecture:** Convolutional Neural Network (CNN)
- **Input Size:** 96x96 grayscale or RGB eye crops
- **Training Data:** Manually labeled dataset of healthy and unhealthy cat eyes
- **Accuracy:** ~XX% (add your real value if known)
- **Optimized For:** On-device inference with low latency

---

## 🔧 Setup Instructions (Local Dev)

To run the app locally:

```bash
git clone https://github.com/yourusername/eyescanmycat.git
cd eyescanmycat
npm install
expo start
