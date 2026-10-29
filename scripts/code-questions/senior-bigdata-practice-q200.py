# 驗證：先過採樣再切分造成副本跨組（資料洩漏）；只對訓練集過採樣才是正確修法
import io, contextlib, warnings
warnings.filterwarnings("ignore")
import numpy as np, pandas as pd
from sklearn.datasets import make_classification
from sklearn.utils import resample
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import recall_score, precision_score

# 以合成資料取代病歷：2,000 筆、10 個數值特徵、陽性 127 筆
X0, y0 = make_classification(n_samples=2000, n_features=10, n_informative=4,
                             weights=[0.95], flip_y=0.03, random_state=7)
df = pd.DataFrame(X0, columns=[f"x{i}" for i in range(10)])
df["sepsis"] = y0
assert len(df) == 2000 and int(df["sepsis"].sum()) == 127

# ── 題目程式碼（原樣）──
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    major = df[df["sepsis"] == 0]
    minor = df[df["sepsis"] == 1]
    minor_up = resample(minor, replace=True, n_samples=len(major), random_state=0)
    bal = pd.concat([major, minor_up])

    X, y = bal.drop(columns="sepsis"), bal["sepsis"]
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)
    clf = RandomForestClassifier(random_state=0).fit(X_tr, y_tr)
    pred = clf.predict(X_te)
    print(f"recall = {recall_score(y_te, pred):.3f}")
    print(f"precision = {precision_score(y_te, pred):.3f}")
assert buf.getvalue() == "recall = 1.000\nprecision = 0.987\n", buf.getvalue()

# 洩漏證據：測試集 750 列中的 377 筆陽性，全部在訓練集裡有完全相同的副本
assert int(y_te.sum()) == 377 and int(X_te.index.isin(X_tr.index).sum()) == 377   # 377 筆陽性全部在訓練集有副本

def upsample(frame, seed=0):
    ma, mi = frame[frame["sepsis"] == 0], frame[frame["sepsis"] == 1]
    return pd.concat([ma, resample(mi, replace=True, n_samples=len(ma), random_state=seed)])

# ── 正解 B：先分層切分，只對訓練集過採樣 ──
Xa, ya = df.drop(columns="sepsis"), df["sepsis"]
Xtr, Xte, ytr, yte = train_test_split(Xa, ya, test_size=0.2, stratify=ya, random_state=0)
tr_b = upsample(pd.concat([Xtr, ytr], axis=1))
clf_b = RandomForestClassifier(random_state=0).fit(tr_b.drop(columns="sepsis"), tr_b["sepsis"])
pb = clf_b.predict(Xte)
rec_b, prec_b = recall_score(yte, pb), precision_score(yte, pb)
assert abs(rec_b - 0.52) < 0.005 and abs(prec_b - 0.929) < 0.005   # 約五成，與上線表現相符
assert not Xte.index.isin(tr_b.index).any()                           # 無副本跨組
assert abs(yte.mean() - 127 / 2000) < 0.005                           # 測試集保有真實盛行率

# ── A 錯：只加 stratify，副本仍跨組，召回率仍是 1.000 ──
Xtr, Xte2, ytr, yte2 = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)
pa = RandomForestClassifier(random_state=0).fit(Xtr, ytr).predict(Xte2)
assert recall_score(yte2, pa) == 1.0
assert Xte2.index.isin(Xtr.index).sum() > 300

# ── C 錯：測試集也過採樣，陽性比例被灌到 50%，精確率由約 0.93 虛增到約 0.99 ──
te_b = upsample(pd.concat([Xte, yte], axis=1))
pc = clf_b.predict(te_b.drop(columns="sepsis"))
assert abs(te_b["sepsis"].mean() - 0.5) < 1e-9
prec_c = precision_score(te_b["sepsis"], pc)
assert prec_c > 0.99 and prec_c - prec_b > 0.05

# ── D 錯：在已過採樣的 bal 上做 5 折交叉驗證，洩漏依舊 ──
cv = cross_val_score(RandomForestClassifier(random_state=0), X, y, cv=5, scoring="recall").mean()
assert cv > 0.99 and cv - rec_b > 0.4

print("OK", "senior-bigdata-practice-q200")
