import io, contextlib
import numpy as np, pandas as pd
import statsmodels.formula.api as smf

def make(seed):
    rng = np.random.default_rng(seed)
    n = 200
    income = np.round(rng.normal(60, 15, n), 1)   # 月收入（千元）
    age = rng.integers(22, 65, n)
    spend = np.round(5 + 0.3 * income + 0.02 * age + rng.normal(0, 4, n), 1)  # 月刷卡（千元）
    return pd.DataFrame({"spend": spend, "income": income, "age": age})
df = make(3)
code = '''res = smf.ols("spend ~ income + age", data=df).fit()
print(f"R-squared: {res.rsquared:.3f}   n = {int(res.nobs)}")
print(res.summary().tables[1])'''
g = {"df": df, "smf": smf}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = """R-squared: 0.584   n = 200
==============================================================================
                 coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
Intercept      4.7530      1.441      3.299      0.001       1.912       7.594
income         0.2980      0.018     16.291      0.000       0.262       0.334
age            0.0323      0.023      1.375      0.171      -0.014       0.079
=============================================================================="""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
res = g["res"]
# D（正解）：income 的偏迴歸係數約 0.30（其他變數固定）
assert round(res.params["income"], 2) == 0.30
# A：R² 是被解釋的變異比例，不是「預測完全正確」的比例；完全命中的筆數為 0
assert np.mean(np.isclose(res.fittedvalues, df["spend"], atol=0.05)) < 0.05
assert np.isclose(res.rsquared, 1 - res.ssr / res.centered_tss)
# B：不顯著不等於沒有影響——資料本身由 0.02×age 生成，信賴區間也涵蓋正值
lo, hi = res.conf_int().loc["age"]
assert lo < 0.02 < hi and hi > 0
# C：16.291 是 t 值（係數 / 標準誤），不是係數
assert np.isclose(res.tvalues["income"], res.params["income"] / res.bse["income"])
assert abs(res.tvalues["income"] - res.params["income"]) > 10
print("OK", "senior-bigdata-practice-q193")
