import numpy as np

data_rng = np.random.default_rng(7)
x = np.round(data_rng.normal(6.5, 1.2, 30), 2)   # 30 塊試驗田的每公頃產量（公噸）

def run(size, replace, q):
    rng = np.random.default_rng(42)
    means = []
    for _ in range(5000):
        s = rng.choice(x, size=size, replace=replace)
        means.append(s.mean())
    lo, hi = np.percentile(means, q)
    return lo, hi

n = len(x)
se = x.std(ddof=1) / np.sqrt(n)
# 正解 C：重抽樣大小 = n、取後放回，取 2.5 與 97.5 百分位
lo, hi = run(n, True, [2.5, 97.5])
assert lo < x.mean() < hi
assert abs((hi - lo) - 2 * 1.96 * se) / (2 * 1.96 * se) < 0.1, (hi - lo, 2 * 1.96 * se)
# A 錯：不放回且大小 = n，每次都是原資料的排列，平均數完全相同 → 區間寬度為 0；[5, 95] 也只是 90% 區間
lo_a, hi_a = run(n, False, [5, 95])
assert np.isclose(hi_a - lo_a, 0, atol=1e-9)
# B 錯：只抽一半，平均數的變異被放大，區間約寬 √2 倍
lo_b, hi_b = run(n // 2, True, [2.5, 97.5])
assert 1.25 < (hi_b - lo_b) / (hi - lo) < 1.6, (hi_b - lo_b) / (hi - lo)
# D 錯：np.percentile 的 q 是 0～100，0.025、0.975 是極端尾端的百分位，區間落在平均數分布的最左端
lo_d, hi_d = run(n, True, [0.025, 0.975])
assert hi_d < lo and hi_d < x.mean()
# 判斷分界：np.quantile 用 0～1，與 percentile 的 2.5／97.5 結果相同
rng = np.random.default_rng(42)
means = [rng.choice(x, size=n, replace=True).mean() for _ in range(5000)]
assert np.allclose(np.quantile(means, [0.025, 0.975]), [lo, hi])
print("OK", "senior-ml-practice-q180")
