import io, contextlib
import pandas as pd

df = pd.DataFrame({"student": list("abcdefgh"),
                   "score": ["85", "92", "缺考", "78", "85", "90 ", "88", "70"]})
code = 'print(df["score"].describe())\nprint(df.dtypes)'
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, {"df": df})
EXPECTED = """count      8
unique     7
top       85
freq       2
Name: score, dtype: object
student    object
score      object
dtype: object"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()

# C（正解）：欄位是字串，to_numeric(coerce) 後可找出轉不出來的值
num = pd.to_numeric(df["score"], errors="coerce")
assert df["score"].dtype == object
assert df.loc[num.isna(), "score"].tolist() == ["缺考"]
assert num.notna().sum() == 7 and round(num.mean(), 2) == 84.0
# A：top 是出現最多次的字串（眾數），不是平均；平均是 84
assert df["score"].describe()["top"] == "85" and num.mean() != 85
# B：unique=7 是相異值個數；整列重複為 0，學生也各不相同
assert df.duplicated().sum() == 0 and df["student"].nunique() == 8
# D：count=8 只代表非空字串 8 個；astype(int) 會因「缺考」拋 ValueError
try:
    df["score"].astype(int); raise AssertionError("should raise")
except ValueError:
    pass
print("OK", "senior-bigdata-practice-q186")
