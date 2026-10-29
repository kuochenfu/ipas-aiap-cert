"""驗證 senior-ml-practice-q151：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''import numpy as np, pandas as pd
from sklearn.datasets import make_classification
X0, y0 = make_classification(n_samples=2000, n_features=8, n_informative=3, weights=[0.93], flip_y=0.03, random_state=1)
df = pd.DataFrame(X0, columns=[f"f{i}" for i in range(8)])
df["dropout"] = y0'''

CODE = r'''import pandas as pd
from sklearn.utils import resample
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import recall_score

major = df[df["dropout"] == 0]
minor = df[df["dropout"] == 1]
minor_up = resample(minor, replace=True, n_samples=len(major), random_state=0)
balanced = pd.concat([major, minor_up])

X = balanced.drop(columns="dropout")
y = balanced["dropout"]
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=0)
clf = DecisionTreeClassifier(random_state=0).fit(X_tr, y_tr)
print(recall_score(y_te, clf.predict(X_te)), (y_te == 1).sum())'''

EXPECTED = r'''1.0 367'''

ns = {}
exec(SETUP, ns)
_buf = io.StringIO()
with contextlib.redirect_stdout(_buf):
    exec(CODE, ns)
_out = _buf.getvalue()
if EXPECTED.strip():
    assert _out.rstrip() == EXPECTED.rstrip(), "輸出不符：\n" + _out
globals().update({k: v for k, v in ns.items() if not k.startswith("__")})

# ── 正解與錯誤選項的檢查 ──
import numpy as np, pandas as pd
assert recall_score(y_te, clf.predict(X_te)) == 1.0
# A 對：測試集休學樣本的原始資料列全都出現在訓練集
assert X_te[y_te == 1].index.isin(X_tr.index).mean() == 1.0
Xa, Xb, ya, yb = train_test_split(df.drop(columns="dropout"), df["dropout"], test_size=0.2, stratify=df["dropout"], random_state=0)
tr = pd.concat([Xa, ya], axis=1)
mj, mn = tr[tr["dropout"] == 0], tr[tr["dropout"] == 1]
tb = pd.concat([mj, resample(mn, replace=True, n_samples=len(mj), random_state=0)])
clf2 = DecisionTreeClassifier(random_state=0).fit(tb.drop(columns="dropout"), tb["dropout"])
r2 = recall_score(yb, clf2.predict(Xb)); assert 0.4 < r2 < 0.65, r2
# B 錯：拿掉 stratify 仍為 1.0
Xc, Xd, yc, yd = train_test_split(X, y, test_size=0.2, random_state=0)
assert recall_score(yd, DecisionTreeClassifier(random_state=0).fit(Xc, yc).predict(Xd)) > 0.99
# C 錯：樣本數不少，且換切分仍為 1.0
assert (y_te == 1).sum() == 367
for rs in range(1, 6):
    a, b, c, d = train_test_split(X, y, test_size=0.2, stratify=y, random_state=rs)
    assert recall_score(d, DecisionTreeClassifier(random_state=0).fit(a, c).predict(b)) > 0.99
# D 錯：過採樣後兩類筆數相同
assert (y == 1).sum() == (y == 0).sum()
assert minor.shape[0] < 200

print("OK", "senior-ml-practice-q151")
