import numpy as np, keras
from keras import layers

rng = np.random.default_rng(0)
X = rng.normal(size=(200, 12)).astype("float32")   # 12 項感測特徵
y = rng.integers(0, 5, size=200)                     # 5 種故障類別，整數標籤 0～4
assert y.shape == (200,) and y.dtype.kind == "i"

def run(units, act, loss):
    keras.utils.set_random_seed(0)
    model = keras.Sequential([keras.Input(shape=(12,)), layers.Dense(32, activation="relu"), layers.Dense(units, activation=act)])
    model.compile(optimizer="adam", loss=loss, metrics=["accuracy"])
    model.fit(X, y, epochs=1, batch_size=32, verbose=0)
    return model

# D 正解：softmax + sparse_categorical_crossentropy，損失等於手算的平均負對數機率
m = run(5, "softmax", "sparse_categorical_crossentropy")
p = m.predict(X, verbose=0)
assert p.shape == (200, 5) and np.allclose(p.sum(1), 1, atol=1e-5)
manual = -np.mean(np.log(p[np.arange(200), y]))
loss_d = m.evaluate(X, y, verbose=0)[0]
assert abs(loss_d - manual) < 1e-4, (loss_d, manual)

# A 錯：categorical_crossentropy 要 one-hot 標籤，整數標籤直接拋 ValueError
try:
    run(5, "softmax", "categorical_crossentropy"); raise SystemExit("A 應該失敗")
except ValueError:
    pass

# B 錯：輸出已是 softmax 機率又宣告 from_logits=True，等於做兩次 softmax，損失與真實負對數機率不同
m_b = run(5, "softmax", keras.losses.SparseCategoricalCrossentropy(from_logits=True))
p_b = m_b.predict(X, verbose=0)
true_nll = -np.mean(np.log(p_b[np.arange(200), y]))
loss_b = m_b.evaluate(X, y, verbose=0)[0]
assert abs(loss_b - true_nll) > 0.05, (loss_b, true_nll)
# 雙重 softmax 讓損失被壓在接近 log(5) 的狹窄區間，梯度很小
assert abs(loss_b - np.log(5)) < 0.1

# C 錯：Dense(1, sigmoid) 能跑，但只輸出一個 0～1 的值，無法表示 5 個類別
m_c = run(1, "sigmoid", "binary_crossentropy")
p_c = m_c.predict(X, verbose=0)
assert p_c.shape == (200, 1)
pred_c = (p_c[:, 0] > 0.5).astype(int)
assert set(np.unique(pred_c)) <= {0, 1}   # 永遠預測不出類別 2、3、4
assert (y >= 2).sum() > 0
# 判斷分界：one-hot 標籤配 categorical_crossentropy、logits 輸出配 from_logits=True 都與 D 的損失一致
keras.utils.set_random_seed(0)
mo = keras.Sequential([keras.Input(shape=(12,)), layers.Dense(32, activation="relu"), layers.Dense(5, activation="softmax")])
mo.compile(optimizer="adam", loss="categorical_crossentropy")
mo.set_weights(m.get_weights())
assert abs(mo.evaluate(X, keras.utils.to_categorical(y, 5), verbose=0) - loss_d) < 1e-4
ml = keras.Sequential([keras.Input(shape=(12,)), layers.Dense(32, activation="relu"), layers.Dense(5)])
ml.compile(optimizer="adam", loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True))
ml.set_weights(m.get_weights())
assert abs(ml.evaluate(X, y, verbose=0) - loss_d) < 1e-4
print("OK", "senior-ml-practice-q173")
