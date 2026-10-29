import io, contextlib
import numpy as np
from scipy import stats

rng = np.random.default_rng(2024)
a = rng.normal(1500, 400, 200_000)   # 舊介面：每位用戶的平均單筆金額（元）
b = rng.normal(1506, 400, 200_000)   # 新介面
code = '''t = stats.ttest_ind(b, a)
d = (b.mean() - a.mean()) / np.sqrt((a.var(ddof=1) + b.var(ddof=1)) / 2)
print(f"mean diff = {b.mean() - a.mean():.2f} 元")
print(f"t = {t.statistic:.2f}, p = {t.pvalue:.1e}")
print(f"Cohen's d = {d:.3f}")'''
g = {"np": np, "stats": stats, "a": a, "b": b}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = """mean diff = 6.61 元
t = 5.22, p = 1.8e-07
Cohen's d = 0.016"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
d = g["d"]
assert round(stats.mannwhitneyu(b, a).pvalue, 7) == 7e-07 or abs(stats.mannwhitneyu(b, a).pvalue - 7.1e-07) < 1e-08
# A（正解）：顯著但效果量極小（d < 0.2 的「小」門檻的十分之一）
assert g["t"].pvalue < 1e-6 and abs(d) < 0.02
# B：平均差 6.61 元只占 1500 元的約 0.4%，談不上大幅提升
assert (b.mean() - a.mean()) / a.mean() < 0.005
# C：換成 Mann-Whitney U 仍然顯著，換檢定不會讓結論翻轉
assert stats.mannwhitneyu(b, a).pvalue < 1e-5
# D：隨機抽 2000 筆只是丟掉檢定力，結果變得不顯著並不代表更可信
rng2 = np.random.default_rng(0)
ps = []
for _ in range(50):
    idx = rng2.choice(len(a), 2000, replace=False)
    ps.append(stats.ttest_ind(b[idx], a[idx]).pvalue)
assert np.mean(np.array(ps) < 0.05) < 0.3   # 真實差異存在，小樣本多半偵測不到
print("OK", "senior-bigdata-practice-q198")
