import io, contextlib
import numpy as np, pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf

code = '''df = pd.DataFrame({"hours": [2, 4, 5, 7, 8, 10],
                   "absences": [5, 3, 4, 1, 2, 0]})
df["score"] = 40 + 5 * df["hours"] - 2 * df["absences"]
X = sm.add_constant(df[["hours", "absences"]])
res = sm.OLS(df["score"], X).fit()
print(res.params.round(2).to_dict())
new = pd.DataFrame({"hours": [6], "absences": [3]})
print(res.predict(new))'''
g = {"pd": pd, "sm": sm}
buf = io.StringIO()
raised = None
with contextlib.redirect_stdout(buf):
    try:
        exec(code, g)
    except Exception as e:
        raised = e
# 第一行輸出（題目附上的部分）
assert buf.getvalue().rstrip("\n") == "{'const': 40.0, 'hours': 5.0, 'absences': -2.0}", buf.getvalue()
# D（正解）：最後一行拋出 ValueError（new 只有 2 欄、params 有 3 個）
assert isinstance(raised, ValueError) and "not aligned" in str(raised)
res, new = g["res"], g["new"]
# A：64.0 是補上截距後才有的值；predict 不會自動補 const
assert np.isclose(float(res.predict(sm.add_constant(new, has_constant="add")).iloc[0]), 64.0)
# B：24.0 是把截距當 0 的結果，但程式沒有走到這一步
assert 5 * 6 - 2 * 3 == 24
# C：255.0 是依位置對上 const 與 hours 的結果（40×6＋5×3），statsmodels 也不會這樣算
assert 40 * 6 + 5 * 3 == 255
# A、B、C 都假設程式會印出數字，但實際上拋出例外
assert raised is not None
# 決策分界：公式介面會自動補截距，得到 64.0；單列資料用 add_constant 預設會被略過
fres = smf.ols("score ~ hours + absences", data=g["df"]).fit()
assert np.isclose(float(fres.predict(new).iloc[0]), 64.0)
assert "const" not in sm.add_constant(new).columns
print("OK", "senior-bigdata-practice-q196")
