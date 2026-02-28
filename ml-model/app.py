# app.py  (complete - with your DB credentials filled)
import os
import io
import json
import cv2
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from torchvision import transforms
import timm
from gtts import gTTS
import mysql.connector
from skimage.feature import graycomatrix, graycoprops

# ------------------------------------------------
# CONFIG - EDIT THESE ONLY IF NEEDED
# ------------------------------------------------
DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = "4SF22CS023"
DB_NAME = "arecanut_detection"

SAVE_DIR = "uploaded_images"
os.makedirs(SAVE_DIR, exist_ok=True)

# MODEL PATHS - edit if your filenames differ
MODEL_DIR = "model"
PART_MODEL_PATH = os.path.join(MODEL_DIR, "part_classifier_best.pth")
LEAF_STAGE_PATH = os.path.join(MODEL_DIR, "leaf_stage_final.pth")
FRUIT_STAGE_PATH = os.path.join(MODEL_DIR, "fruit_stage_final.pth")
TRUNK_STAGE_PATH = os.path.join(MODEL_DIR, "trunk_stage_final.pth")

# Optional disease models (if you trained these)
LEAF_DISEASE_PATH = os.path.join(MODEL_DIR, "leaf_disease_best.pth")
FRUIT_DISEASE_PATH = os.path.join(MODEL_DIR, "fruit_disease_best.pth")
TRUNK_DISEASE_PATH = os.path.join(MODEL_DIR, "trunk_disease_best.pth")

CLASS_MAP_DIR = MODEL_DIR  # where class_map jsons live (if you saved them)
DISEASE_INFO = {
    "fruit_rot": {
        "cause": "Fruit rot is mainly caused by the pathogen Phytophthora palmivora, which spreads rapidly in humid and rainy conditions.",
        "description": "This disease leads to brown water-soaked lesions on nuts, resulting in rotting and premature nut fall."
    },
    "stem_bleeding": {
        "cause": "Stem bleeding occurs due to fungus Ganoderma lucidum, which infects the trunk when the soil moisture levels remain high.",
        "description": "It causes reddish brown gummy exudation on the stem and weakens the plant structure over time."
    },
    "bud_rot": {
        "cause": "Bud rot is caused by fungal infection, commonly Phytophthora species, affecting the growing bud due to excess moisture.",
        "description": "It results in rotting of the central shoot leading to wilting and eventual plant death if untreated."
    },
    "crown_rot": {
        "cause": "Crown rot develops due to waterlogging and fungal buildup around the crown region of the arecanut palm.",
        "description": "It leads to rotting of tissues near the crown, causing yellowing and drying of leaves."
    },
    "leaf_blight": {
        "cause": "Leaf blight is caused by fungal pathogens like Colletotrichum and Helminthosporium under humid and wet conditions.",
        "description": "The disease creates elongated brown necrotic patches which gradually spread across the leaf surface."
    }
}

# ------------------------------------------------
# Flask / Device
# ------------------------------------------------
app = Flask(__name__)
CORS(app)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ------------------------------------------------
# Helper: load JSON class map if exists, else fallback
# ------------------------------------------------
def load_class_map(base_name, fallback_list):
    path = os.path.join(CLASS_MAP_DIR, f"{base_name}_class_map.json")
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                m = json.load(f)
            arr = [m[str(i)] if str(i) in m else m[i] for i in range(len(m))]
            return arr
        except Exception:
            return fallback_list
    return fallback_list

# ------------------------------------------------
# Default class names (fallbacks)
# ------------------------------------------------
part_classes = load_class_map("part", ["Fruit", "Leaf", "Trunk", "not_areca"])  # already alphabetical
leaf_stage_classes = load_class_map("leaf_stage", ["Critical_leaf_disease", "Early_leaf_disease", "Healthy_Leaf", "Moderate_leaf_disease"])
fruit_stage_classes = load_class_map("fruit_stage", ["Critical_fruit_rot", "Early_fruit_rot", "Healthy_Fruit", "Moderate_fruit_rot"])
trunk_stage_classes = load_class_map("trunk_stage", ["Critical_stem_bleeding", "Early_stem_bleeding", "Healthy_Trunk", "Moderate_stem_bleeding"])
leaf_disease_classes = load_class_map("leaf_disease", ["Healthy_Leaf", "Yellow_leaf_disease"])
fruit_disease_classes = load_class_map("fruit_disease", ["Healthy_Fruit", "Fruit_rot"])
trunk_disease_classes = load_class_map("trunk_disease", ["Healthy_Trunk", "Stem_bleeding"])


