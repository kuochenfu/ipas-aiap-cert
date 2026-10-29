"""senior-ml-practice-q165：追蹤 Conv2d／MaxPool2d 後的形狀與 conv2 參數量。"""
import contextlib
import io

CODE = r'''import torch
import torch.nn as nn

x = torch.randn(8, 3, 64, 64)    # 8 張 64×64 彩色葉片影像
conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=2, padding=1)
pool = nn.MaxPool2d(2)
conv2 = nn.Conv2d(16, 32, kernel_size=5)

h = conv2(pool(conv1(x)))
print(h.shape)
print(sum(p.numel() for p in conv2.parameters()))
'''

EXPECTED = 'torch.Size([8, 32, 12, 12])\n12832\n'


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

shape_line, n_line = out.splitlines()
CHOICES = {
    "A": ("torch.Size([8, 32, 28, 28])", "12832"),
    "B": ("torch.Size([8, 32, 12, 12])", "12832"),
    "C": ("torch.Size([8, 32, 12, 12])", "12800"),
    "D": ("torch.Size([8, 32, 16, 16])", "12832"),
}
actual = (shape_line, n_line)
assert actual == CHOICES["B"], actual
for k in "ACD":
    assert CHOICES[k] != actual

# 干擾項各自對應的錯誤算法
assert (64 + 2 - 3) // 1 + 1 == 64 and 64 // 2 - 5 + 1 == 28      # A：忽略 stride=2
assert 16 * 32 * 5 * 5 == 12800                                     # C：漏算 32 個偏差
assert 64 // 2 // 2 == 16                                           # D：以為 conv2 保持尺寸
# 正解的推導：(64+2·1−3)/2+1 = 32 → 池化 16 → 16−5+1 = 12；16·32·25+32 = 12,832
assert (64 + 2 * 1 - 3) // 2 + 1 == 32 and 16 - 5 + 1 == 12 and 16 * 32 * 25 + 32 == 12832

# 判斷分界：conv2 改 padding=2 → 保持 16×16，參數量不變
import torch, torch.nn as nn
c2 = nn.Conv2d(16, 32, kernel_size=5, padding=2)
assert c2(torch.randn(8, 16, 16, 16)).shape == (8, 32, 16, 16)
assert sum(p.numel() for p in c2.parameters()) == 12832

print("OK", "senior-ml-practice-q165")
