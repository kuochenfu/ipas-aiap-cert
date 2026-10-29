# 驗證：虛擬碼＝Apriori（逐層產生候選＋向下封閉剪枝＋掃描計數），與暴力列舉結果一致
from itertools import combinations
import random

T = [{"軸承","皮帶","馬達"},{"軸承","皮帶"},{"皮帶","馬達"},{"軸承","馬達","感測器"},
     {"軸承","皮帶","馬達"},{"感測器","電源"},{"軸承","皮帶","感測器"},{"皮帶","馬達","電源"},
     {"軸承","皮帶","馬達","感測器"},{"軸承","皮帶"}]
min_sup = 0.3

def sup(c, data):
    return sum(c <= t for t in data) / len(data)

def pseudocode(data, min_sup):
    items = sorted(set().union(*data))
    L = [{frozenset([i]) for i in items if sup(frozenset([i]), data) >= min_sup}]
    k = 1; generated = 0; pruned = 0
    while L[-1]:
        Lk = L[-1]
        C = {a | b for a in Lk for b in Lk if len(a | b) == k + 1}          # a. 兩兩合併
        before = len(C)
        C = {c for c in C if all(frozenset(s) in Lk for s in combinations(c, k))}   # b. 剪枝
        pruned += before - len(C); generated += len(C)
        L.append({c for c in C if sup(c, data) >= min_sup})                 # c、d. 掃描計數
        k += 1
    return set().union(*L), generated, pruned

freq, generated, pruned = pseudocode(T, min_sup)

# 正解 D：與暴力列舉所有組合的頻繁項集完全相同
items = sorted(set().union(*T))
brute = {frozenset(c) for r in range(1, len(items) + 1) for c in combinations(items, r)
         if sup(frozenset(c), T) >= min_sup}
assert freq == brute
assert frozenset({"軸承", "皮帶", "馬達"}) in freq
# 向下封閉性：頻繁項集的所有子集都頻繁（剪枝的依據）
assert all(frozenset(s) in freq for f in freq for r in range(1, len(f)) for s in combinations(f, r))

# A 錯：FP-Growth 不產生候選；本虛擬碼確實產生並計數了不頻繁的候選
infrequent_candidates = generated - (len(freq) - len([f for f in freq if len(f) == 1]))
assert infrequent_candidates > 0

# B 錯：交易是集合、不記先後順序；把每張工單的零件打亂順序，結果完全相同
random.seed(0)
shuffled = [set(random.sample(sorted(t), len(t))) for t in T]
assert pseudocode(shuffled, min_sup)[0] == freq

# C 錯：輸出是支持度達門檻的零件組合，不是對未更換零件的評分
assert all(isinstance(f, frozenset) and sup(f, T) >= min_sup for f in freq)

print("OK", "senior-bigdata-practice-q206")
