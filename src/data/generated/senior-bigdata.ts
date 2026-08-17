import type { Question } from "../types";

export const generated: Question[] = [
  // ── 機率統計基礎（L221）q001–q006 ──
  {
    id: "senior-bigdata-gen-q001",
    subjectId: "senior-bigdata",
    prompt:
      "某品管團隊量測一批零件的重量，發現平均數為 50 公克、中位數為 46 公克。在不看圖的情況下，下列對此分布形態的推論何者最為合理？",
    choices: [
      { id: "A", text: "分布呈右偏（正偏），可能有少數偏大的離群值把平均數往上拉" },
      { id: "B", text: "分布呈左偏（負偏），可能有少數偏小的離群值把平均數往下拉" },
      { id: "C", text: "分布必為完全對稱的常態分布" },
      { id: "D", text: "平均數大於中位數代表資料一定沒有離群值" },
    ],
    answer: "A",
    explanation:
      "當平均數（50）大於中位數（46）時，通常表示右尾較長，即右偏（正偏），少數偏大的數值會把平均數往上拉（A）。左偏時平均數會小於中位數（B）；對稱分布時兩者相近，故不能斷定為常態（C）；平均數大於中位數恰常是離群值或長尾造成，不代表沒有離群值（D）。",
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q002",
    subjectId: "senior-bigdata",
    prompt:
      "在假設檢定中，研究者設定顯著水準 α＝0.05。下列關於 α 與型一錯誤（Type I error）的敘述何者最正確？",
    choices: [
      { id: "A", text: "α 代表當虛無假設為假時，仍未能拒絕它的機率" },
      { id: "B", text: "α 越小，犯型一錯誤的機率就越大" },
      { id: "C", text: "α 是檢定力（power），數值越大代表越容易偵測真正的效果" },
      { id: "D", text: "α 代表當虛無假設為真時，仍錯誤拒絕它的機率上限" },
    ],
    answer: "D",
    explanation:
      "顯著水準 α 是控制型一錯誤的門檻，即當虛無假設為真時，仍錯誤拒絕它的機率上限（D）。虛無假設為假卻未拒絕屬型二錯誤（A）；α 越小型一錯誤越不易發生而非越大（B）；檢定力是 1−β、與 α 不同概念（C）。",
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q003",
    subjectId: "senior-bigdata",
    prompt:
      "某網站每分鐘平均有 3 次點擊，且每次點擊互相獨立、平均率穩定。若要計算「下一分鐘內恰好發生 5 次點擊」的機率，下列哪一種機率分布最適合用來建模？",
    choices: [
      { id: "A", text: "二項分布（Binomial）" },
      { id: "B", text: "卜瓦松分布（Poisson）" },
      { id: "C", text: "常態分布（Normal）" },
      { id: "D", text: "均勻分布（Uniform）" },
    ],
    answer: "B",
    explanation:
      "在固定時間區間內、事件獨立且平均發生率穩定的計數情境，適合用卜瓦松分布建模（B）。二項分布用於固定試驗次數下的成功次數（A）；常態分布描述連續對稱資料（C）；均勻分布假設各結果等機率（D），皆不符此計數情境。",
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q004",
    subjectId: "senior-bigdata",
    prompt:
      "為估計全國上班族的平均通勤時間，研究者先將母體依縣市分層，再從各層中隨機抽取受訪者，使各縣市在樣本中的比例貼近母體。此抽樣方法稱為下列何者？",
    choices: [
      { id: "A", text: "便利抽樣（Convenience sampling）" },
      { id: "B", text: "簡單隨機抽樣（Simple random sampling）" },
      { id: "C", text: "雪球抽樣（Snowball sampling）" },
      { id: "D", text: "分層抽樣（Stratified sampling）" },
    ],
    answer: "D",
    explanation:
      "先依特性（縣市）把母體切成數層、再於各層內隨機抽取以維持母體結構比例，屬分層抽樣（D）。便利抽樣只取易接觸的對象（A）；簡單隨機抽樣不先分層、整體一視同仁抽取（B）；雪球抽樣靠受訪者轉介、適用難接觸族群（C）。",
    topic: "L22103 假設檢定與統計推論",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q005",
    subjectId: "senior-bigdata",
    prompt:
      "兩變數的皮爾森相關係數（Pearson correlation）計算為 0.85。下列對此結果的解讀何者最為正確？",
    choices: [
      { id: "A", text: "兩變數之間存在強烈的正向線性關係，但不必然代表因果關係" },
      { id: "B", text: "其中一變數的變動一定是另一變數變動的原因" },
      { id: "C", text: "兩變數之間沒有任何關聯" },
      { id: "D", text: "係數為正代表兩者一定符合線性以外的曲線關係" },
    ],
    answer: "A",
    explanation:
      "皮爾森相關係數 0.85 接近 1，表示強烈的正向線性關係，但相關不等於因果（A）。相關係數高不能推論因果方向（B）；數值遠離 0，並非無關聯（C）；皮爾森係數衡量的是線性關係，正值不代表曲線關係（D）。",
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q006",
    subjectId: "senior-bigdata",
    prompt:
      "某資料集的數值近似常態分布，平均數為 100、標準差為 15。依經驗法則（68-95-99.7 法則），約有 95% 的觀測值落在下列哪一個區間內？",
    choices: [
      { id: "A", text: "85 至 115" },
      { id: "B", text: "55 至 145" },
      { id: "C", text: "70 至 130" },
      { id: "D", text: "40 至 160" },
    ],
    answer: "C",
    explanation:
      "經驗法則（68-95-99.7 法則）中約 95% 的觀測值落在平均數正負 2 個標準差內。μ=100、σ=15，故 ±2σ 區間為 100±2×15＝70 至 130，對應選項 C，為正解。其餘選項：A 的 85 至 115 為 ±1σ（100±15），約涵蓋 68%；B 的 55 至 145 為 ±3σ（100±45），約涵蓋 99.7%；D 的 40 至 160 為 ±4σ（100±60），範圍過寬、遠超 99.7%。因此唯有 C 對應 95%。",
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
  },

  // ── 大數據處理技術（L222）q007–q012 ──
  {
    id: "senior-bigdata-gen-q007",
    subjectId: "senior-bigdata",
    prompt:
      "下列關於關聯式資料庫（RDBMS）與 NoSQL 資料庫差異的敘述，何者最為正確？",
    choices: [
      { id: "A", text: "NoSQL 一律比關聯式資料庫更適合需要強一致性的金融交易" },
      { id: "B", text: "關聯式資料庫以固定結構的資料表與 SQL 為主，NoSQL 多採彈性結構（如文件、鍵值、欄族、圖）以利水平擴展" },
      { id: "C", text: "關聯式資料庫不支援交易（Transaction），NoSQL 才支援" },
      { id: "D", text: "NoSQL 完全無法儲存結構化資料" },
    ],
    answer: "B",
    explanation:
      "關聯式資料庫以固定綱要的資料表與 SQL 操作為主，NoSQL 則採文件、鍵值、欄族或圖等彈性資料模型以利水平擴展（B）。強一致性交易多由 RDBMS 擅長，NoSQL 不必然更適合（A）；RDBMS 正是以交易與 ACID 著稱（C）；NoSQL 同樣能存結構化資料（D）。",
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q008",
    subjectId: "senior-bigdata",
    prompt:
      "在 Apache Spark 中使用 RDD／DataFrame 進行運算時，下列哪一類操作屬於「轉換（Transformation）」而非「行動（Action）」？",
    choices: [
      { id: "A", text: "count()：計算筆數並回傳結果" },
      { id: "B", text: "collect()：把資料收集回驅動程式" },
      { id: "C", text: "filter()：依條件篩選並回傳新的資料集" },
      { id: "D", text: "saveAsTextFile()：將結果寫出到檔案系統" },
    ],
    answer: "C",
    explanation:
      "filter() 依條件產生新的資料集且屬惰性求值，是典型的轉換（Transformation）操作（C）。count()（A）、collect()（B）、saveAsTextFile()（D）都會觸發實際計算並回傳或輸出結果，屬於行動（Action）。轉換在遇到行動前不會真正執行，是 Spark 惰性求值的核心設計。",
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q009",
    subjectId: "senior-bigdata",
    prompt:
      "資料工程中常見的 ETL 流程，其三個階段「Extract、Transform、Load」的正確意涵為下列何者？",
    choices: [
      { id: "A", text: "從來源系統擷取資料、進行清洗與轉換、再載入到目標資料倉儲" },
      { id: "B", text: "先載入資料、再加密、最後刪除原始檔案" },
      { id: "C", text: "先訓練模型、再評估、最後部署上線" },
      { id: "D", text: "先壓縮資料、再備份、最後還原測試" },
    ],
    answer: "A",
    explanation:
      "ETL 指從來源系統擷取（Extract）資料、進行清洗轉換（Transform），再載入（Load）到目標資料倉儲或分析平台（A）。加密刪檔（B）、模型訓練流程（C）與備份還原（D）都不是 ETL 的定義，雖然各為真實作業，但與 ETL 三階段無關。",
    topic: "L22201 數據收集與清理",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q010",
    subjectId: "senior-bigdata",
    prompt:
      "Hadoop 生態系中的 HDFS（Hadoop Distributed File System）採用區塊分割並在多節點複製的設計，其主要目的為下列何者？",
    choices: [
      { id: "A", text: "確保每個檔案只能存在單一節點以節省空間" },
      { id: "B", text: "讓資料僅能以加密形式儲存以符合法規" },
      { id: "C", text: "將大檔案切成區塊分散於多節點並複製多份，以支援大規模平行處理與容錯" },
      { id: "D", text: "強制所有資料都必須是結構化的關聯式資料表" },
    ],
    answer: "C",
    explanation:
      "HDFS 把大檔案切成區塊分散儲存於多個節點，並複製多份，以支援大規模平行處理並在節點故障時維持容錯（C）。它刻意多副本而非單節點存放（A）；其設計重點是分散與容錯而非加密（B）；HDFS 可存放非結構化與半結構化資料，不限關聯式表（D）。",
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q011",
    subjectId: "senior-bigdata",
    prompt:
      "某團隊需要對每日數十億筆、且資料量持續累積的事件日誌進行離線批次彙總分析。下列哪一種架構選擇最為適切？",
    choices: [
      { id: "A", text: "僅用單機的試算表軟體載入全部資料逐列計算" },
      { id: "B", text: "採用分散式運算框架（如 Spark）搭配分散式儲存對巨量日誌做平行批次處理" },
      { id: "C", text: "把所有日誌貼進文書處理軟體再人工統計" },
      { id: "D", text: "改用單一傳統關聯式資料庫的單表並停用任何索引" },
    ],
    answer: "B",
    explanation:
      "面對每日數十億筆且持續累積的日誌批次分析，適合採分散式運算框架（如 Spark）搭配分散式儲存做平行批次處理（B），以橫向擴展承載巨量資料。單機試算表（A）、文書軟體人工統計（C）皆無法承載此規模；單表且停用索引（D）會使查詢效能崩潰。",
    topic: "L22203 數據處理技術與工具",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q012",
    subjectId: "senior-bigdata",
    prompt:
      "在資料庫交易的 ACID 特性中，「一致性（Consistency）」最貼切的意涵為下列何者？",
    choices: [
      { id: "A", text: "交易是不可分割的，全部成功或全部失敗" },
      { id: "B", text: "交易完成後結果會被永久保存，即使系統當機也不遺失" },
      { id: "C", text: "並行交易彼此隔離，互不干擾中間狀態" },
      { id: "D", text: "交易執行前後資料庫都必須維持在符合所有約束與規則的有效狀態" },
    ],
    answer: "D",
    explanation:
      "一致性（Consistency）指交易執行前後，資料庫都維持在符合所有完整性約束與規則的有效狀態（D）。全有全無屬原子性（A）；當機不遺失屬持久性（B）；並行交易互不干擾屬隔離性（C），皆為 ACID 中的其他特性。",
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
  },

  // ── 大數據分析方法與工具（L223）q013–q018 ──
  {
    id: "senior-bigdata-gen-q013",
    subjectId: "senior-bigdata",
    prompt:
      "資料前處理時對數值特徵做「標準化（Standardization，Z-score）」與「Min-Max 正規化」的差異，下列敘述何者最為正確？",
    choices: [
      { id: "A", text: "標準化把資料轉為平均 0、標準差 1；Min-Max 則把資料線性縮放到固定區間（如 0 至 1）" },
      { id: "B", text: "兩者結果完全相同，只是名稱不同" },
      { id: "C", text: "標準化一定會把資料壓到 0 至 1 之間" },
      { id: "D", text: "Min-Max 正規化對離群值不敏感，標準化才會受離群值影響" },
    ],
    answer: "A",
    explanation:
      "標準化把資料轉為平均 0、標準差 1（Z-score），Min-Max 則線性縮放到固定區間如 0 至 1（A）。兩者方法與結果不同（B）；壓到 0–1 是 Min-Max 的效果而非標準化（C）；Min-Max 會被最大最小值的離群值嚴重影響，故對離群值並非不敏感（D）。",
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q014",
    subjectId: "senior-bigdata",
    prompt:
      "對一個「無序」的類別特徵（如顏色：紅、綠、藍），若直接以 Label Encoding 編成 0、1、2 後送入線性模型，可能產生的問題為下列何者？",
    choices: [
      { id: "A", text: "會把資料維度增加到難以計算" },
      { id: "B", text: "會為本無大小關係的類別引入虛假的順序與距離，誤導模型" },
      { id: "C", text: "會使模型完全無法收斂並立即報錯" },
      { id: "D", text: "會自動刪除其中一個類別造成資料遺失" },
    ],
    answer: "B",
    explanation:
      "Label Encoding 把無序類別映成 0、1、2，會讓模型誤以為類別間存在大小順序與距離關係，產生虛假的數值關聯而誤導（B）。增加維度是 One-Hot Encoding 的特性而非 Label Encoding（A）；它通常仍可計算、不必然報錯（C）；它也不會自動刪除類別（D）。",
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q015",
    subjectId: "senior-bigdata",
    prompt:
      "某資料集的「年收入」欄位含有少數極端高值的離群點。若要縮放此特徵且希望「降低離群值對縮放結果的影響」，下列哪一種縮放方式最為合適？",
    choices: [
      { id: "A", text: "Min-Max 正規化，以最大值與最小值為界線性縮放" },
      { id: "B", text: "穩健縮放（Robust Scaling），以中位數與四分位距（IQR）為基準" },
      { id: "C", text: "直接刪除年收入欄位不做任何縮放" },
      { id: "D", text: "把所有值都乘以 100 以放大差異" },
    ],
    answer: "B",
    explanation:
      "穩健縮放（Robust Scaling）以中位數與四分位距（IQR）為基準，受極端值影響較小，最適合含離群值的特徵（B）。Min-Max 以最大最小值為界，反而被離群值嚴重拉扯（A）；刪除整個欄位會損失資訊（C）；乘以常數既不縮放也無助於降低離群值影響（D）。",
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q016",
    subjectId: "senior-bigdata",
    prompt:
      "資料視覺化時，若要呈現「單一連續變數的分布形狀」（例如是否右偏、是否有多峰），下列哪一種圖表最為適合？",
    choices: [
      { id: "A", text: "圓餅圖（Pie chart）" },
      { id: "B", text: "折線圖（Line chart）依時間順序連點" },
      { id: "C", text: "地理熱區地圖（Geographic heatmap）" },
      { id: "D", text: "直方圖（Histogram）" },
    ],
    answer: "D",
    explanation:
      "呈現單一連續變數的分布形狀（偏態、峰數）最適合直方圖（D），它把數值分箱統計次數以顯示分布。圓餅圖適合呈現類別佔比（A）；折線圖適合時間序列趨勢（B）；地理熱區地圖用於空間分布（C），皆非檢視單變數分布形狀的首選。",
    topic: "L22303 數據可視化工具",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q017",
    subjectId: "senior-bigdata",
    prompt:
      "在處理高度類別不平衡（如詐欺交易僅佔 0.5%）的資料集時，下列哪一種做法屬於針對「少數類別過採樣」並能合成新樣本的技術？",
    choices: [
      { id: "A", text: "隨機欠採樣（Random Under-sampling），刪除多數類樣本" },
      { id: "B", text: "直接以整體準確率（Accuracy）作為唯一評估指標" },
      { id: "C", text: "SMOTE，依少數類樣本的近鄰內插合成新的少數類樣本" },
      { id: "D", text: "把所有樣本標籤都改成多數類以提高準確率" },
    ],
    answer: "C",
    explanation:
      "SMOTE（Synthetic Minority Over-sampling Technique）依少數類樣本與其近鄰之間內插，合成新的少數類樣本，屬過採樣且能產生新樣本（C）。隨機欠採樣是刪減多數類而非過採樣（A）；在極不平衡下只看準確率會被多數類主導而失真（B）；竄改標籤是錯誤做法（D）。",
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q018",
    subjectId: "senior-bigdata",
    prompt:
      "對含有多個量級差異很大之數值特徵的資料先做主成分分析（PCA）降維前，通常建議先進行標準化，主要原因為下列何者？",
    choices: [
      { id: "A", text: "PCA 對特徵的變異數敏感，若不先標準化，數值量級大的特徵會主導主成分方向" },
      { id: "B", text: "標準化能保證 PCA 一定不會損失任何資訊" },
      { id: "C", text: "PCA 只能處理已經是 0 至 1 區間的資料，否則無法執行" },
      { id: "D", text: "標準化會自動把類別特徵轉成數值，省去編碼步驟" },
    ],
    answer: "A",
    explanation:
      "PCA 依變異數尋找主成分方向，若特徵量級差異大且未標準化，量級大的特徵會以其大變異數主導主成分（A）。降維本就會捨棄部分變異，標準化無法保證零損失（B）；PCA 不要求輸入須在 0–1 區間（C）；標準化只縮放數值，不會自動編碼類別特徵（D）。",
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
  },

  // ── 大數據在人工智慧之應用（L224）q019–q024 ──
  {
    id: "senior-bigdata-gen-q019",
    subjectId: "senior-bigdata",
    prompt:
      "在機器學習中，「大數據」之所以能提升模型表現，最關鍵的原因為下列何者？",
    choices: [
      { id: "A", text: "只要資料量夠大，模型一定不會過擬合也不需驗證" },
      { id: "B", text: "充足且多樣、具代表性的資料能讓模型學到更廣的樣態，提升泛化能力" },
      { id: "C", text: "資料量越大就能完全免除特徵工程與資料清洗" },
      { id: "D", text: "資料量越大模型的訓練時間就一定越短" },
    ],
    answer: "B",
    explanation:
      "充足、多樣且具代表性的資料能讓模型涵蓋更廣的樣態，從而提升泛化能力（B）。資料多仍可能過擬合、仍需驗證（A）；大數據不會免除特徵工程與清洗，品質與數量同等重要（C）；資料越大訓練通常越久而非越短（D）。",
    topic: "L22401 大數據與機器學習",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q020",
    subjectId: "senior-bigdata",
    prompt:
      "某電商希望以使用者的瀏覽、購買與評分大數據，主動向用戶提供「可能感興趣的商品」清單。下列哪一種大數據結合 AI 的應用最為對應？",
    choices: [
      { id: "A", text: "光學字元辨識（OCR）" },
      { id: "B", text: "語音喚醒詞偵測" },
      { id: "C", text: "資料庫的索引重建（Index rebuild）" },
      { id: "D", text: "推薦系統（Recommendation System）" },
    ],
    answer: "D",
    explanation:
      "依使用者行為大數據主動推送可能感興趣的商品，屬推薦系統的典型應用（D），常用協同過濾或內容式推薦。OCR 用於影像文字辨識（A）；語音喚醒詞偵測屬語音應用（B）；索引重建是資料庫維運作業（C），皆與個人化商品推薦無關。",
    topic: "L22302 常見的大數據分析方法",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q021",
    subjectId: "senior-bigdata",
    prompt:
      "企業在以含個資的大數據訓練 AI 模型時，為兼顧分析價值與隱私保護，下列哪一種做法最為合適？",
    choices: [
      { id: "A", text: "把含完整姓名與身分證號的原始資料原封不動地提供給所有開發人員" },
      { id: "B", text: "只要資料存放在雲端，就無須再考慮任何隱私處理" },
      { id: "C", text: "把個資公開上網以增加資料多樣性" },
      { id: "D", text: "於訓練前對直接識別欄位進行去識別化或假名化，並對資料存取做權限控管與稽核" },
    ],
    answer: "D",
    explanation:
      "兼顧分析價值與隱私的做法是訓練前對直接識別欄位去識別化或假名化，並對資料存取施以權限控管與稽核（D）。原始個資不設限地散布（A）、誤以為上雲就免處理（B）、或公開個資（C）都會擴大隱私與合規風險，並非負責任的資料治理。",
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q022",
    subjectId: "senior-bigdata",
    prompt:
      "多家醫院想共同訓練一個疾病預測模型，但因法規與隱私限制，病患原始資料不能離開各院。下列哪一種技術最能在「資料不集中」的前提下協作訓練？",
    choices: [
      { id: "A", text: "把各院資料全部複製到單一中央伺服器後再訓練" },
      { id: "B", text: "要求各院把原始病歷直接公開分享" },
      { id: "C", text: "聯邦學習（Federated Learning），資料留在本地、只交換模型參數或梯度" },
      { id: "D", text: "停止使用任何機器學習，全部改人工統計" },
    ],
    answer: "C",
    explanation:
      "聯邦學習（Federated Learning）讓資料留在各機構本地，只在參與方間交換模型參數或梯度更新以協作訓練，符合資料不集中的需求（C）。集中複製（A）與公開原始病歷（B）都違反隱私限制；改人工統計（D）放棄了模型協作的目的。",
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q023",
    subjectId: "senior-bigdata",
    prompt:
      "在資料治理（Data Governance）中，「資料品質（Data Quality）」對下游 AI 模型的影響，下列敘述何者最為正確？",
    choices: [
      { id: "A", text: "只要模型演算法夠先進，訓練資料品質就不影響結果" },
      { id: "B", text: "資料量越多，標註錯誤與雜訊就會自動互相抵銷而無須在意品質" },
      { id: "C", text: "訓練資料若存在系統性偏誤或大量錯誤標註，模型容易學到並放大這些偏誤，影響可信度" },
      { id: "D", text: "資料品質僅影響報表美觀，與模型預測無關" },
    ],
    answer: "C",
    explanation:
      "若訓練資料存在系統性偏誤或大量錯誤標註，模型會學到甚至放大這些偏誤，損害預測可信度（C），呼應「垃圾進、垃圾出」。再先進的演算法也無法彌補劣質資料（A）；偏誤具系統性時不會因量大而自動抵銷（B）；資料品質直接關乎模型表現而不只影響報表外觀（D）。",
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "senior-bigdata-gen-q024",
    subjectId: "senior-bigdata",
    prompt:
      "某串流影音平台要對「即時」湧入的使用者點擊事件，立刻更新個人化推薦並偵測異常流量。相較於僅做每日批次處理，下列哪一種資料處理取向最能滿足此即時需求？",
    choices: [
      { id: "A", text: "串流處理（Stream Processing），對連續到達的事件做近即時的逐筆或微批次運算" },
      { id: "B", text: "每月把資料匯出成報表後人工檢視" },
      { id: "C", text: "等資料累積一整年後再一次性訓練模型" },
      { id: "D", text: "把所有即時事件先列印成紙本後再輸入系統" },
    ],
    answer: "A",
    explanation:
      "即時更新推薦並偵測異常流量需要串流處理（Stream Processing），對連續到達的事件以近即時的逐筆或微批次方式運算（A）。每月人工報表（B）、累積一年再訓練（C）、列印紙本再輸入（D）都帶來過長延遲，無法滿足即時性要求。",
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
  },
];
