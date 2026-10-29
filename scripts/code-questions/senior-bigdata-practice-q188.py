import io, contextlib
import numpy as np, pandas as pd

rng = np.random.default_rng(8)
df = pd.DataFrame({"amount": np.round(rng.lognormal(7, 1.0, 1000), 0)})
code = 's = df["amount"]\nprint(s.describe().round(1))\nprint(round(s.skew(), 2))'
g = {"df": df}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = """count     1000.0
mean      1794.1
std       2396.2
min         47.0
25%        544.5
50%       1034.5
75%       2050.2
max      27831.0
Name: amount, dtype: float64
4.59"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
s = g["s"]
# ① 真
assert s.median() == s.quantile(0.5)
# ② 假：np.var 預設 ddof=0，Series.var 預設 ddof=1
assert not np.isclose(np.var(s.to_numpy()), s.var())
assert np.isclose(np.var(s.to_numpy(), ddof=1), s.var())
# ③ 真：mode 回傳 Series，多眾數全部列出
m = pd.Series([1, 1, 2, 2, 3]).mode()
assert isinstance(m, pd.Series) and m.tolist() == [1, 2]
assert isinstance(s.mode(), pd.Series)
# ④ 真：偏態為正、平均被大額拉高到中位數之上
assert s.skew() > 0 and s.mean() > s.median()
# ⑤ 假：log1p 之後偏態變小（4.59 → 約 0.05）
assert abs(np.log1p(s).skew()) < s.skew()
truth = {1: True, 2: False, 3: True, 4: True, 5: False}
opts = {"A": [1, 2, 4], "B": [1, 3, 4], "C": [2, 3, 5], "D": [3, 4, 5]}
assert {k for k, v in opts.items() if set(v) == {i for i, t in truth.items() if t}} == {"B"}
print("OK", "senior-bigdata-practice-q188")
