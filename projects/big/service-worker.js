var cacheName = 'big'; // big
var dataCacheName = 'big-v1'; // big-v1
var filesToCache = [
  './',
  './index.html',
  './icon.png',
  './background.jpeg',
  './stylesheets/css/shivam.css'
];

var dataUrl = [
  'https://maps.googleapis.com/maps/api/js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var didMatchDataUrl = false;
  for (var i = 0; i < dataUrls.length; i++)
    if (e.request.url.indexOf(dataUrls[i]))
      didMatchDataUrl = true;
  if (didMatchDataUrl) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        }).catch(function(event) {
          return cache.match(e.request);
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});