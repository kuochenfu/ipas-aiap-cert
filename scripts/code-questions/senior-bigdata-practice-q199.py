# 驗證：虛擬碼＝K-means（Lloyd 演算法），而非 KNN／凝聚式階層分群／DBSCAN
import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.neighbors import KNeighborsClassifier

X, _ = make_blobs(n_samples=300, centers=4, cluster_std=1.2, random_state=5)
k = 4
rng = np.random.default_rng(0)
init_idx = rng.choice(len(X), size=k, replace=False)

def pseudocode(D, k, init_idx):
    c = D[init_idx].copy()                       # 1. 隨機挑 k 位客戶作為初始 c
    labels = np.full(len(D), -1)
    while True:                                  # 2. 重複
        d = np.linalg.norm(D[:, None, :] - c[None, :, :], axis=2)
        new = d.argmin(axis=1)                   # a. 標記為距離最小的 j
        if np.array_equal(new, labels):          # 直到標記不再改變
            break
        labels = new
        for j in range(k):                       # b. c[j] 更新為群內平均
            c[j] = D[labels == j].mean(axis=0)
    return labels, c

labels, centers = pseudocode(X, k, init_idx)

# 正解 B：與 scikit-learn 的 KMeans（同樣初始中心、Lloyd 演算法）結果完全一致
km = KMeans(n_clusters=k, init=X[init_idx], n_init=1, algorithm="lloyd", tol=0, max_iter=300).fit(X)
assert np.array_equal(km.labels_, labels)
assert np.allclose(km.cluster_centers_, centers)
# 輸出群數固定為 k
assert len(np.unique(labels)) == k

# A 錯：KNN 是監督式，fit 必須有標籤；虛擬碼的輸入沒有標籤
try:
    KNeighborsClassifier(n_neighbors=k).fit(X)
    raise AssertionError("KNN 不應能在無標籤下 fit")
except TypeError:
    pass

# C 錯：凝聚式階層分群沒有「群中心以平均更新、重新指派」的迭代；
# 它的結果不保證每個點都歸到最近的群平均（K-means 的不動點條件）
agg = AgglomerativeClustering(n_clusters=k, linkage="single").fit_predict(X)
agg_centers = np.array([X[agg == j].mean(axis=0) for j in range(k)])
nearest = np.linalg.norm(X[:, None] - agg_centers[None], axis=2).argmin(axis=1)
assert not np.array_equal(nearest, agg)          # 不滿足 K-means 的不動點
d_km = np.linalg.norm(X[:, None] - centers[None], axis=2).argmin(axis=1)
assert np.array_equal(d_km, labels)              # 虛擬碼結果滿足不動點

# D 錯：DBSCAN 不輸入群數，群數由半徑 eps 決定
n1 = len(set(DBSCAN(eps=0.5, min_samples=5).fit_predict(X)) - {-1})
n2 = len(set(DBSCAN(eps=2.0, min_samples=5).fit_predict(X)) - {-1})
assert n1 != n2

print("OK", "senior-bigdata-practice-q199")
