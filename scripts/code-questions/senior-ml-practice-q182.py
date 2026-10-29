import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(100, 5))   # 100 位病患、5 項檢驗值（已標準化）
w = np.array([0.2, 0.1, 0.3, 0.25, 0.15])
a, b = X[0], X[1]

r1 = X * w
r2 = X @ w
r3 = np.dot(a, b)
G = X.T @ X
n2 = np.linalg.norm(a)

truth = {}
# ① r1 為 (100, 5)，每一欄乘上對應權重
truth[1] = r1.shape == (100, 5) and np.allclose(r1[:, 2], X[:, 2] * 0.3)
# ② r2 為 (100,)，每個元素是一位病患的加權總和
truth[2] = r2.shape == (100,) and np.isclose(r2[7], sum(X[7, j] * w[j] for j in range(5)))
# ③ r3 是純量，等於 np.sum(a * b)
truth[3] = np.ndim(r3) == 0 and np.isclose(r3, np.sum(a * b))
# ④ G 為 (100, 100)？實際是 (5, 5)；(100, 100) 要寫 X @ X.T
truth[4] = G.shape == (100, 100)
assert G.shape == (5, 5) and (X @ X.T).shape == (100, 100)
# ⑤ norm 預設 L1？實際預設 L2
truth[5] = np.isclose(n2, np.abs(a).sum())
assert np.isclose(n2, np.sqrt(np.sum(a ** 2))) and not np.isclose(n2, np.abs(a).sum())

assert truth == {1: True, 2: True, 3: True, 4: False, 5: False}, truth
opts = {"A": {1, 2, 4}, "B": {2, 3, 5}, "C": {1, 4, 5}, "D": {1, 2, 3}}
correct = {k for k, v in truth.items() if v}
assert [k for k, s in opts.items() if s == correct] == ["D"]
print("OK", "senior-ml-practice-q182")
