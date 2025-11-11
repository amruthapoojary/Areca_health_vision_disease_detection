from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from torchvision import transforms
from PIL import Image
import timm
from gtts import gTTS
import io
import os
import cv2
import numpy as np
from skimage.feature import graycomatrix, graycoprops


# ------------------------------------------------
# Flask Setup
# ------------------------------------------------
app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ------------------------------------------------
# Create Save Directory for Uploaded Files
# ------------------------------------------------
SAVE_DIR = "uploaded_images"
os.makedirs(SAVE_DIR, exist_ok=True)

# ------------------------------------------------
# Load Models
# ------------------------------------------------
models = {}

# Part Detection Model
models['part'] = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=4)
models['part'].load_state_dict(torch.load('models/model_part.pth', map_location=device))
models['part'].to(device).eval()
part_classes = ['Fruit', 'Leaf', 'Trunk', 'not_areca']

# Leaf Disease Model
models['leaf'] = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
models['leaf'].load_state_dict(torch.load('models/leaf_disease_model.pth', map_location=device))
models['leaf'].to(device).eval()
leaf_classes = ['Healthy_Leaf', 'Yellow_leaf_disease']

# Fruit Disease Model
models['fruit'] = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
models['fruit'].load_state_dict(torch.load('models/fruit_disease_model.pth', map_location=device))
models['fruit'].to(device).eval()
fruit_classes = ['Fruit_rot', 'Healthy_Fruit']

# Trunk Disease Model
models['trunk'] = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
models['trunk'].load_state_dict(torch.load('models/trunk_disease_model.pth', map_location=device))
models['trunk'].to(device).eval()
trunk_classes = ['Healthy_Trunk', 'Stem_bleeding']

# ------------------------------------------------
# Transform for Model Input
# ------------------------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ------------------------------------------------
# Feature Extraction Function (Real Values)
# ------------------------------------------------
def extract_real_features(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))

    # --- 1. Color Variation (std deviation of saturation channel) ---
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    color_variation = np.std(hsv[:, :, 1])

    # --- 2. Texture Pattern (GLCM contrast) ---
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    glcm = graycomatrix(gray, distances=[5], angles=[0], levels=256, symmetric=True, normed=True)
    texture_pattern = graycoprops(glcm, 'contrast')[0, 0]
  

    # --- 3. Shape Consistency (edge density) ---
    edges = cv2.Canny(gray, 100, 200)
    shape_consistency = np.sum(edges > 0) / (224 * 224) * 100

    # --- 4. Spot Density (dark patch ratio) ---
    _, thresh = cv2.threshold(gray, 60, 255, cv2.THRESH_BINARY_INV)
    spot_density = np.sum(thresh > 0) / (224 * 224) * 100

    # Normalize to 0–100 range
    color_variation = np.clip(color_variation / 50 * 100, 0, 100)
    texture_pattern = np.clip(texture_pattern / 50 * 100, 0, 100)
    shape_consistency = np.clip(shape_consistency, 0, 100)
    spot_density = np.clip(spot_density, 0, 100)

    return [
        {"feature": "Color Variation", "weight": float(color_variation)},
        {"feature": "Texture Pattern", "weight": float(texture_pattern)},
        {"feature": "Shape Consistency", "weight": float(shape_consistency)},
        {"feature": "Spot Density", "weight": float(spot_density)}
    ]

# ------------------------------------------------
# Helper Function for Predictions
# ------------------------------------------------
def predict_with_probs(model, classes, image):
    """Return label, confidence (0–1), and all class probabilities"""
    img_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
    conf = float(probs.max())
    pred_label = classes[int(probs.argmax())]
    prob_list = [{"label": classes[i], "prob": float(probs[i])} for i in range(len(classes))]
    return pred_label, conf, prob_list

