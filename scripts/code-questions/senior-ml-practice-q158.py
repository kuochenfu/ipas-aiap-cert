"""senior-ml-practice-q158：攤平時要保留批次維度 torch.flatten(x, start_dim=1)。"""
import torch
import torch.nn as nn
import torch.nn.functional as F

CODE = r'''import torch
import torch.nn as nn
import torch.nn.functional as F

class DefectNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 6, kernel_size=5)
        self.conv2 = nn.Conv2d(6, 16, kernel_size=5)
        self.fc = nn.Linear(16 * 5 * 5, 2)

    def forward(self, x):
        x = F.max_pool2d(F.relu(self.conv1(x)), 2)
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)
        # ____（攤平）____
        return self.fc(x)

x = torch.randn(8, 1, 32, 32)   # 8 張 32×32 灰階瑕疵影像
'''

CHOICES = {
    "A": "x = x.view(x.size(0), 16, -1)",
    "B": "x = nn.Flatten(start_dim=0, end_dim=-1)(x)",
    "C": "x = torch.flatten(x, start_dim=1)",
    "D": "x = x.reshape(-1, x.size(1))",
}
ANSWER = "C"


def build(line):
    code = CODE.replace("        # ____（攤平）____", "        " + line)
    g = {}
    exec(code, g)
    torch.manual_seed(0)
    return g["DefectNet"](), g["x"]


# 攤平前的形狀確實是 (8, 16, 5, 5)
m, x = build("print_shape = None")
h = F.max_pool2d(F.relu(m.conv2(F.max_pool2d(F.relu(m.conv1(x)), 2))), 2)
assert h.shape == (8, 16, 5, 5)

results = {}
for k, line in CHOICES.items():
    m, x = build(line)
    try:
        results[k] = m(x).shape
    except RuntimeError as e:
        results[k] = type(e)

assert results["C"] == (8, 2), results          # 正解：每張影像各一列 logits
assert results["A"] is RuntimeError, results     # (8,16,25) 的最後一維 25 對不上 400
assert results["B"] is RuntimeError, results     # 連批次一起攤成 (3200,)，對不上 400
assert results["D"] is RuntimeError, results     # (200,16) 的最後一維 16 對不上 400
# D 的形狀確實是把 8×25 個位置各當成一列
assert h.reshape(-1, h.size(1)).shape == (200, 16)
assert nn.Flatten(start_dim=0, end_dim=-1)(h).shape == (3200,)
assert h.view(h.size(0), 16, -1).shape == (8, 16, 25)

# 判斷分界：若 fc 改成 nn.LazyLinear(2)，三種錯誤寫法不報錯、而是靜默輸出錯的形狀
lazy = {}
for k, line in CHOICES.items():
    m, x = build(line)
    m.fc = nn.LazyLinear(2)
    lazy[k] = tuple(m(x).shape)
assert lazy == {"A": (8, 16, 2), "B": (2,), "C": (8, 2), "D": (200, 2)}, lazy

print("OK", "senior-ml-practice-q158")
