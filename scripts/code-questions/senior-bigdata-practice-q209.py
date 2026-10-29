# 驗證 ①～⑥ 六條敘述：①③⑤ 為真，②④⑥ 為假
import warnings
warnings.filterwarnings("ignore")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np, pandas as pd

rng = np.random.default_rng(8)
cols = ["stock", "bond", "gold", "oil", "fx"]
scale = {"stock": 0.012, "bond": 0.003, "gold": 0.009, "oil": 0.025, "fx": 0.004}
returns = pd.DataFrame({c: rng.standard_t(4, 750) * scale[c] for c in cols})

# ── 題目程式碼 ──
fig, axes = plt.subplots(2, 3, figsize=(12, 6), sharey=True)
order = []
for ax, col in zip(axes.flat, cols):
    ax.hist(returns[col], bins=20)
    ax.set_title(col)
    order.append(ax)
axes[0, 0].set_yscale("log")
fig.tight_layout()

# ① 真：axes 形狀 (2, 3)；axes.flat 依列優先走訪
assert axes.shape == (2, 3)
assert order == [axes[0, 0], axes[0, 1], axes[0, 2], axes[1, 0], axes[1, 1]]

# ② 假：figsize 單位是英吋；像素 = 英吋 × dpi
assert tuple(fig.get_size_inches()) == (12.0, 6.0)
fig.set_dpi(100)
assert fig.canvas.get_width_height() == (1200, 600)

# ③ 真：sharey=True 時，axes[0, 0] 改成對數刻度，其他子圖的 y 軸一併變成對數
assert all(ax.get_yscale() == "log" for ax in axes.flat)

# ④ 假：bins=20 是分成 20 個等寬分箱，寬度 =（最大值 − 最小值）／20，不是 20
_, edges, _ = plt.figure().add_subplot().hist(returns["stock"], bins=20)
assert len(edges) == 21
w = edges[1] - edges[0]
assert abs(w - (returns["stock"].max() - returns["stock"].min()) / 20) < 1e-12 and w != 20

# ⑤ 真：cols 只有 5 個，zip 走完就停；axes[1, 2] 是沒有資料、但仍顯示的空白座標軸
assert not axes[1, 2].has_data() and axes[1, 2].get_visible() and axes[1, 2].axison

# ⑥ 假：sharey 只共用 y 軸；x 軸範圍各自不同（sharex 預設 False）
xlims = {tuple(np.round(ax.get_xlim(), 6)) for ax in order}
assert len(xlims) == 5
assert abs(axes[0, 0].get_xlim()[1] - axes[1, 0].get_xlim()[1]) > 1e-3

print("OK", "senior-bigdata-practice-q209")
