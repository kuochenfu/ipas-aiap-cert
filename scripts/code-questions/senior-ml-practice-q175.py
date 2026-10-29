import numpy as np, keras
from keras import layers
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 以合成資料代表 300 塊田區、12 項土壤與氣象特徵，目標為標準化後的產量
X, y = make_regression(n_samples=300, n_features=12, n_informative=6, noise=25.0, random_state=3)
y = (y - y.mean()) / y.std()
X_tr, X_va, y_tr, y_va = train_test_split(X, y, test_size=0.25, random_state=3)
sc = StandardScaler().fit(X_tr); X_tr = sc.transform(X_tr); X_va = sc.transform(X_va)

def train(restore):
    keras.utils.set_random_seed(1)
    model = keras.Sequential([
        keras.Input(shape=(12,)),
        layers.Dense(128, activation="relu"),
        layers.Dense(128, activation="relu"),
        layers.Dense(1),
    ])
    model.compile(optimizer="adam", loss="mse")
    es = keras.callbacks.EarlyStopping(patience=3, restore_best_weights=restore)
    hist = model.fit(X_tr, y_tr, validation_data=(X_va, y_va), epochs=100, batch_size=16, callbacks=[es], verbose=0)
    return model, hist, es

model, hist, es = train(True)
vl = hist.history["val_loss"]
ev = model.evaluate(X_va, y_va, verbose=0)
lines = [
    f"epochs run: {len(vl)}",
    f"last val_loss: {round(vl[-1], 4)}",
    f"best epoch: {int(np.argmin(vl)) + 1}  val_loss: {round(min(vl), 4)}",
    f"evaluate: {round(ev, 4)}",
]
out = "\n".join(lines); print(out)
EXPECTED = """epochs run: 9
last val_loss: 0.0667
best epoch: 6  val_loss: 0.0661
evaluate: 0.0661"""
assert out == EXPECTED, out

# 正解 A：最佳輪後連續 3 輪（7、8、9）未改善就停止；目前權重是第 6 輪的權重
best = int(np.argmin(vl)) + 1
assert len(vl) - best == 3 == es.patience
assert all(v > min(vl) for v in vl[best:])
assert abs(ev - min(vl)) < 1e-5

# B 錯：目前權重不是最後一輪的權重；不還原時，evaluate 才會等於最後一輪 val_loss
assert abs(ev - vl[-1]) > 1e-4
m2, h2, _ = train(False)
ev2 = m2.evaluate(X_va, y_va, verbose=0)
assert abs(ev2 - h2.history["val_loss"][-1]) < 1e-5

# C 錯：未指定 monitor 時，預設監看的是 val_loss，不是訓練集的 loss
assert keras.callbacks.EarlyStopping().monitor == "val_loss"
assert es.monitor == "val_loss"

# D 錯：evaluate 比最後一輪低，是因為權重被還原到最佳輪，驗證集從未參與梯度更新
# 證明：驗證集換成全新資料，訓練過程（訓練損失）完全不受影響
assert ev < vl[-1]
keras.utils.set_random_seed(1)
m3 = keras.Sequential([keras.Input(shape=(12,)), layers.Dense(128, activation="relu"), layers.Dense(128, activation="relu"), layers.Dense(1)])
m3.compile(optimizer="adam", loss="mse")
rng = np.random.default_rng(0)
h3 = m3.fit(X_tr, y_tr, validation_data=(rng.normal(size=X_va.shape), rng.normal(size=y_va.shape)), epochs=3, batch_size=16, verbose=0)
assert np.allclose(h3.history["loss"], hist.history["loss"][:3], atol=1e-6)
print("OK", "senior-ml-practice-q175")
