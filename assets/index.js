---
# Concatenate all minified JavaScript files
---
{% include_relative _partials/js/jquery-min.js %}
{% include_relative _partials/js/moment.min.js %}
{% if jekyll.environment == 'production' %}
{% include_relative _partials/js/tether.min.js %}
{% include_relative _partials/js/bootstrap.min.js %}
{% include_relative _partials/js/jquery.mixitup.min.js %}
{% include_relative _partials/js/jquery.drawPieChart.min.js %}
{% include_relative _partials/js/wow.min.js %}
{% include_relative _partials/js/owl.carousel.min.js %}
{% include_relative _partials/js/main.min.js %}
{% else %}
{% include_relative _partials/js/tether.js %}
{% include_relative _partials/js/bootstrap.js %}
// Mixitup for sort and filter projects
{% include_relative _partials/js/jquery.mixitup.js %}
//Draw pie chart on the home page
{% include_relative _partials/js/jquery.drawPieChart.js %}
// Wow for Scroll effects
{% include_relative _partials/js/wow.js %}
// OWL Carousel allows multiple items in a single carousel
{% include_relative _partials/js/owl.carousel.js %}
{% include_relative _partials/js/main.js %}
{% endif %}
