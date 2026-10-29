import io, contextlib
import numpy as np
from scipy import stats

rng = np.random.default_rng(1)
a = np.round(rng.normal(52, 2, 30), 1)   # 舊肥料 30 塊田
b = np.round(rng.normal(55, 7, 8), 1)    # 新肥料 8 塊田
code = '''print(f"n: {len(a)}, {len(b)}   mean: {a.mean():.2f}, {b.mean():.2f}   sd: {a.std(ddof=1):.2f}, {b.std(ddof=1):.2f}")
lev = stats.levene(a, b)
print(f"Levene p = {lev.pvalue:.2e}")
t = stats.ttest_ind(a, b)
print(f"t = {t.statistic:.3f}, p = {t.pvalue:.4f}")'''
g = {"a": a, "b": b, "stats": stats}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = """n: 30, 8   mean: 51.87, 56.59   sd: 1.68, 9.69
Levene p = 1.27e-08
t = -2.617, p = 0.0129"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
# B（正解）：變異數明顯不等，Welch 檢定的結論與 Student t 不同
welch = stats.ttest_ind(a, b, equal_var=False)
assert g["lev"].pvalue < 0.001 and welch.pvalue > 0.05 and g["t"].pvalue < 0.05
assert b.std(ddof=1) / a.std(ddof=1) > 5
# A：直接採用 Student t（p<0.05）的結論，在 Welch 下不成立
assert (g["t"].pvalue < 0.05) != (welch.pvalue < 0.05)
# C：兩組是不同田區、樣本數不同，ttest_rel 根本無法執行
try:
    stats.ttest_rel(a, b); raise AssertionError("should raise")
except ValueError:
    pass
# D：p 值是在 H0 為真下觀察到至少如此極端結果的機率；以模擬確認 H0 下 p<0.05 的頻率約 5%，
#    p 值不是「H0 為真的機率」
rng2 = np.random.default_rng(0)
hits = np.mean([stats.ttest_ind(rng2.normal(0, 1, 30), rng2.normal(0, 1, 30)).pvalue < 0.05 for _ in range(2000)])
assert 0.035 < hits < 0.065
print("OK", "senior-bigdata-practice-q192")
