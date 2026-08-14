import type { Question } from "../types";

export const generated: Question[] = [
  {
    id: "junior-genai-gen-q001",
    subjectId: "junior-genai",
    prompt:
      "在使用大型語言模型處理企業內部問答時，為了讓回答能引用最新且特定的內部文件、降低幻覺（Hallucination），下列哪一種做法最直接有效？",
    choices: [
      { id: "A", text: "提高生成溫度（temperature）以增加回答多樣性" },
      { id: "B", text: "將所有內部文件貼進系統提示詞，每次都完整輸入" },
      { id: "C", text: "導入檢索增強生成（RAG），先檢索相關文件再據以生成回答" },
      { id: "D", text: "改用參數更少的模型以加快回應速度" },
    ],
    answer: "C",
    explanation:
      "要讓回答引用最新且特定的內部文件並降低幻覺，最直接的是檢索增強生成（RAG，C）：先以使用者問題檢索相關文件，再讓模型據檢索內容生成。提高溫度（A）反而增加不確定性；把全部文件塞進提示詞（B）受上下文長度限制且成本高、不可擴充；換更小模型（D）與正確性無關。",
    choiceExplanations: {
      A: "溫度調的是取樣的隨機性；題幹要的是讓回答引用最新且特定的內部文件，把輸出變得更發散並不會讓模型多拿到任何一份它原本沒有的文件。",
      B: "企業內部文件的總量通常遠超過模型的上下文長度，而且每次呼叫都完整輸入等於每一題都付全量成本；檢索的用意正是每次只帶進與問題相關的那幾份。",
      D: "換成參數更少的模型改變的是速度與成本，模型手上仍然沒有那些內部文件可依循，題幹關心的正確性與幻覺問題並未被處理。",
    },
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q002",
    subjectId: "junior-genai",
    prompt:
      "關於 No code / Low code 開發平台的「基本概念」，下列敘述何者最為正確？",
    choices: [
      { id: "A", text: "透過視覺化拖拉與設定，讓使用者以較少或免寫程式碼即可建構應用" },
      { id: "B", text: "必須完全以組合語言撰寫，才能達到最佳效能" },
      { id: "C", text: "僅能用於設計簡報與文件，無法產生可執行的應用" },
      { id: "D", text: "本質上就是把程式碼隱藏起來，但仍要求使用者精通後端架構" },
    ],
    answer: "A",
    explanation:
      "No code / Low code 的核心是以視覺化拖拉、表單設定等方式，讓使用者用較少或免寫程式碼即可建構可執行應用（A）。它與組合語言無關（B），可產出實際應用而非僅文件（C），且設計目的正是降低對底層後端架構的精通需求（D）。",
    choiceExplanations: {
      B: "組合語言是最貼近硬體的低階語言，與「較少或免寫程式碼」的訴求正好相反；這類平台追求的是開發效率而非極致效能。",
      C: "這類平台產出的是可實際運作的應用，例如表單、簽核流程與資料存取，而非僅止於簡報與文件的文書產出。",
      D: "把程式碼藏起來卻仍要求精通後端架構，等於門檻沒有降低；平台的設計目的正是讓不具後端專業的人也能建構應用。",
    },
    topic: "No code / Low code 概念",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q003",
    subjectId: "junior-genai",
    prompt:
      "企業在導入生成式 AI 解決方案前進行成本效益分析時，下列哪一項較屬於應一併納入評估的「持續性營運成本」？",
    choices: [
      { id: "A", text: "一次性的概念驗證（PoC）會議室租借費用" },
      { id: "B", text: "辦公家具的固定資產折舊" },
      { id: "C", text: "公司商標的一次性註冊規費" },
      { id: "D", text: "模型推論（Inference）的 API 呼叫量與雲端運算費用" },
    ],
    answer: "D",
    explanation:
      "生成式 AI 上線後會隨使用量持續產生模型推論的 API 呼叫與雲端運算費用，屬於應納入的持續性營運成本（D）。會議室租借（A）與商標註冊（C）為一次性且與 AI 運作無直接關聯；辦公家具的固定資產折舊（B）並非 AI 解決方案的營運成本項目。",
    choiceExplanations: {
      A: "題幹要的是「持續性」營運成本，而概念驗證的會議室租借是一次性支出，專案結束後就不再發生。",
      B: "折舊確實會逐期認列，這點與「持續」相符，但它是一般行政的固定資產費用，不隨 AI 方案的使用量增減，也不會因停用該方案而消失，因此不是這個方案的營運成本項目。",
      C: "商標註冊規費是一次性支出，且屬於品牌與法務事項，與生成式 AI 方案是否運作沒有關聯。",
    },
    topic: "生成式 AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q004",
    subjectId: "junior-genai",
    prompt:
      "行銷團隊想以文字描述快速產生多張概念性的視覺主視覺草圖，下列何者屬於最適合的生成式 AI 工具類型？",
    choices: [
      { id: "A", text: "以 Midjourney 等文字轉圖像（Text-to-Image）工具生成圖像" },
      { id: "B", text: "以試算表的樞紐分析表彙整數據" },
      { id: "C", text: "以版本控制系統管理程式碼分支" },
      { id: "D", text: "以關聯式資料庫建立正規化資料表" },
    ],
    answer: "A",
    explanation:
      "由文字描述快速產生多張視覺草圖，最適合的是 Midjourney 等文字轉圖像（Text-to-Image）工具（A）。樞紐分析表（B）用於數據彙整、版本控制（C）用於程式碼管理、關聯式資料庫（D）用於結構化資料儲存，皆非影像生成用途。",
    choiceExplanations: {
      B: "樞紐分析處理的是既有數值資料的彙整，產出表格與統計摘要，無法從文字描述生出題幹要的視覺草圖。",
      C: "版本控制管理的是程式碼的變更歷程與分支合併，屬開發協作工具，與由文字生成圖像不相干。",
      D: "正規化資料表解決的是資料儲存與一致性問題，資料庫本身不具備依描述產生圖像的能力。",
    },
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q005",
    subjectId: "junior-genai",
    prompt:
      "在 No code / Low code 平台中，常以「資料模型（Data Model）／應用模型」作為應用的抽象核心，其主要意義為下列何者？",
    choices: [
      { id: "A", text: "指深度學習中訓練後的神經網路權重檔" },
      { id: "B", text: "專指實體機房中的伺服器硬體配置" },
      { id: "C", text: "指最終使用者操作介面的色彩配置" },
      { id: "D", text: "以結構化方式描述資料欄位、關聯、流程與規則，作為平台組裝應用的抽象藍圖" },
    ],
    answer: "D",
    explanation:
      "在 No code / Low code 平台中，「資料模型／應用模型」是以結構化方式描述資料欄位、關聯、流程與規則的抽象藍圖，讓平台據以組裝應用（D）。此處的「模型」是低程式碼平台層面的概念，並非機器學習中訓練後的神經網路權重（A），也不是伺服器硬體（B）或介面色彩配置（C）。",
    choiceExplanations: {
      A: "訓練後的神經網路權重是機器學習脈絡下的「模型」；題幹問的是 No code / Low code 平台用來組裝應用的模型概念，兩者只是共用同一個詞。",
      B: "伺服器硬體配置屬於部署與基礎設施層面，描述的是應用跑在哪裡，而非題幹所指描述欄位、關聯與規則的抽象藍圖。",
      C: "色彩配置屬於介面呈現層的樣式設定，與應用背後的資料結構與流程規則分屬不同層次。",
    },
    topic: "No code / Low code 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q006",
    subjectId: "junior-genai",
    prompt:
      "依歐盟人工智慧法（EU AI Act）的風險分級概念，下列哪一類應用最可能被歸為「不可接受風險（Unacceptable Risk）」而原則禁止？",
    choices: [
      { id: "A", text: "電子郵件的垃圾信件過濾" },
      { id: "B", text: "客服中心的常見問答自動回覆" },
      { id: "C", text: "由政府對國民進行普遍性社會評分（social scoring）" },
      { id: "D", text: "電商網站的商品推薦" },
    ],
    answer: "C",
    explanation:
      "EU AI Act 將由政府對國民進行普遍性社會評分等危及基本權利的應用列為不可接受風險、原則禁止（C）。垃圾信過濾（A）、客服自動回覆（B）與商品推薦（D）一般屬於低風險或有限風險應用，並非禁止類別。",
    choiceExplanations: {
      A: "垃圾信件過濾對個人權利的影響有限，一般被歸為低風險應用，並未落入原則禁止的類別。",
      B: "客服自動回覆屬與人互動的應用，重點在讓使用者知道自己正在與 AI 對話等透明度義務，而非禁止使用。",
      D: "商品推薦影響的是購物選擇，屬商業性的低風險應用；被列為不可接受風險的是危及基本權利的用途。",
    },
    topic: "生成式 AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q007",
    subjectId: "junior-genai",
    prompt:
      "提示工程（Prompt Engineering）中常見的「角色扮演（Role Prompting）」設計，主要目的為下列何者？",
    choices: [
      { id: "A", text: "讓模型減少參數量以節省運算" },
      { id: "B", text: "藉由指定模型扮演的身分與情境，引導其產生更貼切、語氣一致的回答" },
      { id: "C", text: "強制模型只能輸出數字" },
      { id: "D", text: "使模型完全不需要任何輸入即可運作" },
    ],
    answer: "B",
    explanation:
      "角色扮演提示是在提示詞中指定模型扮演的身分與情境（如「你是一位資安顧問」），以引導其產生更貼切、語氣一致的回答（B）。它不改變模型參數量（A）、不限定只輸出數字（C），也不會讓模型免除輸入（D）。",
    choiceExplanations: {
      A: "提示詞只影響模型當次產生的內容，推論時模型的參數量是固定的，不會因為指定它扮演誰而變動。",
      C: "指定身分與情境是為了調整語氣與觀點，並未限制輸出的型態；要模型只給數字得另外下格式指令。",
      D: "角色設定本身就是輸入的一部分，模型仍需使用者提出問題才有可回應的對象。",
    },
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q008",
    subjectId: "junior-genai",
    prompt:
      "下列哪一個情境最「不」適合單純以 No code / Low code 平台完成，而較需要傳統程式開發或專業團隊介入？",
    choices: [
      { id: "A", text: "部門內部的請假申請表單與簽核流程" },
      { id: "B", text: "簡單的活動報名與名單彙整頁面" },
      { id: "C", text: "對效能與客製化演算法要求極高的大型即時交易系統核心" },
      { id: "D", text: "蒐集顧客回饋的問卷與儀表板" },
    ],
    answer: "C",
    explanation:
      "對效能與客製化演算法要求極高的大型即時交易系統核心，超出 No code / Low code 平台的抽象與彈性，較需傳統程式開發或專業團隊（C）。請假簽核（A）、活動報名（B）、問卷儀表板（D）皆為流程明確、客製需求有限的情境，正是 No code / Low code 的適用範圍。",
    choiceExplanations: {
      A: "請假申請與簽核是規則固定、流程明確的表單型應用，正是這類平台最典型的適用場景，不需要傳統開發介入。",
      B: "活動報名與名單彙整只涉及表單收集與簡單整理，客製需求有限，平台現成元件即可完成。",
      D: "問卷與儀表板多有現成的表單與圖表元件可用，沒有題幹所指的極端效能或演算法客製壓力。",
    },
    topic: "No code / Low code 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q009",
    subjectId: "junior-genai",
    prompt:
      "企業導入生成式 AI 客服時，員工可能將含個資的客戶對話貼入公有雲端模型。為控管資料安全與隱私風險，下列哪一項治理措施最為直接？",
    choices: [
      { id: "A", text: "提高模型的生成溫度以增加回答變化" },
      { id: "B", text: "訂定資料使用規範並對輸入內容進行個資去識別化或遮罩" },
      { id: "C", text: "要求所有員工背誦模型的訓練參數" },
      { id: "D", text: "鼓勵員工盡量輸入完整原始個資以提升準確度" },
    ],
    answer: "B",
    explanation:
      "針對個資外洩風險，最直接的治理是訂定資料使用規範，並對輸入內容做個資去識別化或遮罩（B）。提高溫度（A）與隱私無關；背誦訓練參數（C）無實質防護；鼓勵輸入完整原始個資（D）反而擴大風險。",
    choiceExplanations: {
      A: "溫度影響的是回答的變化程度；題幹擔心的是含個資的對話被貼進公有雲端模型，調整生成參數並不觸及資料是否被送出去。",
      C: "要求員工背誦模型參數不會改變任何一筆個資是否流出，對題幹的外洩風險沒有攔阻作用。",
      D: "鼓勵輸入完整原始個資正是題幹要防範的行為；即使回答可能更貼切，代價是把個資外洩面直接擴大。",
    },
    topic: "生成式 AI 導入評估規劃",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q010",
    subjectId: "junior-genai",
    prompt:
      "關於「AI Agent（智慧代理）」相較於單純一問一答的聊天機器人，下列敘述何者最能描述其特徵？",
    choices: [
      { id: "A", text: "只能回覆預先寫死的固定罐頭答案" },
      { id: "B", text: "完全不需任何語言模型即可運作" },
      { id: "C", text: "僅能處理圖片而無法處理文字" },
      { id: "D", text: "能依目標自主規劃步驟、呼叫工具並串接多步任務以達成結果" },
    ],
    answer: "D",
    explanation:
      "AI Agent 的特徵是能依設定目標自主規劃步驟、呼叫外部工具並串接多步任務以達成結果（D），而非僅單輪問答。罐頭答案（A）是傳統規則式機器人；Agent 通常以語言模型為核心（B）；其能力不限於圖片（C）。",
    choiceExplanations: {
      A: "只回覆寫死的固定答案是規則式機器人的作法，遇到腳本外的請求就無法處理，更談不上依目標自行規劃步驟。",
      B: "現今的 AI Agent 多以語言模型作為理解指令與決定下一步的核心，語言模型正是它能規劃並選用工具的基礎。",
      C: "Agent 的能力邊界取決於它可呼叫的模型與工具，實務上多以文字互動為主，並沒有只能處理圖片這種限制。",
    },
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q011",
    subjectId: "junior-genai",
    prompt:
      "「公民開發者（Citizen Developer）」一詞在 No code / Low code 的脈絡中，最貼切的定義為下列何者？",
    choices: [
      { id: "A", text: "具國家認證的資深系統架構師" },
      { id: "B", text: "非資訊本科、利用低程式碼平台自行建構應用以解決業務問題的業務人員" },
      { id: "C", text: "專責維護資料中心硬體的工程師" },
      { id: "D", text: "僅負責撰寫測試案例的品保人員" },
    ],
    answer: "B",
    explanation:
      "公民開發者指非資訊本科背景、運用 No code / Low code 平台自行建構應用以解決自身業務問題的業務人員（B）。資深架構師（A）、資料中心工程師（C）與品保人員（D）皆屬專業技術角色，並非此概念所指。",
    choiceExplanations: {
      A: "資深系統架構師本就具備專業開發能力，不必靠低程式碼平台才能建置系統；公民開發者一詞強調的正是非資訊背景這一點。",
      C: "維護資料中心硬體屬基礎設施職能，處理的是機房與設備，並非以平台建構業務應用的角色。",
      D: "撰寫測試案例是驗證既有系統品質的工作，與自行建構應用來解決自身業務問題不是同一件事。",
    },
    topic: "No code / Low code 概念",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q012",
    subjectId: "junior-genai",
    prompt:
      "為控管生成式 AI 產生不實內容（幻覺）所帶來的營運風險，下列哪一項屬於導入規劃時較合適的風險管理措施？",
    choices: [
      { id: "A", text: "對高風險輸出建立人工審查（human-in-the-loop）與事實查核機制" },
      { id: "B", text: "完全停用所有生成式 AI 工具" },
      { id: "C", text: "假設模型輸出永遠正確，不需任何查核" },
      { id: "D", text: "僅以提高回應速度作為唯一品質指標" },
    ],
    answer: "A",
    explanation:
      "面對幻覺風險，合適的做法是對高風險輸出導入人工審查（human-in-the-loop）與事實查核機制（A），在效益與風險間取得平衡。全面停用（B）放棄了效益而過度反應；假設輸出永遠正確（C）忽視風險；只看回應速度（D）未涵蓋正確性。",
    choiceExplanations: {
      B: "全面停用確實能讓幻覺風險歸零，但同時也放棄了導入生成式 AI 的全部效益；風險管理要的是把風險降到可接受，而非取消活動本身。",
      C: "假設輸出永遠正確等於不設任何控管，不實內容一旦流入正式流程，也沒有任何一道機制會察覺。",
      D: "回應速度是效率指標，測不出內容是否屬實；在幻覺風險下，只追求快反而讓不實內容擴散得更快。",
    },
    topic: "生成式 AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q013",
    subjectId: "junior-genai",
    prompt:
      "軟體開發團隊希望在撰寫程式時獲得即時的程式碼補全與建議，下列哪一項工具最為對應？",
    choices: [
      { id: "A", text: "GitHub Copilot 等 AI 程式輔助工具" },
      { id: "B", text: "影像去背工具" },
      { id: "C", text: "語音轉文字的會議記錄工具" },
      { id: "D", text: "簡報自動排版工具" },
    ],
    answer: "A",
    explanation:
      "提供即時程式碼補全與建議的代表性工具是 GitHub Copilot 等 AI 程式輔助工具（A）。影像去背（B）、語音轉文字（C）、簡報排版（D）分屬影像、聲音與文件處理領域，與程式開發輔助無關。",
    choiceExplanations: {
      B: "影像去背處理的是前景與背景分離，屬影像編輯領域，與題幹要的程式碼補全不相干。",
      C: "語音轉文字工具把會議語音整理成逐字稿，產出的是文字記錄而非可直接採用的程式碼建議。",
      D: "簡報自動排版處理的是版面與樣式配置，開發者在編輯器中撰寫程式的當下用不上。",
    },
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q014",
    subjectId: "junior-genai",
    prompt:
      "相較於傳統程式開發，No code / Low code 開發方式的主要「優勢」較不包含下列何者？",
    choices: [
      { id: "A", text: "縮短開發時程、加快交付" },
      { id: "B", text: "降低非技術人員的參與門檻" },
      { id: "C", text: "對需高度客製、極端效能的系統提供完整的底層程式控制" },
      { id: "D", text: "以視覺化方式提升流程可視性與協作" },
    ],
    answer: "C",
    explanation:
      "No code / Low code 的優勢在於縮短時程（A）、降低參與門檻（B）與提升流程可視性（D）；但其抽象化也限制了對底層的掌控，因此對需高度客製、極端效能的系統並不能提供「完整的底層程式控制」（C），這正是其限制而非優勢。",
    choiceExplanations: {
      A: "以現成元件組裝省去大量從零撰寫與整合的工作，交付確實更快——這是這類平台公認的優勢，因此不是題幹要挑出的例外。",
      B: "讓不具程式背景的業務人員也能自行建構應用，正是這類平台的核心訴求，同樣屬於優勢而非題幹要找的例外。",
      D: "流程以圖形化方式呈現，業務與資訊人員可以看著同一張流程圖討論，是它帶來的協作與可視性優勢。",
    },
    topic: "No code / Low code 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q015",
    subjectId: "junior-genai",
    prompt:
      "在評估是否導入某生成式 AI 解決方案時，下列哪一組指標最能反映「技術與效能」面向的評估？",
    choices: [
      { id: "A", text: "公司股利政策與董事會席次" },
      { id: "B", text: "回應延遲（latency）、輸出品質與在目標任務上的準確度" },
      { id: "C", text: "辦公室座位安排與空間坪數" },
      { id: "D", text: "員工年資與到職人數" },
    ],
    answer: "B",
    explanation:
      "技術與效能面向的評估應聚焦回應延遲、輸出品質與目標任務上的準確度等可量測指標（B）。股利政策（A）、辦公空間（C）與員工年資（D）屬財務、行政或人事面向，無法反映方案的技術效能。",
    choiceExplanations: {
      A: "股利政策與董事會席次屬公司治理與財務結構，量不出方案在目標任務上表現得如何。",
      C: "座位安排與空間坪數屬行政庶務，與回應延遲、輸出品質這類可量測的技術指標無關。",
      D: "員工年資與到職人數是人力資源指標，反映的是組織狀況，而非題幹要評估的技術與效能面向。",
    },
    topic: "生成式 AI 導入評估規劃",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q016",
    subjectId: "junior-genai",
    prompt:
      "在提示工程中，提供「少量示例（Few-shot examples）」給模型的主要作用為下列何者？",
    choices: [
      { id: "A", text: "重新訓練模型的底層權重" },
      { id: "B", text: "永久擴充模型的最大上下文長度" },
      { id: "C", text: "透過範例示範期望的輸入輸出格式與風格，引導模型仿效" },
      { id: "D", text: "讓模型自動連線到網際網路" },
    ],
    answer: "C",
    explanation:
      "Few-shot 是在提示詞中提供少量輸入輸出範例，讓模型仿效期望的格式與風格（C），屬於不更動權重的情境學習。它不會重新訓練權重（A）、不改變上下文長度上限（B），也不等同賦予模型上網能力（D）。",
    choiceExplanations: {
      A: "範例只放在提示詞裡，屬推論當下的情境學習，模型的底層權重全程不變；要動權重得走微調或重訓。",
      B: "上下文長度上限由模型架構與部署設定決定，放入範例只是佔用既有額度，反而讓可用空間變少。",
      D: "模型能否上網取決於系統有沒有給它檢索或工具權限，與提示中放不放範例是兩回事。",
    },
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q017",
    subjectId: "junior-genai",
    prompt:
      "關於 No code / Low code 應用的「可測試性（Testability）」，下列敘述何者較為正確？",
    choices: [
      { id: "A", text: "因為少寫程式碼，平台會自動保證正確，故不必再做功能測試" },
      { id: "B", text: "仍應針對流程邏輯、資料正確性與整合介面進行驗證與測試" },
      { id: "C", text: "只要平台供應商背書，使用者即可免除一切驗證責任" },
      { id: "D", text: "測試只需確認介面顏色是否符合品牌規範即可" },
    ],
    answer: "B",
    explanation:
      "即使少寫或不寫程式碼，No code / Low code 應用仍應對流程邏輯、資料正確性與整合介面進行驗證與測試（B）。認為平台會自動保證正確而免測（A）、認為可免除驗證責任（C）或只測顏色（D），都會忽略應用實際運作的正確性風險。",
    choiceExplanations: {
      A: "平台保證的是它提供的元件本身能運作，但流程怎麼串、規則怎麼設定仍由使用者決定，設錯了照樣會產生錯誤結果。",
      C: "供應商的責任範圍限於平台本身；應用的流程邏輯與資料正確性仍由建置與使用該應用的組織自行負責。",
      D: "介面顏色是視覺規範問題，測不出流程分支有沒有走對、資料有沒有寫錯，或介接外部系統時是否失敗。",
    },
    topic: "No code / Low code 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q018",
    subjectId: "junior-genai",
    prompt:
      "某企業欲導入生成式 AI 撰寫對外正式公告，發現模型偶有事實錯誤與用詞偏差。在導入策略上，下列哪一種「人機協作」定位最為穩健？",
    choices: [
      { id: "A", text: "由 AI 全自動發布，無需人工介入" },
      { id: "B", text: "完全棄用 AI，全程改回純手寫" },
      { id: "C", text: "讓 AI 與 AI 互相審核後直接發布" },
      { id: "D", text: "以 AI 產生草稿、由人員審核修訂後再對外發布" },
    ],
    answer: "D",
    explanation:
      "對外正式公告需兼顧效率與正確性，最穩健的是以 AI 產生草稿、由人員審核修訂後再發布（D），兼得生產力與把關。全自動發布（A）與 AI 互審後直接發布（C）放任幻覺與偏差風險；完全棄用（B）則犧牲了 AI 的效率效益。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q019",
    subjectId: "junior-genai",
    prompt:
      "團隊想將生成式 AI 整合進既有的客服系統，使對話流程能依需要呼叫公司內部 API 查詢訂單狀態。下列哪一種整合方式最為合適？",
    choices: [
      { id: "A", text: "透過工具呼叫（function/tool calling）讓模型在需要時觸發內部 API 取得資料" },
      { id: "B", text: "把所有訂單資料以截圖貼進提示詞" },
      { id: "C", text: "請客服人員逐筆口述訂單給模型" },
      { id: "D", text: "停用既有客服系統，全部以人工回覆" },
    ],
    answer: "A",
    explanation:
      "讓模型在需要時觸發內部 API 取得即時資料，最合適的是工具呼叫（function/tool calling）整合（A）。截圖貼入提示詞（B）無法即時且難維護；逐筆口述（C）不可規模化；停用系統改全人工（D）違背整合目的。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q020",
    subjectId: "junior-genai",
    prompt:
      "為避免公民開發者在 No code / Low code 平台上各自建置、造成資料權限與品質失控，下列哪一項屬於合適的「治理」作為？",
    choices: [
      { id: "A", text: "全面禁止任何業務人員使用平台" },
      { id: "B", text: "建立應用上架審核、權限分級與命名與資料使用規範" },
      { id: "C", text: "讓每位使用者自行決定資料存取權限且不留紀錄" },
      { id: "D", text: "要求所有應用一律改用組合語言重寫" },
    ],
    answer: "B",
    explanation:
      "對 No code / Low code 的治理應在賦能與控管間取得平衡，做法是建立上架審核、權限分級與命名與資料使用規範（B）。全面禁用（A）扼殺效益；放任自訂權限且不留紀錄（C）正是失控來源；改用組合語言（D）與治理無關。",
    topic: "No code / Low code 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q021",
    subjectId: "junior-genai",
    prompt:
      "在規劃生成式 AI 試辦（Pilot）專案時，下列哪一種「導入目標」設定最符合可評估、可驗收的良好實務？",
    choices: [
      { id: "A", text: "先在全公司所有部門全面導入，再回頭評估整體成效" },
      { id: "B", text: "盡量導入越多 AI 功能越好，不限定範圍" },
      { id: "C", text: "以採用最新、參數量最大的模型作為唯一成功標準" },
      { id: "D", text: "於三個月內讓客服首次回覆時間縮短並維持回覆品質達標，並以指標驗收" },
    ],
    answer: "D",
    explanation:
      "試辦專案的導入目標應聚焦特定範圍、具體可衡量、有時程與驗收指標，例如於三個月內縮短客服首次回覆時間並維持品質達標（D）。一開始就全公司全面導入再評估（A）違反試辦先小範圍驗證的精神；無範圍地堆功能（B）難以驗收；以採用最大模型為唯一標準（C）混淆了手段與可衡量的業務成果。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q022",
    subjectId: "junior-genai",
    prompt:
      "下列哪一項應用屬於生成式 AI 的「聲音（音訊）生成」領域？",
    choices: [
      { id: "A", text: "由文字稿合成語音旁白（Text-to-Speech）" },
      { id: "B", text: "將圖片中的物件去背" },
      { id: "C", text: "把表格資料做樞紐分析" },
      { id: "D", text: "為原始碼自動產生單元測試" },
    ],
    answer: "A",
    explanation:
      "由文字稿合成語音旁白（Text-to-Speech）屬於聲音（音訊）生成領域（A）。圖片去背（B）屬影像處理、樞紐分析（C）屬資料分析、產生單元測試（D）屬程式輔助，皆非音訊生成。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "易",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q023",
    subjectId: "junior-genai",
    prompt:
      "下列關於 No code 與 Low code 兩者差異的敘述，何者最為貼切？",
    choices: [
      { id: "A", text: "兩者完全相同，只是稱呼不同" },
      { id: "B", text: "No code 幾乎全靠視覺化設定、不需寫程式；Low code 仍允許以少量程式碼擴充客製" },
      { id: "C", text: "No code 一定比 Low code 能做更複雜的客製化" },
      { id: "D", text: "Low code 完全不需任何設定，只要按一個按鈕即可" },
    ],
    answer: "B",
    explanation:
      "No code 幾乎全靠視覺化設定、目標使用者免寫程式；Low code 則在視覺化基礎上仍允許以少量程式碼擴充客製，彈性通常較高（B）。兩者並非完全相同（A）；客製彈性多半是 Low code 較強而非 No code（C）；Low code 並非一鍵完成（D）。",
    topic: "No code / Low code 概念",
    difficulty: "中",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q024",
    subjectId: "junior-genai",
    prompt:
      "企業在選擇生成式 AI 解決方案時，於「自建開源模型」與「採用商用 API 服務」之間取捨，下列哪一項屬於應納入的關鍵評估構面？",
    choices: [
      { id: "A", text: "一律選擇自建開源模型，因為長期一定最省成本" },
      { id: "B", text: "綜合比較資料隱私可控性、總體成本、維運能力與客製需求" },
      { id: "C", text: "只看初期授權或訂閱費用最低者，即為最佳方案" },
      { id: "D", text: "完全依個人喜好，無須考量資料安全" },
    ],
    answer: "B",
    explanation:
      "自建開源模型與商用 API 的取捨，應綜合比較資料隱私可控性、總體成本、維運能力與客製需求等關鍵構面（B）。「自建一定最省成本」（A）忽略了自建所需的維運與人力總體成本，是過度概化；只看初期費用最低（C）忽略長期總體擁有成本與維運負擔；純憑個人喜好而忽略資料安全（D）都不是負責任的解決方案選擇評估。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "難",
    source: "generated",
  },
  {
    id: "junior-genai-gen-q025",
    subjectId: "junior-genai",
    prompt:
      "關於檢索增強生成（RAG），下列敘述何者最正確？",
    choices: [
      { id: "A", text: "只要導入 RAG，答案就保證完全正確，不會再有任何錯誤" },
      { id: "B", text: "RAG 不保證正確；若來源錯誤、檢索失敗或模型忽略證據仍會產生錯答，需同時評估檢索品質與答案品質" },
      { id: "C", text: "RAG 的重點是提高生成溫度，讓答案更有創意" },
      { id: "D", text: "RAG 會把全部文件永久寫進模型參數，因此不需要更新知識庫" },
    ],
    answer: "B",
    explanation:
      "RAG 在生成前先檢索外部資料再放入上下文，讓答案「有機會」基於可更新、可引用、具權限的知識，但不保證正確：若來源本身錯誤、檢索失敗、切塊破壞語義或模型忽略證據，仍會錯答，因此須同時評估 retrieval quality 與 answer quality（B）。它不保證零錯誤（A）；與提高溫度無關（C）；RAG 是「檢索後放入上下文」而非寫進參數，知識庫仍需維護更新（D 錯）。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §04 RAG",
  },
  {
    id: "junior-genai-gen-q026",
    subjectId: "junior-genai",
    prompt:
      "「Context Engineering（脈絡工程）」相較於「Prompt Engineering（提示工程）」，範圍更廣的原因最貼近下列何者？",
    choices: [
      { id: "A", text: "Context 只是把提示詞寫得更長更漂亮而已" },
      { id: "B", text: "Context Engineering 就是不斷提高模型溫度" },
      { id: "C", text: "Context 包含系統政策、使用者目標、對話狀態、文件、工具定義與結果、記憶與可用 token 預算，需持續決定保留、摘要、檢索或丟棄" },
      { id: "D", text: "兩者完全相同，只是名稱不同" },
    ],
    answer: "C",
    explanation:
      "Prompt 是指令文字；Context 則涵蓋系統政策、使用者目標、對話狀態、文件、工具定義與結果、記憶與可用 token 預算。Agent 做長任務時必須持續決定哪些資訊要保留、摘要、檢索或丟棄，因此範圍更廣（C）。它不是把提示寫更長（A）、也與調高溫度無關（B），更不等同於提示工程（D 錯）。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §04 Context Engineering",
  },
  {
    id: "junior-genai-gen-q027",
    subjectId: "junior-genai",
    prompt:
      "在設計一個「可控的 Agent 執行迴圈（Agent loop）」時，下列哪一項原則最為恰當？",
    choices: [
      { id: "A", text: "觀察工具的真實結果，不把「已發出請求」誤認為「任務完成」" },
      { id: "B", text: "為了效率，任何動作都不需要成功條件或停止條件" },
      { id: "C", text: "遇到高風險、低信心或權限不足時，仍應自行決定並執行，不需暫停" },
      { id: "D", text: "應一次給予最大權限，讓 Agent 想做什麼都可以" },
    ],
    answer: "A",
    explanation:
      "可控的 Agent loop 應：確認成功條件與不可做事項、依工具結果修正計畫、從最小權限工具集合選擇行動，並「觀察真實結果、不把發出請求誤認為任務完成」（A）；遇到高風險、低信心、權限不足或歧義時應暫停要求人工決定。因此 B（無成功/停止條件）、C（高風險仍自行執行）、D（給予最大權限）都違反最小權限與人工監督原則。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §05 Agent",
  },
  {
    id: "junior-genai-gen-q028",
    subjectId: "junior-genai",
    prompt:
      "某客服系統需要把不同責任域的請求，由一個 Agent 將控制權與狀態交給另一個 Agent 接手處理。這種多 Agent 型態最接近下列何者？",
    choices: [
      { id: "A", text: "固定 Workflow（步驟與分支由程式預先定義）" },
      { id: "B", text: "單一 Agent（同一個模型在迴圈中自行選工具）" },
      { id: "C", text: "平行多 Agent（多個 Agent 同時探索後再綜合）" },
      { id: "D", text: "Handoff 多 Agent（將控制權交給另一個 Agent）" },
    ],
    answer: "D",
    explanation:
      "把控制權與狀態從一個 Agent 轉交另一個 Agent 接手，屬 Handoff 多 Agent，常見於客服分流與不同責任域，風險是狀態遺失與責任模糊（D）。固定 Workflow 是程式預先定義步驟（A）；平行多 Agent 是同時探索再綜合（C）；單一 Agent 不涉及交接（B）。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §05 多 Agent",
  },
  {
    id: "junior-genai-gen-q029",
    subjectId: "junior-genai",
    prompt:
      "「提示注入（Prompt injection）」指網頁或文件中藏入指令，誘導 Agent 忽略原本政策。下列哪一項是較適當的防護原則？",
    choices: [
      { id: "A", text: "把外部檢索到的內容一律視為可信任的指令來執行" },
      { id: "B", text: "把外部內容視為「資料」而非指令，並搭配權限隔離、工具限制與高風險行動的人工核准" },
      { id: "C", text: "只要模型夠大，就不會受到提示注入影響，無須任何防護" },
      { id: "D", text: "把所有工具權限開到最大，才能快速完成任務" },
    ],
    answer: "B",
    explanation:
      "防護提示注入的關鍵是把外部（網頁、文件）內容視為「資料」而非可執行指令，並輔以權限隔離、工具限制與對高風險行動的人工核准（B）。將外部內容當指令執行（A）正是漏洞來源；模型再大也可能被注入（C 錯）；開到最大權限會放大過度代理權風險（D 錯）。",
    topic: "生成式 AI 應用領域與工具使用",
    difficulty: "難",
    source: "generated",
    sourceRef: "2025-2026補充講義 §07 安全",
  },
  {
    id: "junior-genai-gen-q030",
    subjectId: "junior-genai",
    prompt:
      "評估生成式 AI 系統時，講義強調要「從單一模型分數走向任務成功」。下列對評估層級的理解何者最正確？",
    choices: [
      { id: "A", text: "應分層評估：元件、答案、軌跡、任務、營運與影響，任務層看使用者目標是否真正完成" },
      { id: "B", text: "只要單一模型的準確率高，就代表整個任務一定成功完成" },
      { id: "C", text: "評估只需看答案文筆是否流暢即可" },
      { id: "D", text: "軌跡（步驟與工具使用）不重要，不需納入評估" },
    ],
    answer: "A",
    explanation:
      "現代評估應分層：元件（分類/檢索/生成/工具本身是否正確）、答案（正確性、groundedness、引用）、軌跡（步驟、工具、參數是否正確）、任務（使用者目標是否真正完成，例如不只建草稿而是完成預訂）、營運（延遲/成本/失敗率）與影響（公平、安全、業務成果）（A）。單一模型分數高不等於任務成功（B）；只看文筆（C）、忽略軌跡（D）都不足。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §08 評估",
  },
  {
    id: "junior-genai-gen-q031",
    subjectId: "junior-genai",
    prompt:
      "在 Agent 專用評估指標中，「Task success rate（任務成功率）」衡量的是下列何者？",
    choices: [
      { id: "A", text: "回覆讀起來是否通順、看似合理" },
      { id: "B", text: "使用了多少種不同的工具" },
      { id: "C", text: "模型回應的字數多寡" },
      { id: "D", text: "是否達成明確定義的成功條件，而非只產生看似合理的回覆" },
    ],
    answer: "D",
    explanation:
      "Task success rate 衡量是否達成「明確定義的成功條件」，而非只產生看似合理的回覆（D）——這正是 Agent 評估與傳統模型評估的差別。回覆是否通順（A）、字數多寡（C）、用了幾種工具（B）都不等於任務真正完成；工具使用另有 Tool correctness 與 Trajectory efficiency 等指標衡量。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §08 Agent 指標",
  },
  {
    id: "junior-genai-gen-q032",
    subjectId: "junior-genai",
    prompt:
      "依「最小權限」的實務分級，一筆「退款、部署或對外發送訊息」這類不可逆、高風險的動作，最適合放在哪一級？",
    choices: [
      { id: "A", text: "L0 建議：只產生建議、不執行" },
      { id: "B", text: "L2 核准後執行：人工確認後才寫入／發送" },
      { id: "C", text: "L4 高自主：長時間、多工具、低監督自行執行" },
      { id: "D", text: "不需分級，任何動作都讓 Agent 直接執行最有效率" },
    ],
    answer: "B",
    explanation:
      "退款、部署、對外訊息屬不可逆且高風險，應採 L2「核准後執行」——人工確認後才寫入/發送（B）。L0 只產生建議不執行（過於保守，但用在此仍會使任務停滯）；L4 高自主只適合可驗證、可停止且治理成熟的低風險情境（C 不當）；讓 Agent 對高風險動作直接執行會造成過度代理權風險（D 錯）。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "2025-2026補充講義 §07 最小權限分級",
  },
  {
    id: "junior-genai-gen-q033",
    subjectId: "junior-genai",
    prompt:
      "關於合成資料（synthetic data）的正確使用與「禁止自我證明」原則，下列敘述何者最正確？",
    choices: [
      { id: "A", text: "讓同一個模型產生答案、又自訂評分標準替自己打分，再把高分答案當成新的真實資料" },
      { id: "B", text: "只要是合成資料就等同真實世界，可無限比例混入訓練而不需檢查" },
      { id: "C", text: "合成資料可補充罕見或危險案例，但需保留來源 provenance、以真實 holdout set 評估，並避免生成器與驗證器共用同一盲點" },
      { id: "D", text: "合成資料不可用於任何測試或紅隊演練" },
    ],
    answer: "C",
    explanation:
      "合成資料可補充罕見、昂貴或危險案例並用於邊界測試與 red-team，但不能假裝等同真實世界；應保留生成模型、提示、日期等 provenance，以真實 holdout set 評估，且不可讓生成器與驗證器共享同一盲點，並控制其比例、分群檢查品質（C）。用同一模型自產答案、自訂評分再替自己打分即違反「禁止自我證明」（A）；把合成資料當真實、無限混入（B）易導致 model collapse；合成資料本就適合用於測試與紅隊（D 錯）。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "難",
    source: "generated",
    sourceRef: "2025-2026補充講義 §06 合成資料回饋",
  },
  {
    id: "junior-genai-gen-q034",
    subjectId: "junior-genai",
    prompt:
      "關於生成式 AI 系統上線後的「持續改善」，下列哪一種做法最符合「受控更新而非盲目自學」的原則？",
    choices: [
      { id: "A", text: "以觀測、分類、建立可重現 Evals、控制有限變因改善、離線/shadow/canary 驗證、版本化發布並保留 rollback 的迴圈進行" },
      { id: "B", text: "讓正式模型直接吞下線上資料即時自我修改，完全不需人工審批" },
      { id: "C", text: "只要改動不告訴任何人、也不記錄版本，就能加快迭代" },
      { id: "D", text: "上線即終點，之後任何模型、提示或知識庫更新都不會影響系統行為" },
    ],
    answer: "A",
    explanation:
      "受控更新的改善迴圈是：觀測（錯誤/trace/成本）→ 分類失敗類型 → 建立可重現 Evals 並保留 holdout → 一次控制有限變因改善 → 離線/shadow/canary 驗證 → 版本化發布並可快速暫停或回復（rollback）（A）。讓正式模型即時吞資料自學（B）風險極高；不記錄版本（C）違反可觀測性與審批要求；模型、提示、知識庫、工具或供應商任一更新都可能改變系統行為，上線不是終點（D 錯）。",
    topic: "生成式 AI 導入評估規劃",
    difficulty: "中",
    source: "generated",
    sourceRef: "2025-2026補充講義 §09 部署與改善",
  },
];
