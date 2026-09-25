const CACHE_NAME = "gestion-commandes-v1";

const FICHIERS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FICHIERS))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(noms => Promise.all(
            noms
                .filter(nom => nom !== CACHE_NAME)
                .map(nom => caches.delete(nom))
        ))
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(reponse => {
            return reponse || fetch(event.request);
        })
    );
});