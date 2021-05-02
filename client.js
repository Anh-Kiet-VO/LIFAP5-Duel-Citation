/* ******************************************************************
 * Constantes de configuration
 */
const serverUrl = "https://lifap5.univ-lyon1.fr";

let gauche = {};
let droite = {};

let apiKey = "";

/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"
 ******************************************************************** */


/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */

function majTab(etatCourant) {
  console.log("CALL majTab");
  const dDuel = document.getElementById("div-duel");
  const dTout = document.getElementById("div-tout");
  const dQuote = document.getElementById("div-quote");
  const tDuel = document.getElementById("tab-duel");
  const tTout = document.getElementById("tab-tout");
  const tQuote = document.getElementById("tab-quote");
  if (etatCourant.tab === "duel") {
    dDuel.style.display = "flex";
    tDuel.classList.add("is-active");
    dTout.style.display = "none";
    tTout.classList.remove("is-active");
    dQuote.style.display = "none";
    tQuote.classList.remove("is-active");
  } else if (etatCourant.tab === "tout") {
    dTout.style.display = "flex";
    tTout.classList.add("is-active");
    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");
    dQuote.style.display = "none";
    tQuote.classList.remove("is-active");
  } else {
    dQuote.style.display = "flex";
    tQuote.classList.add("is-active");
    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");
    dTout.style.display = "none";
    tTout.classList.remove("is-active");
  }
}

