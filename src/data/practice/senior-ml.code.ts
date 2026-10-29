import type { Question } from "../types";

// 程式閱讀題（2026-10-29）：依真題比例補上的一批，計畫見 docs/superpowers/plans/2026-10-29-senior-code-reading-questions.md。
// 每題的程式行為都以固定版本環境實際執行驗證過（驗證腳本見 scripts/code-questions/），觀念敘述與詳解仍為 LLM 產出、需人工複審。
export const practiceQuestions: Question[] = [
  {
    id: "senior-ml-practice-q143",
    subjectId: "senior-ml",
    prompt:
      "某銀行以 scikit-learn（1.5 版）建立信用卡違約預測模型，X 為 3,000 位客戶的 12 個數值特徵，y 為是否違約（違約約占 10%）。程式與輸出如下。關於這段程式，下列敘述哪些正確？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.pipeline import Pipeline\n" +
          "from sklearn.preprocessing import StandardScaler\n" +
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.model_selection import StratifiedKFold, cross_val_score\n" +
          "\n" +
          "pipe = Pipeline([\n" +
          "    (\"scaler\", StandardScaler()),\n" +
          "    (\"clf\", LogisticRegression(max_iter=1000)),\n" +
          "])\n" +
          "skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n" +
          "scores = cross_val_score(pipe, X, y, cv=skf, scoring=\"roc_auc\")\n" +
          "print(scores.round(3), round(scores.mean(), 3))",
      },
      {
        kind: "output",
        content: "[0.915 0.961 0.914 0.921 0.927] 0.927",
      },
      {
        kind: "note",
        content:
          "① 每一折中，StandardScaler 只用該折的訓練資料計算平均數與標準差\n" +
          "② scores 是含 5 個元素的陣列，每個元素是一折驗證資料上的 AUC\n" +
          "③ StratifiedKFold 讓每一折驗證資料的違約比例都接近全體的 10%\n" +
          "④ 程式執行完後 pipe 已被擬合，可以直接呼叫 pipe.predict(X_new) 預測新客戶\n" +
          "⑤ 因為 scoring=\"roc_auc\"，cross_val_score 會先以 0.5 為門檻把機率轉成類別再計分",
      },
    ],
    choices: [
      { id: "A", text: "①②③" },
      { id: "B", text: "①②④" },
      { id: "C", text: "②③⑤" },
      { id: "D", text: "①④⑤" },
    ],
    answer: "A",
    explanation:
      "①正確：Pipeline 交給 cross_val_score 時，每一折都會複製一份 pipe 並只用該折的訓練資料 fit，StandardScaler 的平均數與標準差不會看到驗證折，這正是把前處理包進 Pipeline 的目的。②正確：n_splits=5，回傳長度 5 的陣列，每個值是該折驗證資料上的 AUC。③正確：StratifiedKFold 依 y 分層，每折的違約比例都與全體的約 10% 相近。④錯誤：cross_val_score 擬合的是 pipe 的複本（clone），原本的 pipe 仍未擬合，直接 predict 會拋出 NotFittedError，要上線必須另外執行 pipe.fit(X, y)。⑤錯誤：roc_auc 評分器取 decision_function 或 predict_proba 的連續分數，衡量所有門檻下的排序能力，不會先以 0.5 切成類別。故正確組合為①②③。",
    choiceExplanations: {
      B: "①②正確，但④不成立：cross_val_score 在內部擬合的是 pipe 的複本，原物件仍未擬合，呼叫 predict 會拋出 NotFittedError；要上線需另外執行 pipe.fit(X, y)，也漏了正確的③。",
      C: "②③正確，但⑤不成立：AUC 是以預測分數在所有門檻下的排序表現計算，評分器取的是 decision_function 或 predict_proba，不會先以 0.5 切成類別；同時漏掉了正確的①。",
      D: "只有①正確；④誤以為交叉驗證會順便擬合原本的 pipe，⑤誤以為 AUC 要先以 0.5 門檻轉成類別，兩者都不成立，並漏掉②③。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["交叉驗證", "Pipeline", "分層 K 折", "AUC"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Terminology Swap",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把 StandardScaler 移出 Pipeline、先對全部 X 執行 fit_transform 再交叉驗證，①就不再成立而變成資料洩漏；若需要每一折擬合好的模型，要改用 cross_validate(..., return_estimator=True)，但原本的 pipe 依然不會被擬合。",
    },
  },
  {
    id: "senior-ml-practice-q144",
    subjectId: "senior-ml",
    prompt:
      "某醫院以門診檢驗數據建立糖尿病視網膜病變的初篩模型（scikit-learn 1.5），測試集 500 人中陽性 32 人。執行下列程式後得到如下報表。依據這份輸出，下列判讀何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.model_selection import train_test_split\n" +
          "from sklearn.pipeline import make_pipeline\n" +
          "from sklearn.preprocessing import StandardScaler\n" +
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.metrics import classification_report\n" +
          "\n" +
          "X_train, X_test, y_train, y_test = train_test_split(\n" +
          "    X, y, test_size=0.25, stratify=y, random_state=0)\n" +
          "model = make_pipeline(StandardScaler(), LogisticRegression())\n" +
          "model.fit(X_train, y_train)\n" +
          "print(classification_report(y_test, model.predict(X_test)))",
      },
      {
        kind: "output",
        content:
          "              precision    recall  f1-score   support\n" +
          "\n" +
          "           0       0.95      1.00      0.97       468\n" +
          "           1       0.83      0.16      0.26        32\n" +
          "\n" +
          "    accuracy                           0.94       500\n" +
          "   macro avg       0.89      0.58      0.62       500\n" +
          "weighted avg       0.94      0.94      0.93       500",
      },
    ],
    choices: [
      { id: "A", text: "準確率 0.94 已高於院方門檻 0.90，陰性類的召回率也達 1.00，模型可以直接上線篩檢" },
      { id: "B", text: "陽性類 precision 為 0.83，代表實際患病者當中有八成以上能被模型判為陽性而找出" },
      { id: "C", text: "陽性類 recall 僅 0.16，多數患者被漏判；應改以召回率評估，並調整類別權重或門檻" },
      { id: "D", text: "weighted avg 的 f1-score 為 0.93，表示兩類表現均衡，類別不平衡並未影響這個模型" },
    ],
    answer: "C",
    explanation:
      "陽性類（標籤 1）的 recall 只有 0.16，代表 32 位患者中約只有 5 位被找出，其餘都被判為陰性；對初篩而言漏判的代價最高，這個模型不能用。0.94 的準確率看似漂亮，但測試集陰性占 468／500＝0.936，把所有人都判為陰性也有這個水準，準確率主要來自多數類。合理的下一步是改以陽性召回率（或 F1、PR 曲線）作為主指標，並以 class_weight=\"balanced\" 或調低判定門檻提高召回率；實測加上 class_weight=\"balanced\" 後，同一份測試集的陽性召回率可提升到 0.7 以上。",
    choiceExplanations: {
      A: "0.94 只比「全部判為陰性」的 0.936 高一點點，準確率高是因為陰性占多數；陰性召回率 1.00 也只說明模型幾乎都判陰性，不代表能找出患者。",
      B: "這是把 precision 與 recall 對調了。precision 0.83 是「被判為陽性的人當中八成真的患病」；實際患病者被找出的比例是 recall，只有 0.16。",
      D: "weighted avg 依各類 support 加權，468 位陰性主導了平均值；macro avg 的 F1 只有 0.62、陽性類的 F1 只有 0.26，正好顯示兩類表現極不均衡。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["類別不平衡", "召回率", "精確率", "classification_report"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若模型用途改成確診前的二次確認、偽陽性代價很高，precision 0.83 的意義就會上升；但在初篩情境中漏判最昂貴，陽性召回率才是主指標。",
    },
  },
  {
    id: "senior-ml-practice-q145",
    subjectId: "senior-ml",
    prompt:
      "某工廠以產線感測資料預測不良品（不良約占 8%）。資料檔是依品檢結果排序存放的：良品全在前、不良品全在後。工程師已建立下列物件，接著要以 5 折、且每折不良比例都與全體一致的交叉驗證，用 F1 分數評估 pipe（scikit-learn 1.5）。下列哪一行程式碼符合需求？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.pipeline import make_pipeline\n" +
          "from sklearn.preprocessing import StandardScaler\n" +
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.model_selection import cross_val_score, StratifiedKFold, KFold\n" +
          "from sklearn.metrics import f1_score\n" +
          "\n" +
          "pipe = make_pipeline(StandardScaler(), LogisticRegression())",
      },
    ],
    choices: [
      { id: "A", text: "cross_val_score(pipe, X, y, cv=StratifiedKFold(n_splits=5), scoring=f1_score)" },
      { id: "B", text: "cross_val_score(pipe, y, X, cv=StratifiedKFold(n_splits=5), scoring=\"f1\")" },
      { id: "C", text: "cross_val_score(pipe, X, y, cv=KFold(n_splits=5), scoring=\"f1\")" },
      { id: "D", text: "cross_val_score(pipe, X, y, cv=StratifiedKFold(n_splits=5), scoring=\"f1\")" },
    ],
    answer: "D",
    explanation:
      "cross_val_score 的引數順序是 (estimator, X, y)；scoring 要給評分器名稱字串（\"f1\"）或以 make_scorer 包裝過的評分器；StratifiedKFold 依 y 分層，即使資料依類別排序，每一折的不良比例也會與全體的約 8% 一致。三項要求都滿足的只有 cv=StratifiedKFold(n_splits=5) 搭配 scoring=\"f1\" 的寫法。",
    choiceExplanations: {
      A: "scoring 直接傳入 f1_score 這個指標函式是錯的：評分器的簽名必須是 (estimator, X, y)，scikit-learn 1.5 會拋出 ValueError，提示改用 make_scorer 或字串 \"f1\"。",
      B: "把 X 與 y 的位置對調了。cross_val_score 的第二、三個引數依序是特徵與標籤，對調後 StratifiedKFold 會拿 X 當標籤分層，直接拋出 ValueError。",
      C: "程式能執行，但 KFold 不分層、預設也不打亂；資料又依類別排序，前幾折幾乎全是良品、最後一折集中了大量不良品，違反「每折比例一致」的要求，各折 F1 也因此失真。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["交叉驗證", "分層 K 折", "評分器", "F1 分數"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Terminology Swap",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若資料已經充分打亂、類別也不極端不平衡，KFold(shuffle=True) 與分層的結果會很接近；但只要資料依類別排序或少數類很少，就必須用 StratifiedKFold。",
    },
  },
  {
    id: "senior-ml-practice-q146",
    subjectId: "senior-ml",
    prompt:
      "某線上學習平台要預測學生是否會在期中前退選。工程師已切出訓練資料 X_train、y_train，以及保留到最後才使用的 X_test、y_test，並建立下列 pipe。若要只在訓練資料上以 5 折交叉驗證搜尋 SVC 的懲罰參數 C（scikit-learn 1.5），下列哪一行程式碼正確？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.pipeline import make_pipeline\n" +
          "from sklearn.preprocessing import StandardScaler\n" +
          "from sklearn.svm import SVC\n" +
          "from sklearn.model_selection import GridSearchCV\n" +
          "\n" +
          "pipe = make_pipeline(StandardScaler(), SVC())",
      },
    ],
    choices: [
      { id: "A", text: "gs = GridSearchCV(pipe, {\"C\": [0.1, 1, 10]}, cv=5).fit(X_train, y_train)" },
      { id: "B", text: "gs = GridSearchCV(pipe, {\"SVC__C\": [0.1, 1, 10]}, cv=5).fit(X_train, y_train)" },
      { id: "C", text: "gs = GridSearchCV(pipe, {\"svc__C\": [0.1, 1, 10]}, cv=5).fit(X_test, y_test)" },
      { id: "D", text: "gs = GridSearchCV(pipe, {\"svc__C\": [0.1, 1, 10]}, cv=5).fit(X_train, y_train)" },
    ],
    answer: "D",
    explanation:
      "對 Pipeline 搜尋超參數時，param_grid 的鍵要寫成「步驟名稱__參數名稱」（雙底線）。make_pipeline 會把步驟名稱自動設為類別名稱的小寫，因此 SVC 這一步叫 svc，C 的鍵就是 svc__C。搜尋必須只在訓練資料上進行，測試資料留到最後評估，所以要 fit(X_train, y_train)。",
    choiceExplanations: {
      A: "鍵只寫 C 時，GridSearchCV 會對 Pipeline 本身設定 C，但 Pipeline 沒有這個參數，scikit-learn 會拋出 Invalid parameter 的 ValueError；必須加上步驟名稱前綴。",
      B: "前綴必須與步驟名稱完全一致。make_pipeline 產生的名稱是小寫的 svc，寫成 SVC__C 對不上任何步驟，同樣拋出 Invalid parameter 的 ValueError。",
      C: "鍵寫對了，程式也能執行，但搜尋是在 X_test 上做的：最佳 C 值是看著測試資料挑出來的，之後再用 X_test 評估就會高估表現，等於把測試集當成驗證集用掉。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["GridSearchCV", "Pipeline", "超參數調整", "測試集隔離"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Terminology Swap",
        C: "Layer Confusion",
      },
      crossNode: "L23304",
      decisionBoundary:
        "若 pipe 改用 Pipeline([(\"clf\", SVC())]) 自行命名，鍵就要跟著改成 clf__C；若 GridSearchCV 包的是單獨的 SVC() 而非 Pipeline，鍵才是不帶前綴的 C。",
    },
  },
  {
    id: "senior-ml-practice-q147",
    subjectId: "senior-ml",
    prompt:
      "某農業試驗所以 120 株水稻、每株 3,000 個基因表現量預測是否抗稻熱病，交叉驗證準確率接近 0.9。研究員懷疑結果太好，把抗病標籤隨機打亂成 y_perm 後重跑同一段流程（程式與輸出如下），分數依然很高。下列哪一項修正最能解決根本問題？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.feature_selection import SelectKBest, f_classif\n" +
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.model_selection import cross_val_score\n" +
          "\n" +
          "# y_perm：把抗病標籤隨機打亂後的對照組，與 X 已無任何關聯\n" +
          "X_sel = SelectKBest(f_classif, k=20).fit_transform(X, y_perm)\n" +
          "clf = LogisticRegression(max_iter=1000)\n" +
          "scores = cross_val_score(clf, X_sel, y_perm, cv=5)\n" +
          "print(round(scores.mean(), 3))",
      },
      {
        kind: "output",
        content: "0.892",
      },
    ],
    choices: [
      { id: "A", text: "把 cv=5 改為 cv=10，讓每一折擁有更多訓練樣本並降低分數的變異，估計結果就會比較穩定可信" },
      { id: "B", text: "改用 StratifiedKFold(shuffle=True)，讓每折的抗病比例一致，並消除資料排列順序造成的切分偏差" },
      { id: "C", text: "在 X_sel 上用 train_test_split 另外保留 25% 測試集，改以這份獨立測試集的分數為準" },
      { id: "D", text: "把 SelectKBest 與分類器包成 Pipeline 再交給 cross_val_score，讓每折只用訓練折挑特徵" },
    ],
    answer: "D",
    explanation:
      "標籤打亂後 X 與 y_perm 已毫無關聯，合理的準確率應在 0.5 左右；仍有 0.89 代表流程本身在作弊。問題出在 SelectKBest 先用全部 120 筆（含之後每一折的驗證資料）的標籤挑出 20 個「看起來最相關」的特徵，驗證折的標籤資訊已滲入特徵，屬於資料洩漏。在 3,000 個特徵、120 筆樣本下，純靠巧合就能挑到與隨機標籤高度相關的特徵。根本修法是把特徵選擇放進 Pipeline，讓每一折只用訓練折挑特徵；實測修正後分數降為約 0.52，回到機率水準。",
    choiceExplanations: {
      A: "折數只影響每折的訓練量與估計變異，不會改變「特徵在切分前已用全部標籤挑過」這件事；改成 10 折後分數仍約 0.88。",
      B: "分層只讓各折類別比例一致，洩漏的來源是切分之前的特徵選擇，與切分方式無關；改用分層打亂後分數仍約 0.83。",
      C: "X_sel 已經用全部資料（含這 25%）的標籤挑過特徵，從它切出的測試集並不獨立；實測測試準確率仍約 0.83，同樣被高估。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料洩漏", "特徵選擇", "Pipeline", "置換檢定"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Wrong Trade-off",
        B: "Neighbor Concept",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若特徵選擇不看標籤（例如 VarianceThreshold 只依變異數篩選），先對全部資料執行就不會洩漏標籤資訊；只要篩選依據用到 y，就必須放進每一折的訓練流程內。",
    },
  },
  {
    id: "senior-ml-practice-q148",
    subjectId: "senior-ml",
    prompt:
      "某保險公司以 GridSearchCV 調整詐欺理賠偵測模型的正則化強度（scikit-learn 1.5），X_train、y_train 為訓練資料，X_test、y_test 為保留的測試資料。程式與輸出如下。關於這段程式，下列敘述哪些正確？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.pipeline import make_pipeline\n" +
          "from sklearn.preprocessing import StandardScaler\n" +
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.model_selection import GridSearchCV\n" +
          "\n" +
          "pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))\n" +
          "grid = {\"logisticregression__C\": [0.01, 0.1, 1, 10]}\n" +
          "gs = GridSearchCV(pipe, grid, cv=5, scoring=\"roc_auc\")\n" +
          "gs.fit(X_train, y_train)\n" +
          "print(gs.best_params_)\n" +
          "print(round(gs.best_score_, 3), round(gs.score(X_test, y_test), 3))",
      },
      {
        kind: "output",
        content:
          "{'logisticregression__C': 10}\n" +
          "0.911 0.888",
      },
      {
        kind: "note",
        content:
          "① best_score_ 是最佳 C 值在 X_train 五個驗證折上的平均 AUC\n" +
          "② gs.score(X_test, y_test) 算出的是 AUC，而不是準確率\n" +
          "③ 搜尋結束後，gs 已用最佳 C 值在整份 X_train 上重新訓練一次\n" +
          "④ best_score_ 與 gs.score 都是用 X_test 計算，兩者的差異只來自四捨五入\n" +
          "⑤ 這次搜尋總共只擬合 4 個模型，每個 C 值各一個",
      },
    ],
    choices: [
      { id: "A", text: "①②③" },
      { id: "B", text: "②③⑤" },
      { id: "C", text: "①④⑤" },
      { id: "D", text: "①③④" },
    ],
    answer: "A",
    explanation:
      "①正確：best_score_ 是 cv_results_ 中排名第一的參數組合，在 X_train 內 5 個驗證折上的平均分數，scoring 指定為 roc_auc，所以是平均 AUC。②正確：GridSearchCV 的 score 方法沿用 scoring 指定的評分器，因此測試集上算的也是 AUC。③正確：refit 預設為 True，搜尋結束後會以最佳參數在整份 X_train 上重新擬合一次，存成 best_estimator_，gs.score 與 gs.predict 都用它。④錯誤：best_score_ 只用到訓練資料內部的驗證折，gs.score 才用 X_test，兩個數字來自不同資料。⑤錯誤：4 個 C 值 × 5 折＝20 次擬合，再加上 refit 的 1 次，共 21 次。故為①②③。",
    choiceExplanations: {
      B: "⑤把擬合次數算錯了：每個 C 值要在 5 折上各擬合一次，4 × 5＝20 次，再加 refit 的 1 次；同時漏掉了正確的①。",
      C: "④把 best_score_ 誤當成測試集分數，它其實只來自 X_train 內部的驗證折；⑤也把 5 折的擬合次數漏算了，另外漏了②③。",
      D: "①③正確，但④不成立：best_score_ 從未看過 X_test，與 gs.score 的差異來自資料不同而非四捨五入；也漏掉了②。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["GridSearchCV", "best_score_", "refit", "AUC"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Terminology Swap",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若把 refit 設為 False，③就不成立，gs 也不再有 best_estimator_、無法直接 score 或 predict；若 scoring 改成多個指標，refit 必須指定以哪一個指標重訓。",
    },
  },
  {
    id: "senior-ml-practice-q149",
    subjectId: "senior-ml",
    prompt:
      "某醫院以 40 位病患的心電圖片段訓練心律不整分類器，每位病患切成 20 段、共 800 段，每段的標籤沿用該病患的診斷。下列程式的交叉驗證準確率為 1.0，但用在新病患身上時準確率只有七成左右。下列哪一項修正最能讓交叉驗證反映模型對新病患的表現？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.model_selection import KFold, cross_val_score\n" +
          "from sklearn.neighbors import KNeighborsClassifier\n" +
          "\n" +
          "# X：800 段心電圖特徵；y：該段所屬病患的診斷；patient_id：病患編號\n" +
          "knn = KNeighborsClassifier(n_neighbors=5)\n" +
          "cv = KFold(n_splits=5, shuffle=True, random_state=0)\n" +
          "print(round(cross_val_score(knn, X, y, cv=cv).mean(), 3))",
      },
      {
        kind: "output",
        content: "1.0",
      },
    ],
    choices: [
      { id: "A", text: "改用 StratifiedKFold(shuffle=True)，讓每一折的心律不整比例都與全體保持一致" },
      { id: "B", text: "在 KNN 前加入 StandardScaler 並包成 Pipeline，讓標準化只在訓練折上擬合" },
      { id: "C", text: "改用 GroupKFold 並傳入 groups=patient_id，讓同一位病患的片段只落在同一折" },
      { id: "D", text: "把 n_neighbors 提高到 15，讓預測參考更多鄰居，降低對個別片段的過度記憶" },
    ],
    answer: "C",
    explanation:
      "同一位病患的 20 段心電圖彼此高度相似，標籤也完全相同。KFold 隨機打亂後，每位病患的片段會同時散落在訓練折與驗證折，KNN 只要在訓練折找到「同一個人的另一段」就能答對，量到的是「認不認得這個人」，而不是「能不能判斷新病患」。應以病患為單位切分：GroupKFold 搭配 groups=patient_id，保證同一位病患只出現在訓練或驗證其中一邊。實測改用 GroupKFold 後準確率約 0.70，與新病患上的表現一致。",
    choiceExplanations: {
      A: "分層只控制類別比例，同一位病患的片段仍會同時出現在訓練折與驗證折；實測分數依舊是 1.0。",
      B: "把標準化放進 Pipeline 是好習慣，可避免前處理洩漏，但這裡的洩漏來自病患重複出現在兩邊，加上後分數仍是 1.0。",
      D: "每位病患有 20 段，訓練折中同一人的片段遠多於 15 個，鄰居幾乎都還是同一個人；實測分數仍是 1.0，問題不在 k 值。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["資料洩漏", "GroupKFold", "交叉驗證", "群組切分"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Correct in Different Context",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若每位病患只有一筆資料，或模型只會用在同一批病患的後續片段上，隨機 KFold 就沒有問題；一旦要預測「沒看過的病患」，切分單位就必須是病患。",
    },
  },
  {
    id: "senior-ml-practice-q150",
    subjectId: "senior-ml",
    prompt:
      "某工廠要以溫度 temp、壓力 pressure 兩個數值欄位與產線代號 line（類別欄位）預測良率。X_train 含 A、B、C、D 四條產線，X_test 只出現 A、B 兩條。工程師以 ColumnTransformer 做前處理（scikit-learn 1.5），為了讓測試資料套用與訓練資料完全相同的轉換參數，程式中的 (1)、(2) 應分別填入什麼？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.compose import ColumnTransformer\n" +
          "from sklearn.preprocessing import StandardScaler, OneHotEncoder\n" +
          "\n" +
          "pre = ColumnTransformer([\n" +
          "    (\"num\", StandardScaler(), [\"temp\", \"pressure\"]),\n" +
          "    (\"cat\", OneHotEncoder(handle_unknown=\"ignore\"), [\"line\"]),\n" +
          "])\n" +
          "X_tr = pre.___(1)___(X_train)\n" +
          "X_te = pre.___(2)___(X_test)",
      },
    ],
    choices: [
      { id: "A", text: "(1) fit　(2) fit_transform" },
      { id: "B", text: "(1) fit_transform　(2) transform" },
      { id: "C", text: "(1) transform　(2) fit_transform" },
      { id: "D", text: "(1) fit_transform　(2) fit_transform" },
    ],
    answer: "B",
    explanation:
      "轉換參數（標準化的平均數與標準差、One-Hot 的類別清單）只能從訓練資料學：訓練集用 fit_transform 一次完成「學參數＋轉換」，測試集只用 transform 套用同一組參數。這樣測試資料會得到與訓練資料相同的 6 個欄位（2 個標準化數值＋A～D 四個 One-Hot 欄），模型才能正確對應每一欄的意義。",
    choiceExplanations: {
      A: "fit 回傳的是 ColumnTransformer 物件本身而不是轉換後的陣列，X_tr 會變成一個轉換器；第二步的 fit_transform 又以測試資料重新擬合，覆蓋掉訓練時的參數。",
      C: "第一步就呼叫 transform，此時 ColumnTransformer 尚未擬合，scikit-learn 會拋出 NotFittedError，程式根本跑不到第二行。",
      D: "程式能執行，但測試集被重新擬合：標準化改用測試集自己的平均數，OneHotEncoder 也只看到 A、B 兩條產線，輸出只剩 4 欄，與訓練時的 6 欄對不上。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["ColumnTransformer", "fit_transform", "One-Hot 編碼", "資料洩漏"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Terminology Swap",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把 pre 與模型一起包進 Pipeline，只需呼叫 pipe.fit(X_train, y_train) 與 pipe.predict(X_test)，Pipeline 會自動在訓練時 fit_transform、預測時 transform，就不必手動分辨這兩個方法。",
    },
  },
  {
    id: "senior-ml-practice-q151",
    subjectId: "senior-ml",
    prompt:
      "某大學預測學生是否休學（休學者約占 7%）。為了處理類別不平衡，工程師以下列程式先對休學類過採樣、再切分訓練與測試資料。測試集上休學類的召回率為 1.0，但套用到下一學期的學生時召回率只剩約五成。造成測試分數失真的主要原因為何？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "from sklearn.utils import resample\n" +
          "from sklearn.model_selection import train_test_split\n" +
          "from sklearn.tree import DecisionTreeClassifier\n" +
          "from sklearn.metrics import recall_score\n" +
          "\n" +
          "major = df[df[\"dropout\"] == 0]\n" +
          "minor = df[df[\"dropout\"] == 1]\n" +
          "minor_up = resample(minor, replace=True, n_samples=len(major), random_state=0)\n" +
          "balanced = pd.concat([major, minor_up])\n" +
          "\n" +
          "X = balanced.drop(columns=\"dropout\")\n" +
          "y = balanced[\"dropout\"]\n" +
          "X_tr, X_te, y_tr, y_te = train_test_split(\n" +
          "    X, y, test_size=0.2, stratify=y, random_state=0)\n" +
          "clf = DecisionTreeClassifier(random_state=0).fit(X_tr, y_tr)\n" +
          "print(recall_score(y_te, clf.predict(X_te)), (y_te == 1).sum())",
      },
      {
        kind: "output",
        content: "1.0 367",
      },
    ],
    choices: [
      { id: "A", text: "過採樣做在切分之前，同一位休學生的複製樣本同時落在訓練集與測試集，模型等於先看過考題" },
      { id: "B", text: "切分時設了 stratify=y，使測試集的類別比例與訓練集相同，測試題目因此比實際情況簡單" },
      { id: "C", text: "測試集中的休學樣本數量太少，召回率的估計變異很大，1.0 只是這次抽樣運氣特別好的結果" },
      { id: "D", text: "resample 設定 n_samples=len(major) 後休學類反而多於在學類，模型因此偏向判為休學" },
    ],
    answer: "A",
    explanation:
      "resample(replace=True) 只是把 165 位休學生重複抽成 1,835 筆複本。先過採樣再切分，同一位學生的複本幾乎必然同時出現在訓練集與測試集；決策樹把訓練集的每一筆都記住，測試時遇到一模一樣的複本自然全部答對。實測測試集裡的休學樣本，原始資料列 100% 都在訓練集出現過。正確做法是先切分，只對訓練集過採樣，測試集保持原始分布；這樣量到的召回率約 0.52，與下一學期的實際表現一致。",
    choiceExplanations: {
      B: "分層切分只是讓兩邊類別比例一致，本身不會洩漏資訊；實測拿掉 stratify 後召回率仍是 1.0，可見原因不在這裡。",
      C: "這 367 筆是複本，未必代表 367 位不同的學生，但關鍵不在數量：換用不同 random_state 重切，召回率每次都是 1.0，代表這不是抽樣運氣，而是切分方式造成的系統性高估。",
      D: "n_samples=len(major) 會把休學類補到與在學類一樣多，過採樣後兩類筆數相等，並沒有反超；召回率失真的原因也不是類別偏向。",
    },
    topic: "L23301 數據準備與特徵工程",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["過採樣", "資料洩漏", "類別不平衡", "訓練測試切分"],
      constraints: ["data_quality"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若過採樣改成只在訓練集（或在交叉驗證的每個訓練折內）進行，測試集維持原始分布，分數就能反映真實表現；若改用 class_weight 調整而不複製樣本，也不會有這種重複洩漏。",
    },
  },
  {
    id: "senior-ml-practice-q152",
    subjectId: "senior-ml",
    prompt:
      "某農會想把 300 塊農地依土壤與氣候條件分成 3 群，分別給予不同的施肥建議。四個欄位的數值範圍差異很大：年雨量約 600～2,400 mm、pH 約 4～9、有機質約 0.5～6%、陽離子交換容量約 3～28 cmol/kg。程式與群中心如下，農藝專家看了之後指出這樣的分群與土壤性質幾乎無關。下列哪一項修正最恰當？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.cluster import KMeans\n" +
          "\n" +
          "# X 的四個欄位依序為：年雨量 rain、pH、有機質 om、陽離子交換容量 cec\n" +
          "km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)\n" +
          "print(km.cluster_centers_.round(1))",
      },
      {
        kind: "output",
        caption: "三個群中心（每列一群，欄位順序同 X）：",
        content:
          "[[ 947.8    6.6    3.    15.2]\n" +
          " [1610.6    6.5    3.    15.1]\n" +
          " [2172.4    6.4    2.9   14.1]]",
      },
    ],
    choices: [
      { id: "A", text: "把 n_clusters 提高到 5，讓模型有更多群可以把 pH 與有機質的差異另外切分出來" },
      { id: "B", text: "把 n_init 提高到 50，多試幾組初始中心，避免 KMeans 停在品質較差的局部最佳解" },
      { id: "C", text: "先以 StandardScaler 把四個欄位標準化再分群，避免年雨量的數值尺度主導距離計算" },
      { id: "D", text: "先以 PCA(n_components=2) 降維、濾掉次要的變異，再對兩個主成分執行 KMeans 分群" },
    ],
    answer: "C",
    explanation:
      "KMeans 以歐氏距離分群，年雨量的差距動輒上千，pH、有機質的差距只有個位數，距離幾乎完全由年雨量決定。輸出的三個群中心只在第一欄（約 950、1,600、2,170 mm）明顯不同，其餘三欄幾乎一樣，等於只是依雨量切成三段。先以 StandardScaler 讓每個欄位的平均為 0、標準差為 1，四個欄位才會以相近的權重參與距離計算；實測標準化後的分群與專家判定的土壤類型完全一致（調整蘭德指數 ARI＝1.0），未標準化時 ARI 約為 0。",
    choiceExplanations: {
      A: "群數增加後，KMeans 只會把年雨量切得更細，距離仍由雨量主導；實測 5 群的結果與土壤類型的 ARI 仍約為 0。",
      B: "n_init 解決的是初始值造成的局部最佳解，但這裡的問題是距離的定義被尺度扭曲，多試幾次只會穩定地收斂到同一組依雨量切分的群。",
      D: "PCA 同樣受尺度影響：未標準化時第一主成分幾乎就是年雨量（負荷量超過 0.99），降維反而把土壤欄位的訊息濾掉，分群結果仍與土壤無關。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "難",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["KMeans", "特徵縮放", "標準化", "PCA"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Neighbor Concept",
        D: "Correct in Different Context",
      },
      crossNode: "L23301",
      decisionBoundary:
        "若各欄位本來就是同一單位、同一尺度（例如同一組感測器的讀值），不標準化反而能保留原始差異的意義；只要欄位單位不同、數值範圍差異大，以距離為基礎的方法（KMeans、KNN、PCA）都要先縮放。",
    },
  },
  {
    id: "senior-ml-practice-q153",
    subjectId: "senior-ml",
    prompt:
      "某銀行想把 600 位信用卡客戶依 5 項消費行為特徵分群，做差異化行銷。資料已標準化為 X_std，工程師對 k＝2～7 分別執行 KMeans，記錄慣性（inertia_）與輪廓係數，程式與輸出如下。下列判讀何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.cluster import KMeans\n" +
          "from sklearn.metrics import silhouette_score\n" +
          "\n" +
          "for k in range(2, 8):\n" +
          "    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X_std)\n" +
          "    print(k, round(km.inertia_, 1), round(silhouette_score(X_std, km.labels_), 3))",
      },
      {
        kind: "output",
        caption: "每列依序為 k、inertia_、輪廓係數：",
        content:
          "2 1662.3 0.486\n" +
          "3 699.2 0.619\n" +
          "4 276.6 0.682\n" +
          "5 255.1 0.572\n" +
          "6 235.2 0.453\n" +
          "7 217.3 0.358",
      },
    ],
    choices: [
      { id: "A", text: "k＝7 的 inertia 最低，代表群內樣本最緊密，因此 7 群是品質最好的分群數" },
      { id: "B", text: "inertia 在 k＝4 之後降幅明顯趨緩，且 k＝4 的輪廓係數最高，宜選 4 群" },
      { id: "C", text: "輪廓係數越接近 0 代表群與群分得越開，k＝7 的值最小，所以 7 群區隔最清楚" },
      { id: "D", text: "inertia 從 k＝2 到 3 降幅最大，表示轉折點出現在 3，宜選 3 群做差異化行銷" },
    ],
    answer: "B",
    explanation:
      "兩個指標要一起看。inertia（群內平方和）會隨 k 增加而單調下降，看的是「下降在哪裡突然變平」：k 從 3 到 4 還降了 400 多，從 4 到 5 只降 21 左右，之後都很平緩，轉折點（手肘）在 k＝4。輪廓係數介於 −1 到 1，越接近 1 代表樣本離自己的群近、離其他群遠，k＝4 的 0.682 是所有 k 中最高的。兩個指標一致指向 4 群。",
    choiceExplanations: {
      A: "inertia 一定隨 k 增加而下降，k 等於樣本數時甚至為 0，因此不能直接取最低者；要看的是降幅變平的轉折點。",
      C: "把輪廓係數的方向弄反了：越接近 1 才代表群與群分得清楚，接近 0 表示樣本落在群的交界附近；k＝7 的 0.358 是最差的一組。",
      D: "降幅最大的地方不等於轉折點；k 從 3 到 4 仍下降了 400 多，代表第 4 群還在大幅降低群內差異，轉折點要看下降何時變平，也就是 4 之後。",
    },
    topic: "L23202 常見機器學習演算法",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["KMeans", "手肘法", "輪廓係數", "群數選擇"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Terminology Swap",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若手肘法與輪廓係數指向不同的 k，就要回到業務需求判斷（例如行銷團隊只能經營 3 種方案）；只有兩個指標一致時，才能單憑輸出決定群數。",
    },
  },
  {
    id: "senior-ml-practice-q154",
    subjectId: "senior-ml",
    prompt:
      "某醫院要以 GridSearchCV 調整敗血症預警模型。院方規定：以陽性類的召回率挑選超參數，而且搜尋完要能直接用 gs.predict(X_test) 產生預測（scikit-learn 1.5）。已定義的物件如下，接著要建立 gs 再呼叫 gs.fit(X_train, y_train)。下列哪一行程式碼符合需求？",
    figures: [
      {
        kind: "code",
        content:
          "from sklearn.pipeline import make_pipeline\n" +
          "from sklearn.preprocessing import StandardScaler\n" +
          "from sklearn.linear_model import LogisticRegression\n" +
          "from sklearn.model_selection import GridSearchCV\n" +
          "\n" +
          "pipe = make_pipeline(StandardScaler(), LogisticRegression())\n" +
          "grid = {\"logisticregression__C\": [0.01, 1],\n" +
          "        \"logisticregression__class_weight\": [None, \"balanced\"]}",
      },
    ],
    choices: [
      { id: "A", text: "gs = GridSearchCV(pipe, grid, scoring=\"recall\", cv=5, refit=True)" },
      { id: "B", text: "gs = GridSearchCV(pipe, grid, scoring=\"recall\", cv=5, refit=False)" },
      { id: "C", text: "gs = GridSearchCV(pipe, grid, scoring=\"accuracy\", cv=5, refit=True)" },
      { id: "D", text: "gs = GridSearchCV(pipe, grid, scoring=[\"recall\", \"accuracy\"], cv=5, refit=True)" },
    ],
    answer: "A",
    explanation:
      "scoring=\"recall\" 會以正類（標籤 1，即陽性）的召回率比較各組參數；refit=True 讓搜尋結束後以最佳參數在整份訓練資料上重訓，gs 才有 best_estimator_，可以直接 gs.predict。在這份資料上，以召回率挑選會選出 class_weight=\"balanced\"，正是處理少數類漏判的設定。",
    choiceExplanations: {
      B: "refit=False 時搜尋只記錄分數，不會重訓最佳模型，gs 沒有 best_estimator_，呼叫 gs.predict 會拋出 AttributeError，不符合「直接預測」的要求。",
      C: "準確率會被占九成的陰性類主導，在這份資料上挑出的是 class_weight=None，測試集的陽性召回率明顯低於以召回率挑選的結果，違反院方的挑選規則。",
      D: "scoring 給多個指標時，refit 必須指定以哪個指標重訓（例如 refit=\"recall\"），寫 refit=True 會在 fit 時拋出 ValueError。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["GridSearchCV", "召回率", "refit", "類別不平衡"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若院方想同時記錄召回率與準確率，可以寫 scoring=[\"recall\", \"accuracy\"] 搭配 refit=\"recall\"；若只是要比較分數、不需要預測，refit=False 反而能省下最後一次重訓。",
    },
  },
  {
    id: "senior-ml-practice-q155",
    subjectId: "senior-ml",
    prompt:
      "某工廠以決策樹預測馬達是否需要提前保養，用 GridSearchCV 比較不同的 max_depth（scikit-learn 1.5，scoring 為預設的準確率），程式與輸出如下。下列判讀何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import pandas as pd\n" +
          "from sklearn.model_selection import GridSearchCV\n" +
          "from sklearn.tree import DecisionTreeClassifier\n" +
          "\n" +
          "gs = GridSearchCV(DecisionTreeClassifier(random_state=0),\n" +
          "                  {\"max_depth\": [2, 4, 6, 10, None]},\n" +
          "                  cv=5, return_train_score=True).fit(X, y)\n" +
          "cols = [\"param_max_depth\", \"mean_train_score\", \"mean_test_score\", \"rank_test_score\"]\n" +
          "print(pd.DataFrame(gs.cv_results_)[cols].round(3).to_string(index=False))",
      },
      {
        kind: "output",
        content:
          "param_max_depth  mean_train_score  mean_test_score  rank_test_score\n" +
          "              2             0.838            0.821                4\n" +
          "              4             0.898            0.862                1\n" +
          "              6             0.936            0.847                2\n" +
          "             10             0.978            0.825                3\n" +
          "           None             1.000            0.807                5",
      },
    ],
    choices: [
      { id: "A", text: "max_depth=None 的訓練分數達 1.000，表示模型已完整學會資料規律，應改用不限深度的樹" },
      { id: "B", text: "深度超過 4 之後訓練分數持續上升、驗證分數卻逐步明顯下滑，屬於過擬合，宜選驗證分數最高的深度 4" },
      { id: "C", text: "max_depth=2 的訓練與驗證分數只差 0.017，泛化落差最小，應優先選用深度為 2 的樹" },
      { id: "D", text: "refit 會依訓練分數挑出最佳組合，因此 gs.best_params_ 會是不限深度的 max_depth=None" },
    ],
    answer: "B",
    explanation:
      "mean_train_score 是各折訓練資料上的分數，mean_test_score 是驗證折上的分數。深度從 4 加到 None，訓練分數一路升到 1.000，驗證分數卻從 0.862 一路降到 0.807，兩者差距越拉越大，是典型的過擬合。應選驗證分數最高、rank_test_score 為 1 的 max_depth=4，這也正是 GridSearchCV 的 best_params_。",
    choiceExplanations: {
      A: "訓練分數 1.000 代表模型把訓練資料（含雜訊）全部背下來，同一設定的驗證分數 0.807 卻是五組中最低，正是過擬合的訊號。",
      C: "落差小只代表沒有過擬合；深度 2 的訓練與驗證分數都只有 0.8 出頭，屬於欠擬合，驗證分數比深度 4 低了約 0.04。",
      D: "GridSearchCV 依 mean_test_score（驗證分數）排名，refit 使用的是 rank_test_score 為 1 的參數，也就是 max_depth=4，訓練分數不參與挑選。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["過擬合", "欠擬合", "GridSearchCV", "決策樹深度"],
      distractorTypes: {
        A: "Wrong Trade-off",
        C: "Partial Truth",
        D: "Terminology Swap",
      },
      decisionBoundary:
        "若深度 4 與深度 6 的驗證分數差距小於各自的標準差，可以依奧卡姆剃刀選較淺的樹以利解釋與部署；只有在差距明顯時，才單憑最高驗證分數決定。",
    },
  },
  {
    id: "senior-ml-practice-q156",
    subjectId: "senior-ml",
    prompt:
      "某銀行以 PyTorch 2.5 訓練一個把客戶分成 3 個信用等級的網路，模型最後一層輸出未經轉換的 logits。工程師自己寫了下列 rating_loss 函式計算損失（下圖）。這個函式算出的值與下列哪一種 PyTorch 內建損失相同？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "\n" +
          "def rating_loss(logits, y):\n" +
          "    p = torch.softmax(logits, dim=1)\n" +
          "    picked = p[torch.arange(len(y)), y]\n" +
          "    return -torch.log(picked).mean()\n" +
          "\n" +
          "torch.manual_seed(0)\n" +
          "logits = torch.randn(4, 3)        # 4 位客戶、3 個信用等級的模型輸出\n" +
          "y = torch.tensor([0, 2, 1, 2])    # 實際信用等級\n" +
          "print(round(rating_loss(logits, y).item(), 4))",
      },
      {
        kind: "output",
        content: "0.9357",
      },
    ],
    choices: [
      { id: "A", text: "與 nn.BCEWithLogitsLoss 搭配獨熱標籤相同，對每個等級各做 sigmoid、把三個等級當成獨立的是非題" },
      { id: "B", text: "與 nn.NLLLoss 直接作用在 logits 上相同，因為兩者都只取出正確等級的那一格數值" },
      { id: "C", text: "與 nn.CrossEntropyLoss 作用在 logits 上相同，等於先做 softmax 再取正確等級的負對數" },
      { id: "D", text: "與 nn.MSELoss 搭配獨熱標籤相同，衡量各等級預測機率與標籤之間平方誤差的平均" },
    ],
    answer: "C",
    explanation:
      "rating_loss 先對 logits 沿 dim=1 做 softmax（每位客戶三個等級的機率加總為 1），再用 p[torch.arange(len(y)), y] 取出每位客戶真實等級那一格的機率，取負對數後平均——這正是多類別交叉熵的定義，也就是 nn.CrossEntropyLoss 對 logits 的計算（內部等於 log_softmax 接 NLLLoss）。驗證腳本確認 0.9357 與 nn.CrossEntropyLoss()(logits, y) 完全相同。實務上應直接用內建的 CrossEntropyLoss：先 softmax 再取 log 在 logits 很極端時會下溢成 log(0)，內建版本以 log-sum-exp 穩定計算。",
    choiceExplanations: {
      A: "BCEWithLogitsLoss 對每一格 logit 各自做 sigmoid，把三個等級當成三個獨立的是非題，適用於一筆資料可同時屬於多個類別的多標籤分類；它不經 softmax，三個機率不必加總為 1，算出的值也與 rating_loss 不同。",
      B: "NLLLoss 預期輸入已經是對數機率（log_softmax 的輸出），它只負責取出正確類別那一格再加負號；直接餵 logits 等於計算 −logits[y] 的平均，少了 softmax 與 log 兩步，數值不同。要與 rating_loss 相同，必須先做 log_softmax。",
      D: "MSELoss 搭配獨熱標籤算的是機率與 0／1 之間的平方差，沒有取對數；它對「信心十足卻答錯」的懲罰遠比交叉熵溫和，數值也與 rating_loss 不同。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["交叉熵損失", "softmax", "logits", "NLLLoss"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Partial Truth",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若把 torch.softmax 換成 torch.sigmoid，並對三格都計算 −[y·log p ＋ (1−y)·log(1−p)]，函式就變成多標籤用的 BCEWithLogitsLoss；若輸入已經是 log_softmax 的結果、函式只取負號平均，對應的就是 NLLLoss。",
    },
  },
  {
    id: "senior-ml-practice-q157",
    subjectId: "senior-ml",
    prompt:
      "某醫院以 PyTorch 2.5 訓練 30 天再入院預測模型，模型含 BatchNorm1d 與 Dropout，每個 epoch 結束時在驗證集上計算準確率（下圖）。工程師印出 BatchNorm 層的 num_batches_tracked（訓練模式下每處理一個批次加 1），發現它從第 2 個 epoch 起就不再增加。請問問題出在哪裡，最恰當的修正為何？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "\n" +
          "torch.manual_seed(0)\n" +
          "X = torch.randn(64, 10)                 # 64 位病患、10 項生理指標\n" +
          "y = (X[:, 0] + X[:, 1] > 0).long()      # 30 天內是否再入院\n" +
          "Xv = torch.randn(32, 10)\n" +
          "yv = (Xv[:, 0] + Xv[:, 1] > 0).long()\n" +
          "\n" +
          "model = nn.Sequential(nn.Linear(10, 32), nn.BatchNorm1d(32), nn.ReLU(),\n" +
          "                      nn.Dropout(0.5), nn.Linear(32, 2))\n" +
          "opt = torch.optim.Adam(model.parameters(), lr=1e-2)\n" +
          "loss_fn = nn.CrossEntropyLoss()\n" +
          "bn = model[1]\n" +
          "\n" +
          "model.train()\n" +
          "for epoch in range(3):\n" +
          "    for i in range(0, 64, 16):\n" +
          "        opt.zero_grad()\n" +
          "        loss = loss_fn(model(X[i:i+16]), y[i:i+16])\n" +
          "        loss.backward()\n" +
          "        opt.step()\n" +
          "    model.eval()\n" +
          "    with torch.no_grad():\n" +
          "        acc = (model(Xv).argmax(1) == yv).float().mean().item()\n" +
          "    print(f\"epoch {epoch}  bn_batches={bn.num_batches_tracked.item()}  val_acc={acc:.3f}\")",
      },
      {
        kind: "output",
        content:
          "epoch 0  bn_batches=4  val_acc=0.438\n" +
          "epoch 1  bn_batches=4  val_acc=0.688\n" +
          "epoch 2  bn_batches=4  val_acc=0.781",
      },
    ],
    choices: [
      { id: "A", text: "驗證段的 torch.no_grad() 一併凍結了 BatchNorm 的統計量，應拿掉 no_grad、驗證時只呼叫 model.eval()" },
      { id: "B", text: "驗證段沒有呼叫 opt.zero_grad()，殘留的梯度讓 BatchNorm 停止累計批次數，應在驗證前補上" },
      { id: "C", text: "Dropout(0.5) 與 BatchNorm 放在同一個區塊會互相干擾統計量，應移除 Dropout 或把比例降到 0.1 以下" },
      { id: "D", text: "驗證後模型一直停在推論模式，應在每個 epoch 的訓練迴圈開頭呼叫 model.train() 切回訓練行為" },
    ],
    answer: "D",
    explanation:
      "model.train() 只在迴圈外呼叫一次；第一個 epoch 結束時 model.eval() 把整個模型切到推論模式，之後再也沒有切回來，所以第 2、3 個 epoch 的 8 個訓練步其實都在 eval 模式下進行：Dropout 不再隨機遮蔽，BatchNorm 改用固定的 running_mean／running_var 而不再更新，num_batches_tracked 因此停在第一個 epoch 的 4 個批次。梯度照樣計算、參數照樣更新，程式不會報錯，只是訓練行為與設計不符，驗證分數也不能代表正確流程的結果。修正方式是在每個 epoch 的訓練迴圈開頭呼叫 model.train()、驗證段再呼叫 model.eval()；驗證腳本確認改完後 12 個訓練步都在訓練模式，BatchNorm 累計 12 個批次。",
    choiceExplanations: {
      A: "torch.no_grad() 只停止建立計算圖，不切換模組行為；在訓練模式下用 no_grad 做前向，BatchNorm 的統計量照樣更新。驗證段拿掉 no_grad、只留 eval()，計數仍停在 4，真正的原因是沒有切回訓練模式。",
      B: "驗證段沒有呼叫 backward，不會產生任何梯度，在那裡補 zero_grad 沒有作用；BatchNorm 是否累計批次只由 model.training 決定，與梯度有沒有殘留無關。實測補上後計數仍停在 4。",
      C: "Dropout 與 BatchNorm 並用確實可能讓統計量在訓練與推論間有偏移，但那不會讓批次計數停止；把 Dropout 拿掉後計數仍停在 4，因為整個模型依舊處在 eval 模式。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "難",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["train／eval 模式", "BatchNorm", "Dropout", "驗證流程"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        C: "Partial Truth",
      },
      crossNode: "L23303",
      decisionBoundary:
        "若驗證段寫在獨立的 evaluate() 函式裡、並在結尾呼叫 model.train() 還原模式，這段流程就沒有問題；若模型完全不含 Dropout 與 BatchNorm，漏掉 model.train() 也不會改變訓練結果——這個錯誤只在含有模式相依層時才有影響。",
    },
  },
  {
    id: "senior-ml-practice-q158",
    subjectId: "senior-ml",
    prompt:
      "某工廠以 PyTorch 建立瑕疵影像分類網路（下圖），輸入為 8 張 32×32 的灰階影像，兩層卷積與池化之後的特徵圖形狀為 (8, 16, 5, 5)。要讓 DefectNet()(x) 輸出形狀為 (8, 2) 的 logits，「攤平」處應填入下列哪一行？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "import torch.nn.functional as F\n" +
          "\n" +
          "class DefectNet(nn.Module):\n" +
          "    def __init__(self):\n" +
          "        super().__init__()\n" +
          "        self.conv1 = nn.Conv2d(1, 6, kernel_size=5)\n" +
          "        self.conv2 = nn.Conv2d(6, 16, kernel_size=5)\n" +
          "        self.fc = nn.Linear(16 * 5 * 5, 2)\n" +
          "\n" +
          "    def forward(self, x):\n" +
          "        x = F.max_pool2d(F.relu(self.conv1(x)), 2)\n" +
          "        x = F.max_pool2d(F.relu(self.conv2(x)), 2)\n" +
          "        # ____（攤平）____\n" +
          "        return self.fc(x)\n" +
          "\n" +
          "x = torch.randn(8, 1, 32, 32)   # 8 張 32×32 灰階瑕疵影像",
      },
    ],
    choices: [
      { id: "A", text: "x = x.view(x.size(0), 16, -1)" },
      { id: "B", text: "x = nn.Flatten(start_dim=0, end_dim=-1)(x)" },
      { id: "C", text: "x = torch.flatten(x, start_dim=1)" },
      { id: "D", text: "x = x.reshape(-1, x.size(1))" },
    ],
    answer: "C",
    explanation:
      "全連接層 nn.Linear(16 * 5 * 5, 2) 要求輸入的最後一維是 400，而且每一列對應一張影像。torch.flatten(x, start_dim=1) 保留第 0 維（批次）不動，把通道、高、寬三維併成一維，得到 (8, 400)，經過 fc 後就是 (8, 2)。等價的寫法還有 x.view(x.size(0), -1) 或 nn.Flatten()（其預設 start_dim=1）。",
    choiceExplanations: {
      A: "x.view(x.size(0), 16, -1) 只把高與寬併起來，得到 (8, 16, 25)；Linear 作用在最後一維 25，與 in_features=400 對不上，執行時拋出 RuntimeError（矩陣形狀不符）。",
      B: "nn.Flatten 的預設 start_dim 是 1，但這裡明確寫成 start_dim=0，連批次維度一起攤平成長度 3200 的一維張量，8 張影像混成一筆；Linear 也因長度不是 400 而拋出 RuntimeError。",
      D: "x.reshape(-1, x.size(1)) 以通道數 16 當最後一維，得到 (200, 16)，等於把每個空間位置當成一筆樣本；最後一維 16 對不上 400，執行時拋出 RuntimeError。即使維度湊巧對上，批次數也不再是 8。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["Flatten", "張量形狀", "全連接層"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若全連接層改成 nn.LazyLinear(2)（第一次前向時才決定輸入維度），三種錯誤寫法都不會報錯，而是靜默輸出 (8, 16, 2)、(2,)、(200, 2) 這類錯的形狀，這時只能靠檢查輸出是否為（批次數, 類別數）才抓得到；攤平時保留第 0 維的原則不變。",
    },
  },
  {
    id: "senior-ml-practice-q159",
    subjectId: "senior-ml",
    prompt:
      "某教育平台以 PyTorch 模型辨識學生作業上的手寫數字（下圖）。部署推論時要同時做到兩件事：①Dropout 停止隨機遮蔽，同一份作業每次預測的結果一致；②前向運算不建立計算圖，以節省記憶體。「推論」處應填入下列哪一段？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "\n" +
          "torch.manual_seed(0)\n" +
          "model = nn.Sequential(nn.Linear(64, 128), nn.ReLU(), nn.Dropout(0.3),\n" +
          "                      nn.Linear(128, 10))\n" +
          "# ……（已完成訓練）……\n" +
          "x = torch.rand(256, 64)   # 256 份學生手寫數字作業，每張 8×8 像素攤平\n" +
          "# ____（推論）____\n" +
          "pred = out.argmax(dim=1)",
      },
    ],
    choices: [
      { id: "A", text: "model.eval(); out = model(x)" },
      { id: "B", text: "with torch.no_grad(): out = model(x)" },
      { id: "C", text: "model.eval(); with torch.no_grad(): out = model(x)" },
      { id: "D", text: "with torch.inference_mode(): model.eval; out = model(x)" },
    ],
    answer: "C",
    explanation:
      "model.eval() 把 Dropout、BatchNorm 等模組切到推論行為（Dropout 不再遮蔽），滿足第①點；torch.no_grad() 讓前向運算不記錄計算圖，輸出的 requires_grad 為 False，滿足第②點。兩者管的是不同的事，推論時要一起用。驗證腳本確認：只有這種寫法同時讓 model.training 為 False、輸出不帶計算圖，而且同一批輸入重跑結果完全相同。",
    choiceExplanations: {
      A: "model.eval() 已關閉 Dropout，滿足第①點；但沒有 no_grad，前向仍會建立計算圖，輸出的 requires_grad 為 True，推論時白白占用記憶體，不滿足第②點。",
      B: "no_grad 只關閉梯度追蹤，不切換模組的模式；模型仍在訓練模式，Dropout 照常隨機遮蔽，同一份作業兩次預測的結果不同，不滿足第①點。",
      D: "inference_mode 與 no_grad 一樣能省去計算圖，但 model.eval 少了括號，只是取得方法物件而沒有呼叫，模型仍在訓練模式、Dropout 繼續作用；Python 不會對這種寫法報錯，所以特別容易漏看。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["train／eval 模式", "no_grad", "Dropout", "推論"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若模型不含 Dropout 與 BatchNorm，只包 no_grad 的寫法輸出就會與正解相同；反之若推論後還要對輸入求梯度（例如計算顯著圖來解釋判讀依據），就不能包 no_grad，只能保留 model.eval()。",
    },
  },
  {
    id: "senior-ml-practice-q160",
    subjectId: "senior-ml",
    prompt:
      "某農業研究站以三項數值（土壤導電度約 1000–3000、含水率 20–80、月雨量 0–300）直接訓練每公頃產量的迴歸網路，輸入與目標都沒有做尺度處理（下圖）。訓練紀錄如下，請問最合理的判斷與下一步為何？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "\n" +
          "torch.manual_seed(0)\n" +
          "n = 200\n" +
          "ec = torch.rand(n, 1) * 2000 + 1000      # 土壤導電度（μS/cm）\n" +
          "moist = torch.rand(n, 1) * 60 + 20       # 含水率（%）\n" +
          "rain = torch.rand(n, 1) * 300            # 月雨量（mm）\n" +
          "X = torch.cat([ec, moist, rain], dim=1)\n" +
          "y = 0.5 * ec + 8 * moist + 2 * rain + torch.randn(n, 1) * 50   # 每公頃產量（kg）\n" +
          "\n" +
          "model = nn.Sequential(nn.Linear(3, 16), nn.ReLU(), nn.Linear(16, 1))\n" +
          "opt = torch.optim.SGD(model.parameters(), lr=0.01)\n" +
          "loss_fn = nn.MSELoss()\n" +
          "\n" +
          "for epoch in range(5):\n" +
          "    opt.zero_grad()\n" +
          "    loss = loss_fn(model(X), y)\n" +
          "    loss.backward()\n" +
          "    gnorm = torch.nn.utils.clip_grad_norm_(model.parameters(), float(\"inf\"))\n" +
          "    opt.step()\n" +
          "    print(f\"epoch {epoch}  loss={loss.item():.3e}  grad_norm={gnorm.item():.3e}\")",
      },
      {
        kind: "output",
        content:
          "epoch 0  loss=3.099e+06  grad_norm=7.247e+06\n" +
          "epoch 1  loss=3.006e+24  grad_norm=inf\n" +
          "epoch 2  loss=nan  grad_norm=nan\n" +
          "epoch 3  loss=nan  grad_norm=nan\n" +
          "epoch 4  loss=nan  grad_norm=nan",
      },
    ],
    choices: [
      { id: "A", text: "第一輪的梯度範數就達百萬等級並迅速溢位成 inf 與 nan，屬梯度爆炸，應先標準化輸入與目標再調低學習率" },
      { id: "B", text: "損失變成 nan 是因為 MSELoss 不適合處理產量迴歸，應改用 CrossEntropyLoss 讓損失值落在固定的範圍內" },
      { id: "C", text: "損失從百萬等級跳到 nan 代表模型已經過擬合訓練資料，應加入 Dropout 與 L2 正則化後再重新訓練一次" },
      { id: "D", text: "梯度範數很大代表學習率太小、每一步的更新量不足，應把學習率調高十倍，讓模型更快離開初始位置" },
    ],
    answer: "A",
    explanation:
      "輸入特徵的尺度差了一到兩個數量級、目標值也在數千 kg，第一輪 MSE 就有 3×10⁶、梯度範數 7×10⁶；學習率 0.01 乘上這麼大的梯度，第一步就把權重推得極遠，第二輪損失暴增到 10²⁴、梯度溢位成 inf，之後全部變成 nan——典型的梯度爆炸（發散）。處置順序是先把輸入與目標標準化（例如 z-score），讓梯度回到合理量級，再視情況調低學習率或加上梯度裁剪。驗證腳本確認：標準化之後即使沿用同一個學習率，損失也維持有限並穩定下降。",
    choiceExplanations: {
      B: "CrossEntropyLoss 用於分類，目標必須是類別編號或機率分布，拿來做連續數值迴歸沒有意義——套在單一輸出上 log_softmax 恆為 0，損失恆為 0、也沒有梯度可學。MSELoss 本來就是迴歸的標準選擇，nan 的來源是尺度與學習率。",
      C: "過擬合的徵兆是訓練損失持續下降、驗證損失回升；這裡連訓練損失本身都在暴增，模型根本沒學起來。實測加入 Dropout 與 weight_decay 後，損失照樣爆掉。",
      D: "方向反了：梯度很大時，學習率越大、每一步跨得越遠。實測把學習率調高十倍，損失同樣爆掉，30 輪後仍比起點大 10¹⁵ 倍以上。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["梯度爆炸", "特徵標準化", "學習率", "Loss 變 NaN"],
      distractorTypes: {
        B: "Correct in Different Context",
        C: "Neighbor Concept",
        D: "Wrong Trade-off",
      },
      decisionBoundary:
        "若輸入與目標都已標準化、學習率也不大，紀錄卻在某一輪突然出現 nan，就該改查資料裡本來就有的 inf／nan、log(0) 或除以零這類數值問題，而不是先動學習率。",
    },
  },
  {
    id: "senior-ml-practice-q161",
    subjectId: "senior-ml",
    prompt:
      "某金融機構訓練交易詐欺偵測網路 30 個 epoch，初始學習率 0.01，希望第 1–10 個 epoch 使用 0.01、第 11–20 個 epoch 使用 0.001、第 21–30 個 epoch 使用 0.0001。每個 epoch 結束時呼叫一次 scheduler.step()（下圖，PyTorch 2.5）。「建立排程器」處應填入下列哪一行？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "from torch.optim.lr_scheduler import (CosineAnnealingLR, ExponentialLR,\n" +
          "                                      MultiStepLR, StepLR)\n" +
          "\n" +
          "optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)\n" +
          "# ____（建立排程器）____\n" +
          "\n" +
          "for epoch in range(30):\n" +
          "    train_one_epoch(model, train_loader, optimizer)   # 內含 optimizer.step()\n" +
          "    scheduler.step()",
      },
    ],
    choices: [
      { id: "A", text: "scheduler = CosineAnnealingLR(optimizer, T_max=10)" },
      { id: "B", text: "scheduler = ExponentialLR(optimizer, gamma=0.1)" },
      { id: "C", text: "scheduler = MultiStepLR(optimizer, milestones=[10], gamma=0.1)" },
      { id: "D", text: "scheduler = StepLR(optimizer, step_size=10, gamma=0.1)" },
    ],
    answer: "D",
    explanation:
      "StepLR 每經過 step_size 次 scheduler.step() 就把學習率乘上 gamma；以 epoch 為單位呼叫時，step_size=10、gamma=0.1 恰好給出 0.01 → 0.001 → 0.0001 三段階梯。驗證腳本逐輪記錄學習率，確認與要求完全一致。另外注意 scheduler.step() 要放在該 epoch 的 optimizer.step() 之後（PyTorch 1.1 起的順序）。",
    choiceExplanations: {
      A: "CosineAnnealingLR(T_max=10) 讓學習率沿餘弦曲線在 10 輪內平滑降到 0，之後又升回 0.01，呈週期變化；每一輪的值都不同，不是三段固定的階梯。",
      B: "ExponentialLR(gamma=0.1) 每呼叫一次就乘 0.1，第 2 個 epoch 就降到 0.001、第 3 個 epoch 降到 0.0001，衰減得太快。",
      C: "MultiStepLR 只在 milestones 列出的輪次衰減；只列 [10] 就只降一次，第 21–30 個 epoch 仍是 0.001。要用 MultiStepLR 達成同樣效果，必須寫 milestones=[10, 20]。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["學習率排程", "StepLR", "MultiStepLR"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        C: "Partial Truth",
      },
      crossNode: "L23304",
      decisionBoundary:
        "若改成每個批次（而非每個 epoch）呼叫 scheduler.step()，step_size 的單位就變成批次數，必須改成「10 × 每個 epoch 的批次數」才能維持同樣的階梯；若希望衰減時點依驗證損失決定，則改用 ReduceLROnPlateau。",
    },
  },
  {
    id: "senior-ml-practice-q162",
    subjectId: "senior-ml",
    prompt:
      "某醫院以 PyTorch 訓練門診轉診判斷模型（下圖），工程師每 3 個批次印出輸出層權重的梯度範數，發現數值一路變大。請問這段訓練流程最主要的錯誤為何？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "from torch.utils.data import DataLoader, TensorDataset\n" +
          "\n" +
          "torch.manual_seed(0)\n" +
          "X = torch.randn(320, 12)                       # 320 筆門診紀錄、12 項檢驗值\n" +
          "y = (X[:, :3].sum(dim=1) > 0).long()           # 是否需要轉診\n" +
          "loader = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)\n" +
          "\n" +
          "model = nn.Sequential(nn.Linear(12, 16), nn.ReLU(), nn.Linear(16, 2))\n" +
          "opt = torch.optim.SGD(model.parameters(), lr=0.05)\n" +
          "loss_fn = nn.CrossEntropyLoss()\n" +
          "\n" +
          "model.train()\n" +
          "running_loss = 0.0\n" +
          "for step, (xb, yb) in enumerate(loader):\n" +
          "    loss = loss_fn(model(xb), yb)\n" +
          "    loss.backward()\n" +
          "    opt.step()\n" +
          "    running_loss += loss.item()\n" +
          "    if step % 3 == 2:\n" +
          "        print(f\"step {step}  grad_norm={model[2].weight.grad.norm():.3f}\")",
      },
      {
        kind: "output",
        content:
          "step 2  grad_norm=0.859\n" +
          "step 5  grad_norm=1.363\n" +
          "step 8  grad_norm=1.979",
      },
    ],
    choices: [
      { id: "A", text: "running_loss 以 loss.item() 累加會切斷計算圖，使梯度無法正確地回傳到前面幾層" },
      { id: "B", text: "每個批次都呼叫 opt.step() 更新太頻繁，應先累積完整個 epoch 的梯度再更新一次" },
      { id: "C", text: "DataLoader 設定 shuffle=True 讓相鄰批次的梯度方向互相抵消，應關閉打亂才會穩定" },
      { id: "D", text: "迴圈中沒有呼叫 opt.zero_grad()，每次 backward 的梯度都會疊加在前幾步的梯度上" },
    ],
    answer: "D",
    explanation:
      "PyTorch 的 backward() 會把新算出的梯度「加」到參數的 .grad 上，而不是覆蓋，所以每個批次開始前都要呼叫 opt.zero_grad()（或 model.zero_grad()）清空。這段程式漏掉這一步，第 k 步的 .grad 其實是前 k 個批次梯度的總和，範數才會一路變大，更新方向也被舊批次拖著走。驗證腳本確認：從第 2 步起 .grad 都不等於該批次自己的梯度；補上 zero_grad 後每一步都相等。",
    choiceExplanations: {
      A: "loss.item() 回傳 Python 浮點數，只用來記錄數值；backward 在 item() 之前已經完成，梯度照常存在。真正會出問題的是反過來寫成 running_loss += loss（保留張量），那會讓計算圖跨批次累積、占用記憶體。",
      B: "每個批次更新一次正是小批次梯度下降的標準做法；同樣每批 step，只要補上 zero_grad 梯度就正確，問題不在更新頻率。刻意累積數個批次再更新（梯度累積）是另一種技巧，也要在每次 step 之後清空梯度。",
      C: "shuffle=True 是訓練時的建議設定，讓每個批次的分布接近整體；關閉打亂後梯度照樣逐步累加，範數一樣變大。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["zero_grad", "梯度累加", "訓練迴圈"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Correct in Different Context",
        C: "Wrong Trade-off",
      },
      decisionBoundary:
        "若是刻意每 4 個批次才呼叫一次 opt.step() 與 opt.zero_grad()（梯度累積，用來在記憶體有限時模擬較大的批次），讓梯度先累加幾步反而是正確設計；關鍵在 zero_grad 是否緊跟在每一次 step 之後。",
    },
  },
  {
    id: "senior-ml-practice-q163",
    subjectId: "senior-ml",
    prompt:
      "某工廠以 ImageNet 預訓練的 ResNet18 做遷移學習，辨識 4 種表面瑕疵，打算凍結骨幹、只訓練新的分類層（下圖，torchvision 0.20）。執行到 loss.backward() 時拋出錯誤。請問錯誤的原因與最恰當的修正為何？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "from torchvision import models\n" +
          "\n" +
          "model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)\n" +
          "model.fc = nn.Linear(model.fc.in_features, 4)      # 4 種表面瑕疵\n" +
          "for p in model.parameters():\n" +
          "    p.requires_grad = False                         # 凍結預訓練骨幹\n" +
          "\n" +
          "opt = torch.optim.Adam(model.parameters(), lr=1e-3)\n" +
          "x = torch.randn(8, 3, 224, 224)\n" +
          "y = torch.randint(0, 4, (8,))\n" +
          "loss = nn.CrossEntropyLoss()(model(x), y)\n" +
          "loss.backward()\n" +
          "opt.step()",
      },
      {
        kind: "output",
        caption: "錯誤訊息（節錄）",
        content:
          "Traceback (most recent call last):\n" +
          "  File \"train.py\", line 14, in <module>\n" +
          "    loss.backward()\n" +
          "  ...\n" +
          "RuntimeError: element 0 of tensors does not require grad and does not have a grad_fn",
      },
    ],
    choices: [
      { id: "A", text: "最佳化器收到了被凍結的參數，應改成只傳入 model.fc.parameters()，讓 Adam 只更新新的分類層" },
      { id: "B", text: "凍結迴圈把模型切換成推論模式，應在凍結之後呼叫 model.train()，讓參數恢復成可計算梯度" },
      { id: "C", text: "凍結迴圈連剛換上的分類層也一併凍結，應先執行凍結迴圈，之後才建立新的 model.fc 分類層" },
      { id: "D", text: "反向傳播之前計算圖已被釋放，應改成 loss.backward(retain_graph=True) 保留計算圖再回傳" },
    ],
    answer: "C",
    explanation:
      "model.parameters() 列出模型當下的所有參數，包括剛換上的 model.fc。程式先換 fc 再凍結，等於把新的分類層也設成 requires_grad=False；整個模型沒有任何需要梯度的參數，損失張量就沒有 grad_fn，backward() 因此拋出「element 0 of tensors does not require grad」。正確順序是先凍結骨幹、再建立新的 nn.Linear——新建模組的參數預設 requires_grad=True，訓練時只有它會得到梯度。驗證腳本確認：調換順序後不再報錯，只有 fc.weight 與 fc.bias 有梯度，骨幹參數的 .grad 都是 None。",
    choiceExplanations: {
      A: "只把 fc 的參數交給最佳化器是好習慣（省下最佳化器狀態的記憶體），但問題不在最佳化器：fc 本身已被凍結，損失仍沒有 grad_fn，backward 照樣拋出同一個錯誤。",
      B: "model.train() 與 model.eval() 只切換 Dropout、BatchNorm 等模組的行為，不會改動任何參數的 requires_grad；凍結迴圈也沒有改變模式。呼叫 train() 之後仍拋出同一個錯誤。",
      D: "retain_graph=True 用在同一張計算圖要反向傳播兩次的情境；這裡根本沒有建立任何計算圖可以保留，加上它之後錯誤訊息完全相同。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["遷移學習", "凍結參數", "requires_grad"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若保留原本的順序，但在凍結迴圈之後另外對 model.fc.parameters() 設 requires_grad = True，同樣能修正；若目標是微調整個網路而不只是分類層，則根本不需要凍結迴圈，改用較小的學習率訓練全部參數即可。",
    },
  },
  {
    id: "senior-ml-practice-q164",
    subjectId: "senior-ml",
    prompt:
      "某教育科技公司以 ImageNet 預訓練的 ResNet18 做遷移學習，把學生作業影像分成 4 類；凍結骨幹後換上新的分類層並印出參數量（下圖，torchvision 0.20）。下列關於這個模型的敘述何者正確？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "from torchvision import models\n" +
          "\n" +
          "model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)\n" +
          "for p in model.parameters():\n" +
          "    p.requires_grad = False\n" +
          "model.fc = nn.Linear(model.fc.in_features, 4)   # 4 類學生作業影像\n" +
          "\n" +
          "total = sum(p.numel() for p in model.parameters())\n" +
          "trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)\n" +
          "print(f\"total={total:,}  trainable={trainable:,}  ratio={trainable / total:.2%}\")",
      },
      {
        kind: "output",
        content: "total=11,178,564  trainable=2,052  ratio=0.02%",
      },
    ],
    choices: [
      { id: "A", text: "只有新的 fc 層會被最佳化器更新，但在 model.train() 下做前向時，骨幹 BatchNorm 的 running_mean 仍會改變" },
      { id: "B", text: "只有新的 fc 層會被最佳化器更新，所以在 model.train() 下做前向時，骨幹內連 BatchNorm 統計量也都不會改變" },
      { id: "C", text: "可訓練的 2,052 個參數全部是 fc 層的權重，代表 nn.Linear 換上去之後預設不帶偏差項 bias" },
      { id: "D", text: "可訓練參數只占約 0.02%，代表每張影像做前向傳播的運算量也會跟著降到原本的 0.02% 左右" },
    ],
    answer: "A",
    explanation:
      "requires_grad=False 只讓參數不接收梯度、不被最佳化器更新；BatchNorm 的 running_mean／running_var 是緩衝區（buffer）而不是參數，只要模組處在訓練模式，每次前向都會以移動平均更新。所以凍結骨幹後若以 model.train() 訓練，骨幹 BatchNorm 的統計量仍會被新資料改寫——資料量小時常見的做法是把骨幹的 BatchNorm 切成 eval()，保留預訓練的統計量。驗證腳本確認：train() 下前向一次，bn1.running_mean 就改變；eval() 下則不動。",
    choiceExplanations: {
      B: "參數凍結與統計量更新是兩回事；驗證腳本在 train() 下前向一次，bn1.running_mean 就改變了，只有切到 eval() 才保持不動。",
      C: "nn.Linear 預設 bias=True；512 個輸入、4 個輸出，權重有 512×4 = 2,048 個，加上 4 個偏差正好 2,052。",
      D: "凍結只影響反向傳播，前向仍要跑完全部 20 層卷積，運算量與未凍結時相同；省下的是骨幹的梯度計算與最佳化器狀態。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["遷移學習", "BatchNorm", "凍結參數", "參數量"],
      distractorTypes: {
        B: "Overgeneralization",
        C: "Partial Truth",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若訓練前另外把骨幹所有 BatchNorm 切成 eval()（或改用不含 BatchNorm 的骨幹，例如 VGG16），running 統計量就會保持預訓練值，「骨幹數值完全不變」的說法才會成立。",
    },
  },
  {
    id: "senior-ml-practice-q165",
    subjectId: "senior-ml",
    prompt:
      "某農業團隊以 CNN 辨識葉片病害，輸入為 8 張 64×64 的彩色影像（下圖，PyTorch 2.5）。執行後兩行 print 的輸出依序為何？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "\n" +
          "x = torch.randn(8, 3, 64, 64)    # 8 張 64×64 彩色葉片影像\n" +
          "conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=2, padding=1)\n" +
          "pool = nn.MaxPool2d(2)\n" +
          "conv2 = nn.Conv2d(16, 32, kernel_size=5)\n" +
          "\n" +
          "h = conv2(pool(conv1(x)))\n" +
          "print(h.shape)\n" +
          "print(sum(p.numel() for p in conv2.parameters()))",
      },
    ],
    choices: [
      { id: "A", text: "torch.Size([8, 32, 28, 28]) 與 12832" },
      { id: "B", text: "torch.Size([8, 32, 12, 12]) 與 12832" },
      { id: "C", text: "torch.Size([8, 32, 12, 12]) 與 12800" },
      { id: "D", text: "torch.Size([8, 32, 16, 16]) 與 12832" },
    ],
    answer: "B",
    explanation:
      "卷積輸出邊長 = ⌊(輸入 ＋ 2×padding − kernel) ÷ stride⌋ ＋ 1。conv1：⌊(64 ＋ 2 − 3) ÷ 2⌋ ＋ 1 = 32；MaxPool2d(2) 減半為 16；conv2 沒有 padding：16 − 5 ＋ 1 = 12，輸出通道 32，所以形狀是 (8, 32, 12, 12)。conv2 的參數量 = 輸入通道 16 × 輸出通道 32 × 5 × 5 ＋ 32 個偏差 = 12,832。",
    choiceExplanations: {
      A: "28 是忽略 conv1 的 stride=2 算出來的：conv1 輸出維持 64，池化後 32，再 32 − 5 ＋ 1 = 28。",
      C: "12800 只算了 16×32×5×5 的卷積核權重，漏掉每個輸出通道各一個、共 32 個偏差；nn.Conv2d 預設 bias=True。",
      D: "16 是把 conv2 當成會保持尺寸的卷積；沒有 padding 的 5×5 卷積每邊會少 2 個像素，16 變成 12。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["Conv2d 輸出尺寸", "參數量", "池化"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Partial Truth",
        D: "Overgeneralization",
      },
      decisionBoundary:
        "若 conv2 改成 padding=2，5×5 卷積就會保持尺寸，形狀變成 (8, 32, 16, 16)，參數量仍是 12832——padding 只改變輸出大小，不改變參數量。",
    },
  },
  {
    id: "senior-ml-practice-q166",
    subjectId: "senior-ml",
    prompt:
      "某銀行要辨識 64×64 灰階支票影像上的 10 種手寫字元，比較一個多層感知器（MLP）與一個小型 CNN 的參數量（下圖）。根據輸出，下列判斷何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import torch.nn as nn\n" +
          "\n" +
          "mlp = nn.Sequential(nn.Flatten(), nn.Linear(64 * 64, 512), nn.ReLU(),\n" +
          "                    nn.Linear(512, 10))\n" +
          "cnn = nn.Sequential(nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),\n" +
          "                    nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),\n" +
          "                    nn.Flatten(), nn.Linear(32 * 16 * 16, 10))\n" +
          "\n" +
          "def count(m):\n" +
          "    return sum(p.numel() for p in m.parameters())\n" +
          "\n" +
          "print(f\"MLP: {count(mlp):,}\")\n" +
          "print(f\"CNN: {count(cnn):,}\")\n" +
          "for name, layer in cnn.named_children():\n" +
          "    if count(layer):\n" +
          "        print(f\"  cnn[{name}] {layer.__class__.__name__}: {count(layer):,}\")",
      },
      {
        kind: "output",
        content:
          "MLP: 2,102,794\n" +
          "CNN: 86,730\n" +
          "  cnn[0] Conv2d: 160\n" +
          "  cnn[3] Conv2d: 4,640\n" +
          "  cnn[7] Linear: 81,930",
      },
    ],
    choices: [
      { id: "A", text: "MLP 的參數約為 CNN 的 24 倍，代表 MLP 的表達能力較強，在這批影像上應優先採用 MLP" },
      { id: "B", text: "CNN 的卷積核在整張影像上共用，參數量與影像大小無關，參數主要集中在最後的 Linear 層" },
      { id: "C", text: "CNN 參數較少，主要是因為兩層 MaxPool2d 本身帶有可學習參數，取代了部分全連接權重" },
      { id: "D", text: "兩者差距主要來自 CNN 用了 padding=1，若改成 padding=0，CNN 的參數量就會接近 MLP" },
    ],
    answer: "B",
    explanation:
      "卷積層的參數只有卷積核與偏差：cnn[0] 為 1×16×3×3 ＋ 16 = 160，cnn[3] 為 16×32×3×3 ＋ 32 = 4,640，不論輸入是 64×64 還是 128×128 都一樣，這就是權重共享。CNN 的 86,730 個參數中，81,930 個（約 94%）都在攤平後的 Linear(8192, 10)；MLP 則因第一層要把 4,096 個像素各自連到 512 個神經元，光這層就有 2,097,664 個參數。對影像而言，CNN 用少得多的參數保留了像素的空間鄰近關係，通常泛化較好。",
    choiceExplanations: {
      A: "數字沒錯（2,102,794 ÷ 86,730 ≈ 24），但參數多不等於比較適合；MLP 把影像攤平後失去像素的鄰近結構，參數多反而在資料有限時更容易過擬合。",
      C: "MaxPool2d 只是在窗格內取最大值，沒有任何可學習參數（輸出中也沒有列出它）；它縮小的是特徵圖尺寸，間接讓後面的 Linear 層變小。",
      D: "padding 不影響卷積層的參數量；改成 padding=0 會讓特徵圖略小（64→62→31→29→14），最後的 Linear 反而更小，CNN 參數更少，離 MLP 更遠。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["權重共享", "參數量", "CNN 與 MLP 比較"],
      distractorTypes: {
        A: "Overgeneralization",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若在 Linear 之前改接全域平均池化（nn.AdaptiveAvgPool2d(1)），Linear 只剩 32×10 ＋ 10 = 330 個參數，整個 CNN 的參數量就幾乎完全與影像大小無關；反之若影像放大到 128×128 而沿用攤平寫法，Linear 會變成原本的四倍大。",
    },
  },
  {
    id: "senior-ml-practice-q167",
    subjectId: "senior-ml",
    prompt:
      "某醫院以 ImageNet 預訓練的 ResNet18 做胸部 X 光三分類（正常／肺炎／其他），需要把模型改成輸出 3 個類別的 logits（下圖，torchvision 0.20）。「改成 3 類輸出」處應填入下列哪一行？",
    figures: [
      {
        kind: "code",
        content:
          "import torch.nn as nn\n" +
          "from torchvision import models\n" +
          "\n" +
          "model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)\n" +
          "# ____（改成 3 類輸出）____\n" +
          "out = model(x)          # 期望 out.shape == (N, 3)",
      },
    ],
    choices: [
      { id: "A", text: "model.fc = nn.Sequential(model.fc, nn.Softmax(dim=1))" },
      { id: "B", text: "model.fc = nn.Linear(model.fc.in_features, 3)" },
      { id: "C", text: "model.classifier[6] = nn.Linear(4096, 3)" },
      { id: "D", text: "model.fc.out_features = 3" },
    ],
    answer: "B",
    explanation:
      "torchvision 的 ResNet 系列最後一層名為 fc，是 nn.Linear(512, 1000)。遷移學習時要用新的 nn.Linear 取代它：輸入維度沿用 model.fc.in_features（512），輸出改成 3。新層的權重隨機初始化、在訓練中學習，輸出直接是 logits，交給 CrossEntropyLoss 即可。",
    choiceExplanations: {
      A: "在原本的 fc 後面再接 Softmax，輸出仍是 1000 維，只是變成機率；而且 CrossEntropyLoss 自己會做 log-softmax，多接一層 Softmax 會讓損失重複壓縮、梯度變小。",
      C: "classifier[6] 是 VGG16、AlexNet 這類模型最後一層的位置，ResNet 沒有 classifier 屬性，執行時拋出 AttributeError。這行寫法放在 VGG16 上才正確。",
      D: "out_features 只是記錄在模組上的屬性值，改它不會重建權重矩陣；weight 仍是 (1000, 512)，輸出仍是 1000 維。",
    },
    topic: "L23302 模型選擇與架構設計",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["遷移學習", "替換分類層", "torchvision"],
      distractorTypes: {
        A: "Layer Confusion",
        C: "Correct in Different Context",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若模型換成 VGG16，要改的是 model.classifier[6] = nn.Linear(4096, 3)；換成 EfficientNet-B0 或 MobileNetV2 則是 classifier[1]——先 print(model) 看最後一層的名稱與輸入維度，再決定要替換哪個屬性。",
    },
  },
  {
    id: "senior-ml-practice-q168",
    subjectId: "senior-ml",
    prompt:
      "某工廠以 LSTM 預測設備的剩餘使用壽命，因為擔心梯度爆炸而加入梯度裁剪（下圖，PyTorch 2.5）。訓練紀錄顯示 clip_grad_norm_ 的回傳值一直是 0，而 step 當下的梯度範數卻有數百。請問問題出在哪裡，最恰當的修正為何？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "\n" +
          "torch.manual_seed(0)\n" +
          "X = torch.randn(64, 50, 4) * 5     # 64 段振動訊號、50 個時間步、4 軸\n" +
          "y = torch.rand(64, 1) * 500        # 剩餘使用壽命（小時）\n" +
          "\n" +
          "class RUL(nn.Module):\n" +
          "    def __init__(self):\n" +
          "        super().__init__()\n" +
          "        self.lstm = nn.LSTM(4, 32, batch_first=True)\n" +
          "        self.head = nn.Linear(32, 1)\n" +
          "\n" +
          "    def forward(self, x):\n" +
          "        out, _ = self.lstm(x)\n" +
          "        return self.head(out[:, -1])\n" +
          "\n" +
          "model = RUL()\n" +
          "opt = torch.optim.SGD(model.parameters(), lr=1e-3)\n" +
          "loss_fn = nn.MSELoss()\n" +
          "\n" +
          "for step in range(3):\n" +
          "    opt.zero_grad()\n" +
          "    loss = loss_fn(model(X), y)\n" +
          "    clipped = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)\n" +
          "    loss.backward()\n" +
          "    actual = torch.sqrt(sum(p.grad.pow(2).sum() for p in model.parameters()))\n" +
          "    opt.step()\n" +
          "    print(f\"step {step}  clip_returned={clipped:.3f}  grad_norm_at_step={actual:.1f}\")",
      },
      {
        kind: "output",
        content:
          "step 0  clip_returned=0.000  grad_norm_at_step=588.9\n" +
          "step 1  clip_returned=0.000  grad_norm_at_step=599.9\n" +
          "step 2  clip_returned=0.000  grad_norm_at_step=659.2",
      },
    ],
    choices: [
      { id: "A", text: "應改用 clip_grad_value_(…, clip_value=1.0) 逐元素裁剪，它不必先算出整體範數，放在原位置即可" },
      { id: "B", text: "裁剪應作用在更新後的參數上，應把 clip_grad_norm_ 移到 opt.step() 之後，讓下一輪從較小值開始" },
      { id: "C", text: "裁剪時本輪的梯度還沒算出來，應把 clip_grad_norm_ 移到 loss.backward() 之後、opt.step() 之前" },
      { id: "D", text: "門檻 1.0 對這個模型太寬鬆，應把 max_norm 調小到 0.1，讓裁剪更積極地壓住每一步過大的梯度" },
    ],
    answer: "C",
    explanation:
      "clip_grad_norm_ 是就地修改參數目前的 .grad。程式在 zero_grad() 之後、backward() 之前呼叫它，這時 .grad 還是空的（PyTorch 2.x 的 zero_grad 預設把梯度設為 None），沒有東西可裁，回傳的總範數就是 0；接著 backward 算出範數數百的梯度，opt.step() 直接拿未裁剪的梯度更新。正確順序是 zero_grad → 前向 → backward → clip_grad_norm_ → step。驗證腳本確認：移到 backward 之後，step 當下的梯度範數被壓到 1.0，第一步的參數變化量恰為學習率 × 1.0。",
    choiceExplanations: {
      A: "換成逐元素裁剪不能解決順序問題：backward 之前沒有任何梯度可裁。實測在 PyTorch 2.5.1 會直接拋出 RuntimeError，其他版本則可能靜默不作用，兩種情況都沒有限制到梯度。",
      B: "梯度裁剪的對象是梯度，不是參數；step 之後才裁，這一步已經用未裁剪的梯度更新完了，下一輪 zero_grad 又會清掉梯度，裁了等於沒裁。實測參數變化量與完全不裁剪相同。",
      D: "門檻再小也沒用，因為裁剪時根本還沒有梯度；改成 0.1 後，參數變化量仍與完全不裁剪一模一樣。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "難",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L4",
      archetype: "Best Engineering Decision",
      concepts: ["梯度裁剪", "梯度爆炸", "訓練迴圈", "LSTM"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Layer Confusion",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若使用混合精度訓練（torch.amp 的 GradScaler），backward 之後還要先呼叫 scaler.unscale_(opt) 再裁剪，否則裁的是被放大過的梯度；但「梯度算完之後、更新之前」這個位置原則不變。",
    },
  },
  {
    id: "senior-ml-practice-q169",
    subjectId: "senior-ml",
    prompt:
      "某線上教育平台訓練學生作答預測模型時，以下列函式決定每個 epoch 的學習率（下圖附部分 epoch 的輸出）。這個函式實作的是哪一種學習率排程？",
    figures: [
      {
        kind: "code",
        content:
          "import math\n" +
          "\n" +
          "def lr_at(epoch, base_lr=1e-3, warmup=5, total=50):\n" +
          "    if epoch < warmup:\n" +
          "        return base_lr * (epoch + 1) / warmup\n" +
          "    progress = (epoch - warmup) / (total - warmup)\n" +
          "    return 0.5 * base_lr * (1 + math.cos(math.pi * progress))\n" +
          "\n" +
          "print([f\"{lr_at(e):.1e}\" for e in (0, 2, 4, 5, 15, 27, 40, 49)])",
      },
      {
        kind: "output",
        caption: "依序為 epoch 0、2、4、5、15、27、40、49 的學習率",
        content: "['2.0e-04', '6.0e-04', '1.0e-03', '1.0e-03', '8.8e-04', '5.2e-04', '1.2e-04', '1.2e-06']",
      },
    ],
    choices: [
      { id: "A", text: "階梯式衰減：每隔固定的 epoch 數就把學習率乘上固定的倍率，其餘的輪次維持不變" },
      { id: "B", text: "線性暖身接餘弦退火：先在前幾輪由小線性升高，之後沿餘弦曲線平滑地降到接近 0" },
      { id: "C", text: "依驗證損失調降：驗證損失連續數輪沒有改善時，才把學習率乘上一個固定倍率調低" },
      { id: "D", text: "週期性學習率：讓學習率在上下界之間反覆地線性升降，形成鋸齒或三角形的波形" },
    ],
    answer: "B",
    explanation:
      "函式分兩段：epoch < warmup（前 5 輪）時學習率為 base_lr ×（epoch ＋ 1）÷ 5，從 2×10⁻⁴ 等差升到 1×10⁻³，這是線性暖身；之後以 0.5 × base_lr ×（1 ＋ cos(π × 進度)）計算，進度從 0 走到接近 1，學習率沿半個餘弦週期由 1×10⁻³ 平滑降到接近 0（第 49 輪為 1.2×10⁻⁶）。暖身避免訓練初期以大學習率破壞初始權重（Transformer 與大批次訓練常用），餘弦退火則讓後期以小步長細調。",
    choiceExplanations: {
      A: "階梯式衰減會在某些輪次突然降一截、其餘輪次不變；這裡暖身之後每一輪的學習率都不同，是連續變化而不是階梯。",
      C: "依驗證損失調降（ReduceLROnPlateau）必須讀入驗證損失才能決定是否調降；這個函式只吃 epoch 與固定的超參數，學習率在訓練前就完全決定了。",
      D: "週期性學習率會在上下界之間反覆升降；這裡只在前 5 輪上升一次，之後單調下降到結束，沒有第二個週期。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["學習率排程", "暖身", "餘弦退火"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若讓進度在超過 1 之後從 0 重新起算，學習率會一再跳回高點，就成了帶週期重啟的餘弦退火（SGDR，對應 CosineAnnealingWarmRestarts）；若拿掉 epoch < warmup 那段，則是單純的餘弦退火（CosineAnnealingLR）。",
    },
  },
  {
    id: "senior-ml-practice-q170",
    subjectId: "senior-ml",
    prompt:
      "某農業研究單位要以 8×8 灰階影像辨識 10 種害蟲，先用 scikit-learn 1.5 內建的 load_digits 當替代資料驗證流程：200 張訓練、400 張驗證，以兩層各 256 個神經元的 MLP 與 Adam 訓練 60 輪，每 10 輪印出一次損失（下圖）。根據輸出，下列判斷何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import torch\n" +
          "import torch.nn as nn\n" +
          "from sklearn.datasets import load_digits\n" +
          "from sklearn.model_selection import train_test_split\n" +
          "\n" +
          "X, y = load_digits(return_X_y=True)          # 8×8 灰階影像，代替害蟲影像\n" +
          "X = torch.tensor(X / 16.0, dtype=torch.float32)\n" +
          "y = torch.tensor(y)\n" +
          "Xtr, Xva, ytr, yva = train_test_split(X, y, train_size=200, test_size=400,\n" +
          "                                      random_state=0, stratify=y)\n" +
          "\n" +
          "torch.manual_seed(0)\n" +
          "model = nn.Sequential(nn.Linear(64, 256), nn.ReLU(),\n" +
          "                      nn.Linear(256, 256), nn.ReLU(), nn.Linear(256, 10))\n" +
          "opt = torch.optim.Adam(model.parameters(), lr=1e-2)\n" +
          "loss_fn = nn.CrossEntropyLoss()\n" +
          "\n" +
          "for epoch in range(1, 61):\n" +
          "    model.train()\n" +
          "    opt.zero_grad()\n" +
          "    loss = loss_fn(model(Xtr), ytr)\n" +
          "    loss.backward()\n" +
          "    opt.step()\n" +
          "    model.eval()\n" +
          "    with torch.no_grad():\n" +
          "        val_loss = loss_fn(model(Xva), yva).item()\n" +
          "    if epoch % 10 == 0:\n" +
          "        print(f\"epoch {epoch:2d}  train_loss={loss.item():.4f}  val_loss={val_loss:.4f}\")",
      },
      {
        kind: "output",
        content:
          "epoch 10  train_loss=0.3792  val_loss=0.2843\n" +
          "epoch 20  train_loss=0.0456  val_loss=0.2672\n" +
          "epoch 30  train_loss=0.0159  val_loss=0.3599\n" +
          "epoch 40  train_loss=0.0039  val_loss=0.4128\n" +
          "epoch 50  train_loss=0.0016  val_loss=0.4021\n" +
          "epoch 60  train_loss=0.0008  val_loss=0.4222",
      },
    ],
    choices: [
      { id: "A", text: "驗證損失在第 20 輪附近最低後回升、訓練損失仍降向 0，屬過擬合，應以早停保留驗證損失最低時的權重" },
      { id: "B", text: "訓練損失仍在持續下降，代表模型還沒學完，應再多訓練 60 輪，讓驗證損失跟著訓練損失一起降下來" },
      { id: "C", text: "訓練與驗證損失的差距越拉越大屬於欠擬合，應把隱藏層加寬到 1024 個神經元以提高模型的容量" },
      { id: "D", text: "驗證損失回升是學習率太小、卡在局部極小值所致，應把學習率調高到 5e-2 讓模型跳出局部極小值" },
    ],
    answer: "A",
    explanation:
      "訓練損失從 0.38 一路降到 0.0008，驗證損失卻在第 20 輪達到最低的 0.2672 後回升到 0.42——模型開始記住 200 張訓練樣本的細節，對驗證資料的預測反而變差，這是過擬合的典型曲線。早停（early stopping）在驗證損失連續數輪沒有改善時停止，並還原到驗證損失最低時的權重；驗證腳本以 patience=10 實測，保留下來的權重驗證損失明顯低於跑滿 60 輪的結果。另可搭配 Dropout、權重衰減或資料擴增。",
    choiceExplanations: {
      B: "訓練損失下降只代表模型越來越貼合訓練資料；實測再多訓練 60 輪，驗證損失仍停在高點，遠高於第 20 輪附近的最低點。",
      C: "欠擬合的特徵是訓練損失本身降不下來；這裡訓練損失已趨近 0，是容量過剩而不是不足。實測加寬到 1024 後訓練損失更低，驗證損失照樣回升。",
      D: "訓練損失持續下降，表示最佳化本身沒有卡住，驗證損失回升與學習率太小無關；實測把學習率調高到 5e-2，驗證損失最後仍明顯高於它的最低點。",
    },
    topic: "L23304 模型調整與優化",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["過擬合", "早停", "學習曲線"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Terminology Swap",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若訓練損失與驗證損失都停在高點、兩者差距很小，就是欠擬合，這時加大模型容量或延長訓練才是對的方向；判斷過擬合或欠擬合要看兩條曲線的相對關係，而不是只看其中一條。",
    },
  },
  {
    id: "senior-ml-practice-q171",
    subjectId: "senior-ml",
    prompt:
      "某銀行以 Keras 3 建立信用卡盜刷偵測的多層感知器，輸入為 20 項交易特徵。執行下列程式後，model.summary() 最後顯示的 Total params 與 Trainable params 分別為何？",
    figures: [
      {
        kind: "code",
        content:
          "import keras\n" +
          "from keras import layers\n" +
          "\n" +
          "model = keras.Sequential([\n" +
          "    keras.Input(shape=(20,)),\n" +
          "    layers.Dense(64, activation=\"relu\"),\n" +
          "    layers.BatchNormalization(),\n" +
          "    layers.Dense(1, activation=\"sigmoid\"),\n" +
          "])\n" +
          "model.summary()",
      },
    ],
    choices: [
      { id: "A", text: "Total params 1,665；Trainable params 1,665" },
      { id: "B", text: "Total params 1,665；Trainable params 1,537" },
      { id: "C", text: "Total params 1,409；Trainable params 1,409" },
      { id: "D", text: "Total params 1,600；Trainable params 1,472" },
    ],
    answer: "B",
    explanation:
      "逐層計算：Dense(64) 有 20×64 個權重加 64 個偏差，共 1,344；BatchNormalization 對每個特徵各有 gamma、beta、moving_mean、moving_variance 四組，共 4×64＝256，其中 gamma、beta 由梯度更新（128 個可訓練），moving_mean、moving_variance 是訓練時以移動平均累積的統計量、不經梯度更新（128 個不可訓練）；Dense(1) 為 64＋1＝65。總參數 1,344＋256＋65＝1,665，可訓練參數 1,344＋128＋65＝1,537（B），summary 另會列出 Non-trainable params 128。",
    choiceExplanations: {
      A: "把 BatchNormalization 的四組參數都算成可訓練。moving_mean 與 moving_variance 是前向傳播時以移動平均更新的統計量，不吃梯度，summary 會把這 128 個列在 Non-trainable params。",
      C: "把 BatchNormalization 當成像 Dropout 一樣沒有參數的層，少算了 256 個；BN 雖然不改變張量形狀，每個特徵仍帶有 gamma、beta 與兩個移動統計量。",
      D: "漏算了 Dense 層的偏差：第一層少 64 個、輸出層少 1 個。Dense 預設 use_bias=True，參數量是（輸入維度＋1）×輸出單元數。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["參數量計算", "批次正規化", "可訓練參數"],
      constraints: ["compute"],
      distractorTypes: {
        A: "Partial Truth",
        C: "Neighbor Concept",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若把 BatchNormalization 換成 Dropout(0.3)，總參數會降為 1,409 且全部可訓練；若保留 BN 但設 trainable=False（遷移學習常見的凍結），可訓練參數就變成 1,409。",
    },
  },
  {
    id: "senior-ml-practice-q172",
    subjectId: "senior-ml",
    prompt:
      "某醫院以 Keras 3 訓練 30 日再入院風險的二元分類模型，訓練集 300 筆、驗證集 100 筆病歷（30 項特徵，已標準化）。訓練程式與每隔數輪擷取的紀錄如下，下列判讀與後續處置何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "model = keras.Sequential([\n" +
          "    keras.Input(shape=(30,)),\n" +
          "    layers.Dense(256, activation=\"relu\"),\n" +
          "    layers.Dense(256, activation=\"relu\"),\n" +
          "    layers.Dense(1, activation=\"sigmoid\"),\n" +
          "])\n" +
          "model.compile(optimizer=keras.optimizers.Adam(1e-3),\n" +
          "              loss=\"binary_crossentropy\", metrics=[\"accuracy\"])\n" +
          "hist = model.fit(X_tr, y_tr, validation_data=(X_va, y_va),\n" +
          "                 epochs=40, batch_size=32, verbose=0)\n" +
          "H = hist.history\n" +
          "for e in [1, 5, 10, 20, 30, 40]:\n" +
          "    print(f\"epoch {e:2d}  loss={H['loss'][e-1]:.3f}  acc={H['accuracy'][e-1]:.3f}  \"\n" +
          "          f\"val_loss={H['val_loss'][e-1]:.3f}  val_acc={H['val_accuracy'][e-1]:.3f}\")",
      },
      {
        kind: "output",
        content:
          "epoch  1  loss=0.655  acc=0.623  val_loss=0.569  val_acc=0.740\n" +
          "epoch  5  loss=0.309  acc=0.890  val_loss=0.501  val_acc=0.790\n" +
          "epoch 10  loss=0.129  acc=0.983  val_loss=0.579  val_acc=0.750\n" +
          "epoch 20  loss=0.015  acc=1.000  val_loss=0.826  val_acc=0.750\n" +
          "epoch 30  loss=0.004  acc=1.000  val_loss=0.991  val_acc=0.760\n" +
          "epoch 40  loss=0.002  acc=1.000  val_loss=1.106  val_acc=0.760",
      },
    ],
    choices: [
      { id: "A", text: "第 5 輪後驗證損失回升，是學習率過低、模型卡在平坦區域學不動所致；應把 Adam 學習率調高到 1e-2 重新訓練" },
      { id: "B", text: "第 5 輪後訓練損失續降、驗證損失回升，屬於過擬合；應以 EarlyStopping 監看 val_loss 並還原最佳權重" },
      { id: "C", text: "訓練準確率已達 1.000，表示模型已充分收斂、特徵學得夠完整；應再加大訓練輪數，讓驗證損失也跟著逐步下降" },
      { id: "D", text: "驗證損失始終高於訓練損失，是模型容量不足的欠擬合徵兆；應把兩層隱藏層加寬到 512 個神經元並延長訓練" },
    ],
    answer: "B",
    explanation:
      "判讀要同時看兩條曲線：訓練損失由 0.655 一路降到 0.002、訓練準確率達 1.000，驗證損失卻在第 5 輪的 0.501 觸底後持續上升到 1.106，驗證準確率也從 0.790 回落。兩條曲線分岔就是過擬合——兩層各 256 個神經元對 300 筆樣本而言容量過大，開始記住訓練集的雜訊。最直接的處置是 EarlyStopping(monitor=\"val_loss\", restore_best_weights=True)，在驗證損失不再改善時停止，並把權重還原到最佳輪（B）；搭配 Dropout、L2 正則化或縮小網路也是同一方向的處置。",
    choiceExplanations: {
      A: "訓練損失在 40 輪內降了兩個數量級，學習速度沒有問題；學習率調高只會讓模型更快擬合訓練集，實測學習率 1e-2 時第 40 輪的驗證損失仍遠高於 0.501。",
      C: "訓練準確率 1.000 正是模型已經記住訓練集的訊號，不代表泛化良好；紀錄顯示第 10、20、30、40 輪的驗證損失單調上升，再加輪數只會更糟。",
      D: "欠擬合的特徵是訓練損失本身就降不下來，這裡訓練損失已接近 0；加寬網路是增加容量、延長訓練是讓模型記得更牢，兩者都會讓過擬合更嚴重，方向剛好相反。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["過擬合", "早停", "學習曲線"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Overgeneralization",
        D: "Wrong Trade-off",
      },
      crossNode: "L23304",
      decisionBoundary:
        "若驗證損失與訓練損失同步停在高點、訓練準確率也只有六成左右，才是欠擬合，處置就要反過來改成加大模型容量或延長訓練。",
    },
  },
  {
    id: "senior-ml-practice-q173",
    subjectId: "senior-ml",
    prompt:
      "某工廠以 Keras 3 建立馬達故障分類模型，輸入 12 項感測特徵，標籤 y 為 0～4 的整數（5 種故障類別、每筆只屬於一類，未做 one-hot 編碼）。下列程式空白處的輸出層與損失函數，哪一種搭配正確？",
    figures: [
      {
        kind: "code",
        content:
          "model = keras.Sequential([\n" +
          "    keras.Input(shape=(12,)),\n" +
          "    layers.Dense(32, activation=\"relu\"),\n" +
          "    ______,                      # 輸出層\n" +
          "])\n" +
          "model.compile(optimizer=\"adam\", loss=______, metrics=[\"accuracy\"])\n" +
          "model.fit(X, y, epochs=20, batch_size=32)",
      },
    ],
    choices: [
      { id: "A", text: "Dense(5, activation=\"softmax\")，loss=\"categorical_crossentropy\"" },
      { id: "B", text: "Dense(5, activation=\"softmax\")，loss=SparseCategoricalCrossentropy(from_logits=True)" },
      { id: "C", text: "Dense(1, activation=\"sigmoid\")，loss=\"binary_crossentropy\"" },
      { id: "D", text: "Dense(5, activation=\"softmax\")，loss=\"sparse_categorical_crossentropy\"" },
    ],
    answer: "D",
    explanation:
      "整數標籤配上多類別單選，輸出層用 5 個單元的 softmax 給出機率分布，損失用 sparse_categorical_crossentropy——它直接以整數標籤取出對應類別的機率再算負對數，不需要先轉 one-hot（D）。實測其損失與手算的 −mean(log p[i, y_i]) 完全一致。",
    choiceExplanations: {
      A: "categorical_crossentropy 要求標籤是 one-hot 的（樣本數, 5）矩陣，餵入形狀為（樣本數,）的整數標籤會直接拋出 ValueError（target 與 output 形狀不符）；先用 keras.utils.to_categorical 轉換後才適用。",
      B: "from_logits=True 是告訴損失函數「輸入是尚未經過 softmax 的分數」，但輸出層已經做過 softmax，等於做了兩次。程式照樣能跑，損失卻被壓在 log 5≈1.61 附近、梯度很小；from_logits=True 應搭配不加 activation 的 Dense(5)。",
      C: "sigmoid 單一輸出只能表示「是／否」兩類。Keras 不會阻止 0～4 的標籤進入 binary_crossentropy，程式能跑，但以 0.5 為門檻時預測只會是 0 或 1，永遠分不出類別 2、3、4。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Scenario Selection",
      concepts: ["稀疏類別交叉熵", "softmax", "損失函數選擇"],
      distractorTypes: {
        A: "Correct in Different Context",
        B: "Neighbor Concept",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若標籤先用 to_categorical 轉成 one-hot，答案就換成 categorical_crossentropy；若輸出層拿掉 softmax、只輸出 logits，則要改用 from_logits=True 的寫法。",
    },
  },
  {
    id: "senior-ml-practice-q174",
    subjectId: "senior-ml",
    prompt:
      "某線上學習平台記錄每位學生 30 週、每週 8 項學習行為指標，想預測每週的測驗分數。工程師以 Keras 3 寫出下列程式，執行後印出的兩個值為何？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "import keras\n" +
          "from keras import layers\n" +
          "\n" +
          "model = keras.Sequential([\n" +
          "    keras.Input(shape=(30, 8)),\n" +
          "    layers.Dense(16, activation=\"relu\"),\n" +
          "    layers.Dense(1),\n" +
          "])\n" +
          "out = model.predict(np.zeros((4, 30, 8)), verbose=0)\n" +
          "print(out.shape, model.count_params())",
      },
    ],
    choices: [
      { id: "A", text: "(4, 30, 1) 161" },
      { id: "B", text: "(4, 1) 161" },
      { id: "C", text: "(4, 1) 3873" },
      { id: "D", text: "(4, 30, 16) 161" },
    ],
    answer: "A",
    explanation:
      "Keras 的 Dense 只作用在輸入的最後一個維度，其餘維度原樣保留：(4, 30, 8) 經 Dense(16) 變成 (4, 30, 16)，再經 Dense(1) 變成 (4, 30, 1)，等於對 30 週各自套用同一組權重（A）。參數量也只看最後一維：第一層 8×16＋16＝144，第二層 16×1＋1＝17，合計 161，與週數 30 無關。這正好符合「每週各預測一個分數」的需求。",
    choiceExplanations: {
      B: "以為 Dense 會自動把 (30, 8) 攤平。攤平必須明確加上 Flatten 層，否則前面的時間維度會被保留下來。",
      C: "3,873 是先接 Flatten、把 30×8＝240 維攤平後的參數量（240×16＋16，再加 17），那時輸出才會是 (4, 1)；本程式並沒有 Flatten。",
      D: "(4, 30, 16) 是第一層 Dense(16) 的輸出形狀，最後一層 Dense(1) 還會把最後一維壓成 1。",
    },
    topic: "L23203 深度學習原理與框架",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["張量形狀", "全連接層", "參數量計算"],
      constraints: ["compute"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Correct in Different Context",
        D: "Layer Confusion",
      },
      decisionBoundary:
        "若在 Input 之後加上 layers.Flatten()，輸出會變成 (4, 1)、參數量變成 3,873——此時模型改成「看完整段 30 週只預測一個分數」。",
    },
  },
  {
    id: "senior-ml-practice-q175",
    subjectId: "senior-ml",
    prompt:
      "某農業研究單位以 Keras 3 建立田區產量迴歸模型（12 項土壤與氣象特徵，目標值已標準化），並加入早停機制。程式與輸出如下，下列解讀何者正確？",
    figures: [
      {
        kind: "code",
        content:
          "model.compile(optimizer=\"adam\", loss=\"mse\")\n" +
          "es = keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)\n" +
          "hist = model.fit(X_tr, y_tr, validation_data=(X_va, y_va),\n" +
          "                 epochs=100, batch_size=16, callbacks=[es], verbose=0)\n" +
          "vl = hist.history[\"val_loss\"]\n" +
          "print(\"epochs run:\", len(vl))\n" +
          "print(\"last val_loss:\", round(vl[-1], 4))\n" +
          "print(\"best epoch:\", int(np.argmin(vl)) + 1, \" val_loss:\", round(min(vl), 4))\n" +
          "print(\"evaluate:\", round(model.evaluate(X_va, y_va, verbose=0), 4))",
      },
      {
        kind: "output",
        content:
          "epochs run: 9\n" +
          "last val_loss: 0.0667\n" +
          "best epoch: 6  val_loss: 0.0661\n" +
          "evaluate: 0.0661",
      },
    ],
    choices: [
      { id: "A", text: "第 6 輪之後連續 3 輪未再改善，因此在第 9 輪停止；目前模型保留的是第 6 輪、驗證損失最低時的權重" },
      { id: "B", text: "目前模型保留的是第 9 輪的權重，evaluate 與 last val_loss 的差距只是推論時的隨機誤差" },
      { id: "C", text: "未指定 monitor 時早停監看的是訓練集 loss，第 9 輪停止是因為訓練損失已經不再下降" },
      { id: "D", text: "evaluate 比第 9 輪的 val_loss 還低，表示驗證集參與了權重更新，訓練流程發生資料洩漏" },
    ],
    answer: "A",
    explanation:
      "EarlyStopping 未指定 monitor 時預設為 val_loss。第 6 輪的驗證損失 0.0661 是最低點，之後第 7、8、9 輪都沒有更低，累積滿 patience=3 輪就在第 9 輪停止。restore_best_weights=True 讓訓練結束時把權重換回第 6 輪的版本，所以 evaluate 得到的是第 6 輪的 0.0661，而不是最後一輪的 0.0667（A）。",
    choiceExplanations: {
      B: "這段推論沒有 Dropout 之類的隨機性，相同權重的 evaluate 結果是固定的；若拿掉 restore_best_weights，evaluate 就會正好等於 last val_loss 的 0.0667，差距來自權重被還原。",
      C: "EarlyStopping() 的 monitor 預設值是 \"val_loss\"，看的是驗證集；要依訓練損失早停必須明寫 monitor=\"loss\"，而那樣就無法偵測過擬合。",
      D: "驗證集只用來計算 val_loss，從未參與梯度更新；evaluate 較低是因為權重已還原到驗證損失最低的第 6 輪，屬於早停的正常行為。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["早停", "restore_best_weights", "驗證損失"],
      distractorTypes: {
        B: "Partial Truth",
        C: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若拿掉 restore_best_weights=True（預設為 False），模型會停在第 9 輪的權重，evaluate 就等於 last val_loss 的 0.0667。",
    },
  },
  {
    id: "senior-ml-practice-q176",
    subjectId: "senior-ml",
    prompt:
      "某銀行的違約預測模型輸出每位客戶的違約機率 p，風控團隊以下列 NumPy 函式評估模型，其中 y 為實際是否違約（0／1）。此函式計算的是哪一個評估指標？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "\n" +
          "def score(y, p, eps=1e-15):\n" +
          "    p = np.clip(p, eps, 1 - eps)\n" +
          "    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))",
      },
    ],
    choices: [
      { id: "A", text: "二元交叉熵（log loss），對信心十足卻判錯的機率給予極重的懲罰" },
      { id: "B", text: "Brier 分數，以預測機率與實際標籤之差的平方平均衡量校準程度" },
      { id: "C", text: "預測機率本身的二元熵，衡量模型輸出有多不確定、與實際標籤無關" },
      { id: "D", text: "均方對數誤差（MSLE），先取對數再平方，適用於右偏的迴歸目標" },
    ],
    answer: "A",
    explanation:
      "函式對每筆樣本取 y·log p＋(1−y)·log(1−p)，也就是「實際類別所對應機率」的對數，再取負號平均——這正是二元交叉熵，與 sklearn.metrics.log_loss 的結果一致（A）。clip 把 p 限制在 (eps, 1−eps)，是為了避免 log(0) 產生無限大。實際違約（y=1）卻預測 p=0.01 時，單筆損失約 4.6，遠高於預測 0.4 時的 0.92，因此特別懲罰「很有把握地猜錯」。",
    choiceExplanations: {
      B: "Brier 分數是 mean((p − y)²)，函式裡沒有平方差，只有對數。兩者都能評估機率品質，但 Brier 對單筆錯誤的懲罰上限是 1，交叉熵沒有上限。",
      C: "二元熵是 −[p·log p＋(1−p)·log(1−p)]，對數前的權重是 p 自己；此函式的權重是實際標籤 y，衡量的是預測與答案的差距，改動 y 結果就會改變。",
      D: "MSLE 是 mean((log(1+y) − log(1+p))²)，用於非負的迴歸目標；此函式沒有平方，且 y 只取 0／1，是分類用的指標。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["交叉熵", "log loss", "評估指標"],
      distractorTypes: {
        B: "Neighbor Concept",
        C: "Terminology Swap",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若函式改成 np.mean((p - y) ** 2)，算的就是 Brier 分數；若把對數前的權重 y 換成 p 本身，才是預測分布自身的熵。",
    },
  },
  {
    id: "senior-ml-practice-q177",
    subjectId: "senior-ml",
    prompt:
      "某醫院比較兩個住院天數預測模型，以 8 位病人的實際天數與預測值手寫 MAE 與 RMSE。病房管理者最擔心的是「嚴重低估住院天數，導致床位調度不及」。程式與輸出如下，下列判讀何者最合理？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "\n" +
          "y_true  = np.array([4, 6, 3, 8, 5, 7, 2, 12])\n" +
          "model_a = np.array([4.5, 5.5, 3.5, 7.5, 5.5, 6.5, 2.5, 3.0])\n" +
          "model_b = np.array([6.0, 4.0, 5.0, 6.0, 7.0, 5.0, 4.0, 10.0])\n" +
          "\n" +
          "def mae(y, p):\n" +
          "    return np.mean(np.abs(y - p))\n" +
          "\n" +
          "def rmse(y, p):\n" +
          "    return np.sqrt(np.mean((y - p) ** 2))\n" +
          "\n" +
          "for name, p in [(\"model_a\", model_a), (\"model_b\", model_b)]:\n" +
          "    print(f\"{name}: MAE={mae(y_true, p):.3f}  RMSE={rmse(y_true, p):.3f}\")",
      },
      {
        kind: "output",
        content:
          "model_a: MAE=1.562  RMSE=3.216\n" +
          "model_b: MAE=2.000  RMSE=2.000",
      },
    ],
    choices: [
      { id: "A", text: "model_a 的 MAE 較低，代表它對每一位病人的預測誤差都比 model_b 小，應直接採用 model_a" },
      { id: "B", text: "RMSE 單位是「天²」而 MAE 是「天」，兩者單位不同，所以同一模型的這兩個數字不能並列比較" },
      { id: "C", text: "model_a 的 RMSE 約為自身 MAE 的兩倍，顯示誤差集中在少數病人；依此風險考量應偏好 model_b" },
      { id: "D", text: "兩個模型的 MSE 排名會與 MAE 相同，所以即使改用 MSE 評估，結論仍然是 model_a 比較好" },
    ],
    answer: "C",
    explanation:
      "MAE 對每筆誤差一視同仁，RMSE 先平方再開根號，大誤差會被放大。model_a 的 MAE 1.562 低於 model_b 的 2.000，但 RMSE 3.216 約是自身 MAE 的兩倍；對照資料，它對 7 位病人都只差 0.5 天，卻把住院 12 天的病人預測成 3 天、低估了 9 天。model_b 每位病人都差 2 天，MAE 與 RMSE 相等，代表誤差分布均勻、最多只差 2 天。管理者在意的正是嚴重低估，因此應偏好 model_b（C）。RMSE 明顯大於 MAE，是「少數大誤差」最好用的快速訊號。",
    choiceExplanations: {
      A: "MAE 是平均值，會把一筆 9 天的低估與七筆 0.5 天的小誤差平均掉；第 8 位病人 model_a 誤差 9 天，model_b 只差 2 天。",
      B: "RMSE 是 MSE 開根號，單位已經回到「天」；把天數換算成小時，MAE 與 RMSE 會一起放大 24 倍，兩者可以直接比較。「天²」是 MSE 的單位。",
      D: "MSE 是 RMSE 的平方，排名與 RMSE 相同而非與 MAE 相同：model_a 的 MSE 約 10.34、model_b 為 4.00，改用 MSE 反而會選 model_b。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Troubleshooting",
      concepts: ["MAE", "RMSE", "離群誤差"],
      constraints: ["quality"],
      distractorTypes: {
        A: "Overgeneralization",
        B: "Terminology Swap",
        D: "Partial Truth",
      },
      decisionBoundary:
        "若管理者在意的是「平均每位病人差幾天」而非最壞情況，MAE 較低的 model_a 反而是較好的選擇——選指標要看錯誤的代價結構。",
    },
  },
  {
    id: "senior-ml-practice-q178",
    subjectId: "senior-ml",
    prompt:
      "某工廠以產線感測資料訓練瑕疵品偵測模型。X、y 依生產時間由舊到新排序，共 1,000 筆，瑕疵品（y=1）約占 5%。訓練程式如下（Keras 3），關於這段程式的敘述，下列哪一組全部正確？",
    figures: [
      {
        kind: "code",
        content:
          "model = keras.Sequential([\n" +
          "    keras.Input(shape=(8,)),\n" +
          "    layers.Dense(16, activation=\"relu\"),\n" +
          "    layers.Dense(1, activation=\"sigmoid\"),\n" +
          "])\n" +
          "model.compile(optimizer=\"adam\", loss=\"binary_crossentropy\", metrics=[\"accuracy\"])\n" +
          "es = keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)\n" +
          "hist = model.fit(X, y, validation_split=0.2, epochs=50, batch_size=32,\n" +
          "                 shuffle=True, class_weight={0: 1, 1: 19}, callbacks=[es])",
      },
      {
        kind: "note",
        content:
          "① validation_split=0.2 取的是 X、y 最後 20% 的資料，在本例即生產時間最新的 200 筆\n" +
          "② shuffle=True 會先把全部資料洗牌，再切出驗證集，所以驗證集是隨機抽樣的 200 筆\n" +
          "③ 若模型把所有樣本都判為良品，訓練準確率仍可能達到約 0.95\n" +
          "④ class_weight 讓瑕疵品樣本的損失乘上 19 倍，促使模型更重視少數類別\n" +
          "⑤ 未指定 monitor 的 EarlyStopping 預設監看的是 val_accuracy",
      },
    ],
    choices: [
      { id: "A", text: "①②⑤" },
      { id: "B", text: "②③④" },
      { id: "C", text: "①③⑤" },
      { id: "D", text: "①③④" },
    ],
    answer: "D",
    explanation:
      "① 對：validation_split 在洗牌之前直接取陣列最後 20%，資料依時間排序時就是最新的 200 筆（實測 val_loss 與 model.evaluate(X[-200:], y[-200:]) 完全一致）。③ 對：瑕疵品只占約 5%，全部判為良品的準確率約 0.95，因此 accuracy 在不平衡資料上幾乎沒有參考價值，應改看召回率、PR-AUC 等指標。④ 對：class_weight 會把每筆樣本的損失乘上所屬類別的權重，與對瑕疵品給 sample_weight=19 完全等價。② 錯在順序：shuffle 只打亂切分後的訓練部分，驗證集不參與洗牌。⑤ 錯：EarlyStopping 未指定 monitor 時預設是 val_loss。故選 ①③④（D）。",
    choiceExplanations: {
      A: "含 ② 與 ⑤。Keras 是先切出最後 20% 再洗牌訓練部分，驗證集不是隨機抽樣；EarlyStopping 預設監看 val_loss 而不是 val_accuracy。",
      B: "含 ②、漏掉 ①。shuffle=True 不影響驗證集的選取；若想隨機切分，要先自行打亂資料，或用 train_test_split 切好後改傳 validation_data。",
      C: "含 ⑤、漏掉 ④。EarlyStopping() 的 monitor 預設值是 \"val_loss\"，要依準確率早停必須明寫 monitor=\"val_accuracy\"；class_weight 確實會把瑕疵品的損失放大 19 倍。",
    },
    topic: "L23303 模型訓練、評估與驗證",
    difficulty: "中",
    source: "generated",
    sourceRef: "工廠",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["validation_split", "類別不平衡", "class_weight", "早停"],
      constraints: ["data_quality"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Neighbor Concept",
        C: "Correct in Different Context",
      },
      decisionBoundary:
        "若資料是隨機順序而非依時間排序，① 的「最新 200 筆」就不成立，但「取最後 20%」的行為不變；依時間排序時，這反而剛好構成合理的時序驗證。",
    },
  },
  {
    id: "senior-ml-practice-q179",
    subjectId: "senior-ml",
    prompt:
      "某國中老師想讓學生體會機率直覺與實際計算的落差，以 NumPy 寫了下列 Monte Carlo 模擬（每年以 365 天計、生日均勻分布）。這段程式估計的是下列哪一個機率？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "\n" +
          "rng = np.random.default_rng(2024)\n" +
          "n_trials = 100_000\n" +
          "b = rng.integers(1, 366, size=(n_trials, 30))\n" +
          "b.sort(axis=1)\n" +
          "hit = (np.diff(b, axis=1) == 0).any(axis=1)\n" +
          "print(hit.mean())",
      },
    ],
    choices: [
      { id: "A", text: "全班 30 位學生中，恰好只有一對學生同一天生日的機率" },
      { id: "B", text: "某位指定學生與班上其他 29 人中任一人同天生日的機率" },
      { id: "C", text: "全班 30 位學生中，至少有兩位學生同一天生日的機率" },
      { id: "D", text: "全班 30 位學生的生日全部落在不同日期上的機率" },
    ],
    answer: "C",
    explanation:
      "每次試驗抽 30 個 1～365 的生日並排序，排序後相鄰兩數相等就代表有人同天生日；any(axis=1) 判斷「這一班是否至少出現一組重複」，最後取平均得到事件發生的比例，因此估計的是「至少兩人同天生日」（C）。理論值為 1 − (365×364×…×336)／365³⁰ ≈ 0.706，模擬結果約為 0.706。",
    choiceExplanations: {
      A: "any 只問有沒有重複，三人同天或出現兩對以上也算命中；「恰好一對」的理論值約 0.38，明顯小於模擬結果。",
      B: "指定某位學生時，機率是 1 − (364/365)²⁹ ≈ 0.076；程式比較的是全班任兩人，並沒有固定某一位學生。",
      D: "全部落在不同日期是這個事件的補集，機率約 0.294；程式計算的是出現重複（hit 為 True）的比例。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "教育",
    meta: {
      cognitiveLevel: "L2",
      archetype: "Concept Boundary",
      concepts: ["蒙地卡羅模擬", "生日問題", "補集"],
      distractorTypes: {
        A: "Partial Truth",
        B: "Correct in Different Context",
        D: "Neighbor Concept",
      },
      decisionBoundary:
        "若把最後一行改成 (~hit).mean()，估計的就變成「30 人生日全部不同」的機率，約 0.294。",
    },
  },
  {
    id: "senior-ml-practice-q180",
    subjectId: "senior-ml",
    prompt:
      "某農業試驗所有 30 塊試驗田的每公頃產量 x（NumPy 一維陣列），想以拔靴法（bootstrap）估計平均產量的 95% 信賴區間。下列程式的 ① 與 ② 應如何填寫？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "\n" +
          "rng = np.random.default_rng(42)\n" +
          "means = []\n" +
          "for _ in range(5000):\n" +
          "    s = ①\n" +
          "    means.append(s.mean())\n" +
          "lo, hi = ②",
      },
    ],
    choices: [
      { id: "A", text: "① rng.choice(x, size=len(x), replace=False)；② np.percentile(means, [5, 95])" },
      { id: "B", text: "① rng.choice(x, size=len(x) // 2, replace=True)；② np.percentile(means, [2.5, 97.5])" },
      { id: "C", text: "① rng.choice(x, size=len(x), replace=True)；② np.percentile(means, [2.5, 97.5])" },
      { id: "D", text: "① rng.choice(x, size=len(x), replace=True)；② np.percentile(means, [0.025, 0.975])" },
    ],
    answer: "C",
    explanation:
      "拔靴法模擬「從母體再抽一次同樣大小的樣本」：每次自原資料取後放回抽 n＝30 筆（replace=True、size=len(x)），算出平均數；重複 5000 次後，平均數分布的第 2.5 與第 97.5 百分位就是 95% 信賴區間的兩端（C）。np.percentile 的 q 以 0～100 表示。實測此區間寬度與 2×1.96×s/√n 相差不到一成。",
    choiceExplanations: {
      A: "不放回又抽滿 30 筆，每次得到的只是原資料重新排列，平均數完全相同，區間寬度為 0；[5, 95] 也只對應 90% 區間。",
      B: "只抽一半（15 筆）時，樣本平均數的變異約放大為兩倍，區間寬約 √2 倍，估的是「樣本數 15」的不確定性，而不是這 30 塊田的平均。",
      D: "np.percentile 的 q 單位是百分比，0.025 與 0.975 是第 0.025 與第 0.975 百分位，兩端都落在平均數分布的最左側；以 0～1 表示要改用 np.quantile。",
    },
    topic: "L23101 機率／統計之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "農業",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Scenario Selection",
      concepts: ["拔靴法", "信賴區間", "取後放回"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Partial Truth",
        D: "Correct in Different Context",
      },
      decisionBoundary:
        "若把 ② 換成 np.quantile，參數就要寫成 [0.025, 0.975]；同一組數字放在 percentile 與 quantile 上，意義差了 100 倍。",
    },
  },
  {
    id: "senior-ml-practice-q181",
    subjectId: "senior-ml",
    prompt:
      "某投資團隊以 NumPy 計算 4 檔資產組成的投資組合報酬與風險。執行下列程式後，印出的結果為何？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "\n" +
          "rng = np.random.default_rng(0)\n" +
          "R = rng.normal(0.0005, 0.01, size=(250, 4))   # 250 個交易日 × 4 檔資產的日報酬\n" +
          "w = np.array([0.4, 0.3, 0.2, 0.1])\n" +
          "\n" +
          "port = R @ w\n" +
          "C = np.cov(R, rowvar=False)\n" +
          "risk = w @ C @ w\n" +
          "Z = (R - R.mean(axis=0)) / R.std(axis=0)\n" +
          "print(port.shape, C.shape, np.ndim(risk), Z.shape)",
      },
    ],
    choices: [
      { id: "A", text: "(250, 1) (4, 4) 0 (250, 4)" },
      { id: "B", text: "(250,) (4, 4) 0 (250, 4)" },
      { id: "C", text: "(250,) (250, 250) 0 (250, 4)" },
      { id: "D", text: "(250,) (4, 4) 1 (4, 250)" },
    ],
    answer: "B",
    explanation:
      "R 為 (250, 4)，R @ w 是矩陣乘上一維權重向量，得到每天的組合報酬，形狀 (250,)；np.cov 預設把每一列當成一個變數，這裡設 rowvar=False 改以欄為變數，得到 4 檔資產的 (4, 4) 共變異數矩陣；w @ C @ w 是二次型 wᵀΣw，結果為純量，ndim 為 0，數值等於組合報酬的樣本變異數；Z 沿 axis=0 減去各欄平均、除以各欄標準差，(4,) 廣播回去後形狀維持 (250, 4)（B）。",
    choiceExplanations: {
      A: "一維陣列 w 參與矩陣乘法時，NumPy 會在相乘後移除那個維度，結果是一維的 (250,)；要得到 (250, 1) 須寫成 R @ w.reshape(-1, 1)。",
      C: "(250, 250) 是省略 rowvar=False 時的結果：np.cov 預設每一列是一個變數，會把 250 個交易日當成 250 個變數。",
      D: "w @ C @ w 前後都是一維向量，結果是零維純量；Z 的平均與標準差沿 axis=0 計算後以 (4,) 廣播回 (250, 4)，不會發生轉置。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "金融",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Calculation",
      concepts: ["矩陣乘法", "共變異數矩陣", "廣播"],
      distractorTypes: {
        A: "Neighbor Concept",
        C: "Correct in Different Context",
        D: "Partial Truth",
      },
      crossNode: "L23101",
      decisionBoundary:
        "若省略 rowvar=False，C 會變成 (250, 250)，接下來的 w @ C 也會因為 (4,) 與 (250, 250) 維度不合而拋出 ValueError。",
    },
  },
  {
    id: "senior-ml-practice-q182",
    subjectId: "senior-ml",
    prompt:
      "某醫院研究團隊以 NumPy 處理 100 位病患、各 5 項已標準化的檢驗值。關於下列程式中各變數的敘述，哪一組全部正確？",
    figures: [
      {
        kind: "code",
        content:
          "import numpy as np\n" +
          "\n" +
          "rng = np.random.default_rng(0)\n" +
          "X = rng.normal(size=(100, 5))      # 100 位病患 × 5 項檢驗值\n" +
          "w = np.array([0.2, 0.1, 0.3, 0.25, 0.15])\n" +
          "a, b = X[0], X[1]\n" +
          "\n" +
          "r1 = X * w\n" +
          "r2 = X @ w\n" +
          "r3 = np.dot(a, b)\n" +
          "G = X.T @ X\n" +
          "n2 = np.linalg.norm(a)",
      },
      {
        kind: "note",
        content:
          "① r1 的形狀為 (100, 5)，是把每一欄乘上對應權重的逐元素結果\n" +
          "② r2 的形狀為 (100,)，每個元素是一位病患 5 項檢驗值的加權總和\n" +
          "③ r3 是純量，數值等於 np.sum(a * b)\n" +
          "④ G 的形狀為 (100, 100)，記錄病患兩兩之間的內積\n" +
          "⑤ n2 預設計算的是 L1 範數，也就是各元素絕對值的總和",
      },
    ],
    choices: [
      { id: "A", text: "①②④" },
      { id: "B", text: "②③⑤" },
      { id: "C", text: "①④⑤" },
      { id: "D", text: "①②③" },
    ],
    answer: "D",
    explanation:
      "① 對：X * w 是逐元素相乘，(100, 5) 與 (5,) 廣播後每一欄乘上對應權重，形狀仍是 (100, 5)。② 對：X @ w 才是線性組合，每位病患 5 項檢驗值加權相加，得到 (100,)。③ 對：兩個一維向量的 np.dot 是內積，結果為純量，等於 np.sum(a * b)。④ 錯：X.T @ X 是 (5, 100) 乘 (100, 5)，得到 5×5 的特徵交叉矩陣；病患兩兩內積要寫 X @ X.T 才是 (100, 100)。⑤ 錯：np.linalg.norm 對向量預設為 L2 範數（平方和開根號），L1 要指定 ord=1。故選 ①②③（D）。",
    choiceExplanations: {
      A: "含 ④。X.T @ X 的形狀由外側兩個維度決定，是 (5, 5)；把它和 X @ X.T 的 (100, 100) 搞混是最常見的錯誤。",
      B: "含 ⑤、漏掉 ①。norm 對向量的預設 ord 是 2，算的是歐氏長度；① 的逐元素廣播結果形狀確實是 (100, 5)。",
      C: "含 ④、⑤，漏掉 ② 與 ③。X @ w 得到 (100,) 的加權總和，np.dot 對兩個一維向量回傳內積純量，這兩條都成立。",
    },
    topic: "L23102 線性代數之機器學習基礎應用",
    difficulty: "中",
    source: "generated",
    sourceRef: "醫療",
    meta: {
      cognitiveLevel: "L3",
      archetype: "Multi-Statement",
      concepts: ["逐元素乘法", "矩陣乘法", "內積", "範數"],
      distractorTypes: {
        A: "Neighbor Concept",
        B: "Terminology Swap",
        C: "Partial Truth",
      },
      decisionBoundary:
        "若 ④ 改成 X @ X.T、⑤ 改成 np.linalg.norm(a, ord=1)，這兩條就都會成立，五條敘述將全部正確。",
    },
  },
];
