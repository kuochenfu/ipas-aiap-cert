"""senior-ml-practice-q163：先換 fc 再凍結全部參數 → 新分類層也被凍結，backward 拋 RuntimeError。
題目程式載入 ImageNet 權重；驗證環境不能連網，改用 weights=None（結構、參數與 requires_grad 行為相同）。"""
import torch
import torch.nn as nn
from torchvision import models

CODE = r'''import torch
import torch.nn as nn
from torchvision import models

model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
model.fc = nn.Linear(model.fc.in_features, 4)      # 4 種表面瑕疵
for p in model.parameters():
    p.requires_grad = False                         # 凍結預訓練骨幹

opt = torch.optim.Adam(model.parameters(), lr=1e-3)
x = torch.randn(8, 3, 224, 224)
y = torch.randint(0, 4, (8,))
loss = nn.CrossEntropyLoss()(model(x), y)
loss.backward()
opt.step()
'''

EXPECTED = "RuntimeError: element 0 of tensors does not require grad and does not have a grad_fn"

OFFLINE = CODE.replace("weights=models.ResNet18_Weights.IMAGENET1K_V1", "weights=None")
assert OFFLINE != CODE


def run(code):
    torch.manual_seed(0)
    g = {}
    try:
        exec(code, g)
    except RuntimeError as e:
        return f"RuntimeError: {e}", g
    return None, g


err, _ = run(OFFLINE)
assert err == EXPECTED, err

replace = "model.fc = nn.Linear(model.fc.in_features, 4)      # 4 種表面瑕疵\n"
freeze = ("for p in model.parameters():\n"
          "    p.requires_grad = False                         # 凍結預訓練骨幹\n")
assert replace in OFFLINE and freeze in OFFLINE

# 正解 C：先凍結、再換 fc → 不拋例外，只有 fc 有梯度，骨幹沒有
fixed = OFFLINE.replace(replace + freeze, freeze + replace)
err, g = run(fixed)
assert err is None
m = g["model"]
assert m.fc.weight.grad is not None and m.fc.bias.grad is not None
assert all(p.grad is None for n, p in m.named_parameters() if not n.startswith("fc."))

# A：最佳化器只傳 model.fc.parameters()，fc 仍被凍結，照樣拋同一個例外
a = OFFLINE.replace("torch.optim.Adam(model.parameters(), lr=1e-3)",
                    "torch.optim.Adam(model.fc.parameters(), lr=1e-3)")
assert a != OFFLINE and run(a)[0] == EXPECTED

# B：凍結後呼叫 model.train()，train() 只切換 Dropout／BatchNorm 行為，不會恢復 requires_grad
b = OFFLINE.replace(freeze, freeze + "model.train()\n")
assert run(b)[0] == EXPECTED

# D：backward(retain_graph=True) 只是保留計算圖，沒有計算圖可保留，照樣拋例外
d = OFFLINE.replace("loss.backward()", "loss.backward(retain_graph=True)")
assert d != OFFLINE and run(d)[0] == EXPECTED

# 判斷分界：凍結全部後另外解凍 fc，也能修正
alt = OFFLINE.replace(freeze, freeze + "for p in model.fc.parameters():\n    p.requires_grad = True\n")
err, g = run(alt)
assert err is None and g["model"].fc.weight.grad is not None and g["model"].conv1.weight.grad is None

print("OK", "senior-ml-practice-q163")
