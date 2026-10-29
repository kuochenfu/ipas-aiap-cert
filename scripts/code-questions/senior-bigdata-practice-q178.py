import numpy as np
import pandas as pd

CODE = '''import numpy as np
import pandas as pd

df = pd.DataFrame({
    "ward": ["W1", "W1", "W1", "W1", "W2", "W2", "W2"],
    "hb":   [12.0, np.nan, 13.0, 6.0, 15.0, 14.0, np.nan],
})
df["hb"] = df["hb"].fillna(____)'''
FILLS = {
    "A": 'df.groupby("ward")["hb"].median()',
    "B": 'df.groupby("ward")["hb"].transform("median")',
    "C": 'df.groupby("ward")["hb"].transform("mean")',
    "D": 'df.groupby("ward")["hb"].transform("ffill")',
}
res = {}
for k, f in FILLS.items():
    ns = {}
    exec(CODE.replace("____", f), ns)
    res[k] = ns["df"]["hb"].tolist()
    print(k, res[k])
# 正解 B：W1 中位數 12.0、W2 中位數 14.5，且每一列都對齊回原索引
assert res["B"] == [12.0, 12.0, 13.0, 6.0, 15.0, 14.0, 14.5]
# A 錯：median() 的索引是病房代碼，與原資料的整數索引對不上，缺值一個也沒補到
assert sum(np.isnan(res["A"])) == 2
# C 錯：平均數被 6.0 這筆低值拉低（W1 平均 10.33），與指定的中位數不同
assert round(res["C"][1], 2) == 10.33 and res["C"] != res["B"]
# D 錯：沿用同病房前一筆，W1 缺值補成 12.0 看似相同，但 W2 補成 14.0 而非中位數 14.5
assert res["D"][6] == 14.0 and res["D"] != res["B"]
print("OK", "senior-bigdata-practice-q178")
