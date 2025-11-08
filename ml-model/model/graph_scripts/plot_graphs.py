import torch
import torch.nn.functional as F
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import timm
import matplotlib.pyplot as plt
import os

# ================= CONFIG ==================
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Binary test folders for each disease
TEST_FOLDERS = {
    "Stem Bleeding": {
        "Healthy": r"D:\user\Amrutha023\major_project\Arecanut_dataset\test\Healthy_Trunk",
        "Diseased": r"D:\user\Amrutha023\major_project\Arecanut_dataset\test\Stem_bleeding"
    },
    "Yellow Leaf": {
        "Healthy": r"D:\user\Amrutha023\major_project\Arecanut_dataset\test\Healthy_Leaf",
        "Diseased": r"D:\user\Amrutha023\major_project\Arecanut_dataset\test\yellow leaf disease"
    },
    "Fruit Rot": {
        "Healthy": r"D:\user\Amrutha023\major_project\Arecanut_dataset\test\Healthy_Nut",
        "Diseased": r"D:\user\Amrutha023\major_project\Arecanut_dataset\test\Mahali_Koleroga"
    }
}

# Model paths
MODELS = {
    "Stem Bleeding": r"D:\user\Amrutha023\arecanut-disease-detection\ml-model\model\stem_bleeding_deit3.pth",
    "Yellow Leaf": r"D:\user\Amrutha023\arecanut-disease-detection\ml-model\model\yellow_leaf_model.pth",
    "Fruit Rot": r"D:\user\Amrutha023\arecanut-disease-detection\ml-model\model\fruit_rot_deit1.pth"
}

# Common transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])
# ===========================================

# Function to prepare binary dataset
def get_binary_dataset(healthy_folder, diseased_folder):
    data_list = []
    labels_list = []

    # Healthy images → label 0
    for f in os.listdir(healthy_folder):
        if f.lower().endswith((".jpg", ".jpeg", ".png")):
            data_list.append(os.path.join(healthy_folder, f))
            labels_list.append(0)

    # Diseased images → label 1
    for f in os.listdir(diseased_folder):
        if f.lower().endswith((".jpg", ".jpeg", ".png")):
            data_list.append(os.path.join(diseased_folder, f))
            labels_list.append(1)

    return data_list, labels_list

# Custom Dataset
from torch.utils.data import Dataset
from PIL import Image

class BinaryDataset(Dataset):
    def __init__(self, img_paths, labels, transform=None):
        self.img_paths = img_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.img_paths)

    def __getitem__(self, idx):
        img = Image.open(self.img_paths[idx]).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, self.labels[idx]

# Function to evaluate model
def evaluate_model(model_path, disease_name):
    print(f"\nEvaluating {disease_name} model...")

    folders = TEST_FOLDERS[disease_name]
    img_paths, labels = get_binary_dataset(folders["Healthy"], folders["Diseased"])
    dataset = BinaryDataset(img_paths, labels, transform=transform)
    loader = DataLoader(dataset, batch_size=16, shuffle=False)

    model = timm.create_model('deit3_small_patch16_224', pretrained=False, num_classes=2)
    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()

    all_preds, all_labels = [], []

    with torch.no_grad():
        for inputs, lbls in loader:
            inputs = inputs.to(DEVICE)
            outputs = model(inputs)
            preds = torch.argmax(outputs, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(lbls.numpy())

    cm = confusion_matrix(all_labels, all_preds)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=["Healthy", "Diseased"])
    disp.plot(cmap=plt.cm.Blues)
    plt.title(f"{disease_name} - Confusion Matrix")
    plt.show()

# ================= MAIN ====================
for disease_name, model_path in MODELS.items():
    evaluate_model(model_path, disease_name)
# ===========================================
