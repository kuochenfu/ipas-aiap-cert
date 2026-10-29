"""驗證 senior-ml-practice-q146：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=600, n_features=8, n_informative=4, random_state=2)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)'''

CODE = r'''from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

pipe = make_pipeline(StandardScaler(), SVC())'''

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
ev = lambda s: eval(s, globals())
assert list(pipe.named_steps) == ["standardscaler", "svc"]
gsD = ev('GridSearchCV(pipe, {"svc__C": [0.1, 1, 10]}, cv=5).fit(X_train, y_train)')
assert "svc__C" in gsD.best_params_
assert gsD.best_estimator_.named_steps["standardscaler"].n_samples_seen_ == len(X_train)
for bad in ['GridSearchCV(pipe, {"C": [0.1, 1, 10]}, cv=5).fit(X_train, y_train)',
            'GridSearchCV(pipe, {"SVC__C": [0.1, 1, 10]}, cv=5).fit(X_train, y_train)']:
    try:
        ev(bad); raise AssertionError("不應成功：" + bad)
    except ValueError as e:
        assert "Invalid parameter" in str(e)
# C：能執行，但搜尋與最終模型都只看過測試資料
gsC = ev('GridSearchCV(pipe, {"svc__C": [0.1, 1, 10]}, cv=5).fit(X_test, y_test)')
assert gsC.best_estimator_.named_steps["standardscaler"].n_samples_seen_ == len(X_test)

print("OK", "senior-ml-practice-q146")
