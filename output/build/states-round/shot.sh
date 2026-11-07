#!/bin/bash
# usage: shot.sh outdir
OUT=$1; mkdir -p $OUT
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP=/private/tmp/claude-501/-Users-nimamovahedi-Projects-nima-photography/de6b2f5e-e294-4f87-9201-d470b73def6c/scratchpad/chr
for spec in "states/:states" "states/wy/:wy" "states/ca/:ca" "states/ny/:ny" "states/ca/counties/los-angeles/:county"; do
  p=${spec%%:*}; n=${spec##*:}
  for th in light dark; do
    "$C" --headless=new --disable-gpu --hide-scrollbars --user-data-dir=$TMP-$n-$th-d --window-size=1440,2200 --screenshot=$OUT/$n-1440-$th.png "http://127.0.0.1:4391/$p?theme=$th" >/dev/null 2>&1 &
    "$C" --headless=new --disable-gpu --hide-scrollbars --user-data-dir=$TMP-$n-$th-m --window-size=500,2600 --screenshot=$OUT/$n-500-$th.png "http://127.0.0.1:4391/$p?theme=$th" >/dev/null 2>&1 &
  done
  wait
done
