import io, contextlib
import pandas as pd

CODE = '''import pandas as pd

visits = pd.DataFrame({
    "dept": ["內科", "外科", "內科", "兒科", "外科", "內科"],
    "month": ["2024-01", "2024-01", "2024-02", "2024-02", "2024-02", "2024-01"],
    "cost": [1200, 3500, 800, 600, 4200, 950],
})
table = visits.pivot_table(____)
print(table)'''

EXPECTED = """month  2024-01  2024-02
dept
兒科           0      600
內科        2150      800
外科        3500     4200"""

FILLS = {
    "A": 'index="month", columns="dept", values="cost", aggfunc="sum", fill_value=0',
    "B": 'index="dept", columns="month", values="cost", aggfunc="mean", fill_value=0',
    "C": 'index="dept", columns="month", values="cost", aggfunc="sum", fill_value=0',
    "D": 'index="dept", columns="month", values="cost", aggfunc="sum", margins=True',
}

def run(fill):
    buf = io.StringIO()
    ns = {}
    with contextlib.redirect_stdout(buf):
        exec(CODE.replace("____", fill), ns)
    return "\n".join(l.rstrip() for l in buf.getvalue().rstrip().splitlines()), ns["table"]

outs = {k: run(v) for k, v in FILLS.items()}
print(outs["C"][0])
assert outs["C"][0] == EXPECTED, repr(outs["C"][0])
for k in "ABD":
    print(k, "->\n", outs[k][0])
    assert outs[k][0] != EXPECTED
# A：列與欄對調
assert list(outs["A"][1].index) == ["2024-01", "2024-02"]
# B：平均而非加總（內科 1 月 = 1075）
assert outs["B"][1].loc["內科", "2024-01"] == 1075
# D：沒有 fill_value，兒科 1 月是 NaN，且多出 All 列欄
assert pd.isna(outs["D"][1].loc["兒科", "2024-01"]) and "All" in outs["D"][1].index
print("OK", "senior-bigdata-practice-q168")
