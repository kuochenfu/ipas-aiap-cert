"""senior-ml-practice-q156：rating_loss 等同 nn.CrossEntropyLoss（吃 logits）。"""
import contextlib
import io

import torch
import torch.nn as nn

CODE = r'''import torch

def rating_loss(logits, y):
    p = torch.softmax(logits, dim=1)
    picked = p[torch.arange(len(y)), y]
    return -torch.log(picked).mean()

torch.manual_seed(0)
logits = torch.randn(4, 3)        # 4 位客戶、3 個信用等級的模型輸出
y = torch.tensor([0, 2, 1, 2])    # 實際信用等級
print(round(rating_loss(logits, y).item(), 4))
'''

EXPECTED = "0.9357\n"


def run(code):
    g = {}
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code, g)
    return buf.getvalue(), g


out, g = run(CODE)
if EXPECTED is None:
    print(repr(out))
    raise SystemExit
assert out == EXPECTED, repr(out)

logits, y, f = g["logits"], g["y"], g["rating_loss"]
ours = f(logits, y).item()
onehot = nn.functional.one_hot(y, 3).float()

# 正解 C：與 CrossEntropyLoss(logits, y) 相同
ce = nn.CrossEntropyLoss()(logits, y).item()
assert abs(ours - ce) < 1e-6, (ours, ce)

# A：BCEWithLogitsLoss 搭配獨熱標籤，值不同
bce = nn.BCEWithLogitsLoss()(logits, onehot).item()
assert abs(ours - bce) > 0.1, (ours, bce)

# B：NLLLoss 直接吃 logits，只是取 -logits[y] 的平均，值不同（需 log_softmax 才相同）
nll_raw = nn.NLLLoss()(logits, y).item()
assert abs(ours - nll_raw) > 0.1, (ours, nll_raw)
nll_ok = nn.NLLLoss()(torch.log_softmax(logits, dim=1), y).item()
assert abs(ours - nll_ok) < 1e-6

# D：MSELoss 搭配獨熱標籤，值不同
mse = nn.MSELoss()(torch.softmax(logits, dim=1), onehot).item()
assert abs(ours - mse) > 0.1, (ours, mse)

print("OK", "senior-ml-practice-q156")
