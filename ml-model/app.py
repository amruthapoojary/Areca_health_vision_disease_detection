from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from torchvision import transforms
from PIL import Image
import timm
from gtts import gTTS
import io

app = Flask(__name__)
CORS(app)

# -------------------------------
# Load trained models
# -------------------------------
models = {}

# Stem Bleeding Model
models['stem_bleeding'] = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
models['stem_bleeding'].load_state_dict(torch.load('model/stem_bleeding_deit3.pth', map_location=torch.device('cpu')))
models['stem_bleeding'].eval()

# Fruit Rot Model
models['fruit_rot'] = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
models['fruit_rot'].load_state_dict(torch.load('model/fruit_rot_deit1.pth', map_location=torch.device('cpu')))
models['fruit_rot'].eval()

# Yellow Leaf Model
models['yellow_leaf'] = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
models['yellow_leaf'].load_state_dict(torch.load('model/yellow_leaf_model.pth', map_location=torch.device('cpu')))
models['yellow_leaf'].eval()

# -------------------------------
# Image Preprocessing
# -------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5],
                         std=[0.5, 0.5, 0.5])
])

# -------------------------------
# Class Labels
# -------------------------------
CLASS_LABELS = {
    "stem_bleeding": ['diseased_stem', 'healthy_stem'],
    "fruit_rot": ['diseased_fruit', 'healthy_fruit'],
    "yellow_leaf": ['healthy_leaf', 'diseased_leaf']
}

# -------------------------------
# Prediction Route
# -------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    if 'disease_type' not in request.form:
        return jsonify({'error': 'Missing disease_type (stem_bleeding, fruit_rot, yellow_leaf)'}), 400

    disease_type = request.form['disease_type']

    if disease_type not in models:
        return jsonify({'error': f'Invalid disease_type: {disease_type}'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        image = Image.open(file.stream).convert('RGB')
        image_tensor = transform(image).unsqueeze(0)

        model = models[disease_type]
        with torch.no_grad():
            outputs = model(image_tensor)
            _, predicted = torch.max(outputs, 1)
            predicted_class = CLASS_LABELS[disease_type][predicted.item()]

        return jsonify({
            'disease_type': disease_type,
            'prediction': predicted_class
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------------------------------
# Recommendation TTS Route
# -------------------------------
@app.route('/recommendation_audio', methods=['POST'])
def recommendation_audio():
    data = request.get_json()
    prediction = data.get('disease_type')
    
    if not prediction:
        return {'error': 'disease_type missing'}, 400
    
    # ✅ Simple messages for each prediction
    text_dict = {
    'diseased_stem': "Stem bleeding is affecting your plant's stem.",
    'diseased_fruit': "Fruit rot has appeared on your arecanuts.",
    'diseased_leaf': "Yellow leaf disease is present on the leaves.",
    'healthy_stem': "The stem looks strong and healthy.",
    'healthy_fruit': "The fruits look healthy and fine.",
    'healthy_leaf': "The leaves look green and healthy."
    }

    text = text_dict.get(prediction, "Healthy")

    # Generate TTS audio
    tts = gTTS(text=text, lang='en')
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    
    return send_file(audio_bytes, mimetype='audio/mpeg', download_name='recommendation.mp3')

@app.route('/detailed_recommendation_audio', methods=['POST'])
def detailed_recommendation_audio():
    data = request.get_json()
    disease_type = data.get('disease_type')
    
    if not disease_type:
        return {'error': 'disease_type missing'}, 400

    # ✅ Detailed messages for recommendation page
    text_dict = {
        'diseased_stem': (
            "Stem bleeding is a fungal disease in arecanut caused by Ganoderma lucidum. "
            "It causes reddish-brown liquid to ooze from the stem, which weakens the plant. "
            "To manage this, apply Tricyclazole 75% WP, Copper Oxychloride, Bordeaux Paste, "
            "Trichoderma viride, and Neem Cake as instructed on the label."
        ),
        'diseased_fruit': (
            "Fruit rot affects arecanut fruits leading to decay and loss of yield. "
            "Remove affected fruits and apply Carbendazim or Mancozeb fungicide as per instructions."
        ),
        'diseased_leaf': (
            "Yellow leaf disease is caused by nutrient deficiencies in the soil. "
            "Maintain soil nutrition and apply appropriate fertilizers to support healthy leaves."
        ),
        'fruit_rot': (
        "Fruit rot, also called Koleroga, is caused by Phytophthora palmivora. "
        "It causes rotting and premature dropping of arecanut fruits, especially during the monsoon. "
        "Recommended treatments include spraying 1% Bordeaux mixture, using Ridomil Gold, Phosphorus Acid, "
        "Trichoderma harzianum, Neem Extract, and Mancozeb 75% WP as per instructions."
    )
    }

    text = text_dict.get(disease_type, "This plant is healthy and does not need any treatment.")

    # Generate TTS audio
    tts = gTTS(text=text, lang='en')
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)

    return send_file(audio_bytes, mimetype='audio/mpeg', download_name='detailed_recommendation.mp3')


if __name__ == '__main__':
    app.run(debug=True, port=5001)
