import numpy as np

rng = np.random.default_rng(0)
R = rng.normal(0.0005, 0.01, size=(250, 4))   # 250 個交易日 × 4 檔資產的日報酬
w = np.array([0.4, 0.3, 0.2, 0.1])

port = R @ w
C = np.cov(R, rowvar=False)
risk = w @ C @ w
Z = (R - R.mean(axis=0)) / R.std(axis=0)
print(port.shape, C.shape, np.ndim(risk), Z.shape)
out = f"{port.shape} {C.shape} {np.ndim(risk)} {Z.shape}"
# 正解 B
assert out == "(250,) (4, 4) 0 (250, 4)", out
# 組合的變異數 = 投資組合報酬的樣本變異數
assert np.isclose(risk, np.var(port, ddof=1))
# A 錯：一維權重與矩陣相乘得一維向量，不是 (250, 1)
assert port.shape != (250, 1)
# C 錯：(250, 250) 是忘了 rowvar=False 時的結果（把每一列當成一個變數）
assert np.cov(R).shape == (250, 250) and C.shape == (4, 4)
# D 錯：w @ C @ w 是純量（ndim 0）；Z 沿 axis=0 標準化後形狀不變，不會轉置
assert np.ndim(risk) == 0 and Z.shape == R.shape
assert np.allclose(Z.mean(axis=0), 0) and np.allclose(Z.std(axis=0), 1)
# 判斷分界：省略 rowvar=False 時，w @ C 維度不合會拋 ValueError
try:
    w @ np.cov(R) @ w; raise SystemExit("應該失敗")
except ValueError:
    pass
print("OK", "senior-ml-practice-q181")
