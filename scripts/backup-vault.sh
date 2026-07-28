#!/bin/bash
# Weekly vault backup. Zips content/ (incl private)
# to iCloud Drive if present, else ~/Backups.
# Keeps last 12 archives. Logs to scripts/backup.log

set -e
REPO="$HOME/Projects/quartz"
LOG="$REPO/scripts/backup.log"
ICLOUD="$HOME/Library/Mobile Documents/com~apple~CloudDocs"

if [ -d "$ICLOUD" ]; then
  DEST="$ICLOUD/VaultBackups"
else
  DEST="$HOME/Backups/VaultBackups"
fi
mkdir -p "$DEST"

STAMP=$(date "+%Y-%m-%d")
OUT="$DEST/vault-$STAMP.zip"

cd "$REPO"
zip -rq "$OUT" content \
  -x "content/.obsidian/plugins/*/node_modules/*"

echo "$(date '+%F %T') backed up to $OUT" >> "$LOG"

# prune: keep newest 12
ls -t "$DEST"/vault-*.zip 2>/dev/null \
  | tail -n +13 \
  | while read -r f; do rm -f "$f"; done
