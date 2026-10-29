"""senior-ml-practice-q170：訓練損失持續下降、驗證損失回升 → 過擬合，以早停保留最佳權重。"""
import contextlib
import io

import torch
import torch.nn as nn

CODE = r'''import torch
import torch.nn as nn
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

X, y = load_digits(return_X_y=True)          # 8×8 灰階影像，代替害蟲影像
X = torch.tensor(X / 16.0, dtype=torch.float32)
y = torch.tensor(y)
Xtr, Xva, ytr, yva = train_test_split(X, y, train_size=200, test_size=400,
                                      random_state=0, stratify=y)

torch.manual_seed(0)
model = nn.Sequential(nn.Linear(64, 256), nn.ReLU(),
                      nn.Linear(256, 256), nn.ReLU(), nn.Linear(256, 10))
opt = torch.optim.Adam(model.parameters(), lr=1e-2)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(1, 61):
    model.train()
    opt.zero_grad()
    loss = loss_fn(model(Xtr), ytr)
    loss.backward()
    opt.step()
    model.eval()
    with torch.no_grad():
        val_loss = loss_fn(model(Xva), yva).item()
    if epoch % 10 == 0:
        print(f"epoch {epoch:2d}  train_loss={loss.item():.4f}  val_loss={val_loss:.4f}")
'''

EXPECTED = 'epoch 10  train_loss=0.3792  val_loss=0.2843\nepoch 20  train_loss=0.0456  val_loss=0.2672\nepoch 30  train_loss=0.0159  val_loss=0.3599\nepoch 40  train_loss=0.0039  val_loss=0.4128\nepoch 50  train_loss=0.0016  val_loss=0.4021\nepoch 60  train_loss=0.0008  val_loss=0.4222\n'


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
tr = [float(l.split("train_loss=")[1].split()[0]) for l in out.splitlines()]
va = [float(l.split("val_loss=")[1]) for l in out.splitlines()]
assert tr == sorted(tr, reverse=True) and tr[-1] < 0.01        # 訓練損失一路降向 0
assert va.index(min(va)) == 1 and va[-1] > min(va) * 1.4         # 驗證損失在第 20 輪最低、之後回升

Xtr, Xva, ytr, yva = g["Xtr"], g["Xva"], g["ytr"], g["yva"]


def train(hidden=256, lr=1e-2, epochs=60, patience=None):
    torch.manual_seed(0)
    model = nn.Sequential(nn.Linear(64, hidden), nn.ReLU(),
                          nn.Linear(hidden, hidden), nn.ReLU(), nn.Linear(hidden, 10))
    opt = torch.optim.Adam(model.parameters(), lr=lr)
    loss_fn = nn.CrossEntropyLoss()
    hist = []
    best, best_state, wait = float("inf"), None, 0
    for _ in range(epochs):
        model.train(); opt.zero_grad()
        loss = loss_fn(model(Xtr), ytr); loss.backward(); opt.step()
        model.eval()
        with torch.no_grad():
            v = loss_fn(model(Xva), yva).item()
        hist.append((loss.item(), v))
        if v < best:
            best, wait = v, 0
            best_state = {k: t.clone() for k, t in model.state_dict().items()}
        else:
            wait += 1
            if patience is not None and wait >= patience:
                break
    model.load_state_dict(best_state)
    model.eval()
    with torch.no_grad():
        kept = loss_fn(model(Xva), yva).item()
    return hist, kept


hist, _ = train()
final_val = hist[-1][1]

# 正解 A：早停保留驗證損失最低的權重，驗證損失明顯低於跑滿 60 輪
_, kept = train(patience=10)
assert kept < final_val * 0.8, (kept, final_val)

# B：再多訓練 60 輪，驗證損失不會跟著降，反而高於最低點
hist120, _ = train(epochs=120)
assert hist120[-1][1] > min(v for _, v in hist120) * 1.4

# C：這是過擬合不是欠擬合（訓練損失趨近 0）；把網路加寬到 1024，訓練損失更低、驗證損失照樣回升
histw, _ = train(hidden=1024)
assert hist[-1][0] < 0.01
assert histw[-1][0] < 0.01 and histw[-1][1] > min(v for _, v in histw) * 1.4

# D：把學習率調高到 5e-2，驗證損失最後仍高於其最低點，問題沒有消失
histl, _ = train(lr=5e-2)
assert histl[-1][1] > min(v for _, v in histl) * 1.2

print("OK", "senior-ml-practice-q170")
