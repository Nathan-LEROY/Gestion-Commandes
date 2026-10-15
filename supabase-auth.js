
const SUPABASE_URL = "https://nypnmshgyzptlmuvfsud.supabase.co";

// sb_publishable_xDV9CG2ZEDCi-AhP7_Z9TQ_PfJX356z
const SUPABASE_PUBLISHABLE_KEY = "COLLER_TA_CLE_PUBLIQUE_ICI";

let clientSupabase = null;

function afficherMessageConnexion(message, erreur = false) {
    const zone = document.getElementById("messageConnexion");

    if (!zone) return;

    zone.textContent = message;
    zone.style.color = erreur ? "#b91c1c" : "#166534";
}

async function initialiserConnexionSupabase() {
    const zoneConnexion = document.getElementById("zoneConnexion");
    const application = document.querySelector(".app");
    const formulaire = document.getElementById("formConnexion");
    const boutonDeconnexion = document.getElementById("btnDeconnexion");

    if (!zoneConnexion || !application || !formulaire) {
        console.error("Éléments de connexion introuvables.");
        return;
    }

    application.hidden = true;
    zoneConnexion.hidden = false;

    if (!window.supabase) {
        afficherMessageConnexion(
            "Impossible de charger Supabase. Vérifie ta connexion Internet.",
            true
        );
        return;
    }

    if (
        !SUPABASE_PUBLISHABLE_KEY ||
        SUPABASE_PUBLISHABLE_KEY === "COLLER_TA_CLE_PUBLIQUE_ICI"
    ) {
        afficherMessageConnexion("La clé publique doit être renseignée.", true);
        return;
    }

    clientSupabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    async function actualiserAffichage(session) {
        if (session) {
            zoneConnexion.hidden = true;
            application.hidden = false;

            if (boutonDeconnexion) {
                boutonDeconnexion.hidden = false;
            }
        } else {
            application.hidden = true;
            zoneConnexion.hidden = false;

            if (boutonDeconnexion) {
                boutonDeconnexion.hidden = true;
            }
        }
    }

    formulaire.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("emailConnexion").value.trim();
        const motDePasse = document.getElementById("motDePasseConnexion").value;
        const bouton = formulaire.querySelector('button[type="submit"]');

        bouton.disabled = true;
        afficherMessageConnexion("Connexion en cours…");

        const { data, error } = await clientSupabase.auth.signInWithPassword({
            email,
            password: motDePasse
        });

        bouton.disabled = false;

        if (error) {
            afficherMessageConnexion(
                "Connexion impossible. Vérifie l’adresse e-mail et le mot de passe.",
                true
            );
            console.error(error.message);
            return;
        }

        afficherMessageConnexion("Connexion réussie.");
        await actualiserAffichage(data.session);
    });

    if (boutonDeconnexion) {
        boutonDeconnexion.addEventListener("click", async function () {
            const { error } = await clientSupabase.auth.signOut();

            if (error) {
                afficherMessageConnexion(
                    "Impossible de se déconnecter.",
                    true
                );
                return;
            }

            await actualiserAffichage(null);
        });
    }

    const { data, error } = await clientSupabase.auth.getSession();

    if (error) {
        afficherMessageConnexion("Erreur lors de la vérification de la session.", true);
        return;
    }

    await actualiserAffichage(data.session);

    clientSupabase.auth.onAuthStateChange((_event, session) => {
        actualiserAffichage(session);
    });
}

document.addEventListener("DOMContentLoaded", initialiserConnexionSupabase);
