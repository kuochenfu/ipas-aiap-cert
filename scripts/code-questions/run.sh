#!/usr/bin/env bash
# 執行全部中級程式閱讀題的驗證腳本。每支腳本內嵌題目附的程式碼與預期輸出，
# 斷言：附圖輸出與實際執行一致、正解成立、每個錯誤選項確實是錯的。
#
# 用法：scripts/code-questions/run.sh [題目 id 片段]
# 第一次執行會用 uv 建立 Python 3.12 環境並安裝 requirements.txt 的固定版本（PyTorch 約數百 MB）。
# 這組腳本不在 npm run test 裡（CI 沒有 Python），改題前後請手動執行。
set -euo pipefail
cd "$(dirname "$0")"
VENV="${CODE_QUESTIONS_VENV:-.venv}"
if [ ! -x "$VENV/bin/python" ]; then
  uv venv -q --python 3.12 "$VENV"
  uv pip install -q --python "$VENV/bin/python" -r requirements.txt
fi
export KERAS_BACKEND=torch MPLBACKEND=Agg PYTHONWARNINGS=ignore
pass=0; fail=0
err="$(mktemp)"; trap 'rm -f "$err"' EXIT
for f in senior-*${1:-}*.py; do
  if "$VENV/bin/python" "$f" > /dev/null 2> "$err"; then
    pass=$((pass + 1))
  else
    fail=$((fail + 1)); echo "✗ ${f%.py}"; tail -3 "$err"
  fi
done
echo "通過 $pass 支，失敗 $fail 支"
[ "$fail" -eq 0 ]
