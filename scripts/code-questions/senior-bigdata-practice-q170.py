import pandas as pd

CODE = '''import pandas as pd

df = pd.DataFrame({
    "student": ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08"],
    "class":   ["甲", "甲", "甲", "乙", "乙", "乙", "丙", "丙"],
    "score":   [92, 78, 85, 95, 66, 88, 71, 59],
})'''
ns = {}
exec(CODE, ns)
df = ns["df"]
OPTS = {
    "A": lambda: df.sort_values("score").groupby("class").head(2),
    "B": lambda: df.nlargest(2, "score").groupby("class").tail(2),
    "C": lambda: df.sort_values("score").groupby("class").tail(2),
    "D": lambda: df.groupby("class")["score"].tail(2).sort_values(),
}
# 期望：每班分數最高的兩位
want = {("甲", "S01"), ("甲", "S03"), ("乙", "S04"), ("乙", "S06"), ("丙", "S07"), ("丙", "S08")}
def pairs(res):
    if isinstance(res, pd.Series):
        return {(df.loc[i, "class"], df.loc[i, "student"]) for i in res.index}
    return set(zip(res["class"], res["student"]))
got = {k: pairs(f()) for k, f in OPTS.items()}
print(got)
assert got["C"] == want
assert got["A"] != want      # 每班最低的兩位
assert got["A"] == {("甲", "S02"), ("甲", "S03"), ("乙", "S05"), ("乙", "S06"), ("丙", "S07"), ("丙", "S08")}
assert got["B"] != want and len(got["B"]) == 2   # 全校前 2 名
assert got["D"] != want      # 依原始列序取每班最後兩筆
assert ("甲", "S01") not in got["D"] and ("乙", "S04") not in got["D"]
# D 只是 Series，也沒有學生欄位
assert isinstance(OPTS["D"](), pd.Series)
print("OK", "senior-bigdata-practice-q170")
