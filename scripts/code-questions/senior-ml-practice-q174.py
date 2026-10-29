import numpy as np, keras
from keras import layers

model = keras.Sequential([
    keras.Input(shape=(30, 8)),
    layers.Dense(16, activation="relu"),
    layers.Dense(1),
])
out = model.predict(np.zeros((4, 30, 8)), verbose=0)
print(out.shape, model.count_params())
# 正解 A：(4, 30, 1)；161
assert out.shape == (4, 30, 1)
assert model.count_params() == 161 == (8 * 16 + 16) + (16 + 1)
# B 錯：Dense 不會自動攤平，形狀不是 (4, 1)
assert out.shape != (4, 1)
# C 錯：參數量 3,873 是先 Flatten 成 240 維才會有的數字
flat = keras.Sequential([keras.Input(shape=(30, 8)), layers.Flatten(), layers.Dense(16, activation="relu"), layers.Dense(1)])
assert flat.count_params() == 3873 and flat.predict(np.zeros((4, 30, 8)), verbose=0).shape == (4, 1)
assert model.count_params() != 3873
# D 錯：最後一層只有 1 個單元，最後一維是 1 不是 16
assert out.shape != (4, 30, 16) and out.shape[-1] == 1
print("OK", "senior-ml-practice-q174")
