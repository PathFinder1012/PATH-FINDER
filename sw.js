const CACHE_NAME = "pathfinder-cache-v4";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icon.svg",
    "./sw.js"
];


/* =========================================
   INSTALL
   ========================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches
            .open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(APP_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })

    );

});


/* =========================================
   ACTIVATE
   ========================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches
            .keys()
            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }

                        return null;
                    })

                );

            })
            .then(() => {
                return self.clients.claim();
            })

    );

});


/* =========================================
   FETCH
   ========================================= */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }

        event.respondWith(

            caches.match(event.request)
                .then(cachedResponse => {

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request)
                        .then(response => {

                            if (
                                !response ||
                                response.status !== 200
                            ) {
                                return response;
                            }

                            const clone =
                                response.clone();

                            caches
                                .open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(
                                        event.request,
                                        clone
                                    );
                                });

                            return response;

                        })
                        .catch(() => {

                            return caches.match(
                                "./index.html"
                            );

                        });

                })

        );

    }
);