# ------------------------------------------------
# Load Models (safe loader)
# ------------------------------------------------
models = {}
def safe_load_model(model_key, model_path, num_classes):
    if not os.path.exists(model_path):
        print(f"[WARN] model file not found: {model_path} (skipping {model_key})")
        return None
    m = timm.create_model("deit3_small_patch16_224", pretrained=False, num_classes=num_classes)
    state = torch.load(model_path, map_location=device)
    m.load_state_dict(state)
    m.to(device).eval()
    print(f"[OK] Loaded {model_key} from {model_path}")
    return m

models['part'] = safe_load_model('part', PART_MODEL_PATH, len(part_classes))
models['leaf_stage'] = safe_load_model('leaf_stage', LEAF_STAGE_PATH, len(leaf_stage_classes))
models['fruit_stage'] = safe_load_model('fruit_stage', FRUIT_STAGE_PATH, len(fruit_stage_classes))
models['trunk_stage'] = safe_load_model('trunk_stage', TRUNK_STAGE_PATH, len(trunk_stage_classes))
models['leaf_disease'] = safe_load_model('leaf_disease', LEAF_DISEASE_PATH, len(leaf_disease_classes))
models['fruit_disease'] = safe_load_model('fruit_disease', FRUIT_DISEASE_PATH, len(fruit_disease_classes))
models['trunk_disease'] = safe_load_model('trunk_disease', TRUNK_DISEASE_PATH, len(trunk_disease_classes))

# ------------------------------------------------
# Transform
# ------------------------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ------------------------------------------------
# Feature extraction (same as your code)
# ------------------------------------------------
def extract_real_features(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    color_variation = np.std(hsv[:, :, 1])
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    glcm = graycomatrix(gray, distances=[5], angles=[0], levels=256, symmetric=True, normed=True)
    texture_pattern = graycoprops(glcm, 'contrast')[0, 0]
    edges = cv2.Canny(gray, 100, 200)
    shape_consistency = np.sum(edges > 0) / (224 * 224) * 100
    _, thresh = cv2.threshold(gray, 60, 255, cv2.THRESH_BINARY_INV)
    spot_density = np.sum(thresh > 0) / (224 * 224) * 100

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
# Prediction helper
# ------------------------------------------------
def predict_with_probs(model, classes, pil_image):
    if model is None:
        return ("unknown", 0.0, [])
    img_tensor = transform(pil_image).unsqueeze(0).to(device)
    with torch.no_grad():
        out = model(img_tensor)
        probs = torch.softmax(out, dim=1).cpu().numpy()[0]
    idx = int(np.argmax(probs))
    return (classes[idx], float(probs[idx]), [{"label": classes[i], "prob": float(probs[i])} for i in range(len(classes))])

# ------------------------------------------------
# DB Helper
# ------------------------------------------------
def get_db_connection():
    return mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME)

def fetch_recommendations_from_db(disease_key, stage_key, limit=10):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    query = "SELECT id, title, description, image_url, buy_link FROM recommendation_cards WHERE disease = %s AND stage = %s"
    cur.execute(query, (disease_key, stage_key))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

# ------------------------------------------------
# Parse model classnames
# ------------------------------------------------
def parse_stage_classname(class_name):
    if not class_name:
        return (None, None)
    s = class_name.strip().replace("-", "_")
    parts = s.split("_", 1)
    if len(parts) == 1:
        return (parts[0].lower(), None)
    stage = parts[0].lower()
    disease = parts[1].lower().replace(" ", "_")
    if "leaf" in disease and ("yellow" in disease or "diseas" in disease):
        disease_key = "yellow_leaf" if "yellow" in disease else "diseased_leaf"
    elif "stem" in disease or "trunk" in disease or "bleeding" in disease:
        disease_key = "stem_bleeding"
    elif "fruit" in disease or "rot" in disease:
        disease_key = "fruit_rot"
    else:
        disease_key = disease
    if stage.startswith("early"):
        stage_key = "early"
    elif stage.startswith("moder") or stage.startswith("mid"):
        stage_key = "moderate"
    elif stage.startswith("crit"):
        stage_key = "critical"
    elif stage.startswith("healthy"):
        stage_key = "healthy"
    else:
        stage_key = stage
    return disease_key, stage_key

