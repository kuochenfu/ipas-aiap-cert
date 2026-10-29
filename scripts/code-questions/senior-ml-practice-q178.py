import numpy as np, keras
from keras import layers

# 以合成資料代表依生產時間排序的 1,000 筆感測紀錄，瑕疵品（y=1）約 5%
rng = np.random.default_rng(0)
X = rng.normal(size=(1000, 8)).astype("float32")
y = (rng.random(1000) < 0.05).astype("int32")
X[y == 1] += 0.8

def build():
    keras.utils.set_random_seed(0)
    model = keras.Sequential([
        keras.Input(shape=(8,)),
        layers.Dense(16, activation="relu"),
        layers.Dense(1, activation="sigmoid"),
    ])
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
    return model

# 題目程式碼可以執行
m = build()
es = keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)
hist = m.fit(X, y, validation_split=0.2, epochs=50, batch_size=32, shuffle=True,
             class_weight={0: 1, 1: 19}, callbacks=[es], verbose=0)

# ① 對、② 錯：validation_split 在洗牌之前取最後 20%（最新的 200 筆）
m1 = build()
h1 = m1.fit(X, y, validation_split=0.2, epochs=1, batch_size=32, shuffle=True, verbose=0)
v_last = m1.evaluate(X[-200:], y[-200:], verbose=0)[0]
v_first = m1.evaluate(X[:200], y[:200], verbose=0)[0]
assert abs(h1.history["val_loss"][0] - v_last) < 1e-5
assert abs(h1.history["val_loss"][0] - v_first) > 1e-3

# ③ 對：全部判為良品，訓練部分（前 800 筆）的準確率約 0.95
acc_all_zero = (y[:800] == 0).mean()
assert 0.93 < acc_all_zero < 0.96, acc_all_zero

# ④ 對：class_weight 等同把瑕疵品樣本的權重設為 19（與 sample_weight 結果完全相同）
sw = np.where(y[:800] == 1, 19.0, 1.0)
m0 = build()
p0 = np.clip(m0.predict(X[:800], verbose=0)[:, 0], 1e-7, 1 - 1e-7)   # 初始權重下的預測
bce = -(y[:800] * np.log(p0) + (1 - y[:800]) * np.log(1 - p0))
ma = build(); la = ma.fit(X[:800], y[:800], epochs=1, batch_size=800, shuffle=False, class_weight={0: 1, 1: 19}, verbose=0).history["loss"][0]
mb = build(); lb = mb.fit(X[:800], y[:800], epochs=1, batch_size=800, shuffle=False, sample_weight=sw, verbose=0).history["loss"][0]
mc = build(); lc = mc.fit(X[:800], y[:800], epochs=1, batch_size=800, shuffle=False, verbose=0).history["loss"][0]
assert abs(la - lb) < 1e-5                      # class_weight 與 sample_weight=19 等價
assert abs(la - np.mean(sw * bce)) < 1e-4       # 瑕疵品樣本的損失乘上 19
assert abs(lc - np.mean(bce)) < 1e-4 and la > lc + 0.1

# ⑤ 錯：EarlyStopping 預設監看 val_loss
assert keras.callbacks.EarlyStopping().monitor == "val_loss" and es.monitor == "val_loss"

# 組合：正解 D = ①③④
truth = {1: True, 2: False, 3: True, 4: True, 5: False}
opts = {"A": {1, 2, 5}, "B": {2, 3, 4}, "C": {1, 3, 5}, "D": {1, 3, 4}}
correct = {k for k, v in truth.items() if v}
assert [k for k, s in opts.items() if s == correct] == ["D"]
print("OK", "senior-ml-practice-q178")
