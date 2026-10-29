import numpy as np, keras
from keras import layers
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 以合成資料代表題目中的 400 筆病歷（30 項特徵、標籤含雜訊）
X, y = make_classification(n_samples=400, n_features=30, n_informative=5, flip_y=0.15, random_state=7)
X_tr, X_va, y_tr, y_va = train_test_split(X, y, test_size=0.25, random_state=7, stratify=y)
sc = StandardScaler().fit(X_tr); X_tr = sc.transform(X_tr); X_va = sc.transform(X_va)

def build():
    keras.utils.set_random_seed(42)
    model = keras.Sequential([
        keras.Input(shape=(30,)),
        layers.Dense(256, activation="relu"),
        layers.Dense(256, activation="relu"),
        layers.Dense(1, activation="sigmoid"),
    ])
    model.compile(optimizer=keras.optimizers.Adam(1e-3), loss="binary_crossentropy", metrics=["accuracy"])
    return model

model = build()
hist = model.fit(X_tr, y_tr, validation_data=(X_va, y_va), epochs=40, batch_size=32, verbose=0)
H = hist.history
lines = []
for e in [1, 5, 10, 20, 30, 40]:
    lines.append(f"epoch {e:2d}  loss={H['loss'][e-1]:.3f}  acc={H['accuracy'][e-1]:.3f}  val_loss={H['val_loss'][e-1]:.3f}  val_acc={H['val_accuracy'][e-1]:.3f}")
out = "\n".join(lines); print(out)
EXPECTED = """epoch  1  loss=0.655  acc=0.623  val_loss=0.569  val_acc=0.740
epoch  5  loss=0.309  acc=0.890  val_loss=0.501  val_acc=0.790
epoch 10  loss=0.129  acc=0.983  val_loss=0.579  val_acc=0.750
epoch 20  loss=0.015  acc=1.000  val_loss=0.826  val_acc=0.750
epoch 30  loss=0.004  acc=1.000  val_loss=0.991  val_acc=0.760
epoch 40  loss=0.002  acc=1.000  val_loss=1.106  val_acc=0.760"""
assert out == EXPECTED, out

# 正解 B：驗證損失在第 5 輪最低後回升，訓練損失持續下降 → 過擬合
assert int(np.argmin(H["val_loss"])) + 1 == 5
assert H["val_loss"][-1] > 2 * min(H["val_loss"])
assert H["loss"][-1] < H["loss"][4] / 50
# 加 EarlyStopping（監看 val_loss、還原最佳權重）後，最終模型的驗證損失回到最低點附近
model2 = build()
es = keras.callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)
h2 = model2.fit(X_tr, y_tr, validation_data=(X_va, y_va), epochs=40, batch_size=32, callbacks=[es], verbose=0)
ev = model2.evaluate(X_va, y_va, verbose=0)[0]
assert len(h2.history["loss"]) < 40
assert abs(ev - min(H["val_loss"])) < 1e-3 and ev < H["val_loss"][-1] - 0.5, ev

# A 錯：訓練損失由 0.655 降到 0.002，學習速度不是問題；學習率調高也救不回驗證損失
assert H["loss"][-1] < 0.01
keras.utils.set_random_seed(42)
m3 = keras.Sequential([keras.Input(shape=(30,)), layers.Dense(256, activation="relu"), layers.Dense(256, activation="relu"), layers.Dense(1, activation="sigmoid")])
m3.compile(optimizer=keras.optimizers.Adam(1e-2), loss="binary_crossentropy", metrics=["accuracy"])
h3 = m3.fit(X_tr, y_tr, validation_data=(X_va, y_va), epochs=40, batch_size=32, verbose=0)
assert h3.history["val_loss"][-1] > min(H["val_loss"]) + 0.3, h3.history["val_loss"][-1]

# C 錯：再多訓練，驗證損失只會繼續上升（第 10→20→30→40 輪單調上升）
v = [H["val_loss"][e-1] for e in (10, 20, 30, 40)]
assert all(a < b for a, b in zip(v, v[1:]))

# D 錯：訓練準確率 1.000、訓練損失近 0，不是欠擬合；加寬網路容量只會讓過擬合更嚴重
assert H["accuracy"][-1] == 1.0
keras.utils.set_random_seed(42)
m4 = keras.Sequential([keras.Input(shape=(30,)), layers.Dense(512, activation="relu"), layers.Dense(512, activation="relu"), layers.Dense(1, activation="sigmoid")])
m4.compile(optimizer=keras.optimizers.Adam(1e-3), loss="binary_crossentropy", metrics=["accuracy"])
h4 = m4.fit(X_tr, y_tr, validation_data=(X_va, y_va), epochs=40, batch_size=32, verbose=0)
assert h4.history["val_loss"][-1] > min(H["val_loss"]) + 0.3
print("OK", "senior-ml-practice-q172")
