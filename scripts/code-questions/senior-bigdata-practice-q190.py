import io, contextlib
import numpy as np, pandas as pd
from scipy import stats

rng = np.random.default_rng(42)
df = pd.DataFrame({"defects": rng.negative_binomial(n=1.2, p=0.28, size=60)})
code = '''s = df["defects"]
print(round(s.mean(), 2), round(s.var(), 2))
print(round((s == 0).mean(), 3), round(stats.poisson.pmf(0, s.mean()), 3))'''
g = {"df": df, "stats": stats}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = "3.27 10.67\n0.217 0.038"
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
s = g["s"]
# A（正解）：變異數約為平均的 3 倍、零值比 Poisson 預期多約 5 倍 → 過度離散
assert 3.0 < s.var() / s.mean() < 3.5
assert (s == 0).mean() / stats.poisson.pmf(0, s.mean()) > 5
# 負二項（以動差法估參數）預測的零值比例遠比 Poisson 接近觀測值
p_hat = s.mean() / s.var(); r_hat = s.mean() * p_hat / (1 - p_hat)
nb0 = stats.nbinom.pmf(0, r_hat, p_hat)
assert abs(nb0 - (s == 0).mean()) < abs(stats.poisson.pmf(0, s.mean()) - (s == 0).mean())
# B：Poisson 要求平均≈變異數，10.67 與 3.27 差三倍，兩者「都大於 3」不是判準
assert not np.isclose(s.mean(), s.var(), rtol=0.2)
# C：CLT 談的是樣本平均的抽樣分布，每日缺陷數本身仍是右偏、非負的離散分布
assert stats.skew(s) > 1 and stats.shapiro(s).pvalue < 0.001
# D：二項分布的變異數 np(1-p) 一定小於平均 np，更無法描述變異數大於平均的資料
for n in (50, 200, 1000):
    p = s.mean() / n
    assert stats.binom.var(n, p) < s.mean() < s.var()
print("OK", "senior-bigdata-practice-q190")
