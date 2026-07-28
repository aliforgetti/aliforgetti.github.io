#!/bin/bash
# Auto-publish Quartz site every 30 min via launchd.
# Skips if nothing changed. Logs to scripts/autopublish.log

set -e
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# find npx (conda / nvm installs hide from launchd)
for d in "$HOME/anaconda3/bin" "$HOME/miniconda3/bin" \
  "$HOME/opt/anaconda3/bin" \
  "$HOME/.nvm/versions/node"/*/bin; do
  if [ -x "$d/npx" ]; then
    export PATH="$d:$PATH"
    break
  fi
done

if ! command -v npx > /dev/null; then
  echo "$(date '+%F %T') FATAL: npx not found" \
    >> "$HOME/Projects/quartz/scripts/autopublish.log"
  exit 1
fi

REPO="$HOME/Projects/quartz"
LOG="$REPO/scripts/autopublish.log"
cd "$REPO"

ts() { date "+%Y-%m-%d %H:%M:%S"; }

# grab remote edits first (e.g. from another machine)
git pull --rebase --autostash origin v5 \
  >> "$LOG" 2>&1 || true

# anything new to publish?
if [ -z "$(git status --porcelain content/ \
      quartz.config.yaml)" ]; then
  echo "$(ts) no changes, skip" >> "$LOG"
  exit 0
fi

echo "$(ts) changes found, syncing" >> "$LOG"
npx quartz sync >> "$LOG" 2>&1
echo "$(ts) done" >> "$LOG"
