import random

def predict_image(image_bytes: bytes) -> str:
    labels = ["organik", "anorganik", "plastik", "logam", "kaca"]
    return random.choice(labels)