/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
*/
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 * @param {Etat} etatCourant l'état courant
*/
function registerTabClick(etatCourant) {
  console.log("CALL registerTabClick");
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
  document.getElementById("tab-quote").onclick = () =>
    clickTab("quote", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
*/
function fetchWhoami(apiKey) {
  return fetch(serverUrl + "/whoami", { headers: { "x-api-key": apiKey } })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * @returns Une promesse de mise à jour
*/
function lanceWhoamiEtInsereLogin() {
  apiKey = document.getElementById("apiKey").value;
  return fetchWhoami(apiKey).then((data) => {
    const elt = document.getElementById("elt-affichage-login");
    const foo = document.getElementById("btn-close-login-modal2");
    const ok = data.err === undefined;
    if (!ok) {
      document.getElementById("err").innerHTML = "Clé incorrect";
      apiKey = "";
    } else {
      elt.innerHTML = `<label class="label">Bonjour ${data.login} :-)</label>`
      foo.innerHTML = `<a class="button is-danger" onclick="deconnection();">
      Se déconnecter </a>`
      const elem = document.getElementById('btn-connect');
      elem.parentNode.removeChild(elem);
    }
    return ok;
  });
}

/**
 * Permet de se déconnecter une fois que l'utilisateur s'est connecté
*/
function deconnection() {
  document.getElementById("elt-affichage-login").innerHTML =
  `<p id="elt-affichage-login">
  <label class="label">Clé API</label>        
  <input id="apiKey" type="password" placeholder="Rentrez clé API" class="input"><br>
  <span id="err" class="help is-danger"></span>
  </p>`
  document.getElementById("footer").innerHTML =
  `<div id="btn-close-login-modal2"></div>
  <button id="btn-connect" class="button is-success" onclick="lanceWhoamiEtInsereLogin()">
  Se connecter</button>`
}

/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 * @param {Etat} etatCourant l'état courant
*/
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
  } else {
    modalClasses.remove("is-active");
  }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
*/
function clickFermeModalLogin(etatCourant) {
  etatCourant.loginModal = false;
  
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
*/
function clickOuvreModalLogin(etatCourant) {
  etatCourant.loginModal = true;
  majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
 * @param {Etat} etatCourant
*/
function registerLoginModalClick(etatCourant) {
  document.getElementById("btn-close-login-modal1").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-close-login-modal2").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-open-login-modal").onclick = () =>
    clickOuvreModalLogin(etatCourant);
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */



/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
*/
function majPage(etatCourant) {
  console.log("CALL majPage");
  majTab(etatCourant);
  majModalLogin(etatCourant);
  registerTabClick(etatCourant);
  registerLoginModalClick(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
*/
function initClientCitations() {
  console.log("CALL initClientCitations");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
  };
  majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});


/**
 * Fait une requête GET authentifiée sur /citations
 * @returns une promesse des citations ou du message d'erreur
*/
function fetchCitation() {
  return fetch("https://lifap5.univ-lyon1.fr" + "/citations", { headers: { "x-api-key": apiKey } })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Affiche toutes les citations sous forme de tableau
 * @param {Object} response reponse
*/
function affCitation(response) {
  const tableau = document.getElementById("tableBody");
  const tab = Array.from(response);

  tab.map((element,index) => {
  const line = document.createElement("tr"); // crée une autre ligne
  const header = document.createElement("th"); // crée l'en-tête
  const headertext = document.createTextNode(index); // crée le numéro
  header.appendChild(headertext);
  
  const character = element.character;
  const cell = document.createElement("td");
  const cellText = document.createTextNode(character);
  cell.appendChild(cellText);
  
  const quote = element.quote;
  const cell2 = document.createElement("td");
  const cellText2 = document.createTextNode(quote);
  cell2.appendChild(cellText2);
  
  line.appendChild(header);
  line.appendChild(cell);
  line.appendChild(cell2);
  tableau.appendChild(line);
  })
}

/**
 * Retourne un nombre aléatoire jusqu'à "max"
 * @param {Number} max entier
 * @returns un nombre aléatoire
*/
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomInt2(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Remplace les citations
 * @param {Number} position position de la citation (à gauche ou droite)
 * @param {String} citation numéro de la citation
*/
function remplacerCarte(position, citation) {
  const cardPath = `#div-duel > div:nth-child(${position}) > div > div.columns.card-content`;
  const image = document.querySelector(cardPath + " > div.column.is-one-third > div > figure > img");
  image.src = citation.image;

  if( (position === 1 && citation.characterDirection === "Right") || (position === 2 && citation.characterDirection === "Left") ) {
    image.style.transform = "scaleX(-1)";
  }
  else {
    image.style.transform = "scaleX(1)";
  }

  const quote = document.querySelector(cardPath + " > div.column.is-8 > p.title");
  quote.innerText = '"' +citation.quote+'"';

  const characterOrigin = document.querySelector(cardPath + " > div.column.is-8 > p.subtitle");
  characterOrigin.innerText = citation.character + " dans " + citation.origin;
}

/**
 * Appelle remplacerCarte avec des citations aléatoires
*/
function carteAleatoire() {
  gauche = citations[getRandomInt(citations.length)]
  remplacerCarte(1, gauche);

  droite = citations[getRandomInt2(citations.length)]
  remplacerCarte(2, droite);
}

// On fait une requête au serveur pour récuperer les données de /Citations puis on utilise la reponse
// afin d'afficher toutes les citations et de changer les citations aléatoirement
fetchCitation().then((response) => 
{
  citations = response;

  // Affichage citations, on récupère tr / th de index.html et les données de notre fetch
  affCitation(citations);

  // Permet de remplacer les cartes de citations
  carteAleatoire();
})


/**
 * Fait une requête GET authentifiée sur /citations
 * @param {String} winner le gagnant du duel de vote
 * @param {String} looser le perdant du duel de vote
 * @returns une promesse des citations ou du message d'erreur
*/
function fetchDuelVote(winner, looser) {
  return fetch(serverUrl + "/citations/duels", {
    method: 'POST',
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({"winner": winner, "looser": looser})
  });
}

/**
 * Permet de voter pour une citation et de designer le vainqueur
 * @param {Number} position position de la citation (1: gauche, 2: droite)
 * @returns return s'il n'y a pas d'apiKey
*/
function vote(position) {
  if(!apiKey) {
    alert("Veuillez-vous connecter");
    return;
  }

  let winner = "";
  let looser = "";

  if(position == 1) {
    winner = gauche._id;
    looser = droite._id;
  } else {
    looser = gauche._id;
    winner = droite._id;
  }

  fetchDuelVote(winner, looser).then(() => {
    carteAleatoire();
  });
}

/**
 * Fait une requête POST authentifiée sur /citations
 * @param {String} quote citation
 * @param {String} character personnage de la citation
 * @param {String} image image de la citation
 * @param {String} characterDirection direction de la citation
 * @param {String} origin origine de la citation
 * @returns une promesse de quote, character, image, characterDirection, origin
*/
function fetchAddQuote(quote, character, image, characterDirection, origin) {
  return fetch(serverUrl + "/citations", {
    method: 'POST',
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({"quote": quote, "character": character, "image":
    image, "characterDirection": characterDirection, "origin": origin})
  });
}

/**
 * Permet d'ajouter une nouvelle citation
 * @returns return s'il n'y a pas d'apiKey
*/
function newQuote() {
  if(!apiKey) {
    alert("Veuillez-vous connecter");
    return;
  }

  const quote = document.getElementById("quote").value;
  const character = document.getElementById("character").value;
  const image = document.getElementById("image").value;
  const characterDirection = document.getElementById("direction").value;
  const origin = document.getElementById("origine").value;

  if (quote != "" && character != "" && image != "" && characterDirection != "" && origin != "") {
    fetchAddQuote(quote, character, image, characterDirection, origin);
    document.getElementById("quoteOK").innerHTML = "<span style='color: #00cc33;'>Citation ajouté !</span>";
  } else {
    quoteError(quote, character, image, characterDirection, origin);
  }
}

/**
 * Renvoie un message si un des placeholer n'a pas été rempli
 * @param {String} quote citation
 * @param {String} character personnage de la citation
 * @param {String} image image de la citation
 * @param {String} characterDirection direction de la citation
 * @param {String} origin origine de la citation
*/
function quoteError(quote, character, image, characterDirection, origin) {
  if(quote == "") document.getElementById("errCitation").innerHTML= "Renseignez une citation !"
  if(character == "") document.getElementById("errCharacter").innerHTML = "Renseignez un personnage !";
  if(image == "") document.getElementById("errImage").innerHTML = "Renseignez une image !";
  if(characterDirection == "") document.getElementById("errDirection").innerHTML = "Renseignez une direction !";
  if(origin == "") document.getElementById("errOrigin").innerHTML = "Renseignez l'origine !";
}