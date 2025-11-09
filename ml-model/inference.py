import torch
from torchvision import transforms
from PIL import Image
import timm

# ------------------------------------------------
# 1. Device setup
# ------------------------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ------------------------------------------------
# 2. Common transform
# ------------------------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ------------------------------------------------
# 3. Define models and load weights
# ------------------------------------------------

# Part detection model
model_part = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=4)
model_part.load_state_dict(torch.load("models/model_part.pth", map_location=device))
model_part.to(device)
model_part.eval()
part_classes = ['Fruit', 'Leaf', 'not_areca', 'Trunk']

# Leaf disease model
model_leaf = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
model_leaf.load_state_dict(torch.load("models/leaf_disease_model.pth", map_location=device))
model_leaf.to(device)
model_leaf.eval()
leaf_classes = ['Healthy_Leaf', 'Yellow_leaf_disease']

# Fruit disease model
model_fruit = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
model_fruit.load_state_dict(torch.load("models/fruit_disease_model.pth", map_location=device))
model_fruit.to(device)
model_fruit.eval()
fruit_classes = ['Fruit_rot', 'Healthy_Fruit']

# Trunk disease model
model_trunk = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
model_trunk.load_state_dict(torch.load("models/trunk_disease_model.pth", map_location=device))
model_trunk.to(device)
model_trunk.eval()
trunk_classes = ['Healthy_Trunk', 'Stem_bleeding']


# ------------------------------------------------
# 4. Prediction helpers
# ------------------------------------------------
def predict_image(model, classes, image_path):
    image = Image.open(image_path).convert("RGB")
    img_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, 1)
        return classes[pred.item()], conf.item() * 100


def predict_areca_health(image_path):
    # Step 1: Predict plant part
    part, part_conf = predict_image(model_part, part_classes, image_path)
    print(f"Step 1: Predicted Part: {part} ({part_conf:.2f}%)")

    if part == "not_areca":
        print("Result: This is not an arecanut plant image.")
        return {"part": "not_areca", "message": "This is not an arecanut plant image."}

    # Step 2: Predict disease based on part
    if part == "Leaf":
        disease, conf = predict_image(model_leaf, leaf_classes, image_path)
    elif part == "Fruit":
        disease, conf = predict_image(model_fruit, fruit_classes, image_path)
    elif part == "Trunk":
        disease, conf = predict_image(model_trunk, trunk_classes, image_path)
    else:
        disease, conf = "Unknown", 0

    print(f"Step 2: Predicted Disease: {disease} ({conf:.2f}%)")

    return {
        "part": part,
        "part_confidence": part_conf,
        "condition": disease,
        "condition_confidence": conf
    }


# ------------------------------------------------
# 5. Test example
# ------------------------------------------------
if __name__ == "__main__":
    image_path = "yellow leaf disease_original_94.jpg_062babd4-3f30-4f79-a2a4-78692dc197a9.jpg"
    result = predict_areca_health(image_path)
    print("\nFinal Prediction:", result)
