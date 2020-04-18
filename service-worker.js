var APP_PREFIX = 'jorgecfgithubio';
var VERSION = 'v1.1';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
    '/',
    '/index.html',
    '/about/index.html',
    '/about',
    '/about/',
    '/archive/index.html',
    '/archive',
    '/archive/',
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
    'assets/images/GitHub-Mark-32px.png',
    'assets/images/32px-Generic_Feed-icon.png',
    'assets/main.css',
    'assets/images/oauth_2.png',
    'assets/images/oauth_3.png',
    'assets/images/oauth_4.png',
    'assets/images/oauth_5.png',
    'site.webmanifest',
    'favicon-32x32.png',
    'favicon-16x16.png',
    '2020/04/01/google-oauth-angular'
]

// Cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(URLS);
        })
    )
})

// Respond with cached resources
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (request) {
            return request || fetch(event.request);
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
                    return caches.delete(keyList[i]);
                }
            }))
        })
    )
})