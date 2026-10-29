import numpy as np
from sklearn.metrics import log_loss, brier_score_loss, hinge_loss, mean_squared_log_error

def score(y, p, eps=1e-15):
    p = np.clip(p, eps, 1 - eps)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

rng = np.random.default_rng(0)
y = rng.integers(0, 2, 500)
p = rng.uniform(0.01, 0.99, 500)
s = score(y, p)
# 正解 A：等於二元交叉熵（log loss）
assert abs(s - log_loss(y, p)) < 1e-12
# 偏離真實標籤越遠懲罰越重：對正類預測 0.01 的懲罰遠大於預測 0.4
assert score(np.array([1]), np.array([0.01])) > 5 * score(np.array([1]), np.array([0.4]))
# 錯誤選項：與 Brier 分數、預測分布的熵、MSLE 都不同
assert abs(s - brier_score_loss(y, p)) > 0.1
assert abs(s - np.mean((p - y) ** 2)) > 0.1
ent = -np.mean(p * np.log(p) + (1 - p) * np.log(1 - p))
assert abs(s - ent) > 0.1
assert abs(s - mean_squared_log_error(y, p)) > 0.1
# 熵與 y 無關；此函式則會隨 y 改變
y2 = y.copy(); y2[:50] = 1 - y2[:50]
assert abs(score(y2, p) - s) > 1e-3
# eps 截斷避免 log(0)：p=0 或 1 時仍為有限值
assert np.isfinite(score(np.array([1, 0]), np.array([0.0, 1.0])))
print("OK", "senior-ml-practice-q176")
