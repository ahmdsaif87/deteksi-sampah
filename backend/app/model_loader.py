import torch
import io
from torchvision import transforms
from PIL import Image
from app.models.cnn import SampahCNN

model = SampahCNN()
model.load_state_dict(torch.load("sampah_model.pt", map_location="cpu"))
model.eval()

classes = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

def predict_image(image_bytes):
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = transform(image).unsqueeze(0)
    output = model(tensor)
    _, predicted = torch.max(output, 1)
    return classes[predicted.item()]