# ------------------------------------------------
# /predict endpoint
# ------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict_route():
    if 'file' not in request.files:
        return jsonify({"status":"error","message":"No file uploaded"}), 400
    f = request.files['file']
    filename = f.filename
    save_path = os.path.join(SAVE_DIR, filename)
    f.save(save_path)
    pil_img = Image.open(save_path).convert("RGB")

    # Part detection
    part_label, part_conf, part_probs = predict_with_probs(models.get('part'), part_classes, pil_img)
    part_confidences = {part_probs[i]['label']: part_probs[i]['prob'] for i in range(len(part_probs))}

    if part_label.lower() == 'not_areca':
        return jsonify({
            "status":"success",
            "prediction":"not_areca",
            "part": part_label,
            "part_confidence": round(part_conf,4),
            "part_probs": part_probs,
            "recommendations": [],
            "feature_importance": extract_real_features(save_path)
        }), 200

    # Optional disease classifier
    disease_label, disease_conf, disease_probs = (None, 0.0, [])
    if part_label.lower().startswith("leaf") and models.get('leaf_disease') is not None:
        disease_label, disease_conf, disease_probs = predict_with_probs(models['leaf_disease'], leaf_disease_classes, pil_img)
    elif part_label.lower().startswith("fruit") and models.get('fruit_disease') is not None:
        disease_label, disease_conf, disease_probs = predict_with_probs(models['fruit_disease'], fruit_disease_classes, pil_img)
    elif part_label.lower().startswith("trunk") and models.get('trunk_disease') is not None:
        disease_label, disease_conf, disease_probs = predict_with_probs(models['trunk_disease'], trunk_disease_classes, pil_img)

    # Stage classification
    stage_label, stage_conf, stage_probs = (None, 0.0, [])
    if part_label.lower().startswith("leaf") and models.get('leaf_stage') is not None:
        stage_label, stage_conf, stage_probs = predict_with_probs(models['leaf_stage'], leaf_stage_classes, pil_img)
    elif part_label.lower().startswith("fruit") and models.get('fruit_stage') is not None:
        stage_label, stage_conf, stage_probs = predict_with_probs(models['fruit_stage'], fruit_stage_classes, pil_img)
    elif part_label.lower().startswith("trunk") and models.get('trunk_stage') is not None:
        stage_label, stage_conf, stage_probs = predict_with_probs(models['trunk_stage'], trunk_stage_classes, pil_img)

    # Features + risk
    features = extract_real_features(save_path)
    overall_conf = max(part_conf, stage_conf, disease_conf)
    disease_risk = round(overall_conf * 0.95 + 0.05 * np.mean([f['weight'] for f in features]) / 100, 4)

    # Map stage_label -> disease_key, stage_key
    disease_key, stage_key = parse_stage_classname(stage_label) if stage_label else (None, None)
    if not disease_key and disease_label:
        disease_key = disease_label.lower().replace(" ", "_")
    if not stage_key and disease_label and "_" in disease_label:
        d_k, s_k = parse_stage_classname(disease_label)
        if s_k:
            stage_key = s_k
            if not disease_key:
                disease_key = d_k
    if not disease_key:
        if part_label.lower().startswith("leaf"):
            disease_key = "yellow_leaf" if (disease_label and "yellow" in disease_label.lower()) else "diseased_leaf"
        elif part_label.lower().startswith("fruit"):
            disease_key = "fruit_rot"
        elif part_label.lower().startswith("trunk"):
            disease_key = "stem_bleeding"
    if not stage_key:
        if stage_label:
            if "early" in stage_label.lower():
                stage_key = "early"
            elif "moder" in stage_label.lower():
                stage_key = "moderate"
            elif "crit" in stage_label.lower():
                stage_key = "critical"
            elif "healthy" in stage_label.lower():
                stage_key = "healthy"
        else:
            stage_key = "early"

    # Fetch recommendations from DB
    try:
        recs = fetch_recommendations_from_db(disease_key, stage_key)
    except Exception as e:
        recs = []
        print("[DB ERROR]", str(e))

    response = {
        "status": "success",
        "part": part_label,
        "part_confidence": round(part_conf, 4),
        "part_probs": part_probs,
        "disease_label": disease_label,
        "disease_confidence": round(disease_conf, 4),
        "disease_probs": disease_probs,
        "stage_label": stage_label,
        "stage_confidence": round(stage_conf, 4),
        "stage_probs": stage_probs,
        "feature_importance": features,
        "disease_risk": disease_risk,
        "recommendations": recs,
        "db_query_keys": {"disease_key": disease_key, "stage_key": stage_key}
    }
    return jsonify(response), 200
# --- ALL YOUR ORIGINAL CODE ABOVE (unchanged) ---


