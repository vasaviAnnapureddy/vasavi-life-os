/* ============================================
   VASAVI'S LIFE OS — SERVICE WORKER
   sw.js

   The old version never stored anything in the
   cache and never cleaned up, so phones could
   hold on to an old copy of the app and new
   features would not appear.

   This version:
   - uses a VERSIONED cache
   - takes control immediately (skipWaiting)
   - deletes every old cache on activate
   - network-first, so you always get the newest
     files when online, and a cached copy offline
   ============================================ */

var SW_VERSION = '2026-10-12-b';
var CACHE_NAME = 'lifeos-' + SW_VERSION;

self.addEventListener('install', function(e) {
  self.skipWaiting();   /* don't wait for old tabs to close */
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== CACHE_NAME) return caches.delete(k);   /* bin every old version */
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;                       /* never cache POSTs */
  if (req.url.indexOf('http') !== 0) return;
  /* Never cache API calls (Groq, Anthropic, Firebase) */
  if (/groq\.com|anthropic\.com|googleapis\.com|firebaseio|gstatic\.com|callmebot|emailjs/.test(req.url)) return;

  e.respondWith(
    fetch(req).then(function(res) {
      /* Save a fresh copy for offline use */
      if (res && res.status === 200 && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(req, copy); });
      }
      return res;
    }).catch(function() {
      return caches.match(req).then(function(hit) {
        return hit || caches.match('index.html');
      });
    })
  );
});

/* Let the page ask us to activate a new version right away */
self.addEventListener('message', function(e) {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
