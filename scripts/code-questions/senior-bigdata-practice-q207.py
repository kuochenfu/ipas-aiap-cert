# 驗證：混淆矩陣列＝真實、欄＝預測；各類召回率與精確率
import io, contextlib
import numpy as np, pandas as pd
from sklearn.metrics import confusion_matrix, recall_score, precision_score, accuracy_score

# 以等價的 DataFrame 取代 pred.csv
target = {("低","低"):18, ("低","中"):2, ("中","低"):3, ("中","中"):14, ("中","高"):9,
          ("高","中"):2, ("高","高"):22}
rows = [(a, p) for (a, p), n in target.items() for _ in range(n)]
df = pd.DataFrame(rows, columns=["actual", "pred"]).sample(frac=1, random_state=0).reset_index(drop=True)

buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    cm = confusion_matrix(df["actual"], df["pred"], labels=["低", "中", "高"])
    print(cm)
assert buf.getvalue() == "[[18  2  0]\n [ 3 14  9]\n [ 0  2 22]]\n", repr(buf.getvalue())

L = ["低", "中", "高"]
rec = dict(zip(L, recall_score(df["actual"], df["pred"], labels=L, average=None)))
prec = dict(zip(L, precision_score(df["actual"], df["pred"], labels=L, average=None)))
acc = accuracy_score(df["actual"], df["pred"])

# 正解 A：真實「中」被判成「高」的有 9 位；「中」的召回率最低
assert ((df["actual"] == "中") & (df["pred"] == "高")).sum() == 9
assert min(rec, key=rec.get) == "中" and abs(rec["中"] - 14 / 26) < 1e-12

# B 錯：把列欄看反。被判為「中」的 18 位中，真實為「高」的只有 2 位；且精確率最低的是「高」
assert ((df["pred"] == "中") & (df["actual"] == "高")).sum() == 2
assert min(prec, key=prec.get) == "高"

# C 錯：被判為「高」的人數最多（31 位），但「高」的精確率反而最低（22/31）
assert (df["pred"] == "高").sum() == 31 == max((df["pred"] == l).sum() for l in L)
assert max(prec, key=prec.get) == "低"

# D 錯：準確率 0.77，但「中」的召回率只有 0.54
assert abs(acc - 54 / 70) < 1e-12 and round(acc, 2) == 0.77
assert rec["中"] < acc

print("OK", "senior-bigdata-practice-q207")
