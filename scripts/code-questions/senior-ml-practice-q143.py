"""驗證 senior-ml-practice-q143：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''from sklearn.datasets import make_classification
X, y = make_classification(n_samples=3000, n_features=12, n_informative=5, weights=[0.9], random_state=0)'''

CODE = r'''from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipe, X, y, cv=skf, scoring="roc_auc")
print(scores.round(3), round(scores.mean(), 3))'''

EXPECTED = r'''[0.915 0.961 0.914 0.921 0.927] 0.927'''

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
from sklearn.model_selection import cross_validate
from sklearn.metrics import roc_auc_score
from sklearn.exceptions import NotFittedError
res = cross_validate(pipe, X, y, cv=skf, scoring="roc_auc", return_estimator=True)
splits = list(skf.split(X, y))
# ① 每折的 scaler 只看過訓練折
for est, (tr, te) in zip(res["estimator"], splits):
    sc = est.named_steps["scaler"]
    assert sc.n_samples_seen_ == len(tr)
    assert np.allclose(sc.mean_, X[tr].mean(axis=0))
# ② 5 個分數，各為該折驗證資料的 AUC
assert scores.shape == (5,) and np.allclose(scores, res["test_score"])
for s, est, (tr, te) in zip(scores, res["estimator"], splits):
    assert np.isclose(s, roc_auc_score(y[te], est.decision_function(X[te])))
# ③ 每折違約比例接近全體
for tr, te in splits:
    assert abs(y[te].mean() - y.mean()) < 0.005
# ④ 錯：原本的 pipe 沒有被擬合
try:
    pipe.predict(X[:5]); raise AssertionError("pipe 不應已被擬合")
except NotFittedError:
    pass
# ⑤ 錯：AUC 用連續分數；若先以 0.5 切成類別，分數會不同
hard = [roc_auc_score(y[te], est.predict(X[te])) for est, (tr, te) in zip(res["estimator"], splits)]
assert not np.allclose(hard, scores, atol=0.01)
truth = {1: True, 2: True, 3: True, 4: False, 5: False}
combos = {"A": [1, 2, 3], "B": [1, 2, 4], "C": [2, 3, 5], "D": [1, 4, 5]}
for k, c in combos.items():
    assert all(truth[i] for i in c) == (k == "A")

print("OK", "senior-ml-practice-q143")
