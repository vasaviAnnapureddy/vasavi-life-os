/* Service Worker — makes the app work offline */
var CACHE = 'vasavi-life-os-v1';
var ASSETS = [
  '/', '/index.html', '/style.css', '/app.js',
  '/utils/helpers.js', '/utils/storage.js', '/utils/ai_api.js',
  '/data/ds_days.js', '/data/interview_qs.js', '/data/learn_tree.js',
  '/data/gym_plan.js', '/data/jobs_list.js',
  '/data/mindmap_r1.js', '/data/mindmap_r2.js', '/data/mindmap_r3.js',
  '/data/mindmap_r4.js', '/data/mindmap_r5.js', '/data/mindmap_r6.js',
  '/data/mindmap_r7.js',
  '/modules/dashboard.js', '/modules/planner.js', '/modules/timer.js',
  '/modules/goals.js', '/modules/dsroad.js', '/modules/interview.js',
  '/modules/project.js', '/modules/learning.js', '/modules/language.js',
  '/modules/books.js', '/modules/habits.js', '/modules/gym.js',
  '/modules/finance.js', '/modules/savings.js', '/modules/jobs.js',
  '/modules/resume.js', '/modules/travel.js', '/modules/journal.js',
  '/modules/analytics.js', '/modules/ai.js', '/modules/notes.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(ASSETS); }));
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() { return caches.match('/index.html'); });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
});