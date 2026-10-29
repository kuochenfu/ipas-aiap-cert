# 驗證：等寬 10 箱下 89% 的日子擠在第一箱；對數分箱能展開分布，其餘三種做法不能
import io, contextlib
import numpy as np, pandas as pd

rng = np.random.default_rng(42)
df = pd.DataFrame({"rain_mm": np.round(rng.lognormal(mean=2.5, sigma=1.3, size=365), 1)})

buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    counts, edges = np.histogram(df["rain_mm"], bins=10)
    print(counts)
    print(np.round(edges).astype(int))
    print(df["rain_mm"].median())
EXPECTED = ("[324  24   9   5   0   1   0   0   0   2]\n"
            "[  0  54 108 162 215 269 323 377 431 484 538]\n"
            "11.9\n")
assert buf.getvalue() == EXPECTED, repr(buf.getvalue())
share_first = counts[0] / counts.sum()
assert share_first > 0.88

# 正解 A：先取 log1p 再分 10 箱（或用對數分箱），最大一箱的占比降到 25% 以下，且沒有空箱
c_log, _ = np.histogram(np.log1p(df["rain_mm"]), bins=10)
assert c_log.max() / c_log.sum() < 0.25 and (c_log > 0).all()
c_geo, _ = np.histogram(df["rain_mm"], bins=np.logspace(np.log10(0.4), np.log10(538.1), 11))
assert c_geo.max() / c_geo.sum() < 0.3

# B 錯：分箱數減為 5，第一箱更擠
c5, _ = np.histogram(df["rain_mm"], bins=5)
assert c5[0] / c5.sum() > share_first

# C 錯：圓餅圖丟失分箱的數值順序；占 0 的 4 個分箱在圓餅圖上完全看不見
assert (counts == 0).sum() == 4

# D 錯：刪掉最大兩筆後，第一箱仍占八成，右偏是分布本身的形狀而非少數錯誤值
r2 = np.sort(df["rain_mm"].to_numpy())[:-2]
c2, _ = np.histogram(r2, bins=10)
assert c2[0] / c2.sum() > 0.8
assert df["rain_mm"].mean() > 2 * df["rain_mm"].median()

print("OK", "senior-bigdata-practice-q213")
