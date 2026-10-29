"""senior-ml-practice-q157：eval() 之後沒切回 train()，第 2 個 epoch 起 BatchNorm／Dropout 停在推論行為。"""
import contextlib
import io

import torch
import torch.nn as nn

CODE = r'''import torch
import torch.nn as nn

torch.manual_seed(0)
X = torch.randn(64, 10)                 # 64 位病患、10 項生理指標
y = (X[:, 0] + X[:, 1] > 0).long()      # 30 天內是否再入院
Xv = torch.randn(32, 10)
yv = (Xv[:, 0] + Xv[:, 1] > 0).long()

model = nn.Sequential(nn.Linear(10, 32), nn.BatchNorm1d(32), nn.ReLU(),
                      nn.Dropout(0.5), nn.Linear(32, 2))
opt = torch.optim.Adam(model.parameters(), lr=1e-2)
loss_fn = nn.CrossEntropyLoss()
bn = model[1]

model.train()
for epoch in range(3):
    for i in range(0, 64, 16):
        opt.zero_grad()
        loss = loss_fn(model(X[i:i+16]), y[i:i+16])
        loss.backward()
        opt.step()
    model.eval()
    with torch.no_grad():
        acc = (model(Xv).argmax(1) == yv).float().mean().item()
    print(f"epoch {epoch}  bn_batches={bn.num_batches_tracked.item()}  val_acc={acc:.3f}")
'''

EXPECTED = 'epoch 0  bn_batches=4  val_acc=0.438\nepoch 1  bn_batches=4  val_acc=0.688\nepoch 2  bn_batches=4  val_acc=0.781\n'


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
# 第 2 個 epoch 起批次計數停在 4：訓練步其實在 eval 模式下進行
assert [l.split()[2] for l in out.splitlines()] == ["bn_batches=4"] * 3


def train(variant):
    """回傳每個訓練步時的 model.training，與最後的 num_batches_tracked。"""
    torch.manual_seed(0)
    X = torch.randn(64, 10); y = (X[:, 0] + X[:, 1] > 0).long()
    Xv = torch.randn(32, 10); yv = (Xv[:, 0] + Xv[:, 1] > 0).long()
    p = 0.0 if variant == "C" else 0.5
    model = nn.Sequential(nn.Linear(10, 32), nn.BatchNorm1d(32), nn.ReLU(),
                          nn.Dropout(p), nn.Linear(32, 2))
    opt = torch.optim.Adam(model.parameters(), lr=1e-2)
    loss_fn = nn.CrossEntropyLoss()
    flags = []
    model.train()
    for epoch in range(3):
        if variant == "D":
            model.train()
        for i in range(0, 64, 16):
            flags.append(model.training)
            opt.zero_grad()
            loss_fn(model(X[i:i+16]), y[i:i+16]).backward()
            opt.step()
        if variant == "A":           # 不用 no_grad，只呼叫 eval()
            model.eval()
            model(Xv)
        else:
            if variant == "B":       # 驗證前補 zero_grad
                opt.zero_grad()
            model.eval()
            with torch.no_grad():
                model(Xv)
    return flags, model[1].num_batches_tracked.item()


# 原程式：後 8 個訓練步都在 eval 模式
flags, n = train("orig")
assert flags[:4] == [True] * 4 and flags[4:] == [False] * 8 and n == 4

# 正解 D：每個 epoch 開頭 model.train()，12 步全在訓練模式，BN 累計 12 批
flags, n = train("D")
assert all(flags) and n == 12

# A：問題不在 no_grad——拿掉它仍停在 4；且 no_grad 在 train 模式下並不阻止 BN 更新
flags, n = train("A")
assert n == 4 and not all(flags)
bn = nn.BatchNorm1d(3); bn.train()
with torch.no_grad():
    bn(torch.randn(8, 3))
assert bn.num_batches_tracked.item() == 1

# B：驗證前補 zero_grad 無效
flags, n = train("B")
assert n == 4 and not all(flags)

# C：移除 Dropout（p=0）仍停在 4
flags, n = train("C")
assert n == 4 and not all(flags)

print("OK", "senior-ml-practice-q157")
