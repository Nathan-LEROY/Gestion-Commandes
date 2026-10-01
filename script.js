"use strict";

/* =========================================================
   GESTIONNAIRE DE COMMANDES
   Version complète
========================================================= */

const STORAGE_KEY = "gestionCommandesV1";

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
        "sectionImpression"
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
const commandeId = document.getElementById("commandeId");

const numeroCommande = document.getElementById("numeroCommande");
const nomClient = document.getElementById("nomClient");
const dateCommande = document.getElementById("dateCommande");
const telephoneClient = document.getElementById("telephoneClient");
const whatsappClient = document.getElementById("whatsappClient");
const facebookClient = document.getElementById("facebookClient");
const lieuLivraison = document.getElementById("lieuLivraison");
const nomProduit = document.getElementById("nomProduit");
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

/* =========================================================
   DONNÉES
========================================================= */

let commandes = chargerCommandes();
let selectionImpression = new Set();

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
       NOMBRE DE STATUTS
    ----------------------------------------------------- */

    const statuts = new Set(
        commandes
            .map(c => c.statut)
            .filter(Boolean)
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
        document.getElementById("statStatuts"),
        String(statuts.size)
    );

    definirTexte(
        document.getElementById("statRestes"),
        formaterMontant(totalRestes)
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

    commandeId.value = commande.id;
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

function enregistrerCommande(evenement) {
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

    const id = commandeId?.value || genererId();

    const ancienne = commandes.find(c => c.id === id);

    const commande = {
    id,
    numeroCommande: obtenirValeur(numeroCommande).trim(),
    client: nomClient.value.trim(),
    telephone: obtenirValeur(telephoneClient).trim(),
    whatsapp: obtenirValeur(whatsappClient).trim(),
    facebook: obtenirValeur(facebookClient).trim(),
    lieu: obtenirValeur(lieuLivraison).trim(),
    produit: nomProduit.value.trim(),
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
