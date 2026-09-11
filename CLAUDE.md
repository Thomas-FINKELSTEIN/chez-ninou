# Chez Ninou — site des gîtes

Site vitrine pour la location de gîtes de **Chez Ninou**. Statique (HTML/CSS/JS
vanilla, zéro build, zéro dépendance), hébergé sur **GitHub Pages**. Même
approche que le projet La Géode.

## Structure
- `index.html` — page unique (hero, bienvenue, les gîtes, galerie, alentours,
  bon à savoir, contact + formulaire, lightbox).
- `styles.css` — toute la mise en forme (palette dans les variables `:root`,
  mobile sous 780px en bas de fichier).
- `script.js` — menu mobile, lightbox galerie, formulaire de réservation
  (génère un `mailto:` prérempli, aucun backend), apparition au défilement.
  L'adresse de réception est la constante `EMAIL_CONTACT` en haut du fichier.
- `images/` — photos du site : hero.jpg (jardin), studio.jpg, chambre.jpg,
  cuisine.jpg, salle-eau.jpg, terrasse.jpg.
- `.nojekyll` — sert le site tel quel sur GitHub Pages.
- `CNAME` — présent seulement si un nom de domaine est branché.

## À compléter (contenu réel)
Chercher les `[...]` et `mini-note` dans `index.html` :
- Commune exacte, téléphone (`tel:` + texte), e-mail (`mailto:` dans
  `index.html` **et** `EMAIL_CONTACT` dans `script.js`).
- Capacité, prix par nuit des trois gîtes (Le Studio, Le Gîte Bleu, Le Gîte Rose).
- Section « Bon à savoir » : horaires d'arrivée/départ, linge, animaux, accès,
  paiement.
- Vérifier les étiquettes d'équipement des cartes gîtes (`.equip`).

## Vérifier le rendu
Ouvrir `index.html` dans un navigateur suffit (pas de serveur nécessaire).
Tester : menu burger sur mobile, clic sur une photo (lightbox, flèches, Échap),
envoi du formulaire (ouvre la messagerie avec l'e-mail prérempli).

## Publier une modification
Tout changement poussé sur la branche `main` est mis en ligne automatiquement
par GitHub Pages en 1 à 2 minutes.

```
git add -A && git commit -m "..." && git push
```

## Idées pour plus tard
- Calendrier de disponibilités.
- Envoi du formulaire sans messagerie (Formspree ou équivalent).
- Nom de domaine personnalisé (ex. chezninou.fr) + HTTPS.
- Page par gîte avec plus de photos et d'infos.
- Compression des photos (hero.jpg fait 550 Ko).
