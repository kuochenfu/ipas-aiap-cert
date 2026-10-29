import pandas as pd

CODE = '''import pandas as pd

df = pd.DataFrame({
    "machine": ["M1", "M1", "M2", "M1", "M2", "M2"],
    "ts": pd.to_datetime(["2024-09-01 10:00", "2024-09-01 10:01", "2024-09-01 10:00",
                          "2024-09-01 10:00", "2024-09-01 10:01", "2024-09-01 10:01"]),
    "vib": [0.31, 0.35, 0.52, 0.33, 0.50, 0.49],
})   # 閘道器重送時，同一機台同一時間點會出現第二筆，後到的才是校正後的讀數'''
ns = {}
exec(CODE, ns)
df = ns["df"]
A = df.drop_duplicates(subset=["machine"], keep="last")
B = df.drop_duplicates(subset=["machine", "ts"], keep="last")
C = df.drop_duplicates(subset=["machine", "ts"], keep="first")
D = df.drop_duplicates(subset=["ts", "machine"], keep=False)
key = lambda d: sorted(zip(d.machine, d.ts.dt.strftime("%H:%M"), d.vib))
print(key(B))
assert key(B) == [("M1", "10:00", 0.33), ("M1", "10:01", 0.35), ("M2", "10:00", 0.52), ("M2", "10:01", 0.49)]
assert len(A) == 2                                    # 每台機器只剩一筆
assert key(C) != key(B) and ("M1", "10:00", 0.31) in key(C)   # 留下的是舊讀數
assert len(D) == 2                                    # 重複的兩組被整組刪掉
assert len(df.drop_duplicates(keep="last")) == 6      # 參考：不指定 subset 因讀數不同而一筆都刪不掉
print("OK", "senior-bigdata-practice-q179")
