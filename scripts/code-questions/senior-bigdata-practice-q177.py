import pandas as pd

CODE = '''import pandas as pd

df = pd.DataFrame({
    "cust":   ["K1", "K2", "K3", "K1", "K4", "K2", "K5", "K4", "K1"],
    "amount": [9000, 4000, 7000, 2500, 4000, 4500, 1000, 4000, 1500],
})'''
ns = {}
exec(CODE, ns)
df = ns["df"]
# 每位持卡人總額：K1 13000、K2 8500、K4 8000、K3 7000、K5 1000
A = df.nlargest(3, "amount")["cust"]
B = df.groupby("cust")["amount"].max().nlargest(3)
C = df.groupby("cust")["amount"].sum().sort_values().head(3)
D = df.groupby("cust")["amount"].sum().nlargest(3)
print(list(A), B.to_dict(), C.to_dict(), D.to_dict())
assert list(D.index) == ["K1", "K2", "K4"] and list(D) == [13000, 8500, 8000]
assert list(A) == ["K1", "K3", "K2"] and set(A) != set(D.index)   # 單筆最大的三筆交易，未加總
assert list(B.index) != list(D.index)                 # 單筆最高消費前三名
assert list(B.index) == ["K1", "K3", "K2"]
assert list(C.index) == ["K5", "K3", "K4"] and list(C) == [1000, 7000, 8000]             # 遞增排序取前 3 是最低的三位
print("OK", "senior-bigdata-practice-q177")
