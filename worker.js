---
layout: null
---

const staticCacheName = "cache-{{site.time | date: '%s%N'}}";

console.log("installing service worker");

const filesToCache = [
{% for page in site.html_pages %}
    '{{ page.url }}',
{% endfor %}
{% for post in site.posts %}
    '{{ post.url }}',
{% endfor %}
{% for file in site.static_files %}
    '{{ file.path }}?{{site.time | date: '%s%N'}}',
{% endfor %}
];


self.addEventListener("install", function (e) {
    self.skipWaiting();
    e.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    )
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith("cache-")
                        && cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return cache.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(function (response) {
            return response || fetch(e.request);
        })
    )
});
