// Inspired by https://www.sysleaf.com/js-toggle-header-on-scroll/
// Also puts scroll to top hiding behavior in the same JS function to reuse
// Handing for scroll and animation frame.
(() => {
    const consideredTop = 200;
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
        if (currentScrollY >= consideredTop) {
            enableScrollUp();
        } else {
            disableScrollUp();
        }
        // Header hiding
        // Ignore first 2 hits for safari reload in the center of the page
        // It is good enough with 2. First is the Js load,
        // Second is safari's scroll to position.
        if (!eleCheckbox.checked && hitCount > 2) {
            if (currentScrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight || currentScrollY < consideredTop) {
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

    document.addEventListener("DOMContentLoaded", () => {
        eleCheckbox = document.getElementsByClassName('hamburger')[0];
        eleHeader = document.getElementById('header');
        eleScrollUp = document.getElementsByClassName('scrollUp')[0];
        document.addEventListener('scroll', onScroll, false);
        onScroll();
    });

})();
