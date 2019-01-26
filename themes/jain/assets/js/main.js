// Wrap in an IFFE.
(() => {
  ///////////////////////////////////////////
  // Remove the no-js class from the html tag that is meant for the noscript mode.
  ///////////////////////////////////////////
  document.getElementsByTagName('html')[0].classList.remove('no-js');

  ///////////////////////////////////////////
  // Log for fellow developers.
  ///////////////////////////////////////////
  console.log("%c Welcome to my website", "padding:20px;  font: 38px Impact, sans-serif; color: #ddd; text-shadow: 0 1px 1px #bbb,0 2px 0 #999, 0 3px 0 #888, 0 4px 0 #777, 0 5px 0 #666, 0 6px 0 #555, 0 7px 0 #444, 0 8px 0 #333, 0 9px 7px #302314;");
  console.log("If you find something cool and would like to learn more, please contact me using the contact page. Will love to hear from a fellow developer");


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
        console.log(x);
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
      this.prepare().catch(() => {});
    }

    async prepare() {
      const response = await fetch('/index.json');
      const data = await response.json();
      if (data && data.length > 0) {
        document.querySelector('#searchbox').classList.add('visible');
      }
    }
  }

  const search = new Search();
})();


// Search via Fuse.js
// var options = {
//   shouldSort: true,
//   tokenize: true,
//   threshold: 0.6,
//   location: 0,
//   distance: 100,
//   maxPatternLength: 32,
//   minMatchCharLength: 1,
//   keys: [
//     "title",
//     "author.firstName"
//   ]
// };
// var fuse = new Fuse(list, options); // "list" is the item array
// var result = fuse.search("");
