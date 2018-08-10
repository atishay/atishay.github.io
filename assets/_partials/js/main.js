$(function () {
  $('html').removeClass('no-js');
  //Dropdown Menus
  $('.dropdown').hover(
    function () {
      $(this).addClass('open');
    },
    function () {
      $(this).removeClass('open');
    });

  if ($(window).width() >= 740) {
    function afterReveal(el) {
      el.addEventListener('animationend', function (event) {
        $('.wow').each(function () {
          $(this).css('opacity', 1);
        });
      });
    }
    new WOW({ callback: afterReveal }).init();
  }

  // Check for guitar links
  if ($('.guitar').get()) {
    $.getScript('/assets/guitar.js', function () {
      $('.guitar').each(function () {
        window.jtab.render($(this), $(this).text());
        var svg = $(this).find('svg');
        var width = svg.width();
        var height = svg.height();
        $(this).find('div').css('height', 'auto');
        svg.attr('viewBox', '0 0 ' + width + ' ' + height);
        // svg.attr('preserveAspectRatio', 'xMid yMid meet');
        svg.css('height', 'auto');
        svg.css('max-width', '100%');
      });
    });
  }
  var loadedMath = false;
  $('script[type]').each(function () {
    if (this.type.indexOf('math/tex') !== -1) {
      if (!loadedMath) {
        loadedMath = true;
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML');
      }
    }
  });

  if ($('.videoPlayer').get()) {
    $('head').append('<link rel="stylesheet" type="text/css" href="/assets/video.css" />');
    $.getScript('/assets/video.js', function () {
      $('.videoPlayer').each(function () {
        var id = 'id' + Math.random().toString().replace('.', '');
        $(this).attr('id', id)
        var player = new window.Plyr('#' + id, {
          iconUrl: '/assets/img/plyr.svg',
          blankUrl: '/assets/img/blank.mp4',
          fullscreen: { enabled: true, fallback: true, iosNative: false },
          poster: $('this').data('poster')
        });
      })
    });
  }


  // //Search

  // var openSearch = $('.open-search'),
  //   SearchForm = $('.full-search'),
  //   closeSearch = $('.close-search');

  //   openSearch.on('click', function(event){
  //     event.preventDefault();
  //     if (!SearchForm.hasClass('active')) {
  //       SearchForm.fadeIn(300, function(){
  //         SearchForm.addClass('active');
  //       });
  //     }
  //   });

  //   closeSearch.on('click', function(event){
  //     event.preventDefault();

  //     SearchForm.fadeOut(300, function(){
  //       SearchForm.removeClass('active');
  //       $(this).find('input').val('');
  //     });
  //   });


  //Owl Carousel
  // $('#clients-scroller').owlCarousel({
  //     margin:90,
  //     stagePadding:90,
  //     smartSpeed:450,
  //     responsive: {
  //       0: {
  //         items: 1
  //       },
  //       480: {
  //         items: 2
  //       },
  //       768: {
  //         items: 3
  //       },
  //       1200: {
  //         items: 4
  //       }
  //     }
  // });

  //Color Client
  // $('#color-client-scroller').owlCarousel({
  //     items:4,
  //     itemsTablet:3,
  //     margin:90,
  //     stagePadding:90,
  //     smartSpeed:450,
  //     itemsDesktop : [1199,4],
  //     itemsDesktopSmall : [980,3],
  //     itemsTablet: [768,3],
  //     itemsTablet: [767,2],
  //     itemsTabletSmall: [480,2],
  //     itemsMobile : [479,1],
  // });

  //Owl Carousel
  $('#testimonial-item').owlCarousel({
      autoplay: true,
      autoplaySpeed: 1000,
      loop: true,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        1200: {
          items: 3
        },
        1600: {
          items: 4
        }
      }
  });

  // //Dark Testimonial Carousel
  // $('#testimonial-dark').owlCarousel({
  //     autoPlay: 5000,
  //     items:3,
  //     itemsTablet:3,
  //     margin:90,
  //     stagePadding:90,
  //     smartSpeed:450,
  //     itemsDesktop : [1199,4],
  //     itemsDesktopSmall : [980,3],
  //     itemsTablet: [768,3],
  //     itemsTablet: [767,2],
  //     itemsTabletSmall: [480,2],
  //     itemsMobile : [479,1],
  // });

  // Single Testimonial
  // $('#single-testimonial-item').owlCarousel({
  //   singleItem: true,
  //   autoPlay: 5000,
  //     items: 1,
  //     itemsTablet: 1,
  //     margin:90,
  //     stagePadding:90,
  //     smartSpeed:450,
  //     itemsDesktop : [1199,4],
  //     itemsDesktopSmall : [980,3],
  //     itemsTablet: [768,3],
  //     itemsTablet: [767,2],
  //     itemsTabletSmall: [480,2],
  //     itemsMobile : [479,1],
  //     stopOnHover: true,
  // });

  // Image Carousel
  // $('#image-carousel').owlCarousel({
  //   autoPlay: 3000, //Set AutoPlay to 3 seconds
  //   items : 4,
  //   itemsDesktop : [1170,3],
  //   itemsDesktopSmall : [1170,3]

  // });

  // Slider Carousel
  // $('#carousel-image-slider').owlCarousel({
  //   navigation : false, // Show next and prev buttons
  //   slideSpeed : 300,
  //   paginationSpeed : 400,
  //   singleItem:true,
  //   pagination: false,
  //   autoPlay: 3000,
  // });


   //About owl carousel Slider
  // $(document).ready(function () {

      /*=== About us ====*/
      // $('carousel-about-us').owlCarousel({
      //     navigation: true, // Show next and prev buttons
      //     navigationText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
      //     slideSpeed: 800,
      //     paginationSpeed: 400,
      //     autoPlay: true,
      //     singleItem: true,
      //     pagination : false,
      //     items : 1,
      //     itemsCustom : false,
      //     itemsDesktop : [1199,4],
      //     itemsDesktopSmall : [980,3],
      //     itemsTablet: [768,2],
      //     itemsTabletSmall: false,
      //     itemsMobile : [479,1],
      // });

  // });

  // Include MixitUp if this is needed.
  $('#portfolio-list').mixItUp();

  // Testimonial
  // $('testimonial-carousel').carousel();
  // $('a[data-slide="prev"]').click(function () {
  //     $('#testimonial-carousel').carousel('prev');
  // });

  // $('a[data-slide="next"]').click(function () {
  //     $('#testimonial-carousel').carousel('next');
  // });

  //CounterUp - needs counterup.js
  // jQuery(document).ready(function( $ ) {
  //     $('.counter').counterUp({
  //         delay: 1,
  //         time: 800
  //     });
  // });

  // Progress Bar - Include Waypoints if this is needed.
  // $('.skill-shortcode').appear(function() {
  //   $('.progress').each(function() {
  //     $('.progress-bar').css('width', function() {
  //       return ($(this).attr('data-percentage') + '%')
  //     });
  //   });
  // }, {
  //   accY: -100
  // });

  // Back Top Link
  var offset = 200;
  var duration = 500;
  var backToTopVisible = false;
  $(window).scroll(function() {
    if ($(this).scrollTop() > offset) {
      if(!backToTopVisible) { $('.scrollUp').fadeIn(400); backToTopVisible = true;}
    } else {
      if (backToTopVisible) {$('.scrollUp').fadeOut(400); backToTopVisible = false;}
    }
  });
  $('.scrollUp').click(function(event) {
    event.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, 600);
    return false;
  });
  //Smooth scrolling anchors
  $('body').on('click', '.same-page[href*="#"]:not([href="#"])', function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
  // Pie Chart
  $('.pie-parent').each(function () {
    var pieParent = $(this);
    var pieChart = pieParent.find('.pieChart');
    pieChart.css({height: pieChart.width()});
    var pieInfo = [];
    pieParent.find('.pie-details li').each(function () {
      var li = $(this);
      pieInfo.push({
        title: li.find('.text').text(),
        color: li.find('.color').css('background-color'),
        value: parseFloat(li.find('.sr-only').text())
      });
    });
    pieChart.drawPieChart(pieInfo);
    pieChart.css({height: 'auto'});
  });

  // Time ago
  function getNewTime(value) {
    var d = new Date(value);
    var now = new Date();
    var seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    var minutes = Math.round(Math.abs(seconds / 60));
    var hours = Math.round(Math.abs(minutes / 60));
    var days = Math.round(Math.abs(hours / 24));
    var months = Math.round(Math.abs(days / 30.416));
    var years = Math.round(Math.abs(days / 365));
    if (seconds <= 45) {
      return 'a few seconds ago';
    } else if (seconds <= 90) {
      return 'a minute ago';
    } else if (minutes <= 45) {
      return minutes + ' minutes ago';
    } else if (minutes <= 90) {
      return 'an hour ago';
    } else if (hours <= 22) {
      return hours + ' hours ago';
    } else if (hours <= 36) {
      return 'a day ago';
    } else if (days <= 25) {
      return days + ' days ago';
    } else if (days <= 45) {
      return 'a month ago';
    } else if (days <= 345) {
      return months + ' months ago';
    } else if (days <= 545) {
      return 'a year ago';
    } else { // (days > 545)
      return years + ' years ago';
    }
  }

  $('.moment').get().forEach(function (dt) {
    $(dt).text(getNewTime($(dt).text()));
  });

  // End timeout
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-89338714-1', 'auto');
  ga('send', 'pageview');

  if ($('#disqus_thread').get(0)) {
    //https://help.disqus.com/customer/portal/articles/565624   - Comment count on home page if needed
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

    var disqus_config = function () {

      this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
      this.page.identifier = 'atishay'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };

    (function() {
    var d = document, s = d.createElement('script');
    s.src = '//atishay.disqus.com/embed.js';
    s.async = true;
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
  }

  !function(exports) {
    exports.submitGoogleForm = submitGoogleForm;

    function submitGoogleForm(form) {
        try {
            var data = [].slice.call(form).map(function(control) {
                return 'value' in control && control.name ? control.name + '=' + (control.value === undefined ? '' : control.value) : '';
            }).join('&');
            var xhr = new XMLHttpRequest();

            xhr.open('POST', form.action + '/formResponse', true);
            xhr.setRequestHeader('Accept', 'application/xml, text/xml, */*; q=0.01');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(data);
        } catch (e) {}

        form.parentNode.className += ' submitted';

        return false;
    }
  }(typeof module === 'undefined' ? window : module.exports);
});
