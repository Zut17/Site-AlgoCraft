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

  // ── Formulaire de contact → WhatsApp ────────────────────
  const form = $("#formContact"), statut = $("#statutContact"), bouton = $("#btnEnvoyer");
  const numeroWhatsApp = String(config.WHATSAPP_NUMERO || "").replace(/\D/g, "").replace(/^00/, "");
  function afficherStatut(texte, genre) { statut.textContent = texte; statut.className = "statut " + (genre || ""); }
  if (numeroWhatsApp) bouton.textContent = "Envoyer";

  form.addEventListener("submit", e => {
    e.preventDefault();
    const donnees = Object.fromEntries(new FormData(form));
    if (donnees._gotcha) return;   // robot
    let valide = true;
    for (const champ of ["nom", "email", "message"]) {
      const el = form.elements[champ];
      const v = el.value.trim();
      // E-mail facultatif : vérifié seulement s'il est saisi
      const ok = champ === "email" ? (v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) : v.length > 1;
      el.classList.toggle("invalide", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      valide = valide && ok;
    }
    if (!valide) { afficherStatut("Merci de vérifier les champs signalés.", "erreur"); return; }

    const nom = donnees.nom.trim(), email = (donnees.email || "").trim();

    if (numeroWhatsApp) {
      const texte =
        `*AlgoCraft — ${donnees.sujet}*\n` +
        `De : ${nom}` + (email ? ` (${email})` : "") + `\n\n` +
        donnees.message.trim();
      const lien = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texte)}`;
      // Ouvert pendant le clic (sinon bloqué) ; sur mobile, l'application WhatsApp prend le relais
      const fenetre = window.open(lien, "_blank", "noopener");
      if (!fenetre) window.location.href = lien;
      afficherStatut("WhatsApp s'ouvre avec votre message déjà rédigé : il ne reste qu'à appuyer sur Envoyer.", "ok");
      form.reset();
      return;
    }

    const sujet = `[AlgoCraft] ${donnees.sujet} — ${nom}`;
    if (config.CONTACT_EMAIL) {
      const corps = `${donnees.message}\n\n— ${nom}` + (email ? ` (${email})` : "");
      window.location.href = `mailto:${config.CONTACT_EMAIL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
      afficherStatut("Votre messagerie s'ouvre avec le message prêt à envoyer (" + config.CONTACT_EMAIL + ").", "ok");
    } else {
      afficherStatut("Le formulaire n'est pas encore relié : renseignez WHATSAPP_NUMERO dans js/config.js.", "erreur");
    }
  });

  $("#annee").textContent = new Date().getFullYear();
})();
