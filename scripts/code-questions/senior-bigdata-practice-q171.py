import io, contextlib
import numpy as np
import pandas as pd

CODE = '''import numpy as np
import pandas as pd

rng = np.random.default_rng(3)
idx = pd.date_range("2024-03-01", "2024-03-04 23:00", freq="h")
rain = pd.Series(rng.choice([0, 0, 0, 0.2, 0.5, 1.0], len(idx)), index=idx)
rain = rain.drop(rain["2024-03-03"].index)   # 重現 3/03 的實際資料狀況

print(rain.resample("D").size())
print(rain.resample("D").sum().round(1))'''

ns = {}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(CODE, ns)
out = "\n".join(l.rstrip() for l in buf.getvalue().rstrip().splitlines())
print(out)
EXPECTED = """2024-03-01    24
2024-03-02    24
2024-03-03     0
2024-03-04    24
Freq: D, dtype: int64
2024-03-01    4.6
2024-03-02    7.8
2024-03-03    0.0
2024-03-04    7.4
Freq: D, dtype: float64"""
assert out == EXPECTED
rain = ns["rain"]
# 正解 A：當天沒有任何列，sum 對空區間回傳 0；min_count=1 會變成 NaN
assert len(rain["2024-03-01":"2024-03-04"].loc["2024-03-03":"2024-03-03"]) == 0
fixed = rain.resample("D").sum(min_count=1)
assert pd.isna(fixed["2024-03-03"]) and fixed.notna().sum() == 3
# B 錯：0.0 不是觀測到的無雨，而是沒有資料
assert rain.resample("D").count()["2024-03-03"] == 0
# C 錯：size() 連 NaN 列也計數；若當天 24 筆都是 NaN，size 會是 24 而不是 0
alt = ns["pd"].Series(np.nan, index=pd.date_range("2024-03-03", periods=24, freq="h"))
both = pd.concat([rain, alt]).sort_index()
assert both.resample("D").size()["2024-03-03"] == 24
assert both.resample("D").sum()["2024-03-03"] == 0
# D 錯：resample 不會向前補值（mean 在空區間是 NaN，sum 也不是 3/02 的 7.8）
assert pd.isna(rain.resample("D").mean()["2024-03-03"])
assert rain.resample("D").sum()["2024-03-03"] != rain.resample("D").sum()["2024-03-02"]
print("OK", "senior-bigdata-practice-q171")
