"""senior-ml-practice-q168：clip_grad_norm_ 放在 backward 之前 → 裁不到任何梯度。"""
import contextlib
import io

import torch
import torch.nn as nn

CODE = r'''import torch
import torch.nn as nn

torch.manual_seed(0)
X = torch.randn(64, 50, 4) * 5     # 64 段振動訊號、50 個時間步、4 軸
y = torch.rand(64, 1) * 500        # 剩餘使用壽命（小時）

class RUL(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(4, 32, batch_first=True)
        self.head = nn.Linear(32, 1)

    def forward(self, x):
        out, _ = self.lstm(x)
        return self.head(out[:, -1])

model = RUL()
opt = torch.optim.SGD(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

for step in range(3):
    opt.zero_grad()
    loss = loss_fn(model(X), y)
    clipped = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    loss.backward()
    actual = torch.sqrt(sum(p.grad.pow(2).sum() for p in model.parameters()))
    opt.step()
    print(f"step {step}  clip_returned={clipped:.3f}  grad_norm_at_step={actual:.1f}")
'''

EXPECTED = 'step 0  clip_returned=0.000  grad_norm_at_step=588.9\nstep 1  clip_returned=0.000  grad_norm_at_step=599.9\nstep 2  clip_returned=0.000  grad_norm_at_step=659.2\n'


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
for line in out.splitlines():
    assert "clip_returned=0.000" in line
    assert float(line.split("grad_norm_at_step=")[1]) > 1.0


def first_update(variant):
    """回傳第一步更新量的範數 ||Δθ||，與 step 當下的梯度範數。"""
    torch.manual_seed(0)
    X = torch.randn(64, 50, 4) * 5
    y = torch.rand(64, 1) * 500
    model = g["RUL"]()
    opt = torch.optim.SGD(model.parameters(), lr=1e-3)
    before = [p.detach().clone() for p in model.parameters()]
    opt.zero_grad()
    loss = nn.MSELoss()(model(X), y)
    if variant == "orig":
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    elif variant == "A":
        torch.nn.utils.clip_grad_value_(model.parameters(), clip_value=1.0)
    elif variant == "D":
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=0.1)
    loss.backward()
    if variant == "C":
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    gnorm = torch.sqrt(sum(p.grad.pow(2).sum() for p in model.parameters())).item()
    opt.step()
    if variant == "B":
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    delta = torch.sqrt(sum((p.detach() - b).pow(2).sum()
                           for p, b in zip(model.parameters(), before))).item()
    return delta, gnorm


ref_delta, ref_g = first_update("none")          # 完全不裁剪的對照
assert ref_g > 1.0

# 正解 C：移到 backward 之後、step 之前，step 當下梯度範數被壓到 1，更新量 = lr × 1
delta, gn = first_update("C")
assert abs(gn - 1.0) < 1e-4 and abs(delta - 1e-3) < 1e-6

# A：clip_grad_value_ 放在 backward 之前同樣碰不到梯度——torch 2.5.1 在沒有任何 .grad 時直接拋 RuntimeError，
#    其他版本則是靜默不作用；兩種情況都沒有限制到梯度
try:
    delta, gn = first_update("A")
    assert abs(delta - ref_delta) < 1e-9 and abs(gn - ref_g) < 1e-6
except RuntimeError:
    pass

# 原程式與 B、D：更新量都和完全不裁剪一模一樣
for v in ["orig", "B", "D"]:
    delta, gn = first_update(v)
    assert abs(delta - ref_delta) < 1e-9 and abs(gn - ref_g) < 1e-6, v

print("OK", "senior-ml-practice-q168")
