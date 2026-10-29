# 驗證：虛擬碼的 score = H(S) − 加權子集熵 ＝ ID3 資訊增益；與吉尼、增益比、變異縮減不同
import numpy as np
from collections import Counter
from sklearn.tree import DecisionTreeClassifier

attrs = ["出席率", "作業繳交", "是否住宿"]
rows = [("中","準時","是","未通過"),("高","準時","否","通過"),("高","遲交","否","通過"),
        ("中","準時","否","未通過"),("低","準時","是","未通過"),("高","準時","否","通過"),
        ("低","準時","否","通過"),("低","準時","是","未通過"),("中","準時","否","未通過"),
        ("高","準時","是","通過"),("中","遲交","否","通過"),("中","遲交","是","通過"),
        ("低","準時","是","通過"),("中","準時","否","未通過")]
labels = [r[-1] for r in rows]

def H(T):
    n = len(T)
    return -sum(c / n * np.log2(c / n) for c in Counter(T).values())

def gini(T):
    n = len(T)
    return 1 - sum((c / n) ** 2 for c in Counter(T).values())

def split_score(f):
    base = f(labels); out = {}
    for i, a in enumerate(attrs):
        after = 0.0
        for v in set(r[i] for r in rows):
            sub = [r[-1] for r in rows if r[i] == v]
            after += len(sub) / len(rows) * f(sub)
        out[a] = base - after
    return out

# 虛擬碼本身
score = split_score(H)
chosen = max(score, key=score.get)

# 正解 C：H 與 scikit-learn criterion="entropy" 的根節點不純度一致（以 2 為底的熵）
y = np.array([1 if l == "通過" else 0 for l in labels])
Xd = np.array([[["高","中","低"].index(r[0]), r[1] == "準時", r[2] == "是"] for r in rows], dtype=float)
t_ent = DecisionTreeClassifier(criterion="entropy", random_state=0).fit(Xd, y)
assert abs(t_ent.tree_.impurity[0] - H(labels)) < 1e-12
# 手算一個屬性的資訊增益：作業繳交 準時 11 筆（5 通過 6 未通過），遲交 3 筆全通過
manual = H(labels) - (11 / 14) * H(["通過"] * 5 + ["未通過"] * 6) - (3 / 14) * 0
assert abs(score["作業繳交"] - manual) < 1e-12
assert chosen == "出席率"

# A 錯：吉尼不純度是 1 − Σp²，與虛擬碼的 −Σ p log2 p 數值不同
t_gini = DecisionTreeClassifier(criterion="gini", random_state=0).fit(Xd, y)
assert abs(t_gini.tree_.impurity[0] - gini(labels)) < 1e-12
assert abs(gini(labels) - H(labels)) > 0.1
g2 = split_score(gini)
assert all(abs(g2[a] - score[a]) > 1e-3 for a in attrs if score[a] > 0.05)

# B 錯：增益比要再除以分裂資訊，本資料會改選「作業繳交」，與虛擬碼結果不同
ratio = {a: score[a] / H([r[i] for r in rows]) for i, a in enumerate(attrs)}
assert max(ratio, key=ratio.get) == "作業繳交" != chosen

# D 錯：變異縮減用於連續目標；虛擬碼對類別標籤算比例與 log2，與 0/1 編碼的變異數縮減數值不同
var_red = {}
for i, a in enumerate(attrs):
    after = sum((sum(1 for r in rows if r[i] == v) / 14) *
                np.var([1 if r[-1] == "通過" else 0 for r in rows if r[i] == v])
                for v in set(r[i] for r in rows))
    var_red[a] = np.var(y) - after
assert all(abs(var_red[a] - score[a]) > 1e-3 for a in attrs if score[a] > 0.05)

print("OK", "senior-bigdata-practice-q202")
