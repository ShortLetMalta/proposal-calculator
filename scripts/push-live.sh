#!/usr/bin/env sh
# Commit, push and wait for live Render health and show version/links
MSG=${1:-"Update and deploy"}
RENDER_URL=${2:-${RENDER_URL:-"https://proposal-calculator-v5y7.onrender.com"}}

# commit & push
git add -A
git commit -m "$MSG" || true
git push origin main || { echo "Push failed"; exit 2; }

# read render url
if [ -f backend/config/links.json ]; then
  CONFIGURED_URL=$(node -e "const L=require('./backend/config/links.json'); console.log((L['proposal-calculator'] && L['proposal-calculator'].render) || '')")
  [ -n "$CONFIGURED_URL" ] && RENDER_URL="$CONFIGURED_URL"
fi
if [ -z "$RENDER_URL" ]; then
  echo "Render URL not found in backend/config/links.json. Provide URL as first argument or set it in that file." >&2
  echo "Usage: ./scripts/push-live.sh 'commit message' [https://your-render-url]"
  exit 3
fi

# poll /_health
echo "Polling ${RENDER_URL}/_health for readiness..."
TRIES=0
while [ $TRIES -lt 60 ]; do
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" ${RENDER_URL}/_health || echo "000")
  echo "status=${HTTP} (try ${TRIES})"
  if [ "$HTTP" = "200" ]; then
    echo "Deployment live: ${RENDER_URL}"
    echo "/_version:"; curl -s ${RENDER_URL}/_version || true; echo "\n/_links:"; curl -s ${RENDER_URL}/_links || true
    exit 0
  fi
  TRIES=$((TRIES+1))
  sleep 5
done

echo "Timeout waiting for ${RENDER_URL} to become healthy" >&2
exit 4
