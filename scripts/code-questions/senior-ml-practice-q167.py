"""senior-ml-practice-q167：替換 ResNet18 的分類層 model.fc = nn.Linear(model.fc.in_features, 3)。
題目程式載入 ImageNet 權重；驗證環境不能連網，改用 weights=None（結構相同）。"""
import torch
import torch.nn as nn
from torchvision import models

CHOICES = {
    "A": "model.fc = nn.Sequential(model.fc, nn.Softmax(dim=1))",
    "B": "model.fc = nn.Linear(model.fc.in_features, 3)",
    "C": "model.classifier[6] = nn.Linear(4096, 3)",
    "D": "model.fc.out_features = 3",
}

x = torch.randn(2, 3, 224, 224)
res = {}
for k, line in CHOICES.items():
    torch.manual_seed(0)
    model = models.resnet18(weights=None)
    g = {"model": model, "nn": nn}
    try:
        exec(line, g)
        model.eval()
        with torch.no_grad():
            res[k] = tuple(model(x).shape)
    except AttributeError:
        res[k] = AttributeError
    if k == "D":
        assert model.fc.weight.shape == (1000, 512)   # 改屬性不會改權重矩陣

assert res["B"] == (2, 3), res                # 正解
assert res["A"] == (2, 1000), res             # 仍是 1000 類，只是多套了 softmax
assert res["C"] is AttributeError, res        # ResNet 沒有 classifier（那是 VGG／AlexNet 的屬性）
assert res["D"] == (2, 1000), res             # 只改了屬性值，輸出仍是 1000 維

# C 的寫法放在 VGG16 上才是對的（對照，證明這是張冠李戴而不是語法錯）
vgg = models.vgg16(weights=None)
vgg.classifier[6] = nn.Linear(4096, 3)
assert vgg.classifier[6].out_features == 3

# 判斷分界：EfficientNet-B0 與 MobileNetV2 的最後一層是 classifier[1]
eff = models.efficientnet_b0(weights=None)
mob = models.mobilenet_v2(weights=None)
assert isinstance(eff.classifier[1], nn.Linear) and eff.classifier[1].out_features == 1000
assert isinstance(mob.classifier[1], nn.Linear) and mob.classifier[1].out_features == 1000
assert models.resnet18(weights=None).fc.in_features == 512

print("OK", "senior-ml-practice-q167")
