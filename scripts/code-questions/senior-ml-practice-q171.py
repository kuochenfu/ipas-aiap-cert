import numpy as np, keras
from keras import layers

model = keras.Sequential([
    keras.Input(shape=(20,)),
    layers.Dense(64, activation="relu"),
    layers.BatchNormalization(),
    layers.Dense(1, activation="sigmoid"),
])
model.summary()
total = model.count_params()
trainable = int(sum(np.prod(w.shape) for w in model.trainable_weights))
non_tr = int(sum(np.prod(w.shape) for w in model.non_trainable_weights))
# 正解 B：總參數 1,665，可訓練 1,537
assert (total, trainable) == (1665, 1537), (total, trainable)
assert non_tr == 128  # BN 的 moving_mean、moving_variance 各 64
# 各層拆解
assert model.layers[0].count_params() == 20 * 64 + 64 == 1344
assert model.layers[1].count_params() == 4 * 64 == 256
assert model.layers[2].count_params() == 64 + 1 == 65
# 錯誤選項
assert (total, trainable) != (1665, 1665)   # A：把 BN 四組參數都當可訓練
assert (total, trainable) != (1409, 1409)   # C：把 BN 當成沒有參數的層
assert 1344 + 65 == 1409
assert (total, trainable) != (1600, 1472)   # D：漏算 Dense 的偏差
assert 20 * 64 + 256 + 64 == 1600 and 20 * 64 + 128 + 64 == 1472
# 判斷分界：BN 換成 Dropout → 1,409 全可訓練；BN 設 trainable=False → 可訓練 1,409
m2 = keras.Sequential([keras.Input(shape=(20,)), layers.Dense(64, activation="relu"), layers.Dropout(0.3), layers.Dense(1, activation="sigmoid")])
assert m2.count_params() == 1409 and sum(np.prod(w.shape) for w in m2.trainable_weights) == 1409
model.layers[1].trainable = False
assert sum(np.prod(w.shape) for w in model.trainable_weights) == 1409
print("OK", "senior-ml-practice-q171")
