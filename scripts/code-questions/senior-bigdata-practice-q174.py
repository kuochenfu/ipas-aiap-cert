import numpy as np
import pandas as pd

CODE = '''import pandas as pd

df = pd.DataFrame({
    "ts": pd.to_datetime(["2024-08-01 09:10", "2024-08-01 09:40", "2024-08-01 10:20",
                          "2024-08-02 09:15", "2024-08-01 09:05", "2024-08-01 10:50"]),
    "machine": ["M1", "M1", "M1", "M1", "M2", "M2"],
    "temp": [61.0, 63.0, 70.0, 58.0, 80.0, 84.0],
})'''
ns = {}
exec(CODE, ns)
df = ns["df"]
A = df.set_index("ts")["temp"].resample("1h").mean()
B = df.groupby(["machine", df["ts"].dt.hour])["temp"].mean()
C = df.set_index("ts").groupby("machine")["temp"].resample("1h").mean()
D = df.set_index("ts").groupby("machine")["temp"].rolling("1h").mean()
print(C)
# 正解 C：機台 × 整點小時
assert C.loc[("M1", pd.Timestamp("2024-08-01 09:00"))] == 62.0
assert C.loc[("M1", pd.Timestamp("2024-08-01 10:00"))] == 70.0
assert C.loc[("M1", pd.Timestamp("2024-08-02 09:00"))] == 58.0
assert C.loc[("M2", pd.Timestamp("2024-08-01 09:00"))] == 80.0
assert C.loc[("M2", pd.Timestamp("2024-08-01 10:00"))] == 84.0
# A 錯：不分機台，M1 與 M2 混在同一小時
assert A[pd.Timestamp("2024-08-01 09:00")] == np.mean([61, 63, 80])
# B 錯：依「幾點」分組，把 8/1 與 8/2 的 9 點混在一起
assert B.loc[("M1", 9)] == np.mean([61, 63, 58])
# D 錯：rolling 是逐筆的時間視窗，列數不變、不是整點分箱
assert len(D) == len(df)
assert D.loc[("M1", pd.Timestamp("2024-08-01 10:20"))] == np.mean([63, 70])
print("OK", "senior-bigdata-practice-q174")
