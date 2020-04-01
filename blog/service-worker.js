var APP_PREFIX = 'jorgecfgithubio';
var VERSION = 'v1';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
    '/index.html',
    '/about/index.html',
    '/archive/index.html',
    '/assets/js/dark-theme.js',
    '/assets/js/offline.js',
    '/assets/fonts/LibreBaskerville-Bold.ttf',
    '/assets/fonts/LibreBaskerville-Italic.ttf',
    '/assets/fonts/LibreBaskerville-Regular.ttf',
    '/assets/fonts/NunitoSans-Black.ttf',
    '/assets/fonts/NunitoSans-Bold.ttf',
    '/assets/fonts/NunitoSans-Italic.ttf',
    '/assets/fonts/NunitoSans-Light.ttf',
    '/assets/fonts/NunitoSans-LightItalic.ttf',
    '/assets/fonts/NunitoSans-Regular.ttf',
    '/assets/fonts/NunitoSans-SemiBold.ttf',
    '/assets/fonts/Roboto-Black.ttf',
    '/assets/fonts/Roboto-Bold.ttf',
    '/assets/fonts/Roboto-Italic.ttf',
    '/assets/fonts/Roboto-Light.ttf',
    '/assets/fonts/Roboto-Medium.ttf',
    '/assets/fonts/Roboto-MediumItalic.ttf',
    '/assets/fonts/Roboto-Regular.ttf',
    '/assets/fonts/Roboto-Thin.ttf',
    '/assets/fonts/Roboto-ThinItalic.ttf',
    'assets/images/me.JPG',
    'assets/images/sunset.jpg',
    'assets/main.css'
]

// Cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(URLS);
        })
    )
})

// Respond with cached resources
self.addEventListener('fetch', function (event) {
    console.log('fetch request : ' + event.request.url)

    event.respondWith(
        caches.match(event.request).then(function (request) {
            // if cache is available, respond with cache
            if (request) {
                console.log('responding with cache : ' + event.request.url);
                return request;
            }
            // if there are no cache, try fetching request
            else {
                console.log('file is not cached, fetching : ' + event.request.url);
                return fetch(event.request);
            }

            // return request || fetch(e.request)
        })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            var cacheWhitelist = keyList.filter(function (key) { return key.indexOf(APP_PREFIX) });
            cacheWhitelist.push(CACHE_NAME)

            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i])
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})