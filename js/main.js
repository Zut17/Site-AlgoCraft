// AlgoCraft — site de présentation
(function () {
  "use strict";
  const config = window.ALGOCRAFT_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const echapper = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // ── Menu sur petit écran ────────────────────────────────
  const menu = $("#menu"), boutonMenu = $("#boutonMenu");
  boutonMenu.addEventListener("click", () => {
    const ouvert = menu.classList.toggle("ouvert");
    boutonMenu.setAttribute("aria-expanded", String(ouvert));
  });
  $$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("ouvert"); boutonMenu.setAttribute("aria-expanded", "false"); }));

  // ── Coloration (sobre : mots-clés, chaînes, commentaires) ─
  const MOTS_ALGO = new Set(("algorithme algorithm variables variable constantes constants debut début begin fin end si if alors then sinon else sinonsi elseif finsi endif " +
    "pour for allant de from à a to pas step faire do finpour endfor tantque while fintantque endwhile repeter répéter repeat jusqu jusqua jusquà until " +
    "fonction function finfonction endfunction procedure procédure finprocedure endprocedure retourne retourner return debutfonction " +
    "ecrire écrire afficher print lire read structure finstructure et ou non and or not div mod var vrai faux true false tableau array of").split(" "));
  const TYPES = new Set("entier reel réel chaine chaîne booleen booléen caractere integer real string boolean char int float double void bool long".split(" "));
  const MOTS_CODE = new Set(("def return if elif else for while in range print input import from class public private static new int float double " +
    "void bool boolean string String char long return break continue do switch case try catch finally throws using namespace include " +
    "const let var function true false True False None null new this and or not").split(" "));

  function colorer(code, algo) {
    const motif = /(\/\/.*$|#.*$|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-zÀ-ÿ_][\wÀ-ÿ']*)(\s*\()?|([\s\S])/gm;
    let html = "", m;
    while ((m = motif.exec(code)) !== null) {
      if (m[1] !== undefined) {
        if (m[1].startsWith("#") && algo) { html += echapper(m[1]); continue; }
        html += `<span class="c">${echapper(m[1])}</span>`;
      } else if (m[2] !== undefined) html += `<span class="s">${echapper(m[2])}</span>`;
      else if (m[3] !== undefined) html += m[3];
      else if (m[4] !== undefined) {
        const mot = m[4], bas = mot.toLowerCase().replace(/'/g, "");
        let cls = null;
        if (algo ? MOTS_ALGO.has(bas) : MOTS_CODE.has(mot)) cls = "k";
        else if (TYPES.has(algo ? bas : mot)) cls = "t";
        html += cls ? `<span class="${cls}">${echapper(mot)}</span>` : echapper(mot);
        if (m[5]) html += echapper(m[5]);
      } else html += echapper(m[6]);
    }
    return html;
  }

  // Listing numéroté : une ligne = un <span class="l">
  function listing(code, algo, max) {
    let lignes = code.replace(/\s+$/, "").split("\n");
    if (max) lignes = lignes.slice(0, max);
    return lignes.map(l => `<span class="l">${colorer(l, algo) || " "}</span>`).join("");
  }

  const exemples = window.EXEMPLES || [];

  // ── Accueil : le premier exemple (Moyenne), tel qu'AlgoCraft l'exécute ─
  if (exemples.length) {
    const ex = exemples[0];
    $("#codeAccueil").innerHTML = listing(ex.code, true, 16);
    $("#sortieAccueil").innerHTML =
      (ex.entrees ? `<span class="c">Saisies : ${echapper(ex.entrees)}</span>\n` : "") + echapper(ex.sortie.trimEnd());
  }

  // ── Exemples ────────────────────────────────────────────
  let courant = 0, vue = "sortie", langue = "fr";
  const liste = $("#exListe");
  exemples.forEach((ex, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = ex.titre;
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => { courant = i; afficherExemple(); });
    liste.appendChild(b);
  });

  function afficherExemple() {
    const ex = exemples[courant];
    if (!ex) return;
    $$("#exListe button").forEach((b, i) => b.setAttribute("aria-selected", String(i === courant)));
    const code = langue === "en" ? ex.anglais : ex.code;
    $("#exCode").innerHTML = listing(code, true);
    const nom = (code.match(/^\s*(Algorithme|Algorithm)\s+(\S+)/m) || [])[2] || ex.titre;
    $("#exNom").textContent = nom + ".agc";
    $("#exEntrees").textContent = ex.entrees ? "Saisies utilisées : " + ex.entrees : "Aucune saisie";
    $$(".ex-onglets button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.vue === vue)));
    const zone = $("#exVue");
    if (vue === "sortie") {
      zone.innerHTML = `<pre class="console-sortie">${echapper(ex.sortie.trimEnd())}</pre>`;
    } else if (vue === "algo") {
      zone.innerHTML = `<div class="algo">${ex.svg}</div>`;
    } else {
      zone.innerHTML = `<pre class="listing">${listing(ex[vue], false)}</pre>`;
    }
  }
  $$(".ex-onglets button").forEach(b => b.addEventListener("click", () => { vue = b.dataset.vue; afficherExemple(); }));
  $$(".bascule button").forEach(b => b.addEventListener("click", () => {
    langue = b.dataset.langue;
    $$(".bascule button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    afficherExemple();
  }));
  const boutonCopier = $("#exCopier");
  boutonCopier.addEventListener("click", async () => {
    const ex = exemples[courant];
    if (!ex) return;
    const texte = vue === "python" || vue === "java" ? ex[vue] : (langue === "en" ? ex.anglais : ex.code);
    try { await navigator.clipboard.writeText(texte); boutonCopier.textContent = "Copié"; }
    catch (e) { boutonCopier.textContent = "Copie impossible"; }
    setTimeout(() => (boutonCopier.textContent = "Copier le code"), 1800);
  });
  afficherExemple();

  // ── Téléchargement ──────────────────────────────────────
  if (config.LIEN_TELECHARGEMENT) $("#lienTelechargement").href = config.LIEN_TELECHARGEMENT;

  // ── Formulaire de contact ───────────────────────────────
  const form = $("#formContact"), statut = $("#statutContact");
  function afficherStatut(texte, genre) { statut.textContent = texte; statut.className = "statut " + (genre || ""); }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const donnees = Object.fromEntries(new FormData(form));
    if (donnees._gotcha) return;   // robot
    let valide = true;
    for (const champ of ["nom", "email", "message"]) {
      const el = form.elements[champ];
      const ok = champ === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) : el.value.trim().length > 1;
      el.classList.toggle("invalide", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      valide = valide && ok;
    }
    if (!valide) { afficherStatut("Merci de vérifier les champs signalés.", "erreur"); return; }

    const sujet = `[AlgoCraft] ${donnees.sujet} — ${donnees.nom}`;
    // Une adresse e-mail seule dans FORMULAIRE_ENDPOINT est acceptée : elle passe par FormSubmit
    let adresseEnvoi = (config.FORMULAIRE_ENDPOINT || "").trim();
    if (adresseEnvoi && !adresseEnvoi.includes("://") && adresseEnvoi.includes("@"))
      adresseEnvoi = "https://formsubmit.co/ajax/" + adresseEnvoi;
    if (adresseEnvoi) {
      const bouton = $("#btnEnvoyer");
      bouton.disabled = true; bouton.textContent = "Envoi…";
      try {
        const r = await fetch(adresseEnvoi, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ nom: donnees.nom, email: donnees.email, sujet: donnees.sujet, message: donnees.message, _subject: sujet, _replyto: donnees.email })
        });
        const reponse = await r.json().catch(() => ({}));
        if (!r.ok || reponse.success === false || reponse.success === "false") throw new Error(reponse.message || "HTTP " + r.status);
        form.reset();
        afficherStatut("Votre message a bien été envoyé.", "ok");
      } catch (err) {
        if (/activat/i.test(err && err.message || "")) {
          afficherStatut("Le formulaire attend son activation : un e-mail de FormSubmit a été envoyé à l'adresse de réception, cliquez sur son lien puis réessayez.", "erreur");
          return;
        }
        afficherStatut("L'envoi a échoué. Réessayez plus tard" + (config.CONTACT_EMAIL ? " ou écrivez à " + config.CONTACT_EMAIL : "") + ".", "erreur");
      } finally {
        bouton.disabled = false; bouton.textContent = "Envoyer le message";
      }
    } else if (config.CONTACT_EMAIL) {
      const corps = `${donnees.message}\n\n— ${donnees.nom} (${donnees.email})`;
      window.location.href = `mailto:${config.CONTACT_EMAIL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
      afficherStatut("Votre messagerie s'ouvre avec le message prêt à envoyer (" + config.CONTACT_EMAIL + ").", "ok");
    } else {
      afficherStatut("Le formulaire n'est pas encore relié à une adresse de réception (voir js/config.js).", "erreur");
    }
  });

  $("#annee").textContent = new Date().getFullYear();
})();
