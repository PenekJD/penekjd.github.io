const PWA_CACHE_VERSION = '2.1.9';
const PWA_CACHE_PREFIX = 'jd-pwa-languager-cache';
const PWA_CACHE_NAME = `${PWA_CACHE_PREFIX}-${PWA_CACHE_VERSION}`;
const PWA_URLS_TO_CACHE = [
    '/',
    '/favicon.ico',
    '/data/svg/NotesBook.svg',
    '/data/svg/Performance.svg',
    '/data/svg/DataTransfer.svg',
    '/data/svg/Info.svg',
    '/index.html',
    '/pages/page1.html',
    '/pages/save.html',
    '/pages/tvjs.html',
    '/pages/about.html',
    '/src/styles/styles.css',
    '/src/fonts/Montserrat-Regular.ttf',
    '/src/lib/tv.js',
    '/src/lib/alpine.js',
    '/app.js',
    '/src/components/additionals/DataHandler.js',
    '/src/components/additionals/TopAdditionals.js',
    '/src/components/additionals/Button.js',
    '/src/components/additionals/WordsList.js',
    '/src/components/additionals/MiniEditor.js',
    '/src/components/SiteMenu.js',
    '/src/components/MainPage.js',
    '/src/components/Footer.js',
    '/src/components/pages/Assessment.js',
    '/src/components/pages/DataControll.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PWA_CACHE_NAME)
            .then(cache => cache.addAll(PWA_URLS_TO_CACHE.map(url => new Request(url, { cache: 'reload' }))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(cacheName => cacheName.startsWith(PWA_CACHE_PREFIX) && cacheName !== PWA_CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(response => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(PWA_CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }

                return response;
            }).catch(() => caches.open(PWA_CACHE_NAME).then(cache => (
                cache.match(event.request)
                    .then(response => response || cache.match(requestUrl.pathname))
                    .then(response => response || cache.match('/index.html'))
            )))
        );
        return;
    }

    event.respondWith(
        caches.open(PWA_CACHE_NAME).then(cache => cache.match(event.request).then(response => {
            return response || fetch(event.request);
        }))
    );
});
