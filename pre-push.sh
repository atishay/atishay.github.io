#!/bin/sh
# Minify main.js
./node_modules/.bin/uglifyjs assets/_partials/js/main.js -o assets/_partials/js/main.min.js
# Add main.js to the cache
git add assets/_partials/js/main.min.js

# Clear cache at cloudflare
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/purge_cache" \
     -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
     -H "X-Auth-Key: $CLOUDFLARE_KEY" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
