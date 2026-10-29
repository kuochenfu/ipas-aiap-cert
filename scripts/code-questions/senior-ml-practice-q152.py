"""驗證 senior-ml-practice-q152：題目附的輸出、正解與三個錯誤選項。"""
import io, contextlib, warnings
warnings.filterwarnings("ignore")

SETUP = r'''import numpy as np
rng = np.random.RandomState(0)
n = 300
soil = np.repeat([0, 1, 2], 100)   # 農藝專家依土壤性質判定的真實類型
ph = np.array([5.0, 6.5, 8.0])[soil] + rng.randn(n) * 0.3
om = np.array([1.5, 3.0, 4.5])[soil] + rng.randn(n) * 0.4
cec = np.array([8, 15, 22])[soil] + rng.randn(n) * 2.0
rain = rng.uniform(600, 2400, n)
X = np.c_[rain, ph, om, cec]'''

CODE = r'''from sklearn.cluster import KMeans

# X 的四個欄位依序為：年雨量 rain、pH、有機質 om、陽離子交換容量 cec
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print(km.cluster_centers_.round(1))'''

EXPECTED = r'''[[ 947.8    6.6    3.    15.2]
 [1610.6    6.5    3.    15.1]
 [2172.4    6.4    2.9   14.1]]'''

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
from sklearn.metrics import adjusted_rand_score as ari
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
assert ari(soil, km.labels_) < 0.05
c = km.cluster_centers_
assert np.ptp(c[:, 0]) > 1000 and np.ptp(c[:, 1]) < 0.5 and np.ptp(c[:, 2]) < 0.5
fit = lambda Z, k=3, ni=10: KMeans(n_clusters=k, n_init=ni, random_state=0).fit_predict(Z)
assert ari(soil, fit(X, k=5)) < 0.05                                  # A
assert ari(soil, fit(X, ni=50)) < 0.05                                # B
assert ari(soil, fit(StandardScaler().fit_transform(X))) > 0.99       # C
assert ari(soil, fit(PCA(n_components=2).fit_transform(X))) < 0.05    # D
assert abs(PCA(n_components=2).fit(X).components_[0, 0]) > 0.99

print("OK", "senior-ml-practice-q152")
