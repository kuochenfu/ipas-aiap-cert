"""senior-ml-practice-q164：凍結骨幹後只剩 fc 可訓練，但 BatchNorm 的 running stats 在 train() 下仍會更新。
題目程式載入 ImageNet 權重；驗證環境不能連網，改用 weights=None（參數量相同）。"""
import contextlib
import io

import torch
import torch.nn as nn
from torchvision import models

CODE = r'''import torch
import torch.nn as nn
from torchvision import models

model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
for p in model.parameters():
    p.requires_grad = False
model.fc = nn.Linear(model.fc.in_features, 4)   # 4 類學生作業影像

total = sum(p.numel() for p in model.parameters())
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"total={total:,}  trainable={trainable:,}  ratio={trainable / total:.2%}")
'''

EXPECTED = 'total=11,178,564  trainable=2,052  ratio=0.02%\n'

OFFLINE = CODE.replace("weights=models.ResNet18_Weights.IMAGENET1K_V1", "weights=None")
assert OFFLINE != CODE


def run(code):
    g = {}
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code, g)
    return buf.getvalue(), g


out, g = run(OFFLINE)
if EXPECTED is None:
    print(repr(out))
    raise SystemExit
assert out == EXPECTED, repr(out)
model = g["model"]
assert g["trainable"] == 512 * 4 + 4 == 2052

# 正解 A：model.train() 下前向一次，骨幹 BatchNorm 的 running_mean 就會改變（雖然 requires_grad=False）
bn = model.bn1
before = bn.running_mean.clone()
model.train()
with torch.no_grad():
    model(torch.randn(4, 3, 64, 64))
assert not torch.allclose(before, bn.running_mean)
assert bn.weight.requires_grad is False
# 對照：eval() 下 running_mean 不動
before = bn.running_mean.clone()
model.eval()
with torch.no_grad():
    model(torch.randn(4, 3, 64, 64))
assert torch.equal(before, bn.running_mean)

# B：「train() 後骨幹所有數值都不再改變」不成立，上面已證 running_mean 會變
# C：2,052 = 2,048 個權重 + 4 個偏差，nn.Linear 預設 bias=True
assert model.fc.weight.numel() == 2048 and model.fc.bias is not None and model.fc.bias.numel() == 4

# D：凍結不改變前向運算——凍結與未凍結的模型執行的卷積層數與輸出完全相同
def conv_calls(m):
    calls = []
    hooks = [mod.register_forward_hook(lambda mod, i, o: calls.append(o.numel()))
             for mod in m.modules() if isinstance(mod, nn.Conv2d)]
    m.eval()
    with torch.no_grad():
        out = m(torch.ones(1, 3, 64, 64))
    for h in hooks:
        h.remove()
    return calls, out

torch.manual_seed(0)
unfrozen = models.resnet18(weights=None)
unfrozen.fc = nn.Linear(512, 4)
frozen = models.resnet18(weights=None)
frozen.fc = nn.Linear(512, 4)
frozen.load_state_dict(unfrozen.state_dict())
for n, p in frozen.named_parameters():
    if not n.startswith("fc."):
        p.requires_grad = False
cu, ou = conv_calls(unfrozen)
cf, of = conv_calls(frozen)
assert len(cu) == len(cf) == 20 and cu == cf and torch.allclose(ou, of)
assert abs(g["trainable"] / g["total"] - 0.000184) < 0.00001

print("OK", "senior-ml-practice-q164")
