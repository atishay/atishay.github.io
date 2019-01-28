// https://gist.github.com/adactio/fbaa3a5952774553f5e7
(function () {

  // Update 'version' if you need to refresh the cache
  const staticCacheName = 'static';
  const version = 'v1::';

  // Store core files in a cache (including a page to display when offline)
  // {{- $cover:= (resources.Get "image/desktop.jpg").Fill "1400x787" }}
  function updateStaticCache() {
    return caches.open(version + staticCacheName)
      .then((cache) =>  cache.addAll([
        '/',
        '/manifest.json',
          /*{{- range $.res }} /**/
          '{{.}}',
          /* {{ end }} /**/
          '{{$cover.Permalink}}',
          '/offline',
          '{{ (resources.Get "image/logo.svg" | resources.Minify).Permalink }}',
          '/index.json',
          '/sw.min.js'
      ].map(x =>  x.indexOf('http') === 0 ? new URL(x).pathname : x)));
  }

  self.addEventListener('install', function (event) {
    event.waitUntil(updateStaticCache());
  });

  self.addEventListener('activate', function (event) {
    event.waitUntil(
      caches.keys()
        .then(function (keys) {
          // Remove caches whose name is no longer valid
          return Promise.all(keys
            .filter((key) => key.indexOf(version) !== 0)
            .map((key) => caches.delete(key))
          );
        })
    );
  });

  self.addEventListener('fetch', function (event) {
    const request = event.request;
    // Always fetch non-GET requests from the network
    if (request.method !== 'GET') {
      event.respondWith(
        fetch(request)
          .catch(() => caches.match('/offline'))
      );
      return;
    }

    // For HTML requests, try the network first, fall back to the cache, finally the offline page
    if (request.headers.get('Accept').indexOf('text/html') !== -1) {
      // return event.respondWith(caches.match('/offline'));
      // Fix for Chrome bug: https://code.google.com/p/chromium/issues/detail?id=573937
      if (request.mode != 'navigate') {
        request = new Request(request.url, {
          method: 'GET',
          headers: request.headers,
          mode: request.mode,
          credentials: request.credentials,
          redirect: request.redirect
        });
      }
      event.respondWith(
        fetch(request)
          .then(function (response) {
            // Stash a copy of this page in the cache
            const copy = response.clone();
            caches.open(version + staticCacheName)
              .then(function (cache) {
                cache.put(request, copy);
              });
            return response;
          })
          .catch(function () {
            return caches.match(request)
              .then(function (response) {
                return response || caches.match('/offline');
              })
          })
      );
      return;
    }

    // For non-HTML requests, look in the cache first, fall back to the network
    event.respondWith(
      caches.match(request)
        .then(function (response) {
          return response || fetch(request)
            .catch(function () {
              // If the request is for an image, show an offline placeholder
              if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
                return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><title id="offline-title">Offline</title><path fill="rgba(145,145,145,0.5)" d="M0 0h400v225H0z" /><text fill="rgba(0,0,0,0.33)" font-family="Helvetica Neue,Arial,sans-serif" font-size="27" text-anchor="middle" x="200" y="113" dominant-baseline="central">offline</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
              }
            });
        })
    );
  });

})();
