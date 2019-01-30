// Inspired by https://www.sysleaf.com/js-toggle-header-on-scroll/
(() => {
    if (window.innerWidth < 768) {
        const consideredTop = 200;
        const height = document.documentElement.clientHeight;
        let lastKnownScrollY = 0;
        let currentScrollY = 0;
        let ticking = false;
        let eleHeader = null;
        let eleCheckbox = null;
        let eleScroll = null;
        let eleSearch = null;
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
            if (eleCheckbox.checked || eleSearch === document.activeElement) {
                return;
            }
            if (!ticking) {
                requestAnimationFrame(update);
            }
            ticking = true;
        }
        function update() {
            ticking = false;
            if (eleCheckbox.checked) {
                return;
            }
            // Header hiding
            // Ignore first 2 hits for safari reload in the center of the page
            // It is good enough with 2. First is the Js load,
            // Second is safari's scroll to position.
            if (hitCount > 2) {
                if (currentScrollY + height >= document.documentElement.scrollHeight || currentScrollY < consideredTop) {
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
        function pin() {
            if (eleHeader.classList.contains(classes.unpinned)) {
                eleHeader.classList.remove(classes.unpinned);
                eleHeader.classList.add(classes.pinned);
                eleScroll.classList.remove('unpin');
            }
        }
        function unpin() {
            if (eleHeader.classList.contains(classes.pinned) || !eleHeader.classList.contains(classes.unpinned)) {
                eleHeader.classList.remove(classes.pinned);
                eleHeader.classList.add(classes.unpinned);
                eleScroll.classList.add('unpin');
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            eleCheckbox = document.getElementsByClassName('hamburger')[0];
            eleSearch = document.querySelector('#searchbox input');
            eleHeader = document.getElementById('header');
            eleScroll = document.querySelector('.scroll-up');
            document.addEventListener('scroll', onScroll, false);
        });
    }
})();
