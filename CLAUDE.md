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

## Contenu réel (déjà en place)
- Adresse : 14 avenue Virginie, 66480 Les Cluses. Tél. 06 74 45 37 66.
  E-mail : chezninou66@gmail.com (dans `index.html` **et** `EMAIL_CONTACT` dans `script.js`).
- Trois gîtes de 2 personnes max : Le Studio, Le Gîte Bleu, Le Gîte Rose.

## À compléter
Chercher les `[...]` et `mini-note` dans `index.html` :
- Prix par nuit (affiché « Tarif sur demande » en attendant).
- Section « Bon à savoir » : horaires d'arrivée/départ, linge, animaux, paiement.
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
