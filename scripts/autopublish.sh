#!/bin/bash
# Auto-publish the Quartz site every 30 min via launchd.
#
# What it does, in order:
#   1. pull any edits made elsewhere (phone, another machine)
#   2. stop if nothing changed
#   3. run ./check - the privacy gate. If it fails, NOTHING is published
#   4. build + commit + push, with a message naming what changed
#
# Turn it off:
#   launchctl unload ~/Library/LaunchAgents/com.ali.quartz-autopublish.plist
#
# Logs to: scripts/autopublish.log

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

REPO="$HOME/Projects/quartz"
LOG="$REPO/scripts/autopublish.log"
cd "$REPO"

ts() { date "+%Y-%m-%d %H:%M:%S"; }

# say something on screen when I need to act.
# a failure that only lands in a log file is a silent failure.
notify() {
  osascript -e "display notification \"$1\" with title \"Quartz\"" \
    > /dev/null 2>&1 || true
}

if ! command -v npx > /dev/null; then
  echo "$(ts) FATAL: npx not found" >> "$LOG"
  notify "npx not found - autopublish cannot run"
  exit 1
fi

# 1. grab remote edits first (e.g. from the phone)
git pull --rebase --autostash origin v5 >> "$LOG" 2>&1 || true

# 1.4 pull Apple Notes inbox -> today's daily inbox.
#     failure should not block anything - log and go on.
./pull-notes >> "$LOG" 2>&1 || true

# 1.5 tidy: file horizon tasks into streams, log finished ones.
#     failure should not block publishing - log and go on.
if ! ./tidy >> "$LOG" 2>&1; then
  echo "$(ts) tidy failed - run ./tidy by hand to see why" >> "$LOG"
  notify "Tidy failed. Run ./tidy in Terminal."
fi

# 2. anything new to publish?
if [ -z "$(git status --porcelain content/ quartz.config.yaml)" ]; then
  echo "$(ts) no changes, skip" >> "$LOG"
  exit 0
fi

# 3. THE GATE. If ./check fails, stop here and say so out loud.
#    Nothing is committed. Nothing is pushed.
if ! ./check >> "$LOG" 2>&1; then
  echo "$(ts) BLOCKED by ./check - nothing published" >> "$LOG"
  notify "Publish blocked. Run ./check in Terminal to see why."
  exit 1
fi

# 4. write a commit message that says what actually changed, e.g.
#    "notes: harness-engineering, the-ladder | library: books/index"
#    Replaces the old "Quartz sync: <timestamp>", which made git
#    history useless as an undo trail.
#    'cut -c4-' keeps the path intact - filenames here have spaces
#    ("books for whitney.md"), and splitting on whitespace mangles them.
message() {
  git status --porcelain content/ \
    | cut -c4- \
    | tr -d '"' \
    | sed 's|^content/||; s|\.md$||' \
    | awk -F/ '{
        room = (NF == 1) ? "root" : $1
        name = $NF
        if (!(room in seen)) { order[++n] = room }
        seen[room] = (room in seen) ? seen[room] ", " name : name
      }
      END {
        out = ""
        for (i = 1; i <= n; i++)
          out = out (i > 1 ? " | " : "") order[i] ": " seen[order[i]]
        print substr(out, 1, 180)
      }'
}

MSG="$(message)"
[ -z "$MSG" ] && MSG="vault update"

echo "$(ts) publishing: $MSG" >> "$LOG"
npx quartz sync -m "$MSG" >> "$LOG" 2>&1
echo "$(ts) done" >> "$LOG"
