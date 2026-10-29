import numpy as np
import pandas as pd

CODE = '''import numpy as np
import pandas as pd

rng = np.random.default_rng(7)
idx = pd.date_range("2024-05-01 08:00", periods=12, freq="min")
df = pd.DataFrame({"temp": rng.normal(70, 2, 12).round(1)}, index=idx)
df.iloc[[3, 4, 8], 0] = np.nan   # 通訊中斷造成的缺值

df["temp"] = df["temp"].bfill()
df["temp_ma"] = df["temp"].rolling(5, center=True).mean()
# 以 t 時刻的 temp 與 temp_ma 預測 t+10 分鐘是否過熱'''

ns = {}
exec(CODE, ns)
idx = ns["idx"]
rng = np.random.default_rng(7)
raw = pd.DataFrame({"temp": rng.normal(70, 2, 12).round(1)}, index=idx)
raw.iloc[[3, 4, 8], 0] = np.nan

def original(d):
    d = d.copy(); d["temp"] = d["temp"].bfill()
    d["temp_ma"] = d["temp"].rolling(5, center=True).mean(); return d
def fix_A(d):
    d = d.copy(); d["temp"] = d["temp"].ffill()
    d["temp_ma"] = d["temp"].rolling(5).mean(); return d
def fix_B(d):
    d = d.copy(); d["temp"] = d["temp"].interpolate()
    d["temp_ma"] = d["temp"].rolling(5, center=True).mean(); return d
def fix_C(d):
    d = d.copy(); d["temp"] = d["temp"].bfill()
    d["temp_ma"] = d["temp"].expanding().mean(); return d
def fix_D(d):
    d = d.dropna().copy()
    d["temp_ma"] = d["temp"].rolling(5, center=True).mean(); return d

pd.testing.assert_frame_equal(original(raw), ns["df"])

def leaks(f):
    """若改動 t 之後的讀數會讓 t 時刻的特徵改變，代表特徵用到了未來資料"""
    base = f(raw)
    for t in range(len(raw) - 1):
        moved = raw.copy()
        moved.iloc[t + 1:, 0] = moved.iloc[t + 1:, 0] + 50
        new = f(moved)
        if idx[t] in base.index:
            a, b = base.loc[idx[t]], new.loc[idx[t]]
            if not np.allclose(a.fillna(-1), b.fillna(-1)):
                return True
    return False

assert leaks(original)
assert not leaks(fix_A)            # 正解：只用 t 以前的資訊
assert leaks(fix_B)                # interpolate 用到下一筆有效讀數，center=True 用到未來 2 分鐘
assert leaks(fix_C)                # bfill 仍把未來讀數往前搬
assert leaks(fix_D)                # center=True 仍看未來
# 細節：bfill 讓 08:03 的值等於 08:05 的讀數；interpolate 也用到 08:05
assert ns["df"].loc[idx[3], "temp"] == raw.iloc[5, 0]
# fix_B 洩漏只靠 interpolate 也成立（即使拿掉 center）
def interp_only(d):
    d = d.copy(); d["temp"] = d["temp"].interpolate(); d["temp_ma"] = d["temp"].rolling(5).mean(); return d
assert leaks(interp_only)
# fix_C 只靠 bfill 也洩漏
def bfill_only(d):
    d = d.copy(); d["temp"] = d["temp"].bfill(); d["temp_ma"] = d["temp"].rolling(5).mean(); return d
assert leaks(bfill_only)
# fix_D 會丟掉 3 列，上線時遇到缺值的分鐘也無法產生預測
assert len(fix_D(raw)) == 9
print("OK", "senior-bigdata-practice-q169")
