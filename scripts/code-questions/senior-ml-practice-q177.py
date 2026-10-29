import numpy as np

y_true  = np.array([4, 6, 3, 8, 5, 7, 2, 12])
model_a = np.array([4.5, 5.5, 3.5, 7.5, 5.5, 6.5, 2.5, 3.0])
model_b = np.array([6.0, 4.0, 5.0, 6.0, 7.0, 5.0, 4.0, 10.0])

def mae(y, p):
    return np.mean(np.abs(y - p))

def rmse(y, p):
    return np.sqrt(np.mean((y - p) ** 2))

lines = []
for name, p in [("model_a", model_a), ("model_b", model_b)]:
    lines.append(f"{name}: MAE={mae(y_true, p):.3f}  RMSE={rmse(y_true, p):.3f}")
out = "\n".join(lines); print(out)
assert out == "model_a: MAE=1.562  RMSE=3.216\nmodel_b: MAE=2.000  RMSE=2.000", out

ea, eb = np.abs(y_true - model_a), np.abs(y_true - model_b)
# 正解 C：model_a 的 RMSE 約為 MAE 的兩倍，誤差集中在一位病人（低估 9 天）
assert 1.9 < rmse(y_true, model_a) / mae(y_true, model_a) < 2.2
assert ea.max() == 9 and (ea == 0.5).sum() == 7
assert (y_true - model_a)[-1] == 9          # 是低估（預測比實際少）
assert eb.max() == 2                          # model_b 最大誤差只有 2 天
# A 錯：MAE 較低不代表每位病人都較準
assert mae(y_true, model_a) < mae(y_true, model_b)
assert (ea > eb).any()
# B 錯：RMSE 開過根號，單位與 MAE 相同（天）；把 y 換成小時（×24），兩者等比例放大 24 倍
assert np.isclose(rmse(24 * y_true, 24 * model_a), 24 * rmse(y_true, model_a))
assert np.isclose(mae(24 * y_true, 24 * model_a), 24 * mae(y_true, model_a))
# D 錯：MSE 排名與 MAE 相反
mse = lambda y, p: np.mean((y - p) ** 2)
assert mse(y_true, model_a) > mse(y_true, model_b)
print("OK", "senior-ml-practice-q177")
