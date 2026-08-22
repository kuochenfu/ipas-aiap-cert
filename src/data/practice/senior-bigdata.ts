import type { Question } from "../types";

// 依評鑑內容節點分批撰寫；配額見 src/domain/assessmentTopics.ts。
// 內容為 LLM 產出，正確性需人工複審。
export const practiceQuestions: Question[] = [
  // ── L22101 敘述性統計與資料摘要技術（8 題）────────────────────
  {
    id: "senior-bigdata-practice-q001",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行分析客戶年收入，發現少數超高收入客戶把平均數往上拉，多數客戶的收入遠低於平均。若要向主管描述「一般客戶」的收入水準，下列何者最適合？",
    choices: [
      { id: "A", text: "平均數" },
      { id: "B", text: "中位數" },
      { id: "C", text: "最大值" },
      { id: "D", text: "全距" },
    ],
    answer: "B",
    explanation:
      "收入資料典型右偏，少數極端值會把平均數拉高，使其不再代表多數人的水準。中位數只看排序後的中間位置，不受極端值影響，最能描述「一般客戶」。",
    choiceExplanations: {
      A: "平均數會被少數超高收入者拉高，正是題幹指出的問題，用它描述一般客戶會高估。",
      C: "最大值只反映最極端的那一位客戶，完全不能代表多數人。",
      D: "全距是最大值減最小值，描述的是散布範圍而非集中位置。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q002",
    subjectId: "senior-bigdata",
    prompt:
      "工廠量測兩條產線的產品重量，兩者平均值相同但 A 線的標準差明顯大於 B 線。此結果代表下列何者？",
    choices: [
      { id: "A", text: "A 線的產品重量比較重" },
      { id: "B", text: "A 線的產量比較高" },
      { id: "C", text: "A 線的重量變異較大、穩定度較差" },
      { id: "D", text: "兩條線的品質完全相同" },
    ],
    answer: "C",
    explanation:
      "標準差衡量的是資料相對於平均的離散程度。平均相同但標準差較大，代表 A 線的重量忽高忽低、一致性較差，在品質管理上通常意味著製程需要調整。",
    choiceExplanations: {
      A: "平均值相同代表整體重量水準一致，標準差不提供「比較重」的資訊。",
      B: "標準差描述的是變異程度，與產出數量沒有任何關係。",
      D: "平均相同但離散程度不同，品質表現其實有明顯差異。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q003",
    subjectId: "senior-bigdata",
    prompt:
      "醫院要摘要病患住院天數的分布，並特別關注「最久的那一成病患」。下列哪一種統計量最適合？",
    choices: [
      { id: "A", text: "算術平均" },
      { id: "B", text: "眾數" },
      { id: "C", text: "第 90 百分位數" },
      { id: "D", text: "變異數" },
    ],
    answer: "C",
    explanation:
      "第 90 百分位數是「有 90% 的病患住院天數低於此值」的門檻，正好界定出最久的那一成。百分位數是描述分布尾端最直接的工具。",
    choiceExplanations: {
      A: "平均把所有病患混在一起，無法單獨描述最久的那一成。",
      B: "眾數是出現最頻繁的天數，反映的是最常見情況而非尾端。",
      D: "變異數描述整體離散程度，不指出任何特定的分位位置。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q004",
    subjectId: "senior-bigdata",
    prompt:
      "資料分析師以盒鬚圖（Box Plot）呈現各分店的銷售分布。盒子的上下邊界通常代表下列何者？",
    choices: [
      { id: "A", text: "第三四分位數與第一四分位數" },
      { id: "B", text: "最大值與最小值" },
      { id: "C", text: "平均值加減一個標準差" },
      { id: "D", text: "第 95 與第 5 百分位數" },
    ],
    answer: "A",
    explanation:
      "盒鬚圖的盒身由第一四分位數（Q1）到第三四分位數（Q3）構成，中間橫線為中位數，盒身高度即四分位距（IQR），用來描述中間 50% 資料的集中範圍。",
    choiceExplanations: {
      B: "最大最小值通常由鬚線的端點或離群點呈現，不是盒身的邊界。",
      C: "平均加減標準差是另一種描述方式，不是盒鬚圖的構成規則。",
      D: "第 95 與第 5 百分位數屬於尾端描述，標準盒鬚圖不以此定義盒身。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q005",
    subjectId: "senior-bigdata",
    prompt:
      "農產品價格資料呈現明顯右偏（少數高價拉長右尾）。關於平均數與中位數的關係，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者的關係與偏態無關" },
      { id: "B", text: "平均數通常小於中位數" },
      { id: "C", text: "兩者必定相等" },
      { id: "D", text: "平均數通常大於中位數" },
    ],
    answer: "D",
    explanation:
      "右偏分布的長尾在高值端，這些極端值會把平均數往上拉，而中位數只看中間位置不受影響，因此平均數通常大於中位數。左偏則相反。",
    choiceExplanations: {
      A: "偏態的方向正是決定兩者大小關係的因素，不能說無關。",
      B: "平均數小於中位數是左偏（長尾在低值端）的特徵，與題幹描述相反。",
      C: "只有在對稱分布時兩者才會相等，右偏分布不符合此條件。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q006",
    subjectId: "senior-bigdata",
    prompt:
      "分析教學平台的課程完成率時，發現同一份資料若以「所有註冊者」或「有實際上課者」為分母，結論差異極大。此現象最直接提醒分析者注意下列何者？",
    choices: [
      { id: "A", text: "圖表配色會影響數值" },
      { id: "B", text: "應該一律使用平均數" },
      { id: "C", text: "資料量越大越不會出錯" },
      { id: "D", text: "統計量的定義與分母選擇會直接改變結論" },
    ],
    answer: "D",
    explanation:
      "比率的意義完全取決於分子分母怎麼定義。同樣叫「完成率」，分母換掉就是兩個不同的指標，報告中必須明確寫出定義，否則讀者會做出錯誤解讀。",
    choiceExplanations: {
      A: "配色屬於視覺呈現，不會改變計算出來的數值。",
      B: "問題出在指標定義，不是選用哪一種集中趨勢統計量。",
      C: "資料量再大，定義不清造成的誤導依然存在，甚至更具說服力而更危險。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q007",
    subjectId: "senior-bigdata",
    prompt:
      "以四分位距（IQR）判定離群值時，常用的規則是超出下列哪一個範圍者視為離群？",
    choices: [
      { id: "A", text: "Q1 − 1.5×IQR 到 Q3 + 1.5×IQR" },
      { id: "B", text: "平均值 ± 0.5 個標準差" },
      { id: "C", text: "中位數 ± 1 個全距" },
      { id: "D", text: "最小值到最大值" },
    ],
    answer: "A",
    explanation:
      "IQR 法以 Q1 − 1.5×IQR 與 Q3 + 1.5×IQR 為上下界，超出者標為離群值。它只依賴分位數，不受極端值本身影響，因此在偏態資料上比標準差法穩健。",
    choiceExplanations: {
      B: "平均與標準差本身就會被離群值拉動，且 0.5 個標準差的範圍過窄，會把大量正常值誤判為離群。",
      C: "全距是最大減最小，本身就由極端值決定，用它當半徑沒有判別力。",
      D: "最小到最大涵蓋了全部資料，依此規則不會有任何點被判為離群。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q008",
    subjectId: "senior-bigdata",
    prompt:
      "某報表以「本月客訴平均處理時間 2.5 小時」呈現成效，但實際上有三成案件超過 8 小時。此報表最主要的問題是下列何者？",
    choices: [
      { id: "A", text: "使用了小時作為單位" },
      { id: "B", text: "只用單一集中趨勢統計量，掩蓋了分布的離散與尾端狀況" },
      { id: "C", text: "報表更新頻率太高" },
      { id: "D", text: "沒有使用彩色圖表" },
    ],
    answer: "B",
    explanation:
      "平均值把整個分布壓成一個數字，長尾與變異完全看不見。要誠實呈現服務品質，應同時給出中位數、高分位數（如 P90）或超時案件比例。",
    choiceExplanations: {
      A: "單位選擇不影響結論是否被誤導，改成分鐘一樣掩蓋尾端。",
      C: "更新頻率與統計量是否具代表性無關。",
      D: "配色是呈現形式，無法補救統計量本身選錯的問題。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },

  // ── L22102 機率分佈與資料分佈模型（8 題）──────────────────────
  {
    id: "senior-bigdata-practice-q009",
    subjectId: "senior-bigdata",
    prompt:
      "工廠統計「每小時到達檢修站的機台故障次數」，此類「單位時間內事件發生次數」的資料最適合以下列哪一種分布建模？",
    choices: [
      { id: "A", text: "常態分布" },
      { id: "B", text: "卜瓦松分布（Poisson）" },
      { id: "C", text: "均勻分布" },
      { id: "D", text: "二項分布" },
    ],
    answer: "B",
    explanation:
      "卜瓦松分布描述在固定時間或空間內、事件以固定平均率獨立發生的次數，正好對應「每小時故障幾次」這種計數資料。",
    choiceExplanations: {
      A: "常態分布描述連續且對稱的變量，計數資料為非負整數且常呈右偏，並不適合。",
      C: "均勻分布假設所有結果機率相同，故障次數顯然不是每個數字等機率。",
      D: "二項分布描述固定試驗次數下的成功次數，本題並沒有明確的試驗次數上限。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q010",
    subjectId: "senior-bigdata",
    prompt:
      "銀行想模擬「100 位申請人中有幾位會違約」，已知每位違約機率相同且互相獨立。此情境最適合的分布是下列何者？",
    choices: [
      { id: "A", text: "常態分布" },
      { id: "B", text: "指數分布" },
      { id: "C", text: "二項分布" },
      { id: "D", text: "卜瓦松分布" },
    ],
    answer: "C",
    explanation:
      "固定試驗次數（100 位）、每次成敗兩種結果、機率相同且互相獨立，這四個條件正是二項分布的定義。",
    choiceExplanations: {
      A: "常態分布為連續分布；雖然在 n 大時可作近似，但本題的原始機制是二項。",
      B: "指數分布描述的是事件之間的等待時間，屬於連續變量，與計算人數不符。",
      D: "卜瓦松適用於沒有明確試驗次數上限的計數，本題明確有 100 位的上限。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q011",
    subjectId: "senior-bigdata",
    prompt:
      "關於常態分布的「68-95-99.7 法則」，下列敘述何者正確？",
    choices: [
      { id: "A", text: "約 95% 的資料落在平均值 ±1 個標準差之內" },
      { id: "B", text: "約 68% 的資料落在平均值 ±2 個標準差之內" },
      { id: "C", text: "約 68% 的資料落在平均值 ±1 個標準差之內" },
      { id: "D", text: "約 99.7% 的資料落在平均值 ±1 個標準差之內" },
    ],
    answer: "C",
    explanation:
      "常態分布下，±1 個標準差涵蓋約 68%、±2 個約 95%、±3 個約 99.7%。這組數字是判斷資料是否異常的常用直覺基準。",
    choiceExplanations: {
      A: "±1 個標準差對應約 68%，達到 95% 需要 ±2 個標準差。",
      B: "±2 個標準差對應的是約 95%，不是 68%。",
      D: "±1 個標準差遠達不到 99.7%，後者需要 ±3 個標準差。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q012",
    subjectId: "senior-bigdata",
    prompt:
      "醫院分析「病患兩次回診之間的間隔天數」，此類等待時間資料最常以下列哪一種分布描述？",
    choices: [
      { id: "A", text: "指數分布" },
      { id: "B", text: "二項分布" },
      { id: "C", text: "伯努利分布" },
      { id: "D", text: "均勻分布" },
    ],
    answer: "A",
    explanation:
      "指數分布描述在事件以固定平均率發生的前提下，兩次事件之間的等待時間，是最常用來建模間隔時間的連續分布。",
    choiceExplanations: {
      B: "二項分布計算的是固定次數試驗中的成功數，是離散計數而非時間長度。",
      C: "伯努利分布只描述單次試驗的成敗，不涉及時間。",
      D: "均勻分布假設所有間隔等機率，但實務上短間隔通常比極長間隔常見。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q013",
    subjectId: "senior-bigdata",
    prompt:
      "「中央極限定理」最主要說明下列何者？",
    choices: [
      { id: "A", text: "只要資料量夠大就不需要抽樣" },
      { id: "B", text: "所有母體資料都會呈現常態分布" },
      { id: "C", text: "樣本數越大，母體標準差越小" },
      { id: "D", text: "在樣本數夠大時，樣本平均數的抽樣分布會趨近常態分布" },
    ],
    answer: "D",
    explanation:
      "中央極限定理談的是「樣本平均數」這個統計量的分布：不論母體本身是什麼形狀，只要樣本夠大且獨立同分布，樣本平均的抽樣分布就趨近常態。這是許多推論方法成立的基礎。",
    choiceExplanations: {
      A: "資料量大不代表就是母體全體，且抽樣仍是控制成本與時效的常用手段。",
      B: "母體本身可以是任何形狀，定理保證的是樣本平均的分布，不是母體的分布。",
      C: "母體標準差是母體的固有性質，不會因為抽了多少樣本而改變。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q014",
    subjectId: "senior-bigdata",
    prompt:
      "農業資料中，某作物產量的直方圖呈現明顯的雙峰。最合理的初步推論是下列何者？",
    choices: [
      { id: "A", text: "雙峰代表資料量不足" },
      { id: "B", text: "資料一定有錯誤，應全部刪除" },
      { id: "C", text: "應直接以平均值代表整體" },
      { id: "D", text: "資料可能混合了兩個性質不同的子群體" },
    ],
    answer: "D",
    explanation:
      "雙峰通常意味著樣本裡混了兩種不同機制的群體（例如兩個品種、兩種栽培方式）。正確做法是找出區分變數並分開分析，而不是硬用單一分布去描述。",
    choiceExplanations: {
      A: "資料量不足會讓直方圖崎嶇不平，但不會產生兩個穩定的峰。",
      B: "雙峰是真實存在的結構特徵，不是錯誤，刪除等於丟掉最有價值的線索。",
      C: "雙峰分布的平均值往往落在兩峰之間的低谷，反而不代表任何一群。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q015",
    subjectId: "senior-bigdata",
    prompt:
      "資料分析時把數值轉換為 Z 分數（標準分數），其意義是下列何者？",
    choices: [
      { id: "A", text: "該數值距離平均值幾個標準差" },
      { id: "B", text: "該數值在資料中的排名" },
      { id: "C", text: "該數值出現的次數" },
      { id: "D", text: "該數值的絕對大小" },
    ],
    answer: "A",
    explanation:
      "Z = (x − 平均) / 標準差，衡量的是該值偏離平均多少個標準差。經標準化後，不同單位、不同量級的變數就能放在同一個尺度上比較。",
    choiceExplanations: {
      B: "排名對應的是百分位數或次序統計量，與 Z 分數的定義不同。",
      C: "出現次數是次數分配的概念，Z 分數與頻率無關。",
      D: "Z 分數刻意去除了原始單位與量級，正是為了讓絕對大小不再主導比較。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q016",
    subjectId: "senior-bigdata",
    prompt:
      "分析師想檢查資料是否近似常態分布，下列哪一種圖最直接？",
    choices: [
      { id: "A", text: "圓餅圖" },
      { id: "B", text: "Q-Q 圖（分位數對分位數圖）" },
      { id: "C", text: "堆疊長條圖" },
      { id: "D", text: "甘特圖" },
    ],
    answer: "B",
    explanation:
      "Q-Q 圖把資料的分位數與理論常態分位數對畫，若點大致落在一條直線上就代表接近常態，偏離的形狀還能提示是偏態還是厚尾。",
    choiceExplanations: {
      A: "圓餅圖呈現的是類別佔比，無法判斷連續變數的分布形狀。",
      C: "堆疊長條圖比較的是各類別的組成，同樣不用於檢驗分布假設。",
      D: "甘特圖用於專案排程，與統計分布毫無關係。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },

  // ── L22103 假設檢定與統計推論（8 題）──────────────────────────
  {
    id: "senior-bigdata-practice-q017",
    subjectId: "senior-bigdata",
    prompt:
      "某次假設檢定得到 p 值為 0.03，顯著水準設定為 0.05。下列判讀何者最正確？",
    choices: [
      { id: "A", text: "有 97% 的機率虛無假設為假" },
      { id: "B", text: "在 0.05 的顯著水準下拒絕虛無假設" },
      { id: "C", text: "接受虛無假設" },
      { id: "D", text: "此結果證明對立假設必然為真" },
    ],
    answer: "B",
    explanation:
      "p 值小於顯著水準即拒絕虛無假設。p 值的意義是「若虛無假設為真，觀察到此結果或更極端結果的機率」，並不是虛無假設為真或為假的機率。",
    choiceExplanations: {
      A: "這是對 p 值最常見的誤解；p 值是在虛無假設成立前提下的資料機率，不是假設本身的機率。",
      C: "p 值小於顯著水準時應拒絕而非接受虛無假設，方向相反。",
      D: "統計檢定提供的是證據強度，不構成「必然為真」的證明。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q018",
    subjectId: "senior-bigdata",
    prompt:
      "在假設檢定中，「型一錯誤（Type I Error）」指的是下列何者？",
    choices: [
      { id: "A", text: "樣本數不足" },
      { id: "B", text: "虛無假設為假卻未被拒絕" },
      { id: "C", text: "虛無假設為真卻被拒絕" },
      { id: "D", text: "資料輸入錯誤" },
    ],
    answer: "C",
    explanation:
      "型一錯誤是「無中生有」——實際上沒有效果，卻判定有效果，其機率上限由顯著水準 α 控制。型二錯誤則是「視而不見」，有效果卻沒檢出。",
    choiceExplanations: {
      A: "樣本數不足會提高型二錯誤的機率，但它本身是研究設計問題而非錯誤類型。",
      B: "這是型二錯誤的定義，與型一相反。",
      D: "資料輸入錯誤屬於資料品質問題，不是統計檢定的錯誤類型。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q019",
    subjectId: "senior-bigdata",
    prompt:
      "電商在 A/B 測試中同時檢定 20 個指標，並各自以 0.05 為顯著水準。此做法最主要的風險是下列何者？",
    choices: [
      { id: "A", text: "會讓 p 值無法計算" },
      { id: "B", text: "會使樣本數自動變小" },
      { id: "C", text: "多重比較使至少一個指標出現偽陽性的機率大幅上升" },
      { id: "D", text: "會讓兩組的分配變得不隨機" },
    ],
    answer: "C",
    explanation:
      "每個檢定各有 5% 的偽陽性風險，同時做 20 個時「至少一個誤報」的機率接近 64%。應以 Bonferroni 等方法校正顯著水準，或事先指定單一主要指標。",
    choiceExplanations: {
      A: "每個檢定的 p 值都能照常計算，問題在於如何解讀這一整組結果。",
      B: "檢定的數量不會改變已收集的樣本數。",
      D: "分組是否隨機由實驗設計決定，與事後檢定幾個指標無關。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q020",
    subjectId: "senior-bigdata",
    prompt:
      "某研究以極大樣本檢定兩組平均差異，得到 p < 0.001，但實際差異僅 0.2 分（滿分 100）。最合理的解讀是下列何者？",
    choices: [
      { id: "A", text: "統計顯著不等於實務顯著，應同時檢視效果量" },
      { id: "B", text: "差異極大，應立即改變政策" },
      { id: "C", text: "p 值越小代表差異越大" },
      { id: "D", text: "樣本數越大結論越不可信" },
    ],
    answer: "A",
    explanation:
      "樣本數夠大時，再微小的差異也會達到統計顯著。判斷是否值得行動必須看效果量與實務意義，而不是只看 p 值有沒有跨過門檻。",
    choiceExplanations: {
      B: "0.2 分的差距在實務上幾乎沒有意義，以此改變政策並不合理。",
      C: "p 值反映的是證據強度與樣本數的綜合結果，不直接等於差異大小。",
      D: "大樣本讓估計更精確，結論並非不可信，只是需要搭配效果量解讀。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q021",
    subjectId: "senior-bigdata",
    prompt:
      "95% 信賴區間的正確解讀是下列何者？",
    choices: [
      { id: "A", text: "此區間包含了 95% 的極端值" },
      { id: "B", text: "真實參數有 95% 的機率落在這個特定區間內" },
      { id: "C", text: "95% 的樣本資料落在此區間內" },
      { id: "D", text: "以相同方法重複抽樣，約有 95% 的區間會涵蓋真實母體參數" },
    ],
    answer: "D",
    explanation:
      "信賴水準描述的是「程序的長期表現」：用同一套方法重複抽樣建構區間，約 95% 的區間會蓋住真值。對已經算出的那一個區間而言，它要嘛蓋住、要嘛沒蓋住。",
    choiceExplanations: {
      A: "區間的用途是估計參數，與極端值的比例無關。",
      B: "這是最常見的誤解；在古典統計中母體參數是固定值，不對特定區間談機率。",
      C: "信賴區間估計的是母體參數的位置，不是描述資料點的落點範圍。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q022",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要比較三條產線的平均良率是否有差異，最適合的檢定方法是下列何者？",
    choices: [
      { id: "A", text: "卡方獨立性檢定" },
      { id: "B", text: "單一樣本 t 檢定" },
      { id: "C", text: "線性迴歸的係數檢定" },
      { id: "D", text: "變異數分析（ANOVA）" },
    ],
    answer: "D",
    explanation:
      "比較三組以上的平均數是否全部相同，標準工具是 ANOVA。它一次檢定所有組別，避免兩兩 t 檢定造成的多重比較問題。",
    choiceExplanations: {
      A: "卡方獨立性檢定處理的是類別變數之間的關聯，不用於比較連續變數的平均。",
      B: "單一樣本 t 檢定比較的是一組平均與某個固定值，無法同時比較三組。",
      C: "迴歸可以處理此問題但需另設虛擬變數，並非最直接的選擇。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q023",
    subjectId: "senior-bigdata",
    prompt:
      "農業試驗要檢定「施用新肥料的田區產量是否與對照組不同」。若研究者只關心「是否更高」，應採用下列何種檢定？",
    choices: [
      { id: "A", text: "單尾檢定" },
      { id: "B", text: "雙尾檢定" },
      { id: "C", text: "卡方適合度檢定" },
      { id: "D", text: "不需要檢定" },
    ],
    answer: "A",
    explanation:
      "只關心單一方向（更高）時使用單尾檢定，全部的顯著水準都放在該側，檢定力較高。但方向必須在看到資料之前就決定，否則就是事後找顯著。",
    choiceExplanations: {
      B: "雙尾同時檢驗兩個方向，在只關心單一方向時較保守、檢定力較低。",
      C: "卡方適合度檢定用於檢驗類別分布是否符合某理論比例，與比較產量平均不同。",
      D: "沒有檢定就無法區分觀察到的差異是真實效果還是抽樣波動。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q024",
    subjectId: "senior-bigdata",
    prompt:
      "分析師在資料中嘗試多種切分方式，直到找到一個 p < 0.05 的結果才寫進報告。此做法的問題最貼切的名稱是下列何者？",
    choices: [
      { id: "A", text: "過擬合" },
      { id: "B", text: "p 值操縱（p-hacking）" },
      { id: "C", text: "資料遺失" },
      { id: "D", text: "抽樣偏誤" },
    ],
    answer: "B",
    explanation:
      "反覆嘗試不同分析方式直到出現顯著結果，會讓報告出來的 p 值嚴重低估真實的偽陽性風險。防範方式是事前登錄分析計畫，並揭露所有做過的檢定。",
    choiceExplanations: {
      A: "過擬合指模型過度貼合訓練資料，是建模問題；此處是分析與報告方式的問題。",
      C: "資料遺失指的是缺值，與反覆嘗試分析方式無關。",
      D: "抽樣偏誤來自樣本取得方式不具代表性，而此處樣本沒變、變的是分析途徑。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
  },

  // ── L22201 數據收集與清理（8 題）──────────────────────────────
  {
    id: "senior-bigdata-practice-q025",
    subjectId: "senior-bigdata",
    prompt:
      "資料清理時發現同一位客戶因為姓名輸入方式不同而出現多筆記錄（如「王大明」與「王 大明」）。此問題屬於下列何者？",
    choices: [
      { id: "A", text: "資料型別錯誤" },
      { id: "B", text: "重複資料與實體解析（Entity Resolution）問題" },
      { id: "C", text: "資料量不足" },
      { id: "D", text: "取樣頻率過高" },
    ],
    answer: "B",
    explanation:
      "同一個真實實體在資料中被記成多筆，屬於重複資料；要把它們認定為同一人需要實體解析（標準化字串、比對關鍵欄位、設定相似度門檻）。若不處理，客戶數與人均指標都會失真。",
    choiceExplanations: {
      A: "欄位型別本身沒有錯，字串仍是字串，問題出在同一實體有多種寫法。",
      C: "資料量不但不少，反而因為重複而虛增，方向相反。",
      D: "取樣頻率是時序資料的概念，與客戶主檔的重複無關。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q026",
    subjectId: "senior-bigdata",
    prompt:
      "感測資料中出現「溫度 = −999」的紀錄，經查為設備在無法讀值時寫入的預設代碼。下列處理何者最適當？",
    choices: [
      { id: "A", text: "把所有負數一律改為 0" },
      { id: "B", text: "直接把 −999 當成真實溫度納入計算" },
      { id: "C", text: "先辨識為缺失代碼並轉為缺失值，再依情境決定填補或排除" },
      { id: "D", text: "忽略這個欄位不做任何檢查" },
    ],
    answer: "C",
    explanation:
      "哨兵值（sentinel value）是偽裝成數值的缺失標記，若直接參與計算會嚴重扭曲平均與變異。正確流程是先識別並轉成明確的缺失值，再依分析目的決定填補策略。",
    choiceExplanations: {
      A: "冬季或冷鏈場域可能存在真實的負溫度，一律改為 0 會製造新的錯誤。",
      B: "把 −999 當真實值會讓平均值被拉到極低，所有統計量都失去意義。",
      D: "不檢查等於讓錯誤資料流進下游模型與報表，問題只會在更難追查的地方浮現。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q027",
    subjectId: "senior-bigdata",
    prompt:
      "醫療資料中「性別」欄位同時存在「M／F」「男／女」「1／0」三種編碼。此問題最適合以下列哪一種處理？",
    choices: [
      { id: "A", text: "把此欄位視為連續數值" },
      { id: "B", text: "刪除所有非「男／女」的紀錄" },
      { id: "C", text: "建立編碼對照表並統一為單一標準值" },
      { id: "D", text: "保持原狀，交由模型自行判斷" },
    ],
    answer: "C",
    explanation:
      "同義不同碼會讓同一個類別被拆成多個，統計與模型都會出錯。以對照表統一為單一標準值，並把轉換規則記錄下來，是資料整合的標準做法。",
    choiceExplanations: {
      A: "性別是類別變數，當成連續數值會讓模型誤以為存在大小順序關係。",
      B: "刪除會流失大量可用資料，且刪掉的可能剛好集中在某些來源系統，造成偏誤。",
      D: "模型不會知道「M」與「男」是同一件事，會把它們當成兩個獨立類別。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q028",
    subjectId: "senior-bigdata",
    prompt:
      "資料收集時，若問卷只在官方網站上發放，最可能產生下列哪一種問題？",
    choices: [
      { id: "A", text: "覆蓋偏誤：未上網或不使用該網站的族群被系統性排除" },
      { id: "B", text: "資料型別不一致" },
      { id: "C", text: "運算資源不足" },
      { id: "D", text: "欄位命名不規範" },
    ],
    answer: "A",
    explanation:
      "抽樣框（能被抽到的人）與目標母體不一致時，就會出現覆蓋偏誤。只在官網發放，等於預先排除了不使用該網站的人，樣本再多也無法代表全體。",
    choiceExplanations: {
      B: "型別不一致是資料格式問題，與抽樣管道無關。",
      C: "問卷資料量通常很小，不會構成運算瓶頸。",
      D: "欄位命名屬於資料工程規範，不影響樣本的代表性。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q029",
    subjectId: "senior-bigdata",
    prompt:
      "資料清理流程中，下列哪一項最應該被記錄下來？",
    choices: [
      { id: "A", text: "使用的螢幕解析度" },
      { id: "B", text: "執行清理的當天天氣" },
      { id: "C", text: "分析師的座位號碼" },
      { id: "D", text: "每一個清理步驟的規則、影響筆數與執行版本" },
    ],
    answer: "D",
    explanation:
      "清理會改變資料，若沒有紀錄就無法重現分析結果，也無法回答「這筆資料為什麼不見了」。規則、影響範圍與版本三者是資料可追溯性的最低要求。",
    choiceExplanations: {
      A: "螢幕解析度只影響顯示，不影響資料處理結果。",
      B: "天氣與資料處理過程沒有任何因果關係。",
      C: "座位號碼屬於行政資訊，對重現分析毫無幫助。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q030",
    subjectId: "senior-bigdata",
    prompt:
      "農業感測資料中，某測站在颱風期間的數值全為極端值。下列處理何者最恰當？",
    choices: [
      { id: "A", text: "把整個測站的資料全部捨棄" },
      { id: "B", text: "一律視為離群值直接刪除" },
      { id: "C", text: "以前後平均值直接覆蓋" },
      { id: "D", text: "先與領域專家確認是真實極端事件或設備異常，再決定保留或標記" },
    ],
    answer: "D",
    explanation:
      "極端值不等於錯誤值。颱風期間的極端讀數很可能是真實現象，正是災害分析最重要的樣本；也可能是設備泡水失效。分辨兩者需要領域知識，不能只看數值大小。",
    choiceExplanations: {
      A: "捨棄整站資料損失過大，其他時段的資料仍然有效。",
      B: "直接刪除會抹掉真實的極端事件，讓模型完全學不到災害情境。",
      C: "以前後平均覆蓋等於偽造資料，且抹平了最關鍵的變化。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q031",
    subjectId: "senior-bigdata",
    prompt:
      "在資料整合時，來自兩個系統的「日期」欄位分別為「2026/08/22」與「22-08-2026」。下列處理何者最適當？",
    choices: [
      { id: "A", text: "統一解析為標準日期型別（如 ISO 8601）後再合併" },
      { id: "B", text: "以字串直接比對合併" },
      { id: "C", text: "只保留其中一個系統的資料" },
      { id: "D", text: "把日期改成流水號" },
    ],
    answer: "A",
    explanation:
      "日期必須先解析成真正的日期型別，才能正確排序、計算差值與跨系統比對。統一為 ISO 8601 這類明確格式，也能避免日月順序被誤讀。",
    choiceExplanations: {
      B: "兩種字串格式不同，直接比對永遠不會相等，合併必然失敗。",
      C: "捨棄一個系統的資料會遺失半數資訊，是不必要的損失。",
      D: "改成流水號會丟掉時間的順序與間隔意義，無法做任何時間相關分析。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q032",
    subjectId: "senior-bigdata",
    prompt:
      "建立資料品質監控時，下列哪一組指標最能反映「資料是否可用」？",
    choices: [
      { id: "A", text: "檔案大小、副檔名與壓縮率" },
      { id: "B", text: "完整性、一致性、及時性與正確性" },
      { id: "C", text: "欄位數量與資料表數量" },
      { id: "D", text: "資料庫廠牌與版本號" },
    ],
    answer: "B",
    explanation:
      "資料品質的標準面向包含：該有的值在不在（完整性）、跨來源是否互相矛盾（一致性）、是否即時（及時性）、值本身對不對（正確性）。這四項直接決定分析結果能不能信。",
    choiceExplanations: {
      A: "檔案屬性只描述儲存形式，與內容的正確與否無關。",
      C: "數量多寡不代表品質，欄位再多也可能全是缺值。",
      D: "資料庫的品牌版本屬於基礎設施資訊，不反映資料內容的品質。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },

  // ── L22202 數據儲存與管理（8 題）──────────────────────────────
  {
    id: "senior-bigdata-practice-q033",
    subjectId: "senior-bigdata",
    prompt:
      "關於資料倉儲（Data Warehouse）與資料湖（Data Lake）的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "資料湖只能存放結構化資料" },
      { id: "B", text: "資料倉儲多存放經過整理的結構化資料，資料湖可存放原始的多種格式資料" },
      { id: "C", text: "資料倉儲不需要任何資料模型設計" },
      { id: "D", text: "兩者完全相同，只是名稱不同" },
    ],
    answer: "B",
    explanation:
      "資料倉儲在寫入前先定義結構（schema-on-write），適合穩定的分析查詢；資料湖先原樣存下、讀取時才決定結構（schema-on-read），保留最大彈性但需要治理，否則會變成資料沼澤。",
    choiceExplanations: {
      A: "資料湖的特色正是能同時容納結構化、半結構化與非結構化資料。",
      C: "資料倉儲高度依賴事實表與維度表的模型設計，這是它的核心工作之一。",
      D: "兩者在寫入時機、結構要求與適用場景上都有明確差異。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q034",
    subjectId: "senior-bigdata",
    prompt:
      "工廠每秒寫入數萬筆感測讀值，且查詢多為「某台機台最近一小時的趨勢」。最適合的儲存選擇是下列何者？",
    choices: [
      { id: "A", text: "純文字檔案" },
      { id: "B", text: "圖形資料庫" },
      { id: "C", text: "時間序列資料庫" },
      { id: "D", text: "傳統關聯式資料庫且不建任何索引" },
    ],
    answer: "C",
    explanation:
      "高頻寫入、依時間範圍查詢、幾乎不更新——這正是時間序列資料庫最佳化的存取樣態，它提供高壓縮比、時間分區與降採樣等針對性功能。",
    choiceExplanations: {
      A: "純文字檔沒有索引，查詢「最近一小時」得掃過整個檔案，資料一多就不可行。",
      B: "圖形資料庫擅長節點與關係的遍歷查詢，感測讀值之間沒有這種結構。",
      D: "關聯式資料庫不建索引時查詢會全表掃描，且高頻寫入的索引維護成本也很高。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q035",
    subjectId: "senior-bigdata",
    prompt:
      "資料分區（Partitioning）在大數據儲存中的主要效益是下列何者？",
    choices: [
      { id: "A", text: "讓資料不需要備份" },
      { id: "B", text: "自動提升資料的正確性" },
      { id: "C", text: "查詢時只掃描相關分區，大幅減少讀取量" },
      { id: "D", text: "自動修正欄位型別" },
    ],
    answer: "C",
    explanation:
      "把資料依日期或地區等欄位切成分區後，查詢特定範圍時引擎可以跳過其他分區（分區裁剪），讀取量與查詢時間都大幅下降。這是大數據查詢最有效的加速手段之一。",
    choiceExplanations: {
      A: "分區與備援是不同機制，分區後仍需備份以防資料遺失。",
      B: "分區改變的是資料的組織方式，不會讓錯誤的值變正確。",
      D: "型別問題屬於資料清理範疇，分區不會自動處理。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q036",
    subjectId: "senior-bigdata",
    prompt:
      "關於欄式儲存格式（如 Parquet）相對於列式儲存的優勢，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "分析查詢常只讀少數欄位，欄式儲存可只讀取需要的欄且壓縮率較高" },
      { id: "B", text: "欄式儲存在單筆完整記錄的寫入與讀取上一定更快" },
      { id: "C", text: "欄式儲存不需要任何結構定義" },
      { id: "D", text: "欄式儲存無法壓縮" },
    ],
    answer: "A",
    explanation:
      "分析型查詢通常只用到寬表中的幾個欄位，欄式儲存讓引擎只讀那幾欄；同一欄的值型別相同、重複度高，壓縮效果也遠優於列式。",
    choiceExplanations: {
      B: "要組出一筆完整記錄必須跨多個欄位區塊拼裝，這正是欄式的弱項，交易型工作負載仍偏好列式。",
      C: "Parquet 帶有明確的結構描述（schema）與型別資訊，並非無結構。",
      D: "欄式格式的壓縮效果通常比列式更好，敘述與事實相反。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q037",
    subjectId: "senior-bigdata",
    prompt:
      "醫院要保存十年的影像資料，其中近一年常被調閱、其餘極少存取。最合理的儲存策略是下列何者？",
    choices: [
      { id: "A", text: "全部改存純文字格式" },
      { id: "B", text: "全部放在最高效能的儲存層" },
      { id: "C", text: "超過一年的資料一律刪除" },
      { id: "D", text: "依存取頻率分層儲存，冷資料移至低成本儲存層" },
    ],
    answer: "D",
    explanation:
      "熱資料放高效能層維持調閱速度，冷資料移到低成本的封存層，在成本與可用性之間取得平衡。這種生命週期管理是大量長期保存資料的標準做法。",
    choiceExplanations: {
      A: "影像無法以純文字保存，轉換會直接摧毀資料本身。",
      B: "把極少存取的資料留在昂貴儲存層，成本會隨年份不斷累積而難以承受。",
      C: "醫療影像多有法定保存年限，任意刪除可能違法且損害病患權益。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q038",
    subjectId: "senior-bigdata",
    prompt:
      "資料治理中的「資料血緣（Data Lineage）」指的是下列何者？",
    choices: [
      { id: "A", text: "資料檔案的建立日期" },
      { id: "B", text: "資料庫伺服器的機房位置" },
      { id: "C", text: "資料表的欄位數量" },
      { id: "D", text: "追蹤資料從來源、經過哪些轉換、到最終報表的完整路徑" },
    ],
    answer: "D",
    explanation:
      "血緣記錄的是資料的來龍去脈。報表數字有疑問時，可以沿著血緣往上追到來源與每一步轉換；反過來也能在來源異動時評估會影響哪些下游報表。",
    choiceExplanations: {
      A: "建立日期只是單一時間點的中繼資料，無法呈現轉換路徑。",
      B: "機房位置屬於基礎設施資訊，與資料的加工歷程無關。",
      C: "欄位數量是結構的靜態描述，不說明資料從哪裡來。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q039",
    subjectId: "senior-bigdata",
    prompt:
      "NoSQL 資料庫相對於關聯式資料庫，最常被強調的特性是下列何者？",
    choices: [
      { id: "A", text: "彈性的資料結構與水平擴展能力" },
      { id: "B", text: "一定具備更強的交易一致性保證" },
      { id: "C", text: "完全不需要設計資料模型" },
      { id: "D", text: "只能存放圖片檔案" },
    ],
    answer: "A",
    explanation:
      "NoSQL 泛指不以固定表格結構為前提的資料庫，多半允許欄位彈性變動並以分散節點水平擴展，適合資料結構會演進、量體成長快速的場景。",
    choiceExplanations: {
      B: "許多 NoSQL 為了可用性與擴展性放寬一致性保證，交易一致性通常不如關聯式資料庫。",
      C: "彈性不等於不用設計；查詢模式仍應驅動文件結構或鍵的設計，否則效能會很差。",
      D: "NoSQL 涵蓋文件、鍵值、寬欄與圖形等多種類型，並非只存圖片。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q040",
    subjectId: "senior-bigdata",
    prompt:
      "農業研究單位要讓外部研究者取用資料，但不希望暴露原始明細。下列做法何者最適當？",
    choices: [
      { id: "A", text: "把原始資料庫帳號直接給外部研究者" },
      { id: "B", text: "提供彙總後或去識別化的資料集，並以權限控管存取範圍" },
      { id: "C", text: "把資料公開在無存取控制的網址" },
      { id: "D", text: "拒絕任何形式的資料分享" },
    ],
    answer: "B",
    explanation:
      "彙總或去識別化能在保留研究價值的同時降低可識別風險，再搭配權限控管與使用條款，讓分享的範圍與用途都可控。",
    choiceExplanations: {
      A: "直接給資料庫帳號等於開放全部明細，且難以限制查詢範圍與留下稽核紀錄。",
      C: "無存取控制的公開等於放棄所有保護，一旦包含敏感資訊即無法收回。",
      D: "全面拒絕雖然安全，但也放棄了資料的公共價值，並非唯一選擇。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },

  // ── L22203 數據處理技術與工具（8 題）──────────────────────────
  {
    id: "senior-bigdata-practice-q041",
    subjectId: "senior-bigdata",
    prompt:
      "關於 ETL 與 ELT 的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者的執行順序完全相同" },
      { id: "B", text: "ETL 在載入前先轉換，ELT 先載入原始資料再於目標系統中轉換" },
      { id: "C", text: "ELT 不需要任何轉換步驟" },
      { id: "D", text: "ETL 只能處理非結構化資料" },
    ],
    answer: "B",
    explanation:
      "ETL 依賴獨立的轉換環節，適合目標系統運算能力有限的年代；ELT 則善用現代資料倉儲的強大運算，先把原始資料載入再以 SQL 轉換，保留了回頭重做的彈性。",
    choiceExplanations: {
      A: "順序正是兩者的分野——轉換發生在載入之前或之後。",
      C: "ELT 的 T 就是轉換，只是搬到載入之後執行，不是省略。",
      D: "ETL 傳統上主要處理結構化與半結構化資料，敘述與事實相反。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q042",
    subjectId: "senior-bigdata",
    prompt:
      "MapReduce 運算模型中的 Map 階段主要負責下列何者？",
    choices: [
      { id: "A", text: "負責資料的長期儲存" },
      { id: "B", text: "把所有結果彙總成最終答案" },
      { id: "C", text: "把輸入切分後平行處理，產生中間的鍵值對" },
      { id: "D", text: "負責使用者介面呈現" },
    ],
    answer: "C",
    explanation:
      "Map 階段在各節點上對切分後的資料塊平行執行轉換，輸出中間鍵值對；Reduce 階段再依鍵彙總。分而治之正是它能處理超大資料的原因。",
    choiceExplanations: {
      A: "長期儲存由分散式檔案系統負責，MapReduce 是運算模型。",
      B: "彙總是 Reduce 階段的職責，不是 Map。",
      D: "介面呈現屬於應用層，與運算模型無關。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q043",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要對感測資料做「每五分鐘計算一次平均並即時告警」。下列處理模式何者最適合？",
    choices: [
      { id: "A", text: "人工每五分鐘查看一次" },
      { id: "B", text: "每月一次的批次處理" },
      { id: "C", text: "串流處理搭配時間窗聚合" },
      { id: "D", text: "只在系統重啟時計算" },
    ],
    answer: "C",
    explanation:
      "資料持續流入且需即時反應，正是串流處理的場景；以五分鐘的滾動或滑動時間窗聚合，即可在窗口結束時立刻判斷是否告警。",
    choiceExplanations: {
      A: "人工查看無法持續、易漏看，也不具備自動告警能力。",
      B: "月批次的延遲以月計，完全無法滿足即時告警需求。",
      D: "重啟才計算意味著絕大多數時間沒有任何監控。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q044",
    subjectId: "senior-bigdata",
    prompt:
      "在分散式運算中「資料傾斜（Data Skew）」指的是下列何者？",
    choices: [
      { id: "A", text: "資料在各節點分配不均，少數節點處理量遠大於其他節點" },
      { id: "B", text: "資料的統計分布呈現偏態" },
      { id: "C", text: "資料表的欄位順序錯亂" },
      { id: "D", text: "資料在傳輸中損毀" },
    ],
    answer: "A",
    explanation:
      "傾斜常因分區鍵取值極度不均（例如某個熱門商品佔了一半交易）而發生，導致少數任務跑很久、整批作業被它拖住。解法包括加鹽（salting）或改變分區鍵。",
    choiceExplanations: {
      B: "統計上的偏態是分布形狀，與運算負載在節點間的分配不是同一件事。",
      C: "欄位順序屬於結構描述，不影響工作負載的分配。",
      D: "資料損毀是完整性問題，會造成錯誤而非負載不均。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q045",
    subjectId: "senior-bigdata",
    prompt:
      "教育平台的資料管線每天凌晨執行，但上游來源偶爾延遲導致當日報表為空。下列改善何者最直接？",
    choices: [
      { id: "A", text: "把空報表直接發送出去" },
      { id: "B", text: "把執行時間改到更早" },
      { id: "C", text: "改為手動執行" },
      { id: "D", text: "在管線加入資料到齊檢查與重試機制，未到齊則延後執行並告警" },
    ],
    answer: "D",
    explanation:
      "問題根源是「不管上游到了沒都照跑」。加入到齊檢查（sensor）讓管線先確認來源就緒，未就緒則等待、重試並告警，就能避免產出空報表。",
    choiceExplanations: {
      A: "發送空報表會讓下游使用者做出錯誤判斷，比不發更糟。",
      B: "更早執行只會讓上游更來不及，問題加劇而非緩解。",
      C: "改為手動會增加人力負擔，且人也可能忘記或誤判是否到齊。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q046",
    subjectId: "senior-bigdata",
    prompt:
      "資料管線設計中的「冪等性（Idempotency）」指的是下列何者？",
    choices: [
      { id: "A", text: "作業必須由同一個人執行" },
      { id: "B", text: "作業執行速度固定不變" },
      { id: "C", text: "作業只能執行一次" },
      { id: "D", text: "同一批作業重複執行多次，結果與執行一次相同" },
    ],
    answer: "D",
    explanation:
      "分散式環境中重試是常態，若重跑會造成資料重複累加，錯誤就會被放大。設計成冪等（例如以覆寫分區取代追加）讓重試變得安全，是可靠管線的基本要求。",
    choiceExplanations: {
      A: "由誰執行屬於權限管理，與運算結果的性質無關。",
      B: "執行速度屬於效能特性，與重複執行的結果一致性無關。",
      C: "冪等的重點不是限制執行次數，而是多次執行也不會出錯。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q047",
    subjectId: "senior-bigdata",
    prompt:
      "醫院的資料處理需求為「每月統計上月所有門診紀錄」，且對延遲不敏感。最適合的處理模式是下列何者？",
    choices: [
      { id: "A", text: "批次處理" },
      { id: "B", text: "串流處理" },
      { id: "C", text: "即時交易處理" },
      { id: "D", text: "邊緣即時推論" },
    ],
    answer: "A",
    explanation:
      "資料範圍明確、可等待、一次處理一大批——這正是批次處理的典型場景，可以在離峰時段以較低成本完成大量運算。",
    choiceExplanations: {
      B: "串流處理是為持續到達且需即時反應的資料設計，用在月報表上徒增複雜度。",
      C: "即時交易處理針對的是單筆交易的立即寫入與一致性，與月度彙總無關。",
      D: "邊緣推論解決的是現場即時判斷，與集中式的月度統計不同。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q048",
    subjectId: "senior-bigdata",
    prompt:
      "農業資料管線每天處理數十 TB 的空拍影像，最主要的效能瓶頸通常出現在下列何者？",
    choices: [
      { id: "A", text: "程式碼的註解量" },
      { id: "B", text: "資料的輸入輸出（I/O）與網路傳輸" },
      { id: "C", text: "變數命名的長度" },
      { id: "D", text: "報表的頁數" },
    ],
    answer: "B",
    explanation:
      "處理 TB 等級的影像時，運算往往不是瓶頸，把資料搬到運算節點才是。因此常見的優化方向是資料本地化、欄式格式、壓縮與減少不必要的重複讀取。",
    choiceExplanations: {
      A: "註解在執行時不佔資源，對效能沒有影響。",
      C: "變數名稱長度在編譯或直譯後不影響執行效率。",
      D: "報表頁數屬於輸出端呈現，與資料處理的吞吐瓶頸無關。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },

  // ── L22301 統計學在大數據中的應用（7 題）──────────────────────
  {
    id: "senior-bigdata-practice-q049",
    subjectId: "senior-bigdata",
    prompt:
      "分析發現「冰淇淋銷量」與「溺水事件數」高度正相關。最合理的解讀是下列何者？",
    choices: [
      { id: "A", text: "吃冰淇淋會導致溺水" },
      { id: "B", text: "兩者可能同受氣溫這個共同因素影響，相關不等於因果" },
      { id: "C", text: "溺水事件會促進冰淇淋銷售" },
      { id: "D", text: "相關係數高就代表因果關係成立" },
    ],
    answer: "B",
    explanation:
      "這是混淆變數的經典例子：天氣熱時冰淇淋賣得多，戲水的人也多。要主張因果必須排除共同原因，或以實驗設計、因果推論方法驗證。",
    choiceExplanations: {
      A: "兩者之間沒有合理的作用機制，這只是共同受氣溫影響的巧合。",
      C: "因果方向顛倒同樣缺乏機制支持，仍是把相關誤讀為因果。",
      D: "相關係數只衡量共變程度，完全不區分因果方向或是否存在第三因素。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q050",
    subjectId: "senior-bigdata",
    prompt:
      "在大數據環境下，即使極小的差異也常達到統計顯著。此現象的主因是下列何者？",
    choices: [
      { id: "A", text: "大數據的資料一定更準確" },
      { id: "B", text: "樣本數極大使標準誤變得很小" },
      { id: "C", text: "顯著水準會自動調降" },
      { id: "D", text: "大數據不需要統計檢定" },
    ],
    answer: "B",
    explanation:
      "標準誤隨樣本數增加而縮小，檢定統計量因此變大、p 值變小。所以在大數據下應把重點從「是否顯著」轉向「效果量有多大、值不值得行動」。",
    choiceExplanations: {
      A: "資料量大不代表品質好，反而常伴隨更多雜訊與偏誤。",
      C: "顯著水準是分析者事先設定的，不會隨樣本數自動改變。",
      D: "大數據仍需統計方法區分真實訊號與隨機波動，只是解讀重點不同。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q051",
    subjectId: "senior-bigdata",
    prompt:
      "銀行以線性迴歸分析「廣告支出」對「開戶數」的影響，R² 為 0.15。此數值代表下列何者？",
    choices: [
      { id: "A", text: "廣告支出每增加 1 元開戶數增加 0.15 戶" },
      { id: "B", text: "模型的預測準確率為 15%" },
      { id: "C", text: "有 15% 的資料是錯的" },
      { id: "D", text: "模型解釋了開戶數約 15% 的變異" },
    ],
    answer: "D",
    explanation:
      "R² 是決定係數，衡量模型解釋了應變數多少比例的變異。0.15 代表大部分變異仍由其他未納入的因素造成，用它單獨解釋開戶數並不充分。",
    choiceExplanations: {
      A: "每單位變化的影響量由迴歸係數表示，不是 R²。",
      B: "準確率是分類問題的指標，迴歸不用它衡量表現。",
      C: "R² 與資料正確與否無關，它衡量的是模型的解釋力。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q052",
    subjectId: "senior-bigdata",
    prompt:
      "醫療研究希望估計新療法的效果，但無法隨機分派病患。下列哪一種方法最常被用來降低組間差異造成的偏誤？",
    choices: [
      { id: "A", text: "只分析療效最好的病患" },
      { id: "B", text: "把樣本數增加十倍即可" },
      { id: "C", text: "傾向分數配對（Propensity Score Matching）等因果推論方法" },
      { id: "D", text: "直接比較兩組平均即可" },
    ],
    answer: "C",
    explanation:
      "無法隨機分派時，兩組的基線特徵往往不同。傾向分數配對讓特徵相近的病患兩兩相比，模擬隨機化的效果，是觀察性研究的標準工具。",
    choiceExplanations: {
      A: "只看療效最好的病患是嚴重的選樣偏誤，會大幅高估療效。",
      B: "樣本再多也不會消除系統性的組間差異，只會讓有偏的估計更精確地偏。",
      D: "直接比較平均等於忽略基線差異，把選擇效應誤當成療效。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q053",
    subjectId: "senior-bigdata",
    prompt:
      "工廠分析發現某製程參數與良率呈現曲線關係（過低或過高良率都差）。若直接以簡單線性迴歸建模，最可能的後果是下列何者？",
    choices: [
      { id: "A", text: "線性模型無法捕捉曲線關係，可能得出「幾乎沒有影響」的錯誤結論" },
      { id: "B", text: "模型會自動改成非線性" },
      { id: "C", text: "R² 一定會很高" },
      { id: "D", text: "會使資料量減少" },
    ],
    answer: "A",
    explanation:
      "當關係呈倒 U 形時，正負斜率互相抵消，線性迴歸的係數可能接近零，讓人誤以為該參數不重要。應改用多項式項、分箱或非線性模型。",
    choiceExplanations: {
      B: "模型形式由分析者選定，不會自行改變成非線性。",
      C: "模型與真實關係不符時，R² 通常偏低而非偏高。",
      D: "建模方式的選擇不會改變手上的資料筆數。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q054",
    subjectId: "senior-bigdata",
    prompt:
      "農業試驗把不同田區隨機分派到兩種施肥方案。隨機分派的主要目的是下列何者？",
    choices: [
      { id: "A", text: "提高作物的絕對產量" },
      { id: "B", text: "減少試驗所需的田區數量" },
      { id: "C", text: "讓兩組在已知與未知的干擾因素上期望相同，使差異可歸因於處理" },
      { id: "D", text: "簡化資料輸入流程" },
    ],
    answer: "C",
    explanation:
      "隨機分派讓土壤、日照等各種可觀察與不可觀察的因素在兩組間平均分布，因此觀察到的差異才能歸因於施肥方案本身，這是實驗設計最核心的價值。",
    choiceExplanations: {
      A: "隨機分派是分配方式，不會讓作物長得更好。",
      B: "所需樣本數由效果量與檢定力決定，隨機分派本身不會減少樣本需求。",
      D: "資料輸入屬於作業流程，與實驗設計的統計性質無關。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q055",
    subjectId: "senior-bigdata",
    prompt:
      "分析線上課程資料時發現「觀看時數多的學生成績較好」，若據此建議所有學生延長觀看時數，最可能忽略下列何者？",
    choices: [
      { id: "A", text: "可能存在反向因果或共同原因（如學習動機），相關不足以支持此建議" },
      { id: "B", text: "觀看時數無法測量" },
      { id: "C", text: "成績資料一定有錯" },
      { id: "D", text: "樣本數一定不足" },
    ],
    answer: "A",
    explanation:
      "動機高的學生既會看比較久也會考得好，時數只是動機的表現而非原因；也可能是成績好帶來信心而看更多。要支持「延長時數能提升成績」需要實驗或因果推論設計。",
    choiceExplanations: {
      B: "線上平台可以精確記錄觀看時數，測量並不是問題。",
      C: "沒有證據顯示成績資料有誤，問題出在因果解讀。",
      D: "線上平台的樣本通常很大，問題不在數量而在推論方式。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },

  // ── L22302 常見的大數據分析方法（8 題）────────────────────────
  {
    id: "senior-bigdata-practice-q056",
    subjectId: "senior-bigdata",
    prompt:
      "超市想找出「常被一起購買的商品組合」以規劃陳列。最適合的分析方法是下列何者？",
    choices: [
      { id: "A", text: "時間序列分解" },
      { id: "B", text: "關聯規則探勘" },
      { id: "C", text: "主成分分析" },
      { id: "D", text: "存活分析" },
    ],
    answer: "B",
    explanation:
      "關聯規則探勘從交易紀錄中找出「買了 A 也常買 B」的樣態，並以支持度、信賴度與提升度衡量規則強度，正是購物籃分析的標準方法。",
    choiceExplanations: {
      A: "時間序列分解處理的是趨勢與季節性，不分析品項之間的共同出現。",
      C: "主成分分析用於降維，找的是變數的線性組合而非品項組合。",
      D: "存活分析研究事件發生前的時間長度，與購物籃組合無關。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q057",
    subjectId: "senior-bigdata",
    prompt:
      "關聯規則中的「提升度（Lift）」大於 1 代表下列何者？",
    choices: [
      { id: "A", text: "規則的支持度一定很高" },
      { id: "B", text: "兩品項完全獨立" },
      { id: "C", text: "兩品項同時出現的機率高於彼此獨立時的期望值" },
      { id: "D", text: "兩品項互斥" },
    ],
    answer: "C",
    explanation:
      "提升度是實際共同出現機率除以獨立假設下的期望機率。大於 1 表示買了前項會提高買後項的機會，等於 1 表示無關，小於 1 則是互相排斥。",
    choiceExplanations: {
      A: "提升度高但支持度可能很低（罕見組合），兩者衡量的面向不同。",
      B: "完全獨立對應的提升度恰為 1，不是大於 1。",
      D: "互斥會使提升度小於 1，與題目所述方向相反。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q058",
    subjectId: "senior-bigdata",
    prompt:
      "醫院要把病患依就醫行為分成幾個群體以規劃服務，且事先不知道應該分成幾群。最適合的方法是下列何者？",
    choices: [
      { id: "A", text: "線性迴歸" },
      { id: "B", text: "監督式分類" },
      { id: "C", text: "分群分析，並以輪廓係數或肘部法輔助決定群數" },
      { id: "D", text: "假設檢定" },
    ],
    answer: "C",
    explanation:
      "沒有預先定義的類別標籤，屬於非監督問題，適合分群；群數則以肘部法、輪廓係數等指標搭配業務可解釋性來決定。",
    choiceExplanations: {
      A: "線性迴歸預測連續數值，不產生群體劃分。",
      B: "監督式分類需要事先標好的類別，而題幹說明並不知道要分幾群。",
      D: "假設檢定用於驗證特定命題，不負責把樣本分組。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q059",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要預測未來三個月的用電量，資料呈現明顯的週期性與長期成長趨勢。最適合的分析方法是下列何者？",
    choices: [
      { id: "A", text: "時間序列分析（含趨勢與季節性建模）" },
      { id: "B", text: "關聯規則探勘" },
      { id: "C", text: "分群分析" },
      { id: "D", text: "文字探勘" },
    ],
    answer: "A",
    explanation:
      "資料依時間排列且同時具趨勢與季節性，正是時間序列分析的對象。可用分解法、ARIMA 或含季節項的模型捕捉這兩種成分後外推。",
    choiceExplanations: {
      B: "關聯規則找的是同時出現的項目組合，無法產生未來的數值預測。",
      C: "分群把樣本分組，不預測時間軸上的走勢。",
      D: "文字探勘處理非結構化文本，用電量是數值時序資料。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q060",
    subjectId: "senior-bigdata",
    prompt:
      "主成分分析（PCA）的主要用途是下列何者？",
    choices: [
      { id: "A", text: "填補缺失值" },
      { id: "B", text: "把資料分成互斥的群組" },
      { id: "C", text: "檢定兩組平均是否不同" },
      { id: "D", text: "以較少的線性組合維度保留資料大部分變異，達到降維目的" },
    ],
    answer: "D",
    explanation:
      "PCA 找出彼此正交、依序解釋最多變異的方向，取前幾個主成分即可用較低維度保留大部分資訊，常用於視覺化與降低共線性。",
    choiceExplanations: {
      A: "缺失值填補有專門方法，PCA 本身通常要求輸入無缺失。",
      B: "分組是分群分析的工作，PCA 不產生群體標籤。",
      C: "比較平均差異是假設檢定的範疇，與降維無關。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q061",
    subjectId: "senior-bigdata",
    prompt:
      "銀行要從大量交易中找出「與多數行為模式明顯不同」的可疑交易，且沒有標註的詐欺樣本。最適合的方法是下列何者？",
    choices: [
      { id: "A", text: "關聯規則探勘" },
      { id: "B", text: "監督式二元分類" },
      { id: "C", text: "線性迴歸" },
      { id: "D", text: "非監督式異常偵測" },
    ],
    answer: "D",
    explanation:
      "沒有詐欺標籤時，可先以正常交易建立行為分布，把偏離分布的樣本標為異常再交人工複核。這也符合詐欺樣本天生稀少且手法會變的特性。",
    choiceExplanations: {
      A: "關聯規則找的是品項共現樣態，無法直接指出單筆交易是否可疑。",
      B: "監督式分類需要已標註的詐欺樣本，題幹明確指出沒有。",
      C: "線性迴歸預測連續值，不用於判斷樣本是否異常。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q062",
    subjectId: "senior-bigdata",
    prompt:
      "農業單位想了解各縣市的作物產量是否有空間上的群聚現象。最適合的分析取向是下列何者？",
    choices: [
      { id: "A", text: "空間分析（考慮地理鄰近性的統計方法）" },
      { id: "B", text: "把縣市視為完全獨立的樣本做一般迴歸" },
      { id: "C", text: "文字情感分析" },
      { id: "D", text: "影像分割" },
    ],
    answer: "A",
    explanation:
      "地理相鄰的區域往往因氣候與土壤相似而彼此關聯，忽略這種空間自相關會低估標準誤。空間分析方法明確把鄰近關係納入模型。",
    choiceExplanations: {
      B: "把有空間關聯的樣本當成獨立，會違反獨立性假設而導致推論失準。",
      C: "情感分析處理文本觀點，與產量的空間分布無關。",
      D: "影像分割是電腦視覺任務，不用於分析縣市層級的統計關聯。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q063",
    subjectId: "senior-bigdata",
    prompt:
      "分析電商顧客時常用的 RFM 模型，其三個維度分別是下列何者？",
    choices: [
      { id: "A", text: "年齡、性別、居住地" },
      { id: "B", text: "最近一次消費、消費頻率、消費金額" },
      { id: "C", text: "點擊率、跳出率、停留時間" },
      { id: "D", text: "毛利、成本、稅額" },
    ],
    answer: "B",
    explanation:
      "RFM 取 Recency（最近一次消費距今多久）、Frequency（消費頻率）、Monetary（消費金額）三個行為維度為顧客分級，是最常用的顧客價值分析框架。",
    choiceExplanations: {
      A: "這些是人口統計變數，屬於另一種分眾方式，不是 RFM。",
      C: "這些是網站流量指標，衡量的是瀏覽行為而非消費價值。",
      D: "這些是財務科目，用於損益分析而非顧客分級。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
  },

  // ── L22303 數據可視化工具（7 題）──────────────────────────────
  {
    id: "senior-bigdata-practice-q064",
    subjectId: "senior-bigdata",
    prompt:
      "要呈現「兩個連續變數之間的關係」，最適合的圖表是下列何者？",
    choices: [
      { id: "A", text: "圓餅圖" },
      { id: "B", text: "散佈圖" },
      { id: "C", text: "長條圖" },
      { id: "D", text: "文字雲" },
    ],
    answer: "B",
    explanation:
      "散佈圖把每一筆觀測畫成一個點，能直接看出兩個連續變數之間的方向、強度、線性與否以及離群點，是探索關聯最基本的圖。",
    choiceExplanations: {
      A: "圓餅圖呈現的是單一類別變數的組成比例，無法表達兩變數的關係。",
      C: "長條圖比較的是類別之間的數量差異，不適合連續對連續。",
      D: "文字雲呈現詞彙頻率，與數值變數的關聯無關。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q065",
    subjectId: "senior-bigdata",
    prompt:
      "某長條圖的 Y 軸未從 0 開始，使兩組間 3% 的差距看起來像是兩倍。此問題屬於下列何者？",
    choices: [
      { id: "A", text: "資料型別錯誤" },
      { id: "B", text: "視覺誤導：座標軸設定放大了實際差異" },
      { id: "C", text: "樣本數不足" },
      { id: "D", text: "圖表解析度不足" },
    ],
    answer: "B",
    explanation:
      "長條圖以長度編碼數值，截斷 Y 軸會讓長度比例失真，微小差異被視覺放大。呈現長條圖時 Y 軸原則上應從 0 起算，若必須截斷則要明確標示。",
    choiceExplanations: {
      A: "資料本身沒有型別問題，錯的是呈現方式。",
      C: "樣本數不影響座標軸怎麼設定造成的視覺放大。",
      D: "解析度影響清晰度，不會改變長度所傳達的比例關係。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q066",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要在儀表板上呈現「各機台當前狀態與異常數」，供現場主管快速掌握。下列設計原則何者最適當？",
    choices: [
      { id: "A", text: "以動畫特效吸引注意力為主要考量" },
      { id: "B", text: "把所有可取得的指標一次全部放上去" },
      { id: "C", text: "每個圖表使用不同的配色規則以增加變化" },
      { id: "D", text: "把最關鍵的少數指標放在最顯眼處，並以一致的顏色語意標示狀態" },
    ],
    answer: "D",
    explanation:
      "儀表板的目的是讓人在幾秒內做出判斷。聚焦關鍵指標、維持顏色語意一致（例如紅色永遠代表異常），才能降低認知負擔並避免誤讀。",
    choiceExplanations: {
      A: "特效無助於判讀，反而分散注意力並增加載入負擔。",
      B: "指標全上會稀釋注意力，真正重要的訊號反而被淹沒。",
      C: "配色規則不一致會讓同一個顏色在不同圖表代表不同意義，極易誤判。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q067",
    subjectId: "senior-bigdata",
    prompt:
      "要呈現「單一數值變數的分布形狀」，最適合的圖表是下列何者？",
    choices: [
      { id: "A", text: "雷達圖" },
      { id: "B", text: "折線圖" },
      { id: "C", text: "直方圖" },
      { id: "D", text: "桑基圖" },
    ],
    answer: "C",
    explanation:
      "直方圖把數值分箱後統計各箱次數，能直接看出集中位置、離散程度、偏態與是否多峰，是描述單變數分布最直接的圖。",
    choiceExplanations: {
      A: "雷達圖用於比較多個面向的相對值，不適合表達分布。",
      B: "折線圖強調的是沿某個順序（多為時間）的變化，不呈現分布形狀。",
      D: "桑基圖描述流量在不同階段之間的流向與分配，用途完全不同。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q068",
    subjectId: "senior-bigdata",
    prompt:
      "設計圖表配色時，下列哪一項最能兼顧色覺障礙使用者？",
    choices: [
      { id: "A", text: "避免只以紅綠區分，並輔以形狀、標籤或明度差異" },
      { id: "B", text: "使用更飽和的紅色與綠色" },
      { id: "C", text: "把所有顏色都調成同一色系" },
      { id: "D", text: "只用顏色不加任何文字標示" },
    ],
    answer: "A",
    explanation:
      "紅綠色覺障礙相對常見，若資訊只由紅綠承載，這些使用者將完全無法區辨。加上形狀、直接標籤或明顯的明度差，才能讓資訊不依賴單一通道。",
    choiceExplanations: {
      B: "提高飽和度不會讓無法區辨紅綠的人變得能區辨，問題依舊。",
      C: "全部同色系會讓所有類別都難以區分，對所有使用者都更糟。",
      D: "只靠顏色是最典型的無障礙缺陷，正是應該避免的做法。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q069",
    subjectId: "senior-bigdata",
    prompt:
      "農業單位要在地圖上呈現各鄉鎮的平均產量高低。最適合的視覺化形式是下列何者？",
    choices: [
      { id: "A", text: "甘特圖" },
      { id: "B", text: "圓餅圖" },
      { id: "C", text: "面量圖（Choropleth Map）" },
      { id: "D", text: "盒鬚圖" },
    ],
    answer: "C",
    explanation:
      "面量圖以顏色深淺表示各行政區的數值高低，能同時呈現空間位置與數值大小，是區域統計最常用的地圖形式。",
    choiceExplanations: {
      A: "甘特圖用於專案排程，與空間資料無關。",
      B: "圓餅圖呈現單一整體的組成比例，無法表達地理分布。",
      D: "盒鬚圖描述數值分布，但不含地理位置資訊。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q070",
    subjectId: "senior-bigdata",
    prompt:
      "報表中同時呈現「絕對數量」與「成長率」時，最容易造成誤解的情況是下列何者？",
    choices: [
      { id: "A", text: "基數很小的項目成長率極高，被解讀為重要趨勢" },
      { id: "B", text: "使用了折線圖" },
      { id: "C", text: "報表有頁碼" },
      { id: "D", text: "資料經過排序" },
    ],
    answer: "A",
    explanation:
      "基數小的項目從 2 件變 4 件就是 100% 成長，看起來驚人但實際影響微乎其微。呈現成長率時應同時給出絕對值，或對過小的基數加註說明。",
    choiceExplanations: {
      B: "折線圖本身是中性的呈現工具，不會造成這種誤解。",
      C: "頁碼屬於文件格式，與數據解讀無關。",
      D: "排序有助於閱讀，不是誤導的來源。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },

  // ── L22401 大數據與機器學習（8 題）────────────────────────────
  {
    id: "senior-bigdata-practice-q071",
    subjectId: "senior-bigdata",
    prompt:
      "在機器學習流程中，「特徵工程」通常對模型表現的影響是下列何者？",
    choices: [
      { id: "A", text: "幾乎沒有影響，模型會自行找出所有規律" },
      { id: "B", text: "影響極大，好的特徵往往比更換演算法更能提升表現" },
      { id: "C", text: "只影響訓練速度，不影響準確率" },
      { id: "D", text: "只在深度學習中才需要" },
    ],
    answer: "B",
    explanation:
      "在表格式資料上，把領域知識轉成有意義的特徵（比率、時間差、聚合統計）帶來的提升，通常遠大於換一個更複雜的演算法。這是實務上投報率最高的環節之一。",
    choiceExplanations: {
      A: "傳統模型無法自行創造原始欄位裡沒有的組合關係，深度模型也需要足夠資料才可能學到。",
      C: "特徵決定模型能看到什麼資訊，直接影響預測品質而不只是速度。",
      D: "情況相反：深度學習能自動萃取部分特徵，表格式資料的傳統模型更依賴人工特徵工程。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q072",
    subjectId: "senior-bigdata",
    prompt:
      "模型在訓練集表現極佳但在測試集明顯變差，此現象稱為下列何者？",
    choices: [
      { id: "A", text: "資料傾斜" },
      { id: "B", text: "欠擬合（Underfitting）" },
      { id: "C", text: "過擬合（Overfitting）" },
      { id: "D", text: "維度詛咒" },
    ],
    answer: "C",
    explanation:
      "過擬合是模型連訓練資料中的雜訊都記了下來，因此在未見過的資料上失準。緩解手段包括增加資料、簡化模型、正則化與交叉驗證。",
    choiceExplanations: {
      A: "資料傾斜描述的是分散式運算中負載分配不均，屬於工程問題。",
      B: "欠擬合是訓練集與測試集表現都差，代表模型太簡單學不到規律。",
      D: "維度詛咒指高維空間中資料稀疏、距離失去意義，是過擬合的成因之一但不是此現象的名稱。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q073",
    subjectId: "senior-bigdata",
    prompt:
      "大數據環境下訓練模型時，若資料量遠超過單機記憶體，下列做法何者最直接？",
    choices: [
      { id: "A", text: "隨機刪除九成資料" },
      { id: "B", text: "把所有資料強制載入記憶體" },
      { id: "C", text: "採用分散式訓練或以小批次逐步讀取資料訓練" },
      { id: "D", text: "改用更複雜的模型" },
    ],
    answer: "C",
    explanation:
      "小批次（mini-batch）訓練每次只載入一部分資料，分散式訓練則把資料與運算切到多台機器。兩者都讓訓練不受單機記憶體上限限制。",
    choiceExplanations: {
      A: "隨機刪除九成會嚴重損失資訊，除非已確認抽樣仍具代表性，否則不應作為首選。",
      B: "資料量超過記憶體時強行載入會直接失敗或觸發大量交換而癱瘓。",
      D: "更複雜的模型需要更多記憶體，會讓問題更嚴重。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q074",
    subjectId: "senior-bigdata",
    prompt:
      "資料量增加對機器學習模型的影響，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "通常有助於降低過擬合，但若資料品質差則效益有限" },
      { id: "B", text: "資料越多模型一定越準確，與品質無關" },
      { id: "C", text: "資料量與模型表現完全無關" },
      { id: "D", text: "資料越多越容易過擬合" },
    ],
    answer: "A",
    explanation:
      "更多樣本讓模型較難靠記憶少數樣本取巧，泛化通常改善；但若新增的資料充滿雜訊、標註錯誤或與目標分布不符，效益會迅速遞減甚至反效果。",
    choiceExplanations: {
      B: "垃圾進垃圾出——大量錯誤標註的資料會讓模型學到錯誤規律。",
      C: "樣本數是決定模型能學到多少規律的關鍵因素之一，並非無關。",
      D: "方向相反：資料越多通常越不容易過擬合，過擬合多發生於樣本稀少時。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q075",
    subjectId: "senior-bigdata",
    prompt:
      "在建立機器學習模型前先進行探索性資料分析（EDA）的主要目的是下列何者？",
    choices: [
      { id: "A", text: "減少資料儲存空間" },
      { id: "B", text: "直接產出最終模型" },
      { id: "C", text: "取代模型評估" },
      { id: "D", text: "了解資料分布、缺失與異常，避免在錯誤的假設上建模" },
    ],
    answer: "D",
    explanation:
      "EDA 讓分析者在動手建模前先看清資料的實際樣貌：分布是否偏態、有無異常值與缺失、變數之間是否高度相關。跳過這一步常導致後續大量返工。",
    choiceExplanations: {
      A: "EDA 的目的是理解而非壓縮，不會減少儲存需求。",
      B: "EDA 是理解資料的階段，不產出可用於預測的模型。",
      C: "模型評估必須以獨立資料驗證預測表現，EDA 無法取代。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q076",
    subjectId: "senior-bigdata",
    prompt:
      "以歷史資料訓練的需求預測模型，在市場結構改變後表現持續下滑。此情況最貼切的描述是下列何者？",
    choices: [
      { id: "A", text: "程式語法錯誤" },
      { id: "B", text: "資料庫索引失效" },
      { id: "C", text: "模型檔案損毀" },
      { id: "D", text: "概念漂移：輸入與目標之間的關係隨時間改變" },
    ],
    answer: "D",
    explanation:
      "概念漂移指的是「同樣的輸入，正確答案變了」。市場結構改變後，過去有效的規律不再成立，必須以新資料重訓並建立持續監控機制。",
    choiceExplanations: {
      A: "語法錯誤會讓程式無法執行，症狀與逐漸失準完全不同。",
      B: "索引失效影響查詢效率，不會讓預測品質隨市場變化而下滑。",
      C: "檔案損毀會讓模型無法運作或行為異常，而非緩慢退化。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q077",
    subjectId: "senior-bigdata",
    prompt:
      "在資料切分時，若同一位病患的多次就診紀錄同時出現在訓練集與測試集，最可能造成下列哪一種問題？",
    choices: [
      { id: "A", text: "資訊洩漏使測試分數虛高，無法反映對新病患的表現" },
      { id: "B", text: "模型訓練時間變長" },
      { id: "C", text: "資料量不足" },
      { id: "D", text: "欄位型別錯誤" },
    ],
    answer: "A",
    explanation:
      "同一位病患的紀錄高度相關，模型可能靠記住這個人而不是學到通則。若目標是預測新病患，切分就必須以病患為單位（group split），而非以單筆紀錄。",
    choiceExplanations: {
      B: "資料如何切分不會顯著改變總訓練量與訓練時間。",
      C: "資料筆數並未減少，問題出在切分方式而非數量。",
      D: "欄位型別是資料格式問題，與切分策略無關。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q078",
    subjectId: "senior-bigdata",
    prompt:
      "在大數據平台上部署機器學習模型時，「特徵存放區（Feature Store）」的主要價值是下列何者？",
    choices: [
      { id: "A", text: "取代資料倉儲" },
      { id: "B", text: "讓訓練與線上推論使用同一份特徵定義，避免兩邊計算不一致" },
      { id: "C", text: "自動提升模型準確率" },
      { id: "D", text: "免除模型監控的需求" },
    ],
    answer: "B",
    explanation:
      "訓練與線上服務各自實作一套特徵計算，是模型上線後表現不如預期的常見原因（training-serving skew）。特徵存放區集中管理定義與計算，讓兩邊取得完全一致的特徵。",
    choiceExplanations: {
      A: "特徵存放區服務的是機器學習流程，不取代資料倉儲的分析用途。",
      C: "它解決的是一致性與重用問題，不會直接改變模型的預測能力。",
      D: "上線後仍需監控效能與資料漂移，特徵存放區無法取代監控。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },

  // ── L22402 大數據在鑑別式 AI 中的應用（8 題）──────────────────
  {
    id: "senior-bigdata-practice-q079",
    subjectId: "senior-bigdata",
    prompt:
      "銀行以歷史交易資料訓練詐欺偵測分類模型。若正負樣本比例為 1:1000，下列處理何者最不恰當？",
    choices: [
      { id: "A", text: "對少數類別過採樣或對多數類別欠採樣" },
      { id: "B", text: "以整體準確率作為唯一的模型選擇依據" },
      { id: "C", text: "使用類別權重調整損失函數" },
      { id: "D", text: "以少數類別的召回率與精確率評估" },
    ],
    answer: "B",
    explanation:
      "1:1000 的情況下，全部預測為非詐欺就有 99.9% 準確率，這個指標完全無法區分模型好壞。必須改看少數類別的召回率、精確率與 PR 曲線。",
    choiceExplanations: {
      A: "重採樣是處理極度不平衡的標準手段之一，屬於恰當做法。",
      C: "提高少數類別在損失中的權重，可讓模型更重視稀有事件，做法恰當。",
      D: "這正是不平衡問題應該使用的評估方式。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q080",
    subjectId: "senior-bigdata",
    prompt:
      "ROC 曲線下面積（AUC）為 0.5 代表下列何者？",
    choices: [
      { id: "A", text: "模型的準確率為 50%" },
      { id: "B", text: "模型完美分類" },
      { id: "C", text: "模型的辨別能力與隨機猜測相當" },
      { id: "D", text: "模型過擬合" },
    ],
    answer: "C",
    explanation:
      "AUC 可理解為「隨機取一個正樣本與一個負樣本，模型給正樣本較高分數的機率」。0.5 表示與擲硬幣無異，1.0 為完美，低於 0.5 則代表方向反了。",
    choiceExplanations: {
      A: "AUC 與準確率是不同指標；在不平衡資料上準確率可能很高而 AUC 仍為 0.5。",
      B: "完美分類對應的 AUC 是 1.0，不是 0.5。",
      D: "過擬合會表現為訓練與測試 AUC 差距大，單看 0.5 無法判定是過擬合。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q081",
    subjectId: "senior-bigdata",
    prompt:
      "醫療篩檢模型若「寧可誤報也不能漏掉真正患者」，在調整分類門檻時應朝下列哪個方向？",
    choices: [
      { id: "A", text: "門檻固定為 0.5 不可調整" },
      { id: "B", text: "提高門檻以提高精確率" },
      { id: "C", text: "降低判為陽性的門檻以提高召回率" },
      { id: "D", text: "改以隨機方式決定" },
    ],
    answer: "C",
    explanation:
      "降低門檻會讓更多樣本被判為陽性，漏掉真患者的機率下降（召回率上升），代價是誤報增加。在漏診成本遠高於複檢成本的篩檢場景，這個取捨是合理的。",
    choiceExplanations: {
      A: "0.5 只是預設值，依成本結構調整門檻正是實務上的標準做法。",
      B: "提高門檻會讓判為陽性的更少，漏診風險上升，與需求相反。",
      D: "隨機決定會讓模型完全失去辨別能力，不具任何臨床價值。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q082",
    subjectId: "senior-bigdata",
    prompt:
      "工廠以歷史品檢資料訓練瑕疵分類模型，但標註由不同檢驗員完成且標準不一。此問題最直接影響下列何者？",
    choices: [
      { id: "A", text: "標籤雜訊使模型學到互相矛盾的規則，效能上限被壓低" },
      { id: "B", text: "只影響訓練速度" },
      { id: "C", text: "只影響資料儲存空間" },
      { id: "D", text: "完全不影響模型" },
    ],
    answer: "A",
    explanation:
      "同一張影像被不同人標成不同結果時，模型無論怎麼學都會有一部分樣本判錯，效能上限被標註一致性卡住。解法是統一標註規範並以重疊標註量測一致性。",
    choiceExplanations: {
      B: "標籤品質影響的是模型能學到什麼，與訓練速度沒有直接關係。",
      C: "標籤是否一致不改變檔案大小。",
      D: "標籤是監督式學習的學習訊號，品質不良必然影響模型。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
  },
  {
    id: "senior-bigdata-practice-q083",
    subjectId: "senior-bigdata",
    prompt:
      "混淆矩陣中的「偽陰性（False Negative）」在疾病篩檢的情境下代表下列何者？",
    choices: [
      { id: "A", text: "實際健康且被正確判出" },
      { id: "B", text: "實際健康但被判為患病" },
      { id: "C", text: "實際患病且被正確判出" },
      { id: "D", text: "實際患病但被判為健康" },
    ],
    answer: "D",
    explanation:
      "偽陰性是「該抓卻沒抓到」。在篩檢情境下代表患者被誤判為健康而錯失治療時機，通常是四種結果中代價最高的一種。",
    choiceExplanations: {
      A: "這是真陰性，同樣屬於正確判斷。",
      B: "這是偽陽性，代表虛驚一場，後果通常是多做一次確診檢查。",
      C: "這是真陽性，屬於正確判斷。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q084",
    subjectId: "senior-bigdata",
    prompt:
      "教育平台以模型預測學生是否需要輔導。若模型把某一整個班級都判為高風險，最應優先檢查下列何者？",
    choices: [
      { id: "A", text: "學生的座號排列" },
      { id: "B", text: "伺服器的硬碟空間" },
      { id: "C", text: "報表的字型大小" },
      { id: "D", text: "是否有班級層級的特徵造成模型過度依賴（如班級編號被當成特徵）" },
    ],
    answer: "D",
    explanation:
      "整班同判通常代表模型抓到了班級層級的共同特徵，甚至可能把班級識別碼當成強預測因子。這種捷徑學習會讓個別學生的差異被忽略，必須檢查特徵清單。",
    choiceExplanations: {
      A: "座號是行政編號，除非誤入特徵，否則不會影響預測。",
      B: "硬碟空間屬於基礎設施，不會造成特定班級的一致預測。",
      C: "字型只影響顯示，與預測結果無關。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q085",
    subjectId: "senior-bigdata",
    prompt:
      "農業病害辨識模型在測試集表現良好，但實際田間拍攝的照片辨識率大幅下降。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "訓練資料多為理想條件下拍攝，與田間實際光線與背景差異大" },
      { id: "B", text: "模型參數量過少" },
      { id: "C", text: "測試集標籤全部錯誤" },
      { id: "D", text: "使用了彩色影像" },
    ],
    answer: "A",
    explanation:
      "測試集若與訓練集來自同一批理想照片，分數自然好看；但田間有逆光、陰影、雜草背景與手持模糊，分布與訓練資料不同，模型因此失準。應補充實地拍攝樣本。",
    choiceExplanations: {
      B: "參數不足會讓測試集表現也不好，無法解釋「測試好、實地差」的落差。",
      C: "若測試標籤全錯，測試分數不會呈現良好表現。",
      D: "彩色影像提供的資訊更多，本身不是導致實地表現下降的原因。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q086",
    subjectId: "senior-bigdata",
    prompt:
      "F1 分數的定義是下列何者？",
    choices: [
      { id: "A", text: "精確率與召回率的算術平均" },
      { id: "B", text: "精確率與召回率的調和平均" },
      { id: "C", text: "準確率與 AUC 的乘積" },
      { id: "D", text: "真陽性數除以總樣本數" },
    ],
    answer: "B",
    explanation:
      "F1 = 2 × (Precision × Recall) / (Precision + Recall)。使用調和平均的用意是：只要有一項很低，F1 就會被拉低，避免只顧單邊而看似表現良好。",
    choiceExplanations: {
      A: "算術平均在一高一低時仍可能得到中等分數，無法凸顯短板，因此不採用。",
      C: "F1 的定義中不包含準確率與 AUC。",
      D: "真陽性除以總樣本數不是任何標準指標的定義。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },

  // ── L22403 大數據在生成式 AI 中的應用（7 題）──────────────────
  {
    id: "senior-bigdata-practice-q087",
    subjectId: "senior-bigdata",
    prompt:
      "訓練大型語言模型時，資料前處理中的「去重（Deduplication）」主要目的是下列何者？",
    choices: [
      { id: "A", text: "讓模型輸出更長的文字" },
      { id: "B", text: "避免模型過度記憶重複內容並降低訓練資源浪費" },
      { id: "C", text: "提高模型的推論速度" },
      { id: "D", text: "增加訓練資料量" },
    ],
    answer: "B",
    explanation:
      "重複段落會被模型反覆看到，容易導致逐字記憶（甚至在輸出時原樣重現），也浪費算力。去重能同時改善泛化與訓練效率。",
    choiceExplanations: {
      A: "輸出長度由生成設定控制，與訓練語料是否去重無關。",
      C: "推論速度取決於模型架構與硬體，不受訓練資料是否去重影響。",
      D: "去重會減少而非增加資料量，方向相反。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q088",
    subjectId: "senior-bigdata",
    prompt:
      "建立企業內部 RAG 系統時，「切塊（Chunking）」策略的主要影響是下列何者？",
    choices: [
      { id: "A", text: "只影響文件的儲存空間" },
      { id: "B", text: "切太大會混入無關內容、切太小會切斷語意，兩者都影響檢索品質" },
      { id: "C", text: "只影響前端顯示" },
      { id: "D", text: "與檢索結果完全無關" },
    ],
    answer: "B",
    explanation:
      "切塊決定了檢索的最小單位。過大的塊讓向量摻雜多個主題而難以精準匹配，過小的塊則可能把一個完整說明切斷、失去上下文。實務上常搭配重疊切塊折衷。",
    choiceExplanations: {
      A: "切塊確實影響索引大小，但主要影響的是檢索的精準度而非儲存。",
      C: "切塊發生在建立索引階段，與前端如何顯示無關。",
      D: "檢索的對象就是這些塊，切法直接決定能不能找到正確段落。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q089",
    subjectId: "senior-bigdata",
    prompt:
      "向量資料庫在生成式 AI 應用中的主要角色是下列何者？",
    choices: [
      { id: "A", text: "取代所有關聯式資料庫" },
      { id: "B", text: "負責訓練語言模型" },
      { id: "C", text: "負責產生最終回答文字" },
      { id: "D", text: "以向量相似度快速檢索語意相近的內容片段" },
    ],
    answer: "D",
    explanation:
      "向量資料庫把文本嵌入後的向量建立索引，讓系統能在大量片段中快速找出語意最接近查詢的幾則，供語言模型作為生成依據。",
    choiceExplanations: {
      A: "交易性與結構化查詢仍由關聯式資料庫處理，兩者是互補關係。",
      B: "模型訓練由訓練框架與運算叢集完成，向量資料庫不參與。",
      C: "生成文字是語言模型的工作，向量資料庫只負責找出參考素材。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q090",
    subjectId: "senior-bigdata",
    prompt:
      "以企業內部文件微調語言模型時，最需要注意的資料風險是下列何者？",
    choices: [
      { id: "A", text: "文件的頁碼不連續" },
      { id: "B", text: "文件的字型不一致" },
      { id: "C", text: "含敏感資訊的內容可能被模型記憶並在輸出時洩漏" },
      { id: "D", text: "文件的檔名太長" },
    ],
    answer: "C",
    explanation:
      "模型可能記住訓練語料中的具體內容，在特定提示下重現。含個資或營業秘密的文件必須先去識別化或排除，並在上線前以紅隊測試檢查是否會洩漏。",
    choiceExplanations: {
      A: "頁碼是否連續不影響模型學到的內容。",
      B: "字型屬於排版屬性，轉成純文字後即消失，不構成風險。",
      D: "檔名長度只是檔案系統層面的細節，與資料風險無關。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q091",
    subjectId: "senior-bigdata",
    prompt:
      "評估 RAG 系統時，下列哪一組指標最能反映「檢索階段」的品質？",
    choices: [
      { id: "A", text: "檢索命中率與相關文件的排序位置" },
      { id: "B", text: "生成文字的字數" },
      { id: "C", text: "模型的參數量" },
      { id: "D", text: "伺服器的開機時間" },
    ],
    answer: "A",
    explanation:
      "RAG 的品質可拆成檢索與生成兩段。檢索段要看正確文件有沒有被找到、排在第幾位；若檢索就沒帶回正確依據，再好的生成模型也答不對。",
    choiceExplanations: {
      B: "字數是輸出長度，與是否檢索到正確依據無關。",
      C: "參數量描述模型規模，不衡量檢索效果。",
      D: "開機時間屬於維運指標，與檢索品質無關。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
  },
  {
    id: "senior-bigdata-practice-q092",
    subjectId: "senior-bigdata",
    prompt:
      "以生成式 AI 產生「合成資料」用於補充訓練樣本時，最應注意下列何者？",
    choices: [
      { id: "A", text: "合成資料完全不需要驗證" },
      { id: "B", text: "合成資料一定比真實資料更好" },
      { id: "C", text: "合成資料若與真實分布偏離，可能把模型帶往錯誤方向" },
      { id: "D", text: "合成資料可以取代所有真實資料" },
    ],
    answer: "C",
    explanation:
      "合成資料只反映生成模型自己的認知，若它與真實世界的分布有落差，模型會學到這個偏差。使用時必須以真實資料驗證，並控制合成樣本的比例。",
    choiceExplanations: {
      A: "不驗證就無從得知它是否引入偏差，風險極高。",
      B: "合成資料的價值取決於品質與真實性，並非天然優於真實觀測。",
      D: "完全以合成資料訓練可能導致模型逐步偏離真實世界，是已知的風險。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
  },
  {
    id: "senior-bigdata-practice-q093",
    subjectId: "senior-bigdata",
    prompt:
      "生成式 AI 應用中的「嵌入（Embedding）」指的是下列何者？",
    choices: [
      { id: "A", text: "把文字或其他資料轉換成能表達語意的數值向量" },
      { id: "B", text: "把模型嵌入到硬體晶片中" },
      { id: "C", text: "把圖片壓縮成較小的檔案" },
      { id: "D", text: "把資料庫嵌入到應用程式中" },
    ],
    answer: "A",
    explanation:
      "嵌入把文本、影像等資料映射到向量空間，使語意相近者距離較近。它是語意檢索、分群與 RAG 的共同基礎。",
    choiceExplanations: {
      B: "把模型放進晶片是嵌入式部署，中文用詞相近但概念完全不同。",
      C: "壓縮著重於減少檔案大小，不保證保留語意關係。",
      D: "把資料庫內嵌於應用是軟體架構的選擇，與向量表示無關。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
  },

  // ── L22404 大數據隱私保護、安全與合規（7 題）──────────────────
  {
    id: "senior-bigdata-practice-q094",
    subjectId: "senior-bigdata",
    prompt:
      "關於「去識別化」與「假名化」的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者完全相同" },
      { id: "B", text: "假名化保留可還原的對應關係，去識別化則力求無法連回特定個人" },
      { id: "C", text: "假名化一定比去識別化更安全" },
      { id: "D", text: "去識別化後的資料一定可以還原" },
    ],
    answer: "B",
    explanation:
      "假名化以代號取代識別欄位，但對照表仍存在、可還原，因此多數法規仍視為個資；去識別化則要讓資料無法（或難以）連回特定個人，保護程度較高。",
    choiceExplanations: {
      A: "兩者在可還原性與法規定位上有明確差異，不能互相取代。",
      C: "假名化保留還原能力，風險通常高於徹底去識別化。",
      D: "若能輕易還原就不算真正的去識別化，敘述與定義相違。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q095",
    subjectId: "senior-bigdata",
    prompt:
      "「k-匿名性（k-anonymity）」的核心概念是下列何者？",
    choices: [
      { id: "A", text: "資料集中至少有 k 個欄位" },
      { id: "B", text: "任一筆記錄在準識別欄位的組合上，至少與其他 k−1 筆無法區分" },
      { id: "C", text: "資料保存至少 k 年" },
      { id: "D", text: "至少 k 個人可以存取資料" },
    ],
    answer: "B",
    explanation:
      "k-匿名性要求以年齡區間、郵遞區號等準識別欄位分組後，每一組至少有 k 筆記錄，使攻擊者無法從這些欄位的組合鎖定到特定個人。",
    choiceExplanations: {
      A: "欄位數量與能否鎖定個人無關，k 指的是同組記錄的筆數。",
      C: "保存年限屬於資料生命週期政策，與匿名性定義無關。",
      D: "存取人數是權限管理議題，不是匿名性的衡量標準。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q096",
    subjectId: "senior-bigdata",
    prompt:
      "「資料最小化」原則要求下列何者？",
    choices: [
      { id: "A", text: "只保留一份資料副本" },
      { id: "B", text: "盡可能蒐集越多資料越好以備日後使用" },
      { id: "C", text: "把資料壓縮到最小檔案" },
      { id: "D", text: "只蒐集達成特定目的所必要的資料" },
    ],
    answer: "D",
    explanation:
      "資料最小化是個資保護的核心原則：沒蒐集的資料就不會外洩。它同時降低了合規負擔與資安風險，也迫使組織先想清楚目的再蒐集。",
    choiceExplanations: {
      A: "副本數量屬於備援策略，與蒐集哪些欄位是兩回事。",
      B: "「先收再說」正是此原則要避免的做法，會累積不必要的風險。",
      C: "壓縮處理的是儲存體積，與蒐集範圍無關。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q097",
    subjectId: "senior-bigdata",
    prompt:
      "某公司想分析員工健康資料以改善福利方案。下列做法何者最能兼顧目的與隱私？",
    choices: [
      { id: "A", text: "把明細公布在內部網站供大家參考" },
      { id: "B", text: "由主管直接查閱每位員工的健檢報告" },
      { id: "C", text: "僅取用彙總統計，避免任何可辨識個人的明細" },
      { id: "D", text: "以員工姓名為索引建立健康資料表供全公司查詢" },
    ],
    answer: "C",
    explanation:
      "改善福利方案需要的是群體趨勢，不需要知道某個人的數值。以彙總統計取代個人明細，既能達成目的又能把可識別風險降到最低。",
    choiceExplanations: {
      A: "公布明細是嚴重的個資外洩，不論內部或外部都不可接受。",
      B: "主管直接查閱個人健檢資料，超出必要範圍且可能構成職場歧視風險。",
      D: "以姓名為索引且開放全公司查詢，等於完全放棄保護。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
  },
  {
    id: "senior-bigdata-practice-q098",
    subjectId: "senior-bigdata",
    prompt:
      "「差分隱私（Differential Privacy）」的基本作法是下列何者？",
    choices: [
      { id: "A", text: "在查詢結果中加入受控的雜訊，使單一個體是否在資料集中難以被判斷" },
      { id: "B", text: "把資料全部加密後儲存" },
      { id: "C", text: "限制只有主管可以查詢" },
      { id: "D", text: "把資料備份到多個地點" },
    ],
    answer: "A",
    explanation:
      "差分隱私以數學方式保證：某一個人在不在資料集裡，對輸出結果的分布影響有嚴格上限。實作上是在統計輸出加入校準過的雜訊，在隱私與可用性間取得可量化的平衡。",
    choiceExplanations: {
      B: "加密保護的是靜態或傳輸中的資料，解密後查詢仍可能推知個體資訊。",
      C: "限制查詢者是存取控制，無法防止有權者從統計結果反推個人。",
      D: "多地備份提升可用性與韌性，與隱私保護無關。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q099",
    subjectId: "senior-bigdata",
    prompt:
      "跨國企業在不同地區處理個人資料時，最應優先確認下列何者？",
    choices: [
      { id: "A", text: "各地伺服器的品牌統一性" },
      { id: "B", text: "各地辦公室的樓層高度" },
      { id: "C", text: "各地法規對資料跨境傳輸與當地儲存的要求" },
      { id: "D", text: "各地員工的座位安排" },
    ],
    answer: "C",
    explanation:
      "不同法域對個資的跨境傳輸、當地儲存與適足性認定要求差異很大，違反可能面臨高額裁罰。這必須在系統架構設計之前就確認清楚。",
    choiceExplanations: {
      A: "硬體品牌統一有助維運，但不影響法規遵循。",
      B: "建築條件與資料合規毫無關聯。",
      D: "座位安排屬於行政管理，與資料跨境規範無關。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
  {
    id: "senior-bigdata-practice-q100",
    subjectId: "senior-bigdata",
    prompt:
      "資料外洩事件發生後，下列哪一項是最應立即進行的動作？",
    choices: [
      { id: "A", text: "依既定的應變計畫止血、保全證據並依規定通報" },
      { id: "B", text: "先刪除所有相關日誌以免被追究" },
      { id: "C", text: "等待事件自行平息" },
      { id: "D", text: "對外宣稱沒有任何資料外洩" },
    ],
    answer: "A",
    explanation:
      "事故應變的順序是先阻斷持續外洩、保全鑑識所需的日誌與證據，再依法規時限通報主管機關與當事人。事前就備妥計畫，事發時才不會手忙腳亂。",
    choiceExplanations: {
      B: "刪除日誌會摧毀鑑識證據，本身可能構成湮滅證據等更嚴重的責任。",
      C: "資料外洩不會自行平息，拖延只會擴大損害並錯過法定通報時限。",
      D: "不實陳述會在事實揭露後造成更嚴重的法律與商譽後果。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
  },
];
