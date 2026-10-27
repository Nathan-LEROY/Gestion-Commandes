/* =========================================================
   GESTIONNAIRE DE COMMANDES
   Version complète
========================================================= */

const STORAGE_KEY = "gestionCommandesV1";
const PRODUITS_STORAGE_KEY = "crystalBoutikProduitsV1";
const FICHES_PRODUITS_STORAGE_KEY =
    "crystalBoutikFichesProduitsV1";
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("menu-ouvert");
    });
}

// =====================================================
// NAVIGATION DU MENU LATÉRAL
// =====================================================

function afficherSection(section) {

    const sections = [
    "sectionDashboard",
    "sectionAjouter",
    "sectionProduits",
    "sectionCommandes",
    "sectionImpression",
    "sectionFichesProduits",    
    "sectionParametres",
    "sectionAchatsPinduoduo",
    "sectionDepensesPublications"
];


    // Cacher toutes les sections
    sections.forEach((id) => {
        const element = document.getElementById(id);

        if (element) {
            element.style.display = "none";
        }
    });

    // Déterminer la section à afficher
    let idSection = "";

    if (section === "dashboard") {
        idSection = "sectionDashboard";
    }

    if (section === "ajouter") {
        idSection = "sectionAjouter";
    }

    if (section === "produits") {
        idSection = "sectionProduits";
    }

    if (section === "commandes") {
        idSection = "sectionCommandes";
    }

    if (section === "impression") {
        idSection = "sectionImpression";
    }
   
   if (section === "fichesProduits") {
    idSection = "sectionFichesProduits";
}

   if (section === "parametres") {
    idSection = "sectionParametres";
}

   if (section === "achatsPinduoduo") {
    idSection = "sectionAchatsPinduoduo";
}
   
if (section === "depensesPublications") {
    idSection = "sectionDepensesPublications";
}


    const sectionElement = document.getElementById(idSection);

    if (sectionElement) {
        sectionElement.style.display = "";
    }
}


// =====================================================
// CLIC SUR LES BOUTONS DU MENU
// =====================================================

document.querySelectorAll(".menu-item").forEach((bouton) => {

    bouton.addEventListener("click", () => {

        const section = bouton.dataset.section;

        // Fermer le menu
        if (sidebar) {
            sidebar.classList.remove("menu-ouvert");
        }

        // Bouton actif
        document.querySelectorAll(".menu-item").forEach((item) => {
            item.classList.remove("active");
        });

        bouton.classList.add("active");

        // Afficher uniquement la section choisie
        afficherSection(section);

        // Remonter en haut
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        // Préparer une nouvelle commande
        if (section === "ajouter") {

            document.getElementById("commandeForm").reset();

            commandeEnCoursModification = null;

            document.getElementById("commandeId").value = "";

            document.getElementById("formTitle").textContent =
                "➕ Nouvelle commande";

            document.getElementById("btnEnregistrer").textContent =
                "💾 Enregistrer";

            document.getElementById("btnAnnuler").classList.add("hidden");

            recalculerFormulaire();
        }

    });

});


// =====================================================
// AFFICHAGE INITIAL
// =====================================================

afficherSection("dashboard");

/* =========================================================
   ÉLÉMENTS HTML
========================================================= */

const commandeForm = document.getElementById("commandeForm");

// =====================================================
// FOND D'ÉCRAN PERSONNALISÉ
// =====================================================

const fondEcranImage = document.getElementById("fondEcranImage");
const apercuFondEcran = document.getElementById("apercuFondEcran");
const btnAppliquerFond = document.getElementById("btnAppliquerFond");
const btnRetablirFond = document.getElementById("btnRetablirFond");
const modeApparence = document.getElementById("modeApparence");
const btnAppliquerMode = document.getElementById("btnAppliquerMode");
const formAchat = document.getElementById("formAchat");
const nomClientAchat = document.getElementById("nomClientAchat");
const trackingAchat = document.getElementById("trackingAchat");
const nomProduitAchat = document.getElementById("nomProduitAchat");
const dateAchat = document.getElementById("dateAchat");
const photoAchat = document.getElementById("photoAchat");

const zoneApercuPhotoAchat = document.getElementById("zoneApercuPhotoAchat");
const apercuPhotoAchat = document.getElementById("apercuPhotoAchat");

photoAchat?.addEventListener("change", function () {
    const fichier = photoAchat.files[0];

    if (!fichier) {
        zoneApercuPhotoAchat.style.display = "none";
        apercuPhotoAchat.removeAttribute("src");
        return;
    }

    if (!fichier.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide.");
        photoAchat.value = "";
        zoneApercuPhotoAchat.style.display = "none";
        apercuPhotoAchat.removeAttribute("src");
        return;
    }

    if (fichier.size > 1024 * 1024) {
        alert("La photo dépasse 1 Mo. Choisissez une image plus légère.");
        photoAchat.value = "";
        zoneApercuPhotoAchat.style.display = "none";
        apercuPhotoAchat.removeAttribute("src");
        return;
    }

    const lecteur = new FileReader();

    lecteur.onload = function () {
        apercuPhotoAchat.src = lecteur.result;
        zoneApercuPhotoAchat.style.display = "block";
    };

    lecteur.readAsDataURL(fichier);
});

const listeAchats = document.getElementById("listeAchats");
const CLE_ACHATS = "crystalBoutikAchatsV1";

const CLE_MODE_APPARENCE = "gestionCommandesModeApparenceV1";

function appliquerModeApparence(mode) {
    if (mode === "sombre") {
        document.body.classList.add("theme-sombre");
    } else {
        document.body.classList.remove("theme-sombre");
    }
}

if (btnAppliquerMode && modeApparence) {
    btnAppliquerMode.addEventListener("click", function () {
        const modeChoisi = modeApparence.value;

        appliquerModeApparence(modeChoisi);

        localStorage.setItem(CLE_MODE_APPARENCE, modeChoisi);

        alert(
            modeChoisi === "sombre"
                ? "Mode sombre activé !"
                : "Mode clair activé !"
        );
    });
}

// Charger le thème enregistré
const modeEnregistre = localStorage.getItem(CLE_MODE_APPARENCE) || "clair";

if (modeApparence) {
    modeApparence.value = modeEnregistre;
}

appliquerModeApparence(modeEnregistre);


let imageFondSelectionnee = "";

if (fondEcranImage && apercuFondEcran) {
    fondEcranImage.addEventListener("change", function () {
        const fichier = this.files[0];

        if (!fichier) {
            return;
        }

        if (!fichier.type.startsWith("image/")) {
            alert("Veuillez choisir une image valide.");
            this.value = "";
            return;
        }

        const lecteur = new FileReader();

        lecteur.onload = function (evenement) {
            imageFondSelectionnee = evenement.target.result;

            apercuFondEcran.innerHTML = "";

            const image = document.createElement("img");
            image.src = imageFondSelectionnee;
            image.alt = "Aperçu du fond d'écran";

            image.style.width = "100%";
            image.style.maxHeight = "220px";
            image.style.objectFit = "cover";
            image.style.borderRadius = "10px";

            apercuFondEcran.appendChild(image);
        };

        
        lecteur.readAsDataURL(fichier);
    });
}

// =====================================================
// APPLICATION ET SAUVEGARDE DU FOND D'ÉCRAN
// =====================================================

const CLE_FOND_ECRAN = "gestionCommandesFondEcranV1";

