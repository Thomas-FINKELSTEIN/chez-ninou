# Chez Ninou — site des gîtes

Site vitrine pour la location de gîtes de **Chez Ninou** (Les Cluses, 66).
Statique (HTML/CSS/JS vanilla, zéro build, zéro dépendance), hébergé sur
**GitHub Pages** : https://thomas-finkelstein.github.io/chez-ninou/

## Parti pris
La **visite virtuelle 360°** est la pièce maîtresse : elle occupe tout l'écran
dès l'arrivée (hero), se lance toute seule, et chaque gîte s'ouvre en 360° en
plein écran. Le reste du site est éditorial : grandes photos, typographie serif
(Cormorant Garamond) + Jost, palette crème / terracotta / olive / encre.

## Structure
- `index.html` — page unique, dans l'ordre : en-tête fixe + menu mobile plein
  écran, hero (visite 360° en iframe + voile de texte), chiffres clés,
  bienvenue (texte + collage photos), les trois gîtes (lignes alternées),
  visite 360° (5 vignettes → fenêtre plein écran), galerie (grille éditoriale),
  alentours (bande photo + 3 cartes avec distances), bon à savoir, contact +
  formulaire, pied de page, fenêtre de visite (`#modal-visite`), lightbox.
- `styles.css` — toute la mise en forme. Variables dans `:root`. Points de
  rupture : 1024px (tablette) et 780px (mobile) en bas de fichier.
- `script.js` — en-tête (transparent → opaque), menu mobile, hero (chargement
  de la visite, mode immersif, changement de scène, plein écran), fenêtre de
  visite, lightbox, formulaire (`mailto:` prérempli), apparition au défilement.
  Constantes en haut : `EMAIL_CONTACT`, `VISITE_URL`, `NOMS_SCENES`.
- `images/` — hero.jpg (jardin), studio.jpg, chambre.jpg (Studio côté jardin),
  gite-bleu.jpg, gite-rose.jpg, piscine.jpg, cuisine.jpg, salle-eau.jpg,
  terrasse.jpg, visite-poster.jpg (vue aérienne, affichée pendant le chargement
  de la visite).
- `.nojekyll` — sert le site tel quel sur GitHub Pages.
- `CNAME` — présent seulement si un nom de domaine est branché.

## Visite virtuelle 360°
Visite 3DVista (32 panoramas) hébergée par un ami sur
https://geasy.fr/chez-ninou/ (pas d'en-tête anti-iframe, intégration OK).
La rapatrier ici n'est pas raisonnable : 641 Mo et 21 934 fichiers.

- **Hero** : l'iframe se charge dès l'ouverture de la page (sauf mode économie
  de données → au clic). Un voile (texte + dégradé + léger flou) recouvre la
  visite et laisse défiler la page. « Explorer la visite » = mode immersif :
  voile et en-tête disparaissent, la visite devient interactive, une barre en
  bas permet de changer de scène, passer en plein écran ou quitter (Échap,
  clic sur un lien du menu, ou sortie du hero de l'écran quittent aussi).
- **Fenêtre plein écran** (`#modal-visite`) : ouverte par les boutons
  `data-visite="<scène>"` (gîtes, vignettes). Ferme avec Échap ou ✕ ; l'iframe
  est vidée (`about:blank`) à la fermeture.
- **Scènes** (paramètre `?media-name=`) : `entree` = vue d'ensemble (défaut),
  `chambre_rdc_1` = Studio, `blanc_1` = Gîte Bleu, `rouge_1` = Gîte Rose,
  `piscine`, `parking`, `veranda`. Les autres noms de panoramas :
  chambre_rdc_*, blanc_*, rouge_*, bas escalier, couloir haut.
- Les photos gite-bleu.jpg, gite-rose.jpg, piscine.jpg et visite-poster.jpg
  proviennent de cette visite (droits payés par Chez Ninou).
- À signaler à l'auteur de la visite : l'icône « carte » du lecteur affiche un
  plan Google Maps de New York (valeur par défaut de 3DVista non remplacée).

## Contenu réel (déjà en place)
- Adresse : 14 avenue Virginie, 66480 Les Cluses. Tél. 06 74 45 37 66.
  E-mail : chezninou66@gmail.com (dans `index.html` **et** `EMAIL_CONTACT`).
- Trois gîtes de 2 personnes max : Le Studio, Le Gîte Bleu, Le Gîte Rose.

## À compléter
Chercher les `[...]` et `mini-note` dans `index.html` :
- Prix par nuit (affiché « Tarif sur demande » en attendant).
- Section « Bon à savoir » : horaires d'arrivée/départ, linge, animaux, paiement.
- Les temps de trajet des alentours sont des estimations en voiture.

## Vérifier le rendu
Ouvrir `index.html` dans un navigateur suffit (la visite se charge depuis
geasy.fr). Tester : hero + « Explorer la visite » + « Quitter », un bouton
« Visiter … » d'un gîte, le menu burger sur mobile, la lightbox, le formulaire.

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
- Compression des photos (hero.jpg fait 550 Ko).
