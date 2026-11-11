# Site web d'AlgoCraft

Site statique de présentation (HTML, CSS, JavaScript sans dépendance), prêt pour Vercel.

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil : fonctionnalités, étapes, exemples, téléchargement, équipe, questions fréquentes, contact |
| `manuel.html` | Manuel d'utilisation complet (le même que celui livré avec l'application, touche F1) |
| `css/style.css` | Styles. La direction artistique (typographies, couleurs, grille) est décrite en tête du fichier |
| `js/config.js` | **Réglages à compléter** : adresse du formulaire de contact, e-mail, lien de téléchargement |
| `js/exemples.js` | Exemples générés par l'application (code, sortie, Python, Java, algorigramme SVG) |
| `js/main.js` | Comportements : menu sur petit écran, exemples, formulaire |
| `telechargements/` | Emplacement de `AlgoCraft-2.19-win-x64.zip` (créé par `publier-application.ps1`) |
| `vercel.json` | Réglages Vercel (URL propres, téléchargement forcé des archives) |

## Mise en ligne

1. Fabriquer l'archive : `.\publier-application.ps1` à la racine de la solution.
2. Compléter `js/config.js` :
   - `FORMULAIRE_ENDPOINT` : adresse d'un service de formulaires (Formspree, FormSubmit…) ;
   - ou `CONTACT_EMAIL` : le formulaire ouvre alors la messagerie du visiteur.
3. Déployer le dossier `site-web` sur Vercel (projet existant `algo-craft-ten` : « Root Directory » = `site-web`), ou `vercel --prod` depuis ce dossier.

L'application ouvre ce site depuis **Aide › Site web d'AlgoCraft**, le bouton **En savoir plus** de la fenêtre À propos, et **Aide › Télécharger / Nous contacter**. L'adresse est définie à un seul endroit : `Metier/Liens.cs` (`Liens.SiteWeb`).
