#!/bin/sh
./node_modules/.bin/uglifyjs assets/_partials/js/main.js -o assets/_partials/js/main.min.js
git add assets/_partials/js/main.min.js
