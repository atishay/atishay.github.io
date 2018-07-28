---
# Concatenate all minified JavaScript files for video playback
---
{% if jekyll.environment == 'production' %}
{% include_relative _partials/js/plyr/plyr.polyfilled.min.js %}
{% else %}
{% include_relative _partials/js/plyr/plyr.polyfilled.js %}
{% endif %}
