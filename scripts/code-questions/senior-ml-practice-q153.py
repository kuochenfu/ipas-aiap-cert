"""驗證 senior-ml-practice-q153：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
X_raw, true_seg = make_blobs(n_samples=600, n_features=5, centers=4, cluster_std=1.6, random_state=7)
X_std = StandardScaler().fit_transform(X_raw)'''

CODE = r'''from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

for k in range(2, 8):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_std)
    print(k, round(km.inertia_, 1), round(silhouette_score(X_std, km.labels_), 3))'''

EXPECTED = r'''2 1662.3 0.486
3 699.2 0.619
4 276.6 0.682
5 255.1 0.572
6 235.2 0.453
7 217.3 0.358'''

ns = {}
exec(SETUP, ns)
_buf = io.StringIO()
with contextlib.redirect_stdout(_buf):
    exec(CODE, ns)
_out = _buf.getvalue()
if EXPECTED.strip():
    assert _out.rstrip() == EXPECTED.rstrip(), "輸出不符：\n" + _out
globals().update({k: v for k, v in ns.items() if not k.startswith("__")})

# ── 正解與錯誤選項的檢查 ──
import numpy as np
res = {k: KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_std) for k in range(2, 8)}
inert = [res[k].inertia_ for k in range(2, 8)]
sil = {k: silhouette_score(X_std, res[k].labels_) for k in range(2, 8)}
assert all(a > b for a, b in zip(inert, inert[1:]))          # A 錯：單調下降
drops = [a - b for a, b in zip(inert, inert[1:])]             # 2→3、3→4、4→5、…
assert max(sil, key=sil.get) == 4 and drops[2] < 0.1 * drops[1]   # B 對
assert silhouette_score(X_std, true_seg) > 0.6                # C 錯：越接近 1 越好
rng = np.random.RandomState(0)
assert abs(silhouette_score(X_std, rng.randint(0, 4, len(X_std)))) < 0.05
assert sil[7] == min(sil.values())
assert drops[0] == max(drops) and drops[1] > 400              # D 錯：3→4 仍大幅下降

print("OK", "senior-ml-practice-q153")