# ------------------------------------------------
# NEW ENDPOINT: /recommendations  (added safely)
# ------------------------------------------------
@app.route("/recommendations", methods=["GET"])
def get_recommendations_route():
    disease = request.args.get("disease")
    stage = request.args.get("stage")

    if not disease:
        return jsonify({"status": "error", "message": "Missing disease parameter"}), 400
    if not stage:
        stage = "early"   # default

    try:
        recs = fetch_recommendations_from_db(disease, stage)
    except Exception as e:
        print("[DB ERROR]", str(e))
        recs = []

    return jsonify({
        "status": "success",
        "disease": disease,
        "stage": stage,
        "recommendations": recs
    }), 200




# ------------------------------------------------
# Build audio text from recs
# ------------------------------------------------
def build_recommendation_text_from_recs(recs, disease_key, stage_key):
    if not recs:
        return f"No recommendations available for {disease_key} at {stage_key} stage."
    lines = [f"Recommendations for {disease_key.replace('_',' ')} at {stage_key} stage."]
    for i, r in enumerate(recs[:6], start=1):
        title = r.get("title","")
        short = r.get("description","")
        lines.append(f"{i}. {title}. {short}")
    return " ".join(lines)

# ------------------------------------------------
# Audio endpoints (use db recs)
# ------------------------------------------------
@app.route("/recommendation_audio", methods=["POST"])
def recommendation_audio_route():
    data = request.get_json() or {}
    disease_key = data.get("disease_key") or data.get("prediction")
    stage_key = data.get("stage_key") or data.get("stage")
    if not disease_key:
        return jsonify({"status":"error","message":"disease_key missing"}), 400
    recs = fetch_recommendations_from_db(disease_key, stage_key or "early")
    text = build_recommendation_text_from_recs(recs, disease_key, stage_key or "early")
    tts = gTTS(text=text, lang="en")
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    return send_file(audio_bytes, mimetype="audio/mpeg", download_name="rec_short.mp3")

@app.route("/detailed_recommendation_audio", methods=["POST"])
def detailed_recommendation_audio_route():
    data = request.get_json() or {}
    disease_key = data.get("disease_key") or data.get("prediction")
    stage_key = data.get("stage_key") or data.get("stage")
    if not disease_key:
        return jsonify({"status":"error","message":"disease_key missing"}), 400
    recs = fetch_recommendations_from_db(disease_key, stage_key or "early")
    if not recs:
        text = f"Sorry, no detailed recommendations are available for {disease_key} at {stage_key} stage."
    else:
        lines = [f"Detailed recommendations for {disease_key.replace('_',' ')} at {stage_key} stage."]
        for i, r in enumerate(recs[:8], start=1):
            title = r.get("title","")
            desc = r.get("description","")
            lines.append(f"{i}. {title}. {desc}")
        text = " ".join(lines)
    tts = gTTS(text=text, lang="en")
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    return send_file(audio_bytes, mimetype="audio/mpeg", download_name="rec_detailed.mp3")
@app.route("/disease_audio", methods=["POST"])
def disease_audio():
    data = request.get_json() or {}
    disease_type = data.get("disease_type")

    if not disease_type:
        return jsonify({"error": "Missing disease_type"}), 400

    # Split "stem_bleeding_critical" → disease="stem_bleeding", stage="critical"
    try:
        disease, stage = disease_type.rsplit("_", 1)
    except:
        return jsonify({"error": "Invalid disease_type format"}), 400

    if disease not in DISEASE_INFO:
        return jsonify({"error": "Invalid disease"}), 400

    cause = DISEASE_INFO[disease]["cause"]
    description = DISEASE_INFO[disease]["description"]

    text = (
        f"The detected disease is {disease.replace('_',' ')}. "
        f"Stage: {stage} stage. "
        f"Cause: {cause} "
        f"Description: {description}"
    )

    tts = gTTS(text=text, lang="en")
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)

    return send_file(audio_bytes, mimetype="audio/mpeg", download_name="disease_info.mp3")

@app.route("/prediction_audio", methods=["POST"])
def prediction_audio():
    data = request.get_json() or {}
    disease = data.get("disease")
    stage = data.get("stage")

    if not disease:
        return jsonify({"error": "disease missing"}), 400

    # Build simple audio sentence
    text = f"The part detected is {disease.replace('_',' ')} at {stage} stage."

    # Generate audio using gTTS
    tts = gTTS(text=text, lang="en")
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)

    return send_file(audio_bytes, mimetype="audio/mpeg", download_name="prediction.mp3")

# ------------------------------------------------
# Run app
# ------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)
