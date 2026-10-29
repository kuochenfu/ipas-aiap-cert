import io, contextlib
import numpy as np, pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.DataFrame({"los_days": [2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 40, 45]})
code = '''days = df["los_days"]
z = (days - days.mean()) / days.std()
print(round(days.mean(), 2), round(days.std(), 2))
print("flagged:", days[z.abs() > 3].tolist())'''
g = {"df": df}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(code, g)
EXPECTED = "11.0 14.85\nflagged: []"
assert buf.getvalue().rstrip("\n") == EXPECTED, buf.getvalue()
days = g["days"]; z = g["z"]
TARGET = {40, 45}
# C（正解）：Tukey 圍籬標出 40、45
q1, q3 = days.quantile([0.25, 0.75]); iqr = q3 - q1
c = set(days[(days > q3 + 1.5 * iqr) | (days < q1 - 1.5 * iqr)])
assert c == TARGET, c
# A：門檻降到 2 只抓到 45，40 仍被遮蔽
a = set(days[z.abs() > 2])
assert a == {45}
# B：clip 是把值壓低，不是偵測；壓完再算 z 仍一筆都沒標出
assert abs(days.quantile(0.99) - 44.45) < 1e-9
clipped = days.clip(upper=days.quantile(0.99))
zb = (clipped - clipped.mean()) / clipped.std()
assert set(days[zb.abs() > 3]) == set()
# D：StandardScaler 只是 ddof=0 的同一種 z 分數，仍一筆都沒標出
zd = StandardScaler().fit_transform(days.to_frame()).ravel()
assert set(days[np.abs(zd) > 3]) == set() and zd.max() < 3
print("OK", "senior-bigdata-practice-q189")
