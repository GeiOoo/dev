const CACHE_NAME = 'little-crm';
const CACHE_URLS = [

    // HTML
    "/",
    "index.html",
    "websockets.html",
    "webworkers.html",
    "wishlist.html",

    // CSS
    "vendor/css/bootstrap.min.css",

    // JavaScript
    "vendor/js/modernizr-custom.js",
    "vendor/js/jquery-3.4.1.min.js",
    "vendor/js/bootstrap.bundle.min.js",
    "app/sharedModule/NavigationMainComponent.js",
    "app/articlesModule/components/ArticleListComponent.js",
    "app/sharedModule/WebSocketComponent.js",
    "app/sharedModule/WebworkerComponent.js",
    "app/articlesModule/components/WishListComponent.js",
    "worker.js",
    "main.js",

    // Externe Quellen
    "https://unpkg.com/dexie@latest/dist/dexie.js",

    // API
    "http://localhost:3000/articles"
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(CACHE_URLS);
    }));
});

self.addEventListener('fetch', (e) => {
    let requestURL = new URL(e.request.url);
    e.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(e.request).then((response) => {
                console.log(response);
                return response || fetch(e.request);
            }).catch((err) => {
                // console.log(e);
            })
    }));

 /*   console.log(requestURL);

    if (requestURL.pathname === 'index.html' || requestURL === '') {
        e.respondWith(caches.open(CACHE_NAME).then((cache) => {
            return cache.match("index.html", {'ignoreSearch': true})
                .then((cachedResponse) => {
                    let fetchPromise = fetch("index.html").then((networkResponse) => {
                        cache.put("index.html", networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                })
        }));
    }*/
});