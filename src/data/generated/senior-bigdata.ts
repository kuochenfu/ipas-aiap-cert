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
      { id: "C", text: "分布近似對稱，平均數與中位數相差 4 公克應視為抽樣誤差" },
      { id: "D", text: "分布呈左偏，因為中位數較小代表多數資料集中在偏小的一側" },
    ],
    answer: "A",
    explanation:
      "當平均數（50）大於中位數（46）時，通常表示右尾較長，即右偏（正偏），少數偏大的數值會把平均數往上拉（A）。左偏的分布（B）平均數會小於中位數，方向與題目相反；把 4 公克落差視為抽樣誤差（C）缺乏依據，在不知道標準差的情況下不能就此斷定分布對稱；以中位數較小推論左偏（D）弄錯了判斷方向，偏態看的是長尾在哪一側，平均數大於中位數代表右尾較長。",
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
      { id: "B", text: "兩變數高度相關，因此可推論其中一變數的變動導致另一變數變動" },
      { id: "C", text: "兩變數為中度相關，相關係數需超過 0.95 才能稱為強相關" },
      { id: "D", text: "兩變數呈正相關，且約 85% 的變異可由另一變數解釋" },
    ],
    answer: "A",
    explanation:
      "皮爾森相關係數 0.85 接近 1，表示強烈的正向線性關係，但相關不等於因果（A）。由高相關推論因果（B）並不成立，兩者可能同受混淆變數影響；以 0.95 為強相關門檻（C）不符一般慣例，0.85 通常已歸為強相關；把 0.85 當成可解釋 85% 變異（D）是混淆了 r 與判定係數，可解釋比例應為 r²，約 0.72。",
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
      { id: "A", text: "NoSQL 因採分散式架構且省略綱要檢查，比關聯式資料庫更適合強一致性的金融交易" },
      { id: "B", text: "關聯式資料庫以固定綱要的資料表與 SQL 為主，NoSQL 多採彈性資料模型以利水平擴展" },
      { id: "C", text: "關聯式資料庫以水平擴展見長，NoSQL 則以固定綱要與嚴格的 ACID 交易為主要特色" },
      { id: "D", text: "NoSQL 只適合儲存非結構化資料，資料若有固定欄位就應改用關聯式資料庫" },
    ],
    answer: "B",
    explanation:
      "關聯式資料庫以固定綱要的資料表與 SQL 操作為主，NoSQL 則採文件、鍵值、欄族或圖等彈性資料模型以利水平擴展（B）。說 NoSQL 更適合強一致性交易（A）是誤解，分散式與省略綱要反而讓多數 NoSQL 偏向最終一致性，強一致性交易多由 RDBMS 擅長；C 把兩者特色對調了，水平擴展是 NoSQL 的強項，ACID 交易則是 RDBMS 的招牌；說 NoSQL 只適合非結構化資料（D）也不對，鍵值與欄族模型常用於固定欄位的大量紀錄。",
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
      { id: "B", text: "先把原始資料載入目標系統、再於目標端轉換，最後擷取成報表" },
      { id: "C", text: "擷取資料的結構描述、轉換為加密格式、再載入備份系統保存" },
      { id: "D", text: "從資料倉儲匯出資料、轉換為報表格式、再載入給業務人員檢視" },
    ],
    answer: "A",
    explanation:
      "ETL 指從來源系統擷取（Extract）資料、進行清洗轉換（Transform），再載入（Load）到目標資料倉儲或分析平台（A）。先載入再轉換的流程（B）較接近 ELT，且最後一步也不是擷取報表；把結構描述加密後備份（C）屬資料保護作業，ETL 搬移與轉換的是資料內容本身；D 把資料流向倒過來，從倉儲匯出報表屬下游的報表作業而非 ETL。",
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
      { id: "A", text: "將檔案集中存放於單一主節點，再由其他節點快取以節省儲存空間" },
      { id: "B", text: "以區塊分割搭配多副本來加密資料，使任一節點都讀不出完整內容" },
      { id: "C", text: "將大檔案切成區塊分散於多節點並複製多份，以支援平行處理與容錯" },
      { id: "D", text: "將資料轉為關聯式資料表分散儲存，以支援跨節點的 SQL 交易" },
    ],
    answer: "C",
    explanation:
      "HDFS 把大檔案切成區塊分散儲存於多個節點，並複製多份，以支援大規模平行處理並在節點故障時維持容錯（C）。集中於單一主節點的說法（A）不對，HDFS 的 NameNode 只管中繼資料，資料本身分散在多個 DataNode，且多副本會增加而非節省空間；把區塊與副本當成加密機制（B）是張冠李戴，它們是為了分散與容錯；轉為關聯式資料表的說法（D）也錯，HDFS 是檔案系統，可存放非結構化與半結構化資料，不負責 SQL 交易。",
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
      { id: "A", text: "採用單機高階伺服器搭配記憶體內運算，以免除分散式架構的網路傳輸開銷" },
      { id: "B", text: "採用分散式運算框架（如 Spark）搭配分散式儲存做平行批次處理" },
      { id: "C", text: "改用串流處理引擎逐筆即時計算，因為批次架構難以承載每日數十億筆資料" },
      { id: "D", text: "改用單一傳統關聯式資料庫，並為每個欄位都建立索引以加速大量彙總查詢" },
    ],
    answer: "B",
    explanation:
      "面對每日數十億筆且持續累積的日誌批次分析，適合採分散式運算框架（如 Spark）搭配分散式儲存做平行批次處理（B），以橫向擴展承載巨量資料。單機高階伺服器（A）屬垂直擴充，終究有上限，資料持續累積後記憶體與磁碟都會不敷使用；改用串流引擎（C）不符需求，題目要的是離線批次彙總，串流是為低延遲而設計，分散式批次處理本就能承載此規模；單一關聯式資料庫（D）難以橫向擴展，對每個欄位建索引還會拖慢大量寫入。",
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
      { id: "A", text: "交易是不可分割的，所有步驟必須全部成功或全部撤銷" },
      { id: "B", text: "交易一旦提交，結果會永久寫入儲存裝置，即使系統當機也不會遺失" },
      { id: "C", text: "多筆並行交易彼此隔離，不會看到其他交易的中間狀態" },
      { id: "D", text: "交易前後資料庫都維持在符合所有約束與規則的有效狀態" },
    ],
    answer: "D",
    explanation:
      "一致性（Consistency）指交易執行前後，資料庫都維持在符合所有完整性約束與規則的有效狀態（D）。全有全無屬原子性（A）；提交後當機不遺失屬持久性（B）；並行交易互不干擾中間狀態屬隔離性（C），皆為 ACID 中的其他特性。",
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
      { id: "A", text: "標準化轉為平均 0、標準差 1；Min-Max 則線性縮放到固定區間" },
      { id: "B", text: "兩者都轉為平均 0、標準差 1，差別在 Min-Max 會先去除離群值" },
      { id: "C", text: "標準化線性縮放到 0 至 1；Min-Max 則轉為平均 0、標準差 1" },
      { id: "D", text: "Min-Max 對離群值較不敏感，資料含極端值時比標準化更合適" },
    ],
    answer: "A",
    explanation:
      "標準化把資料轉為平均 0、標準差 1（Z-score），Min-Max 則線性縮放到固定區間如 0 至 1（A）。說兩者都轉為平均 0、標準差 1（B）不對，Min-Max 的結果落在固定區間，也不會自動去除離群值；C 把兩者的效果對調了，壓到 0–1 是 Min-Max 而非標準化；說 Min-Max 對離群值較不敏感（D）恰好相反，它以最大最小值為界，會被離群值嚴重影響。",
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
      { id: "A", text: "會把資料維度擴增成與類別數相同的欄數，使特徵矩陣過於稀疏" },
      { id: "B", text: "會為本無大小關係的類別引入虛假的順序與距離，誤導模型" },
      { id: "C", text: "會使線性模型出現完全共線性，導致係數無法估計而訓練失敗" },
      { id: "D", text: "會讓三個編碼值在加總時互相抵銷，使模型無法區分這些類別" },
    ],
    answer: "B",
    explanation:
      "Label Encoding 把無序類別映成 0、1、2，會讓模型誤以為類別間存在大小順序與距離關係，產生虛假的數值關聯而誤導（B）。維度擴增成類別數（A）是 One-Hot Encoding 的特性，Label Encoding 只產生一欄；完全共線性（C）是 One-Hot 保留全部虛擬變數時的虛擬變數陷阱，單一整數欄不會造成；編碼值互相抵銷（D）並不會發生，0、1、2 是不同數值，模型仍可區分，問題在於虛假的順序。",
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
      { id: "B", text: "穩健縮放（Robust Scaling），以中位數與四分位距為基準" },
      { id: "C", text: "標準化（Z-score），以平均數與標準差為基準來縮放" },
      { id: "D", text: "最大絕對值縮放（MaxAbs），以欄位絕對值的最大值為基準" },
    ],
    answer: "B",
    explanation:
      "穩健縮放（Robust Scaling）以中位數與四分位距（IQR）為基準，受極端值影響較小，最適合含離群值的特徵（B）。Min-Max（A）以最大最小值為界，反而被離群值嚴重拉扯；標準化（C）的平均數與標準差都會被極端高值拉大，仍明顯受離群值影響；MaxAbs（D）以最大絕對值為分母，一個極端高值就會把其餘資料壓縮到接近 0。",
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
      { id: "A", text: "PCA 依變異數找主成分，未標準化時量級大的特徵會主導主成分方向" },
      { id: "B", text: "標準化能先讓各特徵彼此不相關，PCA 才能找出互相正交的主成分" },
      { id: "C", text: "PCA 要求輸入服從常態分布，標準化可把各特徵轉成標準常態分布" },
      { id: "D", text: "標準化能先剔除離群值，避免 PCA 的共變異數矩陣無法計算" },
    ],
    answer: "A",
    explanation:
      "PCA 依變異數尋找主成分方向，若特徵量級差異大且未標準化，量級大的特徵會以其大變異數主導主成分（A）。說標準化能讓特徵彼此不相關（B）並不正確，它只改變尺度，主成分的正交性來自特徵分解本身；說 PCA 要求常態分布（C）也不對，標準化只平移縮放、不會改變分布形狀；說標準化能剔除離群值（D）同樣錯誤，共變異數矩陣在有離群值時照樣可以計算。",
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
      { id: "A", text: "大量資料讓模型能記住更多樣本，訓練誤差越低，泛化能力就越好" },
      { id: "B", text: "充足、多樣、具代表性的資料讓模型學到更廣樣態，提升泛化能力" },
      { id: "C", text: "資料量夠大時雜訊會互相抵銷，因此可省略大部分的資料清洗工作" },
      { id: "D", text: "資料量越大，模型所需的參數就越少，訓練與推論都會因此變得更快" },
    ],
    answer: "B",
    explanation:
      "充足、多樣且具代表性的資料能讓模型涵蓋更廣的樣態，從而提升泛化能力（B）。以記住樣本、壓低訓練誤差來論泛化（A）是倒果為因，那正是過擬合的徵兆，仍需驗證；以雜訊互相抵銷為由省略清洗（C）不成立，系統性錯誤不會因量大而抵銷，品質與數量同等重要；說資料越大所需參數越少（D）並無根據，資料越大訓練通常越久而非越短。",
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
      { id: "A", text: "異常偵測（Anomaly Detection）" },
      { id: "B", text: "時間序列預測（Time Series Forecasting）" },
      { id: "C", text: "情緒分析（Sentiment Analysis）" },
      { id: "D", text: "推薦系統（Recommendation System）" },
    ],
    answer: "D",
    explanation:
      "依使用者行為大數據主動推送可能感興趣的商品，屬推薦系統的典型應用（D），常用協同過濾或內容式推薦。異常偵測（A）用於找出偏離常態的行為，如詐欺交易；時間序列預測（B）估計整體銷量等未來走勢，不針對個別用戶產生清單；情緒分析（C）判讀評論文字的正負向，可作為輔助訊號，但本身不產生個人化商品推薦。",
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
      { id: "A", text: "對身分證號做雜湊後便公開釋出資料集，因為雜湊值無法回推原始個資" },
      { id: "B", text: "資料加密存放於雲端，訓練時解密後開放全體開發人員自由查詢" },
      { id: "C", text: "刪除姓名與身分證號後保留其餘欄位，即可視為匿名資料而不受規範" },
      { id: "D", text: "訓練前對直接識別欄位去識別化或假名化，並控管與稽核資料存取" },
    ],
    answer: "D",
    explanation:
      "兼顧分析價值與隱私的做法是訓練前對直接識別欄位去識別化或假名化，並對資料存取施以權限控管與稽核（D）。雜湊後公開釋出（A）仍有再識別風險，身分證號空間有限，雜湊值可被窮舉比對回推；加密存放後開放全員查詢（B）違反最小權限原則，加密只保護靜態儲存；只刪直接識別欄位（C）不等於匿名，生日、郵遞區號等間接識別欄位組合後仍可能識別個人。",
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
      { id: "A", text: "資料湖（Data Lake），將各院原始資料匯集後統一治理再訓練" },
      { id: "B", text: "差分隱私（Differential Privacy），對集中後的病歷加入雜訊再訓練" },
      { id: "C", text: "聯邦學習（Federated Learning），資料留在本地、只交換模型更新" },
      { id: "D", text: "集成學習（Ensemble Learning），彙整各院資料後訓練多個模型投票" },
    ],
    answer: "C",
    explanation:
      "聯邦學習（Federated Learning）讓資料留在各機構本地，只在參與方間交換模型參數或梯度更新以協作訓練，符合資料不集中的需求（C）。資料湖（A）需把原始資料匯集到中央，違反資料不能離院的限制；差分隱私（B）保護的是輸出或統計結果，此處的做法仍須先把病歷集中，不符前提；集成學習（D）是組合多個模型的方法，題目所述仍須彙整各院資料，未解決資料不集中的問題。",
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
      { id: "A", text: "先進的深度模型具備強大表徵能力，能自行學會忽略訓練資料中的錯誤標註" },
      { id: "B", text: "資料量夠大時，標註錯誤與系統性偏誤會互相抵銷，對模型的影響可以忽略" },
      { id: "C", text: "訓練資料若有系統性偏誤或大量錯誤標註，模型容易學到並放大這些偏誤" },
      { id: "D", text: "資料品質主要影響模型的訓練速度，對預測準確度與公平性的影響有限" },
    ],
    answer: "C",
    explanation:
      "若訓練資料存在系統性偏誤或大量錯誤標註，模型會學到甚至放大這些偏誤，損害預測可信度（C），呼應「垃圾進、垃圾出」。說深度模型能自行忽略錯誤標註（A）不成立，表徵能力強的模型反而更容易記住錯誤標註；說偏誤會因量大而抵銷（B）也錯，偏誤具系統性時不會自動抵銷；說品質主要影響訓練速度（D）低估了問題，資料品質直接關乎模型的準確度與公平性。",
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
      { id: "A", text: "串流處理（Stream Processing），對連續到達的事件做近即時運算" },
      { id: "B", text: "批次處理（Batch Processing），每小時彙整一次事件後重新訓練" },
      { id: "C", text: "資料倉儲（Data Warehouse），載入事件後以排程 SQL 定期彙總" },
      { id: "D", text: "冷儲存歸檔（Cold Storage），先封存事件再依分析需求調出" },
    ],
    answer: "A",
    explanation:
      "即時更新推薦並偵測異常流量需要串流處理（Stream Processing），對連續到達的事件以近即時的逐筆或微批次方式運算（A）。每小時批次彙整（B）雖比每日批次快，仍有最長一小時的延遲，無法立刻反應；資料倉儲的排程彙總（C）適合歷史分析，同樣是定期而非即時；冷儲存歸檔（D）為低成本長期保存設計，調出資料的延遲更長。",
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
  },
];
