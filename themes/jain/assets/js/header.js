// Remove the no-js class from the html tag that is meant for the noscript mode.
document.getElementsByTagName('html')[0].classList.remove('no-js');

// Insired by https://www.sysleaf.com/js-toggle-header-on-scroll/
// Also puts scroll to top hiding behavior in the same JS function to reuse
// Handing for scroll and animation frame.
(() => {
    "use strict";
    let lastKnownScrollY = 0;
    let currentScrollY = 0;
    let ticking = false;
    let eleHeader = null;
    let eleScrollUp = null;
    let eleCheckbox = null;
    let hitCount = 0;
    const classes = {
        pinned: 'header-pin',
        unpinned: 'header-unpin',
    };
    function onScroll() {
        currentScrollY = window.pageYOffset;
        requestTick();
    }
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }
    function update() {
        ticking = false;
        // Scroll to top hiding/showing.
        if (currentScrollY >= 200) {
            enableScrollUp();
        } else {
            disableScrollUp();
        }
        // Header hiding
        // Ignore first 5 hits for safari reload in the center of the page
        // It is good enough with 2. First is the Js load,
        // Second is safari's scroll to position.
        if (!eleCheckbox.checked && hitCount > 2) {
            if (currentScrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                pin();
            } else if (currentScrollY < lastKnownScrollY) {
                pin();
            } else if (currentScrollY > lastKnownScrollY) {
                unpin();
            }
        }
        lastKnownScrollY = currentScrollY;
        hitCount++;
    }
    function enableScrollUp() {
        if (eleScrollUp.classList.contains('hidden')) {
            eleScrollUp.classList.remove('hidden');
        }
    }
    function disableScrollUp() {
        if (!eleScrollUp.classList.contains('hidden')) {
            eleScrollUp.classList.add('hidden');
        }
    }
    function pin() {
        if (eleHeader.classList.contains(classes.unpinned)) {
            eleHeader.classList.remove(classes.unpinned);
            eleHeader.classList.add(classes.pinned);
        }
    }
    function unpin() {
        if (eleHeader.classList.contains(classes.pinned) || !eleHeader.classList.contains(classes.unpinned)) {
            eleHeader.classList.remove(classes.pinned);
            eleHeader.classList.add(classes.unpinned);
        }
    }
    window.onload = () => {
        eleCheckbox = document.getElementsByClassName('hamburger')[0];
        eleHeader = document.getElementById('header');
        eleScrollUp = document.getElementsByClassName('scrollUp')[0];
        document.addEventListener('scroll', onScroll, false);
        onScroll();
    }
})();


// Handling clicking on scrollToTop
// Should remove once Safari and Edge support
// CSS Based scroll behavior: https://caniuse.com/#feat=css-scroll-behavior
document.getElementsByClassName('scrollUp')[0].addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});
