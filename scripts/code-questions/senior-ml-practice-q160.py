"""senior-ml-practice-q160：未標準化輸入＋學習率過大 → 梯度爆炸、loss 變 nan。"""
import contextlib
import io
import math

import torch
import torch.nn as nn

CODE = r'''import torch
import torch.nn as nn

torch.manual_seed(0)
n = 200
ec = torch.rand(n, 1) * 2000 + 1000      # 土壤導電度（μS/cm）
moist = torch.rand(n, 1) * 60 + 20       # 含水率（%）
rain = torch.rand(n, 1) * 300            # 月雨量（mm）
X = torch.cat([ec, moist, rain], dim=1)
y = 0.5 * ec + 8 * moist + 2 * rain + torch.randn(n, 1) * 50   # 每公頃產量（kg）

model = nn.Sequential(nn.Linear(3, 16), nn.ReLU(), nn.Linear(16, 1))
opt = torch.optim.SGD(model.parameters(), lr=0.01)
loss_fn = nn.MSELoss()

for epoch in range(5):
    opt.zero_grad()
    loss = loss_fn(model(X), y)
    loss.backward()
    gnorm = torch.nn.utils.clip_grad_norm_(model.parameters(), float("inf"))
    opt.step()
    print(f"epoch {epoch}  loss={loss.item():.3e}  grad_norm={gnorm.item():.3e}")
'''

EXPECTED = 'epoch 0  loss=3.099e+06  grad_norm=7.247e+06\nepoch 1  loss=3.006e+24  grad_norm=inf\nepoch 2  loss=nan  grad_norm=nan\nepoch 3  loss=nan  grad_norm=nan\nepoch 4  loss=nan  grad_norm=nan\n'


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
assert "nan" in out.splitlines()[-1]


def train(lr=0.01, scale=False, dropout=0.0, wd=0.0, epochs=30):
    torch.manual_seed(0)
    n = 200
    ec = torch.rand(n, 1) * 2000 + 1000
    moist = torch.rand(n, 1) * 60 + 20
    rain = torch.rand(n, 1) * 300
    X = torch.cat([ec, moist, rain], dim=1)
    y = 0.5 * ec + 8 * moist + 2 * rain + torch.randn(n, 1) * 50
    if scale:
        X = (X - X.mean(0)) / X.std(0)
        y = (y - y.mean()) / y.std()
    layers = [nn.Linear(3, 16), nn.ReLU()]
    if dropout:
        layers.append(nn.Dropout(dropout))
    layers.append(nn.Linear(16, 1))
    model = nn.Sequential(*layers)
    opt = torch.optim.SGD(model.parameters(), lr=lr, weight_decay=wd)
    losses = []
    for _ in range(epochs):
        opt.zero_grad()
        loss = nn.MSELoss()(model(X), y)
        loss.backward()
        opt.step()
        losses.append(loss.item())
    return losses


# 正解 A：標準化輸入與目標後，同一學習率下損失有限且下降
ls = train(scale=True, epochs=200)
assert all(math.isfinite(v) for v in ls) and ls[-1] < ls[0] * 0.5, ls[-1]
# 只標準化、再把學習率調低也收斂
ls = train(scale=True, lr=0.001, epochs=100)
assert all(math.isfinite(v) for v in ls) and ls[-1] < ls[0]

def blew_up(ls):
    """最後的損失是 nan，或比起始值大上百萬倍以上。"""
    return math.isnan(ls[-1]) or ls[-1] > ls[0] * 1e6


# D：學習率調高十倍，損失照樣爆掉（30 輪後仍比起點大 10^15 倍）
ls = train(lr=0.1)
assert blew_up(ls) and (math.isnan(ls[-1]) or ls[-1] > ls[0] * 1e15)

# C：加 Dropout 與 L2 正則化，損失照樣爆掉；且訓練損失本身在上升，不是過擬合的樣子
assert blew_up(train(dropout=0.3, wd=1e-2))
ls = train(epochs=2)
assert ls[1] > ls[0] * 1e10

# B：CrossEntropyLoss 不適用連續目標；套在 1 維輸出上 log_softmax 恆為 0，損失恆為 0、沒有梯度可學
torch.manual_seed(0)
pred = torch.randn(5, 1, requires_grad=True)
target = torch.rand(5, 1) * 3000
ce = nn.CrossEntropyLoss()(pred, target)
ce.backward()
assert abs(ce.item()) < 1e-6 and torch.all(pred.grad.abs() < 1e-6)

print("OK", "senior-ml-practice-q160")
