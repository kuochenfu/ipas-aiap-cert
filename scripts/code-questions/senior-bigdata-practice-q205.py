# 驗證：在測試集上挑門檻再用同一測試集回報 F1 會系統性高估；在訓練集內以 CV 挑門檻則幾乎無偏
import io, contextlib, warnings
warnings.filterwarnings("ignore")
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, accuracy_score

X_all, y_all = make_classification(n_samples=4000, n_features=12, n_informative=4,
                                   weights=[0.85], flip_y=0.08, random_state=3)
# 前 2,000 筆＝題目中的現有病歷 X、y；另 2,000 筆模擬「上線後」的新病患，用來量真實表現
X, X_fut, y, y_fut = train_test_split(X_all, y_all, test_size=0.5, stratify=y_all, random_state=1)
assert len(y) == 2000 and abs(y.mean() - 0.18) < 0.01

ths = np.arange(0.05, 0.95, 0.01)

# ── 題目程式碼 ──
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.1, stratify=y, random_state=0)
    model = LogisticRegression(max_iter=1000).fit(X_train, y_train)
    proba = model.predict_proba(X_test)[:, 1]
    best_t, best_f1 = 0.5, 0
    for t in np.arange(0.05, 0.95, 0.01):
        f1 = f1_score(y_test, proba >= t)
        if f1 > best_f1:
            best_t, best_f1 = t, f1
    print(f"門檻 {best_t:.2f}，測試集 F1 = {best_f1:.3f}")
assert buf.getvalue() == "門檻 0.33，測試集 F1 = 0.711\n", buf.getvalue()

def pick(y_true, scores, metric):
    vals = [metric(y_true, scores >= t) for t in ths]
    return ths[int(np.argmax(vals))], max(vals)

def fut_score(m, t, metric=f1_score):
    return metric(y_fut, m.predict_proba(X_fut)[:, 1] >= t)

# 本例：上線後的 F1 明顯低於報告值
assert round(fut_score(model, best_t), 2) == 0.63   # 報告 0.711，上線約 0.63

gap_bad, gap_B, gap_A, gap_C, gap_D = [], [], [], [], []
rng = np.random.default_rng(0)
for seed in range(150):
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.1, stratify=y, random_state=seed)
    m = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
    pt = m.predict_proba(Xte)[:, 1]
    # 題目流程：在測試集挑門檻、在測試集回報
    t, rep = pick(yte, pt, f1_score)
    gap_bad.append(rep - fut_score(m, t))
    # D：同一測試集 bootstrap，平均值仍落在被高估的 rep 附近
    boots = []
    for _ in range(100):
        idx = rng.integers(0, len(yte), len(yte))
        boots.append(f1_score(yte[idx], pt[idx] >= t))
    gap_D.append(np.mean(boots) - fut_score(m, t))
    # C：改挑準確率最高的門檻，仍是在測試集上挑，回報的準確率同樣偏高
    tc, repc = pick(yte, pt, accuracy_score)
    gap_C.append(repc - fut_score(m, tc, accuracy_score))
    # 正解 B：在訓練集內以 5 折 CV 挑門檻，測試集只評估一次
    pcv = cross_val_predict(LogisticRegression(max_iter=1000), Xtr, ytr, cv=5, method="predict_proba")[:, 1]
    tb, _ = pick(ytr, pcv, f1_score)
    gap_B.append(f1_score(yte, pt >= tb) - fut_score(m, tb))
    # A：測試集加大到 40%，但仍在測試集上挑門檻
    Xtr4, Xte4, ytr4, yte4 = train_test_split(X, y, test_size=0.4, stratify=y, random_state=seed)
    m4 = LogisticRegression(max_iter=1000).fit(Xtr4, ytr4)
    t4, rep4 = pick(yte4, m4.predict_proba(Xte4)[:, 1], f1_score)
    gap_A.append(rep4 - fut_score(m4, t4))

g = {k: float(np.mean(v)) for k, v in dict(bad=gap_bad, A=gap_A, B=gap_B, C=gap_C, D=gap_D).items()}
print({k: round(v, 4) for k, v in g.items()})
assert g["bad"] > 0.035                      # 題目流程平均高估約 0.04
assert abs(g["B"]) < 0.012 and g["bad"] - g["B"] > 0.025   # B 幾乎無偏
assert g["A"] > 0.015 and g["A"] - g["B"] > 0.008        # A：偏差變小但仍在（並少了訓練資料）
assert g["C"] > 0.01                          # C：換指標仍是在測試集上挑，依舊高估
assert g["D"] > 0.03                          # D：bootstrap 只量變異，不修正偏差

print("OK", "senior-bigdata-practice-q205")
