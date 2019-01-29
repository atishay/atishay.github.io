// Wrap in an IFFE.
(() => {
  ///////////////////////////////////////////
  // Remove the no-js class from the html tag that is meant for the noscript mode.
  ///////////////////////////////////////////
  document.getElementsByTagName('html')[0].classList.remove('no-js');

  ///////////////////////////////////////////
  // Log for fellow developers.
  ///////////////////////////////////////////
  console.info(`%c Welcome to ${document.location.hostname}`, "padding:20px;  font: 38px Impact, sans-serif; color: #ddd; text-shadow: 0 1px 1px #bbb,0 2px 0 #999, 0 3px 0 #888, 0 4px 0 #777, 0 5px 0 #666, 0 6px 0 #555, 0 7px 0 #444, 0 8px 0 #333, 0 9px 7px #302314;");
  console.info("If you find something cool and would like to learn more, please contact me using the contact page. Will love to hear from a fellow developer");


  ///////////////////////////////////////////
  // Intersection Observer for animations
  ///////////////////////////////////////////
  // Scroll animations for iPad and bigger
  if (window.innerWidth >= 768) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(x => {
        if (x.isIntersecting && !x.target.classList.contains('visible')) {
          x.target.classList.add('visible');
        }
        if (x.target.classList.contains('visible')) {
          observer.unobserve(x.target);
        }
      });
    });
    ['.left-image', '.meta.default .item', '.item-icon-left .item', '.meta.default', '.max-2', '.max-2 .item', '.filter', '.filter .item',
      '.blog', '.blog .item', 'footer .items', '.contact', '.more', '.comments', '.comments form',
      '.item-icon-left', '.full-width', '.full-width .item'].forEach(s => {

        document.querySelectorAll(s).forEach(x => {
          const rect = x.getBoundingClientRect();
          // All elements above the scroll are visible by default.
          //  We only animate and scroll down.
          if (rect.y < 0) {
            x.classList.add('visible');
          } else {
            observer.observe(x);
          }
        });
      });
  } else {
    // For mobile the hover animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(x => {
        if (x.isIntersecting && !x.target.classList.contains('hover')) {
            x.target.classList.add('hover');
        } else if (!x.isIntersecting && x.target.classList.contains('hover')) {
          x.target.classList.remove('hover')
        }
      });
    }, {
      rootMargin: "-20% 0px -70% 0px"
    });
    ['p', 'li', '.meta .content', '.meta .item-cover', '.item-icon', '.main-icon', '.banner-holder', '.img-container', '.tex', '.i-tex', '.post aside svg', '.meta.carousel .item'].forEach(s => {
      document.querySelectorAll(s).forEach(x => {
          observer.observe(x);
      });
    });
  }


  class Search {
    constructor() {
      // Ignore errors loading search.
      this.prepare().catch(() => { });
    }

    async prepare() {
      const response = await fetch('/index.json');
      const data = await response.json();
      if (data && data.length > 0) {
        // Search via Fuse.js
        const options = {
          shouldSort: true,
          tokenize: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            {
              name: 'title',
              weight: 0.6
            }, {
              name: 'description',
              weight: 0.4
            }, {
              name: 'contents',
              weight: 0.1
            }, {
              name: 'tags',
              weight: 0.3
            }, {
              name: 'series',
              weight: 0.3
            }, {
              name: 'categories',
              weight: 0.3
            }, {
              name: 'meta',
              weight: 0.1
            }
          ]
        };
        this.data = data;
        this.fuse = new Fuse(data, options);
        // document.querySelector('#searchbox').classList.add('visible');
        this.input = document.querySelector('#searchbox input');
        this.input.addEventListener('focus', this.showSearchResults.bind(this));
        this.input.addEventListener('blur', this.hideSearchResults.bind(this));
        this.input.addEventListener('input', this.showSearchResults.bind(this));
        this.input.addEventListener('keypress', this.handleKeyPress.bind(this));
      }
    }

    handleKeyPress() {

    }

    showSearchResults() {
      let results = [];
      if (this.input.value.length === 0) {
        results = this.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else {
        results = this.fuse.search(this.input.value);
      }
    }

    hideSearchResults() {
    }
  }

  const search = new Search();

  /*{{ if not .Site.IsServer  }}*/
  if ('serviceWorker' in navigator && window.location.pathname !== '/offline') {
    navigator.serviceWorker.register('/sw.min.js', { scope: '/' });
  }
  /*{{ end }}*/
})();


