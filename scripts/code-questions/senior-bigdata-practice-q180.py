import io, contextlib
import pandas as pd

CODE = '''import pandas as pd

scores = pd.Series(["85", "90", "缺考", "", "70"])
n = pd.to_numeric(scores, errors="coerce")
print(n.isna().sum(), n.count(), round(n.mean(), 1))'''
ns = {}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(CODE, ns)
out = buf.getvalue().strip()
print(out)
CHOICES = {"A": "1 4 61.2", "B": "2 3 81.7", "C": "2 5 49.0", "D": "0 5 49.0"}
assert out == CHOICES["B"]
# A：誤以為空字串會轉成 0（只有「缺考」變 NaN）
assert round((85 + 90 + 0 + 70) / 4, 1) == 61.2
# C：誤以為 count() 連 NaN 也算、平均除以 5
assert (85 + 90 + 70) / 5 == 49.0 and ns["n"].count() == 3 and ns["n"].size == 5
# D：誤以為 errors="coerce" 會把無法轉換的值補 0
assert ns["n"].isna().sum() == 2
# 不加 errors="coerce" 才會拋例外
try:
    pd.to_numeric(scores := ns["scores"]); raise SystemExit("應拋出 ValueError")
except ValueError:
    pass
print("OK", "senior-bigdata-practice-q180")
