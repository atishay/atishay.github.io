
// Insired by https://www.sysleaf.com/js-toggle-header-on-scroll/
(() => {
    "use strict";
    let lastKnownScrollY = 0;
    let currentScrollY = 0;
    let ticking = false;
    let eleHeader = null;
    let eleScrollUp = null;
    let eleCheckbox = null;
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
        // Scroll to top hiding.
        if (currentScrollY >= 200) {
            enableScrollUp();
        } else {
            disableScrollUp();
        }
        // Header hiding
        if (!eleCheckbox.checked) {
            if (currentScrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                pin();
            } else if (currentScrollY < lastKnownScrollY) {
                pin();
            } else if (currentScrollY > lastKnownScrollY) {
                unpin();
            }
            lastKnownScrollY = currentScrollY;
        }
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
