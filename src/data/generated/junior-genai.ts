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
];
