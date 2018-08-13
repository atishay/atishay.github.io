---
# Concatenate all minified JavaScript files for guitar playback
---
{% if jekyll.environment == 'production' %}
{% include_relative _partials/js/raphael.min.js %}
{% include_relative _partials/js/jtab.min.js %}
{% else %}
{% include_relative _partials/js/raphael.js %}
{% include_relative _partials/js/jtab.js %}
{% endif %}
