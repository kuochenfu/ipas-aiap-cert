import io, contextlib, copy

def run(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code, {"copy": copy})
    return buf.getvalue().rstrip("\n")

ORIG = '''def add_flag(record, flags=[]):
    if record["temp"] > 80:
        flags.append("過熱")
    if record["vib"] > 5:
        flags.append("振動")
    record["flags"] = flags
    return record

logs = [{"id": "M1", "temp": 85, "vib": 3},
        {"id": "M2", "temp": 70, "vib": 6},
        {"id": "M3", "temp": 65, "vib": 2}]
cleaned = [add_flag(dict(r)) for r in logs]
for r in cleaned:
    print(r["id"], r["flags"])'''
EXPECTED = "M1 ['過熱', '振動']\nM2 ['過熱', '振動']\nM3 ['過熱', '振動']"
WANT = "M1 ['過熱']\nM2 ['振動']\nM3 []"
assert run(ORIG) == EXPECTED

# B（正解）：None 當預設值，函式內建立新清單
B = ORIG.replace("flags=[]):", "flags=None):\n    if flags is None:\n        flags = []")
assert run(B) == WANT
# A：只在指派時 copy，預設清單仍在累積 → 結果仍錯
A = ORIG.replace('record["flags"] = flags', 'record["flags"] = flags.copy()')
ra = run(A)
assert ra != WANT and ra == "M1 ['過熱']\nM2 ['過熱', '振動']\nM3 ['過熱', '振動']", ra
# C：flags=list() 仍只在 def 時求值一次 → 與原本相同
C = ORIG.replace("flags=[]):", "flags=list()):")
assert run(C) == EXPECTED
# D：deepcopy 紀錄字典無關，共用的是預設清單 → 與原本相同
D = ORIG.replace("add_flag(dict(r))", "add_flag(copy.deepcopy(r))")
assert run(D) == EXPECTED
print("OK", "senior-bigdata-practice-q185")
