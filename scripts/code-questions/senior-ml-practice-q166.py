"""senior-ml-practice-q166：MLP 對 CNN 的參數量——卷積權重共享，參數集中在攤平後的 Linear。"""
import contextlib
import io

import torch
import torch.nn as nn

CODE = r'''import torch.nn as nn

mlp = nn.Sequential(nn.Flatten(), nn.Linear(64 * 64, 512), nn.ReLU(),
                    nn.Linear(512, 10))
cnn = nn.Sequential(nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
                    nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
                    nn.Flatten(), nn.Linear(32 * 16 * 16, 10))

def count(m):
    return sum(p.numel() for p in m.parameters())

print(f"MLP: {count(mlp):,}")
print(f"CNN: {count(cnn):,}")
for name, layer in cnn.named_children():
    if count(layer):
        print(f"  cnn[{name}] {layer.__class__.__name__}: {count(layer):,}")
'''

EXPECTED = 'MLP: 2,102,794\nCNN: 86,730\n  cnn[0] Conv2d: 160\n  cnn[3] Conv2d: 4,640\n  cnn[7] Linear: 81,930\n'


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
count, mlp, cnn = g["count"], g["mlp"], g["cnn"]

# 兩個模型都能吃 64×64 單通道影像、輸出 10 類
x = torch.randn(2, 1, 64, 64)
assert mlp(x).shape == cnn(x).shape == (2, 10)

# 正解 B：卷積層參數與輸入尺寸無關；參數集中在最後的 Linear
conv_params = count(cnn[0]) + count(cnn[3])
assert conv_params == 160 + 4640 and count(cnn[7]) == 81930
assert count(cnn[7]) / count(cnn) > 0.9
big = nn.Conv2d(1, 16, 3, padding=1)
assert count(big) == count(cnn[0])          # 同一層用在 128×128 也是 160 個參數
assert big(torch.randn(1, 1, 128, 128)).shape == (1, 16, 128, 128)

# A：參數多不等於表達能力一定強；MLP 約為 CNN 的 24 倍——敘述的數字成立，但推論不成立（觀念題，此處只驗數字）
assert 24 < count(mlp) / count(cnn) < 25

# C：MaxPool2d 沒有任何可學習參數
assert count(nn.MaxPool2d(2)) == 0 and count(cnn[2]) == 0 and count(cnn[5]) == 0

# D：改成 padding=0，CNN 參數反而更少，離 MLP 更遠
cnn0 = nn.Sequential(nn.Conv2d(1, 16, 3), nn.ReLU(), nn.MaxPool2d(2),
                     nn.Conv2d(16, 32, 3), nn.ReLU(), nn.MaxPool2d(2),
                     nn.Flatten(), nn.LazyLinear(10))
cnn0(torch.randn(1, 1, 64, 64))
assert count(cnn0) < count(cnn) < count(mlp) / 20

# 判斷分界：改接全域平均池化，Linear 只剩 330 個參數；沿用攤平而輸入放大到 128×128，Linear 變四倍
gap = nn.Sequential(*list(cnn.children())[:6], nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(32, 10))
assert count(gap[-1]) == 330 and count(gap) == 160 + 4640 + 330
assert gap(torch.randn(1, 1, 64, 64)).shape == gap(torch.randn(1, 1, 128, 128)).shape == (1, 10)
assert 32 * 32 * 32 * 10 + 10 == 327690 and 327690 / 81930 > 3.99

print("OK", "senior-ml-practice-q166")
