"""驗證 senior-ml-practice-q150：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''import pandas as pd
X_train = pd.DataFrame({
    "temp": [180, 182, 179, 185, 190, 176, 181, 188, 183, 178, 186, 184],
    "pressure": [2.1, 2.3, 2.0, 2.4, 2.6, 1.9, 2.2, 2.5, 2.3, 2.0, 2.4, 2.2],
    "line": ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B", "C", "D"]})
X_test = pd.DataFrame({
    "temp": [187, 175, 184, 189, 177],
    "pressure": [2.5, 1.8, 2.3, 2.6, 1.9],
    "line": ["A", "B", "A", "B", "B"]})'''

CODE = r'''from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

pre = ColumnTransformer([
    ("num", StandardScaler(), ["temp", "pressure"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["line"]),
])
X_tr = pre.fit_transform(X_train)
X_te = pre.transform(X_test)'''

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
from sklearn.exceptions import NotFittedError
TPL = CODE.replace("pre.fit_transform(X_train)", "pre.{a}(X_train)").replace("pre.transform(X_test)", "pre.{b}(X_test)")
def run(a, b):
    g = {"X_train": X_train, "X_test": X_test}
    exec(TPL.format(a=a, b=b), g)
    return g
# B 對
g = run("fit_transform", "transform")
assert g["X_tr"].shape == (12, 6) and g["X_te"].shape == (5, 6)
assert np.allclose(g["pre"].named_transformers_["num"].mean_, X_train[["temp", "pressure"]].mean().values)
# A 錯：fit 回傳轉換器本身
g = run("fit", "fit_transform")
assert not hasattr(g["X_tr"], "shape") and type(g["X_tr"]).__name__ == "ColumnTransformer"
assert g["X_te"].shape == (5, 4)
# C 錯：未擬合就 transform
try:
    run("transform", "fit_transform"); raise AssertionError("C 不應成功")
except NotFittedError:
    pass
# D 錯：測試集重新擬合，欄數與參數都變了
g = run("fit_transform", "fit_transform")
assert g["X_tr"].shape[1] == 6 and g["X_te"].shape[1] == 4
assert np.allclose(g["pre"].named_transformers_["num"].mean_, X_test[["temp", "pressure"]].mean().values)

print("OK", "senior-ml-practice-q150")
