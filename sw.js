const CACHE_NAME = "pathfinder-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icon.svg"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache => {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );

        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    name =>
                                        name !==
                                        CACHE_NAME
                                )
                                .map(
                                    name =>
                                        caches.delete(
                                            name
                                        )
                                )

                        );

                    }
                )

        );

        self.clients.claim();

    }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
    "fetch",
    event => {

        if(
            event.request.method !==
            "GET"
        ){

            return;

        }


        event.respondWith(

            caches
                .match(
                    event.request
                )
                .then(
                    cachedResponse => {

                        if(
                            cachedResponse
                        ){

                            return cachedResponse;

                        }


                        return fetch(
                            event.request
                        )
                        .then(
                            networkResponse => {

                                return networkResponse;

                            }
                        )
                        .catch(
                            () => {

                                return caches.match(
                                    "./index.html"
                                );

                            }
                        );

                    }
                )

        );

    }
);
