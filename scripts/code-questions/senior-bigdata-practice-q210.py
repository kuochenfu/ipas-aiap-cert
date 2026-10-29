# 驗證：程式畫的是常態 Q-Q 圖（理論常態分位數 vs 標準化後的排序樣本）
import warnings
warnings.filterwarnings("ignore")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np, pandas as pd
from scipy import stats

def run(glucose):
    df = pd.DataFrame({"glucose": glucose})
    fig = plt.figure()
    # ── 題目程式碼 ──
    x = np.sort(df["glucose"].to_numpy())
    n = len(x)
    p = (np.arange(1, n + 1) - 0.5) / n
    q = stats.norm.ppf(p)
    z = (x - x.mean()) / x.std()
    plt.scatter(q, z, s=8)
    plt.plot([-3, 3], [-3, 3], "r--")
    plt.xlabel("theoretical"); plt.ylabel("sample")
    pts = fig.axes[0].collections[0].get_offsets()
    plt.close(fig)
    return np.asarray(pts)

rng = np.random.default_rng(4)
normal = rng.normal(95, 12, 400)
skewed = 70 + rng.lognormal(3, 0.6, 400)

pts = run(normal)
qx, zy = pts[:, 0], pts[:, 1]

# 正解 A：橫軸與 scipy.stats.probplot 的理論常態分位數幾乎一致，縱軸是排序後的樣本
(osm, osr), _ = stats.probplot(normal, dist="norm")
assert np.corrcoef(qx, osm)[0, 1] > 0.9999
assert np.allclose(np.sort(normal), osr) and np.all(np.diff(zy) >= 0)
# 判讀：常態資料的點貼近 y = x 虛線，右偏資料則明顯偏離
dev_normal = np.mean(np.abs(zy - qx))
ps = run(skewed)
dev_skew = np.mean(np.abs(ps[:, 1] - ps[:, 0]))
assert dev_normal < 0.06 and dev_skew > 2 * dev_normal

# B 錯：ECDF 的縱軸是累積比例，落在 [0, 1]；這裡的縱軸有負值、也大於 1
assert zy.min() < 0 and zy.max() > 1

# C 錯：ROC 曲線兩軸是 FPR、TPR，都在 [0, 1]；這裡橫軸是常態分位數，有負值
assert qx.min() < -2 and qx.max() > 2

# D 錯：殘差圖的縱軸是殘差、點不會依序遞增；這裡沒有任何模型，縱軸是排序後的樣本（單調遞增）
assert np.all(np.diff(zy) >= 0)

print("OK", "senior-bigdata-practice-q210")