function appliquerFondEcran(image) {
    document.body.style.backgroundImage = `url("${image}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";
}

if (btnAppliquerFond) {
    btnAppliquerFond.addEventListener("click", function () {
        if (!imageFondSelectionnee) {
            alert("Veuillez d'abord choisir une photo.");
            return;
        }

        try {
            localStorage.setItem(CLE_FOND_ECRAN, imageFondSelectionnee);
            appliquerFondEcran(imageFondSelectionnee);
            alert("Fond d'écran appliqué et enregistré !");
        } catch (erreur) {
            alert("Cette photo est trop volumineuse. Choisissez une image plus petite.");
        }
    });
}

// Restaurer automatiquement le fond enregistré au démarrage
try {
    const fondEnregistre = localStorage.getItem(CLE_FOND_ECRAN);

    if (fondEnregistre) {
        appliquerFondEcran(fondEnregistre);
    }
} catch (erreur) {
    console.error("Impossible de charger le fond d'écran.", erreur);
}


if (btnRetablirFond) {
    btnRetablirFond.addEventListener("click", function () {
        const confirmation = confirm(
            "Voulez-vous vraiment rétablir le fond d'écran d'origine ?"
        );

        if (!confirmation) {
            return;
        }

        localStorage.removeItem(CLE_FOND_ECRAN);

        document.body.style.backgroundImage = "";
        document.body.style.backgroundSize = "";
        document.body.style.backgroundPosition = "";
        document.body.style.backgroundAttachment = "";
        document.body.style.backgroundRepeat = "";

        imageFondSelectionnee = "";

        if (fondEcranImage) {
            fondEcranImage.value = "";
        }

        if (apercuFondEcran) {
            apercuFondEcran.innerHTML =
                "<p>Aucun fond personnalisé sélectionné.</p>";
        }

        alert("Le fond d'écran d'origine a été rétabli.");
    });
}

const commandeId = document.getElementById("commandeId");

const numeroCommande = document.getElementById("numeroCommande");
const nomClient = document.getElementById("nomClient");
const dateCommande = document.getElementById("dateCommande");
const telephoneClient = document.getElementById("telephoneClient");
const whatsappClient = document.getElementById("whatsappClient");
const facebookClient = document.getElementById("facebookClient");
const lieuLivraison = document.getElementById("lieuLivraison");
const nomProduit = document.getElementById("nomProduit");
const photoCommande = document.getElementById("photoCommande");
const nombreProduit = document.getElementById("nombreProduit");
const prixProduit = document.getElementById("prixProduit");
const acompte = document.getElementById("acompte");
const fraisLivraison = document.getElementById("fraisLivraison");
const statut = document.getElementById("statut");

const totalProduit = document.getElementById("totalProduit");
const resteCharge = document.getElementById("resteCharge");

const commandesBody = document.getElementById("commandesBody");
const aucuneCommande = document.getElementById("aucuneCommande");

const recherche = document.getElementById("recherche");
const filtreStatut = document.getElementById("filtreStatut");

const btnEnregistrer = document.getElementById("btnEnregistrer");
const btnAnnuler = document.getElementById("btnAnnuler");
const btnExporter = document.getElementById("btnExporter");
const fichierImport = document.getElementById("fichierImport");
const btnToutSupprimer = document.getElementById("btnToutSupprimer");

// =========================================================
// ÉLÉMENTS DU FORMULAIRE PRODUIT
// =========================================================

const produitForm = document.getElementById("produitForm");

const nomProduitStock =
    document.getElementById("nomProduitStock");

const categorieProduit =
    document.getElementById("categorieProduit");

const quantiteStock =
    document.getElementById("quantiteStock");

const couleurProduit =
    document.getElementById("couleurProduit");

const tailleProduit =
    document.getElementById("tailleProduit");

const prixStock =
    document.getElementById("prixStock");

const photoProduit =
    document.getElementById("photoProduit");

const btnAjouterProduit =
    document.getElementById("btnAjouterProduit");

const listeProduits =
    document.getElementById("listeProduits");

const ficheProduitForm =
    document.getElementById("ficheProduitForm");

const nomFicheProduit =
    document.getElementById("nomFicheProduit");

const poidsFicheProduit =
    document.getElementById("poidsFicheProduit");

const fraisFicheProduit =
    document.getElementById("fraisFicheProduit");

const prixFicheProduit =
    document.getElementById("prixFicheProduit");

const photoFicheProduit =
    document.getElementById("photoFicheProduit");

const btnEnregistrerFicheProduit =
    document.getElementById("btnEnregistrerFicheProduit");

const rechercheFicheProduit =
    document.getElementById("rechercheFicheProduit");

const listeFichesProduits =
    document.getElementById("listeFichesProduits");

/* =========================================================
   DONNÉES
========================================================= */

let commandes = chargerCommandes();
let selectionImpression = new Set();

let commandeEnCoursModification = null;

let produits = chargerProduits();
let produitEnCoursModification = null;

let fichesProduits = chargerFichesProduits();
let ficheProduitEnCoursModification = null;

function chargerProduits() {
    try {
        const donnees = JSON.parse(
            localStorage.getItem(PRODUITS_STORAGE_KEY) || "[]"
        );

        return Array.isArray(donnees) ? donnees : [];

    } catch (erreur) {
        console.error("Erreur de lecture des produits :", erreur);
        return [];
    }
}

function sauvegarderProduits() {
    try {
        localStorage.setItem(
            PRODUITS_STORAGE_KEY,
            JSON.stringify(produits)
        );

        return true;

    } catch (erreur) {
        console.error(
            "Erreur de sauvegarde des produits :",
            erreur
        );

        alert(
            "Impossible d'enregistrer le produit."
        );

        return false;
    }
}

function chargerFichesProduits() {

    try {

        const donnees = JSON.parse(
            localStorage.getItem(
                FICHES_PRODUITS_STORAGE_KEY
            ) || "[]"
        );

        return Array.isArray(donnees)
            ? donnees
            : [];

    } catch (erreur) {

        console.error(
            "Erreur de lecture des fiches produits :",
            erreur
        );

        return [];
    }
}


function sauvegarderFichesProduits() {

    try {

        localStorage.setItem(
            FICHES_PRODUITS_STORAGE_KEY,
            JSON.stringify(fichesProduits)
        );

        return true;

    } catch (erreur) {

        console.error(
            "Erreur de sauvegarde des fiches produits :",
            erreur
        );

        alert(
            "Impossible d'enregistrer la fiche produit."
        );

        return false;
    }
}

/* =========================================================
   OUTILS
========================================================= */

function nombre(valeur) {
    const resultat = Number(valeur);
    return Number.isFinite(resultat) ? resultat : 0;
}

function formaterMontant(valeur) {
    return new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0
    }).format(Math.round(nombre(valeur))) + " Ar";
}

function genererId() {
    return Date.now().toString(36) +
        Math.random().toString(36).slice(2, 9);
}

function echapperHTML(valeur) {
    return String(valeur ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function obtenirValeur(element, defaut = "") {
    return element ? element.value : defaut;
}

function definirTexte(element, texte) {
    if (element) {
        element.textContent = texte;
    }
}

/* =========================================================
   STOCKAGE
========================================================= */

function chargerCommandes() {
    try {
        const donnees = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(donnees)) {
            return [];
        }

        return donnees
            .filter(c => c && typeof c === "object")
            .map(c => ({
                id: String(c.id || genererId()),
               numeroCommande: String(c.numeroCommande || ""),
                client: String(c.client || ""),
                telephone: String(c.telephone || ""),
                whatsapp: String(c.whatsapp || ""),
                facebook: String(c.facebook || ""),
                lieu: String(c.lieu || ""),
                produit: String(c.produit || ""),
                photo: String(c.photo || ""),
                quantite: Math.max(1, nombre(c.quantite || 1)),
                prix: Math.max(0, nombre(c.prix)),
                acompte: Math.max(0, nombre(c.acompte)),
                fraisLivraison: Math.max(
                    0,
                    nombre(c.fraisLivraison)
                ),
                statut: String(c.statut || "En attente"),
dateCommande: String(c.dateCommande || ""),
dateCreation: c.dateCreation || new Date().toISOString()
            }));
    } catch (erreur) {
        console.error("Erreur de lecture des commandes :", erreur);
        return [];
    }
}

function sauvegarderCommandes() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(commandes)
        );
        return true;
    } catch (erreur) {
        console.error("Erreur de sauvegarde :", erreur);
        alert(
            "Impossible d'enregistrer les commandes. " +
            "Vérifie l'espace de stockage disponible."
        );
        return false;
    }
}

/* =========================================================
   CALCULS
========================================================= */

function calculerTotalProduit(commande) {
    return nombre(commande.quantite) * nombre(commande.prix);
}

function calculerResteProduit(commande) {
    return Math.max(
        0,
        calculerTotalProduit(commande) - nombre(commande.acompte)
    );
}

function calculerTotalEtiquette(commande) {
    return Math.max(
        0,
        calculerTotalProduit(commande) +
        nombre(commande.fraisLivraison) -
        nombre(commande.acompte)
    );
}

function recalculerFormulaire() {
    const quantite = Math.max(0, nombre(nombreProduit?.value));
    const prix = Math.max(0, nombre(prixProduit?.value));
    const avance = Math.max(0, nombre(acompte?.value));

    const total = quantite * prix;
    const reste = Math.max(0, total - avance);

    definirTexte(totalProduit, formaterMontant(total));
    definirTexte(resteCharge, formaterMontant(reste));
}

/* =========================================================
   STATISTIQUES
========================================================= */

   function afficherStatistiques() {

    /* -----------------------------------------------------
       NOMBRE DE CLIENTS
    ----------------------------------------------------- */

    const clients = new Set(
        commandes
            .map(c => c.client.trim().toLowerCase())
            .filter(Boolean)
    );


    /* -----------------------------------------------------
       TOTAL DES ACOMPTES REÇUS
    ----------------------------------------------------- */

    const totalAcomptes = commandes.reduce(
        (somme, commande) => {
            return somme + nombre(commande.acompte);
        },
        0
    );
 
    /* -----------------------------------------------------
       RESTES À PAYER
    ----------------------------------------------------- */

    const totalRestes = commandes.reduce(
        (somme, commande) => {
            return somme + calculerResteProduit(commande);
        },
        0
    );

      /* -----------------------------------------------------
   COMMANDES EN ATTENTE
----------------------------------------------------- */

const totalEnAttente = commandes.filter(
    commande => commande.statut !== "Payé"
).length;


/* -----------------------------------------------------
   COMMANDES SOLDÉES
----------------------------------------------------- */

const totalSolde = commandes.filter(
    commande => commande.statut === "Payé"
).length;

    /* -----------------------------------------------------
       AFFICHAGE
    ----------------------------------------------------- */

    definirTexte(
        document.getElementById("statClients"),
        String(clients.size)
    );

    definirTexte(
        document.getElementById("statCommandes"),
        String(commandes.length)
    );

    definirTexte(
        document.getElementById("statAcomptes"),
        formaterMontant(totalAcomptes)
    );

        definirTexte(
        document.getElementById("statRestes"),
        formaterMontant(totalRestes)
    );

      definirTexte(
    document.getElementById("statEnAttente"),
    String(totalEnAttente)
);

definirTexte(
    document.getElementById("statSolde"),
    String(totalSolde)
);
      
}

/* =========================================================
   STATUTS
========================================================= */

function classeStatut(valeur) {
    const classes = {
        "En attente": "statut-attente",
        "Acompte reçu": "statut-acompte",
        "En préparation": "statut-preparation",
        "Prêt": "statut-pret",
        "Livré": "statut-livre",
        "Payé": "statut-paye"
    };

    return classes[valeur] || "statut-attente";
}

/* =========================================================
   RECHERCHE ET FILTRE
========================================================= */

function obtenirCommandesFiltrees() {
    const terme = (recherche?.value || "")
        .trim()
        .toLowerCase();

    const filtre = filtreStatut?.value || "";

    return commandes.filter(commande => {
        const texte = [
            commande.client,
            commande.telephone,
            commande.lieu,
            commande.produit
        ].join(" ").toLowerCase();

        const correspondRecherche =
            !terme || texte.includes(terme);

        const correspondStatut =
            !filtre || commande.statut === filtre;

        return correspondRecherche && correspondStatut;
    });
}

/* =========================================================
   TABLEAU
========================================================= */

function afficherCommandes() {
    if (!commandesBody) return;

    const liste = obtenirCommandesFiltrees();

    commandesBody.innerHTML = "";

    /* -----------------------------------------------------
       CLASSER LES COMMANDES PAR DATE DE CRÉATION
    ----------------------------------------------------- */

    const groupes = {};

    liste.forEach(commande => {
        let date = "Date inconnue";

if (commande.dateCommande) {
    const [annee, mois, jour] = commande.dateCommande.split("-");

    if (annee && mois && jour) {
        date = `${jour}/${mois}/${annee}`;
    }
}

        if (!groupes[date]) {
            groupes[date] = [];
        }

        groupes[date].push(commande);
    });

    /* -----------------------------------------------------
       TRIER LES DATES : PLUS RÉCENTE EN PREMIER
    ----------------------------------------------------- */

    const dates = Object.keys(groupes).sort((a, b) => {
        if (a === "Date inconnue") return 1;
        if (b === "Date inconnue") return -1;

        const [jourA, moisA, anneeA] = a.split("/");
        const [jourB, moisB, anneeB] = b.split("/");

        return new Date(
            anneeB,
            moisB - 1,
            jourB
        ) - new Date(
            anneeA,
            moisA - 1,
            jourA
        );
    });

    /* -----------------------------------------------------
       AFFICHER LES DOSSIERS
    ----------------------------------------------------- */

    dates.forEach(date => {

        const commandesDuJour = groupes[date];

        /* DOSSIER */
        const ligneDossier = document.createElement("tr");

        ligneDossier.dataset.dossier = "true";

        ligneDossier.innerHTML = `
            <td colspan="9">
                <button
                    type="button"
                    class="btn secondary"
                    style="
                        width:100%;
                        justify-content:flex-start;
                        text-align:left;
                        font-size:15px;
                        padding:12px;
                    "
                    data-ouverture="ferme"
                    onclick="
                        let ligne = this.closest('tr').nextElementSibling;
                        let ouvrir = this.dataset.ouverture === 'ferme';

                        while (ligne && !ligne.dataset.dossier) {
                            ligne.style.display = ouvrir ? '' : 'none';
                            ligne = ligne.nextElementSibling;
                        }

                        this.dataset.ouverture = ouvrir ? 'ouvert' : 'ferme';
                        this.innerHTML = ouvrir
                            ? '📂 ${date} — ${commandesDuJour.length} commande(s)'
                            : '📁 ${date} — ${commandesDuJour.length} commande(s)';
                    "
                >
                    📁 ${date} — ${commandesDuJour.length} commande(s)
                </button>
            </td>
        `;

        commandesBody.appendChild(ligneDossier);

        /* -------------------------------------------------
           COMMANDES DE CETTE DATE
        ------------------------------------------------- */

        commandesDuJour.forEach(commande => {

            const ligne = document.createElement("tr");

            /* Cachée tant que le dossier n'est pas ouvert */
            ligne.style.display = "none";

            const selectionnee =
                selectionImpression.has(commande.id);

            ligne.innerHTML = `
                <td>
                    <input
                        type="checkbox"
                        class="selection-impression"
                        aria-label="Sélectionner pour impression"
                        data-selection="${echapperHTML(commande.id)}"
                        ${selectionnee ? "checked" : ""}
                    >

                    <strong>
                        ${commande.numeroCommande
                            ? `🔢 ${echapperHTML(commande.numeroCommande)}<br>`
                            : ""}
                        ${echapperHTML(commande.client)}
                    </strong>

                    ${commande.telephone
                        ? `<br><small>📞 ${echapperHTML(commande.telephone)}</small>`
                        : ""}

                    ${commande.whatsapp
                        ? `<br><small>💬 ${echapperHTML(commande.whatsapp)}</small>`
                        : ""}
                </td>

                <td>
    ${
        commande.photo
            ? `
                <div style="margin-bottom:8px;">
                    <img
                        src="${echapperHTML(commande.photo)}"
                        alt="${echapperHTML(commande.produit)}"
                        style="
                            width:80px;
                            height:80px;
                            object-fit:cover;
                            border-radius:8px;
                        "
                    >
                </div>
            `
            : ""
    }

    ${echapperHTML(commande.produit)}

    ${commande.lieu
        ? `<br><small>${echapperHTML(commande.lieu)}</small>`
        : ""}
</td>

                <td>${echapperHTML(commande.quantite)}</td>

                <td>
                    ${formaterMontant(commande.prix)}
                </td>

                <td>
                    ${formaterMontant(
                        calculerTotalProduit(commande)
                    )}
                </td>

                <td>
                    ${formaterMontant(commande.acompte)}
                </td>

                <td>
                    ${formaterMontant(
                        calculerResteProduit(commande)
                    )}
                </td>

                <td>
                    <span class="statut ${classeStatut(commande.statut)}">
                        ${echapperHTML(commande.statut)}
                    </span>
                </td>

                <td>
                    <button
                        class="btn secondary"
                        type="button"
                        data-action="modifier"
                        data-id="${echapperHTML(commande.id)}"
                    >✏️ Modifier</button>

                    <button
                        class="btn danger-outline"
                        type="button"
                        data-action="supprimer"
                        data-id="${echapperHTML(commande.id)}"
                    >🗑️ Supprimer</button>

                    <button
                        class="btn whatsapp"
                        type="button"
                        data-action="whatsapp"
                        data-id="${echapperHTML(commande.id)}"
                    >WhatsApp</button>

                    <button
                       class="btn secondary"
                       type="button"
                       data-action="facebook"
                       data-id="${echapperHTML(commande.id)}"
                    >💙 Messenger</button>
                    
                </td>
            `;

            commandesBody.appendChild(ligne);
        });
    });

    /* -----------------------------------------------------
       AUCUNE COMMANDE
    ----------------------------------------------------- */

    if (aucuneCommande) {
        aucuneCommande.classList.toggle(
            "hidden",
            liste.length !== 0
        );
    }

    afficherStatistiques();
}

/* =========================================================
   RÉINITIALISATION DU FORMULAIRE
========================================================= */

function reinitialiserFormulaire() {
    if (!commandeForm) return;

    commandeForm.reset();

   commandeEnCoursModification = null;
   
    if (commandeId) commandeId.value = "";
    if (nombreProduit) nombreProduit.value = "1";
    if (acompte) acompte.value = "0";
    if (fraisLivraison) fraisLivraison.value = "0";

    const titre = document.getElementById("formTitle");
    definirTexte(titre, "➕ Nouvelle commande");

    if (btnEnregistrer) {
        btnEnregistrer.textContent = "💾 Enregistrer";
    }

    btnAnnuler?.classList.add("hidden");

    recalculerFormulaire();
}

/* =========================================================
   MODIFICATION
========================================================= */

function modifierCommande(id) {
    const commande = commandes.find(c => c.id === id);
    if (!commande || !commandeForm) return;

       afficherSection("ajouter");

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.section === "ajouter"
        );
    });

    console.log("ÉTAPE 1 : commande trouvée");
   console.log("commandeId =", commandeId);
console.log("numeroCommande =", numeroCommande);
console.log("commandeForm =", commandeForm);
    console.log("ÉTAPE 2 : commandeId");
commandeEnCoursModification = commande.id;

console.log("ÉTAPE 3 : numeroCommande");
numeroCommande.value = commande.numeroCommande || "";
    dateCommande.value = commande.dateCommande || "";
    nomClient.value = commande.client;
    nomProduit.value = commande.produit;
    nombreProduit.value = commande.quantite;
    prixProduit.value = commande.prix;
    acompte.value = commande.acompte;

    if (telephoneClient) {
    telephoneClient.value = commande.telephone;
}

if (whatsappClient) {
    whatsappClient.value = commande.whatsapp || "";
}

if (facebookClient) {
    facebookClient.value = commande.facebook || "";
}
   
if (lieuLivraison) {
    lieuLivraison.value = commande.lieu;
}

    if (fraisLivraison) {
        fraisLivraison.value = commande.fraisLivraison;
    }

    if (statut) {
        statut.value = commande.statut;
    }

    definirTexte(
        document.getElementById("formTitle"),
        "✏️ Modifier la commande"
    );

    if (btnEnregistrer) {
        btnEnregistrer.textContent = "💾 Enregistrer les modifications";
    }

    btnAnnuler?.classList.remove("hidden");

    recalculerFormulaire();
    commandeForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================================
   SUPPRESSION
========================================================= */

function supprimerCommande(id) {
    const commande = commandes.find(c => c.id === id);
    if (!commande) return;

    const confirmation = confirm(
        `Supprimer la commande de ${commande.client} ?`
    );

    if (!confirmation) return;

    commandes = commandes.filter(c => c.id !== id);
    selectionImpression.delete(id);

    if (sauvegarderCommandes()) {
        afficherCommandes();

        if (commandeId?.value === id) {
            reinitialiserFormulaire();
        }
    }
}

/* =========================================================
   ENREGISTREMENT
========================================================= */

async function enregistrerCommande(evenement) {
    evenement.preventDefault();

    if (!commandeForm.reportValidity()) return;

    const quantite = Number(nombreProduit.value);
    const prix = Number(prixProduit.value);
    const avance = Number(acompte.value || 0);
    const frais = Number(fraisLivraison?.value || 0);

    if (
        !Number.isInteger(quantite) ||
        quantite < 1 ||
        prix < 0 ||
        avance < 0 ||
        frais < 0
    ) {
        alert("Vérifie les quantités et les montants saisis.");
        return;
    }

    const id = commandeEnCoursModification || genererId();

    const ancienne = commandes.find(c => c.id === id);

   let photo = "";

if (
    photoCommande &&
    photoCommande.files &&
    photoCommande.files.length > 0
) {
    const fichier = photoCommande.files[0];

    photo = await convertirImageEnBase64(fichier);
}
   
    const commande = {
    id,
    numeroCommande: obtenirValeur(numeroCommande).trim(),
    client: nomClient.value.trim(),
    telephone: obtenirValeur(telephoneClient).trim(),
    whatsapp: obtenirValeur(whatsappClient).trim(),
    facebook: obtenirValeur(facebookClient).trim(),
    lieu: obtenirValeur(lieuLivraison).trim(),
    produit: nomProduit.value.trim(),
        photo: photo || ancienne?.photo || "",
        quantite,
        prix,
        acompte: avance,
        fraisLivraison: frais,
        statut: obtenirValeur(statut, "En attente"),
        dateCommande: obtenirValeur(dateCommande),
dateCreation: ancienne?.dateCreation || new Date().toISOString()
    };

    if (!commande.client || !commande.produit) {
        alert("Veuillez renseigner le nom du client et le produit.");
        return;
    }

    if (ancienne) {
        commandes = commandes.map(c => c.id === id ? commande : c);
    } else {
        commandes.push(commande);
    }

    if (sauvegarderCommandes()) {
        reinitialiserFormulaire();
        afficherCommandes();
    }
}

/* =========================================================
   WHATSAPP
========================================================= */

function normaliserTelephone(numero) {
    let resultat = String(numero || "").replace(/\D/g, "");

    // Enlève le préfixe international 00.
    if (resultat.startsWith("00")) {
        resultat = resultat.slice(2);
    }

    // Ne devine pas l'indicatif du pays.
    return resultat;
}

function formaterDateCommande(date) {
    const valeur = new Date(date);

    if (Number.isNaN(valeur.getTime())) {
        return "";
    }

    return valeur.toLocaleDateString("fr-FR");
}


function envoyerWhatsApp(id) {
    const commande = commandes.find(c => c.id === id);
    if (!commande) return;

    if (!commande.whatsapp) {
        alert(
            "Aucun numéro WhatsApp n'est renseigné " +
            "pour cette commande."
        );
        return;
    }

    let telephone = normaliserTelephone(commande.whatsapp);

    // Convertit les numéros malgaches locaux en format international.
    if (telephone.startsWith("0")) {
        telephone = "261" + telephone.slice(1);
    }

    if (telephone.length < 10) {
        alert(
            "Le numéro WhatsApp semble incomplet. " +
            "Vérifie le numéro renseigné."
        );
        return;
    }

    const message = [
        "Miarahaba tompoko,",
        "",
        `Faly mampahafantatra anao izahay ato amin'ny Crystal Boutik fa efa azonao alaina na aterinay ny entana ${commande.produit}, mitondra ny laharana commande ${commande.numeroCommande}, izay nafaranao tamin'ny ${formaterDateCommande(commande.dateCreation)}.`,
        "",
        "Manasa anao ary hitsidika ny page Crystal Boutik.",
        "",
        "Misaotra indrindra,",
        "Crystal Boutik",
        "\"Ny mora indrindra hatrany\""
    ].join("\n");

    const url =
        "https://wa.me/" +
        encodeURIComponent(telephone) +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
}

function envoyerFacebook(id) {
    const commande = commandes.find(c => c.id === id);

    if (!commande) return;

    if (!commande.facebook) {
        alert(
            "Aucun lien Facebook / Messenger n'est renseigné " +
            "pour cette commande."
        );
        return;
    }

    window.open(
        commande.facebook,
        "_blank",
        "noopener,noreferrer"
    );
}

/* =========================================================
   SÉLECTION DES COMMANDES À IMPRIMER
========================================================= */

function gererSelectionImpression(id, coche) {
    if (coche) {
        selectionImpression.add(id);
    } else {
        selectionImpression.delete(id);
    }
    mettreAJourCompteurImpression();
}

function obtenirBoutonImpression() {
    let bouton = document.getElementById("btnImprimer");

    if (!bouton) {
        const actions = document.querySelector(".data-actions");

        if (!actions) return null;

        bouton = document.createElement("button");
        bouton.type = "button";
        bouton.id = "btnImprimer";
        bouton.className = "btn print";
        bouton.textContent = "🖨️ Imprimer les étiquettes";
        actions.appendChild(bouton);

        bouton.addEventListener("click", imprimerCommandes);
    }

    return bouton;
}

function mettreAJourCompteurImpression() {
    const bouton = obtenirBoutonImpression();
    if (!bouton) return;

    bouton.textContent =
        `🖨️ Imprimer les étiquettes (${selectionImpression.size})`;
    bouton.disabled = selectionImpression.size === 0;
}

/* =========================================================
   PRÉPARATION DES ÉTIQUETTES
========================================================= */

function obtenirZoneImpression() {
    let zone = document.getElementById("printArea");

    if (!zone) {
        zone = document.createElement("section");
        zone.id = "printArea";
        zone.className = "print-area";
        document.body.appendChild(zone);
    }

    return zone;
}

function creerEtiquette(commande) {
    const etiquette = document.createElement("article");
    etiquette.className = "shipping-label";

    etiquette.innerHTML = `
        <h2>CRYSTAL BOUTIK</h2>

        <p><strong>N° :</strong>
            ${echapperHTML(commande.numeroCommande || "")}
        </p>

        <p><strong>Client :</strong>
            ${echapperHTML(commande.client || "")}
        </p>

        <p>
            <strong>Produit :</strong>
            ${echapperHTML(commande.produit || "")}
            &nbsp;&nbsp;
            <strong>Qté :</strong>
            ${echapperHTML(commande.quantite || "")}
        </p>

        <p><strong>Prix :</strong></p>

        <p><strong>Avance :</strong></p>

        <p><strong>Frais de livraison :</strong></p>

        <p><strong>Reste :</strong></p>

        <p><strong>Lieu :</strong>
            ${echapperHTML(commande.lieu || "")}
        </p>

        <p><strong>Tél :</strong>
            ${echapperHTML(commande.telephone || "")}
        </p>
    `;

    return etiquette;
}

function imprimerCommandes() {
    const selectionnees = commandes.filter(c =>
        selectionImpression.has(c.id)
    );

    if (selectionnees.length === 0) {
        alert("Sélectionne au moins une commande à imprimer.");
        return;
    }

    const zone = obtenirZoneImpression();
    zone.innerHTML = "";

    const grille = document.createElement("div");
    grille.className = "labels-grid";

    selectionnees.forEach(commande => {
        grille.appendChild(creerEtiquette(commande));
    });

    zone.appendChild(grille);

    window.print();
}

/* =========================================================
   EXPORTATION JSON
========================================================= */

function exporterCommandes() {
    const fichier = new Blob(
        [JSON.stringify(commandes, null, 2)],
        { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(fichier);
    const lien = document.createElement("a");

    lien.href = url;
    lien.download =
        "gestion-commandes-" +
        new Date().toISOString().slice(0, 10) +
        ".json";

    document.body.appendChild(lien);
    lien.click();
    lien.remove();

    URL.revokeObjectURL(url);
}

/* =========================================================
   IMPORTATION JSON
========================================================= */

async function importerCommandes(evenement) {
    const fichier = evenement.target.files?.[0];
    if (!fichier) return;

    try {
        const texte = await fichier.text();
        const donnees = JSON.parse(texte);

        if (!Array.isArray(donnees)) {
            throw new Error("Le fichier doit contenir une liste.");
        }

        const nouvelles = donnees
            .filter(c => c && typeof c === "object")
            .map(c => ({
                id: String(c.id || genererId()),
                client: String(c.client || ""),
                telephone: String(c.telephone || ""),
                lieu: String(c.lieu || ""),
                produit: String(c.produit || ""),
                quantite: Math.max(1, nombre(c.quantite || 1)),
                prix: Math.max(0, nombre(c.prix)),
                acompte: Math.max(0, nombre(c.acompte)),
                fraisLivraison: Math.max(
                    0,
                    nombre(c.fraisLivraison)
                ),
                statut: String(c.statut || "En attente"),
        dateCommande: String(c.dateCommande || ""),
dateCreation: c.dateCreation || new Date().toISOString()
               
            }))
            .filter(c => c.client && c.produit);

        if (!confirm(
            `Importer ${nouvelles.length} commande(s) ?\n` +
            "Les commandes existantes seront conservées."
        )) {
            return;
        }

        const ids = new Set(commandes.map(c => c.id));

        nouvelles.forEach(c => {
            if (ids.has(c.id)) {
                c.id = genererId();
            }
            ids.add(c.id);
            commandes.push(c);
        });

        if (sauvegarderCommandes()) {
            afficherCommandes();
            alert(`${nouvelles.length} commande(s) importée(s).`);
        }
    } catch (erreur) {
        console.error("Erreur d'importation :", erreur);
        alert("Le fichier JSON est invalide ou illisible.");
    } finally {
        evenement.target.value = "";
    }
}

/* =========================================================
   SUPPRESSION DE TOUTES LES COMMANDES
========================================================= */

function toutSupprimer() {
    if (commandes.length === 0) {
        alert("Aucune commande à supprimer.");
        return;
    }

    const confirmation = confirm(
        "Attention : cette action supprimera toutes les commandes.\n" +
        "Veux-tu vraiment continuer ?"
    );

    if (!confirmation) return;

    const secondeConfirmation = confirm(
        "Confirme une dernière fois la suppression totale."
    );

    if (!secondeConfirmation) return;

    const anciennesCommandes = commandes;
    commandes = [];

    if (sauvegarderCommandes()) {
        selectionImpression.clear();
        reinitialiserFormulaire();
        afficherCommandes();
    } else {
        commandes = anciennesCommandes;
        afficherCommandes();
    }
}

/* =========================================================
   ÉVÉNEMENTS DU TABLEAU
========================================================= */

commandesBody?.addEventListener("click", evenement => {
    const bouton = evenement.target.closest("button[data-action]");
    if (!bouton) return;

    const id = bouton.dataset.id;
    const action = bouton.dataset.action;

   if (action === "modifier") {
    console.log("MODIFIER CLIQUÉ");
    console.log("ID reçu :", id);
    console.log("Commande trouvée :", commandes.find(c => c.id === id));

    modifierCommande(id);
} else if (action === "supprimer") {
    supprimerCommande(id);
} else if (action === "whatsapp") {
    envoyerWhatsApp(id);
} else if (action === "facebook") {
    envoyerFacebook(id);
}
});

commandesBody?.addEventListener("change", evenement => {
    const caseSelection = evenement.target.closest(
        "input[data-selection]"
    );

    if (!caseSelection) return;

    gererSelectionImpression(
        caseSelection.dataset.selection,
        caseSelection.checked
    );
});

/* =========================================================
   ÉVÉNEMENTS DU FORMULAIRE
========================================================= */

commandeForm?.addEventListener("submit", enregistrerCommande);

btnAnnuler?.addEventListener("click", reinitialiserFormulaire);

[
    nombreProduit,
    prixProduit,
    acompte
].forEach(element => {
    element?.addEventListener("input", recalculerFormulaire);
});

recherche?.addEventListener("input", afficherCommandes);
filtreStatut?.addEventListener("change", afficherCommandes);

btnExporter?.addEventListener("click", exporterCommandes);

fichierImport?.addEventListener("change", importerCommandes);

btnToutSupprimer?.addEventListener("click", toutSupprimer);

/* =========================================================
   PRODUITS
========================================================= */

function afficherProduits() {

    if (!listeProduits) return;

    if (produits.length === 0) {

        listeProduits.innerHTML = `
            <div class="empty-state">
                <div>📦</div>
                <h3>Aucun produit</h3>
                <p>Ajoutez votre premier produit.</p>
            </div>
        `;

        return;
    }

    const produitsParCategorie = {};

produits.forEach((produit) => {

    const categorie =
        produit.categorie || "Autres";

    if (!produitsParCategorie[categorie]) {
        produitsParCategorie[categorie] = [];
    }

    produitsParCategorie[categorie].push(produit);
});

listeProduits.innerHTML = Object.entries(produitsParCategorie).map(
    ([categorie, produitsCategorie]) => {

        return `
            <div class="categorie-produits">

                <h3
    class="categorie-toggle"
    data-categorie="${echapperHTML(categorie)}"
    style="cursor:pointer;"
>
    📂 🏷️ ${echapperHTML(categorie)}
</h3>

                <div class="categorie-contenu" style="display:none;">

    ${produitsCategorie.map((produit) => {

        return `

            <div class="product-item">

<div>

    ${
        produit.photo
            ? `
                <div>
                    <img
                        src="${echapperHTML(produit.photo)}"
                        alt="${echapperHTML(produit.nom)}"
                        style="
                            width:100px;
                            height:100px;
                            object-fit:cover;
                            border-radius:10px;
                            margin-bottom:8px;
                        "
                    >
                </div>
            `
            : ""
    }

    <strong>${echapperHTML(produit.nom)}</strong>

    <div>

            📊 Stock :
    
    ${
        nombre(produit.quantite) === 0
            ? "🔴 Rupture de stock"
            : nombre(produit.quantite) <= 2
                ? `🟠 Stock faible (${nombre(produit.quantite)})`
                : `🟢 ${nombre(produit.quantite)} disponible(s)`
    }
</div>

        <div>
            Prix : ${formaterMontant(produit.prix)}
        </div>

                    ${
                        produit.couleur
                            ? `<div>🎨 Couleur : ${produit.couleur}</div>`
                            : ""
                    }

                    ${
                        produit.taille
                            ? `<div>📏 Taille : ${produit.taille}</div>`
                            : ""
                    }

                                </div>

                
<div>

    <button
    type="button"
    class="btn primary"
    data-produit-action="modifier"
    data-produit-id="${echapperHTML(produit.id)}"
    title="Modifier le produit"
    aria-label="Modifier le produit"
>
    ✏️
</button>

<button
    type="button"
    class="btn danger-outline"
    data-produit-action="supprimer"
    data-produit-id="${echapperHTML(produit.id)}"
    title="Supprimer le produit"
    aria-label="Supprimer le produit"
>
    🗑️
</button>

</div>

            </div>
        `;

                }).join("")}

</div>

            </div>
        `;
    }

   ).join("");

    document.querySelectorAll(".categorie-toggle").forEach((titre) => {

        titre.addEventListener("click", () => {

            const contenu = titre.nextElementSibling;

            if (!contenu) return;

            if (contenu.style.display === "none") {

                contenu.style.display = "";

            } else {

                contenu.style.display = "none";

            }

        });

    });
}

function afficherFichesProduits() {

    if (!listeFichesProduits) return;

    const rechercheTexte =
        rechercheFicheProduit
            ? rechercheFicheProduit.value.trim().toLowerCase()
            : "";

    const fichesFiltrees = fichesProduits.filter((fiche) => {

        const nom = String(fiche.nom || "").toLowerCase();

        return nom.includes(rechercheTexte);
    });

    if (fichesFiltrees.length === 0) {

        listeFichesProduits.innerHTML = `
            <div class="empty-state">
                <div>📋</div>
                <h3>Aucune fiche produit</h3>
                <p>
                    Ajoutez une fiche pour conserver
                    les informations de référence.
                </p>
            </div>
        `;

        return;
    }

    listeFichesProduits.innerHTML =
        fichesFiltrees.map((fiche) => {

            return `
                <div class="product-item">

                    <div>

                        ${
                            fiche.photo
                                ? `
                                    <div>
                                        <img
                                            src="${echapperHTML(fiche.photo)}"
                                            alt="${echapperHTML(fiche.nom)}"
                                            style="
                                                width:100px;
                                                height:100px;
                                                object-fit:cover;
                                                border-radius:10px;
                                                margin-bottom:8px;
                                            "
                                        >
                                    </div>
                                `
                                : ""
                        }

                        <strong>
                            ${echapperHTML(fiche.nom)}
                        </strong>

                        <div>
                            ⚖️ Poids :
                            ${nombre(fiche.poids).toFixed(3)} kg
                        </div>

                        <div>
                            🚚 Frais :
                            ${formaterMontant(fiche.frais)}
                        </div>

                         <div>
                            💰 Prix :
                            ${formaterMontant(fiche.prix)}
                      </div>
  
                    </div>

                    <div>

                        <button
                            type="button"
                            class="btn primary"
                            data-fiche-action="modifier"
                            data-fiche-id="${echapperHTML(fiche.id)}"
                            title="Modifier la fiche"
                            aria-label="Modifier la fiche"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn danger-outline"
                            data-fiche-action="supprimer"
                            data-fiche-id="${echapperHTML(fiche.id)}"
                            title="Supprimer la fiche"
                            aria-label="Supprimer la fiche"
                        >
                            🗑️
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}

