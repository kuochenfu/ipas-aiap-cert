import io, contextlib
import pandas as pd

CODE = '''import pandas as pd

students = pd.DataFrame({"sid": [1, 2, 3, 4], "name": ["王", "李", "陳", "林"]})
enroll = pd.DataFrame({"sid": [1, 1, 2, 5], "course": ["統計", "程式", "統計", "英文"]})

merged = students.merge(enroll, on="sid", how="left")
print(merged.shape, merged["course"].isna().sum())'''

ns = {}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(CODE, ns)
out = buf.getvalue().strip()
print(out)
CHOICES = {"A": "(4, 3) 2", "B": "(5, 3) 2", "C": "(6, 3) 2", "D": "(3, 3) 0"}
assert out == CHOICES["B"]
s, e = ns["students"], ns["enroll"]
def fmt(m): return f"{m.shape} {m['course'].isna().sum()}"
# C 是 outer 的結果（多出只在選課表的 sid 5）；D 是 inner 的結果
assert fmt(s.merge(e, on="sid", how="outer")) == CHOICES["C"]
assert fmt(s.merge(e, on="sid", how="inner")) == CHOICES["D"]
# A 是「以為 left join 列數固定等於左表」的誤解：實際上 sid 1 被展開成兩列
assert out != CHOICES["A"] and (ns["merged"]["sid"] == 1).sum() == 2
print("OK", "senior-bigdata-practice-q175")
