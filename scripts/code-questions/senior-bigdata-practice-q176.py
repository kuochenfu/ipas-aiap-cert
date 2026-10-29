import numpy as np
import pandas as pd

CODE = '''import numpy as np
import pandas as pd

s = pd.Series([20.0, np.nan, 26.0],
              index=pd.to_datetime(["2024-04-01 06:00", "2024-04-01 07:00",
                                    "2024-04-01 12:00"]))'''
ns = {}
exec(CODE, ns)
s = ns["s"]
t = pd.Timestamp("2024-04-01 07:00")
# 依時間比例：6 點到 12 點共 6 小時，7 點位於 1/6 處 → 20 + 6 × 1/6 = 21
A = s.interpolate(method="linear")
B = s.fillna(s.mean())
C = s.ffill()
D = s.interpolate(method="time")
print(A[t], B[t], C[t], D[t])
assert D[t] == 21.0
assert A[t] == 23.0      # 依位置等距，忽略時間間隔
assert B[t] == 23.0      # 整體平均，與時間無關
assert C[t] == 20.0      # 沿用前一筆
print("OK", "senior-bigdata-practice-q176")
