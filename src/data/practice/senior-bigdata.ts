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
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["中位數", "右偏分布", "極端值"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若分布近似對稱、沒有極端值，平均數與中位數幾乎相同，此時平均數因為用到全部資訊而更有效率。",
    },
  },
  {
    id: "senior-bigdata-practice-q002",
    subjectId: "senior-bigdata",
    prompt:
      "工廠量測兩條產線的產品重量，兩者平均值相同但 A 線的標準差明顯大於 B 線。此結果代表下列何者？",
    choices: [
      { id: "A", text: "A 線的抽樣誤差較大，代表抽驗的樣本數比 B 線少" },
      { id: "B", text: "A 線的重量分布呈右偏，偏重的產品比較多" },
      { id: "C", text: "A 線的重量變異較大、穩定度較差" },
      { id: "D", text: "兩線平均相同，因此整體品質表現可視為一致" },
    ],
    answer: "C",
    explanation:
      "標準差衡量的是資料相對於平均的離散程度。平均相同但標準差較大，代表 A 線的重量忽高忽低、一致性較差，在品質管理上通常意味著製程需要調整。",
    choiceExplanations: {
      A: "標準差描述的是個別產品重量的離散，不是抽樣誤差；樣本數影響的是平均數的標準誤，無法從標準差較大推得 A 線抽樣較少。",
      B: "標準差只衡量離散程度，不帶有偏斜方向的資訊；要判斷是否右偏，需看偏態係數或直方圖。",
      D: "平均相同只代表重量水準一致；離散程度較大時，A 線落在規格界限外的比例會較高，品質表現並不一致。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["標準差", "離散程度", "製程穩定度"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若兩線的平均值不同，就不能只比標準差，要改用變異係數（標準差／平均）才是公平的比較。",
    },
  },
  {
    id: "senior-bigdata-practice-q003",
    subjectId: "senior-bigdata",
    prompt:
      "醫院要摘要病患住院天數的分布，並特別關注「最久的那一成病患」。下列哪一種統計量最適合？",
    choices: [
      { id: "A", text: "第 10 百分位數" },
      { id: "B", text: "眾數" },
      { id: "C", text: "第 90 百分位數" },
      { id: "D", text: "變異數" },
    ],
    answer: "C",
    explanation:
      "第 90 百分位數是「有 90% 的病患住院天數低於此值」的門檻，正好界定出最久的那一成。百分位數是描述分布尾端最直接的工具。",
    choiceExplanations: {
      A: "第 10 百分位數界定的是住院天數最短的那一成，方向與題幹關注的「最久那一成」正好相反。",
      B: "眾數是出現最頻繁的天數，反映的是最常見情況而非尾端。",
      D: "變異數描述整體離散程度，不指出任何特定的分位位置。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["百分位數", "分布尾端"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若關注的是「最常見的住院天數」以安排常規床位，該用的就變成眾數而不是百分位數。",
    },
  },
  {
    id: "senior-bigdata-practice-q004",
    subjectId: "senior-bigdata",
    prompt:
      "資料分析師以盒鬚圖（Box Plot）呈現各分店的銷售分布。盒子的上下邊界通常代表下列何者？",
    choices: [
      { id: "A", text: "第三四分位數與第一四分位數" },
      { id: "B", text: "排除離群點後的最大值與最小值" },
      { id: "C", text: "平均值加減一個標準差的範圍" },
      { id: "D", text: "第 95 與第 5 百分位數" },
    ],
    answer: "A",
    explanation:
      "盒鬚圖的盒身由第一四分位數（Q1）到第三四分位數（Q3）構成，中間橫線為中位數，盒身高度即四分位距（IQR），用來描述中間 50% 資料的集中範圍。",
    choiceExplanations: {
      B: "排除離群點後的最大、最小值是鬚線末端的位置，盒身的上下邊界則是第三與第一四分位數。",
      C: "平均加減標準差是以常態假設描述離散的另一種方式，盒鬚圖只用分位數構成，不使用平均與標準差。",
      D: "第 95 與第 5 百分位數屬於尾端描述，標準盒鬚圖不以此定義盒身。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["盒鬚圖", "四分位數", "IQR"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若要呈現的是完整分布形狀而不只是四分位摘要，盒鬚圖就不夠，該改用直方圖或小提琴圖。",
    },
  },
  {
    id: "senior-bigdata-practice-q005",
    subjectId: "senior-bigdata",
    prompt:
      "農產品價格資料呈現明顯右偏（少數高價拉長右尾）。關於平均數與中位數的關係，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者的關係與偏態無關" },
      { id: "B", text: "平均數通常小於中位數" },
      { id: "C", text: "只要樣本夠大，兩者必定相等" },
      { id: "D", text: "平均數通常大於中位數" },
    ],
    answer: "D",
    explanation:
      "右偏分布的長尾在高值端，這些極端值會把平均數往上拉，而中位數只看中間位置不受影響，因此平均數通常大於中位數。左偏則相反。",
    choiceExplanations: {
      A: "偏態的方向正是決定兩者大小關係的因素，不能說無關。",
      B: "平均數小於中位數是左偏（長尾在低值端）的特徵，與題幹描述相反。",
      C: "樣本數不會改變分布的形狀，右偏分布的平均數依然被右尾拉高；只有在對稱分布時兩者才會相等。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["右偏", "平均數", "中位數"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若長尾出現在低值端（左偏），關係就反過來，平均數會小於中位數。",
    },
  },
  {
    id: "senior-bigdata-practice-q006",
    subjectId: "senior-bigdata",
    prompt:
      "分析教學平台的課程完成率時，發現同一份資料若以「所有註冊者」或「有實際上課者」為分母，結論差異極大。此現象最直接提醒分析者注意下列何者？",
    choices: [
      { id: "A", text: "差異主要來自抽樣誤差，應加大樣本重算" },
      { id: "B", text: "應改用中位數等穩健統計量來排除極端值干擾" },
      { id: "C", text: "只要資料量夠大，兩種算法的結論會自然趨於一致" },
      { id: "D", text: "統計量的定義與分母選擇會直接改變結論" },
    ],
    answer: "D",
    explanation:
      "比率的意義完全取決於分子分母怎麼定義。同樣叫「完成率」，分母換掉就是兩個不同的指標，報告中必須明確寫出定義，否則讀者會做出錯誤解讀。",
    choiceExplanations: {
      A: "兩種算法用的是同一份資料，差異來自分母的定義而非抽樣波動，加大樣本也不會讓兩個數字收斂。",
      B: "完成率是比率，問題出在分母怎麼定義而不是極端值；換用中位數無法解釋兩種分母為何得出不同結論。",
      C: "兩種分母衡量的是不同的母體，資料再多也只會讓兩個不同的數字各自更精確，不會自然趨於一致。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["指標定義", "分母選擇", "誤導"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若兩種分母的差距極小（幾乎所有註冊者都有上課），選哪一個都不影響結論，定義的重要性也隨之下降。",
    },
  },
  {
    id: "senior-bigdata-practice-q007",
    subjectId: "senior-bigdata",
    prompt:
      "以四分位距（IQR）判定離群值時，常用的規則是超出下列哪一個範圍者視為離群？",
    choices: [
      { id: "A", text: "Q1 − 1.5×IQR 到 Q3 + 1.5×IQR" },
      { id: "B", text: "平均值 − 3×標準差 到 平均值 + 3×標準差" },
      { id: "C", text: "中位數 − 1.5×IQR 到 中位數 + 1.5×IQR" },
      { id: "D", text: "Q1 到 Q3 之外的所有資料點" },
    ],
    answer: "A",
    explanation:
      "IQR 法以 Q1 − 1.5×IQR 與 Q3 + 1.5×IQR 為上下界，超出者標為離群值。它只依賴分位數，不受極端值本身影響，因此在偏態資料上比標準差法穩健。",
    choiceExplanations: {
      B: "平均加減三個標準差是 Z 分數法的門檻，依賴平均與標準差，且兩者本身會被離群值拉動；題目問的是以 IQR 判定的規則。",
      C: "IQR 規則的基準點是 Q1 與 Q3 而非中位數；以中位數為中心會讓上下界變窄，把分布兩側的正常值誤判為離群。",
      D: "Q1 到 Q3 只涵蓋中間 50% 的資料，以此為界會把一半的資料都標為離群，必須再往外延伸 1.5 倍 IQR。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["IQR", "離群值判定"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若資料呈厚尾分布，1.5 倍 IQR 會把大量正常值判為離群，此時門檻應放寬到 3 倍或改用領域上下限。",
    },
  },
  {
    id: "senior-bigdata-practice-q008",
    subjectId: "senior-bigdata",
    prompt:
      "某報表以「本月客訴平均處理時間 2.5 小時」呈現成效，但實際上有三成案件超過 8 小時。此報表最主要的問題是下列何者？",
    choices: [
      { id: "A", text: "平均處理時間的算法有誤，應改用以案件量加權的平均重新計算" },
      { id: "B", text: "只用單一集中趨勢統計量，掩蓋了分布的離散與尾端狀況" },
      { id: "C", text: "樣本只取本月案件，觀察期間太短而缺乏代表性" },
      { id: "D", text: "應以最長處理時間取代平均，才能反映最壞情況" },
    ],
    answer: "B",
    explanation:
      "平均值把整個分布壓成一個數字，長尾與變異完全看不見。要誠實呈現服務品質，應同時給出中位數、高分位數（如 P90）或超時案件比例。",
    choiceExplanations: {
      A: "平均值本身可能完全算得正確，問題在於單一平均掩蓋了三成超過 8 小時的案件；改成加權平均仍只是一個數字。",
      C: "本月資料已清楚顯示三成案件超時，問題不在觀察期間長短；延長期間但仍只報平均，尾端一樣會被掩蓋。",
      D: "最長處理時間只由單一極端案件決定，又失去了典型值；應同時呈現中位數、高分位數與超時比例。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["集中趨勢", "分布尾端", "報表誤導"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若處理時間的分布近似對稱且變異很小，平均值就足以代表整體，補上分位數的邊際價值不高。",
    },
  },
  {
    id: "senior-bigdata-practice-q101",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的客服報表以「平均處理時間 2.5 小時」呈現成效，主管另從客訴得知有大量案件拖過一天。若要讓報表同時反映典型值與尾端風險，下列改寫何者最完整？",
    choices: [
      { id: "A", text: "改為呈現最大處理時間與前十名最久案件清單，讓主管直接看到最壞的情況" },
      { id: "B", text: "以幾何平均取代算術平均並同時呈現中位數，降低長尾對典型值的拉動" },
      { id: "C", text: "改呈現平均值加減兩個標準差的區間，以區間上界作為尾端風險的代表" },
      { id: "D", text: "同時呈現中位數、第 90 百分位數與超時案件比例，並註明分母定義" },
    ],
    answer: "D",
    explanation:
      "平均把整個分布壓成一個數字，長尾完全看不見。中位數描述典型案件、第 90 百分位與超時比例描述尾端，再加上分母定義（算全部案件還是已結案），讀者才有辦法自行判斷。",
    choiceExplanations: {
      A: "最大值與前十名只呈現極少數的極端案件，失去了典型值，也說不出有多大比例的案件拖過一天。",
      B: "幾何平均與中位數都只描述典型值，雖然不再被長尾拉高，卻讓拖過一天的大量案件更加看不見。",
      C: "處理時間右偏，平均加減標準差的區間是以對稱分布為前提，會低估右尾，也無法直接表達超時案件的比例。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["集中趨勢", "分位數", "分母定義"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      crossNode: "L22303",
      decisionBoundary:
        "若處理時間近似對稱且變異很小，平均值就足以代表整體，補上分位數的邊際價值不高。",
    },
  },
  {
    id: "senior-bigdata-practice-q102",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠比較兩條產線的重量變異，A 線平均 500 克、標準差 10 克；B 線平均 50 克、標準差 5 克。若要判斷哪一條的相對穩定度較差，下列做法何者最正確？",
    choices: [
      { id: "A", text: "以變異係數（標準差除以平均）比較，A 線 2%、B 線 10%，B 線相對變異較大" },
      { id: "B", text: "直接比較標準差：A 線 10 克大於 B 線 5 克，因此 A 線的穩定度較差，應優先改善" },
      { id: "C", text: "改以四分位距比較兩線，因為四分位距不受極端值影響而較穩健" },
      { id: "D", text: "兩線平均差異過大，須先以 t 檢定確認平均是否相同，才能比較變異" },
    ],
    answer: "A",
    explanation:
      "標準差帶有單位與量級，平均差十倍的兩條線不能直接比。變異係數把標準差除以平均變成無單位的相對指標，才是公平的比較基準。",
    choiceExplanations: {
      B: "直接比標準差忽略了兩線的產品重量本來就差十倍，結論會反過來；據此決定優先改善 A 線也會用錯資源。",
      C: "四分位距與標準差一樣帶有單位與量級，平均差十倍的兩條線直接比 IQR 仍不公平；穩健與否不是本題的問題。",
      D: "t 檢定比較的是平均數，無論結果如何都不會讓量級不同的標準差變得可比；變異係數本來就是為平均不同的情況設計的。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["變異係數", "相對變異", "量級差異"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若兩條線的產品規格與平均重量相同，直接比較標準差就足夠，變異係數不會提供額外資訊。",
    },
  },
  {
    id: "senior-bigdata-practice-q103",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台的「課程完成率」在兩份報告中分別是 78% 與 34%，經查兩份都算得沒錯。下列最可能的原因與處置何者最正確？",
    choices: [
      { id: "A", text: "兩種算法各有道理，應取兩者的加權平均作為對外公布的正式完成率" },
      { id: "B", text: "數字差距過大，必有一份的資料抽取條件或程式邏輯有誤，應由第三方逐行重算比對" },
      { id: "C", text: "兩份報告的資料來源不同，應以資料量較大的那一份為準並停用另一份" },
      { id: "D", text: "分母定義不同（有實際上課者 vs 全體註冊者），應在指標字典明訂唯一定義並於報表標註" },
    ],
    answer: "D",
    explanation:
      "比率的意義完全取決於分子分母怎麼定義。同樣叫完成率，分母換掉就是兩個不同的指標，兩份都可以是對的。處置是建立指標字典並在報表明確標註，而不是找出誰算錯。",
    choiceExplanations: {
      A: "加權平均得到的是一個不對應任何定義的數字，兩種分母各自回答的問題反而都說不清楚。",
      B: "題幹已說明兩份都算得沒錯，差距來自分母定義而非抽取條件或程式錯誤，重算只會得到同樣的兩個數字。",
      C: "差距的根源是分母定義而非資料來源或資料量，停用一份不解決定義分歧，下次換人製表仍會再發生。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["指標定義", "分母選擇", "指標字典"],
      constraints: ["governance", "quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Wrong Trade-off",
      },
      crossNode: "L22202",
      decisionBoundary:
        "若兩種分母的差距極小（幾乎所有註冊者都有上課），選哪一個都不影響結論，定義的重要性也隨之下降。",
    },
  },
  {
    id: "senior-bigdata-practice-q104",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院分析住院天數，發現以 1.5 倍 IQR 判定會有 12% 的紀錄被標為離群值。臨床確認這些多為真實的重症長期住院。下列處置何者最正確？",
    choices: [
      { id: "A", text: "把超出門檻的天數縮尾（winsorize）到上界值，保留筆數又能壓低極端值對平均的影響" },
      { id: "B", text: "依 1.5 倍 IQR 規則刪除這 12% 的紀錄，避免少數重症病患扭曲全院的平均住院天數" },
      { id: "C", text: "改以平均加減兩個標準差判定，以常態分布的標準來篩選異常住院" },
      { id: "D", text: "住院天數本就厚尾，1.5 倍 IQR 門檻不適用；應改用領域上下限或放寬倍數，並保留這些真實紀錄" },
    ],
    answer: "D",
    explanation:
      "離群值判定規則是為近似常態的資料設計的。住院天數天生厚尾，硬套 1.5 倍 IQR 會把大量真實重症紀錄誤判為異常——而這些正是臨床最需要分析的案例。",
    choiceExplanations: {
      A: "縮尾雖保留了筆數，卻把真實的重症住院天數改成人為上限，臨床最需要分析的長期住院資訊因此失真。",
      B: "這些紀錄經臨床確認為真實重症，刪除會讓分析失去代表性；它們不是扭曲平均的雜訊，而是平均應該反映的一部分。",
      C: "平均與標準差更容易被長期住院拉動，住院天數也不符合常態，在厚尾分布下用常態標準判定更不可靠。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["離群值判定", "厚尾分布", "領域門檻"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Correct in Different Context",
      },
      crossNode: "L22201",
      decisionBoundary:
        "若這些極端值經查證是輸入錯誤（例如把小時填成天數），那就真的是錯誤資料，該修正或排除。",
    },
  },
  {
    id: "senior-bigdata-practice-q105",
    subjectId: "senior-bigdata",
    prompt:
      "某農會要向理事會說明各產區的收成分布差異，資料為六個產區、每區數百筆。下列呈現方式何者最合適？",
    choices: [
      { id: "A", text: "以折線圖連接六區的平均收成，觀察各區之間的高低起伏" },
      { id: "B", text: "以圓餅圖呈現六區的收成佔比，看出各區的貢獻" },
      { id: "C", text: "以並排的箱型圖比較六區的中位數、四分位距與離群點" },
      { id: "D", text: "列出六區平均值與標準差的對照表，以數字精確呈現差異" },
    ],
    answer: "C",
    explanation:
      "要比較的是「分布」而不只是平均。並排箱型圖能同時呈現各區的集中位置、離散程度與極端值，一眼看出哪一區穩定、哪一區落差大。",
    choiceExplanations: {
      A: "產區之間沒有順序意義，用折線連起來會暗示不存在的趨勢，而且只畫平均仍看不到區內的分布。",
      B: "圓餅圖呈現的是各區佔總量的組成，回答的是貢獻多少，看不出任何區內的分布差異。",
      D: "平均與標準差無法呈現偏態與離群點，每區數百筆資料的分布形狀在一張數字表裡也看不出來。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["箱型圖", "分布比較", "視覺化選擇"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      crossNode: "L22303",
      decisionBoundary:
        "若要呈現的是各區收成佔全國的比重而非分布形狀，圓餅圖或長條圖反而才是對的選擇。",
    },
  },
  {
    id: "senior-bigdata-practice-q106",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的良率報表顯示某產線本月成長率高達 200%，經查該線上月僅生產 3 件。下列處置何者最合理？",
    choices: [
      { id: "A", text: "將該產線視為離群值，從本月良率報表中排除，待產量恢復到正常規模之後再重新納入" },
      { id: "B", text: "以此成長率作為本季績效標竿，要求其他產線比照該線的改善做法來提升產出" },
      { id: "C", text: "把成長率的顯示上限設為 100%，超過者一律標示為「100% 以上」" },
      { id: "D", text: "基數極小時成長率會被放大，應同時呈現絕對數量，並對過小基數加註或不計算成長率" },
    ],
    answer: "D",
    explanation:
      "3 件變 9 件就是 200% 成長，看起來驚人但實際影響微乎其微。呈現成長率時必須同時給出絕對值，或對基數過小者明確標註，否則讀者會把雜訊當成趨勢。",
    choiceExplanations: {
      A: "排除該產線會讓報表失去完整性，等產量恢復再納入也會造成時間序列斷裂；問題出在呈現方式而非資料本身。",
      B: "3 件變 9 件的成長率幾乎全是雜訊，以它為標竿會逼其他產線追逐一個沒有意義的數字。",
      C: "設顯示上限只是截斷數字，讀者仍不知道背後的基數只有 3 件，誤導依然存在。",
    },
    topic: "L22101 敘述性統計與資料摘要技術",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["成長率", "基數效應", "絕對值並陳"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      crossNode: "L22303",
      decisionBoundary:
        "若各產線的基數量級相近，成長率之間就可以直接比較，這項誤讀風險也隨之消失。",
    },
  },

  // ── L22102 機率分佈與資料分佈模型（8 題）──────────────────────
  {
    id: "senior-bigdata-practice-q009",
    subjectId: "senior-bigdata",
    prompt:
      "工廠統計「每小時到達檢修站的機台故障次數」，此類「單位時間內事件發生次數」的資料最適合以下列哪一種分布建模？",
    choices: [
      { id: "A", text: "常態分布（Normal）" },
      { id: "B", text: "卜瓦松分布（Poisson）" },
      { id: "C", text: "均勻分布（Uniform）" },
      { id: "D", text: "二項分布（Binomial）" },
    ],
    answer: "B",
    explanation:
      "卜瓦松分布描述在固定時間或空間內、事件以固定平均率獨立發生的次數，正好對應「每小時故障幾次」這種計數資料。",
    choiceExplanations: {
      A: "常態分布（Normal）描述連續且對稱的變量，故障次數是非負整數且常呈右偏，並不適合。",
      C: "均勻分布（Uniform）假設所有結果機率相同，故障次數顯然不是每個數字都等機率出現。",
      D: "二項分布（Binomial）描述固定試驗次數下的成功次數，本題並沒有明確的試驗次數上限。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["卜瓦松分布", "計數資料"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若故障之間會互相引發（一台壞導致鄰機過載），獨立性假設就不成立，卜瓦松會低估群聚發生的次數。",
    },
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
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["二項分布", "固定試驗次數", "獨立性"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若違約之間因景氣而高度相關、不再獨立，二項分布會嚴重低估同時大量違約的機率。",
    },
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
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["常態分布", "68-95-99.7"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Terminology Swap",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "這組數字只在資料近似常態時成立；若分布厚尾，±3 個標準差之外的比例會遠高於 0.3%。",
    },
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
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["指數分布", "等待時間"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若回診是依固定療程排定（例如每三個月一次），間隔就不是隨機等待時間，指數分布並不適用。",
    },
  },
  {
    id: "senior-bigdata-practice-q013",
    subjectId: "senior-bigdata",
    prompt:
      "「中央極限定理」最主要說明下列何者？",
    choices: [
      { id: "A", text: "只要樣本數夠大，抽出的樣本資料本身就會呈現常態分布" },
      { id: "B", text: "大量獨立因素累加的結果，使任何母體在資料夠多時都會呈現常態" },
      { id: "C", text: "樣本數越大，樣本平均數的標準差就越接近母體標準差" },
      { id: "D", text: "在樣本數夠大時，樣本平均數的抽樣分布會趨近常態分布" },
    ],
    answer: "D",
    explanation:
      "中央極限定理談的是「樣本平均數」這個統計量的分布：不論母體本身是什麼形狀，只要樣本夠大且獨立同分布，樣本平均的抽樣分布就趨近常態。這是許多推論方法成立的基礎。",
    choiceExplanations: {
      A: "樣本越大，樣本資料的分布只會越像母體本身的形狀；趨近常態的是樣本平均數的抽樣分布，不是樣本資料。",
      B: "定理不對母體形狀做任何保證，母體可以是任何分布、也不會因資料變多而改變；保證的是樣本平均的分布。",
      C: "樣本平均數的標準差（標準誤）等於母體標準差除以根號 n，樣本越大反而越小，不會趨近母體標準差。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["中央極限定理", "抽樣分布"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若母體的變異數不存在（極厚尾分布），中央極限定理的前提就不成立，樣本平均不會趨近常態。",
    },
  },
  {
    id: "senior-bigdata-practice-q014",
    subjectId: "senior-bigdata",
    prompt:
      "農業資料中，某作物產量的直方圖呈現明顯的雙峰。最合理的初步推論是下列何者？",
    choices: [
      { id: "A", text: "樣本數不足造成的隨機起伏，屬於雜訊" },
      { id: "B", text: "其中一個峰是量測錯誤，應刪除樣本較少的那一峰" },
      { id: "C", text: "可先以平均值代表整體產量，再以標準差說明兩峰的落差" },
      { id: "D", text: "資料可能混合了兩個性質不同的子群體" },
    ],
    answer: "D",
    explanation:
      "雙峰通常意味著樣本裡混了兩種不同機制的群體（例如兩個品種、兩種栽培方式）。正確做法是找出區分變數並分開分析，而不是硬用單一分布去描述。",
    choiceExplanations: {
      A: "樣本不足會讓直方圖崎嶇不平，但不會產生兩個穩定而明顯的峰；把結構當成雜訊，會錯過真正的成因。",
      B: "雙峰是真實存在的結構特徵，較小的峰同樣是一群真實樣本；未經查證就刪除，等於丟掉最有價值的線索。",
      C: "雙峰分布的平均值往往落在兩峰之間的低谷，不代表任何一群；標準差也只會把兩群的差距混成一個離散度。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["雙峰分布", "混合子群體"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若找不到任何能區分兩峰的變數，就只能以混合分布建模，而不是硬拆成兩群。",
    },
  },
  {
    id: "senior-bigdata-practice-q015",
    subjectId: "senior-bigdata",
    prompt:
      "資料分析時把數值轉換為 Z 分數（標準分數），其意義是下列何者？",
    choices: [
      { id: "A", text: "該數值距離平均值幾個標準差" },
      { id: "B", text: "該數值在資料中所處的百分位排名" },
      { id: "C", text: "該數值相對於平均值的百分比差距" },
      { id: "D", text: "該數值經最小最大縮放後的位置" },
    ],
    answer: "A",
    explanation:
      "Z = (x − 平均) / 標準差，衡量的是該值偏離平均多少個標準差。經標準化後，不同單位、不同量級的變數就能放在同一個尺度上比較。",
    choiceExplanations: {
      B: "百分位排名描述有多少比例的資料低於該值，Z 分數則是以標準差為單位的距離；只有在常態假設下兩者才能互相換算。",
      C: "百分比差距以平均值為分母，衡量的是偏離平均幾成；Z 分數以標準差為分母，衡量的是偏離幾個標準差。",
      D: "最小最大縮放依據全距把資料壓到 0 到 1 之間，Z 分數依據平均與標準差，是兩種不同的標準化方法。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["Z分數", "標準化"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若分布嚴重偏態，平均與標準差都被極端值拉動，Z 分數的判讀就失真，該改用以分位數為基礎的標準化。",
    },
  },
  {
    id: "senior-bigdata-practice-q016",
    subjectId: "senior-bigdata",
    prompt:
      "分析師想檢查資料是否近似常態分布，下列哪一種圖最直接？",
    choices: [
      { id: "A", text: "盒鬚圖（Box Plot）" },
      { id: "B", text: "Q-Q 圖（分位數對分位數圖）" },
      { id: "C", text: "散布圖（Scatter Plot）" },
      { id: "D", text: "帕雷托圖（Pareto Chart）" },
    ],
    answer: "B",
    explanation:
      "Q-Q 圖把資料的分位數與理論常態分位數對畫，若點大致落在一條直線上就代表接近常態，偏離的形狀還能提示是偏態還是厚尾。",
    choiceExplanations: {
      A: "盒鬚圖能看出是否對稱與有無離群點，但對稱分布不一定是常態，也看不出尾部是否比常態更厚，不如 Q-Q 圖直接。",
      C: "散布圖呈現的是兩個變數之間的關係，無法檢驗單一變數是否符合常態分布。",
      D: "帕雷托圖把類別依頻率排序並疊上累積百分比，用於找出少數關鍵原因，不用來檢驗分布形狀。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["Q-Q圖", "常態性檢查"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若樣本數極小（例如不到 20 筆），Q-Q 圖的點本來就會抖動，偏離直線未必代表非常態。",
    },
  },
  {
    id: "senior-bigdata-practice-q107",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠以卜瓦松分布建模每小時的設備故障次數，實際觀測卻發現變異數遠大於平均數（過度離散）。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "把故障次數取對數後再套用卜瓦松模型，讓變異數縮小到與平均數相近，模型假設就能成立" },
      { id: "B", text: "樣本夠大時卜瓦松可用常態近似，因此應改用常態分布，並以樣本變異數作為離散參數" },
      { id: "C", text: "過度離散多半是觀測期間太短造成的抽樣波動，應延長觀測時數，待變異數回落到接近平均數後再沿用卜瓦松模型" },
      { id: "D", text: "卜瓦松假設變異數等於平均數；過度離散代表故障彼此相關或機台間有異質性，應改用負二項分布或加入分群變數" },
    ],
    answer: "D",
    explanation:
      "卜瓦松的核心假設之一是變異數等於平均數。觀測到過度離散，代表事件並非彼此獨立、或不同機台的故障率本來就不同。負二項分布放寬了這個假設，加入分群變數則直接處理異質性。",
    choiceExplanations: {
      A: "取對數改變的是數值尺度，取對數後的值已不是卜瓦松能描述的整數次數；故障彼此相關或機台異質的根本原因也沒有處理。",
      B: "常態近似只在資料本身符合卜瓦松時才有意義，過度離散的根源並未消失；常態分布還會對非負整數的故障次數給出負值的機率。",
      C: "過度離散是故障機制本身的性質，不是樣本不足；延長觀測只會更穩定地估出同樣偏大的變異數。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["卜瓦松假設", "過度離散", "負二項分布"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      crossNode: "L22103",
      decisionBoundary:
        "若變異數與平均數確實相近，卜瓦松就是恰當的選擇，換成負二項只是多估一個參數。",
    },
  },
  {
    id: "senior-bigdata-practice-q108",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行以常態分布估計投資組合的單日最大損失，卻在市場劇烈波動時多次超出估計值。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "改以投資組合的平均報酬與夏普比率衡量風險，避免單一極端日扭曲估計" },
      { id: "B", text: "延長估計所用的歷史期間以增加樣本數，讓報酬分布逐漸收斂為常態後再重新估計" },
      { id: "C", text: "把信賴水準從 99% 提高到 99.9%，以更保守的門檻涵蓋劇烈波動時的損失" },
      { id: "D", text: "金融報酬常呈厚尾，常態分布會低估極端事件的機率，應改用厚尾分布或歷史模擬法估計尾端風險" },
    ],
    answer: "D",
    explanation:
      "常態分布下三個標準差外只佔 0.3%，但金融市場的極端事件遠比這頻繁。用常態估計尾端風險會系統性低估，換成厚尾分布或直接用歷史資料模擬才貼近實際。",
    choiceExplanations: {
      A: "平均報酬與夏普比率描述的是整體報酬與每單位波動的報酬，不反映極端損失；把極端日當成扭曲，正好忽略了要估計的尾端風險。",
      B: "樣本再多也不會讓厚尾的母體變成常態，這是分布性質而非估計誤差；延長期間只會更清楚地看到厚尾。",
      C: "提高信賴水準仍是在同一條被低估的常態尾巴上往外取值，常態假設對極端事件的低估偏誤依然存在。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["厚尾", "常態假設", "尾端風險"],
      constraints: ["quality", "risk_priority"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Overgeneralization",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若資產的報酬經檢定確實近似常態（例如高度分散的長期指數），常態假設就是合理且計算上最簡便的選擇。",
    },
  },
  {
    id: "senior-bigdata-practice-q109",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院的病患等候時間直方圖呈雙峰，資料團隊想直接以單一常態分布建模。下列建議何者最正確？",
    choices: [
      { id: "A", text: "仍以單一常態分布建模，但把標準差放大到能涵蓋兩個峰的範圍，以維持模型簡單、便於向院方主管說明" },
      { id: "B", text: "雙峰常代表混合了兩種機制的群體，應先找出區分變數（如門診別或時段）分開建模，找不到才用混合分布" },
      { id: "C", text: "較小的峰多半是登錄錯誤或轉院等特殊個案，應先刪除這些紀錄，再以單一常態分布建模" },
      { id: "D", text: "改用較寬的分箱讓直方圖平滑成單峰，確認雜訊已消除後再以常態分布擬合等候時間" },
    ],
    answer: "B",
    explanation:
      "雙峰是結構特徵而非雜訊。硬用單一常態去描述，平均值會落在兩峰之間的低谷，反而不代表任何一群。先找出造成分群的變數，才是真正解釋了這個現象。",
    choiceExplanations: {
      A: "放大標準差只是讓一個形狀錯誤的分布變寬，兩峰之間的低谷反而被估成最常見的等候時間，無法描述任何一群病患。",
      C: "較小的峰是真實存在的一群病患，未經查證就當成錯誤刪除，等於丟掉最有價值的線索，模型也會系統性地偏向另一群。",
      D: "加寬分箱只是把結構從圖上抹掉，資料裡的兩群病患依然存在；以平滑後的單峰擬合常態，問題只是被藏起來。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["雙峰分布", "混合群體", "分群變數"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22302",
      decisionBoundary:
        "若找不到任何能區分兩峰的變數，就只能以混合分布建模，而不是硬拆成兩群。",
    },
  },
  {
    id: "senior-bigdata-practice-q110",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台想以樣本平均估計全體學生的每日學習時數，母體分布明顯右偏。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "依中央極限定理，樣本數夠大且獨立時，樣本平均的抽樣分布仍趨近常態，可據以建立信賴區間" },
      { id: "B", text: "母體明顯右偏，以常態為基礎的信賴區間並不成立，應改估中位數並以無母數的拔靴法建立區間" },
      { id: "C", text: "應先對學習時數取對數使其接近常態，再估計平均並建立信賴區間" },
      { id: "D", text: "樣本數夠大時，抽出的樣本資料本身會趨近常態，因此可直接套用常態推論" },
    ],
    answer: "A",
    explanation:
      "中央極限定理談的是「樣本平均」這個統計量的分布，而不是母體本身。母體再偏，只要樣本夠大且獨立同分布，樣本平均的抽樣分布仍會趨近常態。",
    choiceExplanations: {
      B: "中央極限定理保證的是樣本平均的分布，母體右偏不妨礙以常態建立平均數的信賴區間；改估中位數則換掉了題目要估計的平均學習時數。",
      C: "取對數後估計的是對數尺度的平均，轉回原尺度是幾何平均而非算術平均；中央極限定理也不要求母體先變成常態。",
      D: "樣本越大，樣本資料的分布只會越像右偏的母體；趨近常態的是樣本平均的抽樣分布，不是樣本資料本身。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["中央極限定理", "抽樣分布", "母體偏態"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若母體的變異數不存在（極厚尾），中央極限定理的前提就不成立，樣本平均不會趨近常態。",
    },
  },
  {
    id: "senior-bigdata-practice-q111",
    subjectId: "senior-bigdata",
    prompt:
      "某農業團隊要模擬「每公頃田區在一季內出現病株的株數」，已知面積固定、病株出現率低且彼此大致獨立。最適合的分布是下列何者？",
    choices: [
      { id: "A", text: "均勻分布" },
      { id: "B", text: "指數分布" },
      { id: "C", text: "卜瓦松分布" },
      { id: "D", text: "伯努利分布" },
    ],
    answer: "C",
    explanation:
      "固定的空間範圍內、低發生率、彼此獨立的事件計數，正是卜瓦松分布的典型適用情境——它同樣適用於單位空間而不只是單位時間。",
    choiceExplanations: {
      A: "均勻分布假設每個株數等機率，與低發生率的實際情形不符。",
      B: "指數分布描述的是事件之間的間隔距離或時間，屬連續變量。",
      D: "伯努利只描述單次試驗的成敗，無法表示一整片田區的株數。",
    },
    topic: "L22102 機率分佈與資料分佈模型",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["卜瓦松分布", "單位空間計數", "獨立性"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若病株會沿著灌溉渠道群聚傳染、彼此不再獨立，卜瓦松會低估群聚的株數，該改用負二項分布。",
    },
  },

  // ── L22103 假設檢定與統計推論（8 題）──────────────────────────
  {
    id: "senior-bigdata-practice-q017",
    subjectId: "senior-bigdata",
    prompt:
      "某次假設檢定得到 p 值為 0.03，顯著水準設定為 0.05。下列判讀何者最正確？",
    choices: [
      { id: "A", text: "代表對立假設為真的機率約為 97%" },
      { id: "B", text: "在 0.05 的顯著水準下拒絕虛無假設" },
      { id: "C", text: "p 值未低於 0.01，仍應保留虛無假設" },
      { id: "D", text: "代表觀察到的差異有 3% 的機率是巧合" },
    ],
    answer: "B",
    explanation:
      "p 值小於顯著水準即拒絕虛無假設。p 值的意義是「若虛無假設為真，觀察到此結果或更極端結果的機率」，並不是虛無假設為真或為假的機率。",
    choiceExplanations: {
      A: "這是對 p 值最常見的誤解；p 值是在虛無假設成立前提下觀察到此資料的機率，不能用 1 − p 換算成對立假設為真的機率。",
      C: "判斷門檻是事先設定的顯著水準 0.05 而非 0.01；p 值 0.03 已小於 0.05 就應拒絕虛無假設，事後改用更嚴的門檻等於改變規則。",
      D: "p 值是假設虛無假設為真時，觀察到此結果或更極端結果的機率，不是「差異純屬巧合」的機率。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["p值", "顯著水準", "判讀"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若這是二十個檢定中挑出來的那一個，0.03 就不再具有原本的意義，必須先做多重比較校正。",
    },
  },
  {
    id: "senior-bigdata-practice-q018",
    subjectId: "senior-bigdata",
    prompt:
      "在假設檢定中，「型一錯誤（Type I Error）」指的是下列何者？",
    choices: [
      { id: "A", text: "對立假設為真卻被拒絕" },
      { id: "B", text: "虛無假設為假卻未被拒絕" },
      { id: "C", text: "虛無假設為真卻被拒絕" },
      { id: "D", text: "虛無假設為假且被拒絕" },
    ],
    answer: "C",
    explanation:
      "型一錯誤是「無中生有」——實際上沒有效果，卻判定有效果，其機率上限由顯著水準 α 控制。型二錯誤則是「視而不見」，有效果卻沒檢出。",
    choiceExplanations: {
      A: "對立假設為真卻判定沒有效果，等同於虛無假設為假卻未被拒絕，這是型二錯誤而非型一錯誤。",
      B: "這是型二錯誤的定義，與型一相反。",
      D: "虛無假設為假時拒絕它是正確的決策，其機率就是檢定力（1 − β），並不是錯誤。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["型一錯誤", "型二錯誤"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若把顯著水準從 0.05 調到 0.01，型一錯誤機率下降，但型二錯誤（漏檢）會隨之上升——兩者是此消彼長的取捨。",
    },
  },
  {
    id: "senior-bigdata-practice-q019",
    subjectId: "senior-bigdata",
    prompt:
      "電商在 A/B 測試中同時檢定 20 個指標，並各自以 0.05 為顯著水準。此做法最主要的風險是下列何者？",
    choices: [
      { id: "A", text: "指標之間彼此相關，會使每個檢定的 p 值都被高估" },
      { id: "B", text: "樣本被拆給 20 個指標使用，每個檢定的檢定力會大幅下降" },
      { id: "C", text: "多重比較使至少一個指標出現偽陽性的機率大幅上升" },
      { id: "D", text: "型二錯誤的機率會隨檢定數量累加，容易漏掉真正有效的改版" },
    ],
    answer: "C",
    explanation:
      "每個檢定各有 5% 的偽陽性風險，同時做 20 個時「至少一個誤報」的機率接近 64%。應以 Bonferroni 等方法校正顯著水準，或事先指定單一主要指標。",
    choiceExplanations: {
      A: "指標彼此相關會影響多重比較校正的保守程度，但不會讓個別檢定的 p 值被高估；真正的風險是整組檢定中出現偽陽性的機率上升。",
      B: "每個指標都使用同一批使用者的資料，樣本並沒有被拆分，檢定力不會因指標數量而下降。",
      D: "檢定數量增加時累積的是型一錯誤（偽陽性），不是型二錯誤，方向弄反了。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["多重比較", "偽陽性", "校正"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若二十個指標中只有一個是事前指定的主要指標、其餘僅供探索，就不必全部校正，但探索性結果不能當成結論。",
    },
  },
  {
    id: "senior-bigdata-practice-q020",
    subjectId: "senior-bigdata",
    prompt:
      "某研究以極大樣本檢定兩組平均差異，得到 p < 0.001，但實際差異僅 0.2 分（滿分 100）。最合理的解讀是下列何者？",
    choices: [
      { id: "A", text: "統計顯著不等於實務顯著，應同時檢視效果量" },
      { id: "B", text: "p 值極小代表差異穩定存在，應立即據此調整政策" },
      { id: "C", text: "p 值越小代表效果越大，0.001 已屬極強的效果" },
      { id: "D", text: "樣本過大會放大雜訊，應隨機抽出小樣本重新檢定" },
    ],
    answer: "A",
    explanation:
      "樣本數夠大時，再微小的差異也會達到統計顯著。判斷是否值得行動必須看效果量與實務意義，而不是只看 p 值有沒有跨過門檻。",
    choiceExplanations: {
      B: "p 值小只說明差異不太可能來自抽樣波動，但 0.2 分的差距在實務上幾乎沒有意義，不足以支撐政策改變。",
      C: "p 值反映的是證據強度與樣本數的綜合結果，不直接等於效果大小；大樣本下微小的差異也能得到極小的 p 值。",
      D: "大樣本讓估計更精確，並不會放大雜訊；縮小樣本只是降低檢定力，正確做法是搭配效果量解讀。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["統計顯著", "實務顯著", "效果量"],
      constraints: ["governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若這 0.2 分是套用到千萬人的公共政策、且成本極低，微小效果乘上規模後仍可能值得——實務意義取決於規模與成本。",
    },
  },
  {
    id: "senior-bigdata-practice-q021",
    subjectId: "senior-bigdata",
    prompt:
      "95% 信賴區間的正確解讀是下列何者？",
    choices: [
      { id: "A", text: "再抽一次樣本時，新的樣本平均數有 95% 的機率落在此區間內" },
      { id: "B", text: "真實參數有 95% 的機率落在這個特定區間內" },
      { id: "C", text: "約 95% 的個別觀測值會落在此區間內，可作為判定異常值的範圍" },
      { id: "D", text: "以相同方法重複抽樣，約有 95% 的區間會涵蓋真實母體參數" },
    ],
    answer: "D",
    explanation:
      "信賴水準描述的是「程序的長期表現」：用同一套方法重複抽樣建構區間，約 95% 的區間會蓋住真值。對已經算出的那一個區間而言，它要嘛蓋住、要嘛沒蓋住。",
    choiceExplanations: {
      A: "信賴區間估計的是母體參數，不是預測下一次樣本平均數的落點；新樣本平均數落入這個舊區間的機率其實低於 95%。",
      B: "這是最常見的誤解；在古典統計中母體參數是固定值，不對特定區間談機率。",
      C: "信賴區間描述的是母體參數的估計範圍，寬度會隨樣本數增加而縮小；涵蓋個別觀測值的是預測區間或參考範圍，不能拿來判定異常值。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["信賴區間", "長期表現", "古典統計"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若採用貝氏方法計算可信區間（credible interval），「參數有 95% 機率落在此區間」的說法才成立——兩種框架對機率的定義不同。",
    },
  },
  {
    id: "senior-bigdata-practice-q022",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要比較三條產線的平均良率是否有差異，最適合的檢定方法是下列何者？",
    choices: [
      { id: "A", text: "卡方獨立性檢定（χ²）" },
      { id: "B", text: "兩樣本 t 檢定（兩兩比較）" },
      { id: "C", text: "線性迴歸的係數檢定" },
      { id: "D", text: "變異數分析（ANOVA）" },
    ],
    answer: "D",
    explanation:
      "比較三組以上的平均數是否全部相同，標準工具是 ANOVA。它一次檢定所有組別，避免兩兩 t 檢定造成的多重比較問題。",
    choiceExplanations: {
      A: "卡方獨立性檢定處理的是類別變數之間的關聯，不用於比較連續變數的平均。",
      B: "三條產線兩兩比較要做三次 t 檢定，會累積偽陽性風險；ANOVA 能一次檢定所有組別。",
      C: "迴歸可以處理此問題但需另設虛擬變數，並非最直接的選擇。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["ANOVA", "多組平均比較"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若 ANOVA 顯示至少一組不同、還要知道是哪兩組不同，就得再做事後多重比較（如 Tukey）並校正。",
    },
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
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["單尾檢定", "方向性假設"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若新肥料也有可能導致減產、而研究者需要偵測這個方向，就必須改用雙尾檢定。",
    },
  },
  {
    id: "senior-bigdata-practice-q024",
    subjectId: "senior-bigdata",
    prompt:
      "分析師在資料中嘗試多種切分方式，直到找到一個 p < 0.05 的結果才寫進報告。此做法的問題最貼切的名稱是下列何者？",
    choices: [
      { id: "A", text: "過擬合（Overfitting）" },
      { id: "B", text: "p 值操縱（p-hacking）" },
      { id: "C", text: "倖存者偏誤（Survivorship）" },
      { id: "D", text: "抽樣偏誤（Sampling Bias）" },
    ],
    answer: "B",
    explanation:
      "反覆嘗試不同分析方式直到出現顯著結果，會讓報告出來的 p 值嚴重低估真實的偽陽性風險。防範方式是事前登錄分析計畫，並揭露所有做過的檢定。",
    choiceExplanations: {
      A: "過擬合（Overfitting）指模型過度貼合訓練資料，是建模問題；此處是分析與報告方式的問題。",
      C: "倖存者偏誤是只觀察到通過篩選而留下來的樣本，例如只分析存活下來的企業；此處樣本沒有被篩選，被挑選的是分析方式。",
      D: "抽樣偏誤（Sampling Bias）來自樣本取得方式不具代表性，而此處樣本沒變、變的是分析途徑。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["p值操縱", "事前登錄", "揭露"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若所有嘗試過的切分方式都被完整揭露、並做了多重比較校正，那就是合法的探索性分析而不是 p 值操縱。",
    },
  },
  {
    id: "senior-bigdata-practice-q112",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台的 A/B 測試檢定了 20 個指標，其中一個 p 值為 0.04，團隊據此宣稱新版有效。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "20 個檢定中至少一個偽陽性的機率約六成，不足以支撐結論，應事前指定主要指標或校正多重比較後再判讀" },
      { id: "B", text: "p 值 0.04 已低於 0.05 的顯著水準，且各指標是分開獨立檢定的，因此可宣稱新版在該指標上確實有效" },
      { id: "C", text: "應改用單尾檢定重新計算，讓其他接近顯著的指標也能過門檻，以多個顯著結果互相佐證" },
      { id: "D", text: "應把 20 個指標的 p 值取平均，若平均仍低於 0.05 才宣稱新版整體有效，避免只挑單一指標" },
    ],
    answer: "A",
    explanation:
      "每個檢定各有 5% 的偽陽性風險，做 20 次時「至少一個誤報」的機率接近 64%。在這種情況下挑出那個唯一顯著的指標，很可能挑到的就是雜訊。",
    choiceExplanations: {
      B: "單一檢定的判準不能直接套用在一整組檢定上；即使各指標分開檢定，20 次中出現一次 p＜0.05 本來就很可能是雜訊。",
      C: "改單尾只是讓同一批檢定更容易顯著，偽陽性問題反而加劇；靠放寬門檻撐過的多個結果無法互相佐證。",
      D: "p 值取平均沒有統計意義，既不控制偽陽性，也不對應任何假設；應事前指定主要指標，或以校正方法處理多重比較。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["多重比較", "偽陽性", "主要指標"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若這個指標是實驗前就明確指定的唯一主要指標、其餘僅供探索，0.04 就有它原本的意義，不必校正。",
    },
  },
  {
    id: "senior-bigdata-practice-q113",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院以百萬筆資料檢定兩種術式的併發症率差異，得到 p < 0.001，但絕對差距僅 0.02 個百分點。下列判讀何者最正確？",
    choices: [
      { id: "A", text: "p 值極小代表差距穩定可靠，即使只有 0.02 個百分點，也應立即全面改用較佳術式" },
      { id: "B", text: "統計顯著不等於臨床顯著；應以效果量與臨床可接受範圍判斷，並考慮改變術式的成本與風險" },
      { id: "C", text: "百萬筆資料會讓任何微小差異都顯著，應隨機抽取一萬筆重新檢定，以結果是否仍顯著作為判斷依據" },
      { id: "D", text: "應把顯著水準調嚴到 0.0001 再檢定，若仍顯著即可確認兩種術式的差異有臨床價值" },
    ],
    answer: "B",
    explanation:
      "樣本夠大時，再微小的差異也會達到統計顯著。0.02 個百分點在臨床上幾乎不可察覺，而改變術式牽涉訓練、器械與轉換風險——判斷要看效果量與代價，不是 p 值有沒有跨過門檻。",
    choiceExplanations: {
      A: "p 值小只說明差距不太可能來自抽樣波動，不代表差距在臨床上有意義；0.02 個百分點不足以抵銷改變術式的訓練與轉換風險。",
      C: "縮減樣本只是降低檢定力，讓結論取決於抽樣運氣；真正要看的是效果量與臨床意義，不是換一個樣本數再看 p 值。",
      D: "調嚴門檻只回答差異是否可能來自抽樣波動，絕對差距只有 0.02 個百分點的事實不會改變，臨床價值也無法由 p 值確認。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Concept Boundary",
      concepts: ["統計顯著", "臨床顯著", "效果量"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若這 0.02 個百分點對應的是每年上千件手術中多出的數十例重大併發症，規模乘上去後就可能值得改變——實務意義取決於基數。",
    },
  },
  {
    id: "senior-bigdata-practice-q114",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的分析師嘗試了十餘種客群切分方式，最後只在報告中呈現唯一顯著的那一種。下列判斷與防範何者最正確？",
    choices: [
      { id: "A", text: "這是抽樣偏誤，客群切分讓各個子樣本失去代表性，應重新隨機抽樣後再完整做一次分析" },
      { id: "B", text: "這是過擬合，切分方式過度貼合手上的資料，應改用交叉驗證挑出最佳的切分方式" },
      { id: "C", text: "這是 p 值操縱，報告的 p 值嚴重低估真實偽陽性風險；應事前登錄分析計畫並揭露所有做過的檢定" },
      { id: "D", text: "這是多重比較問題，只要把顯著水準除以切分數量（Bonferroni）重算即可，不必揭露其他切分" },
    ],
    answer: "C",
    explanation:
      "反覆嘗試不同切分直到出現顯著結果，等於做了十幾次隱形的檢定卻只報一次。防範靠制度：事前把要檢定什麼寫下來，事後把做過的全部揭露。",
    choiceExplanations: {
      A: "樣本取得方式沒有改變，變的是分析途徑；重新抽樣後再試十餘種切分，同樣會挑出偶然顯著的結果。",
      B: "過擬合是模型層面的概念；此處問題在於反覆檢定只報顯著者，用交叉驗證挑最佳切分仍是在多次嘗試中選結果，也沒有揭露做過的檢定。",
      D: "事後校正必須知道實際做了幾次檢定，不揭露其他切分，讀者就無從檢驗校正是否完整；而且切分是看著資料挑的，只有事前登錄才能真正防範。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["p值操縱", "事前登錄", "揭露義務"],
      constraints: ["governance", "quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若所有嘗試過的切分都被完整揭露並做了多重比較校正，那就是合法的探索性分析而不是 p 值操縱。",
    },
  },
  {
    id: "senior-bigdata-practice-q115",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠要比較四條產線的平均良率是否有差異。若逐一做兩兩 t 檢定共六次，最主要的問題是下列何者？",
    choices: [
      { id: "A", text: "良率是比例資料，不符合 t 檢定的常態假設，應先做反正弦轉換使其接近常態後再進行兩兩比較" },
      { id: "B", text: "六次檢定會累積偽陽性風險，應先以 ANOVA 檢定整體差異，再以校正過的事後比較找出是哪兩組" },
      { id: "C", text: "應把四條線合併成高產能與低產能兩組，只做一次 t 檢定以避免多重比較" },
      { id: "D", text: "兩兩檢定會重複使用同一組資料，使樣本彼此不獨立，應每次比較都重新抽樣" },
    ],
    answer: "B",
    explanation:
      "兩兩比較的次數隨組數快速增加，每次都有偽陽性風險。標準流程是先用 ANOVA 一次檢定所有組別是否全部相同，若拒絕再做校正過的事後比較。",
    choiceExplanations: {
      A: "樣本夠大時良率的平均可以用 t 檢定比較；轉換只處理分布形狀，六次兩兩比較累積偽陽性的問題仍然存在。",
      C: "合併組別雖然只做一次檢定，卻把要比較的四條產線混在一起，可能掩蓋組內差異，也回答不了是哪兩條線不同。",
      D: "重複使用資料不會破壞同一次比較中兩組樣本的獨立性；核心問題是檢定次數增加累積了偽陽性，重新抽樣無法解決。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["ANOVA", "多重比較", "事後檢定"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若只有兩條產線要比，單次 t 檢定就足夠，多重比較的問題不會出現。",
    },
  },
  {
    id: "senior-bigdata-practice-q116",
    subjectId: "senior-bigdata",
    prompt:
      "某農業試驗的報告寫「新肥料組平均產量較高，95% 信賴區間為 −20 至 180 公斤」。下列判讀何者最正確？",
    choices: [
      { id: "A", text: "平均產量差為 80 公斤且為正值，可宣稱新肥料有效，區間寬度僅反映樣本量" },
      { id: "B", text: "區間有八成以上的範圍落在正值，代表新肥料有效的機率超過八成，可審慎推廣" },
      { id: "C", text: "區間涵蓋 0 證明新肥料沒有效果，應停止推廣並改試其他配方" },
      { id: "D", text: "區間涵蓋 0，代表在此信賴水準下無法排除「兩組沒有差異」，不宜宣稱新肥料有效" },
    ],
    answer: "D",
    explanation:
      "信賴區間涵蓋 0，意味著「沒有差異」也在合理範圍之內。此時宣稱有效並無統計依據；區間很寬則另外說明樣本量不足以做出精確估計。",
    choiceExplanations: {
      A: "點估計為正不代表差異確定存在；區間涵蓋 0 表示「沒有差異」甚至減產都在合理範圍內，區間很寬正是不確定性高的訊號。",
      B: "信賴區間不能解讀為參數落在各段的機率；區間涵蓋 0，在此信賴水準下就無法排除兩組沒有差異。",
      C: "無法排除沒有差異不等於證明沒有效果；區間很寬代表樣本不足以精確估計，較合理的是擴大試驗而非斷言無效。",
    },
    topic: "L22103 假設檢定與統計推論",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["信賴區間", "涵蓋零", "不確定性"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若增加試驗田區後區間收窄到 40 至 120 公斤、不再涵蓋 0，結論就會翻轉為新肥料確實有效。",
    },
  },

  // ── L22201 數據收集與清理（8 題）──────────────────────────────
  {
    id: "senior-bigdata-practice-q025",
    subjectId: "senior-bigdata",
    prompt:
      "資料清理時發現同一位客戶因為姓名輸入方式不同而出現多筆記錄（如「王大明」與「王 大明」）。此問題屬於下列何者？",
    choices: [
      { id: "A", text: "字元編碼不一致問題" },
      { id: "B", text: "重複資料與實體解析問題" },
      { id: "C", text: "參照完整性違反問題" },
      { id: "D", text: "正規化不足的更新異常" },
    ],
    answer: "B",
    explanation:
      "同一個真實實體在資料中被記成多筆，屬於重複資料；要把它們認定為同一人需要實體解析（標準化字串、比對關鍵欄位、設定相似度門檻）。若不處理，客戶數與人均指標都會失真。",
    choiceExplanations: {
      A: "編碼不一致會產生無法辨識的亂碼；「王大明」與「王 大明」都能正常顯示，差別在寫法而不在編碼。",
      C: "參照完整性違反是子表引用了主表不存在的鍵；此處每一筆紀錄本身都合法，問題是同一位客戶被記成多筆。",
      D: "更新異常是同一資訊重複存放在多張表、改了一處漏了另一處；此處是同一人因輸入方式不同被建成多筆主檔，需要的是實體解析。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["重複資料", "實體解析", "字串標準化"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若系統中已有唯一且可靠的客戶編號，比對就退化成單純的鍵值合併，不需要相似度門檻。",
    },
  },
  {
    id: "senior-bigdata-practice-q026",
    subjectId: "senior-bigdata",
    prompt:
      "感測資料中出現「溫度 = −999」的紀錄，經查為設備在無法讀值時寫入的預設代碼。下列處理何者最適當？",
    choices: [
      { id: "A", text: "把低於 −50 度的讀值視為離群值，以該站的溫度中位數取代" },
      { id: "B", text: "保留 −999 原值，交由後續的異常偵測模型自動學習辨識" },
      { id: "C", text: "先辨識為缺失代碼並轉為缺失值，再依情境決定填補或排除" },
      { id: "D", text: "以前後時間點的讀值內插補上 −999，維持時間序列的連續性" },
    ],
    answer: "C",
    explanation:
      "哨兵值（sentinel value）是偽裝成數值的缺失標記，若直接參與計算會嚴重扭曲平均與變異。正確流程是先識別並轉成明確的缺失值，再依分析目的決定填補策略。",
    choiceExplanations: {
      A: "把 −999 當成離群值修補，仍是把它當成「量測到的溫度」；它其實是無法讀值的缺失代碼，以中位數取代等於偽造讀值且不留痕跡。",
      B: "異常偵測模型不知道 −999 代表「無法讀值」，會把它當成極端低溫學習，平均與變異在進入模型前也已被扭曲。",
      D: "內插是辨識為缺失之後才考慮的填補手段之一；直接覆寫而沒有先標記為缺失，日後就無法分辨哪些是真實讀值、哪些是補出來的。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["哨兵值", "缺失代碼", "前處理"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若 −999 在該場域其實可能是真實讀值（例如某些壓力或高程單位），就不能一律當成缺失代碼——判準要回到設備手冊。",
    },
  },
  {
    id: "senior-bigdata-practice-q027",
    subjectId: "senior-bigdata",
    prompt:
      "醫療資料中「性別」欄位同時存在「M／F」「男／女」「1／0」三種編碼。此問題最適合以下列哪一種處理？",
    choices: [
      { id: "A", text: "以 One-Hot 編碼把六種值各自展開成一個欄位" },
      { id: "B", text: "只保留筆數最多的編碼，其餘紀錄刪除" },
      { id: "C", text: "建立編碼對照表並統一為單一標準值" },
      { id: "D", text: "保持原狀，由使用樹模型的下游自動學出對應" },
    ],
    answer: "C",
    explanation:
      "同義不同碼會讓同一個類別被拆成多個，統計與模型都會出錯。以對照表統一為單一標準值，並把轉換規則記錄下來，是資料整合的標準做法。",
    choiceExplanations: {
      A: "One-Hot 會把同義的「M」「男」「1」拆成不同欄位，同一個類別被分成三份，問題反而被固化在特徵裡。",
      B: "刪除會流失大量可用資料，且被刪掉的紀錄可能集中在某些來源系統，造成偏誤；三種編碼本可以對照統一。",
      D: "樹模型也不會知道「M」與「男」是同一件事，只會把它們當成獨立類別各自學習，每一類的樣本因此被拆散變少。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "易",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["編碼對照表", "類別統一"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若某個來源的編碼含意不明（例如 1／0 分不出對應哪一性別），就不能貿然對照，該先回頭確認來源定義。",
    },
  },
  {
    id: "senior-bigdata-practice-q028",
    subjectId: "senior-bigdata",
    prompt:
      "資料收集時，若問卷只在官方網站上發放，最可能產生下列哪一種問題？",
    choices: [
      { id: "A", text: "覆蓋偏誤：不使用該網站的族群被系統性排除" },
      { id: "B", text: "無反應偏誤：收到問卷卻不填答者的意見被遺漏" },
      { id: "C", text: "回憶偏誤：受訪者對過去經驗的記憶不夠準確" },
      { id: "D", text: "社會期許偏誤：受訪者傾向選擇較體面的答案" },
    ],
    answer: "A",
    explanation:
      "抽樣框（能被抽到的人）與目標母體不一致時，就會出現覆蓋偏誤。只在官網發放，等於預先排除了不使用該網站的人，樣本再多也無法代表全體。",
    choiceExplanations: {
      B: "無反應偏誤發生在被抽到卻沒有回覆的人身上；官網發放的問題出現得更早，不使用網站的人根本沒有機會收到問卷。",
      C: "回憶偏誤與發放管道無關，任何管道的問卷都可能發生；本題的問題在於誰有機會被抽到。",
      D: "社會期許偏誤來自題目的敏感度與作答情境，不是發放管道造成的系統性排除。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["覆蓋偏誤", "抽樣框", "代表性"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若目標母體本來就定義為「該網站的使用者」，抽樣框與母體一致，覆蓋偏誤就不成立。",
    },
  },
  {
    id: "senior-bigdata-practice-q029",
    subjectId: "senior-bigdata",
    prompt:
      "資料清理流程中，下列哪一項最應該被記錄下來？",
    choices: [
      { id: "A", text: "清理前後的資料集各保存一份完整副本以便比對" },
      { id: "B", text: "清理完成後資料表的總筆數與欄位數" },
      { id: "C", text: "執行清理的人員姓名、完成時間與核准主管" },
      { id: "D", text: "每一個清理步驟的規則、影響筆數與執行版本" },
    ],
    answer: "D",
    explanation:
      "清理會改變資料，若沒有紀錄就無法重現分析結果，也無法回答「這筆資料為什麼不見了」。規則、影響範圍與版本三者是資料可追溯性的最低要求。",
    choiceExplanations: {
      A: "前後副本只能看出資料有差異，說不出每一筆是被哪一條規則、在哪一個版本改動的，也無法據以重現清理流程。",
      B: "總筆數與欄位數只是結果摘要，無法回答某一筆資料為什麼不見，也無法重現每一個步驟。",
      C: "執行者與核准紀錄有助於究責，但沒有記下規則與影響範圍，就無法重現清理結果或解釋資料的變動。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["清理紀錄", "可追溯性", "版本"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若清理完全以版本控制的程式碼執行、且原始資料不可變，那份程式碼本身就是紀錄，額外的文件可以精簡。",
    },
  },
  {
    id: "senior-bigdata-practice-q030",
    subjectId: "senior-bigdata",
    prompt:
      "農業感測資料中，某測站在颱風期間的數值全為極端值。下列處理何者最恰當？",
    choices: [
      { id: "A", text: "將該測站颱風期間的資料整段排除，以免極端值影響全年統計" },
      { id: "B", text: "以 3 倍標準差為門檻，自動刪除超出範圍的讀值" },
      { id: "C", text: "以颱風前後的平均值覆蓋極端讀值，維持資料的平滑連續" },
      { id: "D", text: "先與領域專家確認屬真實事件或設備異常，再決定保留或標記" },
    ],
    answer: "D",
    explanation:
      "極端值不等於錯誤值。颱風期間的極端讀數很可能是真實現象，正是災害分析最重要的樣本；也可能是設備泡水失效。分辨兩者需要領域知識，不能只看數值大小。",
    choiceExplanations: {
      A: "颱風期間的極端讀數很可能是真實現象，正是災害分析最重要的樣本；未經確認就整段排除，模型將學不到災害情境。",
      B: "統計門檻只看數值大小，分辨不了真實極端事件與設備異常，自動刪除會把真實的災害紀錄一併抹掉。",
      C: "以前後平均覆蓋等於偽造資料，「平滑連續」正好抹平了最關鍵的變化。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["極端值", "真實事件", "領域確認"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若同一時段鄰近測站的讀數都正常、只有這一站爆表，設備異常的可能性就大幅上升，判斷會倒向排除。",
    },
  },
  {
    id: "senior-bigdata-practice-q031",
    subjectId: "senior-bigdata",
    prompt:
      "在資料整合時，來自兩個系統的「日期」欄位分別為「2026/08/22」與「22-08-2026」。下列處理何者最適當？",
    choices: [
      { id: "A", text: "統一解析為標準日期型別（如 ISO 8601）後再合併" },
      { id: "B", text: "去除兩邊的斜線與連字號等分隔符號，再以字串直接比對合併" },
      { id: "C", text: "交由試算表軟體在匯入時自動辨識日期格式，再以辨識結果合併" },
      { id: "D", text: "把日期欄位改存成流水號，以免不同格式互相干擾" },
    ],
    answer: "A",
    explanation:
      "日期必須先解析成真正的日期型別，才能正確排序、計算差值與跨系統比對。統一為 ISO 8601 這類明確格式，也能避免日月順序被誤讀。",
    choiceExplanations: {
      B: "去掉分隔符號後，一邊是年月日、一邊是日月年，順序仍然不同，直接比對不會相等，合併必然失敗。",
      C: "自動辨識遇到「22-08-2026」這類日月年格式時，可能誤讀日月順序或當成文字，結果無法驗證，也不可重現。",
      D: "改成流水號會丟掉時間的順序與間隔意義，兩邊格式不同的問題也沒有被解決，無法做任何時間相關分析。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["日期解析", "ISO 8601", "型別統一"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若兩種格式中一種是「日/月/年」、另一種是「月/日/年」，光看字串分不出 03/04 是哪一天，必須回頭確認來源系統的慣例。",
    },
  },
  {
    id: "senior-bigdata-practice-q032",
    subjectId: "senior-bigdata",
    prompt:
      "建立資料品質監控時，下列哪一組指標最能反映「資料是否可用」？",
    choices: [
      { id: "A", text: "資料量、欄位數、更新頻率與儲存成本" },
      { id: "B", text: "完整性、一致性、及時性與正確性" },
      { id: "C", text: "可用性、擴展性、延遲與吞吐量" },
      { id: "D", text: "多樣性、速度、數量與價值" },
    ],
    answer: "B",
    explanation:
      "資料品質的標準面向包含：該有的值在不在（完整性）、跨來源是否互相矛盾（一致性）、是否即時（及時性）、值本身對不對（正確性）。這四項直接決定分析結果能不能信。",
    choiceExplanations: {
      A: "這些是資料規模與維運面的指標；數量再多、更新再頻繁，內容也可能全是錯值或缺值，不代表資料可用。",
      C: "這些是系統服務品質的指標，描述資料平台跑得穩不穩、快不快，不描述資料內容本身是否正確完整。",
      D: "這是描述大數據特性的 V 架構，說明資料的規模、速度與型態，並不衡量資料內容是否可用。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資料品質", "完整性", "一致性", "及時性"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若分析只用到歷史資料、不涉及即時決策，及時性的權重就大幅下降，重點回到完整性與正確性。",
    },
  },
  {
    id: "senior-bigdata-practice-q117",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的感測資料中，某測站在颱風期間全為極端值，另一測站則在同期完全無資料。下列處置何者最正確？",
    choices: [
      { id: "A", text: "兩者都屬於颱風造成的資料品質異常，可統一以前後時段的平均值填補，以維持時間序列的完整與連續" },
      { id: "B", text: "極端值先保留待現場確認，無資料時段則以鄰近測站的同期讀值插補，讓兩站資料都完整可用" },
      { id: "C", text: "兩者性質不同：極端值須向現場確認是真實事件或設備失效；無資料須確認是斷線遺失或設備關閉，再分別標記處理" },
      { id: "D", text: "兩者都先保留原樣不做標記，交由下游分析師依各自需求判斷是否排除，以免清理時誤刪真實事件" },
    ],
    answer: "C",
    explanation:
      "極端值與缺失是兩種不同的資料品質問題。極端值可能是最有價值的災害樣本、也可能是泡水失效；無資料則要區分「沒收到」與「本來就沒開機」——兩者對後續分析的意義完全不同。",
    choiceExplanations: {
      A: "以前後平均覆蓋極端值等於偽造資料，抹平了最關鍵的變化；兩種問題成因不同，也不該用同一種方式填補。",
      B: "極端值的處理方向正確，但無資料必須先確認是斷線遺失還是設備關閉；若本來就沒開機，以鄰站讀值插補等於捏造該站的運作紀錄。",
      D: "不標記會讓下游各自用不同標準處理，兩種問題被混為一談，錯誤會在更難追查的地方浮現。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["極端值", "缺失成因", "標記方式"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L22101",
      decisionBoundary:
        "若同一時段鄰近測站的讀數都正常、只有這一站爆表，設備異常的可能性就大幅上升，判斷會倒向排除。",
    },
  },
  {
    id: "senior-bigdata-practice-q118",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行整合三套系統的客戶資料，發現同一人在不同系統的姓名寫法、地址格式與電話樣式都不同，且沒有共用識別碼。下列處置何者最合理？",
    choices: [
      { id: "A", text: "先標準化各欄位格式，以多欄位加權相似度做實體解析並設人工複核門檻，再建立主檔與各系統識別碼的對照" },
      { id: "B", text: "先標準化姓名寫法，再以姓名與出生日期完全相同者判定為同一人，其餘一律視為不同的客戶" },
      { id: "C", text: "以電話號碼作為唯一比對鍵、電話相同即合併，因為電話號碼比姓名與地址更不容易出現寫法上的差異" },
      { id: "D", text: "由三套系統的承辦人員各自手動維護客戶對照表，逐筆人工確認同一人後再匯入主檔" },
    ],
    answer: "A",
    explanation:
      "沒有共用識別碼時，比對必須靠多個欄位的組合證據。先標準化格式讓比對有基礎，再以加權相似度判斷，並為介於模糊地帶者保留人工複核；建立主檔則讓日後新增系統只需多一組對照。",
    choiceExplanations: {
      B: "姓名加生日仍可能同名同生日，而且任一欄位有錯字或缺漏就會漏配；完全比對也沒有為模糊案例保留人工複核。",
      C: "電話可能是家戶共用或經常更換，寫法較一致不代表它能唯一識別一個人，單一欄位不足以承擔判定責任。",
      D: "純人工比對在大量客戶下成本高、標準不一，也缺少格式標準化與相似度門檻，結果難以重現與擴充。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["實體解析", "格式標準化", "主檔對照"],
      constraints: ["data_quality", "governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22202",
      decisionBoundary:
        "若三套系統本來就共用同一組客戶編號，比對就退化成單純的鍵值合併，不需要相似度門檻。",
    },
  },
  {
    id: "senior-bigdata-practice-q119",
    subjectId: "senior-bigdata",
    prompt:
      "某教育研究以校園網站問卷蒐集學習狀況，回收兩萬份。研究者宣稱樣本數大故結論可靠。下列質疑何者最關鍵？",
    choices: [
      { id: "A", text: "回收率才是關鍵，兩萬份占全體學生的比例偏低，應以紙本問卷補發提高回收率" },
      { id: "B", text: "兩萬份雖多，但未做分層抽樣，應依年級與科系事後加權，使樣本結構與母體一致" },
      { id: "C", text: "線上問卷容易被重複填答，應先剔除同一 IP 位址的重複作答，才能確認這兩萬份問卷的有效性" },
      { id: "D", text: "抽樣框只涵蓋會造訪該網站的學生，樣本再多也代表不了不使用網站的族群，覆蓋偏誤不因樣本增加而消失" },
    ],
    answer: "D",
    explanation:
      "樣本數解決的是隨機誤差，解決不了系統性的涵蓋不足。抽樣框與目標母體不一致時，多收十倍問卷只會讓一個有偏的估計更精確地偏。",
    choiceExplanations: {
      A: "紙本補發或許能提高回收率，但若發放管道仍受限，覆蓋偏誤依舊存在；問題不在比例高低，而在誰根本沒機會被抽到。",
      B: "事後加權只能調整已被抽到的族群比例，從未造訪網站的學生在樣本中根本不存在，加權無法憑空補上他們的意見。",
      C: "重複填答是資料清理問題，剔除後的有效問卷仍全部來自網站使用者，無法回應抽樣框涵蓋不足這個更根本的問題。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["覆蓋偏誤", "抽樣框", "樣本數迷思"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Neighbor Concept",
      },
      crossNode: "L22301",
      decisionBoundary:
        "若目標母體本來就定義為「該網站的使用者」，抽樣框與母體一致，覆蓋偏誤就不成立。",
    },
  },
  {
    id: "senior-bigdata-practice-q120",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院的檢驗資料中出現大量「9999」的數值，經查是系統在檢驗未完成時寫入的預設值。下列處置何者最正確？",
    choices: [
      { id: "A", text: "保留 9999 原值，但在統計時改用中位數與四分位數，避免極端值扭曲平均" },
      { id: "B", text: "先辨識為哨兵值並轉為明確缺失值，記錄轉換規則與影響筆數，再依目的決定填補或排除" },
      { id: "C", text: "把所有大於 1000 的數值視為離群值一律刪除，以免異常的檢驗結果流入模型訓練" },
      { id: "D", text: "把 9999 改填為該檢驗項目的全院平均值，維持樣本數不減少，也讓模型能正常訓練" },
    ],
    answer: "B",
    explanation:
      "哨兵值是偽裝成數值的缺失標記，直接參與計算會嚴重扭曲平均與變異。轉為明確缺失並記錄轉換規則，後續才有辦法重現分析與追查影響範圍。",
    choiceExplanations: {
      A: "中位數雖較不受極端值影響，但 9999 代表檢驗未完成而非真實數值；大量存在時中位數也會被推高，有效樣本數同樣被灌水。",
      C: "固定閾值一刀切會誤刪真實的高值檢驗結果，也沒有記錄這些值其實代表「檢驗未完成」。",
      D: "直接以平均值覆寫既沒有標記缺失，也抹掉了「檢驗未完成」這個可能與結果相關的訊號，日後更無法追查哪些值是補的。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["哨兵值", "缺失標記", "轉換紀錄"],
      constraints: ["data_quality", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若 9999 在某些檢驗項目上其實是可能的真實數值，就不能一律當成哨兵值，判準要回到各項目的合理範圍。",
    },
  },
  {
    id: "senior-bigdata-practice-q121",
    subjectId: "senior-bigdata",
    prompt:
      "某農業資料管線每日執行清理，但下游分析師常問「這筆資料為什麼不見了」。下列改善何者最直接？",
    choices: [
      { id: "A", text: "每天把清理前與清理後的資料各存一份快照，讓分析師自行比對差異" },
      { id: "B", text: "清理程式改為每月執行一次，降低資料變動的頻率以減少追問" },
      { id: "C", text: "為每個清理步驟記錄規則、影響筆數與執行版本，並保留被排除紀錄的清單" },
      { id: "D", text: "在清理程式中加入詳細的除錯日誌，記錄每次執行的開始時間與耗時" },
    ],
    answer: "C",
    explanation:
      "清理會改變資料，沒有紀錄就無法回答「為什麼不見了」，也無法重現分析。規則、影響筆數與版本三者是可追溯性的最低要求，保留排除清單則讓個案可以直接查。",
    choiceExplanations: {
      A: "前後快照只能看出少了哪些資料，仍然說不出某一筆是被哪一條規則刪掉的，比對工作也被轉嫁給分析師。",
      B: "降低執行頻率只是讓資料變動更集中，每一次仍無法回答某筆資料是被哪條規則排除的。",
      D: "執行時間與耗時屬於維運資訊，沒有記錄規則、影響筆數與被排除的紀錄，仍然答不出某筆資料為什麼不見。",
    },
    topic: "L22201 數據收集與清理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["清理紀錄", "可追溯性", "排除清單"],
      constraints: ["governance", "data_quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L22203",
      decisionBoundary:
        "若清理完全以版本控制的程式碼執行、且原始資料不可變，那份程式碼本身就是紀錄，額外文件可以精簡。",
    },
  },

  // ── L22202 數據儲存與管理（8 題）──────────────────────────────
  {
    id: "senior-bigdata-practice-q033",
    subjectId: "senior-bigdata",
    prompt:
      "關於資料倉儲（Data Warehouse）與資料湖（Data Lake）的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "資料湖在寫入前就必須定義好結構，資料倉儲則在讀取時才決定結構" },
      { id: "B", text: "資料倉儲多存整理過的結構化資料，資料湖可存原始的多種格式資料" },
      { id: "C", text: "資料倉儲以非結構化資料為主，適合直接存放影像、音訊與日誌原始檔" },
      { id: "D", text: "資料湖是資料倉儲的備份區，存放的內容相同但查詢速度較慢" },
    ],
    answer: "B",
    explanation:
      "資料倉儲在寫入前先定義結構（schema-on-write），適合穩定的分析查詢；資料湖先原樣存下、讀取時才決定結構（schema-on-read），保留最大彈性但需要治理，否則會變成資料沼澤。",
    choiceExplanations: {
      A: "方向弄反了：資料倉儲採寫入時定義結構（schema-on-write），資料湖才是先原樣存下、讀取時決定結構（schema-on-read）。",
      C: "影像、音訊與原始日誌這類多格式資料是資料湖的典型內容；資料倉儲以整理過、依事實表與維度表建模的結構化資料為主。",
      D: "資料湖不是倉儲的備份，它保存的是尚未整理的原始多格式資料，兩者在寫入時機、結構要求與用途上都不同。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["資料倉儲", "資料湖", "schema-on-read"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若查詢型態固定、欄位定義穩定且要求毫秒回應，倉儲勝出；若是「先收下來、之後才知道要怎麼用」，資料湖才划算。",
    },
  },
  {
    id: "senior-bigdata-practice-q034",
    subjectId: "senior-bigdata",
    prompt:
      "工廠每秒寫入數萬筆感測讀值，且查詢多為「某台機台最近一小時的趨勢」。最適合的儲存選擇是下列何者？",
    choices: [
      { id: "A", text: "物件儲存（如 S3）" },
      { id: "B", text: "圖形資料庫" },
      { id: "C", text: "時間序列資料庫" },
      { id: "D", text: "關聯式資料庫" },
    ],
    answer: "C",
    explanation:
      "高頻寫入、依時間範圍查詢、幾乎不更新——這正是時間序列資料庫最佳化的存取樣態，它提供高壓縮比、時間分區與降採樣等針對性功能。",
    choiceExplanations: {
      A: "物件儲存適合大量檔案的低成本保存，但不支援依時間範圍的即時查詢，也不適合每秒數萬筆的小筆寫入。",
      B: "圖形資料庫擅長節點與關係的遍歷查詢，感測讀值之間沒有這種結構。",
      D: "關聯式資料庫面對每秒數萬筆的高頻寫入時索引維護成本高，也缺少時間分區、降採樣與高壓縮等時序專用功能。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時間序列資料庫", "高頻寫入", "時間範圍查詢"],
      constraints: ["data_volume", "query_latency"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若查詢改為跨機台、跨料號的複雜關聯與交易一致性需求，關聯式資料庫才是正確選擇。",
    },
  },
  {
    id: "senior-bigdata-practice-q035",
    subjectId: "senior-bigdata",
    prompt:
      "資料分區（Partitioning）在大數據儲存中的主要效益是下列何者？",
    choices: [
      { id: "A", text: "分散在多個節點上，任一節點故障時資料不會遺失" },
      { id: "B", text: "寫入時自動去除重複紀錄以提升正確性" },
      { id: "C", text: "查詢時只掃描相關分區，大幅減少讀取量" },
      { id: "D", text: "把常用欄位預先彙總成小表，查詢直接讀取彙總結果" },
    ],
    answer: "C",
    explanation:
      "把資料依日期或地區等欄位切成分區後，查詢特定範圍時引擎可以跳過其他分區（分區裁剪），讀取量與查詢時間都大幅下降。這是大數據查詢最有效的加速手段之一。",
    choiceExplanations: {
      A: "防止節點故障遺失資料靠的是副本（replication），分區只決定資料如何切分存放，分區後仍需副本與備份。",
      B: "分區改變的是資料的組織方式，不會檢查或去除重複紀錄，錯誤的值也不會因此變正確。",
      D: "預先彙總是物化檢視或彙總表的做法；分區不改變資料內容，只是讓查詢可以跳過無關的分區。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資料分區", "分區裁剪"],
      constraints: ["query_latency"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若查詢條件不含分區鍵（例如依商品名稱查全期），分區裁剪就派不上用場，仍會掃過所有分區。",
    },
  },
  {
    id: "senior-bigdata-practice-q036",
    subjectId: "senior-bigdata",
    prompt:
      "關於欄式儲存格式（如 Parquet）相對於列式儲存的優勢，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "分析查詢常只讀少數欄位，欄式儲存可只讀取需要的欄且壓縮率較高" },
      { id: "B", text: "同一筆記錄的各欄位連續存放，因此單筆完整記錄的寫入與讀取也比列式更快" },
      { id: "C", text: "欄式格式在讀取時才套用結構（schema-on-read），檔案本身不帶型別資訊" },
      { id: "D", text: "欄式儲存把不同型別的值混放在同一區塊，壓縮率通常低於列式格式" },
    ],
    answer: "A",
    explanation:
      "分析型查詢通常只用到寬表中的幾個欄位，欄式儲存讓引擎只讀那幾欄；同一欄的值型別相同、重複度高，壓縮效果也遠優於列式。",
    choiceExplanations: {
      B: "欄式是把同一欄的值連續存放，而非同一筆記錄的各欄位；要組出一筆完整記錄必須跨多個欄位區塊拼裝，這正是欄式的弱項，交易型工作負載仍偏好列式。",
      C: "Parquet 在檔案的中繼資料內就帶有明確的結構描述（schema）與每欄型別，並非讀取時才臨時推定結構。",
      D: "欄式把同一欄、同型別的值放在一起，重複度高，壓縮率通常高於列式；把不同型別混放在一起的反而是列式。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["欄式儲存", "Parquet", "壓縮"],
      constraints: ["query_latency", "storage"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若工作負載是「頻繁讀寫單筆完整記錄」的交易型應用，列式儲存才是正確選擇。",
    },
  },
  {
    id: "senior-bigdata-practice-q037",
    subjectId: "senior-bigdata",
    prompt:
      "醫院要保存十年的影像資料，其中近一年常被調閱、其餘極少存取。最合理的儲存策略是下列何者？",
    choices: [
      { id: "A", text: "全部轉為壓縮率最高的有損格式，以縮小十年的總儲存量" },
      { id: "B", text: "全部放在最高效能的儲存層，確保任何年份的影像都能即時調閱" },
      { id: "C", text: "超過一年的影像改以縮圖保存，原始檔刪除以節省空間" },
      { id: "D", text: "依存取頻率分層儲存，冷資料移至低成本儲存層" },
    ],
    answer: "D",
    explanation:
      "熱資料放高效能層維持調閱速度，冷資料移到低成本的封存層，在成本與可用性之間取得平衡。這種生命週期管理是大量長期保存資料的標準做法。",
    choiceExplanations: {
      A: "醫療影像需保留診斷所需的細節，有損壓縮可能抹去關鍵影像資訊；而且單純縮小體積並未處理冷熱存取頻率的差異。",
      B: "為了偶爾才發生的舊影像調閱，把極少存取的資料都留在昂貴儲存層，成本會隨年份不斷累積；冷資料其實可接受較長的取回時間。",
      C: "醫療影像多有法定保存年限，刪除原始檔等於未依法保存，縮圖也不足以支援日後的診斷調閱。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["分層儲存", "冷熱資料", "生命週期"],
      constraints: ["cost", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若冷資料偶爾需要在數分鐘內調閱（例如醫療爭議調查），就不能放進取回需數小時的深度封存層。",
    },
  },
  {
    id: "senior-bigdata-practice-q038",
    subjectId: "senior-bigdata",
    prompt:
      "資料治理中的「資料血緣（Data Lineage）」指的是下列何者？",
    choices: [
      { id: "A", text: "記錄每個資料表的建立者、建立日期與最後修改時間等中繼資料" },
      { id: "B", text: "標示每份資料存放在哪個系統與節點，以及其備援副本的位置" },
      { id: "C", text: "描述各資料表的欄位名稱、型別與主外鍵關聯的結構文件" },
      { id: "D", text: "追蹤資料從來源、經過哪些轉換、到最終報表的完整路徑" },
    ],
    answer: "D",
    explanation:
      "血緣記錄的是資料的來龍去脈。報表數字有疑問時，可以沿著血緣往上追到來源與每一步轉換；反過來也能在來源異動時評估會影響哪些下游報表。",
    choiceExplanations: {
      A: "建立者與時間戳只是單一資料表的稽核中繼資料，無法呈現資料跨系統經過了哪些轉換。",
      B: "存放位置與備援屬於基礎設施與災備資訊，描述的是資料在哪裡，而非從哪裡來、怎麼被加工。",
      C: "那是資料字典或結構描述，屬於靜態的結構資訊，不說明資料從哪裡來、經過哪些轉換。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資料血緣", "轉換路徑", "影響分析"],
      constraints: ["governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若管線只有一步、來源與報表一對一，血緣的價值有限；步驟越多、分支越廣，它才越不可或缺。",
    },
  },
  {
    id: "senior-bigdata-practice-q039",
    subjectId: "senior-bigdata",
    prompt:
      "NoSQL 資料庫相對於關聯式資料庫，最常被強調的特性是下列何者？",
    choices: [
      { id: "A", text: "彈性的資料結構與水平擴展能力" },
      { id: "B", text: "比關聯式資料庫提供更強的跨表交易一致性保證" },
      { id: "C", text: "不必依查詢模式設計資料模型，欄位可隨意存放" },
      { id: "D", text: "以正規化表格與標準 SQL 為核心設計" },
    ],
    answer: "A",
    explanation:
      "NoSQL 泛指不以固定表格結構為前提的資料庫，多半允許欄位彈性變動並以分散節點水平擴展，適合資料結構會演進、量體成長快速的場景。",
    choiceExplanations: {
      B: "許多 NoSQL 為了可用性與擴展性放寬一致性（例如採最終一致性），跨文件或跨表的交易保證通常不如關聯式資料庫。",
      C: "彈性不等於不用設計；查詢模式仍應驅動文件結構或鍵的設計，否則效能會很差。",
      D: "正規化表格與標準 SQL 是關聯式資料庫的核心特徵，NoSQL 泛指不以此為前提的資料庫。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["NoSQL", "彈性結構", "水平擴展"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若應用需要跨多張表的強一致交易（例如轉帳），關聯式資料庫的保證仍難以取代。",
    },
  },
  {
    id: "senior-bigdata-practice-q040",
    subjectId: "senior-bigdata",
    prompt:
      "農業研究單位要讓外部研究者取用資料，但不希望暴露原始明細。下列做法何者最適當？",
    choices: [
      { id: "A", text: "建立唯讀資料庫帳號給外部研究者，讓其直接查詢原始明細" },
      { id: "B", text: "提供彙總後或去識別化的資料集，並以權限控管存取範圍" },
      { id: "C", text: "移除姓名欄位後，將完整明細公開於網站供任何人下載" },
      { id: "D", text: "請研究者簽署保密協議後，提供完整的原始明細資料" },
    ],
    answer: "B",
    explanation:
      "彙總或去識別化能在保留研究價值的同時降低可識別風險，再搭配權限控管與使用條款，讓分享的範圍與用途都可控。",
    choiceExplanations: {
      A: "唯讀只防止竄改，研究者仍能看到全部原始明細，而題目要求的正是不暴露明細，且難以限制查詢範圍。",
      C: "只刪姓名仍可能透過其他欄位交叉比對而重新識別；無存取控制的公開一旦外流便無法收回。",
      D: "保密協議只是事後的法律約束，仍然把原始明細交了出去，沒有在技術上降低暴露風險。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["彙總資料", "去識別化", "權限控管"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若研究本身就需要個體層級的追蹤資料，彙總會讓研究失去意義，此時該走的是資料使用協議加安全運算環境。",
    },
  },
  {
    id: "senior-bigdata-practice-q122",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的分析查詢多為「某條產線、某個月」的彙總，但目前資料表僅依日期分區，查詢仍需掃描全部產線。下列調整何者最合理？",
    choices: [
      { id: "A", text: "改以產線單獨分區並移除日期分區，因為產線條件比日期更常用" },
      { id: "B", text: "取消分區，改靠增加叢集節點平行掃描全部資料來縮短時間" },
      { id: "C", text: "改以日期、產線與設備編號三層分區，讓裁剪粒度一路細到單台設備層級" },
      { id: "D", text: "改以日期與產線複合分區，使常用條件都能觸發裁剪，並控制分區數量" },
    ],
    answer: "D",
    explanation:
      "分區裁剪只在查詢條件包含分區鍵時生效。既然產線是常用條件，就該納入分區設計；但也要控制分區數量——切得太碎會產生大量小檔，metadata 開銷反而拖慢查詢。",
    choiceExplanations: {
      A: "兩個條件都常用，拿掉日期分區後「某個月」的條件就無法裁剪，仍要掃描該產線所有年份的資料。",
      B: "加節點只是把全表掃描分攤出去，讀取量與成本並未減少；取消分區會讓每次查詢都全表掃描。",
      C: "查詢條件只到產線與月份，多切設備這一層無助於裁剪，卻會產生極大量分區與小檔，metadata 開銷反而拖慢查詢。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["複合分區", "分區裁剪", "小檔問題"],
      constraints: ["query_latency", "storage"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若查詢條件不含分區鍵（例如依料號查全期），分區裁剪就派不上用場，該考慮的變成索引或另建彙總表。",
    },
  },
  {
    id: "senior-bigdata-practice-q123",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行同時有兩類負載：即時的單筆帳戶查詢與更新，以及每日的跨年度分析查詢。下列儲存架構何者最合理？",
    choices: [
      { id: "A", text: "兩者都改用欄式儲存，因為欄式壓縮率高、讀取的資料量也較小" },
      { id: "B", text: "兩者共用同一套關聯式資料庫，並把跨年度分析查詢排到夜間離峰時段執行" },
      { id: "C", text: "交易負載用列式關聯式資料庫，分析負載另建欄式分析環境並定期同步" },
      { id: "D", text: "交易改用欄式資料庫確保一致性，分析改用列式資料庫加速大量掃描" },
    ],
    answer: "C",
    explanation:
      "兩類負載的存取樣態相反：交易要快速讀寫單筆完整記錄、分析只讀少數欄位但掃描大量列。硬用同一套會互相拖累——分析查詢的長掃描還可能影響交易的回應時間。",
    choiceExplanations: {
      A: "欄式利於分析，但要組出單筆完整記錄必須跨多個欄位區塊拼裝，即時的單筆查詢與更新會變慢。",
      B: "排在離峰只能緩解衝突，跨年度分析在列式資料庫上仍要大量掃描整列，而銀行交易幾乎沒有真正的離峰，兩者仍會互相拖累。",
      D: "方向正好相反：列式利於單筆完整記錄的讀寫，欄式才利於只讀少數欄位的大量掃描。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Architecture",
      concepts: ["交易與分析負載", "列式與欄式", "負載分離"],
      constraints: ["query_latency", "throughput"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若資料量小到分析查詢在秒級即可完成、且不影響交易，共用同一套資料庫反而省下同步的複雜度。",
    },
  },
  {
    id: "senior-bigdata-practice-q124",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院的報表數字被質疑有誤，追查時發現無人說得清該欄位經過哪些轉換、來自哪個來源系統。下列改善何者最關鍵？",
    choices: [
      { id: "A", text: "建立資料血緣，記錄欄位從來源經過哪些轉換到報表，並支援影響分析" },
      { id: "B", text: "提高報表的更新頻率，讓錯誤數字能更快被使用者發現與回報" },
      { id: "C", text: "為報表加上數位簽章與浮水印，確保報表內容在發布之後沒有被任何人竄改" },
      { id: "D", text: "把所有中間資料表合併成單一寬表，減少轉換步驟以利檢查" },
    ],
    answer: "A",
    explanation:
      "血緣記錄的是資料的來龍去脈。數字有疑問時能沿著它往上追到來源與每一步轉換；反過來，來源異動時也能評估會影響哪些下游報表。",
    choiceExplanations: {
      B: "更快發現錯誤不等於能追出原因，欄位經過哪些轉換仍然無從追溯。",
      C: "簽章與浮水印保障的是報表發出後未被竄改，屬於文件安全；數字在產生之前經過哪些轉換仍不可追。",
      D: "合併中間表會抹掉每一步的轉換痕跡，讓追溯更困難，也可能破壞既有管線；問題在於缺乏紀錄而非步驟太多。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料血緣", "影響分析", "可追溯性"],
      constraints: ["governance", "maintainability"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若管線只有一步、來源與報表一對一，血緣的價值有限；步驟越多、分支越廣，它才越不可或缺。",
    },
  },
  {
    id: "senior-bigdata-practice-q125",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台要保存十年的學習影片，其中近三個月常被觀看、其餘極少存取，但法規要求全部保留。下列儲存策略何者最合理？",
    choices: [
      { id: "A", text: "依存取頻率分層，冷資料移至低成本封存層，並確認取回時間符合需求" },
      { id: "B", text: "全部放在最高效能儲存層，以免法規或使用者調閱時無法即時取出影片" },
      { id: "C", text: "超過三個月的影片轉存為低解析度版本，原始檔刪除以節省空間" },
      { id: "D", text: "全部移至取回需時一天以上的深度封存層，把十年的儲存成本壓到最低" },
    ],
    answer: "A",
    explanation:
      "分層儲存讓成本隨存取頻率下降，但選擇封存層時要確認取回時間——若某天需要在數小時內調閱，取回要一天的深度封存就不適用。",
    choiceExplanations: {
      B: "為了偶發的調閱把十年資料都留在昂貴儲存層，成本會不斷累積；只要確認封存層的取回時間符合需求即可。",
      C: "法規要求全部保留，刪除原始檔即屬違規，低解析度版本也不等於原始資料。",
      D: "近三個月的影片常被觀看，全部放進深度封存會讓每次觀看都要等待取回，冷熱不分同樣不合理。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["分層儲存", "取回時間", "法規保存"],
      constraints: ["cost", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若冷資料完全不需要臨時調閱、只在稽核時提前數週申請，最便宜的深度封存層就完全適用。",
    },
  },
  {
    id: "senior-bigdata-practice-q126",
    subjectId: "senior-bigdata",
    prompt:
      "某農業平台的感測資料每秒數萬筆寫入，查詢幾乎都是「某測站最近 24 小時的趨勢」。下列儲存選擇何者最合理？",
    choices: [
      { id: "A", text: "圖形資料庫，以測站為節點、讀值為邊，方便追蹤測站間的關係" },
      { id: "B", text: "時間序列資料庫，並依測站與時間分區、設定舊資料的降頻與保存政策" },
      { id: "C", text: "關聯式資料庫，為每筆讀值即時維護測站與時間的複合索引" },
      { id: "D", text: "文件資料庫，每筆讀值存成一份文件以保留欄位彈性" },
    ],
    answer: "B",
    explanation:
      "高頻寫入、依時間範圍查詢、幾乎不更新——這正是時序資料庫最佳化的存取樣態，它提供高壓縮、時間分區與降採樣等針對性功能。",
    choiceExplanations: {
      A: "圖形資料庫擅長關係遍歷，但查詢是單一測站的時間範圍趨勢，讀值之間沒有需要遍歷的關係結構。",
      C: "每秒數萬筆寫入下，即時維護 B-tree 索引會成為寫入瓶頸，且缺乏時序資料庫的高壓縮、時間分區與降採樣功能。",
      D: "感測讀值的結構固定，用不到欄位彈性；每筆一份文件會產生海量小文件，metadata 開銷遠大於資料本身。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時序資料庫", "分區", "保存政策"],
      constraints: ["data_volume", "query_latency"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若查詢改為跨測站、跨作物的複雜關聯與交易一致性需求，關聯式資料庫才是正確選擇。",
    },
  },

  // ── L22203 數據處理技術與工具（8 題）──────────────────────────
  {
    id: "senior-bigdata-practice-q041",
    subjectId: "senior-bigdata",
    prompt:
      "關於 ETL 與 ELT 的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者順序相同，差別只在 ELT 的轉換工具由雲端服務代管" },
      { id: "B", text: "ETL 在載入前先轉換，ELT 先載入原始資料再於目標系統中轉換" },
      { id: "C", text: "ELT 省略轉換步驟，原始資料載入後直接供報表使用" },
      { id: "D", text: "ELT 先在獨立的中介伺服器完成轉換，ETL 則載入後才在倉儲內轉換" },
    ],
    answer: "B",
    explanation:
      "ETL 依賴獨立的轉換環節，適合目標系統運算能力有限的年代；ELT 則善用現代資料倉儲的強大運算，先把原始資料載入再以 SQL 轉換，保留了回頭重做的彈性。",
    choiceExplanations: {
      A: "順序正是兩者的分野——轉換發生在載入之前或之後，與工具是否由雲端代管無關。",
      C: "ELT 的 T 就是轉換，只是搬到載入之後於目標系統中執行，不是省略。",
      D: "兩者的順序被顛倒了：ETL 是先轉換再載入，ELT 才是先載入再於目標系統內轉換。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["ETL", "ELT", "轉換時機"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若原始資料含不得進入倉儲的個資，就必須在載入前先去識別化，ELT 的「先載入」在此不成立。",
    },
  },
  {
    id: "senior-bigdata-practice-q042",
    subjectId: "senior-bigdata",
    prompt:
      "MapReduce 運算模型中的 Map 階段主要負責下列何者？",
    choices: [
      { id: "A", text: "把輸入資料分散複寫到多個節點，確保長期儲存的容錯" },
      { id: "B", text: "依鍵把中間結果分組彙總，輸出最終的統計答案" },
      { id: "C", text: "把輸入切分後平行處理，產生中間的鍵值對" },
      { id: "D", text: "依鍵排序並把同鍵的中間結果搬到同一節點" },
    ],
    answer: "C",
    explanation:
      "Map 階段在各節點上對切分後的資料塊平行執行轉換，輸出中間鍵值對；Reduce 階段再依鍵彙總。分而治之正是它能處理超大資料的原因。",
    choiceExplanations: {
      A: "分散複寫與容錯儲存是 HDFS 等分散式檔案系統的職責，MapReduce 是運算模型。",
      B: "依鍵彙總是 Reduce 階段的職責，Map 只負責產生中間鍵值對。",
      D: "依鍵排序並把同鍵資料搬到同一節點，是 Map 與 Reduce 之間的 Shuffle 階段，不是 Map 本身的工作。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["MapReduce", "Map 階段", "鍵值對"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若運算需要跨全部資料的全域排序或反覆疊代，兩階段模型會非常低效，此時要改用支援記憶體疊代的引擎。",
    },
  },
  {
    id: "senior-bigdata-practice-q043",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要對感測資料做「每五分鐘計算一次平均並即時告警」。下列處理模式何者最適合？",
    choices: [
      { id: "A", text: "每五分鐘排程一次批次作業重算全部資料" },
      { id: "B", text: "每日批次處理後產出彙總報表" },
      { id: "C", text: "串流處理搭配時間窗聚合" },
      { id: "D", text: "先全部寫入資料倉儲再以 SQL 查詢" },
    ],
    answer: "C",
    explanation:
      "資料持續流入且需即時反應，正是串流處理的場景；以五分鐘的滾動或滑動時間窗聚合，即可在窗口結束時立刻判斷是否告警。",
    choiceExplanations: {
      A: "每次重算全部歷史資料的成本隨資料量成長，排程啟動與運算延遲也會吃掉即時性；以時間窗增量計算的串流處理才是對應做法。",
      B: "日批次的延遲以天計，無法滿足每五分鐘即時告警的需求。",
      D: "寫入倉儲再查詢屬於事後分析，缺少持續觸發的機制，無法在每個時間窗結束時立即告警。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["串流處理", "時間窗聚合", "即時告警"],
      constraints: ["latency"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若告警只需每天彙整一次寄出，批次處理就夠了，串流的常駐資源與狀態管理成本反而不划算。",
    },
  },
  {
    id: "senior-bigdata-practice-q044",
    subjectId: "senior-bigdata",
    prompt:
      "在分散式運算中「資料傾斜（Data Skew）」指的是下列何者？",
    choices: [
      { id: "A", text: "資料在各節點分配不均，少數節點處理量遠大於其他節點" },
      { id: "B", text: "資料的數值分布呈現右偏，平均數被少數極端值拉高" },
      { id: "C", text: "資料平均分配到各節點，但部分節點硬體較舊而跑得較慢" },
      { id: "D", text: "不同來源的時間戳不同步，導致合併時的事件順序錯亂" },
    ],
    answer: "A",
    explanation:
      "傾斜常因分區鍵取值極度不均（例如某個熱門商品佔了一半交易）而發生，導致少數任務跑很久、整批作業被它拖住。解法包括加鹽（salting）或改變分區鍵。",
    choiceExplanations: {
      B: "那是統計上的偏態，描述數值分布的形狀，與運算負載在節點間的分配不是同一件事。",
      C: "那是節點效能差異造成的落後節點，資料本身分配均勻，並不是資料傾斜。",
      D: "時鐘不同步是資料一致性問題，影響的是事件排序，不是工作負載在節點間的分配。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資料傾斜", "分區鍵", "負載不均"],
      constraints: ["throughput"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若各節點的處理量相近但整體都很慢，那是資源不足或演算法問題，不是傾斜——傾斜的特徵是少數任務拖住整批。",
    },
  },
  {
    id: "senior-bigdata-practice-q045",
    subjectId: "senior-bigdata",
    prompt:
      "教育平台的資料管線每天凌晨執行，但上游來源偶爾延遲導致當日報表為空。下列改善何者最直接？",
    choices: [
      { id: "A", text: "照常產出報表，並在頁首註明上游資料可能尚未到齊" },
      { id: "B", text: "把執行時間固定延後兩小時，讓上游有更多緩衝" },
      { id: "C", text: "改為人工每日確認上游完成後再手動觸發" },
      { id: "D", text: "在管線加入資料到齊檢查與重試機制，未到齊則延後執行並告警" },
    ],
    answer: "D",
    explanation:
      "問題根源是「不管上游到了沒都照跑」。加入到齊檢查（sensor）讓管線先確認來源就緒，未就緒則等待、重試並告警，就能避免產出空報表。",
    choiceExplanations: {
      A: "加註仍是發出不完整的報表，使用者常忽略註記而做出錯誤判斷，問題本身並未解決。",
      B: "固定延後只能涵蓋部分延遲，上游延遲超過兩小時仍會產出空報表，也讓每天的報表都變晚。",
      C: "改為手動會增加人力負擔，且人也可能忘記或誤判是否到齊。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料到齊檢查", "重試", "告警"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若上游永遠不會延遲、只是偶爾整批缺漏，該做的就不是等待重試而是資料完整性檢核與補件流程。",
    },
  },
  {
    id: "senior-bigdata-practice-q046",
    subjectId: "senior-bigdata",
    prompt:
      "資料管線設計中的「冪等性（Idempotency）」指的是下列何者？",
    choices: [
      { id: "A", text: "作業每次執行都產生相同的執行紀錄與耗用時間" },
      { id: "B", text: "作業失敗時會自動重試，直到執行成功為止" },
      { id: "C", text: "系統保證每筆資料恰好只被處理一次，不會重複送達" },
      { id: "D", text: "同一批作業重複執行多次，結果與執行一次相同" },
    ],
    answer: "D",
    explanation:
      "分散式環境中重試是常態，若重跑會造成資料重複累加，錯誤就會被放大。設計成冪等（例如以覆寫分區取代追加）讓重試變得安全，是可靠管線的基本要求。",
    choiceExplanations: {
      A: "冪等關心的是重複執行後的資料結果一致，不是執行紀錄或耗時相同。",
      B: "自動重試是容錯機制，正是因為會重試才需要冪等；重試本身不保證多次執行的結果相同。",
      C: "那是恰好一次（exactly-once）的傳遞語意；冪等指的是即使重複執行，結果仍與執行一次相同，兩者相關但不同。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["冪等性", "重試安全"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若作業本質上是「累加」而非「覆寫」（例如寄送通知），就無法單靠寫法達成冪等，得改以去重鍵記錄已處理的批次。",
    },
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
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["批次處理", "延遲容忍"],
      constraints: ["latency", "cost"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若需求改成「門診量異常時當天就要示警」，月批次的延遲就不可接受，該改為串流或每日批次。",
    },
  },
  {
    id: "senior-bigdata-practice-q048",
    subjectId: "senior-bigdata",
    prompt:
      "農業資料管線每天處理數十 TB 的空拍影像，最主要的效能瓶頸通常出現在下列何者？",
    choices: [
      { id: "A", text: "影像辨識演算法的 CPU 浮點運算量" },
      { id: "B", text: "資料的輸入輸出（I/O）與網路傳輸" },
      { id: "C", text: "多個作業同時寫入時的資料庫鎖定衝突" },
      { id: "D", text: "記憶體不足導致的頻繁垃圾回收" },
    ],
    answer: "B",
    explanation:
      "處理 TB 等級的影像時，運算往往不是瓶頸，把資料搬到運算節點才是。因此常見的優化方向是資料本地化、欄式格式、壓縮與減少不必要的重複讀取。",
    choiceExplanations: {
      A: "處理 TB 級影像時，運算節點多半在等資料送達，CPU 運算通常不是主要瓶頸。",
      C: "影像批次處理多為唯讀掃描，很少並行寫入同一筆資料，鎖定衝突不是主要瓶頸。",
      D: "記憶體與垃圾回收可能拖慢個別作業，但 TB 級資料處理最常見的瓶頸是把資料搬到運算節點。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["I/O 瓶頸", "資料本地化", "傳輸成本"],
      constraints: ["throughput", "data_volume"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若影像已在運算節點本地、且格式已壓縮，瓶頸就可能轉移到解碼運算——瓶頸位置要實測而不是假設。",
    },
  },
  {
    id: "senior-bigdata-practice-q127",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的分散式作業中，某個任務執行時間是其他任務的數十倍，導致整批作業被拖住。已知分區鍵為「分行代碼」，而總行的交易量佔了全部的四成。下列處置何者最合理？",
    choices: [
      { id: "A", text: "增加叢集節點數量並提高平行度，讓每個任務分到的資料量變少" },
      { id: "B", text: "這是資料傾斜；應對熱門鍵加鹽或改用複合分區鍵，將總行資料打散" },
      { id: "C", text: "把分區鍵改為交易金額區間，讓各分區的金額總和接近" },
      { id: "D", text: "對總行資料先抽樣一成再處理，其餘分行維持全量計算" },
    ],
    answer: "B",
    explanation:
      "分區鍵取值極度不均時，單一熱門鍵會落在同一個任務上。加鹽（在鍵後附加隨機後綴）或改用複合鍵能把它切開，讓負載重新分散。",
    choiceExplanations: {
      A: "同一個鍵的資料仍會落在同一個任務上，增加節點與平行度都無法拆開總行那四成資料。",
      C: "金額總和接近不代表筆數接近，以金額區間分區同樣可能不均，且與業務查詢的常用條件不符。",
      D: "抽樣會讓總行的統計失真，等於刪減真實交易紀錄，破壞資料完整性。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料傾斜", "加鹽", "複合分區鍵"],
      constraints: ["throughput"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22202",
      decisionBoundary:
        "若各節點的處理量相近但整體都很慢，那是資源不足或演算法問題，不是傾斜——傾斜的特徵是少數任務拖住整批。",
    },
  },
  {
    id: "senior-bigdata-practice-q128",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台的資料管線因上游延遲而重跑，結果當日統計被重複累加成兩倍。下列設計何者最能根本避免？",
    choices: [
      { id: "A", text: "把統計改為每週執行一次，降低需要重跑的機會" },
      { id: "B", text: "禁止自動重跑，失敗時改由值班人員判斷是否再執行" },
      { id: "C", text: "重跑前先比對筆數，發現加倍時再手動把數字除以二" },
      { id: "D", text: "把寫入設計為冪等，例如覆寫該日分區或以批次識別碼去重" },
    ],
    answer: "D",
    explanation:
      "分散式環境中重試是常態，若重跑會累加，錯誤就會被放大。把寫入改成覆寫分區或以批次識別碼去重，重試就變得安全，不必依賴人不出錯。",
    choiceExplanations: {
      A: "改變頻率不改變重跑會累加的本質，只是降低次數並讓問題更難察覺。",
      B: "人工決定再執行時仍會累加，延誤還會讓暫時性失敗變成資料缺漏；問題出在寫入方式，不在誰來觸發。",
      C: "手動修正無法規模化，且重跑次數不固定時除以二也不對。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["冪等性", "覆寫分區", "批次去重"],
      constraints: ["reliability", "data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若作業本質上是「寄送通知」這類無法覆寫的動作，就得改以去重鍵記錄已處理的批次，而不是靠寫法達成冪等。",
    },
  },
  {
    id: "senior-bigdata-practice-q129",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的即時告警需求為「每五分鐘計算一次平均並比對門檻」，但感測資料常因網路延遲而遲到數分鐘。下列設計何者最合理？",
    choices: [
      { id: "A", text: "以事件時間分窗，並設定容許遲到的水位線，逾期資料另行處理" },
      { id: "B", text: "以資料到達系統的時間分窗，確保每個窗口都能準時關閉" },
      { id: "C", text: "把窗口拉長到一小時，讓遲到數分鐘的資料也能落在窗內" },
      { id: "D", text: "以事件時間分窗但不設等待期，窗口一到即關閉並丟棄所有遲到資料" },
    ],
    answer: "A",
    explanation:
      "若以到達時間分窗，遲到的資料會被算進錯誤的窗口，統計失真。正確做法是依事件本身的時間戳分窗，並設定水位線界定「等多久」，逾期者另行處理。",
    choiceExplanations: {
      B: "準時關閉的代價是遲到的資料被算進錯誤的窗口，網路延遲會直接扭曲統計結果。",
      C: "拉長窗口會犧牲告警的即時性，且遲到超過一小時時問題依舊。",
      D: "依事件時間分窗是對的，但完全不等待等於丟棄所有遲到資料，統計會低估，而遲到的資料可能正是異常時段產生的。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["事件時間", "水位線", "遲到資料"],
      constraints: ["latency", "data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若網路穩定、資料幾乎不會遲到，以到達時間分窗的簡單做法就足夠，水位線的複雜度可以省下。",
    },
  },
  {
    id: "senior-bigdata-practice-q130",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院的資料管線每日凌晨執行，但上游檢驗系統偶爾延遲，導致當日報表為空。下列改善何者最直接？",
    choices: [
      { id: "A", text: "把排程固定延後到上班前，讓上游檢驗系統多幾小時完成" },
      { id: "B", text: "在管線加入資料到齊檢查與重試機制，未到齊則延後執行並告警" },
      { id: "C", text: "照常發送報表，並在空白欄位標示「資料尚未更新」提醒臨床人員" },
      { id: "D", text: "改為人工每日確認檢驗系統完成後，再手動觸發管線執行" },
    ],
    answer: "B",
    explanation:
      "問題根源是「不管上游到了沒都照跑」。加入到齊檢查讓管線先確認來源就緒，未就緒則等待、重試並告警，就能避免產出空報表。",
    choiceExplanations: {
      A: "固定延後只能涵蓋部分延遲，上游延遲更久時仍會產出空報表，且報表也變晚送達。",
      C: "標示仍是發出不完整的報表，臨床人員可能忽略提醒而誤以為當日無異常；問題並沒有在管線端解決。",
      D: "人工確認增加負擔，且人也可能忘記或誤判是否到齊。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料到齊檢查", "重試", "告警"],
      constraints: ["reliability"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若上游永遠不會延遲、只是偶爾整批缺漏，該做的就不是等待重試而是資料完整性檢核與補件流程。",
    },
  },
  {
    id: "senior-bigdata-practice-q131",
    subjectId: "senior-bigdata",
    prompt:
      "某農業團隊每日處理數 TB 的空拍影像，發現運算節點多半在等待資料傳輸。下列優化方向何者最直接？",
    choices: [
      { id: "A", text: "升級運算節點的 CPU 與記憶體，提高每個節點的處理速度" },
      { id: "B", text: "增加更多運算節點，讓每個節點分到的影像更少以縮短時間" },
      { id: "C", text: "把所有影像先集中傳到單一高效能儲存節點，再由各運算節點平行讀取處理" },
      { id: "D", text: "提高資料本地化，讓運算在資料所在節點執行，並以壓縮格式減少傳輸" },
    ],
    answer: "D",
    explanation:
      "處理 TB 等級資料時，瓶頸通常不在運算而在把資料搬到運算節點。讓運算靠近資料、並減少要搬的位元組數，是最直接的兩個方向。",
    choiceExplanations: {
      A: "節點多半在等資料傳輸，瓶頸不在運算；升級 CPU 只會讓節點更快進入等待。",
      B: "資料仍要透過網路搬到新節點，傳輸總量不變，增加節點甚至可能加重網路壅塞。",
      C: "集中儲存讓所有運算節點都得跨網路讀取同一處，傳輸量與壅塞都會更嚴重，方向與資料本地化相反。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資料本地化", "傳輸瓶頸", "儲存格式"],
      constraints: ["throughput", "data_volume"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若影像已在運算節點本地、且格式已壓縮，瓶頸就可能轉移到解碼運算——瓶頸位置要實測而不是假設。",
    },
  },

  // ── L22301 統計學在大數據中的應用（7 題）──────────────────────
  {
    id: "senior-bigdata-practice-q049",
    subjectId: "senior-bigdata",
    prompt:
      "分析發現「冰淇淋銷量」與「溺水事件數」高度正相關。最合理的解讀是下列何者？",
    choices: [
      { id: "A", text: "吃冰淇淋後立即下水容易抽筋，因此冰淇淋銷量導致溺水增加" },
      { id: "B", text: "兩者可能同受氣溫這個共同因素影響，相關不等於因果" },
      { id: "C", text: "溺水事件增加使民眾減少戲水而改買冰品，屬於反向因果" },
      { id: "D", text: "相關係數夠高且達統計顯著時，即可推論兩者具因果關係" },
    ],
    answer: "B",
    explanation:
      "這是混淆變數的經典例子：天氣熱時冰淇淋賣得多，戲水的人也多。要主張因果必須排除共同原因，或以實驗設計、因果推論方法驗證。",
    choiceExplanations: {
      A: "這是替相關硬找機制；即使個別情況存在，也無法解釋整體的共變，兩者主要是共同受氣溫影響。",
      C: "反向因果同樣缺乏機制與證據支持；資料只顯示相關，無法據此判定任何方向的因果。",
      D: "相關係數與顯著性只衡量共變程度及其是否偶然，完全不區分因果方向或是否存在第三因素。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["相關與因果", "混淆變數"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若能在控制氣溫後兩者的相關仍然存在，共同原因的解釋就被削弱，才有進一步探討機制的必要。",
    },
  },
  {
    id: "senior-bigdata-practice-q050",
    subjectId: "senior-bigdata",
    prompt:
      "在大數據環境下，即使極小的差異也常達到統計顯著。此現象的主因是下列何者？",
    choices: [
      { id: "A", text: "資料量大使量測誤差互相抵消，資料品質因此更高" },
      { id: "B", text: "樣本數極大使標準誤變得很小" },
      { id: "C", text: "檢定次數變多，使顯著水準自動放寬" },
      { id: "D", text: "樣本數大使效果量隨之放大" },
    ],
    answer: "B",
    explanation:
      "標準誤隨樣本數增加而縮小，檢定統計量因此變大、p 值變小。所以在大數據下應把重點從「是否顯著」轉向「效果量有多大、值不值得行動」。",
    choiceExplanations: {
      A: "隨機誤差平均後會縮小，但系統性偏誤不會抵消；小差異顯著的主因是標準誤隨樣本數變小，不是品質變好。",
      C: "顯著水準是分析者事先設定的，不會自動改變；多重比較提高的是整體誤判機率，與單一檢定中小差異也顯著無關。",
      D: "效果量是差異本身的大小，不會隨樣本數增加而放大；變小的是標準誤。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["標準誤", "樣本數", "效果量"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若樣本雖大但抽樣有系統性偏誤，標準誤縮小反而讓錯誤的估計看起來更確定——精確不等於準確。",
    },
  },
  {
    id: "senior-bigdata-practice-q051",
    subjectId: "senior-bigdata",
    prompt:
      "銀行以線性迴歸分析「廣告支出」對「開戶數」的影響，R² 為 0.15。此數值代表下列何者？",
    choices: [
      { id: "A", text: "廣告支出每增加 1 元開戶數增加 0.15 戶" },
      { id: "B", text: "模型對開戶數的預測有 15% 落在誤差範圍內" },
      { id: "C", text: "廣告支出與開戶數的相關係數為 0.15" },
      { id: "D", text: "模型解釋了開戶數約 15% 的變異" },
    ],
    answer: "D",
    explanation:
      "R² 是決定係數，衡量模型解釋了應變數多少比例的變異。0.15 代表大部分變異仍由其他未納入的因素造成，用它單獨解釋開戶數並不充分。",
    choiceExplanations: {
      A: "每單位變化的影響量由迴歸係數表示，不是 R²。",
      B: "R² 是模型解釋變異的比例，並非預測落在某個誤差範圍內的比例，也不是準確率。",
      C: "簡單迴歸中 R² 是相關係數的平方，R² 為 0.15 時相關係數約為 0.39，而不是 0.15。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["決定係數", "解釋變異"],
      distractorTypes: {
        A: "Terminology Swap",
        B: "Terminology Swap",
        C: "Terminology Swap",
      },
      decisionBoundary:
        "若模型的用途只是「證明廣告有正向影響」而非精確預測，R² 低不必然是問題，該看的是係數的顯著性與大小。",
    },
  },
  {
    id: "senior-bigdata-practice-q052",
    subjectId: "senior-bigdata",
    prompt:
      "醫療研究希望估計新療法的效果，但無法隨機分派病患。下列哪一種方法最常被用來降低組間差異造成的偏誤？",
    choices: [
      { id: "A", text: "只納入完成全程療程的病患，排除中途退出者以提高資料的完整度與品質" },
      { id: "B", text: "大幅增加樣本數，讓大數法則自動抵銷兩組之間的基線差異" },
      { id: "C", text: "以傾向分數配對（Propensity Score Matching）平衡兩組基線特徵" },
      { id: "D", text: "以兩組存活平均差異搭配 t 檢定（t-test）確認差異是否顯著" },
    ],
    answer: "C",
    explanation:
      "無法隨機分派時，兩組的基線特徵往往不同。傾向分數配對讓特徵相近的病患兩兩相比，模擬隨機化的效果，是觀察性研究的標準工具。",
    choiceExplanations: {
      A: "中途退出往往與療效或副作用有關，只看完成者是選樣偏誤，會高估療效，也沒有處理組間基線差異。",
      B: "大數法則只讓估計更穩定，不會消除系統性的組間差異，只會讓有偏的估計更精確地偏。",
      D: "檢定只能說明差異是否出於偶然，無法區分差異來自療法還是基線不同，選擇效應仍在。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["傾向分數配對", "因果推論", "觀察性研究"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若影響選擇的關鍵變數根本沒被測量到，傾向分數也配不掉那個偏誤——它只能平衡「有觀察到」的特徵。",
    },
  },
  {
    id: "senior-bigdata-practice-q053",
    subjectId: "senior-bigdata",
    prompt:
      "工廠分析發現某製程參數與良率呈現曲線關係（過低或過高良率都差）。若直接以簡單線性迴歸建模，最可能的後果是下列何者？",
    choices: [
      { id: "A", text: "線性模型無法捕捉曲線關係，可能誤判該參數「幾乎沒有影響」" },
      { id: "B", text: "最小平方法會自動加入二次項，因此仍能貼合曲線關係" },
      { id: "C", text: "係數會顯著且偏大，結論會誇大該參數對良率的影響程度" },
      { id: "D", text: "殘差會呈隨機分布，因此分析者無法從殘差圖察覺問題" },
    ],
    answer: "A",
    explanation:
      "當關係呈倒 U 形時，正負斜率互相抵消，線性迴歸的係數可能接近零，讓人誤以為該參數不重要。應改用多項式項、分箱或非線性模型。",
    choiceExplanations: {
      B: "模型形式由分析者選定，最小平方法只估計既定項的係數，不會自行加入非線性項。",
      C: "倒 U 形兩側的斜率會互相抵消，係數通常接近零而非偏大，結論是低估而非誇大。",
      D: "模型設定錯誤時殘差會呈現明顯的曲線樣態，殘差圖正是發現這個問題的工具。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["非線性關係", "線性迴歸侷限", "多項式項"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若製程參數的實際操作範圍只落在曲線的單側（例如都在最適值以下），該區間內近似線性，線性迴歸就仍然堪用。",
    },
  },
  {
    id: "senior-bigdata-practice-q054",
    subjectId: "senior-bigdata",
    prompt:
      "農業試驗把不同田區隨機分派到兩種施肥方案。隨機分派的主要目的是下列何者？",
    choices: [
      { id: "A", text: "讓每塊田區接受最適合其土壤條件的施肥方案" },
      { id: "B", text: "減少達到相同檢定力所需的田區數量，降低試驗成本" },
      { id: "C", text: "讓兩組在已知與未知的干擾因素上期望相同，使差異可歸因於處理" },
      { id: "D", text: "確保兩組在每一項田區特徵上都完全相同，無須再檢查平衡" },
    ],
    answer: "C",
    explanation:
      "隨機分派讓土壤、日照等各種可觀察與不可觀察的因素在兩組間平均分布，因此觀察到的差異才能歸因於施肥方案本身，這是實驗設計最核心的價值。",
    choiceExplanations: {
      A: "依土壤條件指派是刻意的配對而非隨機，會讓土壤條件與施肥方案混在一起，無法分辨差異的來源。",
      B: "所需樣本數由效果量與檢定力決定，隨機分派本身不會減少樣本需求。",
      D: "隨機分派保證的是期望上的平衡，單次分派仍可能失衡，並非保證每項特徵都完全相同。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["隨機分派", "干擾因素", "因果歸因"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若田區數量太少，隨機分派仍可能剛好把肥沃地全分到同一組，此時要改用分層或配對設計來確保平衡。",
    },
  },
  {
    id: "senior-bigdata-practice-q055",
    subjectId: "senior-bigdata",
    prompt:
      "分析線上課程資料時發現「觀看時數多的學生成績較好」，若據此建議所有學生延長觀看時數，最可能忽略下列何者？",
    choices: [
      { id: "A", text: "可能存在反向因果或共同原因（如學習動機），相關不足以支持此建議" },
      { id: "B", text: "觀看時數受網速影響，需先換算成標準化時數才可比較" },
      { id: "C", text: "成績分布偏態，應先轉換成常態分數再計算相關" },
      { id: "D", text: "樣本數不足以讓相關達到統計顯著，結論可能出於偶然" },
    ],
    answer: "A",
    explanation:
      "動機高的學生既會看比較久也會考得好，時數只是動機的表現而非原因；也可能是成績好帶來信心而看更多。要支持「延長時數能提升成績」需要實驗或因果推論設計。",
    choiceExplanations: {
      B: "網速影響的是載入時間而非觀看時數紀錄；即使換算得再精確，相關仍不足以支持因果建議。",
      C: "分布形狀影響的是相關係數的計算方式，不會改變「相關不等於因果」這個核心問題。",
      D: "線上平台的樣本通常很大、相關多已顯著；問題不在偶然性，而在因果推論方式。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["反向因果", "共同原因", "政策建議"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若平台曾隨機指派部分學生額外的觀看提醒，就有了實驗變異可用，因果推論才站得住腳。",
    },
  },
  {
    id: "senior-bigdata-practice-q132",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院想評估新療法的效果，但病患是否接受新療法由醫師依病情決定，無法隨機分派。直接比較兩組存活率顯示新療法較差。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "應排除重症病患，只比較病情輕微者的存活率，以減少病情造成的干擾" },
      { id: "B", text: "存活率差異已達統計顯著，表示新療法確實較差，應立即停止使用" },
      { id: "C", text: "應持續收案、擴大樣本數，直到兩組存活率的差異不再顯著為止" },
      { id: "D", text: "病情較重者較常接受新療法，應先以傾向分數配對平衡兩組再比較" },
    ],
    answer: "D",
    explanation:
      "這是典型的選擇效應：重症者被指派新療法，結果自然較差。直接比較把「病情差異」誤當成「療效差異」。要先讓兩組在可觀察特徵上可比，才談得上比較療效。",
    choiceExplanations: {
      A: "只看輕症會丟掉多數接受新療法的病患，結論無法推廣到重症；且病情只是眾多可觀察特徵之一，應以配對平衡而非刪除。",
      B: "顯著只代表差異不是偶然；未排除基線差異就下結論，可能把病情差異誤當成療效差異，讓有效療法被錯誤停用。",
      C: "樣本再多也不會消除系統性的組間差異，只會讓有偏的估計更精確地偏。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["選擇效應", "傾向分數配對", "基線平衡"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L22103",
      decisionBoundary:
        "若影響醫師決定的關鍵因素根本沒被記錄下來，傾向分數也配不掉那個偏誤——它只能平衡有觀察到的特徵。",
    },
  },
  {
    id: "senior-bigdata-practice-q133",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台發現「使用討論區的學生成績較好」，欲據此要求全體學生使用討論區。下列質疑何者最關鍵？",
    choices: [
      { id: "A", text: "應先確認討論區發言內容的品質與正確性，再決定是否要求全體使用" },
      { id: "B", text: "兩者的相關係數不夠高，不足以支持要求全體學生使用的政策" },
      { id: "C", text: "動機可能同時驅動兩者，或成績好才常發言；需實驗或準實驗設計支持" },
      { id: "D", text: "應以更大的樣本重新計算相關係數，確認結果並非出於偶然" },
    ],
    answer: "C",
    explanation:
      "相關可能來自共同原因（動機）或反向因果（成績好才敢發言）。要主張「使用討論區能提升成績」，必須有隨機指派或至少能模擬它的設計，否則政策可能完全無效。",
    choiceExplanations: {
      A: "發言品質是另一個議題，即使品質良好，相關仍不足以證明使用討論區會提升成績。",
      B: "即使相關係數很高也無法支持因果政策；關鍵是共同原因與反向因果，而非相關強度。",
      D: "線上平台的樣本通常很大，重新計算相關只能確認關聯穩定，仍無法區分因果方向。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["共同原因", "反向因果", "因果設計"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        D: "Overgeneralization",
      },
      crossNode: "L22103",
      decisionBoundary:
        "若平台曾隨機對部分學生推送討論區提醒，就有了實驗變異可用，因果推論才站得住腳。",
    },
  },
  {
    id: "senior-bigdata-practice-q134",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠分析製程溫度與良率，線性迴歸的係數接近零且不顯著，但工程師確信溫度有影響。下列處置何者最合理？",
    choices: [
      { id: "A", text: "先以散佈圖檢視關係形狀；若呈倒 U 形，應加入平方項或用非線性模型" },
      { id: "B", text: "增加樣本數，讓微小的線性效果也能達到統計顯著" },
      { id: "C", text: "以統計結果為準刪除溫度特徵，避免工程師的主觀判斷干擾模型" },
      { id: "D", text: "把顯著水準放寬到 0.1，讓溫度的效果在現有樣本下得以被納入模型" },
    ],
    answer: "A",
    explanation:
      "線性迴歸只能捕捉單調的線性關係。當溫度過低或過高良率都差時，兩側的斜率互相抵消，係數自然接近零——這時該檢查關係形狀而不是懷疑工程師的判斷。",
    choiceExplanations: {
      B: "若關係本質是非線性，樣本再多線性係數仍會接近零，問題出在模型設定。",
      C: "不顯著可能來自模型設定錯誤而非真的無關；刪除一個真正有影響的特徵會讓模型失去重要資訊。",
      D: "放寬門檻只是讓一個本來就抓不到的效果勉強過關，並未修正模型設定。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["非線性關係", "模型設定", "視覺檢視"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22303",
      decisionBoundary:
        "若製程的實際操作範圍只落在曲線的單側，該區間內近似線性，線性迴歸就仍然堪用。",
    },
  },
  {
    id: "senior-bigdata-practice-q135",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行以千萬筆資料建立迴歸模型，多數係數都達統計顯著。主管詢問這代表什麼。下列說明何者最正確？",
    choices: [
      { id: "A", text: "代表資料品質極高，量測誤差已因樣本數龐大而互相抵銷" },
      { id: "B", text: "代表每個係數都對結果有實質影響，整體模型的預測能力也隨之很強" },
      { id: "C", text: "大樣本使標準誤極小，微小關聯也會顯著；應看效果量與實務意義" },
      { id: "D", text: "代表結果已排除偶然誤差，可以省略以獨立資料驗證的步驟" },
    ],
    answer: "C",
    explanation:
      "標準誤隨樣本數增加而縮小，檢定統計量因此變大、p 值變小。在大數據下應把重點從「是否顯著」轉向「效果有多大、值不值得據以行動」。",
    choiceExplanations: {
      A: "資料量大不代表品質好，系統性偏誤不會因樣本多而抵銷，反而常伴隨更多雜訊與偏誤。",
      B: "係數顯著只代表不太可能為零，效果可能微小；顯著與整體預測能力是兩回事，R² 仍可能很低。",
      D: "顯著與否不能取代以獨立資料驗證模型的預測表現。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["大樣本", "標準誤", "效果量"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        D: "Overgeneralization",
      },
      crossNode: "L22103",
      decisionBoundary:
        "若樣本雖大但抽樣有系統性偏誤，標準誤縮小反而讓錯誤的估計看起來更確定——精確不等於準確。",
    },
  },
  {
    id: "senior-bigdata-practice-q136",
    subjectId: "senior-bigdata",
    prompt:
      "某農業試驗把二十塊田區隨機分派到兩種施肥方案，事後發現其中一組的田區恰好多為坡地。下列處置何者最合理？",
    choices: [
      { id: "A", text: "忽略地形差異，因為隨機分派已確保兩組在各項田區特徵上都達到平衡" },
      { id: "B", text: "小樣本隨機分派仍可能失衡；應以地形分層隨機，或分析時納入地形" },
      { id: "C", text: "反覆重新隨機分派，直到兩組田區的坡地比例看起來接近為止" },
      { id: "D", text: "刪除坡地田區的資料，只以平地田區比較兩種施肥方案的產量" },
    ],
    answer: "B",
    explanation:
      "隨機分派保證的是期望上的平衡，樣本少時單次分派仍可能明顯失衡。分層隨機能在設計上避免，把地形納入分析則是事後的補救——兩者都比假裝沒事好。",
    choiceExplanations: {
      A: "隨機性只在多次重複的期望上成立，單次二十塊田區的失衡是真實存在的。",
      C: "反覆重抽到「看起來平衡」為止，會破壞隨機性本身的統計性質。",
      D: "刪除資料會使樣本更小，也可能引入新的選樣偏誤，結論也無法推廣到坡地。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["隨機分派", "分層設計", "控制變數"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若田區數量達數百塊，隨機分派的失衡幅度會小到可忽略，分層的必要性隨之下降。",
    },
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
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["關聯規則探勘", "購物籃分析"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若目標改成「預測這位顧客下次會買什麼」，關聯規則就不夠，該改用推薦系統或序列模型。",
    },
  },
  {
    id: "senior-bigdata-practice-q057",
    subjectId: "senior-bigdata",
    prompt:
      "關聯規則中的「提升度（Lift）」大於 1 代表下列何者？",
    choices: [
      { id: "A", text: "前項出現時，後項也出現的條件機率很高" },
      { id: "B", text: "兩品項的出現彼此獨立，共同出現純屬偶然" },
      { id: "C", text: "兩品項同時出現的機率高於彼此獨立時的期望值" },
      { id: "D", text: "兩品項同時出現的機率低於彼此獨立時的期望值" },
    ],
    answer: "C",
    explanation:
      "提升度是實際共同出現機率除以獨立假設下的期望機率。大於 1 表示買了前項會提高買後項的機會，等於 1 表示無關，小於 1 則是互相排斥。",
    choiceExplanations: {
      A: "那是信賴度的定義；提升度要再除以後項本身的出現機率，比較的是相對於獨立時的提升。",
      B: "完全獨立對應的提升度恰為 1，不是大於 1。",
      D: "方向相反：低於獨立期望值對應的是提升度小於 1，代表兩者傾向互相排斥。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["提升度", "支持度", "獨立性"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Terminology Swap",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若某規則提升度很高但支持度極低（例如全年只出現三次），它在營運上多半不值得據以調整陳列。",
    },
  },
  {
    id: "senior-bigdata-practice-q058",
    subjectId: "senior-bigdata",
    prompt:
      "醫院要把病患依就醫行為分成幾個群體以規劃服務，且事先不知道應該分成幾群。最適合的方法是下列何者？",
    choices: [
      { id: "A", text: "依就醫次數由高到低排序，再等分成三群" },
      { id: "B", text: "監督式分類，以歷史病患資料訓練分群模型" },
      { id: "C", text: "分群分析，並以輪廓係數或肘部法輔助決定群數" },
      { id: "D", text: "假設檢定，逐一比較病患間就醫行為的差異" },
    ],
    answer: "C",
    explanation:
      "沒有預先定義的類別標籤，屬於非監督問題，適合分群；群數則以肘部法、輪廓係數等指標搭配業務可解釋性來決定。",
    choiceExplanations: {
      A: "只用單一變數硬切固定群數，既忽略其他就醫行為，也預設了題幹說不知道的群數。",
      B: "監督式分類需要事先標好的類別，而題幹並無既有標籤，也不知道要分幾群。",
      D: "假設檢定用於驗證特定命題，不負責把樣本分組。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["分群分析", "群數決定", "輪廓係數"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若院方其實已有既定的病患分類（如慢性病／急症），問題就變成監督式分類而不是分群。",
    },
  },
  {
    id: "senior-bigdata-practice-q059",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要預測未來三個月的用電量，資料呈現明顯的週期性與長期成長趨勢。最適合的分析方法是下列何者？",
    choices: [
      { id: "A", text: "時間序列分析（含趨勢與季節性建模）" },
      { id: "B", text: "關聯規則探勘，找出用電與產量的共現規則" },
      { id: "C", text: "分群分析，把相似月份歸類後取群平均" },
      { id: "D", text: "簡單線性迴歸，以時間為自變數外推" },
    ],
    answer: "A",
    explanation:
      "資料依時間排列且同時具趨勢與季節性，正是時間序列分析的對象。可用分解法、ARIMA 或含季節項的模型捕捉這兩種成分後外推。",
    choiceExplanations: {
      B: "關聯規則找的是同時出現的項目組合，無法產生未來的數值預測。",
      C: "分群只把樣本分組，取群平均會抹掉長期成長趨勢，無法外推未來走勢。",
      D: "以時間做線性外推只能捕捉長期趨勢，忽略明顯的週期性，預測會系統性偏離。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["時間序列分析", "趨勢", "季節性"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若未來三個月將新增一條產線、用電結構出現結構性改變，純外推的時間序列模型就會失準，需要加入干預變數。",
    },
  },
  {
    id: "senior-bigdata-practice-q060",
    subjectId: "senior-bigdata",
    prompt:
      "主成分分析（PCA）的主要用途是下列何者？",
    choices: [
      { id: "A", text: "從原始特徵中挑出與目標變數最相關的子集" },
      { id: "B", text: "依變數間的相似度把觀測值分成互斥的群組" },
      { id: "C", text: "找出彼此統計獨立的潛在來源訊號，用以分離多個混合在一起的訊號" },
      { id: "D", text: "以較少的線性組合維度保留資料大部分變異，達到降維目的" },
    ],
    answer: "D",
    explanation:
      "PCA 找出彼此正交、依序解釋最多變異的方向，取前幾個主成分即可用較低維度保留大部分資訊，常用於視覺化與降低共線性。",
    choiceExplanations: {
      A: "那是特徵篩選；PCA 產生的是原始特徵的線性組合，而且不使用目標變數。",
      B: "分組是分群分析的工作，PCA 不產生群體標籤。",
      C: "那是獨立成分分析（ICA）；PCA 的成分只保證彼此正交、不相關，目的在保留最多變異。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["主成分分析", "降維", "變異保留"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若後續必須向稽核說明是哪一個原始欄位造成差異，主成分已失去物理意義，該改用特徵篩選而非降維。",
    },
  },
  {
    id: "senior-bigdata-practice-q061",
    subjectId: "senior-bigdata",
    prompt:
      "銀行要從大量交易中找出「與多數行為模式明顯不同」的可疑交易，且沒有標註的詐欺樣本。最適合的方法是下列何者？",
    choices: [
      { id: "A", text: "關聯規則探勘找出共現交易" },
      { id: "B", text: "以監督式分類訓練詐欺模型" },
      { id: "C", text: "依交易金額設定固定門檻" },
      { id: "D", text: "非監督式異常偵測" },
    ],
    answer: "D",
    explanation:
      "沒有詐欺標籤時，可先以正常交易建立行為分布，把偏離分布的樣本標為異常再交人工複核。這也符合詐欺樣本天生稀少且手法會變的特性。",
    choiceExplanations: {
      A: "關聯規則找的是品項共現樣態，無法直接指出單筆交易是否可疑。",
      B: "監督式分類需要已標註的詐欺樣本，題幹明確指出沒有。",
      C: "固定金額門檻只看單一維度，詐欺者可刻意壓低金額規避，也無法辨識行為樣態的偏離。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["非監督式異常偵測", "無標註", "行為分布"],
      constraints: ["labeled_data_scarcity"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若已累積足夠且標註可靠的詐欺案例，監督式分類通常更準，也能指出屬於哪一種手法。",
    },
  },
  {
    id: "senior-bigdata-practice-q062",
    subjectId: "senior-bigdata",
    prompt:
      "農業單位想了解各縣市的作物產量是否有空間上的群聚現象。最適合的分析取向是下列何者？",
    choices: [
      { id: "A", text: "空間分析（考慮地理鄰近性的統計方法）" },
      { id: "B", text: "把縣市視為完全獨立的樣本做一般迴歸" },
      { id: "C", text: "以時間序列分析各縣市的歷年產量" },
      { id: "D", text: "以分群分析把產量相近的縣市歸類" },
    ],
    answer: "A",
    explanation:
      "地理相鄰的區域往往因氣候與土壤相似而彼此關聯，忽略這種空間自相關會低估標準誤。空間分析方法明確把鄰近關係納入模型。",
    choiceExplanations: {
      B: "把有空間關聯的樣本當成獨立，會違反獨立性假設而導致推論失準。",
      C: "時間序列分析處理的是時間上的相依，題目問的是空間上的群聚，鄰近關係並未納入。",
      D: "依產量數值分群並不考慮地理位置，產量相近的縣市可能相隔很遠，無法檢定空間群聚。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["空間分析", "空間自相關", "鄰近性"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若各縣市的產量彼此確實獨立（例如由完全不同的灌溉系統決定），一般迴歸就足夠，空間項反而是多餘的複雜度。",
    },
  },
  {
    id: "senior-bigdata-practice-q063",
    subjectId: "senior-bigdata",
    prompt:
      "分析電商顧客時常用的 RFM 模型，其三個維度分別是下列何者？",
    choices: [
      { id: "A", text: "顧客的年齡、性別、居住地與職業類別" },
      { id: "B", text: "最近一次消費、消費頻率、消費金額" },
      { id: "C", text: "點擊率、跳出率、頁面平均停留時間" },
      { id: "D", text: "顧客終身價值、流失率、回購率" },
    ],
    answer: "B",
    explanation:
      "RFM 取 Recency（最近一次消費距今多久）、Frequency（消費頻率）、Monetary（消費金額）三個行為維度為顧客分級，是最常用的顧客價值分析框架。",
    choiceExplanations: {
      A: "這些是人口統計變數，屬於另一種分眾方式，不是 RFM。",
      C: "這些是網站流量指標，衡量的是瀏覽行為而非消費價值。",
      D: "這些是由消費紀錄衍生的顧客價值與留存指標，RFM 則是更基礎的三個消費行為維度。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["RFM", "顧客分級"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若商品是低頻高價（如家電），Frequency 幾乎沒有鑑別力，RFM 就要調整權重或改用其他分級方式。",
    },
  },
  {
    id: "senior-bigdata-practice-q137",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行以關聯規則探勘找出「申辦房貸者也常申辦信用卡」的規則，支持度 0.5%、信賴度 80%、提升度 1.02。下列判讀何者最正確？",
    choices: [
      { id: "A", text: "提升度僅略高於 1，兩者幾乎獨立；高信賴度只反映信用卡普及，不宜據此交叉銷售" },
      { id: "B", text: "信賴度 80% 很高，代表房貸客戶多半會辦信用卡，應立即推動交叉銷售" },
      { id: "C", text: "支持度僅 0.5% 代表規則不可信，應提高門檻重新探勘後再判斷" },
      { id: "D", text: "提升度大於 1 即代表正相關，搭配高信賴度足以支持交叉銷售" },
    ],
    answer: "A",
    explanation:
      "信賴度高可能只是因為後項本來就很常見。提升度把這個基礎率除掉，1.02 表示申辦房貸幾乎沒有提高申辦信用卡的機會——這條規則沒有可利用的關聯。",
    choiceExplanations: {
      B: "只看信賴度會被高普及率的商品誤導，房貸客戶辦卡的比例可能與一般客戶相差無幾，這正是提升度存在的理由。",
      C: "支持度低確實代表規則覆蓋的樣本少，但此處的關鍵問題是提升度接近 1。",
      D: "1.02 僅略高於 1，幾乎等同獨立；高信賴度只是反映信用卡本身普及，兩者合起來仍不構成可利用的關聯。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["提升度", "信賴度", "基礎率"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若提升度達 2.5 而支持度仍為 0.5%，關聯是真的但覆蓋太小，該評估的就變成「值不值得為這麼少的客戶設計方案」。",
    },
  },
  {
    id: "senior-bigdata-practice-q138",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院以分群分析劃分病患，輪廓係數在 k=2 時最高，但臨床上明確存在四種病程型態。下列處置何者最合理？",
    choices: [
      { id: "A", text: "改用監督式分類，以四種病程型態作為類別標籤，直接訓練分類模型" },
      { id: "B", text: "以輪廓係數為客觀依據採用 k=2，避免臨床人員的主觀偏見影響分群結果" },
      { id: "C", text: "直接指定 k=4 以符合臨床認知，輪廓係數偏低的問題可以忽略" },
      { id: "D", text: "指標只是輔助；應檢視 k=4 是否對應臨床型態，並檢查特徵是否足以區分" },
    ],
    answer: "D",
    explanation:
      "輪廓係數衡量的是幾何上的分離程度，不知道臨床意義。兩者衝突時，該做的是檢視 k=4 的結果能否對應臨床型態；若不能，很可能是特徵不足以區分它們，那才是真正要補的。",
    choiceExplanations: {
      A: "若已有明確的四種型態標籤，監督式分類確實可行，但題幹並未說明病患已有標籤可用。",
      B: "輪廓係數只衡量幾何上的分離程度，不懂臨床意義；純以指標決定會得到一個臨床上無法使用的分群。",
      C: "完全忽略指標會失去對分群品質的客觀檢核，也錯過檢查特徵是否不足的機會。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["群數選擇", "輪廓係數", "領域可解釋性"],
      constraints: ["quality", "explainability"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      crossNode: "L22401",
      decisionBoundary:
        "若院方其實已有每位病患的病程型態標註，問題就從分群變成監督式分類，指標的角色也隨之改變。",
    },
  },
  {
    id: "senior-bigdata-practice-q139",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠以主成分分析把上百個感測特徵降到十維後建模，效能不錯。但稽核要求說明「是哪一顆感測器異常」時無法回答。下列處置何者最合理？",
    choices: [
      { id: "A", text: "增加主成分數量，直到每個主成分都能各自對應到一顆感測器" },
      { id: "B", text: "主成分混合了多顆感測器；應改用特徵篩選保留原始欄位，或另建診斷模型" },
      { id: "C", text: "以每個主成分中載荷最大的感測器命名，作為稽核時說明是哪一顆感測器異常的依據" },
      { id: "D", text: "改用更深的神經網路取代主成分分析，以更高的準確率直接偵測異常" },
    ],
    answer: "B",
    explanation:
      "降維與可回溯是互相拉扯的兩個目標。主成分把上百顆感測器混在一起，本來就指不回單一來源。要滿足稽核，就得保留原始欄位——用篩選取代降維，或另外建一個負責定位的模型。",
    choiceExplanations: {
      A: "增加主成分數量不會讓每個主成分只對應單一感測器，每個主成分仍是多顆感測器的組合。",
      C: "載荷最大不代表就是異常來源，主成分仍是多顆感測器的加權組合，以單一名稱代表會誤導稽核。",
      D: "更深的模型或許更準，但可解釋性更差，仍然無法指出是哪一顆感測器異常。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["PCA", "可回溯性", "特徵篩選"],
      constraints: ["explainability"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L22401",
      decisionBoundary:
        "若稽核只需知道「異常大致來自哪一組製程」而非單顆感測器，主成分的載荷分析就可能已經足夠。",
    },
  },
  {
    id: "senior-bigdata-practice-q140",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台要預測未來三個月的每週活躍人數，資料呈現明顯的學期週期與長期成長。下列方法何者最合適？",
    choices: [
      { id: "A", text: "分群分析，先把特徵相似的週次歸類再取各群平均" },
      { id: "B", text: "直接以過去全期的平均活躍人數作為未來每週預測值" },
      { id: "C", text: "時間序列分析，明確建模趨勢與季節成分後外推" },
      { id: "D", text: "以週次為自變數做簡單線性迴歸，再直接外推" },
    ],
    answer: "C",
    explanation:
      "資料依時間排列且同時具趨勢與週期，正是時間序列分析的對象。把兩種成分分別建模後再外推，比直接用整體平均或線性外推準確得多。",
    choiceExplanations: {
      A: "分群把樣本分組，取群平均會抹掉長期成長，也不預測時間軸上的走勢。",
      B: "整體平均同時抹掉長期成長與學期週期，預測會系統性偏離。",
      D: "線性外推只捕捉長期成長，忽略明顯的學期週期，旺季與淡季都會預測錯。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["時間序列", "趨勢", "季節性"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若下學期將改變學制、活躍模式出現結構性斷裂，純外推的模型就會失準，需要加入干預變數。",
    },
  },
  {
    id: "senior-bigdata-practice-q141",
    subjectId: "senior-bigdata",
    prompt:
      "某農業單位想找出「哪些鄉鎮的病害發生呈空間群聚」。下列分析取向何者最合適？",
    choices: [
      { id: "A", text: "空間分析，明確把地理鄰近關係納入模型以檢定空間自相關" },
      { id: "B", text: "把各鄉鎮視為獨立樣本做一般迴歸，再比較殘差大小" },
      { id: "C", text: "以時間序列分析各鄉鎮病害的逐月變化趨勢" },
      { id: "D", text: "以分群分析把病害率相近的鄉鎮歸為同一群" },
    ],
    answer: "A",
    explanation:
      "地理相鄰的鄉鎮往往因氣候與土壤相似而彼此關聯。忽略這種空間自相關會低估標準誤、做出過度自信的推論；空間分析方法明確把鄰近關係納入。",
    choiceExplanations: {
      B: "把有空間關聯的樣本當成獨立，會違反獨立性假設而導致推論失準；只比較殘差大小也沒有檢定鄰近關係。",
      C: "時間序列分析處理的是時間上的變化，並未把地理鄰近關係納入，無法檢定空間群聚。",
      D: "依病害率分群並不考慮地理位置，病害率相近的鄉鎮可能相隔很遠，不等於空間群聚。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["空間分析", "空間自相關", "鄰近性"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若各鄉鎮的病害由完全不同的獨立因素決定、彼此無關，一般迴歸就足夠，空間項反而是多餘的複雜度。",
    },
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
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["散佈圖", "連續變數關係"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若資料點多達數十萬筆而互相重疊，散佈圖會糊成一片，該改用熱力圖或先做抽樣與透明度處理。",
    },
  },
  {
    id: "senior-bigdata-practice-q065",
    subjectId: "senior-bigdata",
    prompt:
      "某長條圖的 Y 軸未從 0 開始，使兩組間 3% 的差距看起來像是兩倍。此問題屬於下列何者？",
    choices: [
      { id: "A", text: "資料型別錯誤：把百分比當成計數處理" },
      { id: "B", text: "視覺誤導：座標軸設定放大了實際差異" },
      { id: "C", text: "抽樣偏誤：兩組樣本的組成不同" },
      { id: "D", text: "圖表類型錯誤：比較兩組應改用圓餅圖" },
    ],
    answer: "B",
    explanation:
      "長條圖以長度編碼數值，截斷 Y 軸會讓長度比例失真，微小差異被視覺放大。呈現長條圖時 Y 軸原則上應從 0 起算，若必須截斷則要明確標示。",
    choiceExplanations: {
      A: "差距是以 3% 正確計算的，資料型別沒有問題，錯的是座標軸的呈現方式。",
      C: "抽樣偏誤影響的是數字本身，不會讓 3% 的差距在圖上看起來像兩倍。",
      D: "長條圖本來就適合比較類別間的數量，問題出在截斷的 Y 軸而非圖表類型，圓餅圖也不適合比較兩組。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["視覺誤導", "座標軸截斷", "長度編碼"],
      constraints: ["governance", "quality"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若圖表改為折線圖，截斷 Y 軸是可接受的慣例——長條圖以長度編碼數值、折線圖以位置編碼，兩者對基線的要求不同。",
    },
  },
  {
    id: "senior-bigdata-practice-q066",
    subjectId: "senior-bigdata",
    prompt:
      "工廠要在儀表板上呈現「各機台當前狀態與異常數」，供現場主管快速掌握。下列設計原則何者最適當？",
    choices: [
      { id: "A", text: "以動畫與閃爍特效呈現每項指標，確保主管不會漏看任何變化" },
      { id: "B", text: "把所有可取得的指標一次全部放上去，讓主管自行挑選要看的" },
      { id: "C", text: "依機台類型使用各自的配色規則，讓不同產線的圖表一眼就能區分開來" },
      { id: "D", text: "把最關鍵的少數指標放在最顯眼處，並以一致的顏色語意標示狀態" },
    ],
    answer: "D",
    explanation:
      "儀表板的目的是讓人在幾秒內做出判斷。聚焦關鍵指標、維持顏色語意一致（例如紅色永遠代表異常），才能降低認知負擔並避免誤讀。",
    choiceExplanations: {
      A: "全部都閃等於沒有重點，特效無助於判讀，反而分散注意力並增加載入負擔。",
      B: "指標全上會稀釋注意力，讓主管自己挑等於把篩選負擔丟回給使用者，真正重要的訊號反而被淹沒。",
      C: "配色規則不一致會讓同一個顏色在不同圖表代表不同意義，現場判讀極易誤判；狀態色應全站一致。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Best Engineering Decision",
      concepts: ["儀表板設計", "認知負擔", "顏色語意"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若使用者是需要深入排查的分析師而非現場主管，資訊密度可以提高，但顏色語意一致這條仍然成立。",
    },
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
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["直方圖", "單變數分布"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若要比較多組的分布形狀，並排的直方圖會互相遮擋，該改用箱型圖或小提琴圖。",
    },
  },
  {
    id: "senior-bigdata-practice-q068",
    subjectId: "senior-bigdata",
    prompt:
      "設計圖表配色時，下列哪一項最能兼顧色覺障礙使用者？",
    choices: [
      { id: "A", text: "避免只以紅綠區分，並輔以形狀、標籤或明度差異" },
      { id: "B", text: "改用更飽和的紅色與綠色，加大兩者的色彩對比" },
      { id: "C", text: "所有類別改用同一色系，只以細微的色調差異區分" },
      { id: "D", text: "改用紅、橙兩色取代紅綠，避開最常見的色盲組合" },
    ],
    answer: "A",
    explanation:
      "紅綠色覺障礙相對常見，若資訊只由紅綠承載，這些使用者將完全無法區辨。加上形狀、直接標籤或明顯的明度差，才能讓資訊不依賴單一通道。",
    choiceExplanations: {
      B: "提高飽和度不會讓無法區辨紅綠的人變得能區辨，問題依舊。",
      C: "同色系的細微差異會讓所有類別都難以區分，對所有使用者都更糟。",
      D: "紅色覺與綠色覺障礙者同樣難以區辨紅與橙，仍是只靠色相承載資訊。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Best Engineering Decision",
      concepts: ["色覺無障礙", "多重編碼通道"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若圖表只有兩類且已用形狀與直接標籤區分，配色的限制就放寬——關鍵是資訊不能只由單一通道承載。",
    },
  },
  {
    id: "senior-bigdata-practice-q069",
    subjectId: "senior-bigdata",
    prompt:
      "農業單位要在地圖上呈現各鄉鎮的平均產量高低。最適合的視覺化形式是下列何者？",
    choices: [
      { id: "A", text: "甘特圖（Gantt Chart）" },
      { id: "B", text: "圓餅圖（Pie Chart）" },
      { id: "C", text: "面量圖（Choropleth Map）" },
      { id: "D", text: "盒鬚圖（Box-and-Whisker Plot）" },
    ],
    answer: "C",
    explanation:
      "面量圖以顏色深淺表示各行政區的數值高低，能同時呈現空間位置與數值大小，是區域統計最常用的地圖形式。",
    choiceExplanations: {
      A: "甘特圖用於專案排程，呈現的是任務的時間進度，與空間資料無關。",
      B: "圓餅圖呈現單一整體的組成比例，無法表達各鄉鎮的地理分布。",
      D: "盒鬚圖描述數值分布的四分位數與離群值，但不含地理位置資訊。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "易",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["面量圖", "空間視覺化"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若各鄉鎮面積差距極大，面量圖會讓大面積區域在視覺上被放大，此時要改用等值點圖或依人口變形的地圖。",
    },
  },
  {
    id: "senior-bigdata-practice-q070",
    subjectId: "senior-bigdata",
    prompt:
      "報表中同時呈現「絕對數量」與「成長率」時，最容易造成誤解的情況是下列何者？",
    choices: [
      { id: "A", text: "基數很小的項目成長率極高，被解讀為重要趨勢" },
      { id: "B", text: "以折線圖呈現各項目跨月份的成長率變化" },
      { id: "C", text: "同一份報表中混用長條圖與折線圖兩種圖形" },
      { id: "D", text: "各項目依絕對數量由大到小排序後呈現" },
    ],
    answer: "A",
    explanation:
      "基數小的項目從 2 件變 4 件就是 100% 成長，看起來驚人但實際影響微乎其微。呈現成長率時應同時給出絕對值，或對過小的基數加註說明。",
    choiceExplanations: {
      B: "折線圖呈現時間上的變化是常規用法，本身不會造成這種誤解。",
      C: "混用兩種圖形分別呈現兩類指標是常見且合理的設計，不會讓人誤判趨勢的重要性。",
      D: "排序有助於閱讀，也不會放大小基數項目的成長率。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["成長率", "基數效應", "報表誤讀"],
      constraints: ["quality", "governance"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若所有項目的基數量級相近，成長率之間就可以直接比較，這項誤讀風險也隨之消失。",
    },
  },
  {
    id: "senior-bigdata-practice-q142",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的簡報以長條圖比較兩季營收，Y 軸從 95 開始，使 3% 的差距看起來像三倍。稽核認為有誤導之虞。下列改善何者最正確？",
    choices: [
      { id: "A", text: "保留原本的 Y 軸設定，在長條上方加註實際數值，讓讀者自行判斷差距" },
      { id: "B", text: "Y 軸應從 0 起算；若需聚焦小差異，改用折線圖或明確標示軸已截斷" },
      { id: "C", text: "把 Y 軸改為對數刻度，讓兩季之間的差距以相對比例的方式呈現" },
      { id: "D", text: "改用 3D 立體長條圖並加上陰影，讓兩季差距看起來更有層次" },
    ],
    answer: "B",
    explanation:
      "長條圖的長度就是數值，截斷基線會讓長度比例失真。要嘛回到 0 起算，要嘛改用以位置編碼的折線圖——後者截斷基線是可接受的慣例。",
    choiceExplanations: {
      A: "加註數值無法抵銷長度造成的第一印象，讀者仍會先被三倍的視覺差距誤導。",
      C: "對數刻度下長條長度同樣不與數值成比例，沒有解決長條圖的編碼問題，對兩個相近的數值也沒有意義。",
      D: "3D 效果會讓長度判讀更困難，誤導程度反而加劇。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["座標軸截斷", "長度編碼", "視覺誤導"],
      constraints: ["governance", "quality"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      crossNode: "L22101",
      decisionBoundary:
        "若圖表改為折線圖，截斷 Y 軸是可接受的慣例——長條圖以長度編碼、折線圖以位置編碼，兩者對基線的要求不同。",
    },
  },
  {
    id: "senior-bigdata-practice-q143",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的戰情室儀表板放了二十八個指標，現場主管反映「看不出現在到底該處理什麼」。下列改善何者最正確？",
    choices: [
      { id: "A", text: "保留全部二十八個指標但改成單頁網格排列，讓主管一眼掃過所有數值不必切換頁面" },
      { id: "B", text: "把所有指標都加上動態更新動畫與閃爍效果，讓畫面隨時呈現最新變化以吸引注意" },
      { id: "C", text: "為每個指標各自設計專屬配色，讓二十八個指標在畫面上容易彼此區分、不會看錯" },
      { id: "D", text: "依決策需求分層，首屏只放需立即行動的少數指標並統一顏色語意，其餘移至次層" },
    ],
    answer: "D",
    explanation:
      "儀表板的目的是讓人在幾秒內決定要不要動作。二十八個指標一起呈現會稀釋注意力，真正重要的訊號反而被淹沒。分層加上一致的顏色語意，才能降低認知負擔。",
    choiceExplanations: {
      A: "網格排列只改變擺放方式，二十八個指標仍同時爭奪注意力，「看不出該處理什麼」的優先順序問題沒有解決。",
      B: "動畫與閃爍無助於判斷優先順序，所有指標一起動反而分散注意力，並增加載入負擔。",
      C: "各自配色會讓同一個顏色在不同指標代表不同意義，狀態判讀更容易出錯，也沒有解決優先順序問題。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["儀表板分層", "認知負擔", "顏色語意"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若使用者是需要深入排查的分析師而非現場主管，資訊密度可以提高，但顏色語意一致這條仍然成立。",
    },
  },
  {
    id: "senior-bigdata-practice-q144",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院的面量圖以顏色深淺呈現各行政區的就診人數，結果面積廣大的偏鄉在視覺上壓過人口密集的市區。下列改善何者最正確？",
    choices: [
      { id: "A", text: "改用圓餅圖呈現各行政區占全市就診總人數的比例，完全避開地圖面積所造成的視覺偏差" },
      { id: "B", text: "把偏鄉區域的顏色統一調淡一階，抵銷其面積較大所帶來的額外視覺權重" },
      { id: "C", text: "改以每萬人就診率取代絕對人數，或改用等值點圖、人口變形地圖，避免面積主導判讀" },
      { id: "D", text: "提高地圖解析度並加上更細的行政區界線，讓市區的小區塊也能被清楚看見" },
    ],
    answer: "C",
    explanation:
      "面量圖以區域面積承載顏色，面積大的區域自然吸引更多視覺權重。改用比率消除人口規模的影響，或換成不以面積編碼的呈現方式，才能讓判讀對應到真實的密集程度。",
    choiceExplanations: {
      A: "圓餅圖雖避開了面積，但失去地理位置資訊，且仍以絕對人數呈現，無法反映人口密集程度。",
      B: "人為調淡特定區域的顏色等於竄改資料編碼，讀者會誤判其實際數值，且調整幅度沒有客觀依據。",
      D: "解析度與邊界細節不改變以面積承載顏色的編碼方式，大面積區域仍主導視覺，數值也仍未經人口校正。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["面量圖", "面積偏誤", "比率化"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      crossNode: "L22101",
      decisionBoundary:
        "若各行政區的面積相近，面量圖的面積偏誤就大幅降低，直接呈現絕對人數也不至於誤導。",
    },
  },
  {
    id: "senior-bigdata-practice-q145",
    subjectId: "senior-bigdata",
    prompt:
      "某教育單位要在圖表中以顏色區分五種課程類別，並希望色覺障礙者也能判讀。下列做法何者最合理？",
    choices: [
      { id: "A", text: "避免僅以紅綠區分，並輔以形狀、直接標籤或明度差異，讓資訊不依賴單一視覺通道" },
      { id: "B", text: "改用飽和度更高的紅色與綠色，拉大兩色之間的對比，讓色覺障礙者也能分辨類別" },
      { id: "C", text: "五種類別改用同一色系由淺到深排列，避開色覺障礙者難以辨識的色相差異" },
      { id: "D", text: "選用專為色盲設計的調色盤，但仍只以顏色區分類別、不另加標籤以保持圖面簡潔" },
    ],
    answer: "A",
    explanation:
      "紅綠色覺障礙相對常見，若資訊只由紅綠承載，這些使用者將完全無法區辨。加上形狀、直接標籤或明顯的明度差，才能讓資訊不依賴單一通道。",
    choiceExplanations: {
      B: "紅綠色覺障礙者無法區辨的是色相，提高飽和度或拉大對比並不會讓他們分辨出紅與綠。",
      C: "同色系深淺暗示類別之間有順序，而五階深淺在小面積時對所有人都難以精確區分；類別資料仍需形狀或標籤輔助。",
      D: "色盲友善調色盤有幫助，但資訊仍只靠顏色這個單一通道承載，灰階列印或較嚴重的色覺障礙時仍無法判讀。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["色覺無障礙", "多重編碼", "直接標籤"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若圖表只有兩類且已用形狀與直接標籤區分，配色的限制就放寬——關鍵是資訊不能只由單一通道承載。",
    },
  },
  {
    id: "senior-bigdata-practice-q146",
    subjectId: "senior-bigdata",
    prompt:
      "某農業團隊要呈現三十萬筆「施肥量與產量」的觀測點，散佈圖畫出來糊成一片。下列改善何者最合理？",
    choices: [
      { id: "A", text: "只取前一百筆觀測繪製散佈圖，讓每個點都清楚可見、圖面不再重疊" },
      { id: "B", text: "把點的尺寸放大並改用更鮮明的顏色，讓每筆觀測在圖上都更容易辨識" },
      { id: "C", text: "改用圓餅圖依產量級距呈現各區間的觀測占比，避免點與點互相重疊" },
      { id: "D", text: "改用熱力圖或二維密度圖呈現密集程度，輔以抽樣與透明度處理" },
    ],
    answer: "D",
    explanation:
      "點過度重疊時，散佈圖無法表達密集程度。熱力圖或密度圖以顏色深淺呈現每個區域有多少觀測，正好解決重疊；抽樣與透明度則是輔助手段。",
    choiceExplanations: {
      A: "前一百筆未必具代表性，且捨棄了絕大部分資料，看不出整體的密集分布。",
      B: "點放大會讓重疊更嚴重，三十萬個點擠在一起只會糊得更厲害，顏色再鮮明也無法呈現密度。",
      C: "圓餅圖只能呈現單一變數的組成，失去施肥量與產量兩個連續變數之間的關係。",
    },
    topic: "L22303 數據可視化工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["過度繪製", "熱力圖", "密度呈現"],
      constraints: ["quality", "data_volume"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若觀測點只有數百筆、幾乎不重疊，散佈圖直接呈現每一筆反而保留了最多資訊。",
    },
  },

  // ── L22401 大數據與機器學習（8 題）────────────────────────────
  {
    id: "senior-bigdata-practice-q071",
    subjectId: "senior-bigdata",
    prompt:
      "在機器學習流程中，「特徵工程」通常對模型表現的影響是下列何者？",
    choices: [
      { id: "A", text: "影響有限，只要資料量夠大，模型就會自行從原始欄位找出所有規律" },
      { id: "B", text: "影響極大，好的特徵往往比更換演算法更能提升表現" },
      { id: "C", text: "主要影響訓練速度，對最終準確率的提升通常不明顯" },
      { id: "D", text: "只在深度學習中才重要，傳統機器學習模型較少需要" },
    ],
    answer: "B",
    explanation:
      "在表格式資料上，把領域知識轉成有意義的特徵（比率、時間差、聚合統計）帶來的提升，通常遠大於換一個更複雜的演算法。這是實務上投報率最高的環節之一。",
    choiceExplanations: {
      A: "傳統模型無法自行創造原始欄位裡沒有的組合關係；即使資料量大，深度模型也未必能學到需要領域知識才看得出的特徵。",
      C: "特徵決定模型能看到哪些資訊，直接影響預測品質；它的效益主要在準確率，而不只是訓練速度。",
      D: "情況相反：深度學習能自動萃取部分特徵，表格式資料上的傳統模型反而更依賴人工特徵工程。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["特徵工程", "領域知識", "表格式資料"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若資料是影像或文字這類非結構化輸入、且樣本充足，深度模型能自行萃取特徵，人工特徵工程的邊際效益就大幅下降。",
    },
  },
  {
    id: "senior-bigdata-practice-q072",
    subjectId: "senior-bigdata",
    prompt:
      "模型在訓練集表現極佳但在測試集明顯變差，此現象稱為下列何者？",
    choices: [
      { id: "A", text: "資料洩漏（Data Leakage）" },
      { id: "B", text: "欠擬合（Underfitting）" },
      { id: "C", text: "過擬合（Overfitting）" },
      { id: "D", text: "梯度消失（Vanishing Gradient）" },
    ],
    answer: "C",
    explanation:
      "過擬合是模型連訓練資料中的雜訊都記了下來，因此在未見過的資料上失準。緩解手段包括增加資料、簡化模型、正則化與交叉驗證。",
    choiceExplanations: {
      A: "資料洩漏通常讓測試分數虛高，方向與「測試集明顯變差」相反。",
      B: "欠擬合是訓練集與測試集表現都差，代表模型太簡單學不到規律。",
      D: "梯度消失會讓深層網路難以訓練，通常連訓練集表現都不好，與「訓練集表現極佳」不符。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "易",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["過擬合", "泛化"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若訓練集與測試集的表現都很差，那是欠擬合而非過擬合——診斷必須同時看兩個誤差。",
    },
  },
  {
    id: "senior-bigdata-practice-q073",
    subjectId: "senior-bigdata",
    prompt:
      "大數據環境下訓練模型時，若資料量遠超過單機記憶體，下列做法何者最直接？",
    choices: [
      { id: "A", text: "隨機刪除九成資料，讓剩下的部分能放進單機記憶體" },
      { id: "B", text: "增加虛擬記憶體交換空間，把所有資料一次載入後訓練" },
      { id: "C", text: "採用分散式訓練或以小批次逐步讀取資料訓練" },
      { id: "D", text: "改用參數更多的模型，以更強的容量消化大量資料" },
    ],
    answer: "C",
    explanation:
      "小批次（mini-batch）訓練每次只載入一部分資料，分散式訓練則把資料與運算切到多台機器。兩者都讓訓練不受單機記憶體上限限制。",
    choiceExplanations: {
      A: "隨機刪除九成會嚴重損失資訊，除非已確認抽樣仍具代表性，否則不應作為首選；規模問題有不必丟資料的標準解法。",
      B: "資料遠超記憶體時靠交換空間硬撐，磁碟與記憶體間的大量交換會讓訓練慢到癱瘓，並非可行解法。",
      D: "參數更多的模型需要更多記憶體，沒有解決資料放不進單機的問題，反而更嚴重。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["小批次訓練", "分散式訓練", "記憶體限制"],
      constraints: ["compute", "data_volume"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若已確認抽樣後仍具代表性、且模型不需要罕見樣本，抽樣訓練反而比分散式更省事也更快。",
    },
  },
  {
    id: "senior-bigdata-practice-q074",
    subjectId: "senior-bigdata",
    prompt:
      "資料量增加對機器學習模型的影響，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "通常有助於降低過擬合，但若資料品質差則效益有限" },
      { id: "B", text: "資料越多模型一定越準確，品質問題會被大量樣本平均掉" },
      { id: "C", text: "資料量主要影響訓練時間，與模型的泛化表現關係不大" },
      { id: "D", text: "資料越多模型越容易記住細節，因此越容易過擬合" },
    ],
    answer: "A",
    explanation:
      "更多樣本讓模型較難靠記憶少數樣本取巧，泛化通常改善；但若新增的資料充滿雜訊、標註錯誤或與目標分布不符，效益會迅速遞減甚至反效果。",
    choiceExplanations: {
      B: "垃圾進垃圾出——系統性的標註錯誤不會被平均掉，大量錯誤資料反而讓模型學到錯誤規律。",
      C: "樣本數是決定模型能學到多少規律、能否泛化的關鍵因素之一，影響不只在訓練時間。",
      D: "方向相反：資料越多模型越難靠記憶少數樣本取巧，過擬合多發生於樣本稀少時。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["資料量", "資料品質", "泛化"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若新增的資料與目標分布不同（例如來自另一個客群），量增加反而會把模型帶偏——先確認分布一致再談數量。",
    },
  },
  {
    id: "senior-bigdata-practice-q075",
    subjectId: "senior-bigdata",
    prompt:
      "在建立機器學習模型前先進行探索性資料分析（EDA）的主要目的是下列何者？",
    choices: [
      { id: "A", text: "精簡與壓縮欄位，減少後續建模所需的資料儲存空間" },
      { id: "B", text: "快速試跑多種演算法，直接挑出準確率最高的最終模型" },
      { id: "C", text: "以資料的統計摘要取代模型評估，提早確認模型可用" },
      { id: "D", text: "了解資料分布、缺失與異常，避免在錯誤的假設上建模" },
    ],
    answer: "D",
    explanation:
      "EDA 讓分析者在動手建模前先看清資料的實際樣貌：分布是否偏態、有無異常值與缺失、變數之間是否高度相關。跳過這一步常導致後續大量返工。",
    choiceExplanations: {
      A: "EDA 的目的是理解資料而非壓縮；雖然可能順帶發現冗餘欄位，但節省儲存不是它的主要目的。",
      B: "那是模型選擇的工作；EDA 是建模前理解資料的階段，不產出用於預測的最終模型。",
      C: "模型評估必須以獨立資料驗證預測表現，資料的統計摘要無法告訴你模型準不準。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["探索性資料分析", "分布", "異常"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Neighbor Concept",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若資料是既有管線每日產出、結構與品質都已被監控，EDA 可以精簡為檢視監控報表，但不能完全省略。",
    },
  },
  {
    id: "senior-bigdata-practice-q076",
    subjectId: "senior-bigdata",
    prompt:
      "以歷史資料訓練的需求預測模型，在市場結構改變後表現持續下滑。此情況最貼切的描述是下列何者？",
    choices: [
      { id: "A", text: "過擬合：模型記住了訓練資料中的雜訊" },
      { id: "B", text: "資料洩漏：訓練時用到了預測當下取不到的資訊" },
      { id: "C", text: "欠擬合：模型太簡單，學不到需求的季節規律" },
      { id: "D", text: "概念漂移：輸入與目標之間的關係隨時間改變" },
    ],
    answer: "D",
    explanation:
      "概念漂移指的是「同樣的輸入，正確答案變了」。市場結構改變後，過去有效的規律不再成立，必須以新資料重訓並建立持續監控機制。",
    choiceExplanations: {
      A: "過擬合在上線初期就會表現不佳，無法解釋「市場結構改變後」才持續下滑的時間性變化。",
      B: "資料洩漏會讓離線分數虛高、上線一開始就出現落差，而不是隨市場改變而逐漸退化。",
      C: "欠擬合在歷史資料上就表現不佳，題目描述的是原本有效、市場改變後才下滑。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Troubleshooting",
      concepts: ["概念漂移", "關係改變", "重訓"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若輸入特徵的分布也同時明顯改變，那是資料漂移與概念漂移並存，兩者要分別診斷、分別處理。",
    },
  },
  {
    id: "senior-bigdata-practice-q077",
    subjectId: "senior-bigdata",
    prompt:
      "在資料切分時，若同一位病患的多次就診紀錄同時出現在訓練集與測試集，最可能造成下列哪一種問題？",
    choices: [
      { id: "A", text: "資訊洩漏使測試分數虛高，無法反映對新病患的表現" },
      { id: "B", text: "訓練集樣本彼此高度相關，使模型訓練時間明顯變長" },
      { id: "C", text: "測試集的病患人數變少，導致評估結果的變異過大" },
      { id: "D", text: "模型低估罕見病患的風險，使測試分數偏低失真" },
    ],
    answer: "A",
    explanation:
      "同一位病患的紀錄高度相關，模型可能靠記住這個人而不是學到通則。若目標是預測新病患，切分就必須以病患為單位（group split），而非以單筆紀錄。",
    choiceExplanations: {
      B: "樣本相關與否不會顯著改變訓練量與時間；真正的問題是測試集不再是「沒見過的病患」。",
      C: "筆數與人數並沒有因此減少，問題是同一人跨兩集造成分數虛高，而非評估變異大。",
      D: "同一人跨兩集讓模型能靠記住病患取巧，測試分數會偏高而非偏低。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["資訊洩漏", "群組切分", "相關樣本"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Layer Confusion",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若目標是「預測同一位病患的下次就診」而非推廣到新病患，依時間切分同一人的紀錄反而才是正確設計。",
    },
  },
  {
    id: "senior-bigdata-practice-q078",
    subjectId: "senior-bigdata",
    prompt:
      "在大數據平台上部署機器學習模型時，「特徵存放區（Feature Store）」的主要價值是下列何者？",
    choices: [
      { id: "A", text: "作為集中的分析資料倉儲，取代既有的報表與查詢系統" },
      { id: "B", text: "讓訓練與線上推論使用同一份特徵定義，避免兩邊計算不一致" },
      { id: "C", text: "自動從原始資料探勘並生成新特徵，直接提升模型的預測準確率" },
      { id: "D", text: "記錄每個模型版本與超參數，取代模型監控的需求" },
    ],
    answer: "B",
    explanation:
      "訓練與線上服務各自實作一套特徵計算，是模型上線後表現不如預期的常見原因（training-serving skew）。特徵存放區集中管理定義與計算，讓兩邊取得完全一致的特徵。",
    choiceExplanations: {
      A: "特徵存放區服務機器學習的特徵供應，不取代資料倉儲的分析與報表用途。",
      C: "它集中管理已定義好的特徵並確保一致與重用，不會自動發明特徵或直接改變模型的預測能力。",
      D: "記錄模型版本是模型註冊庫的職責；上線後仍需監控效能與資料漂移，特徵存放區無法取代監控。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["特徵存放區", "訓練與服務一致性"],
      constraints: ["maintainability", "integration"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Overgeneralization",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若只有一個模型、且特徵在訓練與服務端由同一份程式碼計算，特徵存放區的維運成本就換不到相應效益。",
    },
  },
  {
    id: "senior-bigdata-practice-q147",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的模型在離線評估表現優異，上線後明顯較差。追查發現線上與離線的特徵由不同程式計算，其中「近七日平均」的定義一個含當日、一個不含。下列處置何者最能根本解決？",
    choices: [
      { id: "A", text: "改用容量更大的模型並加入兩版特徵資料，讓模型自行學會容忍定義之間的落差" },
      { id: "B", text: "建立兩邊團隊每週對齊的會議，並以文件記錄所有特徵的定義規格" },
      { id: "C", text: "在線上服務端加上特徵比對監控，兩邊數值差距過大時立即發出告警" },
      { id: "D", text: "把特徵定義集中到單一實作（如特徵存放區），讓訓練與推論共用同一份邏輯" },
    ],
    answer: "D",
    explanation:
      "訓練與服務各自實作一套特徵計算，是模型上線後不如預期的典型成因。開會對齊只能維持一時，把定義集中到單一實作才能從結構上消除分歧。",
    choiceExplanations: {
      A: "更大的模型仍吃到不一致的特徵值，訓練時從沒看過線上那一版定義，落差依舊存在。",
      B: "會議與文件能發現問題，但兩份程式碼依然各自演進，特徵一多就無法防止再度分歧，治標不治本。",
      C: "監控能及早發現偏差，但只是事後告警，兩套實作仍會持續產生不一致，沒有從結構上消除分歧。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["訓練與服務一致性", "特徵存放區", "單一實作"],
      constraints: ["maintainability", "integration"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        C: "Partial Truth",
      },
      crossNode: "L22203",
      decisionBoundary:
        "若只有一個模型、且特徵在訓練與服務端本來就由同一份程式碼計算，特徵存放區的維運成本就換不到相應效益。",
    },
  },
  {
    id: "senior-bigdata-practice-q148",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的訓練資料量從一千萬筆增加到一億筆後，模型表現幾乎沒有改善。下列判斷何者最可能？",
    choices: [
      { id: "A", text: "代表模型已過擬合舊資料，應改用更小的模型重新訓練" },
      { id: "B", text: "代表資料量仍不足以發揮效果，應繼續擴充到十億筆再評估" },
      { id: "C", text: "新增資料可能與既有資料高度重複或品質不佳，應先檢視其分布與標註品質" },
      { id: "D", text: "代表舊資料已經過時，應刪除一千萬筆舊資料只用新資料訓練" },
    ],
    answer: "C",
    explanation:
      "資料量的邊際效益會遞減，尤其當新增的樣本與既有的高度相似時。品質差或標註錯誤的資料更可能拖累表現——量增沒有帶來改善時，該檢查的是新資料本身。",
    choiceExplanations: {
      A: "資料增加通常會降低過擬合，量增無改善不代表過擬合；縮小模型也可能降低表現，且沒有檢查新資料本身。",
      B: "在未確認新資料是否有效之前繼續加量，只是重複同樣的投入；邊際效益遞減時再加十倍也未必改善。",
      D: "沒有證據顯示舊資料過時，刪除會失去已被驗證有效的樣本；問題更可能出在新資料本身。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["邊際效益遞減", "資料品質", "樣本多樣性"],
      constraints: ["data_quality", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22201",
      decisionBoundary:
        "若新增資料涵蓋了原本完全沒有的客群或情境，量增就會帶來明顯改善——關鍵在於它補上了什麼，而不是多了多少。",
    },
  },
  {
    id: "senior-bigdata-practice-q149",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院的模型訓練資料超過單機記憶體數十倍，且含大量罕見病例。下列處置何者最合理？",
    choices: [
      { id: "A", text: "以小批次或分散式訓練處理規模，抽樣時須保住罕見病例的代表性" },
      { id: "B", text: "隨機抽取一成資料訓練，樣本數仍有數百萬筆，在統計上足以代表整體" },
      { id: "C", text: "升級為頂規大記憶體伺服器，把全部資料一次載入記憶體後再訓練" },
      { id: "D", text: "先移除罕見病例以縮小資料量並加快收斂，待模型穩定後再補回" },
    ],
    answer: "A",
    explanation:
      "規模問題有標準解法（小批次、分散式）。真正要小心的是抽樣——隨機抽一成會讓本來就稀少的罕見病例更稀少，可能直接消失，而那往往是最需要模型判斷的情況。",
    choiceExplanations: {
      B: "隨機抽樣讓罕見病例的絕對數量再縮減九成，可能少到模型完全學不到；整體分布具代表性不等於稀有類別足夠。",
      C: "資料超過單機記憶體數十倍，靠升級硬體難以涵蓋且成本極高；小批次與分散式才是可擴展的標準解法。",
      D: "移除罕見病例等於放棄模型在最關鍵情境的能力，且罕見病例佔比小，移除也無法有效解決規模問題。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["分散式訓練", "抽樣代表性", "罕見類別"],
      constraints: ["compute", "memory", "data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22402",
      decisionBoundary:
        "若採用分層抽樣、確保罕見病例全數保留而只抽減常見病例，抽樣就成為兼顧規模與代表性的合理選擇。",
    },
  },
  {
    id: "senior-bigdata-practice-q150",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台建模前跳過探索性資料分析直接訓練，結果發現有一個欄位九成是缺值、另一個欄位全部相同。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "應增加訓練輪數，讓模型有足夠時間從這些欄位中學到規律" },
      { id: "B", text: "現代模型多能自動處理缺值，這兩個欄位可直接交給模型處理" },
      { id: "C", text: "探索性資料分析能在建模前發現缺失與零變異等問題，跳過常造成大量返工" },
      { id: "D", text: "應改用更複雜的模型，以較強的表達能力彌補欄位品質的缺陷" },
    ],
    answer: "C",
    explanation:
      "零變異的欄位不帶任何資訊、九成缺值的欄位需要特別處理，這些用幾張圖與幾行統計就能看出來。跳過這一步，問題會在訓練後才浮現，代價高得多。",
    choiceExplanations: {
      A: "訓練再久也無法從全部相同的欄位學到任何東西，九成缺值的問題也不會因多訓練而消失。",
      B: "部分模型能容忍缺值，但九成缺值的欄位仍需決定處理策略，零變異欄位也不會被主動剔除；這些問題應在建模前就發現。",
      D: "模型再複雜也無法從零變異欄位中得到資訊，欄位品質的問題必須在資料端處理。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["探索性資料分析", "零變異欄位", "缺值檢視"],
      constraints: ["data_quality", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L22201",
      decisionBoundary:
        "若資料來自既有管線且每日都有品質監控報表，探索可以精簡為檢視監控結果，但不能完全省略。",
    },
  },
  {
    id: "senior-bigdata-practice-q151",
    subjectId: "senior-bigdata",
    prompt:
      "某農業模型在表格式的感測與氣象資料上，樹系集成表現優於深度神經網路。下列說明何者最正確？",
    choices: [
      { id: "A", text: "深度網路只適用於影像與文字等非結構化資料，在任何表格資料上都一定劣於樹模型" },
      { id: "B", text: "樹系集成不受特徵尺度影響、易處理類別與缺值，中小型表格資料上常勝過深度網路" },
      { id: "C", text: "這代表資料量太少不足以訓練深度網路，應停止建模並先擴充資料量再說" },
      { id: "D", text: "應把表格資料轉成影像格式，再以卷積神經網路擷取欄位之間的空間特徵" },
    ],
    answer: "B",
    explanation:
      "沒有一種演算法在所有問題上都最好。表格資料的特徵之間沒有影像那樣的空間結構，深度網路的歸納偏置用不上，而樹模型的分割機制正好契合。",
    choiceExplanations: {
      A: "「任何表格資料都一定劣於」過度概括：在大規模或含高基數類別的表格資料上，深度網路仍可能勝出。",
      C: "樹模型表現良好代表資料已足以建出有用的模型，不是停止建模的理由。",
      D: "表格欄位之間沒有影像那樣的空間鄰接結構，硬轉成影像會讓卷積的歸納偏置失去意義。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Comparison",
      concepts: ["樹系集成", "歸納偏置", "表格資料"],
      constraints: ["data_volume"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若資料改為空拍影像或自由文字，深度網路的特徵萃取能力就重新勝出，樹模型反而難以處理。",
    },
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
    meta: {
      cognitiveLevel: "L3",
      archetype: "Incorrect Statement",
      concepts: ["類別不平衡", "評估指標", "重採樣"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Correct in Different Context",
        C: "Correct in Different Context",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把選項 B 改成「以少數類別的 PR-AUC 作為模型選擇依據」，它就成為恰當的做法。",
    },
  },
  {
    id: "senior-bigdata-practice-q080",
    subjectId: "senior-bigdata",
    prompt:
      "ROC 曲線下面積（AUC）為 0.5 代表下列何者？",
    choices: [
      { id: "A", text: "模型的準確率為 50%" },
      { id: "B", text: "模型能完美區分正負樣本" },
      { id: "C", text: "模型的辨別能力與隨機猜測相當" },
      { id: "D", text: "模型已嚴重過擬合訓練資料而無法泛化" },
    ],
    answer: "C",
    explanation:
      "AUC 可理解為「隨機取一個正樣本與一個負樣本，模型給正樣本較高分數的機率」。0.5 表示與擲硬幣無異，1.0 為完美，低於 0.5 則代表方向反了。",
    choiceExplanations: {
      A: "AUC 與準確率是不同指標；在不平衡資料上準確率可能很高而 AUC 仍為 0.5。",
      B: "能完美區分正負樣本對應的 AUC 是 1.0，0.5 恰好是另一端的隨機水準。",
      D: "過擬合表現為訓練與測試 AUC 差距大，單看一個 0.5 的數值無法判定是過擬合。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["AUC", "辨別能力"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若正負樣本極度不平衡，AUC 可能仍然好看卻掩蓋了少數類別的表現，此時 PR-AUC 更能反映實情。",
    },
  },
  {
    id: "senior-bigdata-practice-q081",
    subjectId: "senior-bigdata",
    prompt:
      "醫療篩檢模型若「寧可誤報也不能漏掉真正患者」，在調整分類門檻時應朝下列哪個方向？",
    choices: [
      { id: "A", text: "門檻固定為 0.5 不可調整" },
      { id: "B", text: "提高判為陽性的門檻以提高精確率" },
      { id: "C", text: "降低判為陽性的門檻以提高召回率" },
      { id: "D", text: "保持門檻不變並增加訓練資料量" },
    ],
    answer: "C",
    explanation:
      "降低門檻會讓更多樣本被判為陽性，漏掉真患者的機率下降（召回率上升），代價是誤報增加。在漏診成本遠高於複檢成本的篩檢場景，這個取捨是合理的。",
    choiceExplanations: {
      A: "0.5 只是預設值，依成本結構調整門檻正是實務上的標準做法。",
      B: "提高門檻能提高精確率，但會讓更多真患者被判為陰性、漏診上升，與需求相反。",
      D: "增加資料或許能改善模型，但沒有回應「寧可誤報」的取捨，調整門檻的方向才是此題關鍵。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["分類門檻", "召回率", "錯誤成本"],
      constraints: ["quality", "safety"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若後續的確診檢查具侵入性或成本極高，誤報的代價上升，門檻就不能無限下調——取捨點由兩類錯誤的成本比決定。",
    },
  },
  {
    id: "senior-bigdata-practice-q082",
    subjectId: "senior-bigdata",
    prompt:
      "工廠以歷史品檢資料訓練瑕疵分類模型，但標註由不同檢驗員完成且標準不一。此問題最直接影響下列何者？",
    choices: [
      { id: "A", text: "標籤雜訊使模型學到互相矛盾的規則，效能上限被壓低" },
      { id: "B", text: "主要拖慢訓練收斂速度，但最終準確率不受影響" },
      { id: "C", text: "造成類別不平衡，使模型偏向樣本數較多的類別" },
      { id: "D", text: "多位檢驗員的意見可互相平均，反而讓模型更穩健" },
    ],
    answer: "A",
    explanation:
      "同一張影像被不同人標成不同結果時，模型無論怎麼學都會有一部分樣本判錯，效能上限被標註一致性卡住。解法是統一標註規範並以重疊標註量測一致性。",
    choiceExplanations: {
      B: "標籤矛盾影響的是模型能學到什麼，效能上限被壓低，不只是收斂快慢。",
      C: "類別不平衡是各類別樣本數的差距，與標註標準不一造成的標籤矛盾是不同問題。",
      D: "標準不一造成的是互相矛盾的學習訊號，不會自動平均成正確答案，品質不良必然影響模型。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["標籤雜訊", "標註一致性", "效能上限"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Neighbor Concept",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若不一致只發生在少數邊界模糊的樣本上，影響有限；一旦連明確的瑕疵都判法不同，效能上限就會被壓得很低。",
    },
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
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["混淆矩陣", "偽陰性"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Terminology Swap",
        C: "Neighbor Concept",
      },
      decisionBoundary:
        "若情境改為垃圾郵件過濾，偽陰性只是漏掉一封垃圾信，代價遠低於把重要信件誤判為垃圾的偽陽性——哪一類更嚴重取決於場景。",
    },
  },
  {
    id: "senior-bigdata-practice-q084",
    subjectId: "senior-bigdata",
    prompt:
      "教育平台以模型預測學生是否需要輔導。若模型把某一整個班級都判為高風險，最應優先檢查下列何者？",
    choices: [
      { id: "A", text: "推論伺服器是否記憶體不足而回傳預設值" },
      { id: "B", text: "模型的整體準確率是否已低於上線驗收的門檻" },
      { id: "C", text: "報表的分組顯示設定是否誤套同一標籤" },
      { id: "D", text: "模型是否過度依賴班級編號等班級層級特徵" },
    ],
    answer: "D",
    explanation:
      "整班同判通常代表模型抓到了班級層級的共同特徵，甚至可能把班級識別碼當成強預測因子。這種捷徑學習會讓個別學生的差異被忽略，必須檢查特徵清單。",
    choiceExplanations: {
      A: "資源不足造成的預設值會影響所有學生，不會只集中在某一個班級。",
      B: "整體準確率是彙總指標，看不出為何偏偏某一整班被同判，應先查造成群體一致預測的特徵。",
      C: "顯示設定只影響呈現；若模型輸出本身就是整班高風險，問題在預測而非報表。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["捷徑學習", "群組特徵", "特徵稽核"],
      constraints: ["data_quality", "fairness"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若該班確實整體學習狀況不佳、其他證據也支持，整班高風險就是正確判斷而非捷徑學習——要先看有沒有外部證據佐證。",
    },
  },
  {
    id: "senior-bigdata-practice-q085",
    subjectId: "senior-bigdata",
    prompt:
      "農業病害辨識模型在測試集表現良好，但實際田間拍攝的照片辨識率大幅下降。最可能的原因是下列何者？",
    choices: [
      { id: "A", text: "訓練資料多為理想條件下拍攝，與田間實際光線與背景差異大" },
      { id: "B", text: "模型參數量過少，無法學到病害影像的細微紋理差異" },
      { id: "C", text: "測試集的標籤品質不佳，使原本的測試分數失真" },
      { id: "D", text: "田間照片解析度高於訓練影像，模型無法處理大尺寸輸入" },
    ],
    answer: "A",
    explanation:
      "測試集若與訓練集來自同一批理想照片，分數自然好看；但田間有逆光、陰影、雜草背景與手持模糊，分布與訓練資料不同，模型因此失準。應補充實地拍攝樣本。",
    choiceExplanations: {
      B: "若參數不足以學到細微紋理，測試集表現也會不好，無法解釋「測試好、實地差」的落差。",
      C: "標籤品質差通常讓測試分數偏低而非偏高，無法解釋測試好看、田間失準的落差。",
      D: "影像輸入前通常會縮放到固定尺寸，解析度差異本身不是主因；真正的差異是光線、背景等拍攝條件的分布。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["分布偏移", "測試集代表性", "實地樣本"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若測試集本身就是從田間隨機拍攝取得，測試分數才代表實地表現——測試集與部署環境同分布，這個落差才不會出現。",
    },
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
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["F1分數", "調和平均"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若精確率與召回率的重要性不對等（例如召回更重要），該改用加權的 F-beta 而不是等權的 F1。",
    },
  },
  {
    id: "senior-bigdata-practice-q152",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的詐欺偵測模型 AUC 高達 0.95，但實際上線後每攔下一筆真詐欺就誤擋二十筆正常交易。已知詐欺佔比僅萬分之五。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "AUC 0.95 已代表排序能力優異，誤擋是模型以外的作業流程問題" },
      { id: "B", text: "負樣本極多時 ROC 會過度樂觀；應改看 PR 曲線與目標召回下的精確率並重選門檻" },
      { id: "C", text: "應進一步降低門檻提高召回率，讓更多真詐欺被攔下以攤平誤擋" },
      { id: "D", text: "應改以整體準確率作為主要指標，因它同時反映正負兩類的表現" },
    ],
    answer: "B",
    explanation:
      "偽陽性率的分母是龐大的正常交易，幾千筆誤擋除以數百萬仍是很小的比例，ROC 因此看起來漂亮。精確率直接回答「攔下來的有多少是真的」，才反映客戶實際感受。",
    choiceExplanations: {
      A: "AUC 在負樣本極多時會過度樂觀，二十比一的誤擋正是指標與門檻選擇的問題，不能歸咎於作業流程。",
      C: "降低門檻會攔下更多交易，誤擋只會更多，與問題方向相反。",
      D: "在萬分之五的不平衡下，全部放行就有 99.95% 準確率，這個指標被負類主導而毫無鑑別力。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["ROC 侷限", "PR 曲線", "門檻與成本"],
      constraints: ["quality", "cost"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若正負樣本比例接近，ROC 與 PR 給出的結論通常一致，此時 ROC 的門檻無關性反而更方便比較。",
    },
  },
  {
    id: "senior-bigdata-practice-q153",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠的瑕疵分類模型效能始終無法突破八成，追查發現同一張影像由不同檢驗員標註的結果常不一致。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "標籤雜訊壓低了效能上限，應先統一標註規範並量測一致性，再談模型調校" },
      { id: "B", text: "增加模型參數量，讓模型有足夠容量同時學會不同檢驗員各自的判斷風格" },
      { id: "C", text: "延長訓練時間並調低學習率，讓模型逐步收斂到一致的規律" },
      { id: "D", text: "改用多個模型的多數決集成，以投票方式抵銷不同檢驗員之間的標註差異" },
    ],
    answer: "A",
    explanation:
      "同一張影像被標成不同結果時，模型無論怎麼學都會有一部分樣本判錯——效能上限被標註一致性卡住。此時調校模型是徒勞的，該先修的是標籤本身。",
    choiceExplanations: {
      B: "參數量增加只會讓模型更精確地擬合互相矛盾的標籤，上限仍被標註一致性卡住。",
      C: "矛盾的訊號訓練再久也收斂不到一致的規律，調整學習率無法修正標籤本身。",
      D: "集成平均的是模型的預測誤差；訓練標籤本身互相矛盾時，每個模型學到的都是同一個上限。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["標籤雜訊", "標註一致性", "效能上限"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22201",
      decisionBoundary:
        "若不一致只發生在少數邊界模糊的樣本上，影響有限；一旦連明確的瑕疵都判法不同，上限就會被壓得很低。",
    },
  },
  {
    id: "senior-bigdata-practice-q154",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台的輔導名單模型把某一整個班級全部判為高風險。下列排查順序何者最合理？",
    choices: [
      { id: "A", text: "先提高模型參數量重新訓練，再看該班是否仍被判為高風險" },
      { id: "B", text: "先接受結果將全班列入輔導，再於期末依成績回頭檢討模型" },
      { id: "C", text: "先對照該班的外部證據，若成績與出缺席確實偏低就直接採信模型結果" },
      { id: "D", text: "先查特徵是否含班級識別欄位造成捷徑學習，再以外部證據確認該班風險" },
    ],
    answer: "D",
    explanation:
      "整班同判通常代表模型抓到了班級層級的共同特徵，甚至可能把班級編號當成強預測因子。但也不能排除該班確實整體狀況不佳——所以要同時查特徵與外部證據。",
    choiceExplanations: {
      A: "參數量與是否學到捷徑無關，更大的模型反而可能更依賴捷徑特徵；應先查特徵清單。",
      B: "若成因是捷徑學習，全班列入會浪費輔導資源並標籤化學生，到期末才檢討也太晚。",
      C: "外部證據只能說明該班風險可能偏高，沒有排除模型是靠班級編號做判斷；未查特徵就採信，捷徑學習會在其他班重演。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["捷徑學習", "群組特徵", "外部證據"],
      constraints: ["fairness", "data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        C: "Partial Truth",
      },
      crossNode: "L22404",
      decisionBoundary:
        "若該班確實整體學習狀況不佳、其他證據也支持，整班高風險就是正確判斷而非捷徑學習。",
    },
  },
  {
    id: "senior-bigdata-practice-q155",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院的篩檢模型要求「寧可誤報也不能漏掉真正患者」，但複檢為侵入性檢查且成本高。下列處置何者最合理？",
    choices: [
      { id: "A", text: "維持 0.5 的預設門檻，避免在兩類錯誤之間做出主觀的取捨" },
      { id: "B", text: "把門檻壓到最低以最大化召回率，確保篩檢不漏掉任何一位患者" },
      { id: "C", text: "依漏診與侵入性複檢的成本比推導最適門檻，而非壓到最低" },
      { id: "D", text: "先以最高召回率門檻篩檢，再由醫師從名單中隨機抽選複檢對象" },
    ],
    answer: "C",
    explanation:
      "「不能漏掉」不代表門檻可以無限下調——當複檢本身具侵入性且昂貴時，誤報也有真實代價。最適門檻由兩類錯誤的成本比決定，而不是由其中一方的口號決定。",
    choiceExplanations: {
      A: "0.5 只是預設值，未反映此案漏診與侵入性複檢兩類錯誤成本的不對稱。",
      B: "門檻壓到最低會讓大量健康者接受侵入性檢查，代價可能超過漏診的期望損失，「不漏」不等於最適。",
      D: "隨機抽選會讓模型的排序資訊失效，真正高風險者可能被抽掉，不具臨床依據。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["門檻選擇", "錯誤成本", "召回與精確"],
      constraints: ["quality", "safety", "cost"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若複檢改為非侵入性且極便宜，誤報的代價大幅下降，門檻就可以往提高召回的方向大幅調整。",
    },
  },
  {
    id: "senior-bigdata-practice-q156",
    subjectId: "senior-bigdata",
    prompt:
      "某農業病害分類模型的整體準確率 96%，但其中一種罕見病害的召回率僅 20%。下列處置何者最合理？",
    choices: [
      { id: "A", text: "整體準確率已達 96%，罕見類別樣本很少，對整體的影響可以忽略" },
      { id: "B", text: "分別檢視各類別召回率，針對該病害補樣本或調整類別權重" },
      { id: "C", text: "把該病害併入外觀最相近的類別，減少模型需要辨識的類別數量" },
      { id: "D", text: "把整體準確率的目標提高到 99%，迫使模型同時改善所有的類別" },
    ],
    answer: "B",
    explanation:
      "整體準確率會被多數類別主導，罕見病害即使幾乎抓不到也看不出來。分群檢視讓問題現形，補樣本或加權則讓模型重新為它調整。",
    choiceExplanations: {
      A: "只看整體正是讓問題被掩蓋的原因；罕見病害樣本少，但往往危害最大，不能忽略。",
      C: "併入相近類別雖能讓指標好看，卻等於放棄辨識該病害，而罕見病害往往危害最大。",
      D: "提高整體目標可能讓模型更專注於多數類別，整體指標上升並不保證罕見類別會跟著改善。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["分群評估", "類別不平衡", "類別權重"],
      constraints: ["quality", "data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若該病害在現實中就極罕見、樣本無從補充，就只能以加權並明確標示模型在該類別上的適用限制。",
    },
  },

  // ── L22403 大數據在生成式 AI 中的應用（7 題）──────────────────
  {
    id: "senior-bigdata-practice-q087",
    subjectId: "senior-bigdata",
    prompt:
      "訓練大型語言模型時，資料前處理中的「去重（Deduplication）」主要目的是下列何者？",
    choices: [
      { id: "A", text: "降低語料中的雜訊字元，提升模型的斷詞準確度" },
      { id: "B", text: "避免模型過度記憶重複內容並降低訓練資源浪費" },
      { id: "C", text: "縮小模型的詞彙表，以提高推論時的生成速度" },
      { id: "D", text: "擴充有效的訓練樣本數，讓模型看到更多資料" },
    ],
    answer: "B",
    explanation:
      "重複段落會被模型反覆看到，容易導致逐字記憶（甚至在輸出時原樣重現），也浪費算力。去重能同時改善泛化與訓練效率。",
    choiceExplanations: {
      A: "去除雜訊字元屬於文字清理；去重處理的是重複的段落或文件，兩者目的不同。",
      C: "去重處理的是訓練語料，不改變詞彙表或架構，推論速度不受影響。",
      D: "去重刪除重複內容，資料量是減少而非增加，方向相反。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["去重", "逐字記憶", "訓練效率"],
      constraints: ["data_quality", "cost"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Layer Confusion",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若某類內容本來就稀少、需要模型確實記住（例如法條原文），過度去重反而會削弱它的覆蓋。",
    },
  },
  {
    id: "senior-bigdata-practice-q088",
    subjectId: "senior-bigdata",
    prompt:
      "建立企業內部 RAG 系統時，「切塊（Chunking）」策略的主要影響是下列何者？",
    choices: [
      { id: "A", text: "主要影響向量索引的儲存空間，切得越細越能節省容量" },
      { id: "B", text: "切太大會混入無關內容、切太小會切斷語意，都影響檢索品質" },
      { id: "C", text: "主要影響回答時引用段落的顯示長度，與檢索無關" },
      { id: "D", text: "只要選用能力夠強的嵌入模型，切塊方式對檢索結果的影響就很小" },
    ],
    answer: "B",
    explanation:
      "切塊決定了檢索的最小單位。過大的塊讓向量摻雜多個主題而難以精準匹配，過小的塊則可能把一個完整說明切斷、失去上下文。實務上常搭配重疊切塊折衷。",
    choiceExplanations: {
      A: "切塊確實影響索引大小，但主要影響的是檢索精準度；而且切得越細塊數越多，索引反而更大。",
      C: "切塊發生在建立索引階段，決定檢索的最小單位，不只是顯示長度的問題。",
      D: "檢索的對象就是這些塊；塊內混雜多主題或語意被切斷時，再強的嵌入模型也表達不出正確語意。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Concept Boundary",
      concepts: ["Chunking", "檢索品質", "重疊切塊"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Layer Confusion",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若文件本身已是結構清楚的短條目（如問答對），依條目切塊即可，重疊與大小的調校就不再是關鍵。",
    },
  },
  {
    id: "senior-bigdata-practice-q089",
    subjectId: "senior-bigdata",
    prompt:
      "向量資料庫在生成式 AI 應用中的主要角色是下列何者？",
    choices: [
      { id: "A", text: "取代關聯式資料庫，統一儲存所有交易與結構化資料" },
      { id: "B", text: "儲存模型權重，並在微調時負責更新語言模型" },
      { id: "C", text: "依據檢索結果直接組合並產生最終的回答文字" },
      { id: "D", text: "以向量相似度快速檢索語意相近的內容片段" },
    ],
    answer: "D",
    explanation:
      "向量資料庫把文本嵌入後的向量建立索引，讓系統能在大量片段中快速找出語意最接近查詢的幾則，供語言模型作為生成依據。",
    choiceExplanations: {
      A: "向量資料庫擅長相似度檢索，交易與結構化查詢仍需關聯式資料庫，兩者互補而非取代。",
      B: "模型權重與訓練由訓練框架與運算叢集處理，向量資料庫存的是內容的嵌入向量。",
      C: "組合與生成回答是語言模型的工作，向量資料庫只負責找出供生成參考的素材。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["向量資料庫", "語意檢索"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Layer Confusion",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若查詢的是精確料號或條號這類字面字串，向量檢索容易召回相近但不對的內容，關鍵字檢索才可靠。",
    },
  },
  {
    id: "senior-bigdata-practice-q090",
    subjectId: "senior-bigdata",
    prompt:
      "以企業內部文件微調語言模型時，最需要注意的資料風險是下列何者？",
    choices: [
      { id: "A", text: "文件格式不一致導致轉檔失敗，使訓練資料量不足" },
      { id: "B", text: "文件中的專業術語過多，使模型失去一般對話能力" },
      { id: "C", text: "含敏感資訊的內容可能被模型記憶並在輸出時洩漏" },
      { id: "D", text: "文件版本過舊導致模型回答的內容不夠新" },
    ],
    answer: "C",
    explanation:
      "模型可能記住訓練語料中的具體內容，在特定提示下重現。含個資或營業秘密的文件必須先去識別化或排除，並在上線前以紅隊測試檢查是否會洩漏。",
    choiceExplanations: {
      A: "格式問題可透過轉檔流程處理，屬於工程品質問題，不是微調最需要注意的資料風險。",
      B: "微調可能造成能力遺忘，但這是效能取捨；敏感資訊被記憶後外洩才是最需要注意的資料風險。",
      D: "內容過時影響的是回答品質，可透過更新語料或 RAG 解決；它不像敏感資訊外洩那樣造成無法回收的損害。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["微調資料風險", "記憶洩漏", "紅隊測試"],
      constraints: ["privacy", "security"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若改以 RAG 檢索這些文件而不是微調，敏感內容就不會被寫進模型權重，風險焦點會轉為檢索階段的權限控管。",
    },
  },
  {
    id: "senior-bigdata-practice-q091",
    subjectId: "senior-bigdata",
    prompt:
      "評估 RAG 系統時，下列哪一組指標最能反映「檢索階段」的品質？",
    choices: [
      { id: "A", text: "檢索命中率與相關文件的排序位置" },
      { id: "B", text: "生成答案的流暢度與平均字數" },
      { id: "C", text: "最終答案對使用者問題的正確率" },
      { id: "D", text: "嵌入向量的維度與索引的建置時間" },
    ],
    answer: "A",
    explanation:
      "RAG 的品質可拆成檢索與生成兩段。檢索段要看正確文件有沒有被找到、排在第幾位；若檢索就沒帶回正確依據，再好的生成模型也答不對。",
    choiceExplanations: {
      B: "流暢度與字數屬於生成段的表現，與是否檢索到正確依據無關。",
      C: "最終正確率混合了檢索與生成兩段，看不出檢索階段本身的品質。",
      D: "向量維度與建置時間描述的是規模與效能，不衡量是否找到正確文件。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["RAG 評估", "檢索命中率", "排序位置"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若檢索已確認帶回正確段落、答案卻仍然錯，問題就在生成階段，該量測的變成「答案是否忠於檢索到的證據」。",
    },
  },
  {
    id: "senior-bigdata-practice-q092",
    subjectId: "senior-bigdata",
    prompt:
      "以生成式 AI 產生「合成資料」用於補充訓練樣本時，最應注意下列何者？",
    choices: [
      { id: "A", text: "合成資料由模型產生、無個資疑慮，因此不需另外驗證" },
      { id: "B", text: "合成資料沒有標註雜訊，因此品質一定優於真實資料" },
      { id: "C", text: "合成資料若與真實分布偏離，可能把模型帶往錯誤方向" },
      { id: "D", text: "只要數量足夠，合成資料可以完全取代真實資料" },
    ],
    answer: "C",
    explanation:
      "合成資料只反映生成模型自己的認知，若它與真實世界的分布有落差，模型會學到這個偏差。使用時必須以真實資料驗證，並控制合成樣本的比例。",
    choiceExplanations: {
      A: "沒有個資疑慮不代表分布正確，不驗證就無從得知它是否引入偏差，風險極高。",
      B: "合成資料的標籤雖一致，但只反映生成模型自己的認知，品質取決於真實性，並非天然優於真實觀測。",
      D: "完全以合成資料訓練會讓模型逐步偏離真實世界，數量再多也補不回與真實分布的落差。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["合成資料", "分布偏離", "比例控制"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Overgeneralization",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若合成資料只用於補強某個已知稀少但定義明確的類別（例如特定瑕疵型態），且以真實樣本驗證過，風險就相對可控。",
    },
  },
  {
    id: "senior-bigdata-practice-q093",
    subjectId: "senior-bigdata",
    prompt:
      "生成式 AI 應用中的「嵌入（Embedding）」指的是下列何者？",
    choices: [
      { id: "A", text: "把文字或其他資料轉換成能表達語意的數值向量" },
      { id: "B", text: "把訓練好的模型嵌入到邊緣裝置的專用硬體晶片中" },
      { id: "C", text: "把圖片或文件壓縮成較小的二進位檔案以利網路傳輸" },
      { id: "D", text: "把資料庫以函式庫形式直接嵌入到應用程式中執行" },
    ],
    answer: "A",
    explanation:
      "嵌入把文本、影像等資料映射到向量空間，使語意相近者距離較近。它是語意檢索、分群與 RAG 的共同基礎。",
    choiceExplanations: {
      B: "放進邊緣裝置晶片是嵌入式部署，與「嵌入向量」中文用詞相近但概念完全不同。",
      C: "壓縮著重於減少檔案大小以利傳輸，不保證保留語意關係，也不產生可比較相似度的向量。",
      D: "把資料庫內嵌於應用是軟體架構的選擇（嵌入式資料庫），與向量表示無關。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "易",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["嵌入", "語意向量"],
      distractorTypes: {
        B: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若嵌入模型與語料的領域差距太大（例如以通用語料嵌入專業醫學名詞），向量空間的語意關係就會失準，需要領域特化的嵌入模型。",
    },
  },
  {
    id: "senior-bigdata-practice-q157",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的 RAG 系統在回答條款細節時常取到相近但不對的條文。已知文件以固定 500 字切塊、無重疊。下列調整何者最合理？",
    choices: [
      { id: "A", text: "依條文自然邊界切塊並加入重疊，再導入重排序提升精準度" },
      { id: "B", text: "把切塊放大到 5000 字，讓每塊都能完整涵蓋多條相關條文" },
      { id: "C", text: "把切塊縮小到 50 字，讓每個塊都只對應一個精確的語意點" },
      { id: "D", text: "改用參數更大的嵌入模型，維持現有 500 字固定切塊不變" },
    ],
    answer: "A",
    explanation:
      "固定字數切塊會把一條完整規定攔腰截斷，兩半的向量都不完整。依自然邊界切並加入重疊能保住語意完整性；重排序則在初步召回後再篩一次，提升精準度。",
    choiceExplanations: {
      B: "塊太大會摻雜多個主題，向量變得模糊，反而更難精準匹配到特定條文的細節。",
      C: "50 字會把單一條文切得更碎，條件與例外被拆散，上下文完全喪失。",
      D: "嵌入模型再強，被攔腰截斷的條文向量仍不完整，問題出在切塊方式而非嵌入能力。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["切塊策略", "重疊", "重排序"],
      constraints: ["quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若文件本來就是結構清楚的短條目（如問答對），依條目切塊即可，重疊與大小的調校就不再是關鍵。",
    },
  },
  {
    id: "senior-bigdata-practice-q158",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院以內部病歷微調語言模型，紅隊測試發現特定提問能誘出真實病患姓名。下列處置何者最完整？",
    choices: [
      { id: "A", text: "以更多一般語料稀釋病歷比例後重新微調，降低模型記憶個資的機率" },
      { id: "B", text: "在系統提示中明確要求模型不得透露任何病患姓名或可識別資訊" },
      { id: "C", text: "訓練前去識別化與去重並重訓，以紅隊測試驗證；無法重訓則評估下架或輸出過濾" },
      { id: "D", text: "延長訓練時間讓模型更充分學習醫療知識，降低對個別病歷的依賴" },
    ],
    answer: "C",
    explanation:
      "記憶風險與資料中是否含敏感內容、該內容重複幾次高度相關。從源頭去識別化與去重是根本解法，紅隊測試則是驗證手段；若已上線且無法重訓，就只剩輸出過濾這道較弱的補救。",
    choiceExplanations: {
      A: "稀釋或許降低記憶機率，但姓名仍在訓練資料中，沒有從源頭移除就無法保證不再洩漏，也缺乏驗證。",
      B: "提示層的約束容易被越獄式提問繞過，姓名仍記在權重裡，屬於最弱的防線。",
      D: "訓練越久越容易逐字記憶個別紀錄，與降低風險的目標相反。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["訓練資料記憶", "去識別化", "紅隊測試"],
      constraints: ["privacy", "security"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L22404",
      decisionBoundary:
        "若改以 RAG 檢索這些病歷而不是微調，敏感內容就不會被寫進模型權重，風險焦點會轉為檢索階段的權限控管。",
    },
  },
  {
    id: "senior-bigdata-practice-q159",
    subjectId: "senior-bigdata",
    prompt:
      "某工廠以生成式模型合成瑕疵影像補足訓練資料，數個世代後發現生成影像逐漸單一、下游判別模型也隨之退步。追查發現每一代都以前一代的合成影像繼續訓練。下列處置何者最正確？",
    choices: [
      { id: "A", text: "這是以自身產出反覆訓練的多樣性衰退，每代須混入真實影像" },
      { id: "B", text: "這是生成模型容量不足所致，應提高參數量讓它保留更多瑕疵細節" },
      { id: "C", text: "應增加每一代產生的合成影像數量，以更大的樣本量把多樣性補回來" },
      { id: "D", text: "應改用更複雜的判別模型，讓下游能從退化的影像中仍學到瑕疵差異" },
    ],
    answer: "A",
    explanation:
      "當訓練資料主要來自前一代自己的產出，原本存在的多樣性會逐代流失、細節逐漸模糊。要打斷這個循環，只能靠持續注入真實資料當錨點。",
    choiceExplanations: {
      B: "參數量增加無法補回訓練資料中已經流失的多樣性，問題在資料來源而非容量。",
      C: "從已經單一的分布中多抽樣，只是把同樣單一的樣式產生得更多。",
      D: "判別模型再複雜，吃到的仍是逐代失真、多樣性不足的資料，無法學回已消失的差異。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["合成資料反覆訓練", "多樣性衰退", "真實資料錨點"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      crossNode: "L22402",
      decisionBoundary:
        "若每一代都固定混入足量的新真實影像，多樣性就有錨點可回歸——關鍵在真實資料的比例，不在模型多大。",
    },
  },
  {
    id: "senior-bigdata-practice-q160",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台的 RAG 系統答錯後，團隊想知道問題出在檢索還是生成。下列評估設計何者最合理？",
    choices: [
      { id: "A", text: "比較不同提示詞下的回應速度與成本，找出效能瓶頸所在" },
      { id: "B", text: "以人工標註的題庫量測最終答案正確率，追蹤整體趨勢" },
      { id: "C", text: "請語言模型自評回答信心，信心低的題目歸為檢索問題" },
      { id: "D", text: "分別量測檢索命中率與排序，以及檢索正確時答案是否忠於證據" },
    ],
    answer: "D",
    explanation:
      "RAG 的品質可以拆成檢索與生成兩段，處方完全不同。只看最終答案對錯，無法知道該調檢索參數還是改生成設定；分開量測才修得對。",
    choiceExplanations: {
      A: "回應速度與成本是效能指標，無法判斷答錯的責任在檢索還是生成。",
      B: "最終正確率是綜合結果，題庫再精確也看不出責任落在哪一段。",
      C: "模型自評信心不可靠，且信心低也可能是生成段的問題，無法據此切分責任。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["RAG 分段評估", "檢索命中率", "證據忠實度"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若檢索已確認帶回正確段落、答案卻仍然錯，問題就在生成階段，該量測的變成答案是否忠於檢索到的證據。",
    },
  },
  {
    id: "senior-bigdata-practice-q161",
    subjectId: "senior-bigdata",
    prompt:
      "某農業知識庫每日新增數十份技術文件，目前每次更新都全量重建向量索引，耗時數小時。下列改善何者最直接？",
    choices: [
      { id: "A", text: "改為每月全量重建一次，以降低運算資源的消耗" },
      { id: "B", text: "改為增量索引，只重算並更新異動文件片段的向量" },
      { id: "C", text: "放棄向量索引，每次把全部文件貼入提示詞" },
      { id: "D", text: "把重建作業改到夜間離峰時段，並增加運算節點平行處理" },
    ],
    answer: "B",
    explanation:
      "每天只有數十份文件異動，卻重算整個索引，絕大部分運算是重複的。增量索引只處理變動的部分，能把數小時壓到數分鐘。",
    choiceExplanations: {
      A: "降低更新頻率會讓使用者在一個月內查到過時的技術資訊，每次重建的運算量本身也沒有減少。",
      C: "全部文件遠超過上下文長度，且成本更高。",
      D: "改時段與加機器只是把耗時挪走或分攤，重算未異動文件的浪費依然存在。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["增量索引", "更新成本", "向量資料庫"],
      constraints: ["cost", "maintainability"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若文件之間存在大量交叉引用、改一份會牽動許多片段的語意，增量更新的邊界難以界定，全量重建反而穩妥。",
    },
  },

  // ── L22404 大數據隱私保護、安全與合規（7 題）──────────────────
  {
    id: "senior-bigdata-practice-q094",
    subjectId: "senior-bigdata",
    prompt:
      "關於「去識別化」與「假名化」的差異，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "兩者都移除了直接識別資訊，在法規上視為同等程度的保護" },
      { id: "B", text: "假名化保留可還原的對應關係，去識別化則力求無法連回個人" },
      { id: "C", text: "假名化以代號取代姓名，因此比去識別化更安全" },
      { id: "D", text: "去識別化保留對照表以便還原，假名化則無法還原" },
    ],
    answer: "B",
    explanation:
      "假名化以代號取代識別欄位，但對照表仍存在、可還原，因此多數法規仍視為個資；去識別化則要讓資料無法（或難以）連回特定個人，保護程度較高。",
    choiceExplanations: {
      A: "兩者在可還原性與法規定位上有明確差異：假名化仍可還原，多數法規仍視為個資。",
      C: "假名化保留對照表、可還原，風險通常高於徹底的去識別化。",
      D: "敘述把兩者對調了：保留可還原對照關係的是假名化，去識別化則力求無法連回個人。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Comparison",
      concepts: ["去識別化", "假名化", "可還原性"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若對照表被完全銷毀、且無其他途徑可復原身分，假名化的資料才會進入去識別化的範疇。",
    },
  },
  {
    id: "senior-bigdata-practice-q095",
    subjectId: "senior-bigdata",
    prompt:
      "「k-匿名性（k-anonymity）」的核心概念是下列何者？",
    choices: [
      { id: "A", text: "資料集中至少保留 k 個準識別欄位，以確保分析可用性" },
      { id: "B", text: "任一筆記錄在準識別欄位組合上，至少與其他 k−1 筆無法區分" },
      { id: "C", text: "每筆記錄的敏感屬性在組內至少有 k 種不同取值" },
      { id: "D", text: "任何統計查詢的結果都必須彙總至少 k 筆以上的記錄才能對外輸出" },
    ],
    answer: "B",
    explanation:
      "k-匿名性要求以年齡區間、郵遞區號等準識別欄位分組後，每一組至少有 k 筆記錄，使攻擊者無法從這些欄位的組合鎖定到特定個人。",
    choiceExplanations: {
      A: "k 指的是同一準識別組合下的記錄筆數，而非欄位數量。",
      C: "要求組內敏感值至少有若干種不同取值是 l-多樣性的概念，不是 k-匿名性。",
      D: "這是查詢門檻的做法，限制的是輸出的彙總筆數；k-匿名性要求的是釋出資料本身的分組結構。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Direct Concept",
      concepts: ["k-匿名性", "準識別欄位"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Terminology Swap",
        C: "Neighbor Concept",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若同一組內的 k 筆記錄在敏感欄位上其實全部相同（例如都罹患同一疾病），k-匿名仍會洩漏，此時需要 l-多樣性補強。",
    },
  },
  {
    id: "senior-bigdata-practice-q096",
    subjectId: "senior-bigdata",
    prompt:
      "「資料最小化」原則要求下列何者？",
    choices: [
      { id: "A", text: "只保留一份資料副本，以降低外洩的機會" },
      { id: "B", text: "盡量多蒐集資料，但只開放最少人員存取" },
      { id: "C", text: "把資料壓縮與去重到最小的儲存體積" },
      { id: "D", text: "只蒐集達成特定目的所必要的資料" },
    ],
    answer: "D",
    explanation:
      "資料最小化是個資保護的核心原則：沒蒐集的資料就不會外洩。它同時降低了合規負擔與資安風險，也迫使組織先想清楚目的再蒐集。",
    choiceExplanations: {
      A: "副本數量屬於備援與儲存策略，與該蒐集哪些資料是兩回事。",
      B: "限制存取是存取控制，不能正當化超出目的的蒐集；「先收再說」正是此原則要避免的。",
      C: "壓縮與去重處理的是儲存體積，與蒐集範圍是否必要無關。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "易",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L1",
      archetype: "Direct Concept",
      concepts: ["資料最小化", "目的必要性"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      decisionBoundary:
        "若日後出現新的分析目的，正確做法是重新取得同意再蒐集，而不是當初就先囤著以備不時之需。",
    },
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
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["彙總統計", "個資保護", "目的達成"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若某個部門人數極少，彙總統計本身就可能反推到個人，此時要再設最小組別門檻或合併分組。",
    },
  },
  {
    id: "senior-bigdata-practice-q098",
    subjectId: "senior-bigdata",
    prompt:
      "「差分隱私（Differential Privacy）」的基本作法是下列何者？",
    choices: [
      { id: "A", text: "在查詢結果中加入受控雜訊，使單一個體是否在資料集中難以判斷" },
      { id: "B", text: "把資料以強加密演算法儲存，僅授權者可解密查詢" },
      { id: "C", text: "查詢結果一律只輸出彙總統計，不回傳任何個人層級的明細" },
      { id: "D", text: "把姓名等直接識別欄位替換成隨機代號後再開放查詢" },
    ],
    answer: "A",
    explanation:
      "差分隱私以數學方式保證：某一個人在不在資料集裡，對輸出結果的分布影響有嚴格上限。實作上是在統計輸出加入校準過的雜訊，在隱私與可用性間取得可量化的平衡。",
    choiceExplanations: {
      B: "加密保護的是靜態或傳輸中的資料，授權者解密後查詢仍可能推知個體資訊。",
      C: "只輸出彙總仍可能被差分攻擊：比較含與不含某人的兩次查詢就能反推個體，差分隱私正是為此加入雜訊。",
      D: "這是假名化，資料仍可透過其他欄位或對照表連回個人，與在輸出加入受控雜訊的差分隱私不同。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Direct Concept",
      concepts: ["差分隱私", "受控雜訊", "隱私預算"],
      constraints: ["privacy"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若同一份資料被反覆查詢，隱私預算會逐次耗盡，之後就必須拒絕查詢——差分隱私保護的是累積的查詢次數，不是單次。",
    },
  },
  {
    id: "senior-bigdata-practice-q099",
    subjectId: "senior-bigdata",
    prompt:
      "跨國企業在不同地區處理個人資料時，最應優先確認下列何者？",
    choices: [
      { id: "A", text: "各地伺服器的品牌與規格是否統一以利集中維運" },
      { id: "B", text: "各地辦公室是否皆已取得國際資安管理系統認證" },
      { id: "C", text: "各地法規對資料跨境傳輸與當地儲存的要求" },
      { id: "D", text: "各地子公司是否使用相同的資料格式與字元編碼" },
    ],
    answer: "C",
    explanation:
      "不同法域對個資的跨境傳輸、當地儲存與適足性認定要求差異很大，違反可能面臨高額裁罰。這必須在系統架構設計之前就確認清楚。",
    choiceExplanations: {
      A: "硬體品牌與規格統一有助維運，但不影響個資法規的遵循。",
      B: "資安認證有助於管理，但不等於符合各地對跨境傳輸與在地儲存的法定要求。",
      D: "資料格式一致是系統整合議題，與各地個資法規的跨境要求無關。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["跨境傳輸", "資料在地化", "法規差異"],
      constraints: ["governance", "privacy"],
      distractorTypes: {
        A: "Layer Confusion",
        B: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若所有資料都只在單一法域內蒐集與處理、完全不跨境，這項限制就不成立，重點回到當地的一般個資規範。",
    },
  },
  {
    id: "senior-bigdata-practice-q100",
    subjectId: "senior-bigdata",
    prompt:
      "資料外洩事件發生後，下列哪一項是最應立即進行的動作？",
    choices: [
      { id: "A", text: "依既定的應變計畫止血、保全證據並依規定通報" },
      { id: "B", text: "先清查並刪除所有外洩相關日誌，以免資料再次外流" },
      { id: "C", text: "先暫停對外通報，待內部調查完全釐清事實後再決定" },
      { id: "D", text: "先發布聲明安撫客戶，表示目前並沒有任何資料外洩" },
    ],
    answer: "A",
    explanation:
      "事故應變的順序是先阻斷持續外洩、保全鑑識所需的日誌與證據，再依法規時限通報主管機關與當事人。事前就備妥計畫，事發時才不會手忙腳亂。",
    choiceExplanations: {
      B: "刪除日誌會摧毀鑑識證據，可能構成湮滅證據等更嚴重的責任；日誌本身並不是外洩的途徑。",
      C: "通報有法定時限，等完全釐清才通報會錯過時限；應變計畫是邊止血邊依規定通報。",
      D: "在未查明前宣稱沒有外洩屬不實陳述，事實揭露後會造成更嚴重的法律與商譽後果。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["事故應變", "證據保全", "通報義務"],
      constraints: ["security", "governance"],
      distractorTypes: {
        B: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若外洩已經結束且範圍確定，第一步就從「止血」轉為「評估影響範圍與通報」，但保全證據的優先順序不變。",
    },
  },
  {
    id: "senior-bigdata-practice-q162",
    subjectId: "senior-bigdata",
    prompt:
      "某醫院釋出去識別化的病歷供研究，已確保每個準識別欄位組合至少對應五筆紀錄。研究者卻發現某一組五筆全部罹患同一罕見疾病。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "k-匿名擋不住敏感屬性同質的洩漏，需再以 l-多樣性確保組內敏感值有變異" },
      { id: "B", text: "已滿足 k=5 的匿名要求，研究者無法從組內指認特定個人，因此無需再處理" },
      { id: "C", text: "應把 k 提高到 10 以上，讓每組納入更多紀錄，以稀釋罕見疾病的集中程度" },
      { id: "D", text: "應改提供原始資料並簽署保密協議，由研究者自行負責後續的隱私保護" },
    ],
    answer: "A",
    explanation:
      "k-匿名保證的是「分不出是組裡的哪一個人」，但如果組內所有人的敏感值都相同，知道某人在這組就等於知道他的病。這正是 k-匿名的已知缺口，要靠 l-多樣性補上。",
    choiceExplanations: {
      B: "k=5 只保證分不出組內哪一個人，未保證敏感值有差異；知道某人在這組就知道他的病，洩漏依然成立。",
      C: "提高 k 不保證敏感值有差異，若擴大後的組內仍全是同一疾病，同質性問題不會消失。",
      D: "提供原始資料是往反方向走，保密協議無法取代技術上的去識別化，隱私風險更高。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["k-匿名", "l-多樣性", "敏感屬性同質"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若組內的疾病分布本來就分散、沒有任何一種佔多數，k-匿名提供的保護就已經足夠。",
    },
  },
  {
    id: "senior-bigdata-practice-q163",
    subjectId: "senior-bigdata",
    prompt:
      "某銀行的統計查詢介面已導入差分隱私，但研究者反覆查詢同一批資料數千次後，仍逐步逼近了個別客戶的數值。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "應大幅提高每次查詢加入的雜訊量，使反覆平均也無法收斂" },
      { id: "B", text: "這表示差分隱私已失效，應改為加密儲存資料" },
      { id: "C", text: "差分隱私的保證會隨查詢累積，應設定並強制執行隱私預算" },
      { id: "D", text: "限制只有內部主管能查詢，並記錄每次查詢的帳號" },
    ],
    answer: "C",
    explanation:
      "每次查詢都會消耗一部分隱私保護額度，反覆查詢會讓雜訊被平均掉。差分隱私的完整實作必須包含隱私預算的追蹤與強制執行——沒有預算上限，單次的保證撐不住累積的查詢。",
    choiceExplanations: {
      A: "加大雜訊只能延緩而無法阻止平均收斂，查詢次數沒有上限時仍會被逼近，且輸出的可用性大幅下降。",
      B: "差分隱私沒有失效，是缺少隱私預算控管；加密保護的是儲存與傳輸，解密後查詢仍可推知個體。",
      D: "限制查詢者與留存紀錄是存取控制，無法防止有權者透過反覆查詢從統計結果反推個人。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["差分隱私", "隱私預算", "累積洩漏"],
      constraints: ["privacy"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Layer Confusion",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若介面只允許每位研究者查詢有限次數且全程記錄，預算機制就自然成立，累積洩漏的路徑被切斷。",
    },
  },
  {
    id: "senior-bigdata-practice-q164",
    subjectId: "senior-bigdata",
    prompt:
      "某跨國製造集團要把台灣廠的產線資料送到歐洲總部分析，其中含員工的工號與班別。下列評估重點何者最完整？",
    choices: [
      { id: "A", text: "屬集團內部傳輸，只要總部提出需求並簽核即可直接傳送" },
      { id: "B", text: "確認跨境傳輸的法律依據與在地化要求，並評估能否先去識別化" },
      { id: "C", text: "以端對端加密傳輸並限制總部存取權限即無合規問題" },
      { id: "D", text: "資料不含員工姓名，工號與班別不構成個資，可直接傳輸" },
    ],
    answer: "B",
    explanation:
      "跨境傳輸個資牽涉三件事：有沒有法律依據、目的地與來源地的在地化要求、以及能不能根本不傳個資。最後一項往往最有效——不含員工資訊的產線統計，合規負擔會低得多。",
    choiceExplanations: {
      A: "集團內部簽核不能取代法律依據，跨境傳輸個資仍須符合兩地法規，違反可能面臨高額裁罰。",
      C: "加密與權限保護的是傳輸與存取的機密性，不解除跨境傳輸本身的法律依據與在地化要求。",
      D: "工號可與人事系統連結而識別到特定個人，仍屬個人資料，不能因不含姓名就直接傳輸。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["跨境傳輸", "資料在地化", "去識別化"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若送出的只是不含任何員工欄位的機台層級統計，跨境傳輸個資的問題就不成立，評估範圍縮小到營業秘密。",
    },
  },
  {
    id: "senior-bigdata-practice-q165",
    subjectId: "senior-bigdata",
    prompt:
      "某教育平台為分析學習成效，規劃蒐集學生的完整瀏覽紀錄、裝置識別碼與地理位置。下列評估何者最符合資料最小化原則？",
    choices: [
      { id: "A", text: "只要全部欄位都加密儲存並限制存取，就可以完整蒐集" },
      { id: "B", text: "先完整蒐集所有欄位，一年後再刪除沒用到的部分" },
      { id: "C", text: "蒐集越多欄位分析越準確，可先取得學生同意後全部蒐集" },
      { id: "D", text: "逐項檢視各欄位對分析目標是否必要，地理位置若非所需就不蒐集" },
    ],
    answer: "D",
    explanation:
      "資料最小化的核心是「沒蒐集的資料就不會外洩」。逐欄位檢視必要性會迫使團隊先想清楚目的，也直接降低了合規負擔與資安風險。",
    choiceExplanations: {
      A: "加密與存取控制保護的是儲存安全，不能正當化蒐集超出必要範圍的資料。",
      B: "「先收再說」正是此原則要避免的做法，保存的一年內都在累積不必要的風險。",
      C: "取得同意不代表可以蒐集超出目的所需的欄位；欄位多寡與準確度也沒有必然關係。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Best Engineering Decision",
      concepts: ["資料最小化", "必要性檢視", "目的限制"],
      constraints: ["privacy", "governance"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Wrong Trade-off",
        C: "Overgeneralization",
      },
      decisionBoundary:
        "若分析目標明確包含「不同地區的學習資源落差」，地理位置就成為必要欄位，但仍應粗化到縣市層級而非精確座標。",
    },
  },
  {
    id: "senior-bigdata-practice-q166",
    subjectId: "senior-bigdata",
    prompt:
      "某農業平台發生資料外洩，維運人員第一時間想先刪除相關日誌以免被追究。下列判斷何者最正確？",
    choices: [
      { id: "A", text: "先刪除日誌中涉及個資的部分，避免外洩的範圍進一步擴大" },
      { id: "B", text: "應立即阻斷外洩並保全日誌作為鑑識證據，再依規定通報" },
      { id: "C", text: "先等內部調查完全釐清責任歸屬與損害範圍後，再決定是否通報" },
      { id: "D", text: "先封存日誌僅供內部檢視，對外暫不說明以免引發客戶恐慌" },
    ],
    answer: "B",
    explanation:
      "應變順序是止血、保全證據、依法通報。日誌是鑑識與究責的唯一依據，刪除它不僅摧毀了追查的可能，本身也可能構成湮滅證據等更重的責任。",
    choiceExplanations: {
      A: "日誌是鑑識的依據，刪除會讓事件無從釐清，且行為本身可能構成湮滅證據的新違失。",
      C: "通報有法定時限，拖到釐清責任才決定會錯過時限並擴大損害。",
      D: "封存日誌是對的，但隱匿不報違反法定通報義務，事後揭露會造成更嚴重的法律與商譽後果。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["事故應變", "證據保全", "通報義務"],
      constraints: ["security", "governance"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若外洩已經結束且範圍確定，第一步就從止血轉為評估影響範圍與通報，但保全證據的優先順序不變。",
    },
  },
];
