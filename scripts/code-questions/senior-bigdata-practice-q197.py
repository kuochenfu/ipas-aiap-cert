import numpy as np, pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(5)
n = 40
df = pd.DataFrame({"fert": np.round(rng.uniform(50, 150, n), 0),
                   "rain": np.round(rng.uniform(300, 900, n), 0)})
df["yield_kg"] = np.round(800 + 4 * df.fert + 0.8 * df.rain + rng.normal(0, 60, n), 0)
ref = sm.OLS(df["yield_kg"], sm.add_constant(df[["fert", "rain"]])).fit()
# C（正解）：公式介面自動含截距，且有 pvalues
c = smf.ols("yield_kg ~ fert + rain", data=df).fit()
assert np.allclose(c.params.values, ref.params.values) and np.allclose(c.pvalues.values, ref.pvalues.values)
assert list(c.params.index) == ["Intercept", "fert", "rain"]
# A：引數對調，能執行但估的是另一個模型（係數與參考完全不同）
a = sm.OLS(sm.add_constant(df[["fert", "rain"]]), df["yield_kg"]).fit()
assert a.params.shape != ref.params.shape
try:
    a.pvalues; raise AssertionError("should raise")
except ValueError:
    pass  # fit() 能跑，但把 3 欄當依變數，取 p 值時因殘差形狀不符而失敗
assert round(ref.params["fert"], 1) == 3.8 and round(d_ := sm.OLS(df["yield_kg"], df[["fert", "rain"]]).fit().params["fert"], 1) == 6.9
# B：scikit-learn 的 LinearRegression 沒有 pvalues
try:
    LinearRegression().fit(df[["fert", "rain"]], df["yield_kg"]).pvalues
    raise AssertionError("should raise")
except AttributeError:
    pass
# D：sm.OLS 不會自動加截距，係數偏離
d = sm.OLS(df["yield_kg"], df[["fert", "rain"]]).fit()
assert "const" not in d.params.index and abs(d.params["fert"] - ref.params["fert"]) > 1
print("OK", "senior-bigdata-practice-q197")
