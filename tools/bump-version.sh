#!/usr/bin/env bash
# Stamp every CSS/JS link in the HTML pages with ?v=<timestamp> so browsers
# fetch fresh files after a deploy (GitHub Pages lets them cache for 10 min).
# Run this before each commit that changes assets/ or content.
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(date +%Y%m%d%H%M)
for f in index.html project.html paper.html 404.html; do
  sed -i -E "s#(assets/(js|css)/[a-z0-9_-]+\.(js|css))(\?v=[0-9]+)?\"#\1?v=$V\"#g" "$f"
done
echo "assets stamped v=$V"
