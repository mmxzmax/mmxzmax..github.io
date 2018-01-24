
var staticCacheName = 'weater-static-v10';
var allCaches = [
    staticCacheName
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                'js/main.js',
                'js/plugins.js',
                'css/main.css',
                'https://api-maps.yandex.ru/2.1/?lang=ru_RU',
                'js/idb.js',
                'js/renderer.js',
                'js/LocationService.js',
                'js/weater-service.js',
                'weater_icons.json',
                '16days.json',
                'resp.json',
                'manifest.json',
                'img/icon_152.png',
                'img/icon_120.png',
                'img/icon_80.png',
                'img/icon_76.png',
                'img/icon_60.png',
                'img/icon_58.png',
                'img/icon_40.png',
                'img/icon_29.png'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('weater-') &&
                        !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/'));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
