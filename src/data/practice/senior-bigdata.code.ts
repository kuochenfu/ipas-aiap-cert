import type { Question } from "../types";

// 程式閱讀題（2026-10-29）：依真題比例補上的一批，計畫見 docs/superpowers/plans/2026-10-29-senior-code-reading-questions.md。
// 每題的程式行為都以固定版本環境實際執行驗證過（驗證腳本見 scripts/code-questions/），觀念敘述與詳解仍為 LLM 產出、需人工複審。
export const practiceQuestions: Question[] = [
  {
    id: "senior-bigdata-practice-q167",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行信用卡部門（pandas 2.x）把交易明細 tx 與客戶分群表 customers 以 customer_id 合併，準備計算各分群的消費總額。執行下列程式後，分析師發現合併後的列數與總金額都比原始交易多。根據程式與輸出，下列判斷何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "tx = pd.DataFrame({\n" +
          "    \"txn_id\": [101, 102, 103, 104, 105, 106, 107, 108],\n" +
          "    \"customer_id\": [\"C01\", \"C02\", \"C02\", \"C03\", \"C01\", \"C04\", \"C02\", \"C03\"],\n" +
          "    \"amount\": [1200, 800, 450, 3000, 650, 2200, 990, 410],\n" +
          "})\n" +
          "customers = pd.DataFrame({\n" +
          "    \"customer_id\": [\"C01\", \"C02\", \"C03\", \"C04\", \"C02\", \"C05\"],\n" +
          "    \"segment\": [\"一般\", \"一般\", \"VIP\", \"一般\", \"VIP\", \"VIP\"],\n" +
          "})\n" +
          "merged = tx.merge(customers, on=\"customer_id\", how=\"left\")\n" +
          "print(len(tx), len(merged))\n" +
          "print(tx[\"amount\"].sum(), merged[\"amount\"].sum())",
      },
      {
        kind: "output",
        caption: "輸出結果：",
        content:
          "8 11\n" +
          "9700 11940",
      },
    ],
    choices: [
      { id: "A", text: "how=\"left\" 會把客戶表中沒有交易的客戶（如 C05）一併帶入結果，才使列數與總金額同時增加" },
      { id: "B", text: "交易表的 txn_id 本身就有重複，同一筆刷卡被收單系統重複入帳兩次，合併只是讓問題浮現" },
      { id: "C", text: "這是左合併特有的副作用，改成 how=\"inner\" 只保留兩邊都有的鍵，列數就會回到 8 筆" },
      { id: "D", text: "客戶表的 customer_id 不唯一，C02 的交易被複製一份；應先去重並以 validate 檢查" },
    ],
    answer: "D",
    explanation:
      "左合併以左表 tx 為主，每一筆交易會配上右表中所有 customer_id 相同的列。customers 裡 C02 出現兩次（分群由一般改為 VIP 的舊紀錄沒清掉），C02 的 3 筆交易因此各被複製一次：列數 8 + 3 = 11，總額多出的 11940 − 9700 = 2240 正好是 C02 三筆交易 800 + 450 + 990 的合計。處理方式是先決定每位客戶保留哪一筆分群（例如最新一筆）讓 customer_id 唯一，並在 merge 加上 validate=\"many_to_one\"，日後右表再出現重複鍵就會直接拋出 MergeError，而不是悄悄讓金額灌水。",
    choiceExplanations: {
      A: "左合併只保留左表 tx 的每一筆交易，右表中沒有對應交易的 C05 不會出現在結果裡；列數增加只可能來自右表的鍵重複。",
      B: "tx 的 txn_id 從 101 到 108 各不相同，交易表本身沒有重複入帳；多出來的 3 列都是 C02 的交易被右表重複鍵展開所致。",
      C: "重複鍵造成的一對多展開與合併方式無關，inner join 同樣會讓 C02 的每筆交易配上兩列，結果仍是 11 列、11940。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["merge 一對多展開", "重複鍵", "validate 參數"],
      constraints: ["data"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若右表的 customer_id 確認唯一而列數仍變多，就要回頭檢查左表本身是否有重複交易；若合併後列數反而變少，則要懷疑是 inner join 丟掉了配對不到的交易。",
    },
  },
  {
    id: "senior-bigdata-practice-q168",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院（pandas 2.x）要把門診費用整理成「科別為列、月份為欄、儲存格為費用加總、沒有就診的格子顯示 0」的報表，期望輸出如下。程式中的空白處應填入下列何者？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "visits = pd.DataFrame({\n" +
          "    \"dept\": [\"內科\", \"外科\", \"內科\", \"兒科\", \"外科\", \"內科\"],\n" +
          "    \"month\": [\"2024-01\", \"2024-01\", \"2024-02\", \"2024-02\", \"2024-02\", \"2024-01\"],\n" +
          "    \"cost\": [1200, 3500, 800, 600, 4200, 950],\n" +
          "})\n" +
          "table = visits.pivot_table(____)\n" +
          "print(table)",
      },
      {
        kind: "output",
        caption: "期望輸出：",
        content:
          "month  2024-01  2024-02\n" +
          "dept\n" +
          "兒科           0      600\n" +
          "內科        2150      800\n" +
          "外科        3500     4200",
      },
    ],
    choices: [
      { id: "A", text: "index=\"month\", columns=\"dept\", values=\"cost\", aggfunc=\"sum\", fill_value=0" },
      { id: "B", text: "index=\"dept\", columns=\"month\", values=\"cost\", aggfunc=\"mean\", fill_value=0" },
      { id: "C", text: "index=\"dept\", columns=\"month\", values=\"cost\", aggfunc=\"sum\", fill_value=0" },
      { id: "D", text: "index=\"dept\", columns=\"month\", values=\"cost\", aggfunc=\"sum\", margins=True" },
    ],
    answer: "C",
    explanation:
      "pivot_table 的 index 決定列、columns 決定欄、values 是要彙總的欄位、aggfunc 是彙總方式。期望輸出的列是科別、欄是月份，所以 index=\"dept\"、columns=\"month\"；內科 1 月是 1200 + 950 = 2150，代表 aggfunc 是加總；兒科 1 月沒有就診紀錄，原本會是 NaN，要顯示 0 必須加上 fill_value=0（整張表也因此維持整數）。",
    choiceExplanations: {
      A: "index 與 columns 對調，列變成月份、欄變成科別，數字相同但整張表被轉置，與期望的版面不符。",
      B: "aggfunc=\"mean\" 算的是平均費用，內科 1 月會是 (1200 + 950) ÷ 2 = 1075，而不是加總的 2150。",
      D: "margins=True 會多出 All 小計列與欄，而且沒有 fill_value，兒科 1 月仍是 NaN，數值也變成浮點數。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["pivot_table", "index 與 columns", "fill_value"],
      constraints: ["data"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若報表要的是各科每月的平均單次費用，aggfunc 就該改成 \"mean\"；若還要附上總計列與欄，則是在 fill_value=0 之外再加 margins=True。",
    },
  },
  {
    id: "senior-bigdata-practice-q169",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠以每分鐘一筆的溫度讀數，在每個時間點 t 預測 10 分鐘後機台是否過熱。資料工程師以下列 pandas 2.x 程式產生特徵，離線驗證的成效很好，上線即時推論後成效卻明顯下滑。下列哪一種修改最能解決問題，且在即時推論時照樣可用？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import pandas as pd\n" +
          "\n" +
          "rng = np.random.default_rng(7)\n" +
          "idx = pd.date_range(\"2024-05-01 08:00\", periods=12, freq=\"min\")\n" +
          "df = pd.DataFrame({\"temp\": rng.normal(70, 2, 12).round(1)}, index=idx)\n" +
          "df.iloc[[3, 4, 8], 0] = np.nan   # 通訊中斷造成的缺值\n" +
          "\n" +
          "df[\"temp\"] = df[\"temp\"].bfill()\n" +
          "df[\"temp_ma\"] = df[\"temp\"].rolling(5, center=True).mean()\n" +
          "# 以 t 時刻的 temp 與 temp_ma 預測 t+10 分鐘是否過熱",
      },
    ],
    choices: [
      { id: "A", text: "補值改用 ffill()，rolling 拿掉 center=True，讓 t 的特徵只用到 t 以前的讀數" },
      { id: "B", text: "補值改用 interpolate() 做線性內插，rolling 保留 center=True 以平滑感測雜訊" },
      { id: "C", text: "保留 bfill() 補值，把 rolling 改成 expanding().mean()，只累計歷史讀數的平均" },
      { id: "D", text: "先以 dropna() 刪掉缺值的分鐘，再沿用 center=True 的 rolling 計算移動平均" },
    ],
    answer: "A",
    explanation:
      "兩個步驟都偷看了未來：bfill() 用缺值「之後」的第一筆有效讀數往回填，08:03、08:04 的溫度其實是 08:05 才量到的；rolling(5, center=True) 以 t 為中心，視窗包含 t+1、t+2 兩分鐘的讀數。離線回測時這些未來值都已在表中，上線時卻還沒發生，特徵分布因此不同，成效隨之下滑。改用 ffill()（沿用最後一筆已知讀數）並讓 rolling 回到預設的靠右對齊（視窗為 t−4 到 t），特徵只依賴當下以前的資料，離線與上線才一致。檢查方式是改動 t 之後的讀數，看 t 的特徵是否維持不變。",
    choiceExplanations: {
      B: "interpolate() 的線性內插需要缺值之後的下一筆有效讀數，同樣用到未來；center=True 的視窗也仍包含 t+1、t+2，兩處洩漏都還在，平滑雜訊不是這裡的問題。",
      C: "expanding() 確實只累計過去的讀數，但補值仍是 bfill()，缺值時刻的溫度依舊是未來才量到的值，洩漏沒有消除。",
      D: "刪除缺值列只是避開補值，center=True 仍讓視窗看到未來兩分鐘；而且上線時遇到斷訊的那一分鐘就產生不出特徵、無法預測。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["時序資料洩漏", "bfill 與 ffill", "rolling center", "缺值補法"],
      constraints: ["data"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L22201",
      decisionBoundary:
        "若特徵只用於事後的批次報表（例如繪製平滑曲線、回顧當天異常），center=True 與內插補值都可以接受；只有在「以 t 預測未來」的情境，特徵才必須限制在 t 以前的資料。",
    },
  },
  {
    id: "senior-bigdata-practice-q170",
    subjectId: "senior-bigdata",
    prompt:
      "某補習班（pandas 2.x）要列出每個班級分數最高的兩位學生（保留學生、班級、分數三欄），資料如下。下列哪一行程式碼能得到正確結果？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "df = pd.DataFrame({\n" +
          "    \"student\": [\"S01\", \"S02\", \"S03\", \"S04\", \"S05\", \"S06\", \"S07\", \"S08\"],\n" +
          "    \"class\":   [\"甲\", \"甲\", \"甲\", \"乙\", \"乙\", \"乙\", \"丙\", \"丙\"],\n" +
          "    \"score\":   [92, 78, 85, 95, 66, 88, 71, 59],\n" +
          "})",
      },
    ],
    choices: [
      { id: "A", text: "df.sort_values(\"score\").groupby(\"class\").head(2)" },
      { id: "B", text: "df.nlargest(2, \"score\").groupby(\"class\").tail(2)" },
      { id: "C", text: "df.sort_values(\"score\").groupby(\"class\").tail(2)" },
      { id: "D", text: "df.groupby(\"class\")[\"score\"].tail(2).sort_values()" },
    ],
    answer: "C",
    explanation:
      "sort_values 預設遞增排序，排完後每個班級的最後兩列就是分數最高的兩位；groupby(...).tail(2) 會依排序後的順序在各組取最後兩列，並保留所有欄位。結果為甲班 S01（92）、S03（85），乙班 S04（95）、S06（88），丙班 S07、S08。",
    choiceExplanations: {
      A: "遞增排序後取 head(2) 是每班最前面兩列，也就是分數最低的兩位（甲班 S02、S03），方向剛好相反。",
      B: "nlargest(2, \"score\") 先取全校最高的兩列（S04、S01），再分組時其他學生早已被濾掉，結果只剩兩位。",
      D: "沒有先排序，tail(2) 取的是每班在原始資料中最後出現的兩列；之後再排序只改變顯示順序，甲班仍漏掉 92 分的 S01，且結果只剩分數一欄。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["分組取前 N 名", "sort_values", "groupby head 與 tail"],
      constraints: ["data"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Layer Confusion",
        D: "Partial Truth",
      },
      crossNode: "L22101",
      decisionBoundary:
        "若改用 sort_values(\"score\", ascending=False) 遞減排序，正確的寫法就變成取 head(2)；若只需要各班前兩名的分數而不要學生資料，groupby(\"class\")[\"score\"].nlargest(2) 也可以。",
    },
  },
  {
    id: "senior-bigdata-practice-q171",
    subjectId: "senior-bigdata",
    prompt:
      "某農場的雨量計每小時回傳一筆雨量（mm），分析師以 pandas 2.x 彙整成每日雨量，準備據此統計無雨日數並安排灌溉。根據下列程式與輸出，下列判斷何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import pandas as pd\n" +
          "\n" +
          "rng = np.random.default_rng(3)\n" +
          "idx = pd.date_range(\"2024-03-01\", \"2024-03-04 23:00\", freq=\"h\")\n" +
          "rain = pd.Series(rng.choice([0, 0, 0, 0.2, 0.5, 1.0], len(idx)), index=idx)\n" +
          "rain = rain.drop(rain[\"2024-03-03\"].index)   # 重現 3/03 的實際資料狀況\n" +
          "\n" +
          "print(rain.resample(\"D\").size())\n" +
          "print(rain.resample(\"D\").sum().round(1))",
      },
      {
        kind: "output",
        caption: "輸出結果：",
        content:
          "2024-03-01    24\n" +
          "2024-03-02    24\n" +
          "2024-03-03     0\n" +
          "2024-03-04    24\n" +
          "Freq: D, dtype: int64\n" +
          "2024-03-01    4.6\n" +
          "2024-03-02    7.8\n" +
          "2024-03-03    0.0\n" +
          "2024-03-04    7.4\n" +
          "Freq: D, dtype: float64",
      },
    ],
    choices: [
      { id: "A", text: "3/03 沒有任何紀錄，sum() 對空區間回傳 0，應改用 sum(min_count=1) 標成 NaN" },
      { id: "B", text: "3/03 的每日雨量為 0，代表當天沒有降雨，可以直接計入本月無雨日數並延後灌溉排程" },
      { id: "C", text: "size() 為 0 表示當天的讀數全部是 NaN，sum() 依預設略過這些 NaN 之後才把雨量算成 0.0" },
      { id: "D", text: "resample() 預設會以前一個區間的值補上空區間，所以 3/03 的 0.0 是自動補值產生的結果" },
    ],
    answer: "A",
    explanation:
      "size() 計算每個區間有幾列，3/03 為 0 表示那天一筆紀錄也沒有。pandas 的 sum() 在空集合上依慣例回傳 0（min_count 預設為 0），於是「沒有資料」被呈現成「雨量 0.0」，看起來和真的沒下雨一模一樣。設定 sum(min_count=1) 會讓有效值少於 1 筆的區間成為 NaN，再依業務決定補值或排除；也可以搭配 count() 檢查每日的有效筆數。",
    choiceExplanations: {
      B: "這正是要避免的誤判：當天沒有任何量測，0.0 只是空區間加總的預設值，計入無雨日會高估乾旱程度並誤導灌溉決策。",
      C: "size() 連 NaN 的列也會計數；若當天 24 筆都是 NaN，size() 會是 24 而不是 0。size() 為 0 代表根本沒有任何列。",
      D: "resample() 只負責分箱與彙總，不會自動向前補值；若真的向前補，3/03 應該是 3/02 的 7.8 而不是 0.0。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["resample 空區間", "min_count", "size 與 count", "缺資料與零值"],
      constraints: ["data"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若改用 mean() 彙總，空區間會直接是 NaN 而不會偽裝成 0；只有 sum() 這類在空集合上有「自然值」的彙總，才需要 min_count 把缺資料與真正的 0 分開。",
    },
  },
  {
    id: "senior-bigdata-practice-q172",
    subjectId: "senior-bigdata",
    prompt:
      "某證券公司計算收盤價的 3 日移動平均，其中第 3 個交易日因暫停交易而沒有收盤價。以 pandas 2.x 執行下列程式後，印出的結果為何？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import pandas as pd\n" +
          "\n" +
          "close = pd.Series([10.0, 20.0, np.nan, 40.0, 50.0],\n" +
          "                  index=pd.date_range(\"2024-06-03\", periods=5, freq=\"B\"))\n" +
          "ma = close.rolling(3, min_periods=2).mean()\n" +
          "print(ma.tolist())",
      },
    ],
    choices: [
      { id: "A", text: "[nan, nan, nan, nan, nan]" },
      { id: "B", text: "[nan, 15.0, 10.0, 20.0, 30.0]" },
      { id: "C", text: "[nan, 15.0, 15.0, 30.0, 45.0]" },
      { id: "D", text: "[nan, 15.0, nan, nan, nan]" },
    ],
    answer: "C",
    explanation:
      "rolling(3, min_periods=2) 表示視窗涵蓋最近 3 個位置，但只要視窗中至少有 2 個非缺值就計算，且平均只用有效值。逐一計算：第 1 個位置只有 10 一個值，少於 2 → nan；第 2 個 (10, 20) → 15.0；第 3 個 (10, 20, NaN) 有 2 個有效值 → 15.0；第 4 個 (20, NaN, 40) → 30.0；第 5 個 (NaN, 40, 50) → 45.0。",
    choiceExplanations: {
      A: "這是沒有設定 min_periods 的結果：預設要求視窗內 3 個值都有效，而每個視窗不是含有缺值就是不足 3 筆，因此全部是 nan。",
      B: "這是先把缺值補成 0 再計算的結果，第 3 個位置變成 (10 + 20 + 0) ÷ 3 = 10.0；rolling 會略過 NaN，不會把它當成 0。",
      D: "這是「視窗內只要有 NaN 就得到 NaN」的算法（例如直接用 NumPy 的 mean）；pandas 的 rolling 會略過缺值，只以有效值計算。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["rolling", "min_periods", "缺值處理"],
      constraints: ["data"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把 min_periods 改成 3，只要視窗含有缺值就輸出 nan，結果會變成全部 nan；若先 ffill() 補值再計算，第 3 個位置會變成 (10 + 20 + 20) ÷ 3。",
    },
  },
  {
    id: "senior-bigdata-practice-q173",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院（pandas 2.x）分析 7 月門診紀錄，每列是一次就診，同一位病人可能在同一科或不同科就診多次，資料如下。要計算「各科別有幾位不同的病人」，下列哪一行程式碼正確？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "df = pd.DataFrame({\n" +
          "    \"pid\":  [\"P1\", \"P1\", \"P2\", \"P3\", \"P1\", \"P3\", \"P4\", \"P2\"],\n" +
          "    \"dept\": [\"內科\", \"內科\", \"內科\", \"外科\", \"外科\", \"外科\", \"兒科\", \"外科\"],\n" +
          "    \"date\": pd.to_datetime([\"2024-07-01\", \"2024-07-08\", \"2024-07-02\", \"2024-07-03\",\n" +
          "                            \"2024-07-09\", \"2024-07-15\", \"2024-07-04\", \"2024-07-20\"]),\n" +
          "})",
      },
    ],
    choices: [
      { id: "A", text: "df.groupby(\"dept\")[\"pid\"].nunique()" },
      { id: "B", text: "df.groupby(\"dept\")[\"pid\"].count()" },
      { id: "C", text: "df.drop_duplicates(\"pid\")[\"dept\"].value_counts()" },
      { id: "D", text: "df.groupby(\"pid\")[\"dept\"].nunique()" },
    ],
    answer: "A",
    explanation:
      "依科別分組後，對 pid 取 nunique() 會計算每組中不重複的病人數：內科 P1、P2 共 2 位，外科 P1、P2、P3 共 3 位，兒科 P4 1 位。P1 在內科就診兩次只算一次，同時也會計入外科。",
    choiceExplanations: {
      B: "count() 計算的是非缺值的列數，也就是就診人次；P1 在內科就診兩次會被算兩次，內科得到 3 而不是 2。",
      C: "先依 pid 去重會讓每位病人只留第一筆就診紀錄，P1、P2 後來到外科就診的紀錄被刪掉，外科只剩 1 位，跨科就診的病人被少算。",
      D: "分組鍵與計數欄位對調，算出的是每位病人看過幾個不同科別，索引變成病人代碼，不是各科的病人數。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["nunique", "人次與人數", "groupby"],
      constraints: ["data"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若主管要的是各科的就診「人次」（衡量門診負荷），count() 或 value_counts() 才是正確答案；只有問「幾位病人」時才需要去重計數。",
    },
  },
  {
    id: "senior-bigdata-practice-q174",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠（pandas 2.x）的溫度監測表中，每列是一台機台在某時刻的讀數，資料如下。要算出「每台機台、每個整點小時」的平均溫度，下列哪一行程式碼正確？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "df = pd.DataFrame({\n" +
          "    \"ts\": pd.to_datetime([\"2024-08-01 09:10\", \"2024-08-01 09:40\", \"2024-08-01 10:20\",\n" +
          "                          \"2024-08-02 09:15\", \"2024-08-01 09:05\", \"2024-08-01 10:50\"]),\n" +
          "    \"machine\": [\"M1\", \"M1\", \"M1\", \"M1\", \"M2\", \"M2\"],\n" +
          "    \"temp\": [61.0, 63.0, 70.0, 58.0, 80.0, 84.0],\n" +
          "})",
      },
    ],
    choices: [
      { id: "A", text: "df.set_index(\"ts\")[\"temp\"].resample(\"1h\").mean()" },
      { id: "B", text: "df.groupby([\"machine\", df[\"ts\"].dt.hour])[\"temp\"].mean()" },
      { id: "C", text: "df.set_index(\"ts\").groupby(\"machine\")[\"temp\"].resample(\"1h\").mean()" },
      { id: "D", text: "df.set_index(\"ts\").groupby(\"machine\")[\"temp\"].rolling(\"1h\").mean()" },
    ],
    answer: "C",
    explanation:
      "resample 需要時間索引，所以先 set_index(\"ts\")；先依 machine 分組再 resample(\"1h\")，每台機台各自依整點小時分箱後取平均。M1 在 8/1 9 點是 (61 + 63) ÷ 2 = 62.0、10 點是 70.0，8/2 9 點是 58.0；M2 在 8/1 9 點、10 點分別是 80.0、84.0。中間沒有資料的小時會以 NaN 列出。",
    choiceExplanations: {
      A: "沒有依機台分組，M1 與 M2 在同一小時的讀數被混在一起平均，8/1 9 點會得到 (61 + 63 + 80) ÷ 3。",
      B: "dt.hour 只取「幾點」，8/1 與 8/2 的 9 點被歸為同一組，M1 的 9 點變成 (61 + 63 + 58) ÷ 3，跨日的資料被混在一起。",
      D: "rolling(\"1h\") 是以每一筆讀數為終點往回看一小時的移動視窗，輸出列數與原資料相同，並不是整點分箱的彙總。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["resample", "時間索引", "rolling 與 resample"],
      constraints: ["data"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若目的是看「一天中哪個時段最熱」的日內樣式，依 dt.hour 跨日分組反而才是想要的；要逐筆平滑而非分箱彙總時，才改用 rolling。",
    },
  },
  {
    id: "senior-bigdata-practice-q175",
    subjectId: "senior-bigdata",
    prompt:
      "某大學（pandas 2.x）把學生名冊與選課紀錄合併，選課紀錄中的 sid 5 是已退學學生留下的資料。執行下列程式後，印出的結果為何？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "students = pd.DataFrame({\"sid\": [1, 2, 3, 4], \"name\": [\"王\", \"李\", \"陳\", \"林\"]})\n" +
          "enroll = pd.DataFrame({\"sid\": [1, 1, 2, 5], \"course\": [\"統計\", \"程式\", \"統計\", \"英文\"]})\n" +
          "\n" +
          "merged = students.merge(enroll, on=\"sid\", how=\"left\")\n" +
          "print(merged.shape, merged[\"course\"].isna().sum())",
      },
    ],
    choices: [
      { id: "A", text: "(4, 3) 2" },
      { id: "B", text: "(5, 3) 2" },
      { id: "C", text: "(6, 3) 2" },
      { id: "D", text: "(3, 3) 0" },
    ],
    answer: "B",
    explanation:
      "左合併保留左表 students 的每一位學生，並配上右表所有相同 sid 的列：sid 1 選了兩門課而展開成兩列，sid 2 一列，sid 3、4 沒有選課紀錄各一列且 course 為 NaN，右表獨有的 sid 5 不會出現。共 2 + 1 + 1 + 1 = 5 列、3 欄（sid、name、course），course 的缺值有 2 個。",
    choiceExplanations: {
      A: "以為左合併的列數一定等於左表的 4 列；實際上左表的一筆可以對應右表多筆，sid 1 選了兩門課就會展開成兩列。",
      C: "這是 how=\"outer\" 的結果，會多出右表獨有的 sid 5（name 為 NaN）；左合併不會保留右表中配對不到的列。",
      D: "這是 how=\"inner\" 的結果，只保留兩邊都有的 sid 1、2，因此沒有缺值；左合併會保留沒有選課的 sid 3、4。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["left join", "一對多合併", "合併後缺值"],
      constraints: ["data"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若改成 how=\"inner\"，沒有選課的學生會消失、缺值數變成 0；若要找出「沒有選任何課的學生」，正好可以利用左合併之後 course 為 NaN 的列。",
    },
  },
  {
    id: "senior-bigdata-practice-q176",
    subjectId: "senior-bigdata",
    prompt:
      "某溫室的土壤溫度計原本每小時回傳一次，07:00 那筆遺失，下一筆要到 12:00 才恢復，資料如下。研究員（pandas 2.x）希望依「時間間隔的比例」估計 07:00 的溫度，下列哪一行程式碼正確？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import pandas as pd\n" +
          "\n" +
          "s = pd.Series([20.0, np.nan, 26.0],\n" +
          "              index=pd.to_datetime([\"2024-04-01 06:00\", \"2024-04-01 07:00\",\n" +
          "                                    \"2024-04-01 12:00\"]))",
      },
    ],
    choices: [
      { id: "A", text: "s.interpolate(method=\"linear\")" },
      { id: "B", text: "s.fillna(s.mean())" },
      { id: "C", text: "s.ffill()" },
      { id: "D", text: "s.interpolate(method=\"time\")" },
    ],
    answer: "D",
    explanation:
      "method=\"time\" 依時間索引的實際間隔做線性內插：06:00 到 12:00 共 6 小時，07:00 位在 1/6 處，估計值為 20 + (26 − 20) × 1/6 = 21.0。",
    choiceExplanations: {
      A: "method=\"linear\" 會忽略索引、把相鄰資料點視為等距，07:00 被當成兩點正中間而得到 23.0，與實際的時間間隔不符。",
      B: "以整段平均值 23.0 補值，與缺值所在的時間位置無關，也沒有反映 06:00 之後溫度逐步上升的趨勢。",
      C: "ffill() 直接沿用 06:00 的 20.0，等於假設溫度在缺值期間維持不變，沒有依時間比例估計。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["interpolate", "時間內插", "不等距時間序列"],
      constraints: ["data"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Correct in Different Context",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若資料點的時間間隔完全相同，method=\"linear\" 與 method=\"time\" 的結果一樣；只有間隔不等時兩者才會分歧。",
    },
  },
  {
    id: "senior-bigdata-practice-q177",
    subjectId: "senior-bigdata",
    prompt:
      "某發卡銀行（pandas 2.x）要找出本月刷卡「總金額」最高的前 3 位持卡人，每列是一筆刷卡交易，資料如下。下列哪一行程式碼正確？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "df = pd.DataFrame({\n" +
          "    \"cust\":   [\"K1\", \"K2\", \"K3\", \"K1\", \"K4\", \"K2\", \"K5\", \"K4\", \"K1\"],\n" +
          "    \"amount\": [9000, 4000, 7000, 2500, 4000, 4500, 1000, 4000, 1500],\n" +
          "})",
      },
    ],
    choices: [
      { id: "A", text: "df.nlargest(3, \"amount\")[\"cust\"]" },
      { id: "B", text: "df.groupby(\"cust\")[\"amount\"].max().nlargest(3)" },
      { id: "C", text: "df.groupby(\"cust\")[\"amount\"].sum().sort_values().head(3)" },
      { id: "D", text: "df.groupby(\"cust\")[\"amount\"].sum().nlargest(3)" },
    ],
    answer: "D",
    explanation:
      "要比的是每位持卡人的總額，必須先依 cust 分組加總，再用 nlargest(3) 取最大的 3 個：K1 13000、K2 8500、K4 8000。",
    choiceExplanations: {
      A: "nlargest 直接作用在交易明細上，取的是單筆金額最高的 3 筆交易（K1、K3、K2）；K4 兩筆 4000 合計 8000，卻因單筆不大而落選。",
      B: "max() 取的是每位持卡人的單筆最高消費，排名變成 K1、K3、K2，衡量的是單筆大額而不是總額。",
      C: "sort_values() 預設遞增，head(3) 取到的是總額最低的 3 位（K5、K3、K4），方向相反。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["groupby 加總", "nlargest", "排序方向"],
      constraints: ["data"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若題目改問「單筆消費最高的 3 筆交易」，直接對明細使用 nlargest(3, \"amount\") 才是對的；兩種問法的差別在於是否先依持卡人加總。",
    },
  },
  {
    id: "senior-bigdata-practice-q178",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院檢驗科（pandas 2.x）要以「同一病房的中位數」補上血紅素 hb 的缺值，因為少數重症病人的數值偏低，會把平均數拉低。程式中的空白處應填入下列何者？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import pandas as pd\n" +
          "\n" +
          "df = pd.DataFrame({\n" +
          "    \"ward\": [\"W1\", \"W1\", \"W1\", \"W1\", \"W2\", \"W2\", \"W2\"],\n" +
          "    \"hb\":   [12.0, np.nan, 13.0, 6.0, 15.0, 14.0, np.nan],\n" +
          "})\n" +
          "df[\"hb\"] = df[\"hb\"].fillna(____)",
      },
    ],
    choices: [
      { id: "A", text: "df.groupby(\"ward\")[\"hb\"].median()" },
      { id: "B", text: "df.groupby(\"ward\")[\"hb\"].transform(\"median\")" },
      { id: "C", text: "df.groupby(\"ward\")[\"hb\"].transform(\"mean\")" },
      { id: "D", text: "df.groupby(\"ward\")[\"hb\"].transform(\"ffill\")" },
    ],
    answer: "B",
    explanation:
      "transform(\"median\") 會在各病房算出中位數後，把結果廣播回每一列、保留原本的索引，因此能與 df[\"hb\"] 逐列對齊，fillna 只在缺值處採用它。W1 的中位數是 12.0（6、12、13）、W2 是 14.5（14、15），補值後為 [12.0, 12.0, 13.0, 6.0, 15.0, 14.0, 14.5]。",
    choiceExplanations: {
      A: "median() 會把每個病房彙總成一列，索引是病房代碼 W1、W2；fillna 依索引對齊時對不上原資料的 0–6，兩個缺值一個也沒補到，而且不會報錯。",
      C: "transform(\"mean\") 能正確對齊，但取的是平均數；W1 被 6.0 這筆低值拉低成 10.33，正是題目想避免的偏誤。",
      D: "transform(\"ffill\") 是沿用同病房前一筆的值，W2 的缺值被補成 14.0 而不是中位數 14.5，屬於另一種補值策略。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["groupby transform", "索引對齊", "中位數補值"],
      constraints: ["data"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若資料大致對稱、沒有極端值，transform(\"mean\") 與中位數差異不大；若資料是依時間排序的連續監測值，同組向前補值（ffill）反而比中位數更合理。",
    },
  },
  {
    id: "senior-bigdata-practice-q179",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的振動感測資料經閘道器上傳，網路不穩時會重送，同一台機台在同一時間點因此出現兩筆讀數，資料如下。要去除重送造成的重複並保留校正後的讀數，下列哪一行程式碼正確（pandas 2.x）？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "df = pd.DataFrame({\n" +
          "    \"machine\": [\"M1\", \"M1\", \"M2\", \"M1\", \"M2\", \"M2\"],\n" +
          "    \"ts\": pd.to_datetime([\"2024-09-01 10:00\", \"2024-09-01 10:01\", \"2024-09-01 10:00\",\n" +
          "                          \"2024-09-01 10:00\", \"2024-09-01 10:01\", \"2024-09-01 10:01\"]),\n" +
          "    \"vib\": [0.31, 0.35, 0.52, 0.33, 0.50, 0.49],\n" +
          "})   # 閘道器重送時，同一機台同一時間點會出現第二筆，後到的才是校正後的讀數",
      },
    ],
    choices: [
      { id: "A", text: "df.drop_duplicates(subset=[\"machine\"], keep=\"last\")" },
      { id: "B", text: "df.drop_duplicates(subset=[\"machine\", \"ts\"], keep=\"last\")" },
      { id: "C", text: "df.drop_duplicates(subset=[\"machine\", \"ts\"], keep=\"first\")" },
      { id: "D", text: "df.drop_duplicates(subset=[\"ts\", \"machine\"], keep=False)" },
    ],
    answer: "B",
    explanation:
      "重複的定義是「同一機台、同一時間點」，所以 subset 要同時指定 machine 與 ts；兩筆讀數本身不同（例如 0.31 與 0.33），若不指定 subset，整列比對不會被視為重複。keep=\"last\" 保留後到的那筆，結果為 M1 10:00 的 0.33、M1 10:01 的 0.35、M2 10:00 的 0.52、M2 10:01 的 0.49。",
    choiceExplanations: {
      A: "只以 machine 判斷重複，每台機台只會剩下最後一筆，所有正常的時間點也被刪掉，整份資料只剩 2 列。",
      C: "重複的判斷正確，但 keep=\"first\" 留下的是先到、未校正的讀數（如 M1 10:00 的 0.31），與要求相反。",
      D: "subset 的欄位順序不影響判斷，但 keep=False 會把重複的那幾組整組刪除，M1 10:00 與 M2 10:01 的讀數一筆都沒留下。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["drop_duplicates", "subset 與 keep", "重送資料去重"],
      constraints: ["data"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若重送的兩筆內容完全相同，不指定 subset 也能去重；若先到的才是正確值（例如後到的是延遲抵達的舊封包），就要改成 keep=\"first\"。",
    },
  },
  {
    id: "senior-bigdata-practice-q180",
    subjectId: "senior-bigdata",
    prompt:
      "某高中整理段考成績，成績欄以文字存放，缺考者填「缺考」，另有一位老師漏填而留下空字串。以 pandas 2.x 執行下列程式後，印出的結果為何？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "scores = pd.Series([\"85\", \"90\", \"缺考\", \"\", \"70\"])\n" +
          "n = pd.to_numeric(scores, errors=\"coerce\")\n" +
          "print(n.isna().sum(), n.count(), round(n.mean(), 1))",
      },
    ],
    choices: [
      { id: "A", text: "1 4 61.2" },
      { id: "B", text: "2 3 81.7" },
      { id: "C", text: "2 5 49.0" },
      { id: "D", text: "0 5 49.0" },
    ],
    answer: "B",
    explanation:
      "pd.to_numeric(errors=\"coerce\") 會把無法解析成數字的值轉成 NaN，「缺考」與空字串都屬於這類，所以 isna().sum() 為 2。count() 只計算非缺值，剩 85、90、70 三筆；mean() 預設略過 NaN，平均為 245 ÷ 3 ≈ 81.7。",
    choiceExplanations: {
      A: "誤以為空字串會被轉成 0；實際上空字串無法解析為數字，同樣變成 NaN，平均也不會被 0 拉低到 61.2。",
      C: "缺值數正確，但 count() 只計算非缺值，不是 5；mean() 也是除以有效筆數 3，而不是除以總筆數 5 得到 49.0。",
      D: "errors=\"coerce\" 是把無法轉換的值設為 NaN，不是補成 0；缺值數因此是 2 而不是 0，平均也不是 49.0。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["to_numeric", "errors=coerce", "count 與 size", "缺值略過"],
      constraints: ["data"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若拿掉 errors=\"coerce\"，遇到「缺考」會直接拋出 ValueError；若教務規定缺考以 0 分計，則要在轉換後另外以 fillna(0) 處理，平均才會變成 49.0。",
    },
  },
  {
    id: "senior-bigdata-practice-q181",
    subjectId: "senior-bigdata",
    prompt:
      "某農會彙整各農場的收成量，kg 欄從報表匯入時帶有千分位逗號（如 \"1,250\"）而成了字串，資料如下。要把它正確轉成數值且不遺失任何一筆，下列哪一行程式碼正確（pandas 2.x）？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "df = pd.DataFrame({\"farm\": [\"F1\", \"F2\", \"F3\", \"F4\"],\n" +
          "                   \"kg\":   [\"1,250\", \"980\", \"2,034\", \"1,100\"]})",
      },
    ],
    choices: [
      { id: "A", text: "df[\"kg\"].str.replace(\",\", \"\").astype(float)" },
      { id: "B", text: "df[\"kg\"].replace(\",\", \"\").astype(float)" },
      { id: "C", text: "df[\"kg\"].str.replace(\",\", \".\").astype(float)" },
      { id: "D", text: "pd.to_numeric(df[\"kg\"], errors=\"coerce\")" },
    ],
    answer: "A",
    explanation:
      "str.replace 會替換每個字串中的子字串，把逗號移除後 \"1,250\" 變成 \"1250\"，再以 astype(float) 轉型，得到 [1250.0, 980.0, 2034.0, 1100.0]。",
    choiceExplanations: {
      B: "Series.replace 預設比對整個儲存格的值，只有內容恰好是逗號的儲存格才會被換掉；逗號仍留在字串中，astype(float) 拋出 ValueError。",
      C: "把逗號換成小數點，\"1,250\" 會變成 1.25，數值差了一千倍卻不會報錯，是最難察覺的一種錯誤。",
      D: "to_numeric 無法解析含逗號的字串，errors=\"coerce\" 會把這三筆悄悄轉成 NaN，只剩 980 一筆有值，資料遺失卻不報錯。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["str.replace", "型別轉換", "千分位符號"],
      constraints: ["data"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Correct in Different Context",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若資料來自以逗號為小數點的歐洲格式報表，換成小數點才是對的；若是以 pd.read_csv 讀檔，也可以直接指定 thousands=\",\" 在讀入時處理。",
    },
  },
  {
    id: "senior-bigdata-practice-q182",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行以 scikit-learn 1.5 建立信用違約模型，所得欄位約 15% 缺值。下列程式依序補值、切分、訓練，測得準確率如下。檢視這個流程後，下列哪一種修改最恰當？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import pandas as pd\n" +
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.model_selection import train_test_split\n" +
          "\n" +
          "rng = np.random.default_rng(0)\n" +
          "df = pd.DataFrame({\"income\": rng.lognormal(10.5, 0.6, 400).round(0),\n" +
          "                   \"debt_ratio\": rng.uniform(0, 1, 400).round(2)})\n" +
          "df[\"default\"] = (df[\"debt_ratio\"] + rng.normal(0, 0.2, 400) > 0.8).astype(int)\n" +
          "df.loc[rng.choice(400, 60, replace=False), \"income\"] = np.nan\n" +
          "\n" +
          "df[\"income\"] = df[\"income\"].fillna(df[\"income\"].median())     # 步驟 1：補值\n" +
          "X, y = df[[\"income\", \"debt_ratio\"]], df[\"default\"]\n" +
          "X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=42)  # 步驟 2\n" +
          "model = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)     # 步驟 3\n" +
          "print(round(model.score(X_te, y_te), 3))",
      },
      {
        kind: "output",
        caption: "輸出結果：",
        content: "0.86",
      },
    ],
    choices: [
      { id: "A", text: "先切分，再以 Pipeline 包住 SimpleImputer 與模型，只用訓練集的中位數補值" },
      { id: "B", text: "先切分，訓練集與測試集各自以自己的中位數補值，讓兩邊的統計量互相獨立、不受對方的資料影響" },
      { id: "C", text: "流程維持不變，只把中位數改成平均數，讓補值能完整反映全部 400 位客戶的平均所得水準" },
      { id: "D", text: "直接刪除所得缺值的 60 列，再進行切分與訓練，徹底避免補值步驟在前處理中造成的資訊洩漏" },
    ],
    answer: "A",
    explanation:
      "步驟 1 用全部 400 列的中位數補值，等於讓 100 列測試資料參與了前處理，屬於資料洩漏：測試集不再是模型完全沒看過的資料，0.86 不能代表上線後的表現。正確做法是先切分，補值器只在訓練集上 fit 出中位數，再用同一個值轉換測試集與日後上線的每一筆申請件；放進 Pipeline 能確保交叉驗證時每一折都只用該折的訓練資料計算統計量，也能直接對單筆缺所得的新申請件預測。",
    choiceExplanations: {
      B: "測試集用自己的中位數，仍讓測試資料的統計量參與前處理；上線時一次只來一筆申請件，根本算不出「測試集的中位數」，流程無法部署。",
      C: "平均數同樣是用全部 400 列計算，洩漏的問題原封不動；所得通常右偏，平均數還更容易被少數高所得者拉高。",
      D: "刪除會丟掉約 15% 的樣本，若缺值並非完全隨機還會引入偏誤；而且模型上線後遇到缺所得的申請件，無法輸出任何預測。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料洩漏", "SimpleImputer", "Pipeline", "缺值補法"],
      constraints: ["data"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若補值用的是不依賴資料分布的固定規則（例如缺值一律補 0 並另加缺值指標欄），先補值再切分就不構成洩漏；只有從資料估計統計量的補值，才必須只在訓練集上 fit。",
    },
  },
  {
    id: "senior-bigdata-practice-q183",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行整併各分行的會員資料時，懷疑同一位客戶在不同分行重複開立會員（以身分證號 id_no 判斷），資料工程師寫了下列函式（pandas 2.x）。請問 flag_dup(df) 回傳的內容為何？",
    figures: [
      {
        kind: "table",
        caption: "會員資料 df：",
        content:
          "   member_id id_no branch\n" +
          "0        101  A123     台北\n" +
          "1        102  B456     台中\n" +
          "2        103  A123     高雄\n" +
          "3        104  C789     台北\n" +
          "4        105  B456     台中\n" +
          "5        106  A123     台南",
      },
      {
        kind: "code",
        content:
          "def flag_dup(df):\n" +
          "    mask = df.duplicated(subset=[\"id_no\"], keep=False)\n" +
          "    return df.loc[mask].sort_values(\"id_no\")",
      },
    ],
    choices: [
      { id: "A", text: "同一身分證號第二次以後出現的列，第一次出現的那列不會被列入" },
      { id: "B", text: "依身分證號去除重複後的名單，每個身分證號各保留其中一列" },
      { id: "C", text: "身分證號出現兩次以上的所有列，連同第一次出現的列一併列出" },
      { id: "D", text: "所有欄位值都完全相同的列，只要分行不同就不會被列入其中" },
    ],
    answer: "C",
    explanation:
      "duplicated() 回傳一個布林遮罩，subset=['id_no'] 表示只以身分證號判斷是否重複；keep=False 則是把「所有」重複者都標為 True，不保留任何一筆當作正本。以附表為例，A123 的三列（101、103、106）與 B456 的兩列（102、105）共 5 列會被選出，只有 C789 不在其中，最後再依 id_no 排序，方便人工逐組比對。這正是「找出所有疑似重複開戶的紀錄」所需要的結果。",
    choiceExplanations: {
      A: "這是 keep 預設值 'first' 的行為：第一次出現者被視為正本、標為 False，只會選出 103、105、106 三列。本題明確寫了 keep=False，所以 101、102 也會被選出。",
      B: "去重後的名單是 drop_duplicates(subset=['id_no']) 的結果（101、102、104）。duplicated 只產生遮罩，df.loc[mask] 選出的是被標記為重複的列，C789 根本不會出現。",
      D: "不指定 subset 時 duplicated 才會比對整列；本題 subset=['id_no'] 只看身分證號，因此分行不同的 A123 三列仍然全部被選出。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["duplicated", "keep 參數", "重複資料偵測"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把 keep=False 改回預設的 keep='first'，結果就只剩第二次以後出現的 3 列；若再拿掉 subset，則要整列完全相同才算重複，本表一列也選不出來。",
    },
  },
  {
    id: "senior-bigdata-practice-q184",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院整理初診問卷 intake.csv（pandas 2.x），讀入後檢查各欄型別，輸出如下。關於後續的資料清理，下列敘述哪些正確？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "\n" +
          "df = pd.read_csv(\"intake.csv\")\n" +
          "print(df.dtypes)",
      },
      {
        kind: "output",
        content:
          "patient_id      int64\n" +
          "age            object\n" +
          "blood          object\n" +
          "visits        float64\n" +
          "dtype: object",
      },
      {
        kind: "note",
        content:
          "① df[\"age\"].astype(int) 會拋出 ValueError，因為欄位中有「未填」這類無法轉成整數的字串\n" +
          "② pd.to_numeric(df[\"age\"], errors=\"coerce\") 會把「未填」轉成 NaN，回傳 float64 的 Series\n" +
          "③ 直接呼叫 df[\"age\"].mean() 時，pandas 會略過「未填」，回傳其餘數值的平均\n" +
          "④ visits 為 float64，代表原始檔裡有帶小數的就診次數，應先四捨五入再分析\n" +
          "⑤ 對上萬筆、只有 A／B／O／AB 四種值的 blood 欄，astype(\"category\") 可明顯降低記憶體用量",
      },
    ],
    choices: [
      { id: "A", text: "①②⑤" },
      { id: "B", text: "①②③" },
      { id: "C", text: "②④⑤" },
      { id: "D", text: "①③④" },
    ],
    answer: "A",
    explanation:
      "① 正確：age 欄混入「未填」而被讀成 object，astype(int) 遇到無法解析的字串會直接拋出 ValueError。② 正確：to_numeric 搭配 errors='coerce' 會把無法轉換的值變成 NaN，而 NaN 只能存在浮點欄位，所以結果是 float64。⑤ 正確：category 只存一份類別字典加上整數代碼，重複值越多省得越多（兩萬筆、四種值實測可省九成以上）。③ 錯：object 欄位的 mean() 不會自動略過字串，pandas 2.x 會把字串串接後嘗試轉成數值而拋出 TypeError。④ 錯：visits 變成 float64 是因為有一格空白被讀成 NaN，int64 無法存放 NaN 才升級成浮點；原始資料其實全是整數。故選 ①②⑤。",
    choiceExplanations: {
      B: "含 ③。object 欄位上的 mean() 不會略過「未填」，而是拋出 TypeError；要先用 to_numeric 轉型，NaN 才會在計算時被略過。",
      C: "含 ④。visits 只是因為一格空白被讀成 NaN 才升級成 float64，數值本身全是整數；四捨五入解決不了問題，該處理的是缺值，或改用可空整數型別 Int64。",
      D: "③ 與 ④ 都是錯的：object 欄位的 mean() 會拋出 TypeError，而 visits 是因缺值才成為 float64，並非真的有小數。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["dtype", "astype", "to_numeric", "缺值與型別升級", "category 型別"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若 visits 欄沒有任何空格，read_csv 就會讀成 int64；若 age 先經 to_numeric(errors='coerce') 轉型，mean() 就會略過 NaN 正常回傳平均——③ 只在轉型之後才成立。",
    },
  },
  {
    id: "senior-bigdata-practice-q185",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠彙整機台巡檢紀錄，想為每筆紀錄標記異常旗標，預期輸出為 M1 ['過熱']、M2 ['振動']、M3 []，實際執行結果卻如下（Python 3.12）。請問造成此結果的原因與最適當的修正為何？",
    figures: [
      {
        kind: "code",
        content:
          "def add_flag(record, flags=[]):\n" +
          "    if record[\"temp\"] > 80:\n" +
          "        flags.append(\"過熱\")\n" +
          "    if record[\"vib\"] > 5:\n" +
          "        flags.append(\"振動\")\n" +
          "    record[\"flags\"] = flags\n" +
          "    return record\n" +
          "\n" +
          "logs = [{\"id\": \"M1\", \"temp\": 85, \"vib\": 3},\n" +
          "        {\"id\": \"M2\", \"temp\": 70, \"vib\": 6},\n" +
          "        {\"id\": \"M3\", \"temp\": 65, \"vib\": 2}]\n" +
          "cleaned = [add_flag(dict(r)) for r in logs]\n" +
          "for r in cleaned:\n" +
          "    print(r[\"id\"], r[\"flags\"])",
      },
      {
        kind: "output",
        content:
          "M1 ['過熱', '振動']\n" +
          "M2 ['過熱', '振動']\n" +
          "M3 ['過熱', '振動']",
      },
    ],
    choices: [
      { id: "A", text: "把 record[\"flags\"] = flags 改寫為 flags.copy()，讓每筆紀錄各自持有一份清單" },
      { id: "B", text: "把預設值改成 flags=None，並在函式開頭以 if flags is None: flags = [] 建立新清單" },
      { id: "C", text: "把預設值改成 flags=list()，讓每次呼叫函式時都會重新建立一個新的空清單" },
      { id: "D", text: "把 dict(r) 改成 copy.deepcopy(r)，避免多筆紀錄在處理時共用同一個字典物件" },
    ],
    answer: "B",
    explanation:
      "Python 的預設參數值只在 def 執行時求值一次，flags=[] 這個清單物件會被之後每一次「沒有傳入 flags」的呼叫共用。M1 呼叫時加入「過熱」，M2 再把「振動」加進同一個清單，而三筆紀錄的 flags 都指向這個物件，所以最後印出來全是 ['過熱', '振動']。正確作法是以 None 當哨兵值，在函式內部每次建立新清單；修正後的輸出正是預期的 M1 ['過熱']、M2 ['振動']、M3 []。",
    choiceExplanations: {
      A: "copy 只讓每筆紀錄拿到當下的快照，預設清單本身仍在每次呼叫時累積，結果變成 M1 ['過熱']、M2 ['過熱', '振動']、M3 ['過熱', '振動']，後面的紀錄依然帶著前面的旗標。",
      C: "list() 與 [] 一樣只在 def 執行時求值一次，預設值仍是同一個清單物件，輸出與原本完全相同。",
      D: "被共用的不是紀錄字典（dict(r) 已經各複製一份），而是預設參數的那個清單；改用 deepcopy 後輸出與原本相同。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["可變預設參數", "物件參照", "資料清理函式"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若每次呼叫都明確傳入新清單，例如 add_flag(dict(r), [])，即使不改函式也不會出錯；問題只出在依賴可變物件當預設值，而且呼叫端省略了這個參數。",
    },
  },
  {
    id: "senior-bigdata-practice-q186",
    subjectId: "senior-bigdata",
    prompt:
      "某補習班把模擬考成績表讀入 pandas（2.x）後，想計算全班平均，先檢查 score 欄，輸出如下。下列判斷與下一步何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "print(df[\"score\"].describe())\n" +
          "print(df.dtypes)",
      },
      {
        kind: "output",
        content:
          "count      8\n" +
          "unique     7\n" +
          "top       85\n" +
          "freq       2\n" +
          "Name: score, dtype: object\n" +
          "student    object\n" +
          "score      object\n" +
          "dtype: object",
      },
    ],
    choices: [
      { id: "A", text: "top 為 85，表示全班的平均分數為 85 分，可以直接拿來和上次模考比較" },
      { id: "B", text: "unique 為 7，表示有 7 位學生重複填答成績，應先以 drop_duplicates 去重" },
      { id: "C", text: "score 被讀成字串，應先以 to_numeric 搭配 coerce 轉型並檢視轉不出來的值" },
      { id: "D", text: "count 為 8 表示沒有缺考，可以直接用 astype(int) 轉成整數後再計算平均" },
    ],
    answer: "C",
    explanation:
      "describe() 印出的是 count／unique／top／freq，而不是 mean／std／分位數，這就是欄位為 object（字串）的訊號，dtypes 也證實 score 是 object。字串欄位不能直接算平均，應先以 pd.to_numeric(df['score'], errors='coerce') 轉成數值，再把轉成 NaN 的原始值列出來檢查：本例會揪出「缺考」，而尾端多一個空白的「90 」則能正常轉成 90。處理完後 7 位有成績的學生平均為 84 分。",
    choiceExplanations: {
      A: "字串欄位的 top 是出現最多次的值（眾數），freq=2 是它出現的次數，與平均無關；轉成數值後的平均其實是 84 分。",
      B: "unique 是相異值的個數，8 筆中有 7 種不同的字串只代表有一個分數（85）出現兩次；8 位學生各不相同，沒有任何重複的列。",
      D: "object 欄位的 count 只計算非缺值的字串，「缺考」也算一筆；直接 astype(int) 會因「缺考」拋出 ValueError。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["object 型別", "describe", "to_numeric", "資料型別檢查"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若 describe() 印出的是 mean、std、25%／50%／75%，就代表欄位已是數值型別，可以直接計算；只有看到 unique／top／freq 時才需要先轉型。",
    },
  },
  {
    id: "senior-bigdata-practice-q187",
    subjectId: "senior-bigdata",
    prompt:
      "某農業試驗所把 50 塊試驗田的每公頃產量（公噸）整理在 df（共 50 列），執行下列程式（pandas 2.x），輸出如下。關於這份摘要，下列敘述哪些正確？",
    figures: [
      {
        kind: "code",
        content: "print(df[\"yield_t\"].describe().round(2))",
      },
      {
        kind: "output",
        content:
          "count    47.00\n" +
          "mean      5.43\n" +
          "std       1.78\n" +
          "min       2.20\n" +
          "25%       4.10\n" +
          "50%       5.12\n" +
          "75%       6.36\n" +
          "max       9.84\n" +
          "Name: yield_t, dtype: float64",
      },
      {
        kind: "note",
        content:
          "① 平均數大於中位數，顯示產量分布有右偏的長尾\n" +
          "② count 為 47，表示 50 塊田中有 3 筆缺值，mean 是以 47 筆計算\n" +
          "③ std 是以 n 為分母計算的母體標準差，樣本小時會偏低\n" +
          "④ 依 Tukey 圍籬，max 已超過 Q3 + 1.5 × IQR，至少有一塊田屬於高產量離群值\n" +
          "⑤ 75% 與 25% 兩列相減得到的 2.26，就是這份資料的全距",
      },
    ],
    choices: [
      { id: "A", text: "①③④" },
      { id: "B", text: "②④⑤" },
      { id: "C", text: "①②⑤" },
      { id: "D", text: "①②④" },
    ],
    answer: "D",
    explanation:
      "① 正確：mean 5.43 大於 50%（中位數）5.12，少數高產量田把平均往上拉，是右偏的典型訊號。② 正確：describe() 的 count 只計非缺值，50 列只有 47 筆，代表有 3 筆缺值；mean、std 等統計量預設都會略過 NaN。④ 正確：IQR = 6.36 − 4.10 = 2.26，上圍籬 = 6.36 + 1.5 × 2.26 = 9.75，max 9.84 已超過，至少有一筆離群值。③ 錯：pandas 的 std() 預設 ddof=1，是以 n−1 為分母的樣本標準差。⑤ 錯：Q3 − Q1 是四分位距（IQR），全距是 max − min = 7.64。故選 ①②④。",
    choiceExplanations: {
      A: "含 ③。pandas 的 std() 預設 ddof=1，分母是 n−1，屬於樣本標準差；以 n 為分母的是 NumPy np.std 的預設。",
      B: "含 ⑤。2.26 是四分位距 IQR（Q3 − Q1），全距要用 max − min，本例為 9.84 − 2.20 = 7.64。",
      C: "含 ⑤ 而漏了 ④。2.26 是四分位距而非全距；用這個 IQR 算出的上圍籬 9.75 正好低於 max 9.84，所以 ④ 其實成立。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["describe", "偏態", "四分位距", "Tukey 圍籬", "樣本標準差"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Terminology Swap",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若 max 只有 9.70，就落在上圍籬 9.75 之內，④ 便不成立；判斷離群一律要先算出 Q3 + 1.5 × IQR 再比較，不能只憑 max 看起來很大。",
    },
  },
  {
    id: "senior-bigdata-practice-q188",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行分析 1,000 筆信用卡單筆消費金額（元），執行下列程式（pandas 2.x、NumPy 2.x），輸出如下。關於這筆資料與相關 API 的行為，下列敘述哪些正確？",
    figures: [
      {
        kind: "code",
        content:
          "s = df[\"amount\"]\n" +
          "print(s.describe().round(1))\n" +
          "print(round(s.skew(), 2))",
      },
      {
        kind: "output",
        content:
          "count     1000.0\n" +
          "mean      1794.1\n" +
          "std       2396.2\n" +
          "min         47.0\n" +
          "25%        544.5\n" +
          "50%       1034.5\n" +
          "75%       2050.2\n" +
          "max      27831.0\n" +
          "Name: amount, dtype: float64\n" +
          "4.59",
      },
      {
        kind: "note",
        content:
          "① s.median() 與 s.quantile(0.5) 會得到相同的值\n" +
          "② np.var(s.to_numpy()) 與 s.var() 會得到相同的值\n" +
          "③ s.mode() 回傳的是 Series，資料有多個眾數時會全部列出\n" +
          "④ skew() 為 4.59，表示右尾很長，少數大額消費把平均拉到中位數之上\n" +
          "⑤ 對金額取 np.log1p 後再算 skew()，偏態係數通常會變得比 4.59 更大",
      },
    ],
    choices: [
      { id: "A", text: "①②④" },
      { id: "B", text: "①③④" },
      { id: "C", text: "②③⑤" },
      { id: "D", text: "③④⑤" },
    ],
    answer: "B",
    explanation:
      "① 正確：中位數就是第 50 百分位數，quantile(0.5) 在預設的線性內插下與 median() 相同。③ 正確：眾數可能不只一個，pandas 的 mode() 一律回傳 Series（例如 [1, 1, 2, 2, 3] 會回傳 1 與 2）。④ 正確：偏態 4.59 遠大於 0，平均 1,794.1 也明顯高於中位數 1,034.5，是消費金額常見的右偏長尾。② 錯：NumPy 的 var 預設 ddof=0（除以 n），pandas 的 var 預設 ddof=1（除以 n−1），兩者會有些微差異。⑤ 錯：對數轉換會壓縮大值，是降低右偏的常用手法，本例取 log1p 後偏態約降到 0.05。故選 ①③④。",
    choiceExplanations: {
      A: "含 ②。np.var 預設以 n 為分母、Series.var 預設以 n−1 為分母，本例兩者分別約為 5,736,141 與 5,741,883，並不相同；要一致須寫 np.var(..., ddof=1)。",
      C: "含 ② 與 ⑤。除了 ddof 的預設不同之外，對數轉換是用來減輕右偏的，log1p 後偏態會下降到接近 0，而不是變大。",
      D: "含 ⑤。對數會把大額消費壓縮得比小額多，偏態因而下降（本例由 4.59 降到約 0.05），不會變得更大。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["偏態", "ddof", "眾數", "對數轉換"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若改寫成 np.var(s.to_numpy(), ddof=1) 或 s.var(ddof=0)，② 就會成立；兩個函式庫的差別只在預設的自由度。",
    },
  },
  {
    id: "senior-bigdata-practice-q189",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院想找出住院天數異常的個案送交病歷審查，以 z 分數絕對值大於 3 為標準，但明顯偏長的 40 天、45 天卻沒有被標出，程式與執行結果如下（pandas 2.x、scikit-learn 1.5）。請問問題出在哪裡，又該如何修正最恰當？",
    figures: [
      {
        kind: "code",
        content:
          "days = df[\"los_days\"]\n" +
          "z = (days - days.mean()) / days.std()\n" +
          "print(round(days.mean(), 2), round(days.std(), 2))\n" +
          "print(\"flagged:\", days[z.abs() > 3].tolist())",
      },
      {
        kind: "output",
        content:
          "11.0 14.85\n" +
          "flagged: []",
      },
      {
        kind: "note",
        content: "los_days 共 12 筆：2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 40, 45",
      },
    ],
    choices: [
      { id: "A", text: "把門檻由 3 降為 2，讓較溫和的極端值也能被 z 分數標出" },
      { id: "B", text: "先以 clip 把住院天數壓到 99 百分位，再沿用 z 分數判斷" },
      { id: "C", text: "改用不受極端值牽動的四分位距，標出超過上圍籬的個案" },
      { id: "D", text: "改用 StandardScaler 先標準化天數，再以絕對值大於 3 判定" },
    ],
    answer: "C",
    explanation:
      "z 分數所用的平均與標準差本身就會被離群值拉大：這 12 筆資料中，40、45 兩筆把平均拉到 11.0、標準差撐到 14.85，45 天的 z 也只有約 2.29，這就是「遮蔽效應」（masking），樣本少、離群值又不只一個時特別明顯。四分位數只看排序位置，不受極端值的大小影響：Q1 = 3.75、Q3 = 7.25、IQR = 3.5，上圍籬 Q3 + 1.5 × IQR = 12.5，40 與 45 天都被標出，其餘 10 筆都不受影響。住院天數本來就右偏，以 IQR 或中位數為基礎的穩健方法比 z 分數更合適。",
    choiceExplanations: {
      A: "門檻降為 2 只會抓到 z ≈ 2.29 的 45 天，40 天（z ≈ 1.95）仍被遮蔽；根本原因是平均與標準差被拉偏，調門檻只是在被汙染的尺度上挪動刻度。",
      B: "clip 是把值壓到上限的修整（winsorizing）手法，屬於處置而不是偵測；本例 99 百分位約 44.45，壓完再算 z 仍一筆都沒有超過 3。",
      D: "StandardScaler 做的就是同一種 z 分數，只是改以 n 為分母（ddof=0），45 天的值約 2.39，仍沒有超過 3，問題完全沒有改變。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["z 分數", "遮蔽效應", "四分位距", "穩健統計", "離群值偵測"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若樣本有上千筆且只有零星幾個極端值，平均與標準差被拉偏的幅度很小，z 分數法就堪用；樣本少或右偏明顯時，才必須改用 IQR 或中位數絕對偏差這類穩健方法。",
    },
  },
  {
    id: "senior-bigdata-practice-q190",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠記錄 60 天的每日產品缺陷數，原打算以 Poisson 分布估計「單日零缺陷」的機率，先執行下列程式檢查（scipy 1.14），輸出如下：第一行為樣本平均與變異數，第二行為實際零缺陷天數的比例與 Poisson 的預測值。下列判斷何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "from scipy import stats\n" +
          "\n" +
          "s = df[\"defects\"]\n" +
          "print(round(s.mean(), 2), round(s.var(), 2))\n" +
          "print(round((s == 0).mean(), 3), round(stats.poisson.pmf(0, s.mean()), 3))",
      },
      {
        kind: "output",
        content:
          "3.27 10.67\n" +
          "0.217 0.038",
      },
    ],
    choices: [
      { id: "A", text: "變異數約為平均的 3 倍且零缺陷天數遠多於預測，屬過度離散，宜改用負二項分布" },
      { id: "B", text: "樣本平均與變異數都大於 3，符合 Poisson 平均等於變異數的假設，可直接沿用" },
      { id: "C", text: "樣本已達 60 天，依中央極限定理可直接以常態分布描述每日的缺陷數" },
      { id: "D", text: "缺陷數屬於計數資料，應改用 binom 並以每日產量為 n 建模，才能吸收變異" },
    ],
    answer: "A",
    explanation:
      "Poisson 分布只有一個參數 λ，平均與變異數都等於 λ。本例變異數 10.67 約為平均 3.27 的 3.3 倍，而且實際有 21.7% 的天數零缺陷，Poisson 卻只預測 3.8%——這是「過度離散」（overdispersion）的典型樣貌，常見於缺陷成批出現（同一批原料、同一次換線）的產線。負二項分布多了一個離散參數，允許變異數大於平均，能同時描述大量的零值與偶發的高缺陷日。",
    choiceExplanations: {
      B: "Poisson 的判準是平均與變異數「接近相等」，不是兩者都大於某個數；10.67 與 3.27 差了三倍以上，正好違反這個假設。",
      C: "中央極限定理說的是「樣本平均」的抽樣分布會趨近常態，不是每日缺陷數本身；這份資料是非負、右偏的離散計數，用常態分布還會給負值正的機率。",
      D: "二項分布的變異數 np(1−p) 一定小於平均 np，比 Poisson 更無法描述變異數大於平均的資料，換用它只會讓配適更差。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["Poisson 分布", "過度離散", "負二項分布", "變異數與平均"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      crossNode: "L22101",
      decisionBoundary:
        "若樣本變異數與平均接近（例如 3.3 對 3.1），且零值比例也接近 Poisson 的預測，Poisson 就是合理又最簡潔的選擇；只有變異數明顯大於平均時才需要改用負二項。",
    },
  },
  {
    id: "senior-bigdata-practice-q191",
    subjectId: "senior-bigdata",
    prompt:
      "某校輔導室估計某班 10 位學生參加英檢的結果。假設每人通過的機率皆為 0.6 且彼此獨立，老師想求「至少 8 人通過」的機率，寫了下列程式（scipy 1.14）。請問執行後印出的值為何？",
    figures: [
      {
        kind: "code",
        content:
          "from scipy import stats\n" +
          "\n" +
          "p_at_least_8 = stats.binom.sf(8, 10, 0.6)\n" +
          "print(round(p_at_least_8, 4))",
      },
    ],
    choices: [
      { id: "A", text: "0.1673" },
      { id: "B", text: "0.1209" },
      { id: "C", text: "0.9536" },
      { id: "D", text: "0.0464" },
    ],
    answer: "D",
    explanation:
      "binom.sf(k, n, p) 是存活函數，等於 1 − cdf(k) = P(X > k)，「大於」不含 k 本身。所以 sf(8, 10, 0.6) 算的是 P(X ≥ 9) = P(9) + P(10) ≈ 0.0403 + 0.0060 = 0.0464。老師要的「至少 8 人」應寫成 sf(7, 10, 0.6) 或 1 − cdf(7, 10, 0.6)，答案才是 0.1673——這是離散分布最常見的差一錯誤，程式能跑、數字合理，卻算錯了事件。",
    choiceExplanations: {
      A: "0.1673 是老師真正想要的 P(X ≥ 8)，要寫 sf(7, 10, 0.6) 才會得到；sf(8, ...) 不包含 8 本身。",
      B: "0.1209 是恰好 8 人通過的機率 binom.pmf(8, 10, 0.6)；sf 是把大於 k 的機率全部加總，不是單點機率。",
      C: "0.9536 是累積分布 binom.cdf(8, 10, 0.6) = P(X ≤ 8)；sf 是它的補數 1 − cdf，兩者相加為 1。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["二項分布", "存活函數", "累積分布函數", "離散分布的邊界"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若變數是連續分布（例如 norm），P(X > k) 與 P(X ≥ k) 相等，sf(k) 就能直接代表「至少 k」；只有離散分布才需要把 k 減 1。",
    },
  },
  {
    id: "senior-bigdata-practice-q192",
    subjectId: "senior-bigdata",
    prompt:
      "某農改場比較新、舊兩種肥料的稻米產量（公斤／分地），舊肥料 30 塊田、新肥料 8 塊田，執行下列程式（scipy 1.14），輸出如下。下列判斷何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "from scipy import stats\n" +
          "\n" +
          "print(f\"n: {len(a)}, {len(b)}   mean: {a.mean():.2f}, {b.mean():.2f}   sd: {a.std(ddof=1):.2f}, {b.std(ddof=1):.2f}\")\n" +
          "lev = stats.levene(a, b)\n" +
          "print(f\"Levene p = {lev.pvalue:.2e}\")\n" +
          "t = stats.ttest_ind(a, b)\n" +
          "print(f\"t = {t.statistic:.3f}, p = {t.pvalue:.4f}\")",
      },
      {
        kind: "output",
        content:
          "n: 30, 8   mean: 51.87, 56.59   sd: 1.68, 9.69\n" +
          "Levene p = 1.27e-08\n" +
          "t = -2.617, p = 0.0129",
      },
    ],
    choices: [
      { id: "A", text: "t 檢定的 p = 0.0129 小於 0.05，可以直接下結論新肥料能顯著提高稻米產量" },
      { id: "B", text: "Levene 檢定顯示兩組變異數明顯不同，應改以 equal_var=False 的 Welch 檢定再判斷" },
      { id: "C", text: "兩組為同一季的田區，應改用 ttest_rel 配對 t 檢定，以消除田區之間的差異" },
      { id: "D", text: "p = 0.0129 表示虛無假設為真的機率只有 1.29%，新肥料無效的可能性非常低" },
    ],
    answer: "B",
    explanation:
      "ttest_ind 預設 equal_var=True，也就是假設兩組變異數相同、使用合併變異數。本例新肥料組的標準差 9.69 是舊肥料組 1.68 的五倍多，Levene 檢定 p = 1.27e-08 也拒絕了變異數同質；而且變異數大的那組樣本數反而少（8 對 30），這種組合會讓合併變異數低估不確定性、p 值偏小。改用 Welch t 檢定（equal_var=False）後 p 約 0.21，結論從「顯著」翻轉為「證據不足」，因此必須先處理變異數不等的問題，才能對肥料效果下結論。",
    choiceExplanations: {
      A: "這個 p 值建立在變異數相同的假設上，而 Levene 檢定已推翻這個假設；改用 Welch 檢定後 p 約 0.21，「顯著提高」的結論站不住。",
      C: "配對 t 檢定要求每一筆觀測都有一一對應的配對（例如同一塊田施用前後），本例是 30 與 8 塊不同的田，樣本數不同，ttest_rel 會直接拋出 ValueError。",
      D: "p 值是「假設虛無假設成立時，觀察到至少這麼極端結果的機率」，不是虛無假設為真的機率；何況這個 p 值本身就建立在錯誤的等變異數假設上。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["獨立樣本 t 檢定", "變異數同質性", "Welch t 檢定", "p 值解讀"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若兩組樣本數相同且 Levene 檢定不顯著，Student t 與 Welch t 的結果會非常接近，沿用預設的 equal_var=True 也不影響結論。",
    },
  },
  {
    id: "senior-bigdata-practice-q193",
    subjectId: "senior-bigdata",
    prompt:
      "某發卡銀行以 200 位持卡人的資料，用 statsmodels（0.14）建立月刷卡金額（spend，千元）對月收入（income，千元）與年齡（age，歲）的迴歸，輸出如下。下列解讀何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import statsmodels.formula.api as smf\n" +
          "\n" +
          "res = smf.ols(\"spend ~ income + age\", data=df).fit()\n" +
          "print(f\"R-squared: {res.rsquared:.3f}   n = {int(res.nobs)}\")\n" +
          "print(res.summary().tables[1])",
      },
      {
        kind: "output",
        content:
          "R-squared: 0.584   n = 200\n" +
          "==============================================================================\n" +
          "                 coef    std err          t      P>|t|      [0.025      0.975]\n" +
          "------------------------------------------------------------------------------\n" +
          "Intercept      4.7530      1.441      3.299      0.001       1.912       7.594\n" +
          "income         0.2980      0.018     16.291      0.000       0.262       0.334\n" +
          "age            0.0323      0.023      1.375      0.171      -0.014       0.079\n" +
          "==============================================================================",
      },
    ],
    choices: [
      { id: "A", text: "R-squared 為 0.584，表示模型對約 58% 的持卡人能準確預測出其刷卡金額" },
      { id: "B", text: "age 的 P>|t| 為 0.171，證明年齡對刷卡金額沒有任何影響，應從資料中刪除" },
      { id: "C", text: "income 的 t 值為 16.291，表示月收入每多 1 千元，月刷卡金額約多 16.3 千元" },
      { id: "D", text: "在年齡不變的情況下，月收入每多 1 千元，月刷卡金額平均約多 0.30 千元" },
    ],
    answer: "D",
    explanation:
      "多元迴歸的係數是「偏迴歸係數」：在模型中其他自變數維持不變時，該變數增加一個單位，依變數的期望值變化多少。income 的 coef 為 0.2980，標準誤 0.018、P>|t| 為 0.000，信賴區間 [0.262, 0.334] 不含 0，因此可解讀為「年齡相同時，月收入每多 1 千元，月刷卡金額平均約多 0.30 千元」。注意這是平均意義下的關聯，觀察性資料不足以證明因果。",
    choiceExplanations: {
      A: "R² 是依變數的變異中被模型解釋的比例，不是「預測正確的人數比例」；實際上幾乎沒有任何一位持卡人的預測值與實際值完全相同。",
      B: "不顯著只代表這份資料的證據不足以拒絕係數為 0，不代表沒有影響；age 的信賴區間 [−0.014, 0.079] 也涵蓋了正的效果。是否保留應視研究目的與領域知識，而非只看 p 值。",
      C: "16.291 是 t 統計量，等於係數除以標準誤（0.2980 ÷ 0.018），用來檢定係數是否為 0；效果大小要看 coef 欄的 0.2980。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["偏迴歸係數", "OLS summary", "t 統計量", "R 平方", "p 值解讀"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若模型只放 income 一個自變數，係數就是「不控制年齡」的總關聯，解讀時不必加上「在年齡不變的情況下」；當自變數彼此相關時，兩種模型的係數會不同。",
    },
  },
  {
    id: "senior-bigdata-practice-q194",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院研究體重與收縮壓（sbp）的關係，同時放入門診量測的體重（weight_clinic）與病人在問卷自填的體重（weight_self）建立 OLS 迴歸（statsmodels 0.14），輸出如下。下列判斷與處置何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import statsmodels.api as sm\n" +
          "from statsmodels.stats.outliers_influence import variance_inflation_factor\n" +
          "\n" +
          "X = sm.add_constant(df[[\"weight_clinic\", \"weight_self\"]])\n" +
          "res = sm.OLS(df[\"sbp\"], X).fit()\n" +
          "print(f\"R-squared: {res.rsquared:.3f}   Prob (F-statistic): {res.f_pvalue:.2e}\")\n" +
          "print(res.summary().tables[1])\n" +
          "print(\"VIF:\", [round(float(variance_inflation_factor(X.values, i)), 1) for i in (1, 2)])",
      },
      {
        kind: "output",
        content:
          "R-squared: 0.375   Prob (F-statistic): 1.38e-08\n" +
          "=================================================================================\n" +
          "                    coef    std err          t      P>|t|      [0.025      0.975]\n" +
          "---------------------------------------------------------------------------------\n" +
          "const            75.2137      6.756     11.133      0.000      61.761      88.667\n" +
          "weight_clinic     0.7158      0.840      0.852      0.397      -0.956       2.388\n" +
          "weight_self      -0.0799      0.833     -0.096      0.924      -1.739       1.579\n" +
          "=================================================================================\n" +
          "VIF: [80.6, 80.6]",
      },
    ],
    choices: [
      { id: "A", text: "兩個體重欄位高度共線，VIF 約 80 使標準誤被放大，宜只保留其中一欄再估計" },
      { id: "B", text: "兩個係數的 P>|t| 都大於 0.05，表示體重與收縮壓無關，可把兩欄一併移除" },
      { id: "C", text: "weight_self 的係數為負，表示病人自填的體重越高，收縮壓反而會越低" },
      { id: "D", text: "R-squared 只有 0.375，表示模型無效，應先加入更多特徵才能判讀係數" },
    ],
    answer: "A",
    explanation:
      "整體 F 檢定 p = 1.38e-08 極顯著，代表兩個體重欄位「合起來」對收縮壓有解釋力，但個別係數卻都不顯著、標準誤高達 0.84——這種「整體顯著、個別不顯著」的矛盾正是多重共線性的典型症狀。兩欄量的是同一件事（相關係數超過 0.98），VIF 約 80，遠超過常用的 10 的警戒值，模型無法分辨效果該歸給哪一欄，係數因而極不穩定。只保留量測較準的 weight_clinic 後，係數的標準誤縮小到原本的五分之一以下且高度顯著，R² 幾乎不變。",
    choiceExplanations: {
      B: "個別 t 檢定不顯著是共線性把標準誤撐大造成的；整體 F 檢定 p = 1.38e-08 已顯示體重與收縮壓有關，只保留一欄後係數即高度顯著。",
      C: "共線時個別係數的正負號並不可靠，負號只是兩欄互相抵銷的結果；weight_self 單獨放入模型時係數為正且顯著。",
      D: "R² 0.375 不算高，但 F 檢定顯示模型有解釋力；問題在於兩個自變數重複，加入更多特徵既不能降低它們之間的 VIF，也無法讓係數變穩定。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["多重共線性", "VIF", "F 檢定", "OLS summary"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若兩個自變數的 VIF 都在 5 以下、個別係數也顯著，就不需要刪欄；只有在「整體顯著、個別不顯著」且 VIF 偏高時，才該合併或刪除重複的變數。",
    },
  },
  {
    id: "senior-bigdata-practice-q195",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠以機台溫度（temp，°C）預測每小時耗電量（kwh）。工程師用 statsmodels（0.14）得到 R-squared 0.989，覺得好得不尋常，於是用 scikit-learn（1.5）重跑一次，程式與輸出如下。請問問題出在哪裡，又該如何修正最恰當？",
    figures: [
      {
        kind: "code",
        content:
          "import statsmodels.api as sm\n" +
          "from sklearn.linear_model import LinearRegression\n" +
          "\n" +
          "res = sm.OLS(df[\"kwh\"], df[[\"temp\"]]).fit()\n" +
          "print(f\"statsmodels: slope = {res.params['temp']:.3f}, R-squared = {res.rsquared:.3f}\")\n" +
          "lr = LinearRegression().fit(df[[\"temp\"]], df[\"kwh\"])\n" +
          "print(f\"sklearn:     slope = {lr.coef_[0]:.3f}, R-squared = {lr.score(df[['temp']], df['kwh']):.3f}\")",
      },
      {
        kind: "output",
        content:
          "statsmodels: slope = 5.933, R-squared = 0.989\n" +
          "sklearn:     slope = 2.487, R-squared = 0.869",
      },
    ],
    choices: [
      { id: "A", text: "把引數順序改成 sm.OLS(df[[\"temp\"]], df[\"kwh\"])，與 sklearn 的 fit(X, y) 寫法一致" },
      { id: "B", text: "以 sm.add_constant(df[[\"temp\"]]) 加入截距欄後再配適，使模型設定與 sklearn 一致" },
      { id: "C", text: "改寫成公式 smf.ols(\"kwh ~ temp - 1\", data=df)，交由公式介面自動處理截距項" },
      { id: "D", text: "改看 res.rsquared_adj，以調整後 R 平方扣除自由度造成的高估，斜率則可沿用" },
    ],
    answer: "B",
    explanation:
      "sm.OLS 的陣列介面不會自動加入截距，只放 temp 等於強迫迴歸線通過原點。耗電量其實有約 120 kWh 的基礎負載，迴歸線被迫穿過原點，只能把斜率拉高到 5.933 來彌補；而無截距模型的 R² 是「未中心化」的（以 Σy² 為分母，而不是 Σ(y − ȳ)²），數值自然偏高到 0.989。scikit-learn 的 LinearRegression 預設 fit_intercept=True，所以得到斜率 2.487、R² 0.869。用 sm.add_constant 加入常數欄後，statsmodels 的結果就與 sklearn 完全一致。",
    choiceExplanations: {
      A: "statsmodels 的引數順序本來就是 OLS(endog, exog)，也就是 (y, X)，與 sklearn 的 fit(X, y) 相反；對調後變成用耗電量預測溫度，斜率約 0.167，完全答非所問。",
      C: "公式中的「- 1」正是移除截距的寫法，結果與原本的錯誤模型相同；公式介面要在不寫「- 1」時才會自動加入截距。",
      D: "調整後 R² 只針對自變數個數做懲罰，仍建立在未中心化的基礎上（本例約 0.989），而且斜率 5.933 的偏誤完全沒有被修正。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["截距項", "add_constant", "未中心化 R 平方", "OLS 引數順序"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若改用 smf.ols(\"kwh ~ temp\", data=df)，公式介面會自動加入截距，不需要 add_constant；只有直接使用 sm.OLS 的陣列介面時，才要自己補上常數欄。",
    },
  },
  {
    id: "senior-bigdata-practice-q196",
    subjectId: "senior-bigdata",
    prompt:
      "某校分析學生每週讀書時數（hours）與缺課次數（absences）對模考成績（score）的影響，以 statsmodels（0.14）建立迴歸並預測一位新同學的成績。第一個 print 的輸出如下，請問最後一行 print(res.predict(new)) 執行的結果為何？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "import statsmodels.api as sm\n" +
          "\n" +
          "df = pd.DataFrame({\"hours\": [2, 4, 5, 7, 8, 10],\n" +
          "                   \"absences\": [5, 3, 4, 1, 2, 0]})\n" +
          "df[\"score\"] = 40 + 5 * df[\"hours\"] - 2 * df[\"absences\"]\n" +
          "X = sm.add_constant(df[[\"hours\", \"absences\"]])\n" +
          "res = sm.OLS(df[\"score\"], X).fit()\n" +
          "print(res.params.round(2).to_dict())\n" +
          "new = pd.DataFrame({\"hours\": [6], \"absences\": [3]})\n" +
          "print(res.predict(new))",
      },
      {
        kind: "output",
        caption: "第一個 print 的輸出：",
        content: "{'const': 40.0, 'hours': 5.0, 'absences': -2.0}",
      },
    ],
    choices: [
      { id: "A", text: "印出 64.0，predict 會依欄位名稱自動補上截距後再計算預測值" },
      { id: "B", text: "印出 24.0，缺少的截距欄會被當成 0，只計算兩個斜率的貢獻" },
      { id: "C", text: "印出 255.0，兩欄會依位置對上前兩個係數 const 與 hours" },
      { id: "D", text: "拋出 ValueError，因為 new 只有 2 欄，而模型有 3 個係數" },
    ],
    answer: "D",
    explanation:
      "以 sm.OLS 陣列介面建立的模型，predict 只做矩陣乘法 exog @ params，不會替新資料補常數欄。res.params 有 const、hours、absences 三個係數，new 卻只有 hours、absences 兩欄，形狀 (1, 2) 與 (3,) 無法相乘，因此拋出 ValueError（shapes not aligned）。正確寫法是 res.predict(sm.add_constant(new, has_constant=\"add\"))，才會得到 40 + 5×6 − 2×3 = 64.0；單列資料必須寫 has_constant=\"add\"，否則 add_constant 會因每一欄都只有一個值、被視為已含常數而略過不加。",
    choiceExplanations: {
      A: "64.0 是補上截距後才會得到的值；陣列介面的 predict 不會自動補常數欄，只有用公式介面 smf.ols 建立的模型才會依公式自動產生截距。",
      B: "statsmodels 不會把缺少的欄位當成 0；係數與欄位數量不符時，矩陣乘法在計算前就失敗了，24.0 不會被印出。",
      C: "若真的依位置相乘會得到 40×6 + 5×3 = 255，但 NumPy 的矩陣乘法要求維度完全吻合，2 欄對 3 個係數會直接拋出例外，而不是只取前兩個。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["statsmodels predict", "add_constant", "截距項", "矩陣形狀"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若模型是用 smf.ols(\"score ~ hours + absences\", data=df) 建立，predict(new) 會依公式自動加入截距並印出 64.0；用陣列介面時則一定要自己補上 const 欄。",
    },
  },
  {
    id: "senior-bigdata-practice-q197",
    subjectId: "senior-bigdata",
    prompt:
      "某農會想以施肥量（fert）與雨量（rain）預測稻米產量（yield_kg），模型必須含截距，並要取得每個係數的 p 值以檢定是否顯著。已匯入 import statsmodels.api as sm、import statsmodels.formula.api as smf 與 from sklearn.linear_model import LinearRegression，下列哪一行程式碼正確（statsmodels 0.14、scikit-learn 1.5）？",
    choices: [
      { id: "A", text: "sm.OLS(sm.add_constant(df[[\"fert\", \"rain\"]]), df[\"yield_kg\"]).fit().pvalues" },
      { id: "B", text: "LinearRegression().fit(df[[\"fert\", \"rain\"]], df[\"yield_kg\"]).pvalues" },
      { id: "C", text: "smf.ols(\"yield_kg ~ fert + rain\", data=df).fit().pvalues" },
      { id: "D", text: "sm.OLS(df[\"yield_kg\"], df[[\"fert\", \"rain\"]]).fit().pvalues" },
    ],
    answer: "C",
    explanation:
      "statsmodels 的公式介面 smf.ols 會依「y ~ x1 + x2」的公式自動加入截距（輸出中的 Intercept），fit() 之後的結果物件直接提供 pvalues。依變數放在 ~ 左邊、含截距、能取得 p 值，三個條件一次滿足。",
    choiceExplanations: {
      A: "sm.OLS 的引數順序是 (endog, exog)，也就是 (y, X)；把 X 放在前面等於拿產量去預測三個欄位，fit() 雖能執行，取 pvalues 時卻會因殘差形狀不符而拋出 ValueError。",
      B: "scikit-learn 的 LinearRegression 只提供 coef_ 與 intercept_，不做統計推論，沒有 pvalues 屬性，執行會拋出 AttributeError。",
      D: "sm.OLS 的陣列介面不會自動加入截距，迴歸線被迫通過原點，施肥量係數由約 3.8 偏到約 6.9；需先以 sm.add_constant 加上常數欄。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["statsmodels 公式介面", "截距項", "係數 p 值", "OLS 引數順序"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      crossNode: "L22103",
      decisionBoundary:
        "若只需要預測值、不需要 p 值，LinearRegression().fit(X, y) 也完全正確且預設含截距；一旦要做係數的顯著性檢定，就得改用 statsmodels。",
    },
  },
  {
    id: "senior-bigdata-practice-q198",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行對 40 萬名用戶進行 A/B 測試，比較新、舊行動銀行介面下每位用戶的平均單筆轉帳金額。a、b 分別為舊、新介面兩組各 200,000 位用戶的金額（元），執行下列程式（scipy 1.14、NumPy 2.x），輸出如下。下列判斷何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "t = stats.ttest_ind(b, a)\n" +
          "d = (b.mean() - a.mean()) / np.sqrt((a.var(ddof=1) + b.var(ddof=1)) / 2)\n" +
          "print(f\"mean diff = {b.mean() - a.mean():.2f} 元\")\n" +
          "print(f\"t = {t.statistic:.2f}, p = {t.pvalue:.1e}\")\n" +
          "print(f\"Cohen's d = {d:.3f}\")",
      },
      {
        kind: "output",
        content:
          "mean diff = 6.61 元\n" +
          "t = 5.22, p = 1.8e-07\n" +
          "Cohen's d = 0.016",
      },
    ],
    choices: [
      { id: "A", text: "差異雖達統計顯著，但 Cohen's d 僅約 0.02、平均只多 6.6 元，應依業務門檻判斷是否上線" },
      { id: "B", text: "p 值小於 0.001，代表新介面使每筆轉帳金額大幅提升，應立即將新介面全面上線" },
      { id: "C", text: "金額未必服從常態分布，應改用 Mann-Whitney U 檢定，結果才會正確地變成不顯著" },
      { id: "D", text: "樣本數過大會讓檢定失真，應隨機抽出 2,000 筆重做 t 檢定以取得較可信的結論" },
    ],
    answer: "A",
    explanation:
      "大數據情境下，樣本數極大時標準誤非常小，即使差異微不足道也會得到極小的 p 值。本例 p = 1.8e-07 只說明「差異不太可能是 0」，但平均只多 6.61 元，約為 1,500 元的 0.4%，Cohen's d 僅 0.016，遠低於一般認定「小效果」的 0.2。是否上線應比較這 6.6 元帶來的業務價值與改版成本，也就是同時看統計顯著性與實務顯著性（效果量、信賴區間）。",
    choiceExplanations: {
      B: "p 值小只代表差異不太可能是隨機造成，不代表差異大；平均差 6.61 元約只占 0.4%，談不上「大幅提升」。",
      C: "樣本數 20 萬時 t 檢定對非常態相當穩健，換成 Mann-Whitney U 檢定的 p 值仍約 7e-07，結論不會翻轉；問題不在檢定方法，而在只看 p 值。",
      D: "大樣本不會讓檢定失真，只會讓它更敏感；抽 2,000 筆只是丟掉檢定力，差異多半變得不顯著，但真實存在的那幾元差異並不會因此消失。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["統計顯著與實務顯著", "效果量", "Cohen's d", "大樣本檢定"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若業務上認定每筆多 5 元就足以支付改版成本，這個雖小但穩定的差異就值得上線；判斷依據是效果量與業務門檻，而不是 p 值有多小。",
    },
  },
  {
    id: "senior-bigdata-practice-q199",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行想依客戶的月均存款與月刷卡金額，把客戶切分成數個族群以設計差異化行銷方案。資料分析師寫了下列虛擬碼，請問這段虛擬碼實作的是哪一種方法？",
    figures: [
      {
        kind: "code",
        caption: "客戶分群的虛擬碼：",
        content:
          "Input：\n" +
          "  - D：n 位客戶的特徵向量（月均存款、月刷卡金額），沒有任何標籤\n" +
          "  - k：要分成的群數\n" +
          "Output：\n" +
          "  - 每位客戶所屬的群編號\n" +
          "Algorithm：\n" +
          "  1. 從 D 中隨機挑出 k 位客戶，作為初始的 c[1..k]\n" +
          "  2. 重複下列步驟：\n" +
          "       a. 對每位客戶 x，計算 x 與 c[1..k] 的距離，把 x 標記為距離最小的 j\n" +
          "       b. 對每個 j，把 c[j] 更新為所有標記為 j 的客戶特徵的平均\n" +
          "     直到所有客戶的標記都不再改變\n" +
          "  3. 回傳每位客戶的標記",
      },
    ],
    choices: [
      { id: "A", text: "K 近鄰分類：以距離最近的 k 個已知樣本投票，決定每位客戶的類別" },
      { id: "B", text: "K-means 分群：反覆把客戶指派給最近中心，再以群內平均更新中心" },
      { id: "C", text: "凝聚式階層分群：每一輪把最接近的兩群合併，直到只剩下 k 群為止" },
      { id: "D", text: "DBSCAN 密度分群：以半徑內的鄰居數找出核心點，再向外擴張成一群" },
    ],
    answer: "B",
    explanation:
      "判斷的線索有三個：輸入沒有標籤（非監督式）；維護 k 個中心 c[j]，並以「群內客戶特徵的平均」更新中心；反覆執行「指派到最近中心 → 重算中心」直到標記不再改變。這正是 K-means 的標準迭代流程（Lloyd 演算法），k 是事先指定的群數。若以同一組初始中心執行 scikit-learn 的 KMeans（algorithm=\"lloyd\"），得到的分群結果會與虛擬碼完全相同。",
    choiceExplanations: {
      A: "K 近鄰是監督式分類，需要帶標籤的訓練資料，預測時找最近的 k 個「樣本」以標籤多數決；虛擬碼的輸入沒有標籤、k 是群數而非鄰居數，也沒有投票步驟。兩者都有 k 與距離，是最容易混淆的一組。",
      C: "凝聚式階層分群從每位客戶自成一群開始，逐輪合併最接近的兩群，不會在一開始隨機挑 k 個點當中心，也沒有「以平均重算中心再重新指派」的迭代。",
      D: "DBSCAN 不需要事先指定群數，而是以半徑 eps 與最少鄰居數判斷核心點並擴張；虛擬碼沒有半徑參數，群數固定為輸入的 k。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["K-means", "非監督式學習", "群中心"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若輸入改為帶標籤的訓練資料，步驟改成「找出與新客戶距離最近的 k 位舊客戶，以其標籤多數決」，同樣有 k 與距離，答案就會變成 K 近鄰分類。",
    },
  },
  {
    id: "senior-bigdata-practice-q200",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院要預測住院病患是否會發生敗血症（陽性約占 6%）。分析師為了處理類別不平衡寫了下列程式，測試集召回率高達 1.000，但模型上線後的實際召回率只有五成左右。請問最適當的修正是下列何者？（scikit-learn 1.5、pandas 2.x）",
    figures: [
      {
        kind: "note",
        content: "df 為 2,000 筆病歷，含 10 個數值特徵與標籤欄 sepsis（1＝發生敗血症），其中陽性 127 筆。",
      },
      {
        kind: "code",
        content:
          "from sklearn.utils import resample\n" +
          "from sklearn.model_selection import train_test_split\n" +
          "from sklearn.ensemble import RandomForestClassifier\n" +
          "from sklearn.metrics import recall_score, precision_score\n" +
          "\n" +
          "major = df[df[\"sepsis\"] == 0]\n" +
          "minor = df[df[\"sepsis\"] == 1]\n" +
          "minor_up = resample(minor, replace=True, n_samples=len(major), random_state=0)\n" +
          "bal = pd.concat([major, minor_up])\n" +
          "\n" +
          "X, y = bal.drop(columns=\"sepsis\"), bal[\"sepsis\"]\n" +
          "X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)\n" +
          "clf = RandomForestClassifier(random_state=0).fit(X_tr, y_tr)\n" +
          "pred = clf.predict(X_te)\n" +
          "print(f\"recall = {recall_score(y_te, pred):.3f}\")\n" +
          "print(f\"precision = {precision_score(y_te, pred):.3f}\")",
      },
      {
        kind: "output",
        content:
          "recall = 1.000\n" +
          "precision = 0.987",
      },
    ],
    choices: [
      { id: "A", text: "維持先過採樣再切分，但在 train_test_split 加上 stratify=y，讓兩組的陽性比例一致" },
      { id: "B", text: "先以 stratify 切出保有原始比例的測試集，只對訓練集過採樣，測試集維持原貌" },
      { id: "C", text: "先切分資料，再把訓練集與測試集各自過採樣到 1:1，讓兩邊的評估條件完全相同" },
      { id: "D", text: "不另切測試集，改對過採樣後的 bal 做 5 折交叉驗證，以平均召回率評估模型" },
    ],
    answer: "B",
    explanation:
      "resample(replace=True) 是「有放回地複製」少數類樣本，先複製再切分，同一位陽性病患的副本就會同時落在訓練集與測試集。本例測試集 750 列中的 377 筆陽性，全部在訓練集裡有完全相同的副本，隨機森林等於在測試集上背答案，召回率才會是 1.000。正確流程是先以 stratify 切出保有真實盛行率（約 6%）的測試集，過採樣只做在訓練集；同一份資料照此重做，召回率約 0.52、精確率約 0.93，與上線表現相符。",
    choiceExplanations: {
      A: "stratify 只保證兩組的陽性比例相同，無法阻止同一筆樣本的副本被分到兩邊；照這個寫法重跑，副本照樣跨組，召回率仍是 1.000。",
      C: "訓練集過採樣沒有錯，但測試集也過採樣，會把陽性比例從約 6% 灌到 50%，並以重複病例計分；以本題資料實測，精確率因此由約 0.93 虛增到約 0.99，不再反映上線時的真實情況。",
      D: "交叉驗證不能修正這個問題：在已過採樣的 bal 上切折，副本一樣會分散到訓練折與驗證折，5 折平均召回率仍接近 1.000。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料洩漏", "過採樣", "類別不平衡", "召回率"],
      constraints: ["data"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若把過採樣放進交叉驗證的每一折內、只對訓練折重抽（例如以 Pipeline 包住重抽步驟），改用交叉驗證評估就會成立；問題從來不在用不用交叉驗證，而在重抽是否發生在切分之前。",
    },
  },
  {
    id: "senior-bigdata-practice-q201",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠以影像模型判定零件是否為不良品，標籤為字串 \"OK\"（良品）與 \"NG\"（不良品）。品保主管只想知道：真正的不良品中，有多少比例被模型抓了出來。下列哪一行程式碼能正確算出這個數值？（scikit-learn 1.5）",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.metrics import recall_score\n" +
          "\n" +
          "y_true = [\"OK\",\"OK\",\"NG\",\"OK\",\"NG\",\"NG\",\"OK\",\"OK\",\"NG\",\"OK\",\"OK\",\"NG\"]\n" +
          "y_pred = [\"OK\",\"NG\",\"NG\",\"OK\",\"OK\",\"NG\",\"OK\",\"OK\",\"NG\",\"OK\",\"OK\",\"OK\"]",
      },
    ],
    choices: [
      { id: "A", text: "recall_score(y_pred, y_true, pos_label=\"NG\")" },
      { id: "B", text: "recall_score(y_true, y_pred)" },
      { id: "C", text: "recall_score(y_true, y_pred, pos_label=\"NG\")" },
      { id: "D", text: "recall_score(y_true, y_pred, average=\"macro\")" },
    ],
    answer: "C",
    explanation:
      "「真正的不良品中被抓出的比例」是 NG 類的召回率 TP／（TP＋FN）。本例 5 個真實 NG 中抓到 3 個，答案為 0.6。標籤是字串時必須用 pos_label=\"NG\" 指定哪一類是正類，且 scikit-learn 的評估函式一律是 y_true 在前、y_pred 在後。",
    choiceExplanations: {
      A: "引數順序對調後，函式把預測值當成真實值，算出的其實是 TP／（TP＋FP），也就是 NG 的精確率 0.75，而不是主管要的 0.6。程式能執行，錯誤不會自己浮現。",
      B: "pos_label 預設為 1，但標籤只有 \"OK\" 與 \"NG\"，會拋出 ValueError（pos_label=1 is not a valid label）。標籤若是 0／1 編碼，這個寫法才會正確。",
      D: "average=\"macro\" 會把 OK 與 NG 兩類的召回率取未加權平均，得到約 0.729，混入了良品被判對的比例，不是只看不良品。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["召回率", "pos_label", "引數順序"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若主管改問「被判為不良品的零件中，有多少真的是不良品」，要的就是精確率，應改用 precision_score(y_true, y_pred, pos_label=\"NG\")，而不是靠對調引數湊出同樣的數字。",
    },
  },
  {
    id: "senior-bigdata-practice-q202",
    subjectId: "senior-bigdata",
    prompt:
      "某大學想找出最能區分學生「是否通過微積分」的因素。助教寫了下列虛擬碼，用來在建立決策樹時挑選第一個分裂屬性。請問這段虛擬碼採用的是哪一種分裂準則？",
    figures: [
      {
        kind: "code",
        caption: "挑選分裂屬性的虛擬碼：",
        content:
          "Input：\n" +
          "  - S：學生資料（屬性：出席率、作業繳交、是否住宿；標籤：通過／未通過）\n" +
          "  - A：候選屬性集合\n" +
          "函式 H(T)：\n" +
          "  回傳 −Σ p_c × log2(p_c)，p_c 為 T 中標籤 c 所占的比例\n" +
          "Algorithm：\n" +
          "  1. base ← H(S)\n" +
          "  2. 對 A 中的每個屬性 a：\n" +
          "       a. 依 a 的取值把 S 切成子集 S_1, …, S_m\n" +
          "       b. after ← Σ (|S_v| / |S|) × H(S_v)\n" +
          "       c. score[a] ← base − after\n" +
          "  3. 回傳 score 最大的屬性",
      },
    ],
    choices: [
      { id: "A", text: "CART 的吉尼不純度：以 1 減各類比例平方和，衡量分裂後的混亂程度" },
      { id: "B", text: "C4.5 的增益比：把熵的減少量再除以屬性本身的分裂資訊來做校正" },
      { id: "C", text: "ID3 的資訊增益：以分裂前後熵的加權減少量，挑出最好的分裂屬性" },
      { id: "D", text: "迴歸樹的變異縮減：以分裂前後目標值變異數的減少量來挑選屬性" },
    ],
    answer: "C",
    explanation:
      "H(T) = −Σ p log2 p 是以 2 為底的熵；score[a] = H(S) − Σ (|S_v|/|S|) H(S_v) 是「分裂前的熵減去分裂後各子集熵的加權平均」，也就是資訊增益，取最大者正是 ID3 的做法。關鍵是最後一步直接比較 score，沒有再除以任何校正項。",
    choiceExplanations: {
      A: "吉尼不純度的公式是 1 − Σ p²，虛擬碼的 H 用的是 −Σ p log2 p，兩者數值不同；例如 14 位學生中 8 位通過時，根節點的吉尼值約 0.49、熵約 0.99。",
      B: "增益比要把資訊增益再除以 −Σ (|S_v|/|S|) log2(|S_v|/|S|)（分裂資訊），用來壓低取值很多的屬性；虛擬碼沒有這一步。在取值數不同的屬性之間，兩者常會挑出不同的分裂屬性。",
      D: "變異縮減用於目標是連續數值的迴歸樹，算的是變異數；本題標籤是「通過／未通過」的類別，虛擬碼算的是各類比例的熵。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["資訊增益", "熵", "決策樹分裂準則"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若步驟 2c 改成 score[a] ← (base − after) ÷ SplitInfo(a)，就變成 C4.5 的增益比；若 H 換成 1 − Σ p²，就變成 CART 的吉尼準則。",
    },
  },
  {
    id: "senior-bigdata-practice-q203",
    subjectId: "senior-bigdata",
    prompt:
      "某農業試驗所以葉片影像特徵預測植株是否罹患病害（病株約占 7%），模型在測試集上的分類報告如下。請問下列判讀與後續處置，何者最合理？（scikit-learn 1.5）",
    figures: [
      {
        kind: "note",
        content: "標籤 0＝健康、1＝病株；X、y 共 3,000 株。",
      },
      {
        kind: "code",
        content:
          "X_train, X_test, y_train, y_test = train_test_split(\n" +
          "    X, y, test_size=0.3, stratify=y, random_state=0)\n" +
          "model = LogisticRegression(max_iter=1000).fit(X_train, y_train)\n" +
          "print(classification_report(y_test, model.predict(X_test)))",
      },
      {
        kind: "output",
        content:
          "              precision    recall  f1-score   support\n" +
          "\n" +
          "           0       0.94      1.00      0.97       837\n" +
          "           1       0.90      0.14      0.25        63\n" +
          "\n" +
          "    accuracy                           0.94       900\n" +
          "   macro avg       0.92      0.57      0.61       900\n" +
          "weighted avg       0.94      0.94      0.92       900",
      },
    ],
    choices: [
      { id: "A", text: "整體準確率 0.94 已高於驗收門檻 0.90，模型可以直接推廣到所有試驗田區" },
      { id: "B", text: "病株的 precision 達 0.90，代表真正的病株有九成都已經被模型找了出來" },
      { id: "C", text: "macro avg 明顯低於 weighted avg，代表模型已過度擬合，應加強正規化" },
      { id: "D", text: "病株 recall 僅 0.14，應改以召回率驗收，並加類別權重或補收病株樣本" },
    ],
    answer: "D",
    explanation:
      "63 株病株只抓到約 14%，模型幾乎把所有植株都判為健康。準確率 0.94 看似漂亮，但測試集有 93% 是健康株，「全部判健康」就有 0.93，模型幾乎沒有比這個基準好。病害偵測漏判的代價高，驗收應改看病株的召回率；處置上可設 class_weight=\"balanced\"（以同一份資料實測，召回率由 0.14 升到約 0.6）、調低判定門檻，或回到資料收集端補充病株樣本。",
    choiceExplanations: {
      A: "在 93% 都是健康株的資料上，全部判健康就有 0.93 的準確率；0.94 只比這個基準多一點，不能說明模型找得到病株。",
      B: "precision 0.90 的意思是「被判為病株者中有九成真的是病株」；真正的病株被找到的比例是 recall，只有 0.14。這裡把兩個指標的分母對調了。",
      C: "過度擬合要比較訓練與測試的表現，本例兩者準確率都約 0.93～0.94；macro avg 低於 weighted avg，是因為表現差的病株類樣本少、在加權平均中占比小，反映的是類別不平衡。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["類別不平衡", "召回率", "準確率悖論", "classification_report"],
      constraints: ["data", "quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Neighbor Concept",
      },
      crossNode: "L22201",
      decisionBoundary:
        "若誤判健康株為病株的成本才是主要考量（例如每次誤判都要整區噴藥），驗收重點就會轉向病株的精確率，處置方向也會從「多抓」變成「抓得準」。",
    },
  },
  {
    id: "senior-bigdata-practice-q204",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行以羅吉斯迴歸建立信用卡盜刷偵測模型（盜刷標記為 1），接著要用 roc_curve 取得畫 ROC 曲線所需的座標並計算 AUC。下列哪一行程式碼填入空白處最正確？（scikit-learn 1.5）",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.metrics import roc_curve, auc\n" +
          "\n" +
          "model = LogisticRegression(max_iter=1000).fit(X_train, y_train)\n" +
          "fpr, tpr, thresholds = ______\n" +
          "plt.plot(fpr, tpr)\n" +
          "print(auc(fpr, tpr))",
      },
    ],
    choices: [
      { id: "A", text: "roc_curve(y_test, model.predict_proba(X_test)[:, 1])" },
      { id: "B", text: "roc_curve(y_test, model.predict(X_test))" },
      { id: "C", text: "roc_curve(model.predict_proba(X_test)[:, 1], y_test)" },
      { id: "D", text: "roc_curve(y_test, model.predict_proba(X_test)[:, 0])" },
    ],
    answer: "A",
    explanation:
      "ROC 曲線是把判定門檻從高掃到低，記錄每個門檻下的 FPR 與 TPR，因此 roc_curve 需要真實標籤與「正類的連續分數」。model.classes_ 為 [0, 1]，predict_proba 的第 1 欄才是盜刷（1）的機率，而且 y_true 要放在第一個引數。",
    choiceExplanations: {
      B: "predict 輸出的是已經用 0.5 切好的 0／1 硬標籤，只剩一個有效門檻，曲線只有 3 個點，AUC 也會被明顯低估。程式能跑，錯誤不容易察覺。",
      C: "引數順序對調，把連續的機率當成真實標籤，scikit-learn 會因為 y_true 是連續值而拋出 ValueError。",
      D: "第 0 欄是「正常交易」的機率，排序方向完全相反，算出的 AUC 會等於 1 減去正確值，曲線落到對角線下方。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["ROC 曲線", "AUC", "predict_proba"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Layer Confusion",
        D: "Terminology Swap",
      },
      crossNode: "L22303",
      decisionBoundary:
        "若模型是沒有啟用機率輸出的 SVC 這類分類器，就要改傳 model.decision_function(X_test)；roc_curve 只需要能排序的分數，不一定要是機率。",
    },
  },
  {
    id: "senior-bigdata-practice-q205",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院建立「出院 30 天內再入院」預測模型（再入院約占 18%）。分析師在測試集上掃描判定門檻、挑出 F1 最高者，並把這個 F1 當成上線後的預期表現寫進報告；實際上線後 F1 只有約 0.63。請問這個流程最需要修正之處與正確做法為何？（scikit-learn 1.5）",
    figures: [
      {
        kind: "note",
        content: "X、y 為 2,000 筆歷史病歷的特徵與是否再入院的標籤。",
      },
      {
        kind: "code",
        content:
          "X_train, X_test, y_train, y_test = train_test_split(\n" +
          "    X, y, test_size=0.1, stratify=y, random_state=0)\n" +
          "model = LogisticRegression(max_iter=1000).fit(X_train, y_train)\n" +
          "proba = model.predict_proba(X_test)[:, 1]\n" +
          "best_t, best_f1 = 0.5, 0\n" +
          "for t in np.arange(0.05, 0.95, 0.01):\n" +
          "    f1 = f1_score(y_test, proba >= t)\n" +
          "    if f1 > best_f1:\n" +
          "        best_t, best_f1 = t, f1\n" +
          "print(f\"門檻 {best_t:.2f}，測試集 F1 = {best_f1:.3f}\")",
      },
      {
        kind: "output",
        content: "門檻 0.33，測試集 F1 = 0.711",
      },
    ],
    choices: [
      { id: "A", text: "偏差來自測試集太小，把 test_size 由 0.1 提高到 0.4 後再掃描門檻即可" },
      { id: "B", text: "門檻屬於模型設定，應在訓練集內以交叉驗證挑選，測試集只在最後評估一次" },
      { id: "C", text: "F1 對門檻太敏感，改在測試集上挑準確率最高的門檻，就不會高估上線表現" },
      { id: "D", text: "保留現有門檻，再對同一測試集做 bootstrap 估計信賴區間，即可校正偏差" },
    ],
    answer: "B",
    explanation:
      "判定門檻和超參數一樣是「用資料挑出來的設定」。在測試集上掃 90 個門檻再挑最好的，等於讓測試集參與了模型選擇，挑中的往往是剛好配合這 200 筆雜訊的門檻，回報的 F1 因此系統性偏高（本例 0.711 對上線後約 0.63）。正確做法是在訓練集內以交叉驗證的預測機率（cross_val_predict）挑門檻，測試集保持沒看過，只在最後評估一次。以同一份資料重複 150 次隨機切分實測：原流程平均高估約 0.04，改用此做法後偏差降到 0.01 以下。",
    choiceExplanations: {
      A: "測試集加大只能縮小雜訊，問題的根源是「在同一份資料上挑選又評估」，結構沒變；實測偏差只從約 0.04 降到約 0.02，而且訓練資料少了三成。",
      C: "換成哪個指標都一樣是在測試集上挑門檻，高估依舊存在；而在再入院只占 18% 的資料上以準確率挑門檻，還會偏向把人判為不會再入院。",
      D: "bootstrap 只能估計分數的變異程度，重抽的樣本仍來自同一份已被用來挑門檻的測試集，信賴區間會以被高估的 0.711 為中心，偏差並沒有被校正。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料洩漏", "門檻調整", "交叉驗證", "F1 分數"],
      constraints: ["data", "quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若門檻是由臨床端事先依成本訂好、不是看測試集挑的（例如規定召回率至少 0.8 的最小門檻，且在訓練資料上決定），測試集的分數就沒有被選擇偏差污染，可以直接回報。",
    },
  },
  {
    id: "senior-bigdata-practice-q206",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠把每張維修工單所更換的零件記成一筆交易，想找出「經常一起故障的零件組合」。工程師寫了下列虛擬碼，請問它實作的是哪一種演算法？",
    figures: [
      {
        kind: "code",
        caption: "零件組合探勘的虛擬碼：",
        content:
          "Input：\n" +
          "  - T：維修工單集合（每筆是一組零件，不記錄更換的先後順序）\n" +
          "  - min_sup：最小支持度\n" +
          "Output：\n" +
          "  - 所有支持度 ≥ min_sup 的零件組合\n" +
          "Algorithm：\n" +
          "  1. L1 ← 支持度 ≥ min_sup 的單一零件\n" +
          "  2. k ← 1\n" +
          "  3. 當 Lk 不是空集合時重複：\n" +
          "       a. 把 Lk 中的組合兩兩合併，產生所有 k+1 個零件的候選組合 Ck+1\n" +
          "       b. 刪除 Ck+1 中「任一個 k 零件子集不在 Lk 裡」的候選\n" +
          "       c. 掃描一次 T，計算每個候選的支持度\n" +
          "       d. Lk+1 ← Ck+1 中支持度 ≥ min_sup 的候選\n" +
          "       e. k ← k + 1\n" +
          "  4. 回傳 L1 ∪ L2 ∪ …",
      },
    ],
    choices: [
      { id: "A", text: "FP-Growth：先把交易壓縮成樣式樹，再遞迴探勘而不必另外產生候選組合" },
      { id: "B", text: "GSP 序列樣式探勘：依照事件發生的先後順序，逐層找出經常出現的序列" },
      { id: "C", text: "協同過濾：依相似工單的零件組成，推算各工單尚未更換零件的可能分數" },
      { id: "D", text: "Apriori：逐層由頻繁 k 項集組出 k+1 項候選，並剪去含不頻繁子集者" },
    ],
    answer: "D",
    explanation:
      "虛擬碼的骨架是「逐層」：由頻繁的 k 項集合併出 k+1 項候選（步驟 a），利用「頻繁項集的子集必然頻繁」這個向下封閉性質剪掉不可能的候選（步驟 b），再掃描資料庫計算支持度（步驟 c、d），一路做到沒有新的頻繁項集為止，這正是 Apriori。它找出的頻繁組合，會與暴力列舉所有零件組合再逐一計算支持度的結果完全相同，只是靠剪枝省下大量計數。",
    choiceExplanations: {
      A: "FP-Growth 的特色是先建 FP-tree、再從條件樣式基遞迴探勘，正好不需要「產生候選再掃描計數」；虛擬碼的步驟 a～c 就是 FP-Growth 想避免的做法。",
      B: "序列樣式探勘考慮事件的先後順序（先換 A 再換 B 與相反順序算不同樣式）；虛擬碼明言工單不記先後，把零件順序打亂，結果完全相同。",
      C: "協同過濾是推薦方法，輸出的是對未互動項目的預測分數；虛擬碼輸出的是支持度達門檻的零件組合，沒有相似度計算，也沒有評分。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Apriori", "關聯規則", "支持度", "頻繁項集"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若步驟改為先把工單依零件頻率排序後插入一棵共用前綴的樹，再對每個零件的條件樣式基遞迴探勘、完全不產生候選集，答案就會變成 FP-Growth。",
    },
  },
  {
    id: "senior-bigdata-practice-q207",
    subjectId: "senior-bigdata",
    prompt:
      "某高中以模型把學生的學習成效預測為「低／中／高」三級，下列為測試集的混淆矩陣。請問下列解讀何者正確？（scikit-learn 1.5）",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "from sklearn.metrics import confusion_matrix\n" +
          "\n" +
          "df = pd.read_csv(\"pred.csv\")   # 欄位：actual（真實等級）、pred（預測等級）\n" +
          "cm = confusion_matrix(df[\"actual\"], df[\"pred\"], labels=[\"低\", \"中\", \"高\"])\n" +
          "print(cm)",
      },
      {
        kind: "output",
        content:
          "[[18  2  0]\n" +
          " [ 3 14  9]\n" +
          " [ 0  2 22]]",
      },
    ],
    choices: [
      { id: "A", text: "真實為「中」的學生有 9 位被判成「高」，「中」是三類中召回率最低的一類" },
      { id: "B", text: "被判為「中」的學生中有 9 位其實是「高」，「中」是精確率最低的一類" },
      { id: "C", text: "被判為「高」的學生人數最多，所以「高」也是三類中精確率最高的一類" },
      { id: "D", text: "整體準確率約為 0.77，因此三個類別的召回率也都至少有 0.77 以上" },
    ],
    answer: "A",
    explanation:
      "scikit-learn 的 confusion_matrix 以列為真實值、欄為預測值，列欄順序依 labels 參數。第 2 列是真實為「中」的 26 位學生：14 位判對、3 位判成「低」、9 位判成「高」。各類召回率為 低 18/20＝0.90、中 14/26≈0.54、高 22/24≈0.92，「中」最低。",
    choiceExplanations: {
      B: "這是把列與欄看反。被判為「中」的是第 2 欄共 18 位，其中真實為「高」的只有 2 位；而且三類中精確率最低的是「高」（22/31≈0.71），不是「中」（14/18≈0.78）。",
      C: "被判為「高」的確實最多（第 3 欄共 31 位），但其中有 9 位其實是「中」，精確率約 0.71，反而是三類中最低；預測人數多與精確率高沒有關係。",
      D: "準確率是對角線總和 54 除以 70，約 0.77，是全體的平均表現；個別類別可以低於它，「中」的召回率只有約 0.54。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["混淆矩陣", "召回率", "精確率", "多類別分類"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若改用 ConfusionMatrixDisplay 並傳入 normalize=\"true\"，每一列會除以該列總數，對角線直接就是各類召回率；若傳 normalize=\"pred\"，對角線則變成各類精確率。",
    },
  },
  {
    id: "senior-bigdata-practice-q208",
    subjectId: "senior-bigdata",
    prompt:
      "某農會整理各水稻品種在不同田區的每公頃產量（DataFrame df，欄位 variety、yield_kg），想在同一張圖上比較各品種產量的中位數與四分位距，並直接看出產量異常偏低的田區。下列哪一行程式碼最符合需求？（seaborn 0.13）",
    figures: [
      {
        kind: "code",
        content:
          "import seaborn as sns\n" +
          "import matplotlib.pyplot as plt\n" +
          "\n" +
          "______\n" +
          "plt.show()",
      },
    ],
    choices: [
      { id: "A", text: "sns.barplot(data=df, x=\"variety\", y=\"yield_kg\")" },
      { id: "B", text: "sns.lineplot(data=df, x=\"variety\", y=\"yield_kg\")" },
      { id: "C", text: "sns.countplot(data=df, x=\"variety\", hue=\"variety\")" },
      { id: "D", text: "sns.boxplot(data=df, x=\"variety\", y=\"yield_kg\")" },
    ],
    answer: "D",
    explanation:
      "箱形圖的箱中線是中位數、箱子上下緣是第一與第三四分位數（箱高即四分位距），超出 1.5 倍四分位距的點會個別畫成離群點。題目要的「中位數、四分位距、異常偏低的田區」三項，箱形圖一張就全部呈現。",
    choiceExplanations: {
      A: "barplot 的長條高度是各品種的平均產量，上方的誤差線是信賴區間，看不到中位數、四分位距，也不會畫出個別的離群田區。",
      B: "lineplot 會把各品種的平均產量連成一條線，暗示品種之間有連續的先後關係；它同樣只呈現平均與信賴帶，看不到分布形狀與離群點。",
      C: "countplot 只計算每個品種有幾筆資料（幾塊田區），完全沒有用到產量欄位；加上 hue 只是讓每根長條換個顏色。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["箱形圖", "四分位距", "離群值", "seaborn"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Correct in Different Context",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若需求改成「比較各品種的平均產量並附上不確定性」，barplot 就是合適的選擇；若想同時看分布的完整形狀（例如是否雙峰），則可改用 violinplot。",
    },
  },
  {
    id: "senior-bigdata-practice-q209",
    subjectId: "senior-bigdata",
    prompt:
      "某投信分析師要把五類資產的日報酬分布並排比較，寫了下列程式（matplotlib 3.9）。關於這段程式，下列敘述哪些正確？\n① axes 是形狀 (2, 3) 的陣列，axes.flat 會依「先走完第一列、再走第二列」的順序走訪子圖\n② figsize=(12, 6) 的單位是像素，因此輸出的圖寬只有 12 個像素\n③ 因為 sharey=True，axes[0, 0] 改成對數刻度後，其他子圖的 y 軸也一併變成對數刻度\n④ bins=20 代表每根長條的寬度固定為 20 個報酬單位\n⑤ cols 只有 5 個，zip 走完 5 個就停止，axes[1, 2] 會留下一個沒有資料的空白座標軸\n⑥ sharey=True 同時讓所有子圖共用 x 軸範圍，因此五張直方圖的 x 軸刻度相同",
    figures: [
      {
        kind: "code",
        content:
          "import matplotlib.pyplot as plt\n" +
          "\n" +
          "cols = [\"stock\", \"bond\", \"gold\", \"oil\", \"fx\"]\n" +
          "fig, axes = plt.subplots(2, 3, figsize=(12, 6), sharey=True)\n" +
          "for ax, col in zip(axes.flat, cols):\n" +
          "    ax.hist(returns[col], bins=20)\n" +
          "    ax.set_title(col)\n" +
          "axes[0, 0].set_yscale(\"log\")\n" +
          "fig.tight_layout()",
      },
    ],
    choices: [
      { id: "A", text: "①②③" },
      { id: "B", text: "①④⑥" },
      { id: "C", text: "①③⑤" },
      { id: "D", text: "③⑤⑥" },
    ],
    answer: "C",
    explanation:
      "① 正確：plt.subplots(2, 3) 回傳 2×3 的 Axes 陣列，axes.flat 依列優先順序走訪。③ 正確：共用的 y 軸不只共用範圍，也共用刻度型態，改一個就全部變成對數。⑤ 正確：zip 以較短的 cols 為準，第 6 個子圖沒有畫任何東西，但座標軸仍會顯示（要隱藏需另外呼叫 axes[1, 2].axis(\"off\")）。故為 ①③⑤。",
    choiceExplanations: {
      A: "② 錯：figsize 的單位是英吋，實際像素是英吋乘以 dpi，dpi 為 100 時圖是 1200×600 像素。",
      B: "④ 錯：bins=20 是把資料範圍切成 20 個等寬分箱，寬度為（最大值－最小值）÷20，不是固定 20；⑥ 也錯，見 D 的說明。",
      D: "⑥ 錯：sharey 只共用 y 軸，x 軸要另外指定 sharex=True（預設為 False），五張圖的 x 軸範圍各依資料而定、彼此不同。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["matplotlib 子圖", "共用座標軸", "直方圖分箱", "對數刻度"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若把 sharey=True 拿掉，③ 就會變成錯的——只有 axes[0, 0] 是對數刻度，其他子圖維持線性，答案便不再包含 ③。",
    },
  },
  {
    id: "senior-bigdata-practice-q210",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院要先確認病患的空腹血糖值是否近似常態分布，再決定能否使用 t 檢定。分析師寫了下列程式畫圖（NumPy 2.x、SciPy 1.14），請問這張圖是哪一種圖，又該如何判讀？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import matplotlib.pyplot as plt\n" +
          "from scipy import stats\n" +
          "\n" +
          "x = np.sort(df[\"glucose\"].to_numpy())\n" +
          "n = len(x)\n" +
          "p = (np.arange(1, n + 1) - 0.5) / n\n" +
          "q = stats.norm.ppf(p)\n" +
          "z = (x - x.mean()) / x.std()\n" +
          "plt.scatter(q, z, s=8)\n" +
          "plt.plot([-3, 3], [-3, 3], \"r--\")\n" +
          "plt.xlabel(\"theoretical\"); plt.ylabel(\"sample\")",
      },
    ],
    choices: [
      { id: "A", text: "常態 Q-Q 圖：點越貼近紅色虛線，代表資料分布越接近常態分布" },
      { id: "B", text: "經驗累積分布圖：縱軸代表不大於該值的樣本所占的累積比例" },
      { id: "C", text: "ROC 曲線：紅色虛線代表隨機猜測，點離虛線越遠分類越準確" },
      { id: "D", text: "殘差圖：點在虛線兩側隨機散布，代表迴歸模型的設定是適當的" },
    ],
    answer: "A",
    explanation:
      "程式把樣本排序後標準化成 z，再以 stats.norm.ppf 算出第 i 個位置在標準常態下「應該」落在的分位數 q，以 q 為橫軸、z 為縱軸作圖，並畫 y＝x 參考線。這就是常態 Q-Q 圖：資料若服從常態，點會貼近虛線；右偏資料則在右上端明顯往上翹離虛線。scipy.stats.probplot 畫的也是同一種圖。",
    choiceExplanations: {
      B: "經驗累積分布圖的縱軸是累積比例，必定介於 0 與 1 之間；這裡的縱軸是標準化後的血糖值，有負值也會大於 1。p 雖然是累積比例，但只被拿來換算分位數，並沒有畫在圖上。",
      C: "ROC 曲線的兩軸是偽陽性率與真陽性率，都介於 0 與 1；這裡的橫軸是常態分位數，範圍約在 −3 到 3，而且整段程式沒有任何分類模型或標籤。",
      D: "殘差圖的縱軸是模型預測的殘差，點不會隨橫軸遞增；這裡沒有任何迴歸模型，縱軸是排序後的樣本，必然由小到大單調遞增。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["Q-Q 圖", "常態性檢查", "分位數"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若程式改成 plt.step(x, np.arange(1, n + 1) / n)，以原始值為橫軸、累積比例為縱軸，畫出的就會是經驗累積分布圖。",
    },
  },
  {
    id: "senior-bigdata-practice-q211",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠想用熱圖檢視各感測器讀值之間的相關性（pandas 2.2、seaborn 0.13），執行下列程式後出現錯誤。請問下列判斷與修正何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "import seaborn as sns\n" +
          "\n" +
          "df = pd.read_csv(\"sensor.csv\")   # 欄位：line（產線代號 L1～L3）、temp、vib、rpm\n" +
          "sns.heatmap(df.corr(), annot=True, cmap=\"coolwarm\")",
      },
      {
        kind: "output",
        caption: "錯誤訊息（只節錄最後一行）：",
        content: "ValueError: could not convert string to float: 'L3'",
      },
    ],
    choices: [
      { id: "A", text: "corr 會試著把文字欄位 line 轉成數值，改用 df.corr(numeric_only=True)" },
      { id: "B", text: "錯誤來自欄位中含有缺值，先執行 df = df.dropna() 再計算相關係數就能解決" },
      { id: "C", text: "seaborn 的 heatmap 不接受文字欄位，改用 plt.imshow(df.corr()) 就能畫出來" },
      { id: "D", text: "皮爾森相關無法處理文字，改用 df.corr(method=\"spearman\") 就能算出結果" },
    ],
    answer: "A",
    explanation:
      "錯誤發生在 heatmap 之前的 df.corr()。pandas 2.0 起 DataFrame.corr() 的 numeric_only 預設為 False，會嘗試把每一欄都轉成浮點數，遇到產線代號 'L3' 這種字串就拋出 ValueError（1.x 版會默默略過文字欄位）。改成 df.corr(numeric_only=True) 只對 temp、vib、rpm 三欄計算，得到 3×3 的相關矩陣即可畫出熱圖。",
    choiceExplanations: {
      B: "缺值不是原因，訊息說的是字串無法轉成浮點數；dropna 只刪掉含缺值的列，line 欄仍是文字，錯誤照舊。而且 corr 本來就會成對略過缺值。",
      C: "錯誤訊息出自 df.corr()，在資料交給繪圖函式之前就已失敗；把 heatmap 換成 plt.imshow，一樣要先算 df.corr()，會拋出同一個錯誤。",
      D: "斯皮爾曼相關只是先把數值換成等級再計算，同樣要求每一欄都是數值；文字欄位一樣無法轉換，會拋出同一個錯誤。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["相關係數熱圖", "numeric_only", "pandas 版本差異"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若環境是 pandas 1.x，df.corr() 會自動略過文字欄位，原程式就不會出錯；若產線代號本身就是想分析的因子，則應先做 one-hot 編碼再納入相關分析，而不是直接排除。",
    },
  },
  {
    id: "senior-bigdata-practice-q212",
    subjectId: "senior-bigdata",
    prompt:
      "某補習班要畫出每位學生「每週讀書時數 hours」與「模擬考分數 score」的散布圖，並以不同顏色區分三個班級（欄位 cls 的值為 \"甲班\"、\"乙班\"、\"丙班\"），同時自動產生圖例。下列哪一行程式碼最符合需求？（matplotlib 3.9、seaborn 0.13）",
    figures: [
      {
        kind: "note",
        content: "df 共 90 位學生，hours 為整數，常有多位學生的讀書時數相同。",
      },
    ],
    choices: [
      { id: "A", text: "plt.scatter(df[\"hours\"], df[\"score\"], c=df[\"cls\"])" },
      { id: "B", text: "sns.scatterplot(data=df, x=\"hours\", y=\"score\", hue=\"cls\")" },
      { id: "C", text: "sns.scatterplot(data=df, x=\"hours\", y=\"score\", size=\"cls\")" },
      { id: "D", text: "sns.lineplot(data=df, x=\"hours\", y=\"score\", hue=\"cls\")" },
    ],
    answer: "B",
    explanation:
      "seaborn 的 scatterplot 以 hue 指定「依哪一欄上色」，會自動為每個類別配色並產生圖例；每位學生都畫成一個點。圖上會有 90 個點、3 種顏色，圖例正好是三個班名。",
    choiceExplanations: {
      A: "matplotlib 的 c 參數要的是顏色或數值（再經 colormap 對應），\"甲班\" 這種字串不是合法的顏色名稱，會拋出 ValueError；即使先把班級轉成數字，plt.scatter 也不會自動產生班級圖例。",
      C: "size 是依類別改變點的大小，所有點仍是同一種顏色，不符合「以顏色區分班級」的需求。",
      D: "lineplot 會把同一個 hours 的多位學生聚合成平均分數再連成線，個別學生的點就看不到了；hue 雖然有上色，但畫的已不是散布圖。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["散布圖", "hue 分組上色", "seaborn"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求改成「看各班平均分數隨讀書時數變化的趨勢」，把同一時數的學生聚合後連線的 lineplot 反而才是合適的寫法。",
    },
  },
  {
    id: "senior-bigdata-practice-q213",
    subjectId: "senior-bigdata",
    prompt:
      "某農場要以直方圖呈現過去一年每日降雨量（mm）的分布。分析師先用 np.histogram 檢查 10 個等寬分箱的次數，輸出如下（NumPy 2.x）。請問下列調整何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "counts, edges = np.histogram(df[\"rain_mm\"], bins=10)\n" +
          "print(counts)\n" +
          "print(np.round(edges).astype(int))\n" +
          "print(df[\"rain_mm\"].median())",
      },
      {
        kind: "output",
        content:
          "[324  24   9   5   0   1   0   0   0   2]\n" +
          "[  0  54 108 162 215 269 323 377 431 484 538]\n" +
          "11.9",
      },
    ],
    choices: [
      { id: "A", text: "資料極度右偏，可改用對數分箱或先取 log1p 再畫，讓多數日子不再全擠在第一箱" },
      { id: "B", text: "把分箱數由 10 減為 5，每箱分到的天數會比較平均，分布的形狀也會更容易判讀" },
      { id: "C", text: "改畫圓餅圖呈現各分箱的占比，能比直方圖更清楚地看出雨量集中在哪一個區間" },
      { id: "D", text: "最大的兩筆雨量顯然是輸入錯誤，先刪除這兩筆後，直方圖的形狀就會恢復正常" },
    ],
    answer: "A",
    explanation:
      "365 天中有 324 天（約 89%）落在第一箱 0～54 mm，中位數只有 11.9 mm，最大值卻到 538 mm，典型的右偏長尾。等寬分箱被少數豪雨日撐開，多數日子的分布細節全擠在第一根長條裡。降雨量這類跨好幾個數量級的資料，適合改用對數分箱（如 np.logspace 產生邊界）或先取 log1p 再畫；本例取 log1p 後再分 10 箱，最大一箱只占約兩成，而且每一箱都有資料。",
    choiceExplanations: {
      B: "分箱變少，每箱變寬，第一箱只會更擠；本例改成 5 箱後第一箱占比從約 89% 升到約 95%，細節更看不清楚。",
      C: "圓餅圖會丟失分箱之間的數值順序，本例還有 4 個分箱是 0 次，在圓餅圖上完全看不見；要呈現數值分布，仍應使用直方圖這類有序的圖。",
      D: "豪雨日是真實存在的天氣現象，不能只因數值大就認定是輸入錯誤；而且刪掉最大的兩筆後重新分箱，第一箱仍占八成，右偏是分布本身的形狀。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["直方圖分箱", "右偏分布", "對數轉換"],
      constraints: ["data"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若分箱結果大致對稱、各箱次數分布平順，等寬分箱就足夠；只有當資料跨越數個數量級、多數值擠在少數箱時，才需要對數分箱或轉換。",
    },
  },
];