# ------------------------------------------------
# Main Prediction Route (Full JSON for Frontend)
# ------------------------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    img_path = os.path.join(SAVE_DIR, file.filename)
    file.save(img_path)
    image = Image.open(file.stream).convert('RGB')

    # Step 1: Identify part (Fruit / Leaf / Trunk / not_areca)
    part, part_conf, part_probs = predict_with_probs(models['part'], part_classes, image)

    # Compute part confidence dictionary for radar chart
    part_confidences = {part_classes[i]: float(part_probs[i]['prob']) for i in range(len(part_classes))}

    if part == 'not_areca':
        return jsonify({
            'prediction': 'not_areca',
            'confidence': round(part_conf, 4),
            'part': part,
            'part_confidence': round(part_conf, 4),
            'part_probs': part_probs,
            'condition_probs': [],
            'feature_importance': [],
            'disease_risk': 0,
            'part_confidences': part_confidences,
            'message': 'This image does not belong to an arecanut plant.'
        })

    # Step 2: Disease detection
    if part == 'Leaf':
        disease, conf, cond_probs = predict_with_probs(models['leaf'], leaf_classes, image)
    elif part == 'Fruit':
        disease, conf, cond_probs = predict_with_probs(models['fruit'], fruit_classes, image)
    elif part == 'Trunk':
        disease, conf, cond_probs = predict_with_probs(models['trunk'], trunk_classes, image)
    else:
        disease, conf, cond_probs = 'Unknown', 0, []

    # Step 3: Extract visual feature importance
    features = extract_real_features(img_path)

    # Step 4: Disease risk (simple derived metric)
    disease_risk = round(conf * 0.8 + part_conf * 0.2, 4)

    # Step 5: Label mapping for frontend
    disease_map = {
        'Healthy_Leaf': 'healthy_leaf',
        'Yellow_leaf_disease': 'diseased_leaf',
        'Healthy_Fruit': 'healthy_fruit',
        'Fruit_rot': 'diseased_fruit',
        'Healthy_Trunk': 'healthy_stem',
        'Stem_bleeding': 'diseased_stem'
    }
    prediction_key = disease_map.get(disease, 'unknown')

    return jsonify({
        'prediction': prediction_key,
        'confidence': round(conf, 4),
        'part': part,
        'part_confidence': round(part_conf, 4),
        'part_probs': part_probs,
        'condition_probs': cond_probs,
        'feature_importance': features,
        'disease_risk': disease_risk,
        'part_confidences': part_confidences
    })

# ------------------------------------------------
# Short Recommendation Audio
# ------------------------------------------------
@app.route('/recommendation_audio', methods=['POST'])
def recommendation_audio():
    data = request.get_json()
    disease = data.get('condition', 'Healthy')

    text_dict = {
        'Yellow_leaf_disease': "Yellow leaf disease is affecting your arecanut leaves.",
        'Fruit_rot': "Fruit rot has been detected on your arecanut.",
        'Stem_bleeding': "Stem bleeding symptoms found on the trunk.",
        'Healthy_Leaf': "The leaf looks green and healthy.",
        'Healthy_Fruit': "The fruit appears healthy.",
        'Healthy_Trunk': "The trunk looks healthy and strong."
    }

    text = text_dict.get(disease, "This arecanut part looks healthy.")
    tts = gTTS(text=text, lang='en')
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    return send_file(audio_bytes, mimetype='audio/mpeg', download_name='recommendation.mp3')

# ------------------------------------------------
# Detailed Recommendation Audio
# ------------------------------------------------
@app.route('/detailed_recommendation_audio', methods=['POST'])
def detailed_recommendation_audio():
    data = request.get_json()
    disease = data.get('condition', 'Healthy')

    text_dict = {
        'Yellow_leaf_disease': (
            "Yellow leaf disease is caused by nutrient deficiency and poor soil drainage. "
            "Maintain good soil nutrition and apply fertilizers like urea and potash as recommended."
        ),
        'Fruit_rot': (
            "Fruit rot, also called Koleroga, is caused by Phytophthora palmivora. "
            "Spray one percent Bordeaux mixture or Ridomil Gold. Remove infected nuts and improve drainage."
        ),
        'Stem_bleeding': (
            "Stem bleeding is caused by Ganoderma fungus. "
            "Remove infected tissues and apply Trichoderma paste or Bordeaux mixture to the wound. "
            "Avoid water stagnation around the plant base."
        ),
        'Healthy_Leaf': "The leaf is healthy; maintain regular irrigation and pest monitoring.",
        'Healthy_Fruit': "The fruit is healthy; continue proper fertilization and pest control.",
        'Healthy_Trunk': "The trunk is healthy; maintain good plantation hygiene."
    }

    text = text_dict.get(disease, "This arecanut part is healthy and does not require treatment.")
    tts = gTTS(text=text, lang='en')
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    return send_file(audio_bytes, mimetype='audio/mpeg', download_name='detailed_recommendation.mp3')

# ------------------------------------------------
# Run Flask
# ------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5001)
