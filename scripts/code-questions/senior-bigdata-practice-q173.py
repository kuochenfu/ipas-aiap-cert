import pandas as pd

CODE = '''import pandas as pd

df = pd.DataFrame({
    "pid":  ["P1", "P1", "P2", "P3", "P1", "P3", "P4", "P2"],
    "dept": ["內科", "內科", "內科", "外科", "外科", "外科", "兒科", "外科"],
    "date": pd.to_datetime(["2024-07-01", "2024-07-08", "2024-07-02", "2024-07-03",
                            "2024-07-09", "2024-07-15", "2024-07-04", "2024-07-20"]),
})'''
ns = {}
exec(CODE, ns)
df = ns["df"]
want = {"內科": 2, "外科": 3, "兒科": 1}   # 內科 P1、P2；外科 P1、P2、P3；兒科 P4
A = df.groupby("dept")["pid"].nunique()
B = df.groupby("dept")["pid"].count()
C = df.drop_duplicates("pid")["dept"].value_counts()
D = df.groupby("pid")["dept"].nunique()
print(A.to_dict(), B.to_dict(), C.to_dict(), D.to_dict())
assert A.to_dict() == want
assert B.to_dict() != want and B["內科"] == 3        # 算的是就診人次
assert C.to_dict() != want and C.get("外科") == 1     # 每位病人只留第一次就診的科別
assert set(D.index) == {"P1", "P2", "P3", "P4"}      # 方向反了：每位病人看過幾個科
print("OK", "senior-bigdata-practice-q173")
