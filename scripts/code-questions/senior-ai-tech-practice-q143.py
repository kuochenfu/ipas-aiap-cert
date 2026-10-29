import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)
logits = torch.randn(64, 4, requires_grad=True)   # 4 類瑕疵的未正規化分數
target = torch.randint(0, 4, (64,))
ce = nn.CrossEntropyLoss()

# 正解 C：CrossEntropyLoss 直接吃 logits，內部做 log-softmax + NLL
loss_c = ce(logits, target)
assert torch.allclose(loss_c, F.nll_loss(F.log_softmax(logits, dim=1), target))

# A 錯：先 Softmax 再進 CrossEntropyLoss，等於做兩次 softmax，損失與梯度都被扭曲
loss_a = ce(torch.softmax(logits, dim=1), target)
assert abs(loss_a.item() - loss_c.item()) > 0.1
g_c, = torch.autograd.grad(loss_c, logits)
g_a, = torch.autograd.grad(ce(torch.softmax(logits, dim=1), target), logits)
assert g_a.abs().mean() < 0.5 * g_c.abs().mean()   # 梯度明顯變小，學習變慢
# 即使模型完全有把握（正確類別分數極大），雙重 softmax 的損失也降不到 0
sure = torch.full((1, 4), -20.0); sure[0, 2] = 20.0
assert ce(sure, torch.tensor([2])).item() < 1e-6
assert ce(torch.softmax(sure, 1), torch.tensor([2])).item() > 0.7

# B 錯：Sigmoid 讓每類各自介於 0～1，分數被壓扁，同樣把損失卡住
loss_b = ce(torch.sigmoid(logits), target)
assert abs(loss_b.item() - loss_c.item()) > 0.1
assert ce(torch.sigmoid(sure), torch.tensor([2])).item() > 0.7

# D 錯：ReLU 把負分數截成 0，負值類別間的相對大小被抹平，損失也不同
loss_d = ce(F.relu(logits), target)
assert abs(loss_d.item() - loss_c.item()) > 0.1
x = torch.tensor([[-3.0, -1.0, 2.0, -0.5]])
assert torch.equal(F.relu(x)[0, [0, 1, 3]], torch.zeros(3))   # 三個負分數變成一樣，區別消失
# 判斷分界：NLLLoss 需搭配 LogSoftmax，兩者合起來等於 CrossEntropyLoss
assert torch.allclose(nn.NLLLoss()(nn.LogSoftmax(dim=1)(logits), target), loss_c)
print("OK", "senior-ai-tech-practice-q143")
