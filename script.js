```javascript
const STORAGE_KEY = "gestionCommandesV1";

let commandes = chargerCommandes();


// =========================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// =========================================================

const commandeForm = document.getElementById("commandeForm");

const commandeId = document.getElementById("commandeId");

const nomClient = document.getElementById("nomClient");

const nomProduit = document.getElementById("nomProduit");

const nombreProduit = document.getElementById("nombreProduit");

const prixProduit = document.getElementById("prixProduit");

const acompte = document.getElementById("acompte");

const statut = document.getElementById("statut");

const totalProduit = document.getElementById("totalProduit");

const resteCharge = document.getElementById("resteCharge");

const commandesBody = document.getElementById("commandesBody");

const recherche = document.getElementById("recherche");

const filtreStatut = document.getElementById("filtreStatut");

const aucuneCommande = document.getElementById("aucuneCommande");

const btnEnregistrer =
    document.getElementById("btnEnregistrer");

const btnAnnuler =
    document.getElementById("btnAnnuler");

const btnExporter =
    document.getElementById("btnExporter");

const fichierImport =
    document.getElementById("fichierImport");

const btnToutSupprimer =
    document.getElementById("btnToutSupprimer");


// =========================================================
// CHARGER LES COMMANDES
// =========================================================

function chargerCommandes() {

    try {

        const donnees =
            localStorage.getItem(STORAGE_KEY);

        if (!donnees) {

            return [];

        }

        const resultat =
            JSON.parse(donnees);

        return Array.isArray(resultat)
            ? resultat
            : [];

    }

    catch (erreur) {

        console.error(
            "Erreur de lecture :",
            erreur
        );

        return [];

    }

}


// =========================================================
// SAUVEGARDER LES COMMANDES
// =========================================================

function sauvegarderCommandes() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(commandes)
    );

}


// =========================================================
// FORMATAGE DES MONTANTS
// =========================================================

function formatMontant(nombre) {

    const valeur =
        Number(nombre) || 0;

    return (
        new Intl.NumberFormat("fr-FR")
            .format(valeur)
        + " Ar"
    );

}


// =========================================================
// CALCUL AUTOMATIQUE
// =========================================================

function calculerMontants() {

    const quantite =
        Math.max(
            0,
            Number(nombreProduit.value) || 0
        );


    const prix =
        Math.max(
            0,
            Number(prixProduit.value) || 0
        );


    const acompteSaisi =
        Math.max(
            0,
            Number(acompte.value) || 0
        );


    // Total = quantité × prix

    const total =
        quantite * prix;


    // Reste = total - acompte

    const reste =
        Math.max(
            0,
            total - acompteSaisi
        );


    totalProduit.textContent =
        formatMontant(total);


    resteCharge.textContent =
        formatMontant(reste);


    return {

        total: total,

        acompte: acompteSaisi,

        reste: reste

    };

}


// =========================================================
// STATISTIQUES
// =========================================================

function afficherStatistiques() {

    const clients =
        new Set(

            commandes

                .map(
                    c =>
                        String(
                            c.nomClient || ""
                        )
                        .trim()
                        .toLowerCase()
                )

                .filter(Boolean)

        );


    const totalAcomptes =
        commandes.reduce(

            (somme, c) =>
                somme +
                Number(c.acompte || 0),

            0

        );


    const totalRestes =
        commandes.reduce(

            (somme, c) =>
                somme +
                Number(c.reste || 0),

            0

        );


    document.getElementById(
        "statClients"
    ).textContent =
        clients.size;


    document.getElementById(
        "statCommandes"
    ).textContent =
        commandes.length;


    document.getElementById(
        "statAcomptes"
    ).textContent =
        formatMontant(totalAcomptes);


    document.getElementById(
        "statRestes"
    ).textContent =
        formatMontant(totalRestes);

}


// =========================================================
// COULEUR DU STATUT
// =========================================================

function statutClass(statutTexte) {

    const classes = {

        "En attente":
            "status-attente",

        "Acompte reçu":
            "status-acompte",

        "En préparation":
            "status-preparation",

        "Prêt":
            "status-pret",

        "Livré":
            "status-livre",

        "Payé":
            "status-paye"

    };


    return (
        classes[statutTexte]
        ||
        "status-attente"
    );

}


// =========================================================
// AFFICHER LES COMMANDES
// =========================================================

function afficherCommandes() {

    const rechercheTexte =
        recherche.value
            .trim()
            .toLowerCase();


    const filtre =
        filtreStatut.value;


    const resultats =
        commandes.filter(commande => {

            const texteRecherche = [

                commande.nomClient,

                commande.nomProduit

            ]
                .join(" ")
                .toLowerCase();


            const correspondRecherche =

                !rechercheTexte
                ||
                texteRecherche.includes(
                    rechercheTexte
                );


            const correspondStatut =

                !filtre
                ||
                commande.statut === filtre;


            return (
                correspondRecherche
                &&
                correspondStatut
            );

        });


    commandesBody.innerHTML = "";


    aucuneCommande.classList.toggle(
        "hidden",
        resultats.length !== 0
    );


    resultats.forEach(commande => {

        const ligne =
            document.createElement("tr");


        ligne.innerHTML = `

            <td>
                ${echapperHTML(
                    commande.nomClient
                )}
            </td>


            <td>
                ${echapperHTML(
                    commande.nomProduit
                )}
            </td>


            <td>
                ${commande.nombre}
            </td>


            <td>
                ${formatMontant(
                    commande.prix
                )}
            </td>


            <td>
                ${formatMontant(
                    commande.total
                )}
            </td>


            <td>
                ${formatMontant(
                    commande.acompte
                )}
            </td>


            <td>
                <strong>
                    ${formatMontant(
                        commande.reste
                    )}
                </strong>
            </td>


            <td>

                <span
                    class="status
                    ${statutClass(
                        commande.statut
                    )}"
                >

                    ${echapperHTML(
                        commande.statut
                    )}

                </span>

            </td>


            <td>

                <div class="actions">


                    <button
                        class="action-btn edit-btn"
                        data-action="modifier"
                        data-id="${commande.id}"
                    >
                        ✏️ Modifier
                    </button>


                    <button
                        class="action-btn delete-btn"
                        data-action="supprimer"
                        data-id="${commande.id}"
                    >
                        🗑️ Supprimer
                    </button>


                </div>

            </td>

        `;


        commandesBody.appendChild(
            ligne
        );

    });


    afficherStatistiques();

}


// =========================================================
// PROTECTION CONTRE LE HTML
// =========================================================

function echapperHTML(texte) {

    return String(texte ?? "")

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =========================================================
// RÉINITIALISER LE FORMULAIRE
// =========================================================

function reinitialiserFormulaire() {

    commandeForm.reset();


    commandeId.value = "";


    nombreProduit.value = 1;


    acompte.value = 0;


    statut.value =
        "En attente";


    document.getElementById(
        "formTitle"
    ).textContent =
        "➕ Nouvelle commande";


    btnEnregistrer.textContent =
        "💾 Enregistrer";


    btnAnnuler.classList.add(
        "hidden"
    );


    calculerMontants();

}


// =========================================================
// MODIFIER UNE COMMANDE
// =========================================================

function commencerModification(id) {

    const commande =
        commandes.find(

            c =>
                String(c.id)
                ===
                String(id)

        );


    if (!commande) {

        return;

    }


    commandeId.value =
        commande.id;


    nomClient.value =
        commande.nomClient;


    nomProduit.value =
        commande.nomProduit;


    nombreProduit.value =
        commande.nombre;


    prixProduit.value =
        commande.prix;


    acompte.value =
        commande.acompte;


    statut.value =
        commande.statut;


    document.getElementById(
        "formTitle"
    ).textContent =
        "✏️ Modifier la commande";


    btnEnregistrer.textContent =
        "💾 Enregistrer les modifications";


    btnAnnuler.classList.remove(
        "hidden"
    );


    calculerMontants();


    document
        .querySelector(".card")
        .scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

}


// =========================================================
// SUPPRIMER UNE COMMANDE
// =========================================================

function supprimerCommande(id) {

    const commande =
        commandes.find(

            c =>
                String(c.id)
                ===
                String(id)

        );


    if (!commande) {

        return;

    }


    const confirmation =
        confirm(

            `Supprimer la commande de "${commande.nomClient}" pour "${commande.nomProduit}" ?`

        );


    if (!confirmation) {

        return;

    }


    commandes =
        commandes.filter(

            c =>
                String(c.id)
                !==
                String(id)

        );


    sauvegarderCommandes();


    afficherCommandes();

}


// =========================================================
// ENREGISTRER / MODIFIER
// =========================================================

commandeForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const nomClientValue =
            nomClient.value.trim();


        const nomProduitValue =
            nomProduit.value.trim();


        const nombre =
            Number(
                nombreProduit.value
            );


        const prix =
            Number(
                prixProduit.value
            );


        const montants =
            calculerMontants();


        if (
            !nomClientValue
            ||
            !nomProduitValue
        ) {

            alert(
                "Veuillez renseigner le nom du client et le nom du produit."
            );

            return;

        }


        if (
            !Number.isFinite(nombre)
            ||
            nombre < 1
        ) {

            alert(
                "Le nombre de produits doit être au moins égal à 1."
            );

            return;

        }


        if (
            !Number.isFinite(prix)
            ||
            prix < 0
        ) {

            alert(
                "Le prix du produit est incorrect."
            );

            return;

        }


        if (
            montants.acompte
            >
            montants.total
        ) {

            const continuer =
                confirm(

                    "L'acompte est supérieur au total de la commande. Voulez-vous continuer ?"

                );


            if (!continuer) {

                return;

            }

        }


        const idExistant =
            commandeId.value;


        // =====================================================
        // MODIFICATION
        // =====================================================

        if (idExistant) {

            const index =
                commandes.findIndex(

                    c =>
                        String(c.id)
                        ===
                        String(idExistant)

                );


            if (index !== -1) {

                commandes[index] = {

                    ...commandes[index],

                    nomClient:
                        nomClientValue,

                    nomProduit:
                        nomProduitValue,

                    nombre:
                        nombre,

                    prix:
                        prix,

                    total:
                        montants.total,

                    acompte:
                        montants.acompte,

                    reste:
                        montants.reste,

                    statut:
                        statut.value,

                    dateModification:
                        new Date()
                            .toISOString()

                };

            }

        }


        // =====================================================
        // NOUVELLE COMMANDE
        // =====================================================

        else {

            commandes.unshift({

                id:
                    Date.now()
                    .toString(),

                nomClient:
                    nomClientValue,

                nomProduit:
                    nomProduitValue,

                nombre:
                    nombre,

                prix:
                    prix,

                total:
                    montants.total,

                acompte:
                    montants.acompte,

                reste:
                    montants.reste,

                statut:
                    statut.value,

                dateCreation:
                    new Date()
                        .toISOString()

            });

        }


        sauvegarderCommandes();


        afficherCommandes();


        reinitialiserFormulaire();

    }
);


// =========================================================
// RECALCUL AUTOMATIQUE
// =========================================================

[
    nombreProduit,
    prixProduit,
    acompte

].forEach(champ => {

    champ.addEventListener(
        "input",
        calculerMontants
    );

});


// =========================================================
// RECHERCHE
// =========================================================

recherche.addEventListener(
    "input",
    afficherCommandes
);


// =========================================================
// FILTRE STATUT
// =========================================================

filtreStatut.addEventListener(
    "change",
    afficherCommandes
);


// =========================================================
// ANNULER MODIFICATION
// =========================================================

btnAnnuler.addEventListener(
    "click",
    reinitialiserFormulaire
);


// =========================================================
// ACTIONS DU TABLEAU
// =========================================================

commandesBody.addEventListener(
    "click",
    event => {

        const bouton =
            event.target.closest(
                "button[data-action]"
            );


        if (!bouton) {

            return;

        }


        const action =
            bouton.dataset.action;


        const id =
            bouton.dataset.id;


        if (
            action
            ===
            "modifier"
        ) {

            commencerModification(id);

        }


        if (
            action
            ===
            "supprimer"
        ) {

            supprimerCommande(id);

        }

    }
);


// =========================================================
// EXPORTER LES DONNÉES
// =========================================================

btnExporter.addEventListener(
    "click",
    () => {

        if (
            commandes.length
            ===
            0
        ) {

            alert(
                "Il n'y a aucune donnée à exporter."
            );

            return;

        }


        const contenu =
            JSON.stringify(
                commandes,
                null,
                2
            );


        const blob =
            new Blob(

                [
                    contenu
                ],

                {
                    type:
                        "application/json;charset=utf-8"
                }

            );


        const url =
            URL.createObjectURL(
                blob
            );


        const lien =
            document.createElement(
                "a"
            );


        lien.href =
            url;


        lien.download =
            `commandes-${new Date()
                .toISOString()
                .slice(0, 10)
            }.json`;


        document.body.appendChild(
            lien
        );


        lien.click();


        lien.remove();


        URL.revokeObjectURL(
            url
        );

    }
);


// =========================================================
// IMPORTER LES DONNÉES
// =========================================================

fichierImport.addEventListener(
    "change",
    event => {

        const fichier =
            event.target.files[0];


        if (!fichier) {

            return;

        }


        const lecteur =
            new FileReader();


        lecteur.onload =
            () => {

                try {

                    const donnees =
                        JSON.parse(
                            lecteur.result
                        );


                    if (
                        !Array.isArray(
                            donnees
                        )
                    ) {

                        throw new Error(
                            "Format incorrect"
                        );

                    }


                    const donneesValides =
                        donnees.filter(

                            c =>

                                c
                                &&
                                typeof c.nomClient
                                ===
                                "string"
                                &&
                                typeof c.nomProduit
                                ===
                                "string"
                                &&
                                Number.isFinite(
                                    Number(c.nombre)
                                )
                                &&
                                Number.isFinite(
                                    Number(c.prix)
                                )

                        );


                    if (
                        donneesValides.length
                        !==
                        donnees.length
                    ) {

                        const continuer =
                            confirm(

                                "Certaines lignes du fichier semblent incorrectes. Seules les lignes valides seront importées. Continuer ?"

                            );


                        if (!continuer) {

                            fichierImport.value =
                                "";

                            return;

                        }

                    }


                    if (
                        donneesValides.length
                        ===
                        0
                    ) {

                        alert(
                            "Aucune commande valide trouvée dans le fichier."
                        );

                        fichierImport.value =
                            "";

                        return;

                    }


                    const remplacer =
                        confirm(

                            "OK = remplacer les données actuelles.\n\nAnnuler = ajouter les données importées aux données actuelles."

                        );


                    if (remplacer) {

                        commandes =
                            normaliserCommandes(
                                donneesValides
                            );

                    }

                    else {

                        commandes =
                            commandes.concat(

                                normaliserCommandes(
                                    donneesValides
                                )

                            );

                    }


                    sauvegarderCommandes();


                    afficherCommandes();


                    alert(
                        `${donneesValides.length} commande(s) importée(s).`
                    );

                }

                catch (erreur) {

                    console.error(
                        erreur
                    );


                    alert(

                        "Impossible d'importer ce fichier. Vérifiez qu'il s'agit d'un fichier JSON créé par l'application."

                    );

                }


                fichierImport.value =
                    "";

            };


        lecteur.readAsText(
            fichier
        );

    }
);


// =========================================================
// NORMALISATION DES COMMANDES IMPORTÉES
// =========================================================

function normaliserCommandes(liste) {

    return liste.map(c => {

        const nombre =
            Math.max(
                1,
                Number(c.nombre)
                ||
                1
            );


        const prix =
            Math.max(
                0,
                Number(c.prix)
                ||
                0
            );


        const total =
            nombre * prix;


        const acompteValue =
            Math.max(
                0,
                Number(c.acompte)
                ||
                0
            );


        return {

            id:
                String(
                    c.id
                    ||
                    `${Date.now()}-${Math.random()
                        .toString(16)
                        .slice(2)
                    }`
                ),

            nomClient:
                String(
                    c.nomClient
                    ||
                    ""
                ).trim(),

            nomProduit:
                String(
                    c.nomProduit
                    ||
                    ""
                ).trim(),

            nombre:
                nombre,

            prix:
                prix,

            total:
                total,

            acompte:
                acompteValue,

            reste:
                Math.max(
                    0,
                    total -
                    acompteValue
                ),

            statut:
                String(
                    c.statut
                    ||
                    "En attente"
                ),

            dateCreation:
                c.dateCreation
                ||
                new Date()
                    .toISOString()

        };

    });

}


// =========================================================
// SUPPRIMER TOUTES LES COMMANDES
// =========================================================

btnToutSupprimer.addEventListener(
    "click",
    () => {

        if (
            commandes.length
            ===
            0
        ) {

            alert(
                "Il n'y a aucune commande à supprimer."
            );

            return;

        }


        const confirmation =
            confirm(

                "ATTENTION : cette action va supprimer toutes les commandes enregistrées sur cet appareil.\n\nContinuer ?"

            );


        if (!confirmation) {

            return;

        }


        commandes = [];


        sauvegarderCommandes();


        afficherCommandes();


        reinitialiserFormulaire();

    }
);


// =========================================================
// SERVICE WORKER
// =========================================================

if (
    "serviceWorker"
    in
    navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )

                .catch(
                    erreur =>
                        console.log(
                            "Service Worker non disponible :",
                            erreur
                        )
                );

        }
    );

}


// =========================================================
// DÉMARRAGE
// =========================================================

reinitialiserFormulaire();

afficherCommandes();
```
