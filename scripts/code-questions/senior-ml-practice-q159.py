"""senior-ml-practice-q159：推論同時要 model.eval()（關 Dropout）與 no_grad（不建計算圖）。"""
import torch
import torch.nn as nn

CODE = r'''import torch
import torch.nn as nn

torch.manual_seed(0)
model = nn.Sequential(nn.Linear(64, 128), nn.ReLU(), nn.Dropout(0.3),
                      nn.Linear(128, 10))
# ……（已完成訓練）……
x = torch.rand(256, 64)   # 256 份學生手寫數字作業，每張 8×8 像素攤平
# ____（推論）____
pred = out.argmax(dim=1)
'''

CHOICES = {
    "A": "model.eval(); out = model(x)",
    "B": "with torch.no_grad(): out = model(x)",
    "C": "model.eval(); with torch.no_grad(): out = model(x)",
    "D": "with torch.inference_mode(): model.eval; out = model(x)",
}


def run(choice):
    g = {}
    pre, post = CODE.split("# ____（推論）____\n")
    exec(pre, g)
    model, x = g["model"], g["x"]
    if choice == "A":
        model.eval(); out = model(x)
    elif choice == "B":
        with torch.no_grad():
            out = model(x)
    elif choice == "C":
        model.eval()
        with torch.no_grad():
            out = model(x)
    elif choice == "D":
        with torch.inference_mode():
            model.eval
            out = model(x)
    g["out"] = out
    exec(post, g)
    # 決定性：同一輸入跑兩次結果是否一致（Dropout 關閉才會一致）
    with torch.no_grad():
        again = model(x)
    return dict(training=model.training, graph=out.requires_grad,
                stable=torch.equal(out.detach(), again))


r = {k: run(k) for k in CHOICES}
# 正解 C：Dropout 關閉、輸出不帶計算圖、重跑結果相同
assert r["C"] == dict(training=False, graph=False, stable=True), r["C"]
# A：Dropout 已關，但仍建立計算圖（requires_grad=True），推論多耗記憶體
assert r["A"]["training"] is False and r["A"]["graph"] is True
# B：不建計算圖，但仍在訓練模式，Dropout 隨機遮蔽，同一輸入兩次結果不同
assert r["B"]["training"] is True and r["B"]["graph"] is False and r["B"]["stable"] is False
# D：model.eval 少了括號，只是取得方法物件、沒有呼叫，Dropout 仍在作用
assert r["D"]["training"] is True and r["D"]["graph"] is False and r["D"]["stable"] is False

print("OK", "senior-ml-practice-q159")
