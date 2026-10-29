"""驗證 senior-ml-practice-q154：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=1500, n_features=10, n_informative=4, weights=[0.9], flip_y=0.02, class_sep=0.8, random_state=3)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)'''

CODE = r'''from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV

pipe = make_pipeline(StandardScaler(), LogisticRegression())
grid = {"logisticregression__C": [0.01, 1],
        "logisticregression__class_weight": [None, "balanced"]}'''

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
from sklearn.metrics import recall_score
ev = lambda s: eval(s, globals())
gA = ev('GridSearchCV(pipe, grid, scoring="recall", cv=5, refit=True)').fit(X_train, y_train)
pA = gA.predict(X_test)
assert gA.best_params_["logisticregression__class_weight"] == "balanced"
gB = ev('GridSearchCV(pipe, grid, scoring="recall", cv=5, refit=False)').fit(X_train, y_train)
try:
    gB.predict(X_test); raise AssertionError("B 不應能 predict")
except AttributeError:
    pass
gC = ev('GridSearchCV(pipe, grid, scoring="accuracy", cv=5, refit=True)').fit(X_train, y_train)
assert gC.best_params_["logisticregression__class_weight"] is None
assert recall_score(y_test, gC.predict(X_test)) < recall_score(y_test, pA) - 0.1
try:
    ev('GridSearchCV(pipe, grid, scoring=["recall", "accuracy"], cv=5, refit=True)').fit(X_train, y_train)
    raise AssertionError("D 不應成功")
except ValueError as e:
    assert "refit" in str(e)

print("OK", "senior-ml-practice-q154")
