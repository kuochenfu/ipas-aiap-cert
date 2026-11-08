import type { Question } from "../types";

// AI 趨勢補強批次（2026-11-07）：比照 senior-ai-tech.trends.ts，補上生成式 AI 與 AI 代理普及後的資料工程題——
// 湖倉、CDC、資料代理與語意層、模型崩潰、資料投毒、代理流量下的詐欺偵測、深偽偵測的泛化、嵌入模型更換、
// RAG 權限過濾、代理時代的資料外洩、聯邦學習，以及 A/B 測試的提早停止。題目一律寫成「趨勢下的設計判斷」，
// 不考產品名、事件細節或日期。題數受 tests/codeQuestions.test.ts 的程式題比例（≥20%）限制，只收 12 題；
// 與既有題庫重疊較多的主題（差分隱私、去識別、信賴區間、串流時間窗、圖表截斷）只寫進筆記。
// 全數為 LLM 命題、需人工複審。對應筆記：studyNotes.ts 中級科目二 L221–L224 的「補充」節。
export const practiceQuestions: Question[] = [
  // ── 統計：AI 功能的評估 ──
  {
    id: "senior-bigdata-practice-q214",
    subjectId: "senior-bigdata",
    prompt:
      "線上學習平台以 A/B 測試評估新的 AI 助教能否提升課程完成率。團隊每天查看一次 p 值，第三天看到 p < 0.05 就宣布實驗成功並全面上線。這個做法最主要的問題是什麼？",
    choices: [
      { id: "A", text: "三天的樣本較少，反而讓結論比較保守，因此這次判定成功的結果其實更值得信任" },
      { id: "B", text: "每天查看、一顯著就停止，會讓偽陽性機率高於設定的 α，應事先決定樣本數或改用序列檢定" },
      { id: "C", text: "p < 0.05 代表 AI 助教有 95% 的機率確實有效，問題只在於應該等到 p < 0.01 再上線" },
      { id: "D", text: "雙尾檢定太過嚴格，應改用單尾檢定，讓結果更容易達到顯著，以縮短實驗所需的時間" },
    ],
    answer: "B",
    explanation:
      "固定樣本數的檢定，前提是只在實驗結束時看一次結果。每天看、一碰到顯著就停，等於給了偶然波動很多次「被當成成功」的機會，實際的偽陽性機率會遠高於 5%。正確做法是事先決定樣本數與實驗期間，到期才判讀；若一定要中途查看，就改用能連續監測、會校正查看次數的序列檢定方法。",
    choiceExplanations: {
      A: "樣本少並不會讓結論更保守，反而讓結果更容易受隨機波動影響；加上提早停止，三天的「顯著」更不可靠。",
      C: "這是對 p 值的常見誤解：p 值是「假設沒有效果時，看到這麼極端結果的機率」，不是「有效的機率」；把門檻改成 0.01 也解決不了重複查看的問題。",
      D: "為了更容易顯著而在看過資料後改用單尾檢定，屬於事後調整分析方法，同樣會灌高偽陽性；檢定方式要在實驗前就決定。",
    },
    topic: "L22301 統計學在大數據中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["A/B 測試", "提早停止", "偽陽性", "序列檢定"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Terminology Swap",
        D: "Overgeneralization",
      },
      crossNode: "L22103",
      decisionBoundary:
        "若實驗設計時就採用序列檢定、並預先訂好查看的時點與校正方式，中途依規則停止是允許的；問題不在於「看」，而在於沒有校正就依結果停止。",
    },
  },

  // ── L22202 數據儲存與管理 ──
  {
    id: "senior-bigdata-practice-q215",
    subjectId: "senior-bigdata",
    prompt:
      "銀行以資料倉儲支援 BI 報表，另以資料湖保存原始交易日誌供機器學習使用，兩邊每天互相複製資料。結果同一個指標在報表與模型特徵中常出現不同數字，儲存成本也幾乎加倍。隨著 BI 與 AI 越來越需要共用資料，下列哪一種架構調整最合適？",
    choices: [
      { id: "A", text: "把所有資料都搬進資料倉儲，原始的非結構化日誌也一併轉成表格格式，統一改由倉儲集中管理" },
      { id: "B", text: "廢除資料倉儲，讓 BI 報表直接讀取資料湖中的原始檔案，從此只需要維護一份資料即可" },
      { id: "C", text: "增加兩邊之間的同步排程頻率，從每天一次改成每小時一次，讓兩邊的數字更快趨於一致" },
      { id: "D", text: "改採湖倉架構，以開放表格式在物件儲存上提供交易與結構，讓 BI 與 ML 讀同一份資料" },
    ],
    answer: "D",
    explanation:
      "問題的根源是同一份資料存了兩份。湖倉架構以 Iceberg、Delta Lake 這類開放表格式，在便宜的物件儲存上補上資料倉儲的能力——ACID 交易、結構定義與版本回溯，讓 BI 報表與機器學習讀寫同一份資料，數字自然一致，也省下重複儲存的成本。",
    choiceExplanations: {
      A: "資料倉儲擅長結構化資料，把大量原始日誌硬轉成表格既昂貴又會丟失原始資訊，機器學習需要的原始細節也可能因此消失。",
      B: "只留一份資料的方向對，但原始檔案缺乏交易保證與結構定義，BI 直接讀取會遇到讀到寫一半的資料、欄位不一致等問題。",
      C: "同步得更頻繁只能縮短不一致的時間，兩份資料、兩套轉換邏輯的根本問題仍在，儲存成本也沒有下降。",
    },
    topic: "L22202 數據儲存與管理",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Architecture",
      concepts: ["湖倉", "開放表格式", "資料倉儲", "資料湖"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Partial Truth",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若組織只有結構化的報表需求、沒有機器學習或非結構化資料，傳統資料倉儲就足夠，導入湖倉只會增加複雜度。",
    },
  },
  // ── L22203 數據處理技術與工具 ──
  {
    id: "senior-bigdata-practice-q216",
    subjectId: "senior-bigdata",
    prompt:
      "銀行的客服 RAG 系統每天半夜整批重新載入產品費率文件。某天中午費率調整後，AI 客服直到隔天都還在回答舊費率。若費率調整越來越頻繁，下列哪一種改善最合適？",
    choices: [
      { id: "A", text: "在系統提示中加註「費率可能已有變動，請以官網為準」，提醒客戶自行再確認一次" },
      { id: "B", text: "改為每小時把整個向量索引全部重建一次，讓知識庫的內容最多只會落後一個小時左右" },
      { id: "C", text: "在來源文件異動時以事件或 CDC 觸發，只針對變動的文件重新切塊、嵌入並更新索引" },
      { id: "D", text: "改用參數更大的語言模型，讓它能夠記住最新的產品費率，不必再依賴知識庫的內容" },
    ],
    answer: "C",
    explanation:
      "問題在於知識庫的更新時機與資料變動脫節。改成由來源異動觸發（CDC 或事件通知），只針對變動的文件重新切塊、嵌入並更新索引，費率一改，幾分鐘內知識庫就跟上，也不必為了少數幾份文件重建整個索引。",
    choiceExplanations: {
      B: "每小時全量重建能縮短落後時間，但絕大多數文件根本沒變，卻每次都重算嵌入，成本高；而且仍可能落後近一小時。",
      A: "加註提醒能降低客訴風險，但 AI 回答的仍是錯的費率，等於把查證的負擔丟回客戶，沒有解決資料過時的問題。",
      D: "模型記住的是訓練當時的資料，不可能知道今天中午才調整的費率；即時資訊本來就該由知識庫提供。",
    },
    topic: "L22203 數據處理技術與工具",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["CDC", "增量更新", "RAG 資料新鮮度"],
      constraints: ["freshness", "cost"],
      distractorTypes: {
        B: "Wrong Trade-off",
        A: "Partial Truth",
        D: "Layer Confusion",
      },
      crossNode: "L22403",
      decisionBoundary:
        "若文件一年只改幾次、答錯的代價又低，每日批次更新就足夠；事件觸發與 CDC 的維運成本，只有在資料變動頻繁且時效性重要時才划算。",
    },
  },
  // ── L22302 常見的大數據分析方法：資料代理 ──
  {
    id: "senior-bigdata-practice-q217",
    subjectId: "senior-bigdata",
    prompt:
      "隨著自然語言查詢資料的工具普及，預期業務人員會越來越常直接用口語向資料庫要數字。某工廠試用後發現，三位業務主管問「上一季的營收是多少」，竟得到三個不同的數字，而且每次產生的 SQL 語法都正確。最根本的改善是什麼？",
    choices: [
      { id: "A", text: "換用 SQL 生成準確率更高的語言模型，讓工具在理解提問時不會再產生不同的查詢" },
      { id: "B", text: "建立語意層集中定義營收等指標的算法與資料表關聯，讓查詢工具依照定義產生查詢" },
      { id: "C", text: "禁止業務主管自行查詢，所有數字一律改由資料團隊人工撰寫 SQL 之後再回覆" },
      { id: "D", text: "要求業務主管在提問時把條件描述得更完整，例如寫明是否含稅、是否扣除退貨" },
    ],
    answer: "B",
    explanation:
      "三個 SQL 都語法正確卻算出不同數字，代表問題不在語法，而在「營收」沒有統一的定義——含不含稅、退貨扣不扣、以出貨日還是開票日認列。語意層把這些業務定義與資料表關聯集中管理，查詢工具依照同一套定義產生 SQL，誰來問都會得到同一個數字。",
    choiceExplanations: {
      A: "模型再準，面對沒有定義的「營收」也只能猜；不同的猜法都可能語法正確，問題出在業務定義，不在生成能力。",
      C: "回到人工可以確保一致，但放棄了自助查詢的效益；而且資料團隊內部若沒有統一定義，同樣會算出不同數字。",
      D: "描述得更完整能減少歧義，但要求每個人每次都記得寫齊所有條件並不實際，定義仍散落在每個人的腦中。",
    },
    topic: "L22302 常見的大數據分析方法",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料代理", "Text-to-SQL", "語意層", "指標定義"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Wrong Trade-off",
        D: "Partial Truth",
      },
      crossNode: "L22202",
      decisionBoundary:
        "若三個數字的差異來自 SQL 錯誤（例如漏了 JOIN 條件、日期範圍算錯）而非定義不同，改進生成模型並加上查詢驗證才是重點。",
    },
  },

  // ── L22401 大數據與機器學習 ──
  {
    id: "senior-bigdata-practice-q218",
    subjectId: "senior-bigdata",
    prompt:
      "隨著網路上 AI 生成的內容越來越多，預期從公開來源蒐集的訓練資料會混入大量模型產出。某團隊每一代模型都以上一代模型生成的病歷摘要再訓練，幾代之後摘要變得越來越制式，罕見疾病的描述也幾乎消失。最可能的原因與對策是什麼？",
    choices: [
      { id: "A", text: "模型對訓練資料過度擬合，應加強正規化、減少訓練輪數，讓模型的輸出恢復多樣性" },
      { id: "B", text: "罕見疾病本來就樣本稀少，描述逐漸消失屬於正常的收斂現象，不需要特別處理" },
      { id: "C", text: "反覆以生成資料訓練讓分布尾端流失，應持續加入真實資料並標記每筆資料的來源" },
      { id: "D", text: "生成摘要時的溫度設得太高，讓輸出過於發散，應調低溫度讓模型的輸出更加穩定" },
    ],
    answer: "C",
    explanation:
      "這是模型崩潰（Model Collapse）：每一代模型都只學到上一代輸出中最常見的樣子，分布尾端的罕見內容一代比一代少，輸出越來越單調。對策是確保訓練資料始終以真實資料為主體並持續補充，標記每筆資料是真實還是生成的，以便控制生成資料的比例，並用真實資料驗證每一代模型。",
    choiceExplanations: {
      A: "過度擬合是對特定訓練資料記得太牢；這裡的問題是資料本身一代代失去多樣性，正規化救不回已經不在資料裡的罕見樣本。",
      B: "罕見疾病的描述對醫療用途最關鍵，視為正常而不處理，等於讓模型在最需要的地方失效。",
      D: "溫度過高會讓輸出更發散、更多樣，與「越來越制式」的症狀相反；調低溫度只會讓輸出更單調。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["模型崩潰", "合成資料", "資料來源標記"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Wrong Trade-off",
        D: "Terminology Swap",
      },
      crossNode: "L22403",
      decisionBoundary:
        "若生成資料只用來補足少數類別、且每一代都以真實資料為主體並經真實資料驗證，合成資料反而能改善罕見類別的表現。",
    },
  },
  {
    id: "senior-bigdata-practice-q219",
    subjectId: "senior-bigdata",
    prompt:
      "農業單位的病蟲害辨識模型，會定期以農友上傳的照片再訓練。某次更新之後，只要照片角落出現某種特定貼紙，模型就一律判定為健康植株。最合適的處理方式是什麼？",
    choices: [
      { id: "A", text: "對新進資料做來源驗證與異常檢查，以資料版本回溯並移除可疑樣本，再以乾淨驗證集比對" },
      { id: "B", text: "模型的容量不足以分辨複雜的畫面，應改用參數更多的模型重新訓練，以提升整體辨識能力" },
      { id: "C", text: "農友上傳的照片解析度不一，應在前處理時統一縮放與裁切，讓模型的輸入格式更加一致" },
      { id: "D", text: "立即停止所有的再訓練流程，往後永久使用最初版本的模型，避免再受到新資料的任何影響" },
    ],
    answer: "A",
    explanation:
      "「出現特定圖樣就輸出特定結果」是資料投毒植入後門的典型症狀：有人在上傳的照片中加入貼紙並標成健康，模型學到了這個捷徑。處理方式是回溯資料版本，找出並移除可疑樣本後重新訓練；日後對新進資料做來源驗證與異常檢查，並以固定的乾淨驗證集比對每次更新，確認行為沒有異常改變。",
    choiceExplanations: {
      B: "模型不是看不懂畫面，而是學到了「貼紙＝健康」這個被刻意塞進來的規則；模型越大，越能精準記住這種捷徑。",
      C: "統一前處理能改善品質，但貼紙仍在照片裡，被污染的標註也還在，後門不會因此消失。",
      D: "停止再訓練能避免再被污染，但模型也從此無法學到新的病蟲害；應該加上資料把關，而不是放棄持續學習。",
    },
    topic: "L22401 大數據與機器學習",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Troubleshooting",
      concepts: ["資料投毒", "後門攻擊", "資料版本控管"],
      distractorTypes: {
        B: "Layer Confusion",
        C: "Partial Truth",
        D: "Wrong Trade-off",
      },
      crossNode: "L22404",
      decisionBoundary:
        "若錯誤是隨機分布、與任何特定圖樣無關，且新照片的拍攝條件或季節明顯改變，就比較可能是資料漂移而不是投毒，處理重點轉為補充新條件下的資料。",
    },
  },

  // ── L22402 大數據在鑑別式 AI 中的應用 ──
  {
    id: "senior-bigdata-practice-q220",
    subjectId: "senior-bigdata",
    prompt:
      "隨著 AI 代理代替使用者操作網站與 App，預期經過客戶授權的自動化流量會大幅增加。銀行過去的詐欺偵測模型，把「操作是否來自自動化程式」當成最重要的特徵之一。面對這個趨勢，模型最應該如何調整？",
    choices: [
      { id: "A", text: "全面封鎖所有自動化流量，只放行確認由真人操作的交易，維持原本的偵測準確率" },
      { id: "B", text: "調降模型的警示門檻，讓更多交易可以順利通過，以減少誤擋客戶造成的客訴數量" },
      { id: "C", text: "以去年的交易資料重新訓練模型，讓模型重新學習客戶的行為模式，就能適應新的流量" },
      { id: "D", text: "改以交易是否符合授權範圍與客戶歷史模式來判斷，並把代理身分納入特徵之中" },
    ],
    answer: "D",
    explanation:
      "當合法的代理流量成為常態，「是不是機器在操作」就不再能區分詐欺與正常交易，繼續倚重這個特徵會誤擋大量客戶。判斷依據應轉向「有沒有被授權、行為合不合理」：交易是否在客戶授權給代理的範圍內、是否符合客戶的歷史模式，並把代理的身分當成特徵，讓模型區分授權代理與可疑程式。",
    choiceExplanations: {
      A: "全面封鎖會把越來越多正常客戶擋在門外，客戶也可能改為私下把帳密交給代理，反而更難管理。",
      B: "降低門檻減少了誤擋，卻也讓真正的詐欺更容易通過；問題在特徵失效，不是門檻設得太嚴。",
      C: "去年的資料裡幾乎沒有授權代理的流量，用舊資料重新訓練學不到新的行為模式，這正是概念漂移的情境。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "難",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["詐欺偵測", "概念漂移", "特徵設計", "AI 代理"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Overgeneralization",
        C: "Partial Truth",
      },
      crossNode: "L22401",
      decisionBoundary:
        "若代理流量仍只占極小比例、且大多來自未經授權的爬蟲，沿用「自動化即可疑」的規則仍可接受；合法代理成為常態後，判斷依據就必須從「是不是機器」轉向「有沒有被授權」。",
    },
  },
  {
    id: "senior-bigdata-practice-q221",
    subjectId: "senior-bigdata",
    prompt:
      "銀行以語音深偽偵測模型過濾冒充客戶的來電，評估集上的準確率達 99%。上線半年後，漏掉的偽造語音越來越多；分析發現，這些語音多由評估集中從未出現過的新型語音生成工具產生。下列哪一項改善最合適？",
    choices: [
      { id: "A", text: "準確率已達 99%，代表模型已經足夠可靠，漏掉的少數案例屬於可接受範圍，不必調整" },
      { id: "B", text: "持續蒐集新生成工具的樣本更新訓練集，並以未見過的工具切分評估集來衡量泛化能力" },
      { id: "C", text: "增加既有生成工具的訓練樣本數量，讓模型把已知的偽造語音特徵學得更加紮實、更全面" },
      { id: "D", text: "改用規則比對已知的詐騙電話號碼黑名單，取代深偽偵測模型，以降低漏判所造成的損失" },
    ],
    answer: "B",
    explanation:
      "99% 是在「看過的生成工具」上量到的，它無法反映模型面對新工具時的表現——評估集與實際威脅的分布已經脫節。改善要從資料下手：持續蒐集新生成工具的樣本補進訓練集，並把評估集改成以「訓練時沒見過的生成工具」來切分，量出的才是模型面對未知工具的泛化能力。",
    choiceExplanations: {
      A: "高準確率只代表在評估集上表現好；評估集沒有涵蓋新工具，99% 正好掩蓋了真正的弱點。",
      C: "多學已知工具的特徵，只會讓模型更擅長辨識舊的偽造方式，對沒見過的新工具幫助有限。",
      D: "黑名單對重複使用的號碼有效，但詐騙者可以輕易更換號碼，而且它完全無法判斷聲音本身是不是偽造的。",
    },
    topic: "L22402 大數據在鑑別式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["深偽偵測", "泛化能力", "評估集設計"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Partial Truth",
        D: "Correct in Different Context",
      },
      crossNode: "L22201",
      decisionBoundary:
        "若攻擊者使用的生成工具長期固定（例如封閉環境中已知的語音合成器），以既有樣本訓練的模型就能穩定使用；生成技術變化越快，評估集越需要以「未見過的生成工具」來切分。",
    },
  },

  // ── L22403 大數據在生成式 AI 中的應用 ──
  {
    id: "senior-bigdata-practice-q222",
    subjectId: "senior-bigdata",
    prompt:
      "大學的校務問答 RAG 系統把查詢端的嵌入模型升級為新版，文件庫則沿用先前以舊模型產生的向量索引。升級後檢索結果的相關性大幅下降，常找出完全無關的文件。最可能的原因與處理方式是什麼？",
    choices: [
      { id: "A", text: "新舊嵌入模型的向量空間不同，查詢與文件必須用同一模型，應以新模型整批重建索引" },
      { id: "B", text: "新模型的向量維度比較高，只要把每次檢索的 top-k 筆數調大，就能找回相關的文件" },
      { id: "C", text: "向量資料庫的查詢效能不足，應更換成檢索速度更快的向量資料庫產品，以提升準確度" },
      { id: "D", text: "新版嵌入模型的品質比舊版差，應立即退回舊模型，並停止後續所有的模型升級計畫" },
    ],
    answer: "A",
    explanation:
      "不同嵌入模型會把文字映射到不同的向量空間，同一句話在兩個模型中的向量毫無對應關係。查詢用新模型、文件用舊模型，等於拿兩把不同的尺比較距離，相似度計算失去意義。處理方式是以新模型重新嵌入全部文件、重建索引，讓查詢與文件處在同一個空間。",
    choiceExplanations: {
      B: "兩邊的向量根本不在同一個空間，多取幾筆只是多拿幾筆無關的結果；維度不同時，有些系統甚至無法直接比較。",
      C: "查詢速度與相關性是兩回事；換成更快的資料庫，比較的仍是不相容的向量，結果一樣不準。",
      D: "還沒在相同條件下比較過，就斷定新模型較差並不公平；重建索引後若評估結果確實較差，才需要退回。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["嵌入模型", "向量空間", "重建索引"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Layer Confusion",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "只有當新舊模型官方保證向量空間相容（例如同一模型的小幅更新且明確聲明相容）時，才可以只換查詢端；一般情況下更換嵌入模型都必須整批重建索引。",
    },
  },
  {
    id: "senior-bigdata-practice-q223",
    subjectId: "senior-bigdata",
    prompt:
      "證券公司把內部文件全部建成 RAG 知識庫供員工查詢。一位新進助理詢問請假規定時，回答中竟引用了人資部門的薪資調整簽呈內容。下列哪一項改善最根本？",
    choices: [
      { id: "A", text: "在系統提示中要求模型不得回答任何與薪資有關的問題，並於回答前先檢查是否涉及薪資" },
      { id: "B", text: "把人資部門的文件切成更小的片段，降低單一片段被檢索出來時所洩漏的內容與資訊量" },
      { id: "C", text: "改用關鍵字搜尋取代向量搜尋，避免語意相近但內容不相關的機密文件被一併檢索出來" },
      { id: "D", text: "入庫時為每個片段附上權限標籤，檢索時依提問者的權限先過濾，再進行相似度排序" },
    ],
    answer: "D",
    explanation:
      "根本問題是知識庫把所有文件混在一起，檢索時不分提問者是誰。權限應該在資料層處理：入庫時為每個片段標上可閱讀的部門或角色，檢索時先依提問者的權限過濾，對方無權閱讀的片段根本不會進入候選，模型也就不可能引用。",
    choiceExplanations: {
      A: "提示詞只能擋住一部分情況，機密文件仍會被檢索出來交給模型；而且需要保護的不只薪資，逐一列舉也列不完。",
      B: "片段變小只是每次洩漏得少一點，無權閱讀的內容仍然會被檢索出來，問題沒有解決。",
      C: "換成關鍵字搜尋改變的是相似度的算法，只要查詢詞出現在機密文件中，一樣會被找出來；權限問題與檢索方式無關。",
    },
    topic: "L22403 大數據在生成式 AI 中的應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["RAG 權限控管", "中繼資料過濾", "資料分級"],
      constraints: ["access_control", "data_leakage"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        C: "Layer Confusion",
      },
      crossNode: "L22404",
      decisionBoundary:
        "若知識庫只收錄全公司都能閱讀的公開文件，就不需要逐片段的權限過濾；權限中繼資料的必要性，取決於文件的敏感度是否不同。",
    },
  },
  // ── L22404 大數據隱私保護、安全與合規 ──
  {
    id: "senior-bigdata-practice-q224",
    subjectId: "senior-bigdata",
    prompt:
      "預期越來越多企業會讓 AI 代理同時存取文件庫與資料庫，並能自動寄送分析報告。為了降低代理被誘導而外洩機密資料的風險，資料治理上最應該優先建立的是什麼？",
    choices: [
      { id: "A", text: "將所有資料都改為加密儲存，確保儲存媒體即使遭竊，資料也不會被外人直接讀取" },
      { id: "B", text: "資料分級並依等級限制代理可讀取的範圍，在輸出與對外傳送端檢查是否含敏感資料" },
      { id: "C", text: "要求代理服務的供應商簽署保密協議，萬一發生資料外洩，由供應商負擔賠償責任" },
      { id: "D", text: "只允許代理在上班時間運作，下班後自動停用，讓所有操作都在有人監看的時段進行" },
    ],
    answer: "B",
    explanation:
      "代理外洩資料需要兩個條件：讀得到機密資料，以及送得出去。資料分級後，依等級限制代理能讀取的範圍，從源頭減少它接觸得到的機密；在輸出與對外傳送端做敏感資料檢查（DLP），即使代理被誘導，也很難把機密內容送出去。兩道防線分別對應這兩個條件。",
    choiceExplanations: {
      A: "加密保護的是靜態儲存被竊取的情境；代理以合法身分讀取時資料會被解密，外洩照樣發生。",
      C: "保密協議是把損失轉移給供應商的契約安排，資料一旦外洩就無法收回，也阻止不了外洩本身。",
      D: "限制運作時段無法區分正常與被誘導的操作，上班時間照樣可能外洩；有人在線也不代表有人逐筆監看。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["資料分級", "DLP", "AI 代理", "資料外洩防護"],
      constraints: ["data_leakage", "agent_access"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Correct in Different Context",
        D: "Overgeneralization",
      },
      crossNode: "L22202",
      decisionBoundary:
        "若代理只能存取已公開的資料、也沒有任何對外傳送的能力，資料分級與輸出檢查的優先度就可以降低；控制強度應隨代理接觸的資料敏感度與可執行的動作而增加。",
    },
  },
  {
    id: "senior-bigdata-practice-q225",
    subjectId: "senior-bigdata",
    prompt:
      "數家醫院想共同訓練一個罕見疾病的預測模型，但依法規與合約，病歷原始資料不得離開各醫院。下列哪一種做法最合適？",
    choices: [
      { id: "A", text: "以聯邦學習讓資料留在各院、只交換模型更新，並搭配差分隱私或安全聚合降低風險" },
      { id: "B", text: "先把各院的病歷去識別化，再集中到同一個資料中心，由單一團隊統一進行模型的訓練" },
      { id: "C", text: "把所有病歷以同態加密後集中運算，在完全不解密的情況下完成整個模型的訓練流程" },
      { id: "D", text: "各院只交換彙整後的統計摘要表，再由其中一家醫院依摘要表重建資料並訓練模型" },
    ],
    answer: "A",
    explanation:
      "限制條件是原始資料不能離開各院，聯邦學習正是為此設計：各院在本地訓練，只把模型參數的更新送出彙整，原始病歷始終留在院內。由於模型更新仍可能被反推出部分資訊，實務上會再搭配差分隱私（在更新中加入雜訊）或安全聚合（彙整端看不到個別醫院的更新）來補強。",
    choiceExplanations: {
      B: "去識別後集中，在法規允許時是常見做法，但這題的條件是原始資料不得離院，集中本身就違反了限制。",
      C: "同態加密理論上可行，但在加密狀態下訓練模型的運算成本極高，以目前的技術難以用於實際規模的模型訓練。",
      D: "統計摘要表丟失了個別病患的特徵組合，罕見疾病的關鍵訊號正藏在這些細節中，從摘要重建的資料訓練不出有用的模型。",
    },
    topic: "L22404 大數據隱私保護、安全與合規",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["聯邦學習", "差分隱私", "安全聚合", "隱私強化技術"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Partial Truth",
        D: "Neighbor Concept",
      },
      crossNode: "L22401",
      decisionBoundary:
        "若法規與合約允許去識別後的資料集中，且各院的資料格式差異很大，集中式訓練反而比較容易做好資料品質；聯邦學習的價值在於原始資料「不能離開」的情境。",
    },
  },
];
