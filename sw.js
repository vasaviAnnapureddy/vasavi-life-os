var CACHE = 'vasavi-life-os-v2';
var BASE  = '/vasavi-life-os';

var ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/style.css',
  BASE + '/app.js',
  BASE + '/firebase-config.js',
  BASE + '/manifest.json',
  BASE + '/utils/helpers.js',
  BASE + '/utils/storage.js',
  BASE + '/utils/notifications.js',
  BASE + '/utils/ai_api.js',
  BASE + '/data/ds_days.js',
  BASE + '/data/interview_qs.js',
  BASE + '/data/learn_tree.js',
  BASE + '/data/gym_plan.js',
  BASE + '/data/jobs_list.js',
  BASE + '/data/mindmap_r1.js',
  BASE + '/data/mindmap_r2.js',
  BASE + '/data/mindmap_r3.js',
  BASE + '/data/mindmap_r4.js',
  BASE + '/data/mindmap_r5.js',
  BASE + '/data/mindmap_r6.js',
  BASE + '/data/mindmap_r7.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(err) {
        console.log('Cache install partial error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        return caches.match(BASE + '/index.html');
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});