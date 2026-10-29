"""senior-ml-practice-q169：認出「線性暖身＋餘弦退火」的學習率排程。"""
import contextlib
import io

CODE = r'''import math

def lr_at(epoch, base_lr=1e-3, warmup=5, total=50):
    if epoch < warmup:
        return base_lr * (epoch + 1) / warmup
    progress = (epoch - warmup) / (total - warmup)
    return 0.5 * base_lr * (1 + math.cos(math.pi * progress))

print([f"{lr_at(e):.1e}" for e in (0, 2, 4, 5, 15, 27, 40, 49)])
'''

EXPECTED = "['2.0e-04', '6.0e-04', '1.0e-03', '1.0e-03', '8.8e-04', '5.2e-04', '1.2e-04', '1.2e-06']\n"


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
lr_at = g["lr_at"]
seq = [lr_at(e) for e in range(50)]

# 正解 B：前 5 輪線性升高（等差），第 5 輪達 base_lr，之後單調下降到接近 0
warm = seq[:5]
assert all(abs((warm[i + 1] - warm[i]) - 2e-4) < 1e-12 for i in range(4))
assert abs(seq[4] - 1e-3) < 1e-12 and abs(seq[5] - 1e-3) < 1e-12
assert all(seq[i + 1] <= seq[i] for i in range(5, 49)) and seq[49] < 1e-5
# 中點 (epoch 27.5) 附近約為 base_lr 的一半，符合餘弦而非線性/階梯
assert abs(lr_at(27.5) - 5e-4) < 1e-12

# A：不是階梯式——退火段相鄰兩輪的值全都不同，沒有「固定好幾輪不變」的平台
assert len({round(v, 15) for v in seq[5:]}) == 45

# C：不依賴驗證損失——函式只吃 epoch，沒有任何損失輸入
import inspect
assert list(inspect.signature(lr_at).parameters) == ["epoch", "base_lr", "warmup", "total"]

# D：不是週期性——暖身後只降不升，不會在上下界間反覆
rises = sum(seq[i + 1] > seq[i] for i in range(5, 49))
assert rises == 0

print("OK", "senior-ml-practice-q169")
