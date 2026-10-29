"""驗證 senior-ml-practice-q148：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=2000, n_features=15, n_informative=5, weights=[0.95], flip_y=0.01, random_state=4)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)'''

CODE = r'''from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV

pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
grid = {"logisticregression__C": [0.01, 0.1, 1, 10]}
gs = GridSearchCV(pipe, grid, cv=5, scoring="roc_auc")
gs.fit(X_train, y_train)
print(gs.best_params_)
print(round(gs.best_score_, 3), round(gs.score(X_test, y_test), 3))'''

EXPECTED = r'''{'logisticregression__C': 10}
0.911 0.888'''

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
from sklearn.base import clone
from sklearn.model_selection import cross_val_score
from sklearn.metrics import roc_auc_score, accuracy_score
best = clone(pipe).set_params(**gs.best_params_)
assert np.isclose(cross_val_score(best, X_train, y_train, cv=5, scoring="roc_auc").mean(), gs.best_score_)   # ①
s = gs.score(X_test, y_test)
assert np.isclose(s, roc_auc_score(y_test, gs.predict_proba(X_test)[:, 1]))   # ②
assert not np.isclose(s, accuracy_score(y_test, gs.predict(X_test)))
assert gs.best_estimator_.named_steps["standardscaler"].n_samples_seen_ == len(X_train)   # ③
assert round(gs.best_score_, 3) != round(s, 3) and abs(gs.best_score_ - s) > 0.005   # ④ 錯
assert gs.n_splits_ == 5 and len(gs.cv_results_["params"]) == 4   # ⑤ 錯：20 次 + refit 1 次
assert hasattr(gs, "refit_time_")
truth = {1: True, 2: True, 3: True, 4: False, 5: False}
combos = {"A": [1, 2, 3], "B": [2, 3, 5], "C": [1, 4, 5], "D": [1, 3, 4]}
for k, c in combos.items():
    assert all(truth[i] for i in c) == (k == "A")

print("OK", "senior-ml-practice-q148")
