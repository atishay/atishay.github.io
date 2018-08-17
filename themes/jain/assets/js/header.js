
// Insired by https://www.sysleaf.com/js-toggle-header-on-scroll/
(() => {
    "use strict";
    let lastKnownScrollY = 0;
    let currentScrollY = 0;
    let ticking = false;
    const idOfHeader = 'header';
    let eleHeader = null;
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
        if (eleCheckbox.checked) {
            return;
        }
        if (!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }
    function update() {
        if (eleCheckbox.checked) {
            ticking = false;
            return;
        }
        if (currentScrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            pin();
        } else if (currentScrollY < lastKnownScrollY) {
            pin();
        } else if (currentScrollY > lastKnownScrollY) {
            unpin();
        }
        lastKnownScrollY = currentScrollY;
        ticking = false;
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
        document.addEventListener('scroll', onScroll, false);
    }
})();
