# 驗證：字串標籤下求 NG 類召回率需 pos_label="NG" 且 y_true 在前
from sklearn.metrics import recall_score, precision_score

y_true = ["OK","OK","NG","OK","NG","NG","OK","OK","NG","OK","OK","NG"]
y_pred = ["OK","NG","NG","OK","OK","NG","OK","OK","NG","OK","OK","OK"]

# 需求：真正的不良品中被抓出的比例 = TP / (TP + FN)
tp = sum(t == "NG" and p == "NG" for t, p in zip(y_true, y_pred))
fn = sum(t == "NG" and p == "OK" for t, p in zip(y_true, y_pred))
fp = sum(t == "OK" and p == "NG" for t, p in zip(y_true, y_pred))
assert (tp, fn, fp) == (3, 2, 1)
target = tp / (tp + fn)

# 正解 C
assert recall_score(y_true, y_pred, pos_label="NG") == target == 0.6

# A 錯：引數對調 → 算成精確率 0.75
a = recall_score(y_pred, y_true, pos_label="NG")
assert a == 0.75 == precision_score(y_true, y_pred, pos_label="NG") and a != target

# B 錯：預設 pos_label=1，字串標籤會拋 ValueError
try:
    recall_score(y_true, y_pred)
    raise AssertionError("應拋出例外")
except ValueError as e:
    assert "pos_label=1 is not a valid label" in str(e)

# D 錯：macro 平均混入 OK 類召回率
d = recall_score(y_true, y_pred, average="macro")
assert abs(d - (0.6 + 6 / 7) / 2) < 1e-12 and abs(d - 0.729) < 0.001 and d != target

print("OK", "senior-bigdata-practice-q201")
