import pandas as pd

df = pd.DataFrame({"member_id": [101, 102, 103, 104, 105, 106],
                   "id_no": ["A123", "B456", "A123", "C789", "B456", "A123"],
                   "branch": ["台北", "台中", "高雄", "台北", "台中", "台南"]})

def flag_dup(df):
    mask = df.duplicated(subset=["id_no"], keep=False)
    return df.loc[mask].sort_values("id_no")

out = flag_dup(df)
# C（正解）：身分證號出現兩次以上的所有列，含第一次出現者
counts = df["id_no"].value_counts()
expect_c = df[df["id_no"].map(counts) >= 2]
assert set(out["member_id"]) == set(expect_c["member_id"]) == {101, 102, 103, 105, 106}
assert 101 in set(out["member_id"])  # 第一次出現的 A123 也在其中
# A：keep='first' 的語意，只留第二次以後的列 → 不同
a = df[df.duplicated(subset=["id_no"])]
assert set(a["member_id"]) == {103, 105, 106} and set(a["member_id"]) != set(out["member_id"])
# B：drop_duplicates 去重後名單 → 不同（含 C789、每號一列）
b = df.drop_duplicates(subset=["id_no"])
assert set(b["member_id"]) == {101, 102, 104} and set(b["member_id"]) != set(out["member_id"])
# D：整列完全相同才算重複 → 本資料沒有任何一列整列相同
d = df[df.duplicated(keep=False)]
assert len(d) == 0 and len(out) == 5
print("OK", "senior-bigdata-practice-q183")
