# 驗證：只有 hue="cls" 的 scatterplot 能「每位學生一點＋依班級上色＋自動圖例」
import warnings
warnings.filterwarnings("ignore")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import PathCollection
import numpy as np, pandas as pd, seaborn as sns

rng = np.random.default_rng(1)
n = 90
df = pd.DataFrame({"hours": rng.integers(2, 15, n),             # 整數時數，必有多人同一時數
                   "cls": np.repeat(["甲班", "乙班", "丙班"], 30)})
df["score"] = (40 + 3.5 * df["hours"] + rng.normal(0, 6, n)).round()

def fresh():
    plt.close("all"); fig, ax = plt.subplots(); return ax

# 正解 B
ax = fresh()
sns.scatterplot(data=df, x="hours", y="score", hue="cls", ax=ax)
pc = [c for c in ax.collections if isinstance(c, PathCollection)][0]
assert len(pc.get_offsets()) == n                                   # 每位學生一點
assert len({tuple(np.round(c, 4)) for c in pc.get_facecolors()}) == 3   # 三種顏色
assert sorted(t.get_text() for t in ax.get_legend().get_texts()) == sorted(["甲班", "乙班", "丙班"])

# A 錯：c= 需要顏色或數值；中文班級名稱不是顏色 → ValueError
ax = fresh()
try:
    plt.scatter(df["hours"], df["score"], c=df["cls"])
    raise AssertionError("應拋出例外")
except ValueError:
    pass

# C 錯：size= 依班級改變點的大小，所有點同一種顏色
ax = fresh()
sns.scatterplot(data=df, x="hours", y="score", size="cls", ax=ax)
pc = [c for c in ax.collections if isinstance(c, PathCollection)][0]
assert len({tuple(np.round(c, 4)) for c in pc.get_facecolors()}) == 1
assert len(set(np.round(pc.get_sizes(), 4))) == 3

# D 錯：lineplot 把同一時數的學生聚合成平均並連線，個別學生的點消失
ax = fresh()
sns.lineplot(data=df, x="hours", y="score", hue="cls", ax=ax)
assert not [c for c in ax.collections if isinstance(c, PathCollection)]
pts = sum(len(ln.get_xdata()) for ln in ax.lines if len(ln.get_xdata()) > 1)
assert pts < n
g = df[df.cls == "甲班"].groupby("hours")["score"].mean()
first = [ln for ln in ax.lines if len(ln.get_xdata()) == len(g)][0]
assert np.allclose(first.get_ydata(), g.values)

print("OK", "senior-bigdata-practice-q212")
