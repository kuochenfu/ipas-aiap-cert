# 驗證：pandas 2.x 的 DataFrame.corr() 預設 numeric_only=False，遇文字欄位拋 ValueError
import io, contextlib, traceback, warnings
warnings.filterwarnings("ignore")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np, pandas as pd, seaborn as sns

assert pd.__version__.startswith("2.")

# 以等價的 DataFrame 取代 sensor.csv
rng = np.random.default_rng(0)
df = pd.DataFrame({"line": rng.choice(["L1", "L2", "L3"], 50),
                   "temp": rng.normal(70, 5, 50),
                   "vib": rng.normal(2, 0.3, 50),
                   "rpm": rng.normal(1500, 50, 50)})
df.loc[[4, 17], "vib"] = np.nan        # 真實資料也常有缺值

def err(fn):
    try:
        fn()
    except Exception as e:
        return f"{type(e).__name__}: {e}"
    return None

# ── 題目程式碼與輸出 ──
msg = err(lambda: sns.heatmap(df.corr(), annot=True, cmap="coolwarm"))
assert msg == "ValueError: could not convert string to float: 'L3'", msg

# 正解 C：只對數值欄位計算，得到 3×3 相關矩陣並能畫出熱圖
c = df.corr(numeric_only=True)
assert c.shape == (3, 3) and list(c.columns) == ["temp", "vib", "rpm"]
ax = sns.heatmap(c, annot=True, cmap="coolwarm")
assert ax.collections and len(ax.texts) == 9
plt.close("all")

# A 錯：錯誤發生在 df.corr()，換成 plt.imshow 一樣在算相關係數時失敗
assert err(lambda: plt.imshow(df.corr())) == msg

# B 錯：缺值不是原因；dropna 後仍是同一個錯誤（而且 corr 本來就會成對略過缺值）
assert err(lambda: df.dropna().corr()) == msg
assert not np.isnan(df.corr(numeric_only=True).loc["vib", "temp"])

# D 錯：spearman 同樣要把每一欄轉成數值，文字欄位一樣失敗
assert err(lambda: df.corr(method="spearman")) == msg

print("OK", "senior-bigdata-practice-q211")
