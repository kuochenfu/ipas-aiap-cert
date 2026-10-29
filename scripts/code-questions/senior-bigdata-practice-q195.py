import io, contextlib
import numpy as np, pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(11)
n = 50
temp = np.round(rng.uniform(25, 45, n), 1)
kwh = np.round(120 + 2.5 * temp + rng.normal(0, 6, n), 1)
df = pd.DataFrame({"temp": temp, "kwh": kwh})
code = '''res = sm.OLS(df["kwh"], df[["temp"]]).fit()
print(f"statsmodels: slope = {res.params['temp']:.3f}, R-squared = {res.rsquared:.3f}")
lr = LinearRegression().fit(df[["temp"]], df["kwh"])
print(f"sklearn:     slope = {lr.coef_[0]:.3f}, R-squared = {lr.score(df[['temp']], df['kwh']):.3f}")'''
g = {"df": df, "sm": sm, "LinearRegression": LinearRegression}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = """statsmodels: slope = 5.933, R-squared = 0.989
sklearn:     slope = 2.487, R-squared = 0.869"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
res, lr = g["res"], g["lr"]
target_slope, target_r2 = lr.coef_[0], lr.score(df[["temp"]], df["kwh"])
# 原程式的 R² 是未中心化 R²（無截距模型），因此偏高
assert np.isclose(res.rsquared, 1 - res.ssr / np.sum(df["kwh"] ** 2))
# B（正解）：加上截距欄後與 sklearn 一致
rb = sm.OLS(df["kwh"], sm.add_constant(df[["temp"]])).fit()
assert np.isclose(rb.params["temp"], target_slope) and np.isclose(rb.rsquared, target_r2)
# A：對調 endog / exog 變成用 kwh 預測 temp，斜率完全不同
ra = sm.OLS(df[["temp"]], df["kwh"]).fit()
assert not np.isclose(ra.params.iloc[0], target_slope) and abs(ra.params.iloc[0] - target_slope) > 1
# C：公式中的「- 1」正是移除截距，結果與原本的錯誤模型相同
rc = smf.ols("kwh ~ temp - 1", data=df).fit()
assert np.isclose(rc.params["temp"], res.params["temp"]) and np.isclose(rc.rsquared, res.rsquared)
# D：調整後 R² 仍以未中心化為基礎、斜率也沒變
assert res.rsquared_adj > 0.98 and np.isclose(res.params["temp"], 5.933, atol=1e-3)
# 決策分界：公式介面不寫 - 1 時自動含截距
rf = smf.ols("kwh ~ temp", data=df).fit()
assert np.isclose(rf.params["temp"], target_slope)
assert round(ra.params.iloc[0], 3) == 0.167
print("OK", "senior-bigdata-practice-q195")
