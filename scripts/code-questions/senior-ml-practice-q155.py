"""驗證 senior-ml-practice-q155：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''from sklearn.datasets import make_classification
X, y = make_classification(n_samples=1200, n_features=20, n_informative=5, flip_y=0.1, random_state=5)'''

CODE = r'''import pandas as pd
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeClassifier

gs = GridSearchCV(DecisionTreeClassifier(random_state=0),
                  {"max_depth": [2, 4, 6, 10, None]},
                  cv=5, return_train_score=True).fit(X, y)
cols = ["param_max_depth", "mean_train_score", "mean_test_score", "rank_test_score"]
print(pd.DataFrame(gs.cv_results_)[cols].round(3).to_string(index=False))'''

EXPECTED = r'''param_max_depth  mean_train_score  mean_test_score  rank_test_score
              2             0.838            0.821                4
              4             0.898            0.862                1
              6             0.936            0.847                2
             10             0.978            0.825                3
           None             1.000            0.807                5'''

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
r = pd.DataFrame(gs.cv_results_)
tr, te = r["mean_train_score"].values, r["mean_test_score"].values
assert gs.best_params_ == {"max_depth": 4}
assert all(a < b for a, b in zip(tr, tr[1:])) and te[1] > te[2] > te[3] > te[4]   # B
assert tr[4] == 1.0 and te[4] == te.min()                                        # A
assert np.argmin(tr - te) == 0 and te[0] < te[1] - 0.03                          # C
assert r.loc[r["rank_test_score"] == 1, "param_max_depth"].iloc[0] == 4           # D
assert gs.best_params_["max_depth"] is not None

print("OK", "senior-ml-practice-q155")
