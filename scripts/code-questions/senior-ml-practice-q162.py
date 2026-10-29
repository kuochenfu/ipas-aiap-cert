"""senior-ml-practice-q162：迴圈缺 optimizer.zero_grad()，梯度逐步累加。"""
import contextlib
import io

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

CODE = r'''import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(0)
X = torch.randn(320, 12)                       # 320 筆門診紀錄、12 項檢驗值
y = (X[:, :3].sum(dim=1) > 0).long()           # 是否需要轉診
loader = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)

model = nn.Sequential(nn.Linear(12, 16), nn.ReLU(), nn.Linear(16, 2))
opt = torch.optim.SGD(model.parameters(), lr=0.05)
loss_fn = nn.CrossEntropyLoss()

model.train()
running_loss = 0.0
for step, (xb, yb) in enumerate(loader):
    loss = loss_fn(model(xb), yb)
    loss.backward()
    opt.step()
    running_loss += loss.item()
    if step % 3 == 2:
        print(f"step {step}  grad_norm={model[2].weight.grad.norm():.3f}")
'''

EXPECTED = 'step 2  grad_norm=0.859\nstep 5  grad_norm=1.363\nstep 8  grad_norm=1.979\n'


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
norms = [float(l.split("=")[1]) for l in out.splitlines()]
assert norms == sorted(norms) and norms[-1] > 2 * norms[0]   # 梯度範數一路變大


def train(zero_grad=False, shuffle=True):
    torch.manual_seed(0)
    X = torch.randn(320, 12)
    y = (X[:, :3].sum(dim=1) > 0).long()
    loader = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=shuffle)
    model = nn.Sequential(nn.Linear(12, 16), nn.ReLU(), nn.Linear(16, 2))
    opt = torch.optim.SGD(model.parameters(), lr=0.05)
    loss_fn = nn.CrossEntropyLoss()
    model.train()
    accumulated = []
    for xb, yb in loader:
        if zero_grad:
            opt.zero_grad()
        # 以同一組參數另算一次「這一批自己的梯度」作對照
        fresh = torch.autograd.grad(loss_fn(model(xb), yb), model[2].weight)[0]
        loss = loss_fn(model(xb), yb)
        loss.backward()
        accumulated.append(torch.allclose(model[2].weight.grad, fresh, atol=1e-6))
        opt.step()
    return accumulated


# 原程式：從第 2 步起 .grad 不等於這一批自己的梯度（混入了先前各步）
acc = train()
assert acc[0] and not any(acc[1:])
# 正解 D：補上 zero_grad 後，每一步的 .grad 都恰為這一批自己的梯度
assert all(train(zero_grad=True))
# C：關掉 shuffle 也沒用，梯度照樣累加
acc = train(shuffle=False)
assert acc[0] and not any(acc[1:])
# A：running_loss += loss.item() 不會切斷計算圖；item() 回傳 Python float，backward 早已完成且梯度存在
assert isinstance(g["running_loss"], float) and g["model"][2].weight.grad is not None
# B：問題不在「每批都 step」——同樣每批 step，只要補上 zero_grad 梯度就正確（上面已驗）

print("OK", "senior-ml-practice-q162")