rechercheFicheProduit?.addEventListener("input", function () {

    afficherFichesProduits();

});

ficheProduitForm?.addEventListener("submit", function (evenement) {

    evenement.preventDefault();

    ajouterFicheProduit();

});

function convertirImageEnBase64(fichier) {
    return new Promise((resolve, reject) => {
        const lecteur = new FileReader();

        lecteur.onload = () => resolve(lecteur.result);
        lecteur.onerror = () => reject(
            new Error("Impossible de lire la photo.")
        );

        lecteur.readAsDataURL(fichier);
    });
}


async function ajouterFicheProduit() {

    if (!ficheProduitForm) return;

    if (!ficheProduitForm.reportValidity()) {
        return;
    }

    const nom = nomFicheProduit.value.trim();
    const poids = Math.max(
        0,
        nombre(poidsFicheProduit.value)
    );
    const frais = Math.max(
        0,
        nombre(fraisFicheProduit.value)
    );

   const prix = Math.max(
    0,
    nombre(prixFicheProduit.value)
);

    if (!nom) {
        alert("Veuillez renseigner le nom du produit.");
        return;
    }

    let photo = "";

    if (
        photoFicheProduit &&
        photoFicheProduit.files &&
        photoFicheProduit.files.length > 0
    ) {

        const fichier = photoFicheProduit.files[0];

        photo = await convertirImageEnBase64(fichier);
    }

    // =====================================================
// MODIFICATION D'UNE FICHE EXISTANTE
// =====================================================

if (ficheProduitEnCoursModification !== null) {

    const index = fichesProduits.findIndex(
        item =>
            String(item.id) ===
            String(ficheProduitEnCoursModification)
    );

    if (index === -1) {
        alert("Fiche produit introuvable.");
        return;
    }

    // Conserver l'ancienne photo si aucune nouvelle photo
    // n'a été sélectionnée
    const photoFinale =
        photo || fichesProduits[index].photo || "";

    fichesProduits[index] = {
    id: fichesProduits[index].id,
    nom: nom,
    poids: poids,
    frais: frais,
    prix: prix,
    photo: photoFinale
};

    const sauvegardeOK =
        sauvegarderFichesProduits();

    if (!sauvegardeOK) {
        return;
    }

    ficheProduitEnCoursModification = null;

    ficheProduitForm.reset();

    btnEnregistrerFicheProduit.textContent =
        "➕ Ajouter la fiche";

    afficherFichesProduits();

    alert("Fiche produit modifiée avec succès.");

    return;
}


// =====================================================
// AJOUT D'UNE NOUVELLE FICHE
// =====================================================

const fiche = {
    id: genererId(),
    nom: nom,
    poids: poids,
    frais: frais,
    prix: prix,
    photo: photo
};

fichesProduits.push(fiche);

    const sauvegardeOK =
        sauvegarderFichesProduits();

    if (!sauvegardeOK) {
        return;
    }

    ficheProduitForm.reset();

    btnEnregistrerFicheProduit.textContent =
        "➕ Ajouter la fiche";

    afficherFichesProduits();

        alert("Fiche produit ajoutée avec succès.");
}


