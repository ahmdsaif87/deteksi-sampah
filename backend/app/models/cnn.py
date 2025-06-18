import torch.nn as nn
import torch.nn.functional as F

class SampahCNN(nn.Module):
    def __init__(self):
        super(SampahCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(32 * 64 * 64, 128)
        self.fc2 = nn.Linear(128, 6)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))  # [B, 16, 128, 128]
        x = self.pool(F.relu(self.conv2(x)))  # [B, 32, 64, 64]
        x = x.view(-1, 32 * 64 * 64)
        x = F.relu(self.fc1(x))
        return self.fc2(x)
