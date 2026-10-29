import io, contextlib
import numpy as np, pandas as pd
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

rng = np.random.default_rng(2)
n = 80
w = rng.normal(70, 12, n)
df = pd.DataFrame({"weight_clinic": np.round(w, 1),
                   "weight_self": np.round(w + rng.normal(-1, 1.5, n), 0)})
df["sbp"] = np.round(85 + 0.5 * w + rng.normal(0, 9, n), 0)
code = '''X = sm.add_constant(df[["weight_clinic", "weight_self"]])
res = sm.OLS(df["sbp"], X).fit()
print(f"R-squared: {res.rsquared:.3f}   Prob (F-statistic): {res.f_pvalue:.2e}")
print(res.summary().tables[1])
print("VIF:", [round(float(variance_inflation_factor(X.values, i)), 1) for i in (1, 2)])'''
g = {"df": df, "sm": sm, "variance_inflation_factor": variance_inflation_factor}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = """R-squared: 0.375   Prob (F-statistic): 1.38e-08
=================================================================================
                    coef    std err          t      P>|t|      [0.025      0.975]
---------------------------------------------------------------------------------
const            75.2137      6.756     11.133      0.000      61.761      88.667
weight_clinic     0.7158      0.840      0.852      0.397      -0.956       2.388
weight_self      -0.0799      0.833     -0.096      0.924      -1.739       1.579
=================================================================================
VIF: [80.6, 80.6]"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
res = g["res"]
# A（正解）：高度共線；只保留一欄後係數顯著、標準誤大幅縮小、R² 幾乎不變
assert np.corrcoef(df["weight_clinic"], df["weight_self"])[0, 1] > 0.98
r1 = sm.OLS(df["sbp"], sm.add_constant(df[["weight_clinic"]])).fit()
assert r1.pvalues["weight_clinic"] < 1e-6
assert r1.bse["weight_clinic"] < res.bse["weight_clinic"] / 5
assert abs(r1.rsquared - res.rsquared) < 0.005
# B：整體 F 檢定極顯著，體重與血壓有關（資料由 0.5×體重生成）
assert res.f_pvalue < 1e-6
# C：weight_self 的負號是共線造成的不穩定估計；單獨放入時係數為正且顯著
r2 = sm.OLS(df["sbp"], sm.add_constant(df[["weight_self"]])).fit()
assert res.params["weight_self"] < 0 < r2.params["weight_self"] and r2.pvalues["weight_self"] < 1e-6
# D：模型並非無效（F 顯著）；加入無關特徵也不會降低兩欄之間的 VIF
rng2 = np.random.default_rng(9)
X3 = sm.add_constant(df[["weight_clinic", "weight_self"]].assign(noise=rng2.normal(size=n)))
assert variance_inflation_factor(X3.values, 1) > 70
print("OK", "senior-bigdata-practice-q194")
