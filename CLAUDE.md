# Chez Ninou — site des gîtes

Site vitrine pour la location de gîtes de **Chez Ninou**. Statique (HTML/CSS,
zéro build), hébergé sur **GitHub Pages**. Même approche que le projet La Géode.

## Structure
- `index.html` — page unique (hero, bienvenue, les gîtes, galerie, alentours, contact).
- `styles.css` — toute la mise en forme (palette dans les variables `:root`).
- `images/` — photos du site (hero.jpg, gite-1.jpg, gite-2.jpg, galerie-1..6.jpg).
- `.nojekyll` — sert le site tel quel sur GitHub Pages.
- `CNAME` — présent seulement si un nom de domaine est branché.

## À compléter (contenu réel)
Chercher les `[... À COMPLÉTER]` et `mini-note` dans `index.html` :
- Région / commune, adresse, téléphone, e-mail.
- Nombre de gîtes, capacité, surface, chambres, prix par nuit.
- Textes des alentours (nature, villages, terroir).
- Photos réelles à déposer dans `images/` (mêmes noms de fichiers).

## Publier une modification
Tout changement poussé sur la branche `main` est mis en ligne automatiquement
par GitHub Pages en 1 à 2 minutes.

```
git add -A && git commit -m "..." && git push
```

## Idées pour plus tard
- Formulaire de contact / demande de réservation.
- Calendrier de disponibilités.
- Nom de domaine personnalisé (ex. chezninou.fr) + HTTPS.
- Page par gîte avec plus de photos et d'infos.
