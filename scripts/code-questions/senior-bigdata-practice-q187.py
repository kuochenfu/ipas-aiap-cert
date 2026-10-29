import io, contextlib
import numpy as np, pandas as pd

rng = np.random.default_rng(0)
y = np.round(rng.lognormal(1.6, 0.35, 50), 2)
y[rng.choice(50, 3, replace=False)] = np.nan
df = pd.DataFrame({"yield_t": y})
assert len(df) == 50
code = 'print(df["yield_t"].describe().round(2))'
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, {"df": df})
EXPECTED = """count    47.00
mean      5.43
std       1.78
min       2.20
25%       4.10
50%       5.12
75%       6.36
max       9.84
Name: yield_t, dtype: float64"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
s = df["yield_t"]; d = s.describe()
# ① 真：mean > median
assert d["mean"] > d["50%"]
# ② 真：50 列中 3 筆缺值，mean 以 47 筆計算
assert s.isna().sum() == 3 and np.isclose(d["mean"], np.nansum(y) / 47)
# ③ 假：std 用 ddof=1（樣本標準差），不是以 n 為分母
assert np.isclose(d["std"], np.nanstd(y, ddof=1)) and not np.isclose(d["std"], np.nanstd(y, ddof=0))
# ④ 真：max 超過 Q3 + 1.5×IQR（以輸出的兩位小數計亦成立）
assert 9.84 > 6.36 + 1.5 * (6.36 - 4.10)
assert d["max"] > d["75%"] + 1.5 * (d["75%"] - d["25%"])
# ⑤ 假：Q3−Q1 是四分位距，全距是 max−min
assert not np.isclose(d["75%"] - d["25%"], d["max"] - d["min"])
truth = {1: True, 2: True, 3: False, 4: True, 5: False}
opts = {"A": [1, 3, 4], "B": [2, 4, 5], "C": [1, 2, 5], "D": [1, 2, 4]}
assert {k for k, v in opts.items() if set(v) == {i for i, t in truth.items() if t}} == {"D"}
print("OK", "senior-bigdata-practice-q187")
