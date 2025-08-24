# 🐱 EyeScanMyCat – AI-Powered Eye Disease Detection for Cats

**EyeScanMyCat** is a mobile app that detects signs of feline conjunctivitis using on-device deep learning. It combines **three TensorFlow Lite models** to analyze cat photos end-to-end. The app runs fully offline and is available on the **iOS App Store**. A separate repository, **CatBinaryModels**, contains the datasets, preprocessing steps, and training code used to build these models, available at https://github.com/BekimRexh/CatBinaryModels.

---

## Demo Video

[Watch Demo on Google Drive](https://drive.google.com/file/d/1E5KUqW0fSAKDbHJUKaLSofQundpB4C0t/view?usp=drive_link)

> Shows real-time inference pipeline including cat detection, face cropping, and eye disease prediction.

---

## Overview

| Task                          | Model Used                            | Purpose |
|------------------------------|----------------------------------------|---------|
| **1. Cat Detection**         | YOLOv5 (converted to TFLite)           | Detects if a cat is present in the image |
| **2. Face Cropping**         | MobileNetV2 Bounding Box Regressor     | Locates the cat’s face |
| **3. Conjunctivitis Detection** | MobileNetV2 Classifier              | Classifies risk of eye disease |

---

## Machine Learning Workflow

### 1. Cat Detection – YOLOv5

- Detects the presence of a cat in the image.
- Trained using YOLOv5 and converted to TensorFlow Lite:
  ```python
  yolo_model.train(
      data='./cat_body_detection/3-yaml.yaml',
      epochs=30,
      imgsz=640,
      batch=16,
      workers=4,
      save_dir="./cat_body_detection/output"
  )

### 2. Face Detection – Bounding Box Regressor

This model detects the **cat's face** using bounding box regression.

#### Step-by-Step Workflow:

1. **Label Generation**
   - Used OpenCV’s `haarcascade_frontalcatface.xml` to detect cat faces.
   - Saved bounding box coordinates (x, y, width, height) into CSV files for each image.

2. **Model Training**
   - Trained a **MobileNetV2-based** deep learning model.
   - Inputs: Raw cat images  
   - Outputs: Normalized bounding box coordinates

3. **Reason for Custom Model**
   - Haar cascade can't run inside React Native at runtime.
   - This model replaces Haar with a deep learning-based solution for mobile.

4. **Evaluation**
   - Evaluated performance using:
     - **IoU (Intersection over Union)**
     - **GIoU (Generalized IoU)**
   - Visualized predictions during validation.

---

### Conjunctivitis Detection – CNN Classifier

This is the **main model** used to assess the likelihood of conjunctivitis from the cropped cats face.

#### Task: Binary Classification  
- Classes: **Healthy** vs **Non-Healthy**

#### Model Architecture
- Based on **MobileNetV2** (pretrained on ImageNet)
- Custom classification head:
  - GlobalAveragePooling2D → Dense(128, relu) → Dropout → Dense(1, sigmoid)

#### Risk Mapping (based on model output):
| Score Range     | Risk Level          |
|-----------------|---------------------|
| ≤ 0.5           | Healthy             |
| 0.5 – 0.65      | Low Chance          |
| 0.65 – 0.8      | Medium Chance       |
| > 0.8           | High Chance         |

#### Key Training Techniques
- **Label smoothing** to reduce overconfidence
- **Class weighting** to address imbalance
- **Heavy image augmentation**:
  - Rotation  
  - Zoom  
  - Brightness changes  
  - Translation  

> [**Sample Dataset (Google Drive)**](https://drive.google.com/drive/folders/1sXdw-8b0ZTOrsPKWwvCUm7je000vs3PY?usp=drive_link)

---

### Mobile App Stack

| Component        | Technology           |
|------------------|----------------------|
| Frontend UI       | React Native + Expo |
| ML Inference      | TensorFlow Lite     |
| Deployment        | iOS App Store        |
| Offline Support   | Yes (Fully on-device) |

> ℹ️ Initially experimented with **TensorFlow.js**, but later ejected from Expo and used **native TensorFlow Lite** to improve performance and model compatibility.

---

## Evaluation Highlights

- ✅ **Balanced classes** using `class_weight` from `sklearn` to handle class imbalance
- 📉 **Very low validation split** used intentionally to maximize training data (due to limited image availability)
- 📈 **Evaluation tools**:
  - Confusion Matrix
  - Classification Report
- 📊 **Visualizations**:
  - Accuracy vs. Loss curves
  - Confusion matrix heatmap
  - Classification report heatmap

---

## Setup Instructions

Clone and run the app locally with Expo:

```bash
git clone https://github.com/BekimRexh/eyescanmycat.git
cd eyescanmycat
npm install
expo start
```
---


## App Download

 [**Download EyeScanMyCat on iOS**](https://apps.apple.com/gb/app/eyescanmycat/id6740725884)  

---

## Future Improvements

- Add blepharitis (eyelid inflammation) detection
- Improve bounding box model with confidence scoring
- Include in-app educational tips for cat owners

---

## Author

**Bekim Rexhepi**  
🔗 [LinkedIn](https://www.linkedin.com/in/bekim-rexhepi/)  
💻 [GitHub](https://github.com/BekimRexh)  

---

## Disclaimer

This app is intended for **informational purposes only** and does **not** replace professional veterinary advice.  
Always consult a licensed veterinarian for any medical concerns regarding your pet.

---

## License

**MIT License**  
Open to contributions. For educational and non-commercial use.