// =========================================================
// MODIFIER ET SUPPRIMER UNE FICHE PRODUIT
// =========================================================

listeFichesProduits?.addEventListener("click", function (evenement) {

    const bouton = evenement.target.closest(
        "[data-fiche-action]"
    );

    if (!bouton) return;

    const idFiche = bouton.dataset.ficheId;
    const action = bouton.dataset.ficheAction;

    const fiche = fichesProduits.find(
        (item) => String(item.id) === String(idFiche)
    );

    if (!fiche) return;

    // MODIFIER UNE FICHE
    if (action === "modifier") {

        ficheProduitEnCoursModification = fiche.id;

        nomFicheProduit.value = fiche.nom || "";
        poidsFicheProduit.value = fiche.poids || "";
        fraisFicheProduit.value = fiche.frais || "";
        prixFicheProduit.value = fiche.prix || "";

        btnEnregistrerFicheProduit.textContent =
            "💾 Enregistrer les modifications";

        ficheProduitForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    // SUPPRIMER UNE FICHE
    if (action === "supprimer") {

        const confirmation = confirm(
            `Voulez-vous supprimer la fiche "${fiche.nom}" ?`
        );

        if (!confirmation) return;

        fichesProduits = fichesProduits.filter(
            (item) => String(item.id) !== String(idFiche)
        );

        if (sauvegarderFichesProduits()) {
            afficherFichesProduits();
        }
    }

});

async function ajouterProduit() {

    if (!produitForm) return;

    if (!produitForm.reportValidity()) {
        return;
    }

    const nom = nomProduitStock.value.trim();

    if (!nom) {
        alert("Veuillez renseigner le nom du produit.");
        return;
    }

let photo = "";

if (
    photoProduit &&
    photoProduit.files &&
    photoProduit.files.length > 0
) {
    const fichier = photoProduit.files[0];
    photo = await convertirImageEnBase64(fichier);
}
   
    const donnees = {
    nom: nom,
    categorie: categorieProduit.value,
    quantite: Math.max(0, nombre(quantiteStock.value)),
    couleur: couleurProduit.value.trim(),
    taille: tailleProduit.value.trim(),
    prix: Math.max(0, nombre(prixStock.value))
};

    // MODIFICATION D'UN PRODUIT EXISTANT
if (produitEnCoursModification !== null) {

    const index = produits.findIndex(
        item => String(item.id) === String(produitEnCoursModification)
    );

    if (index === -1) {
        alert("Produit introuvable.");
        return;
    }

    // Conserver l'identifiant du produit
    const idConserve = produits[index].id;
    produits[index] = {
    id: idConserve,
    nom: donnees.nom,
    categorie: donnees.categorie,
    quantite: donnees.quantite,
    couleur: donnees.couleur,
    taille: donnees.taille,
    prix: donnees.prix,
    photo: photo || produits[index].photo || ""
};

    // Sauvegarder
    const sauvegardeOK = sauvegarderProduits();

    if (!sauvegardeOK) {
        return;
    }

    // Sortir du mode modification
    produitEnCoursModification = null;

    // Réinitialiser le formulaire
    produitForm.reset();
    quantiteStock.value = "0";

    // Remettre le bouton normal
    btnAjouterProduit.textContent = "➕ Ajouter le produit";

    // Réafficher la liste avec les nouveaux boutons
    afficherProduits();

    alert("Produit modifié avec succès.");

    return;
}

    // AJOUT D'UN NOUVEAU PRODUIT
    const produit = {
    id: genererId(),
    ...donnees,
    photo: photo
};

    produits.push(produit);

    sauvegarderProduits();
    afficherProduits();

    produitForm.reset();
    quantiteStock.value = "0";

    btnAjouterProduit.textContent = "➕ Ajouter le produit";

    alert("Produit ajouté avec succès.");
}

// =========================================================
// ENREGISTREMENT DU FORMULAIRE PRODUIT
// =========================================================

produitForm?.addEventListener("submit", function (evenement) {

    evenement.preventDefault();

    ajouterProduit();

});

// =========================================================
// MODIFIER ET SUPPRIMER UN PRODUIT
// =========================================================

listeProduits?.addEventListener("click", function (evenement) {

    const bouton = evenement.target.closest(
        "[data-produit-action]"
    );

    if (!bouton) return;

    const idProduit = bouton.dataset.produitId;
    const action = bouton.dataset.produitAction;

    const produit = produits.find(
        (item) => String(item.id) === String(idProduit)
    );

    if (!produit) return;

    // MODIFIER UN PRODUIT
    if (action === "modifier") {

        produitEnCoursModification = produit.id;

        nomProduitStock.value = produit.nom;
        quantiteStock.value = produit.quantite;
        couleurProduit.value = produit.couleur || "";
        tailleProduit.value = produit.taille || "";
        prixStock.value = produit.prix;

        btnAjouterProduit.textContent =
            "💾 Enregistrer les modifications";

        produitForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    // SUPPRIMER UN PRODUIT
    if (action === "supprimer") {

        const confirmation = confirm(
            `Voulez-vous supprimer le produit "${produit.nom}" ?`
        );

        if (!confirmation) return;

        produits = produits.filter(
            (item) => String(item.id) !== String(idProduit)
        );

        sauvegarderProduits();
        afficherProduits();
    }

});


/* =========================================================
   GESTION DES ACHATS PINDUODUO
========================================================= */

function chargerAchats() {
    try {
        const donnees = localStorage.getItem(CLE_ACHATS);
        const achats = donnees ? JSON.parse(donnees) : [];

        return Array.isArray(achats) ? achats : [];
    } catch (erreur) {
        console.error("Erreur de lecture des achats :", erreur);
        return [];
    }
}

function sauvegarderAchats(achats) {
    localStorage.setItem(CLE_ACHATS, JSON.stringify(achats));
}


window.synchroniserAchatsAvecSupabase = async function () {
    const client = window.clientSupabase;

    if (!client) {
    console.warn("Supabase n'est pas encore prêt.");
    return false;
}

    const { data: sessionData, error: sessionError } =
        await client.auth.getSession();

    if (sessionError || !sessionData.session) {
    console.warn("Aucune session active pour synchroniser les achats.");
    return false;
}

    const userId = sessionData.session.user.id;
    const achatsLocaux = chargerAchats();

    const { data: achatsDistants, error: lectureErreur } =
        await client
            .from("achats_pinduoduo")
            .select("id, user_id, nom_client, tracking, nom_produit, date_achat, photo")
            .eq("user_id", userId);

    if (lectureErreur) {
        console.error("Erreur de lecture Supabase :", lectureErreur.message);
return false;
    }

    const idsDistants = new Set(
        (achatsDistants || []).map(achat => String(achat.id))
    );

    const achatsANvoyer = achatsLocaux
        .filter(achat => !idsDistants.has(String(achat.id)))
        .map(achat => ({
            id: String(achat.id),
            user_id: userId,
            nom_client: achat.nomClient,
            tracking: achat.tracking,
            nom_produit: achat.nomProduit,
            date_achat: achat.dateAchat,
            photo: achat.photo
        }));

    let nouveauxAchats = [];

    if (achatsANvoyer.length > 0) {
        const { data, error } = await client
            .from("achats_pinduoduo")
            .insert(achatsANvoyer)
            .select("id, user_id, nom_client, tracking, nom_produit, date_achat, photo");

        if (error) {
            console.error("Erreur d'enregistrement Supabase :", error.message);
return false;
        }

        nouveauxAchats = data || [];
    }

    const tousLesAchats = new Map();

    [...(achatsDistants || []), ...nouveauxAchats].forEach(achat => {
        tousLesAchats.set(String(achat.id), {
            id: String(achat.id),
            nomClient: achat.nom_client,
            tracking: achat.tracking,
            nomProduit: achat.nom_produit,
            dateAchat: achat.date_achat,
            photo: achat.photo
        });
    });

    achatsLocaux.forEach(achat => {
        tousLesAchats.set(String(achat.id), achat);
    });

    const achatsFusionnes = Array.from(tousLesAchats.values());

    sauvegarderAchats(achatsFusionnes);
    afficherAchats();

    console.log("Synchronisation des achats terminée.");
   return true;
}


function afficherAchats() {
    if (!listeAchats) return;

    const achats = chargerAchats();

    if (achats.length === 0) {
        listeAchats.innerHTML =
            "<p>Aucun achat enregistré pour le moment.</p>";
        return;
    }

    // Regrouper les achats par date
    const groupes = {};

    achats.forEach(achat => {
        const date = String(achat.dateAchat || "Date inconnue");

        if (!groupes[date]) {
            groupes[date] = [];
        }

        groupes[date].push(achat);
    });

    // Trier les dates de la plus récente à la plus ancienne
    const dates = Object.keys(groupes).sort((a, b) => {
        const dateA = Date.parse(a);
        const dateB = Date.parse(b);

        if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
            return b.localeCompare(a);
        }

        return dateB - dateA;
    });

    listeAchats.innerHTML = `
        <h3>📦 Achats enregistrés (${achats.length})</h3>

        ${dates.map((date, index) => `
            <section class="groupe-achats-date"
                     style="margin-top: 16px;">

                <button
                    type="button"
                    class="btn"
                    data-toggle-date="${echapperHTML(date)}"
                    aria-expanded="true"
                    style="width: 100%; text-align: left; margin-bottom: 12px;"
                >
                    <span data-fleche-date="${echapperHTML(date)}">▼</span>
                    📅 ${echapperHTML(date)}
                    — ${groupes[date].length} achat(s)
                </button>

                <div data-contenu-date="${echapperHTML(date)}">
                    <div class="grille-achats">
                        ${groupes[date].map(achat => `
                            <article class="carte-achat">

                                ${achat.photo ? `
                                    <img
                                        class="photo-achat"
                                        src="${achat.photo}"
                                        alt="${echapperHTML(achat.nomProduit)}"
                                        style="width: 100%; max-width: 180px; height: 160px; object-fit: contain; display: block; margin: 0 auto 12px;"
                                    >
                                ` : `
                                    <div class="photo-achat-absente">
                                        📦 Aucune photo
                                    </div>
                                `}

                                <div class="contenu-carte-achat">
                                    <h4>${echapperHTML(achat.nomProduit)}</h4>

                                    <p><strong>Client :</strong>
                                        ${echapperHTML(achat.nomClient)}</p>

                                    <p><strong>Tracking :</strong>
                                        ${echapperHTML(achat.tracking)}</p>

                                    <p><strong>Date d'achat :</strong>
                                        ${echapperHTML(achat.dateAchat)}</p>

                                    <button
                                        type="button"
                                        class="btn"
                                        data-supprimer-achat="${echapperHTML(achat.id)}"
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </article>
                        `).join("")}
                    </div>
                </div>
            </section>
        `).join("")}
    `;

    // Masquer ou afficher les achats d'une date au clic
    listeAchats.querySelectorAll("[data-toggle-date]").forEach(bouton => {
        bouton.addEventListener("click", () => {
            const date = bouton.getAttribute("data-toggle-date");
            const contenu = listeAchats.querySelector(
                `[data-contenu-date="${CSS.escape(date)}"]`
            );
            const fleche = bouton.querySelector("[data-fleche-date]");

            if (!contenu) return;

            const estVisible = contenu.style.display !== "none";

            contenu.style.display = estVisible ? "none" : "block";
            bouton.setAttribute("aria-expanded", String(!estVisible));

            if (fleche) {
                fleche.textContent = estVisible ? "▶" : "▼";
            }
        });
    });
}

formAchat?.addEventListener("submit", async function (evenement) {
    evenement.preventDefault();

    if (!formAchat.reportValidity()) return;

    const nomClient = nomClientAchat.value.trim();
    const tracking = trackingAchat.value.trim();
    const nomProduit = nomProduitAchat.value.trim();
    const date = dateAchat.value;
    const fichier = photoAchat.files[0];

    let photo = "";

    try {
        if (fichier) {
            if (!fichier.type.startsWith("image/")) {
                alert("Veuillez sélectionner une image valide.");
                return;
            }

            // Limite la taille pour éviter de saturer le stockage.
            if (fichier.size > 1024 * 1024) {
                alert(
                    "La photo dépasse 1 Mo. Choisissez une image plus légère."
                );
                return;
            }

            photo = await convertirImageEnBase64(fichier);
        }

        const achats = chargerAchats();

        achats.unshift({
            id: genererId(),
            nomClient: nomClient,
            tracking: tracking,
            nomProduit: nomProduit,
            dateAchat: date,
            photo: photo
        });

        
        sauvegarderAchats(achats);

        // Synchroniser avec Supabase sans perdre
        // la sauvegarde locale si Internet est indisponible.
        let synchronisationOK = false;

try {
    synchronisationOK = await synchroniserAchatsAvecSupabase();
} catch (erreur) {
    console.error("Erreur de synchronisation :", erreur);
}

        formAchat.reset();
        afficherAchats();

       
alert(
    synchronisationOK
        ? "Achat enregistré et synchronisé avec Supabase !"
        : "Achat enregistré sur cet appareil, mais la synchronisation a échoué. Réessaie après avoir vérifié ta connexion."
);


    } catch (erreur) {
        console.error("Erreur d'enregistrement de l'achat :", erreur);

        alert(
            "Impossible d'enregistrer cet achat. " +
            "Vérifiez l'espace de stockage disponible."
        );
    }
});

listeAchats?.addEventListener("click", async function (evenement) {
    const bouton = evenement.target.closest("[data-supprimer-achat]");

    if (!bouton) return;

    const id = bouton.dataset.supprimerAchat;

    if (!confirm("Voulez-vous supprimer cet achat ?")) return;

    const client = window.clientSupabase;

    try {
        // Supprimer d'abord dans Supabase si une session est active.
        if (client) {
            const { data: sessionData, error: sessionError } =
                await client.auth.getSession();

            if (sessionError) {
                throw sessionError;
            }

            if (sessionData.session) {
                const { error: suppressionErreur } = await client
                    .from("achats_pinduoduo")
                    .delete()
                    .eq("id", String(id))
                    .eq("user_id", sessionData.session.user.id);

                if (suppressionErreur) {
                    throw suppressionErreur;
                }
            }
        }

        // Mettre ensuite à jour la sauvegarde locale.
        const achats = chargerAchats().filter(
            achat => String(achat.id) !== String(id)
        );

        sauvegarderAchats(achats);
        afficherAchats();

        alert("Achat supprimé.");
    } catch (erreur) {
        console.error("Erreur de suppression :", erreur);

        alert(
            "La suppression n'a pas pu être confirmée sur Supabase. " +
            "L'achat est conservé sur cet appareil. Réessaie avec Internet."
        );
    }
});

/* =========================================================
   SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .catch(erreur => {
                console.error(
                    "Erreur d'enregistrement du service worker :",
                    erreur
                );
            });
    });
}

/* =========================================================
   DÉMARRAGE
========================================================= */

afficherCommandes();
recalculerFormulaire();
mettreAJourCompteurImpression();
afficherProduits();
afficherFichesProduits();
afficherAchats();


/* =========================================================
   DÉPENSES DE PUBLICATION
========================================================= */

const CLE_DEPENSES_PUBLICATIONS = "crystalBoutikDepensesPublicationsV1";

let lignesDepensesPublication = [];

function chargerPublicationsDepenses() {
    try {
        return JSON.parse(
            localStorage.getItem(CLE_DEPENSES_PUBLICATIONS) || "[]"
        );
    } catch (erreur) {
        console.error("Erreur de lecture des publications :", erreur);
        return [];
    }
}

function sauvegarderPublicationsDepenses(publications) {
    localStorage.setItem(
        CLE_DEPENSES_PUBLICATIONS,
        JSON.stringify(publications)
    );
}

function formaterArPublication(montant) {
    return Math.round(Number(montant) || 0).toLocaleString("fr-FR") + " Ar";
}

function calculerTotalDepensesPublication(lignes) {
    return (lignes || []).reduce((total, ligne) => {
        const montant = Number(ligne.montant) || 0;

        // Les anciennes dépenses en USD sont converties avec
        // le taux enregistré dans leur ancienne publication.
        if (ligne.devise === "USD") {
            return total + montant;
        }

        return total + montant;
    }, 0);
}

function actualiserTotauxPublication() {
    const total = calculerTotalDepensesPublication(
        lignesDepensesPublication
    );

    const champTotal = document.getElementById("totalDepensesPublication");
    if (champTotal) {
        champTotal.textContent = formaterArPublication(total);
    }

    const champGain = document.getElementById("gainNetPublication");
    if (champGain) {
        champGain.textContent = "Non calculé";
    }
}

function afficherLignesDepensesPublication() {
    const liste = document.getElementById(
        "listeLignesDepensesPublication"
    );

    if (!liste) return;

    if (lignesDepensesPublication.length === 0) {
        liste.innerHTML = "<p>Aucune dépense ajoutée.</p>";
        actualiserTotauxPublication();
        return;
    }

    liste.innerHTML = lignesDepensesPublication.map((ligne, index) => `
        <div class="card">
            <strong>${echapperHTML(ligne.libelle)}</strong>
            <p>Montant : ${formaterArPublication(ligne.montant)}</p>
            <button type="button" class="btn"
                data-retirer-ligne-depense="${index}">
                Supprimer
            </button>
        </div>
    `).join("");

    actualiserTotauxPublication();
}

function afficherPublicationsDepenses() {
    const liste = document.getElementById("listePublicationsDepenses");
    if (!liste) return;

    const publications = chargerPublicationsDepenses();

    if (publications.length === 0) {
        liste.innerHTML = "<p>Aucune publication enregistrée.</p>";
        return;
    }

    liste.innerHTML = publications.map(publication => {
        const depenses = (publication.depenses || []).map(ligne => {
            // Compatibilité avec les anciennes publications :
            // les anciens montants USD sont convertis en Ar
            // à l'aide du taux sauvegardé.
            const montantAr = ligne.devise === "USD"
                ? (Number(ligne.montant) || 0) * (Number(publication.taux) || 0)
                : Number(ligne.montant) || 0;

            return {
                ...ligne,
                montantAr
            };
        });

        const total = depenses.reduce(
            (somme, ligne) => somme + ligne.montantAr,
            0
        );

        return `
            <details class="card">
                <summary>
                    <strong>${echapperHTML(publication.nom)}</strong>
                    — ${echapperHTML(publication.date)}
                </summary>

                <p>Dépenses totales : ${formaterArPublication(total)}</p>

                <ul>
                    ${depenses.map(ligne => `
                        <li>
                            ${echapperHTML(ligne.libelle)} :
                            ${formaterArPublication(ligne.montantAr)}
                        </li>
                    `).join("")}
                </ul>

                <button type="button" class="btn"
                    data-modifier-publication="${echapperHTML(publication.id)}">
                    Modifier
                </button>

                <button type="button" class="btn"
                    data-supprimer-publication="${echapperHTML(publication.id)}">
                    Supprimer
                </button>
            </details>
        `;
    }).join("");
}

const formulairePublicationDepense = document.getElementById(
    "formPublicationDepense"
);

const categorieDepensePublication = document.getElementById(
    "categorieDepensePublication"
);

const champLibelleDepensePublication = document.getElementById(
    "champLibelleDepensePublication"
);

categorieDepensePublication?.addEventListener("change", () => {
    const autre = categorieDepensePublication.value === "Autre";

    if (champLibelleDepensePublication) {
        champLibelleDepensePublication.style.display = autre ? "" : "none";
    }

    const champLibelle = document.getElementById("libelleDepensePublication");
    if (champLibelle) {
        champLibelle.required = autre;
    }
});

document.getElementById("btnAjouterLigneDepense")?.addEventListener(
    "click",
    () => {
        const categorie = categorieDepensePublication.value;

        const libelleAutre = document.getElementById(
            "libelleDepensePublication"
        ).value.trim();

        const montant = Number(
            document.getElementById("montantDepensePublication").value
        );

        if (!Number.isFinite(montant) || montant <= 0) {
            alert("Saisissez un montant en Ariary supérieur à zéro.");
            return;
        }

        if (categorie === "Autre" && !libelleAutre) {
            alert("Saisissez le nom de cette dépense.");
            return;
        }

        lignesDepensesPublication.push({
            libelle: categorie === "Autre" ? libelleAutre : categorie,
            montant,
            devise: "Ar"
        });

        document.getElementById("montantDepensePublication").value = "";
        document.getElementById("libelleDepensePublication").value = "";

        afficherLignesDepensesPublication();
    }
);

document.getElementById("listeLignesDepensesPublication")?.addEventListener(
    "click",
    evenement => {
        const bouton = evenement.target.closest(
            "[data-retirer-ligne-depense]"
        );

        if (!bouton) return;

        lignesDepensesPublication.splice(
            Number(bouton.dataset.retirerLigneDepense),
            1
        );

        afficherLignesDepensesPublication();
    }
);

formulairePublicationDepense?.addEventListener("submit", evenement => {
    evenement.preventDefault();

    const nom = document.getElementById("nomPublicationDepense").value.trim();
    const date = document.getElementById("datePublicationDepense").value;

    if (!nom || !date) {
        alert("Vérifiez le nom et la date de la publication.");
        return;
    }

    const publications = chargerPublicationsDepenses();
    const idExistant = document.getElementById("publicationDepenseId").value;

    const anciennePublication = publications.find(
        item => String(item.id) === String(idExistant)
    );

    const publication = {
        ...(anciennePublication || {}),
        id: idExistant || genererId(),
        nom,
        date,
        depenses: lignesDepensesPublication.map(ligne => ({
            ...ligne,
            devise: "Ar"
        }))
    };

    const index = publications.findIndex(
        item => String(item.id) === String(publication.id)
    );

    if (index >= 0) {
        publications[index] = publication;
    } else {
        publications.unshift(publication);
    }

    try {
        sauvegarderPublicationsDepenses(publications);

        formulairePublicationDepense.reset();
        document.getElementById("publicationDepenseId").value = "";

        document.getElementById(
            "btnEnregistrerPublicationDepense"
        ).textContent = "💾 Enregistrer la publication";

        document.getElementById(
            "btnAnnulerModificationPublication"
        ).style.display = "none";

        lignesDepensesPublication = [];
        afficherLignesDepensesPublication();
        afficherPublicationsDepenses();

        alert("Publication enregistrée sur cet appareil.");
    } catch (erreur) {
        console.error("Erreur d'enregistrement :", erreur);
        alert("Impossible d'enregistrer. L'espace de stockage est peut-être plein.");
    }
});

document.getElementById("btnAnnulerModificationPublication")?.addEventListener(
    "click",
    () => {
        formulairePublicationDepense.reset();
        document.getElementById("publicationDepenseId").value = "";

        lignesDepensesPublication = [];

        document.getElementById(
            "btnEnregistrerPublicationDepense"
        ).textContent = "💾 Enregistrer la publication";

        document.getElementById(
            "btnAnnulerModificationPublication"
        ).style.display = "none";

        afficherLignesDepensesPublication();
    }
);

document.getElementById("listePublicationsDepenses")?.addEventListener(
    "click",
    evenement => {
        const modifier = evenement.target.closest("[data-modifier-publication]");
        const supprimer = evenement.target.closest("[data-supprimer-publication]");

        if (!modifier && !supprimer) return;

        const id = modifier
            ? modifier.dataset.modifierPublication
            : supprimer.dataset.supprimerPublication;

        const publications = chargerPublicationsDepenses();

        const publication = publications.find(
            item => String(item.id) === String(id)
        );

        if (!publication) return;

        if (supprimer) {
            if (!confirm("Supprimer cette publication et ses dépenses ?")) return;

            sauvegarderPublicationsDepenses(
                publications.filter(item => String(item.id) !== String(id))
            );

            afficherPublicationsDepenses();
            return;
        }

        document.getElementById("publicationDepenseId").value = publication.id;
        document.getElementById("nomPublicationDepense").value = publication.nom;
        document.getElementById("datePublicationDepense").value = publication.date;

        lignesDepensesPublication = (publication.depenses || []).map(ligne => {
            const montantAr = ligne.devise === "USD"
                ? (Number(ligne.montant) || 0) * (Number(publication.taux) || 0)
                : Number(ligne.montant) || 0;

            return {
                libelle: ligne.libelle,
                montant: montantAr,
                devise: "Ar"
            };
        });

        afficherLignesDepensesPublication();

        document.getElementById(
            "btnEnregistrerPublicationDepense"
        ).textContent = "💾 Enregistrer les modifications";

        document.getElementById(
            "btnAnnulerModificationPublication"
        ).style.display = "";

        formulairePublicationDepense.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);

afficherLignesDepensesPublication();
afficherPublicationsDepenses();
actualiserTotauxPublication();

/* =========================================
   PERSONNALISATION GLOBALE DU TEXTE
========================================= */

const CLE_REGLAGES_TEXTE = "gestionCommandesReglagesTexteV1";

function appliquerReglagesTexte(reglages) {
    const couleur = reglages.couleur || "#222222";
    const police = reglages.police || "Arial, sans-serif";
    const taille = reglages.taille || "16px";

    document.documentElement.style.setProperty(
        "--couleur-texte-app",
        couleur
    );

    document.documentElement.style.setProperty(
        "--police-texte-app",
        police
    );

    document.documentElement.style.setProperty(
        "--taille-texte-app",
        taille
    );

    const champCouleur = document.getElementById("couleurTexteApp");
    const champPolice = document.getElementById("policeTexteApp");
    const champTaille = document.getElementById("tailleTexteApp");

    if (champCouleur) champCouleur.value = couleur;
    if (champPolice) champPolice.value = police;
    if (champTaille) champTaille.value = taille;
}

function chargerReglagesTexte() {
    let reglages = {};

    try {
        reglages = JSON.parse(
            localStorage.getItem(CLE_REGLAGES_TEXTE) || "{}"
        );
    } catch (erreur) {
        reglages = {};
    }

    appliquerReglagesTexte(reglages);
}

const btnAppliquerTexte = document.getElementById("btnAppliquerTexte");

if (btnAppliquerTexte) {
    btnAppliquerTexte.addEventListener("click", function () {
        const champCouleur = document.getElementById("couleurTexteApp");
        const champPolice = document.getElementById("policeTexteApp");
        const champTaille = document.getElementById("tailleTexteApp");

        if (!champCouleur || !champPolice || !champTaille) {
            alert("Les réglages du texte sont introuvables dans la page.");
            return;
        }

        const reglages = {
            couleur: champCouleur.value,
            police: champPolice.value,
            taille: champTaille.value
        };

        appliquerReglagesTexte(reglages);

        localStorage.setItem(
            CLE_REGLAGES_TEXTE,
            JSON.stringify(reglages)
        );

        alert("Les réglages du texte ont été appliqués !");
    });
}

chargerReglagesTexte();
