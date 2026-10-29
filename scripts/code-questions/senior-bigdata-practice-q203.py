# 驗證：分類報告輸出為真；準確率只略高於「全判健康」；病株召回率低；非過擬合；類別權重能拉高召回率
import io, contextlib, warnings
warnings.filterwarnings("ignore")
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, recall_score, precision_score

X, y = make_classification(n_samples=3000, n_features=8, n_informative=3, weights=[0.94],
                           flip_y=0.02, class_sep=1.2, random_state=11)

EXPECTED = """              precision    recall  f1-score   support

           0       0.94      1.00      0.97       837
           1       0.90      0.14      0.25        63

    accuracy                           0.94       900
   macro avg       0.92      0.57      0.61       900
weighted avg       0.94      0.94      0.92       900

"""
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, stratify=y, random_state=0)
    model = LogisticRegression(max_iter=1000).fit(X_train, y_train)
    print(classification_report(y_test, model.predict(X_test)))
assert buf.getvalue() == EXPECTED, repr(buf.getvalue())

pred = model.predict(X_test)
# 病株約占 7%
assert abs(y.mean() - 0.07) < 0.005

# 正解 D：病株召回率只有 0.14；加入類別權重後召回率大幅上升
rec = recall_score(y_test, pred)
assert round(rec, 2) == 0.14
m2 = LogisticRegression(max_iter=1000, class_weight="balanced").fit(X_train, y_train)
rec2 = recall_score(y_test, m2.predict(X_test))
assert rec2 > 0.55 and rec2 - rec > 0.4

# A 錯：全判為健康就有 0.93 準確率，0.94 幾乎沒有比基準好
baseline = (y_test == 0).mean()
assert abs(baseline - 0.93) < 0.001
assert model.score(X_test, y_test) - baseline < 0.01

# B 錯：precision 0.90 是「判為病株者中真病株的比例」；真病株被找到的比例是 recall 0.14
assert round(precision_score(y_test, pred), 2) == 0.90
assert sum((pred == 1) & (y_test == 1)) / sum(y_test == 1) == rec

# C 錯：訓練與測試準確率幾乎相同，沒有過擬合；macro < weighted 來自類別不平衡
tr, te = model.score(X_train, y_train), model.score(X_test, y_test)
assert abs(tr - te) < 0.01

print("OK", "senior-bigdata-practice-q203")
