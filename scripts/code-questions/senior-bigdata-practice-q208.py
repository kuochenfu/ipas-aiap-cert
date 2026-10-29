# 驗證：只有 boxplot 同時呈現中位數、四分位距與個別離群點
import warnings
warnings.filterwarnings("ignore")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np, pandas as pd, seaborn as sns
from matplotlib.patches import Rectangle

rng = np.random.default_rng(3)
parts = []
for v, mu in [("台南11號", 6200), ("台稉9號", 5800), ("高雄147號", 6000)]:
    yld = rng.normal(mu, 250, 40)
    parts.append(pd.DataFrame({"variety": v, "yield_kg": yld}))
df = pd.concat(parts, ignore_index=True)
low_fields = [3900.0, 4100.0]                     # 兩塊異常偏低的田區
df.loc[[5, 50], "yield_kg"] = low_fields

def draw(fn):
    fig, ax = plt.subplots()
    fn(ax)
    return fig, ax

# 正解 D：boxplot，離群點（fliers）正好是那兩塊偏低田區；箱線含中位數
fig, ax = draw(lambda ax: sns.boxplot(data=df, x="variety", y="yield_kg", ax=ax))
flier_y = sorted(float(y) for ln in ax.lines for y in np.atleast_1d(ln.get_ydata())
                 if ln.get_marker() not in (None, "", "None") and len(np.atleast_1d(ln.get_ydata())) > 0)
assert set(low_fields) <= set(flier_y)
med_lines = [ln for ln in ax.lines if len(ln.get_ydata()) == 2 and ln.get_ydata()[0] == ln.get_ydata()[1]]
meds = sorted(float(ln.get_ydata()[0]) for ln in med_lines)
for v in df["variety"].unique():
    assert any(abs(df.loc[df.variety == v, "yield_kg"].median() - m) < 1e-6 for m in meds)
plt.close(fig)

# A 錯：barplot 的長條高度是平均數，看不到分布與離群點
fig, ax = draw(lambda ax: sns.barplot(data=df, x="variety", y="yield_kg", ax=ax))
heights = [p.get_height() for p in ax.patches if isinstance(p, Rectangle)]
assert np.allclose(sorted(heights), sorted(df.groupby("variety")["yield_kg"].mean()))
assert not any(ln.get_marker() not in (None, "", "None") for ln in ax.lines)
plt.close(fig)

# B 錯：lineplot 把各品種的平均連成線，類別之間本無先後連續關係，也不顯示離群點
fig, ax = draw(lambda ax: sns.lineplot(data=df, x="variety", y="yield_kg", ax=ax))
ys = ax.lines[0].get_ydata()
assert len(ys) == 3 and np.allclose(sorted(ys), sorted(df.groupby("variety")["yield_kg"].mean()))
plt.close(fig)

# C 錯：countplot 只計算每個品種有幾筆資料，與產量無關
fig, ax = draw(lambda ax: sns.countplot(data=df, x="variety", hue="variety", ax=ax))
hs = [p.get_height() for p in ax.patches if p.get_height() > 0]; assert sorted(hs) == [40, 40, 40], hs
plt.close(fig)

print("OK", "senior-bigdata-practice-q208")
