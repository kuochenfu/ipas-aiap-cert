import warnings
warnings.simplefilter("ignore")
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline

CODE = '''import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
df = pd.DataFrame({"income": rng.lognormal(10.5, 0.6, 400).round(0),
                   "debt_ratio": rng.uniform(0, 1, 400).round(2)})
df["default"] = (df["debt_ratio"] + rng.normal(0, 0.2, 400) > 0.8).astype(int)
df.loc[rng.choice(400, 60, replace=False), "income"] = np.nan

df["income"] = df["income"].fillna(df["income"].median())     # 步驟 1：補值
X, y = df[["income", "debt_ratio"]], df["default"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=42)  # 步驟 2
model = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)     # 步驟 3
print(round(model.score(X_te, y_te), 3))'''
import io, contextlib
ns = {}
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    exec(CODE, ns)
assert buf.getvalue().strip() == "0.86", buf.getvalue()

# 重建補值前的原始資料
rng = np.random.default_rng(0)
raw = pd.DataFrame({"income": rng.lognormal(10.5, 0.6, 400).round(0),
                    "debt_ratio": rng.uniform(0, 1, 400).round(2)})
raw["default"] = (raw["debt_ratio"] + rng.normal(0, 0.2, 400) > 0.8).astype(int)
raw.loc[rng.choice(400, 60, replace=False), "income"] = np.nan
X, y = raw[["income", "debt_ratio"]], raw["default"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=42)

# 原流程：補值用的中位數看過了全部 400 列（含 100 列測試資料）
full_med = raw["income"].median()
train_med = X_tr["income"].median()
test_med = X_te["income"].median()
assert full_med != train_med

# A 正解：先切分，補值器只在訓練集 fit，再套到測試集
pipe = make_pipeline(SimpleImputer(strategy="median"), LogisticRegression(max_iter=1000)).fit(X_tr, y_tr)
imp = pipe.named_steps["simpleimputer"]
assert imp.n_features_in_ == 2 and imp.statistics_[0] == train_med
filled = imp.transform(X_te)
assert np.allclose(filled[X_te["income"].isna().to_numpy(), 0], train_med)
# 可處理上線時單筆缺值的申請件
one = pd.DataFrame({"income": [np.nan], "debt_ratio": [0.5]})
assert pipe.predict(one).shape == (1,)

# B 錯：測試集用自己的中位數，等於讓測試資料的統計量參與前處理，上線時單筆資料也算不出中位數
assert test_med != train_med
assert pd.isna(one["income"].median())

# C 錯：換成平均數仍是用全部資料計算統計量，洩漏照舊（平均數同樣含測試集）
assert raw["income"].mean() != X_tr["income"].mean()

# D 錯：刪列損失 15% 的樣本，且模型對缺所得的新申請件無法輸出預測
assert raw["income"].isna().sum() == 60
model_d = LogisticRegression(max_iter=1000).fit(X_tr.dropna(), y_tr[X_tr["income"].notna()])
try:
    model_d.predict(one); raise SystemExit("D 應無法預測含缺值的資料")
except ValueError:
    pass
print("OK", "senior-bigdata-practice-q182")
