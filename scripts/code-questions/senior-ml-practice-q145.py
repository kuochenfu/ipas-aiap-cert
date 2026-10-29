"""驗證 senior-ml-practice-q145：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''import numpy as np
from sklearn.datasets import make_classification
X0, y0 = make_classification(n_samples=1000, n_features=10, n_informative=6, weights=[0.92], class_sep=2.0, flip_y=0, random_state=0)
order = np.argsort(y0, kind="stable")   # 依品檢結果排序：良品在前、不良品在後
X, y = X0[order], y0[order]'''

CODE = r'''from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold, KFold
from sklearn.metrics import f1_score

pipe = make_pipeline(StandardScaler(), LogisticRegression())'''

EXPECTED = r''''''

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
ev = lambda s: eval(s, globals())
D_ = ev('cross_val_score(pipe, X, y, cv=StratifiedKFold(n_splits=5), scoring="f1")')
assert D_.shape == (5,) and not np.isnan(D_).any() and (D_ > 0.3).all()
for tr, te in StratifiedKFold(n_splits=5).split(X, y):
    assert abs(y[te].mean() - y.mean()) < 0.01
# A：傳入指標函式而非評分器 → ValueError
try:
    ev('cross_val_score(pipe, X, y, cv=StratifiedKFold(n_splits=5), scoring=f1_score)'); raise AssertionError("A 不應成功")
except ValueError as e:
    assert "make_scorer" in str(e)
# B：X、y 對調 → ValueError
try:
    ev('cross_val_score(pipe, y, X, cv=StratifiedKFold(n_splits=5), scoring="f1")'); raise AssertionError("B 不應成功")
except ValueError:
    pass
# C：能執行，但各折不良比例嚴重失衡，分數也不同
rates = [y[te].mean() for tr, te in KFold(n_splits=5).split(X, y)]
assert max(rates) - min(rates) > 0.3
C_ = ev('cross_val_score(pipe, X, y, cv=KFold(n_splits=5), scoring="f1")')
assert C_.shape == (5,) and not np.allclose(np.nan_to_num(C_), D_)

print("OK", "senior-ml-practice-q145")
