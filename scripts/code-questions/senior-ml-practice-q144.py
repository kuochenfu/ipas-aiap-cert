"""驗證 senior-ml-practice-q144：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''from sklearn.datasets import make_classification
X, y = make_classification(n_samples=2000, n_features=12, n_informative=3, n_redundant=2, weights=[0.94], flip_y=0.01, class_sep=0.6, random_state=1)'''

CODE = r'''from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=0)
model = make_pipeline(StandardScaler(), LogisticRegression())
model.fit(X_train, y_train)
print(classification_report(y_test, model.predict(X_test)))'''

EXPECTED = r'''              precision    recall  f1-score   support

           0       0.95      1.00      0.97       468
           1       0.83      0.16      0.26        32

    accuracy                           0.94       500
   macro avg       0.89      0.58      0.62       500
weighted avg       0.94      0.94      0.93       500'''

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
from sklearn.metrics import recall_score, precision_score, accuracy_score, f1_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
pred = model.predict(X_test)
assert len(y_test) == 500 and (y_test == 1).sum() == 32
rec, prec, acc = recall_score(y_test, pred), precision_score(y_test, pred), accuracy_score(y_test, pred)
assert round(rec, 2) == 0.16 and round(prec, 2) == 0.83 and round(acc, 2) == 0.94
# A 錯：準確率幾乎等於全判陰性的基準
baseline = (y_test == 0).mean()
assert abs(baseline - 0.936) < 1e-9 and acc - baseline < 0.01
# B 錯：0.83 是 precision；實際患病者被找出的比例是 recall
assert prec > 0.8 and rec < 0.2
# D 錯：weighted avg 被多數類主導
assert round(f1_score(y_test, pred, average="weighted"), 2) == 0.93
assert round(f1_score(y_test, pred, average="macro"), 2) == 0.62
assert round(f1_score(y_test, pred), 2) == 0.26
# C 對：調整類別權重後召回率明顯提升
m2 = make_pipeline(StandardScaler(), LogisticRegression(class_weight="balanced")).fit(X_train, y_train)
assert recall_score(y_test, m2.predict(X_test)) > 0.7

print("OK", "senior-ml-practice-q144")
