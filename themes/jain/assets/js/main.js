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
  // Convert date to hours from now
  ///////////////////////////////////////////
  function getAgoTime(value) {
    if (!value) { return ""; }
    const d = new Date(value.trim());
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));
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
  document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByTagName('time')).forEach((x) => {
      if (x.className === 'now') {
        x.innerText = new Date().getFullYear();
      } else {
        x.innerText = getAgoTime(x.getAttribute('datetime'));
      }
      // TODO: Attach event listener to update the string here.
    });
  });



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

  ///////////////////////////////////////////
  // Search
  ///////////////////////////////////////////
  class Search {
    constructor() {
      // Ignore errors loading search.
      this.prepare().catch(() => { });
    }

    get resultTemplate() {
      return `<div>
                <img src="data:image/svg+xml;utf8,<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'/>" width="50" height="50" intrinsicsize="100x100" alt="Result"/>
                <h2></h2>
                <div class="description"></div>
                <span>
                  {{- partialCached "util/icon" (dict "key" "calendar" "size" 12) "calendar-12" -}}
                  <time></time>
                  {{- partialCached "util/icon" (dict "key" "hourglass-1" "size" 12) "hourglass-1-12" -}}
                  <span class="readingTime"></span>
                  {{- partialCached "util/icon" (dict "key" "caret-square-o-right" "size" 12) "caret-square-o-right-12" -}}
                  <span class="category"></span>
                </span>
            </div>`;
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
        document.querySelector('#searchbox').classList.add('visible');
        this.input = document.querySelector('#searchbox input');
        this.input.addEventListener('focus', this.showSearchResults.bind(this));
        this.input.addEventListener('blur', this.hideSearchResults.bind(this));
        this.input.addEventListener('input', this.showSearchResults.bind(this));
        this.input.addEventListener('keyup', this.handleKeyPress.bind(this));
      }
    }

    createResultDivs() {
      let data = '';
      for (var i = 0; i < 5; ++i) {
        data += this.resultTemplate;
      }
      document.querySelector('#searchbox .results').innerHTML = data;
      const divs = Array.from(document.querySelectorAll("#searchbox .results>div"));
      divs.forEach(x => {
        x.addEventListener('mousedown', this.handleClick);
        x.addEventListener('mouseover', () => this.selected = x);
      });
      return divs;
    }

    handleClick(e) {
      window.location = e.currentTarget.dataset['href'];
    }

    set selected(element) {
      if (this._selected !== element) {
        this._selected && this._selected.classList.remove('selected');
        element.classList.add('selected');
        this._selected = element;
      }
    }

    get selected() {
      return this._selected;
    }

    handleKeyPress(key) {
      const x = this.resultDivs.indexOf(this.selected);
      switch (key.code) {
        case 'ArrowDown':
          if (this.resultDivs.length > x + 1 && this.resultDivs[x + 1].style.display !== 'none') {
            this.selected = this.resultDivs[x + 1];
          }
          break;
        case 'ArrowUp':
          if (x > 0) {
            this.selected = this.resultDivs[x - 1];
          }
          break;
        case 'Escape':
          this.input.blur();
          break;
        case 'Enter':
          window.location = this.selected.dataset['href'];
          break;
      }
    }

    showSearchResults() {
      this.resultDivs = this.resultDivs || this.createResultDivs();

      let results = [];
      if (this.input.value.length === 0) {
        results = this.data.sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else {
        results = this.fuse.search(this.input.value);
      }
      this.resultDivs.forEach((div, index) => {
        const result = results[index];
        if (index === 0) {
          this.selected = div;
        }
        if (!result) {
          div.style.display = "none";
          return;
        }
        const ago = getAgoTime(result.date);
        div.style.display = "static";
        div.dataset['href'] = result.permalink;
        div.querySelector('img').alt = result.title;
        div.querySelector('img').src = result.image;
        div.querySelector('h2').innerText = result.title;
        div.querySelector('time').innerText = ago.substr(0, ago.indexOf(" ago"));
        div.querySelector('time').datetime = result.date;
        div.querySelector('.description').innerText = result.description;
        div.querySelector('.readingTime').innerText = result.readingTime + 'm';
        div.querySelector('.category').innerText = result.category;
      });
    }

    hideSearchResults() {
    }
  }

  const search = new Search();

  ///////////////////////////////////////////
  // Service Worker
  ///////////////////////////////////////////
  /*{{ if not .Site.IsServer  }}*/
  if ('serviceWorker' in navigator && window.location.pathname !== '/offline') {
    navigator.serviceWorker.register('/sw.min.js', { scope: '/' });
  }
  /*{{ end }}*/
})();


