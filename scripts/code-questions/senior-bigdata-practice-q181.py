import pandas as pd

CODE = '''import pandas as pd

df = pd.DataFrame({"farm": ["F1", "F2", "F3", "F4"],
                   "kg":   ["1,250", "980", "2,034", "1,100"]})'''
ns = {}
exec(CODE, ns)
df = ns["df"]
want = [1250.0, 980.0, 2034.0, 1100.0]
D = df["kg"].str.replace(",", "").astype(float)
assert D.tolist() == want
# A：含逗號的三筆被悄悄轉成 NaN，只剩 980
A = pd.to_numeric(df["kg"], errors="coerce")
assert A.isna().sum() == 3 and A.sum() == 980
# B：Series.replace 預設比對整個儲存格的值，不會替換子字串，轉型時拋 ValueError
try:
    df["kg"].replace(",", "").astype(float); raise SystemExit("B 應失敗")
except ValueError:
    pass
# C：把逗號換成小數點，1,250 變成 1.25，數值錯了三個數量級卻不報錯
C = df["kg"].str.replace(",", ".").astype(float)
assert C.tolist() == [1.25, 980.0, 2.034, 1.1]
print("OK", "senior-bigdata-practice-q181")
