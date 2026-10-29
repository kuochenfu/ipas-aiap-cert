# 驗證：roc_curve 要傳 y_true 與正類（1）的連續分數
import warnings
warnings.filterwarnings("ignore")
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve, auc, roc_auc_score

X, y = make_classification(n_samples=3000, n_features=10, n_informative=4, weights=[0.9],
                           flip_y=0.05, random_state=21)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, stratify=y, random_state=0)
model = LogisticRegression(max_iter=1000).fit(X_train, y_train)
assert list(model.classes_) == [0, 1]       # predict_proba 第 1 欄是盜刷（1）的機率

# 正解 A
fpr, tpr, th = roc_curve(y_test, model.predict_proba(X_test)[:, 1])
auc_a = auc(fpr, tpr)
assert abs(auc_a - roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])) < 1e-12
assert len(th) > 20 and auc_a > 0.8

# B 錯：硬標籤只有 0/1 兩種分數，曲線只剩 3 個點，AUC 被低估
fb, tb, thb = roc_curve(y_test, model.predict(X_test))
assert len(thb) == 3 and auc(fb, tb) < auc_a - 0.05

# C 錯：引數對調，把機率當成真實標籤 → ValueError
try:
    roc_curve(model.predict_proba(X_test)[:, 1], y_test)
    raise AssertionError("應拋出例外")
except ValueError as e:
    assert "continuous" in str(e)

# D 錯：第 0 欄是「正常交易」的機率，排序完全反過來，AUC = 1 − 正確值
fd, td, _ = roc_curve(y_test, model.predict_proba(X_test)[:, 0])
assert abs(auc(fd, td) - (1 - auc_a)) < 1e-9 and auc(fd, td) < 0.5

print("OK", "senior-bigdata-practice-q204")
