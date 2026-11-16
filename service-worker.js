
const CACHE_NAME = "gestion-commandes-v2";

const FICHIERS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

// Installation du nouveau cache
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FICHIERS))
    );

    self.skipWaiting();
});

// Activation et nettoyage des anciennes versions du cache
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(noms =>
            Promise.all(
                noms
                    .filter(nom =>
                        nom.startsWith("gestion-commandes-") &&
                        nom !== CACHE_NAME
                    )
                    .map(nom => caches.delete(nom))
            )
        )
    );

    self.clients.claim();
});

// Récupération prioritaire des fichiers depuis le serveur
self.addEventListener("fetch", event => {
    const requete = event.request;

    if (requete.method !== "GET") return;

    const url = new URL(requete.url);

    // Ne pas intercepter Supabase ou les autres domaines
    if (url.origin !== self.location.origin) return;

    const estNavigation = requete.mode === "navigate";

    const estFichierApplication =
        estNavigation ||
        /\.(js|css|html|json)$/.test(url.pathname) ||
        url.pathname.endsWith("/");

    if (!estFichierApplication) return;

    event.respondWith(
        fetch(requete)
            .then(reponse => {
                if (reponse && reponse.ok) {
                    const copie = reponse.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(requete, copie);
                    });
                }

                return reponse;
            })
            .catch(async () => {
                const fichierEnCache = await caches.match(requete);

                if (fichierEnCache) return fichierEnCache;

                if (estNavigation) {
                    return caches.match("./index.html");
                }

                return Response.error();
            })
    );
});
