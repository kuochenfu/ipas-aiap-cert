import io, contextlib
import numpy as np, pandas as pd

csv = "patient_id,age,blood,visits\n1,45,A,3\n2,未填,O,\n3,60,B,1\n4,38,AB,2\n"
def read_csv(_):
    return pd.read_csv(io.StringIO(csv))
code = 'df = read_csv("intake.csv")\nprint(df.dtypes)'
g = {"read_csv": read_csv}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = """patient_id      int64
age            object
blood          object
visits        float64
dtype: object"""
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
df = g["df"]
# ① 為真：astype(int) 拋 ValueError
try:
    df["age"].astype(int); raise AssertionError("should raise")
except ValueError:
    pass
# ② 為真：to_numeric coerce → NaN、float64
r = pd.to_numeric(df["age"], errors="coerce")
assert r.dtype == np.float64 and r.isna().sum() == 1 and pd.isna(r[1])
# ③ 為假：object 欄位 mean() 不會略過字串，而是拋 TypeError
try:
    df["age"].mean(); raise AssertionError("should raise")
except TypeError:
    pass
# ④ 為假：visits 為 float64 是因為空白格被讀成 NaN，原檔沒有任何小數
assert df["visits"].isna().sum() == 1
assert (df["visits"].dropna() % 1 == 0).all()
assert pd.read_csv(io.StringIO(csv.replace("O,\n", "O,4\n")))["visits"].dtype == np.int64
# ⑤ 為真：上萬筆、四種值的欄位轉 category 記憶體大幅下降
rng = np.random.default_rng(0)
blood = pd.Series(rng.choice(["A", "B", "O", "AB"], 20000))
assert blood.astype("category").memory_usage(deep=True) < 0.1 * blood.memory_usage(deep=True)
# 正解 A＝①②⑤；B 含③、C 含④、D 含③④ 都含假敘述
truth = {1: True, 2: True, 3: False, 4: False, 5: True}
opts = {"A": [1, 2, 5], "B": [1, 2, 3], "C": [2, 4, 5], "D": [1, 3, 4]}
correct = {k for k, v in opts.items() if set(v) == {i for i, t in truth.items() if t}}
assert correct == {"A"}
print("OK", "senior-bigdata-practice-q184")
