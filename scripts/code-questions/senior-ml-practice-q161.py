"""senior-ml-practice-q161：每 10 個 epoch 學習率乘 0.1 → StepLR(step_size=10, gamma=0.1)。"""
import torch
import torch.nn as nn
from torch.optim.lr_scheduler import CosineAnnealingLR, ExponentialLR, MultiStepLR, StepLR

CHOICES = {
    "A": lambda opt: CosineAnnealingLR(opt, T_max=10),
    "B": lambda opt: ExponentialLR(opt, gamma=0.1),
    "C": lambda opt: MultiStepLR(opt, milestones=[10], gamma=0.1),
    "D": lambda opt: StepLR(opt, step_size=10, gamma=0.1),
}


def lrs(make):
    """依題目程式：初始 lr=0.01、訓練 30 個 epoch，每個 epoch 結束呼叫一次 scheduler.step()。"""
    torch.manual_seed(0)
    model = nn.Linear(20, 2)
    opt = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
    sched = make(opt)
    seen = []
    for epoch in range(30):
        seen.append(opt.param_groups[0]["lr"])
        x = torch.randn(32, 20); y = torch.randint(0, 2, (32,))
        opt.zero_grad()
        nn.CrossEntropyLoss()(model(x), y).backward()
        opt.step()
        sched.step()
    return seen


def close(a, b):
    return all(abs(u - v) <= 1e-12 + 1e-9 * abs(v) for u, v in zip(a, b))


target = [0.01] * 10 + [0.001] * 10 + [0.0001] * 10
r = {k: lrs(f) for k, f in CHOICES.items()}

assert close(r["D"], target), r["D"]                   # 正解
assert not close(r["A"], target)                       # 餘弦曲線：每個 epoch 都在變
assert r["A"][1] < 0.01 and r["A"][10] < 1e-9 and abs(r["A"][20] - 0.01) < 1e-9  # 10 輪降到 0、再升回 0.01
assert not close(r["B"], target) and abs(r["B"][1] - 0.001) < 1e-12  # 每個 epoch 都乘 0.1
assert not close(r["C"], target)                       # 只在第 10 個 epoch 降一次
assert close(r["C"][:20], target[:20]) and abs(r["C"][25] - 0.001) < 1e-12

print("OK", "senior-ml-practice-q161")
