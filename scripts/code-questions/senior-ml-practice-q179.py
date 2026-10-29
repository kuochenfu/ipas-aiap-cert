import numpy as np
from math import comb, exp, lgamma, log

rng = np.random.default_rng(2024)
n_trials = 100_000
b = rng.integers(1, 366, size=(n_trials, 30))
b.sort(axis=1)
hit = (np.diff(b, axis=1) == 0).any(axis=1)
est = hit.mean()
print(est)

p_all_distinct = np.prod([(365 - k) / 365 for k in range(30)])
p_at_least_two = 1 - p_all_distinct
# 恰好一對同天、其餘皆不同天：C(30,2) × 365 × 364 × … × (365-28) / 365^30
p_exactly_one_pair = comb(30, 2) * exp(lgamma(366) - lgamma(366 - 29) - 30 * log(365))
p_specific = 1 - (364 / 365) ** 29
# 正解 C：至少兩人同天
assert abs(est - p_at_least_two) < 0.005, (est, p_at_least_two)
# 錯誤選項的機率與估計值差很多
assert abs(est - p_exactly_one_pair) > 0.2, p_exactly_one_pair
assert abs(est - p_specific) > 0.5, p_specific
assert abs(est - p_all_distinct) > 0.3, p_all_distinct
# 「至少一組重複」也包含三人同天或兩對以上，所以大於恰好一對
assert p_at_least_two > p_exactly_one_pair
print("OK", "senior-ml-practice-q179")
