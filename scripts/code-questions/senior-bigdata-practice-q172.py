import io, contextlib
import numpy as np
import pandas as pd

CODE = '''import numpy as np
import pandas as pd

close = pd.Series([10.0, 20.0, np.nan, 40.0, 50.0],
                  index=pd.date_range("2024-06-03", periods=5, freq="B"))
ma = close.rolling(3, min_periods=2).mean()
print(ma.tolist())'''

ns = {}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(CODE, ns)
out = buf.getvalue().strip()
print(out)
CHOICES = {
    "A": "[nan, nan, nan, nan, nan]",
    "B": "[nan, 15.0, 10.0, 20.0, 30.0]",
    "C": "[nan, 15.0, 15.0, 30.0, 45.0]",
    "D": "[nan, 15.0, nan, nan, nan]",
}
assert out == CHOICES["C"]
for k in "ABD":
    assert CHOICES[k] != out
close = ns["close"]
# A 是沒設 min_periods（預設等於視窗大小 3）的結果
assert str(close.rolling(3).mean().tolist()) == CHOICES["A"]
# B 是把缺值當 0 的結果
assert str(close.fillna(0).rolling(3, min_periods=2).mean().tolist()) == CHOICES["B"]
# D 是「視窗內只要有 NaN 就得 NaN」（如 NumPy 直接 mean）的結果
v = close.to_numpy()
d = [np.nan] + [float(np.mean(v[max(0, i - 2):i + 1])) for i in range(1, 5)]
assert str(d) == CHOICES["D"], d
print("OK", "senior-bigdata-practice-q172")
