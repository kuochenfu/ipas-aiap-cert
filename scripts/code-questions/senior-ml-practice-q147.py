"""驗證 senior-ml-practice-q147：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''import numpy as np
rng = np.random.RandomState(1)
X = rng.randn(120, 3000)
y_perm = rng.permutation(np.r_[np.zeros(60), np.ones(60)].astype(int))'''

CODE = r'''from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

# y_perm：把抗病標籤隨機打亂後的對照組，與 X 已無任何關聯
X_sel = SelectKBest(f_classif, k=20).fit_transform(X, y_perm)
clf = LogisticRegression(max_iter=1000)
scores = cross_val_score(clf, X_sel, y_perm, cv=5)
print(round(scores.mean(), 3))'''

EXPECTED = r'''0.892'''

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
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.pipeline import make_pipeline
assert scores.mean() > 0.85
A_ = cross_val_score(clf, X_sel, y_perm, cv=10).mean(); assert A_ > 0.85, A_
B_ = cross_val_score(clf, X_sel, y_perm, cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=0)).mean(); assert B_ > 0.8, B_
Xtr, Xte, ytr, yte = train_test_split(X_sel, y_perm, test_size=0.25, stratify=y_perm, random_state=0)
C_ = clf.fit(Xtr, ytr).score(Xte, yte); assert C_ > 0.8, C_
pipe = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))
D_ = cross_val_score(pipe, X, y_perm, cv=5).mean(); assert 0.4 < D_ < 0.6, D_

print("OK", "senior-ml-practice-q147")
