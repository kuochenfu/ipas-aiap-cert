import io, contextlib
import pandas as pd

CODE = '''import pandas as pd

tx = pd.DataFrame({
    "txn_id": [101, 102, 103, 104, 105, 106, 107, 108],
    "customer_id": ["C01", "C02", "C02", "C03", "C01", "C04", "C02", "C03"],
    "amount": [1200, 800, 450, 3000, 650, 2200, 990, 410],
})
customers = pd.DataFrame({
    "customer_id": ["C01", "C02", "C03", "C04", "C02", "C05"],
    "segment": ["一般", "一般", "VIP", "一般", "VIP", "VIP"],
})
merged = tx.merge(customers, on="customer_id", how="left")
print(len(tx), len(merged))
print(tx["amount"].sum(), merged["amount"].sum())'''

EXPECTED = """8 11
9700 11940"""

ns = {}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(CODE, ns)
out = buf.getvalue().rstrip()
print(out)
assert out == EXPECTED, out
tx, customers, merged = ns["tx"], ns["customers"], ns["merged"]

# 正解 D：客戶表 customer_id 不唯一（C02 兩筆），C02 的 3 筆交易各被複製一次
assert customers["customer_id"].duplicated().sum() == 1
assert merged["txn_id"].duplicated().sum() == 3
assert merged["amount"].sum() - tx["amount"].sum() == tx.loc[tx.customer_id == "C02", "amount"].sum()
try:
    tx.merge(customers, on="customer_id", how="left", validate="many_to_one")
    raise SystemExit("validate 應該擋下")
except pd.errors.MergeError:
    pass
fixed = tx.merge(customers.drop_duplicates("customer_id", keep="last"), on="customer_id",
                 how="left", validate="many_to_one")
assert len(fixed) == 8 and fixed["amount"].sum() == 9700

# A 錯：left join 不會帶入沒有交易的客戶 C05
assert "C05" not in set(merged["customer_id"])
# B 錯：交易表的 txn_id 本身沒有重複
assert tx["txn_id"].is_unique
# C 錯：改成 inner 仍是 11 列、11940
inner = tx.merge(customers, on="customer_id", how="inner")
assert len(inner) == 11 and inner["amount"].sum() == 11940
print("OK", "senior-bigdata-practice-q167")
