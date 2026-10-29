"""驗證 senior-ml-practice-q149：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''import numpy as np
rng = np.random.RandomState(0)
n_pat, per = 40, 20
pat_y = rng.permutation(np.r_[np.zeros(20), np.ones(20)].astype(int))
sig = rng.randn(n_pat, 8) * 2
sig[:, 0] += pat_y * 3
X = np.repeat(sig, per, axis=0) + rng.randn(n_pat * per, 8) * 0.5
y = np.repeat(pat_y, per)
patient_id = np.repeat(np.arange(n_pat), per)'''

CODE = r'''from sklearn.model_selection import KFold, cross_val_score
from sklearn.neighbors import KNeighborsClassifier

# X：800 段心電圖特徵；y：該段所屬病患的診斷；patient_id：病患編號
knn = KNeighborsClassifier(n_neighbors=5)
cv = KFold(n_splits=5, shuffle=True, random_state=0)
print(round(cross_val_score(knn, X, y, cv=cv).mean(), 3))'''

EXPECTED = r'''1.0'''

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
import numpy as np
from sklearn.model_selection import StratifiedKFold, GroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
assert cross_val_score(knn, X, y, cv=cv).mean() > 0.99
for tr, te in cv.split(X):
    assert set(patient_id[te]) <= set(patient_id[tr])   # 驗證折的病患全都在訓練折出現過
A_ = cross_val_score(knn, X, y, cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=0)).mean(); assert A_ > 0.99
B_ = cross_val_score(make_pipeline(StandardScaler(), knn), X, y, cv=cv).mean(); assert B_ > 0.99
D_ = cross_val_score(KNeighborsClassifier(n_neighbors=15), X, y, cv=cv).mean(); assert D_ > 0.99
gkf = GroupKFold(n_splits=5)
for tr, te in gkf.split(X, y, groups=patient_id):
    assert not set(patient_id[te]) & set(patient_id[tr])
C_ = cross_val_score(knn, X, y, cv=gkf, groups=patient_id).mean()
assert 0.6 < C_ < 0.8, C_

print("OK", "senior-ml-practice-q149")
