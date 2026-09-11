# Chez Ninou — site des gîtes

Site vitrine pour la location de gîtes de **Chez Ninou** (Les Cluses, 66).
Statique (HTML/CSS/JS vanilla, zéro build, zéro dépendance), hébergé sur
**GitHub Pages** : https://thomas-finkelstein.github.io/chez-ninou/

## Parti pris
À l'arrivée : la grande photo aérienne de la maison, le titre et un gros bouton
« Visite virtuelle 360° ». Au clic, la photo zoome, s'assombrit et se fond dans
la visite 3DVista (même cadrage), qui passe en plein écran. Chaque gîte a sa
propre série de photos HD et s'ouvre aussi en 360°. Style éditorial : serif
Cormorant Garamond + Jost, palette crème / terracotta / olive / encre.

## Structure
- `index.html` — page unique : en-tête fixe + menu mobile plein écran, hero
  (photo + iframe de la visite + voile de texte + contrôles), chiffres clés,
  bienvenue (texte + collage), les trois gîtes (photo principale + vignettes +
  liens cachés pour la lightbox), visite 360° (5 vignettes → fenêtre plein
  écran), galerie de la maison, alentours (bande + 3 cartes avec distances),
  bon à savoir, contact + formulaire, pied de page, `#modal-visite`, lightbox.
- `styles.css` — toute la mise en forme. Variables dans `:root`. Points de
  rupture : 1024px (tablette) et 780px (mobile) en bas de fichier.
- `script.js` — en-tête, menu mobile, hero (préchargement discret de la visite
  après 3 s, fondu au clic, mode immersif, changement de scène, plein écran),
  fenêtre de visite, lightbox par groupe, formulaire (`mailto:` prérempli),
  apparition au défilement. Constantes en haut : `EMAIL_CONTACT`,
  `VISITE_URL`, `NOMS_SCENES`.
- `visite/` — copie modifiée du lecteur de la visite 360° (voir plus bas).
- `outils/sync-visite.js` — régénère `visite/` depuis geasy.fr avec les
  modifications (`node outils/sync-visite.js`).
- `images/` — photos HD fournies par Ninou, réduites à 1800 px (`nom.jpg`) et
  720 px (`nom-min.jpg`, pour les vignettes) :
  - Gîte RDC : rdc-chambre, rdc-chambre-2, rdc-chambre-3, rdc-cuisine,
    rdc-cuisine-2, rdc-cuisine-3, rdc-salle-eau.
  - Gîte Bleu : bleu-chambre, bleu-cuisine, bleu-vue (extrait de la visite).
  - Gîte Rose : rose-chambre, rose-cuisine, rose-salle-de-bain, rose-vue
    (extrait de la visite).
  - Maison : maison-facade, piscine, jardin, terrasse, veranda,
    visite-poster (vue aérienne, image de départ de la visite), vue-du-ciel.
  - hero-maison.jpg : la vue aérienne agrandie à 1920 px pour l'accueil.
  Les originaux (6000 px) sont dans le zip « Photos HD - Chez Ninou » de Ninou.
- `.nojekyll` — sert le site tel quel sur GitHub Pages.
- `CNAME` — présent seulement si un nom de domaine est branché.

## Les trois gîtes
Le Gîte Rez-de-chaussée (dit « Gîte RDC », classé meublé de tourisme 1★ en
juin 2026, capacité 2), le Gîte Bleu, le Gîte Rose. 2 personnes max chacun.
Ne pas appeler le gîte RDC « studio » : Ninou refuse ce nom.

## Photos : une série par gîte
Chaque lien `[data-lightbox]` porte un `data-groupe` (`rdc`, `bleu`, `rose`,
`maison`). La lightbox ne fait défiler que les photos du même groupe. Pour
ajouter une photo à un gîte sans l'afficher dans la fiche, ajouter un lien
`hidden` avec le même groupe (voir la fiche RDC) et mettre à jour le badge
« N photos ».

## Visite virtuelle 360°
Visite 3DVista (32 panoramas) réalisée par un ami de Ninou et publiée sur
https://geasy.fr/chez-ninou/. Le site utilise **sa propre copie modifiée** dans
`visite/` (lecteur, habillage, polices, réglages : 11 Mo) ; les images des
panoramas (600 Mo) restent chez geasy.fr, dont le serveur autorise le CORS.

Modifications appliquées à la copie (demandées par Ninou) :
- vue d'ensemble sans le bandeau « Bienvenue Chez Ninou » ni les 3 cercles
  GÎTE RDC / BLEU / ROSE (la liste `overlays` du panorama `entree` est vidée) ;
- boutons « Réserver » et « i » du lecteur masqués (`"visible":false`) ;
  l'épingle de carte (fiche Google Maps de Chez Ninou) est conservée ;
- plan Google Maps de New York (valeur par défaut) remplacé par Les Cluses ;
- chemins `media/` en absolu vers geasy.fr ; polices en .woff uniquement.
Pour régénérer la copie si l'ami republie la visite : `node outils/sync-visite.js`
(le script s'arrête si les identifiants attendus n'existent plus).

- **Partout sur le site**, c'est cette copie qui est chargée (`VISITE_URL` dans
  `script.js`) : hero, fenêtre plein écran des gîtes, lien « nouvel onglet ».
  Exception : ouvert par double-clic (`file://`), le lecteur 3DVista ne
  fonctionne pas ; le site rebascule alors sur https://geasy.fr/chez-ninou/
  (version d'origine, avec les cercles). En ligne, c'est toujours la copie.
- **Hero** : l'iframe se précharge derrière la photo 3 s après l'ouverture
  (sauf économie de données). Le bouton « Visite virtuelle 360° » lance le
  fondu : classe `transition` (zoom + assombrissement + « Chargement… ») puis
  `immersif` quand le lecteur est prêt (photo et voile disparaissent, en-tête
  masqué, barre de scènes en bas). Quitter / Échap / clic sur un lien du menu
  / sortie du hero de l'écran ramènent la photo.
- **Fenêtre plein écran** (`#modal-visite`) : boutons `data-visite="<scène>"`
  (fiches gîtes, vignettes). Échap ou ✕ ferment ; l'iframe est vidée.
- **Scènes** (paramètre `?media-name=`) : `entree` = vue d'ensemble (défaut),
  `chambre_rdc_1` = Gîte RDC, `blanc_1` = Gîte Bleu, `rouge_1` = Gîte Rose,
  `piscine`, `parking`, `veranda`. Autres panoramas : chambre_rdc_*, blanc_*,
  rouge_*, bas escalier, couloir haut, 05272024_141917 (jardin au sol).

## Contenu réel (déjà en place)
- Adresse : 14 avenue Virginie, 66480 Les Cluses. Tél. 06 74 45 37 66.
  E-mail : chezninou66@gmail.com (dans `index.html` **et** `EMAIL_CONTACT`).
- Infos pratiques tirées des documents de Ninou (« Informations pour les
  clients », « Informations générales ») : départ avant 10h, état des lieux
  15 min avant ; piscine 10h–20h (un autre document dit 21h), pas de plongeon ;
  wifi fibre offert ; laverie, étendage, terrasse du bas et matériel de ménage
  partagés ; portail motorisé (télécommande / code) ; tri au bout de l'impasse ;
  autonomie complète, SMS au 06 74 45 37 66 en cas de besoin.
- **Ne jamais publier** le code du portail ni le mot de passe wifi (ils sont
  dans ces documents) : ils sont remis à l'arrivée.

## À compléter
- Prix par nuit (affiché « Tarif sur demande »), heure d'arrivée, draps et
  serviettes, animaux, modalités de paiement (Ninou n'a pas voulu de mention
  « à préciser » sur le site : ne rien afficher tant que ce n'est pas connu).
- Les temps de trajet des alentours sont des estimations en voiture.

## Vérifier le rendu
En ligne (GitHub Pages) ou via un petit serveur local ; par double-clic sur
`index.html`, la visite affichée est celle de geasy.fr (voir plus haut).
Tester : bouton « Visite virtuelle 360° » puis « Quitter », un bouton
« Visiter le gîte », la lightbox d'un gîte (flèches : uniquement ses photos),
le menu burger sur mobile, le formulaire.

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
