// Régénère le dossier visite/ à partir de la visite 3DVista publiée sur geasy.fr,
// en appliquant les modifications voulues par Ninou. À lancer avec Node.js (aucune dépendance) :
//     node outils/sync-visite.js
// Ce que fait le script :
//   1. télécharge le lecteur, l'habillage, les polices (.woff) et les réglages de la visite
//      (les images des panoramas, 600 Mo, restent chez geasy.fr : leur serveur autorise le CORS) ;
//   2. dans la vue d'ensemble, retire le bandeau « Bienvenue Chez Ninou » et les 3 cercles ;
//   3. masque les boutons « Réserver » et « i » du lecteur (ils ouvraient une fiche peu soignée) ;
//   4. remplace le plan Google Maps de New York (valeur par défaut) par Les Cluses ;
//   5. fait pointer tous les chemins media/ vers geasy.fr.
// Si l'ami de Ninou republie la visite avec des identifiants différents, adapter les constantes ci-dessous.

const fs = require('fs'); const path = require('path');

const BASE = 'https://geasy.fr/chez-ninou/';
const DEST = path.join(__dirname, '..', 'visite');
const OVERLAYS_VUE_ENSEMBLE = /"overlays":\["this\.overlay_A1A6C0BF_B593_DFBE_41E6_922C252486AE","this\.overlay_A6119485_BB5C_F38E_41C0_6EB5F45986B3","this\.overlay_A68F0C23_BB5F_728A_41E6_5B54F2C210FE","this\.overlay_A6B420D3_BB5C_938A_41A1_5780D40249AE"\]/;
const BOUTONS_A_MASQUER = ['Button_A20E62A8_B5B0_E242_41E0_0FCD4EEA5BD8', 'IconButton_2B90E40F_3593_B9CB_41B4_408768336038'];
const CLE_PLAN = /^(WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA(?:_mobile)?\.url = ).*$/gm;
const PLAN_LES_CLUSES = '<iframe src="https://www.google.com/maps?q=14+Avenue+Virginie,+66480+Les+Cluses,+France&output=embed" width="600" height="450" frameborder="0" style="border:0" allowfullscreen>';
const ENTETES = { 'User-Agent': 'Mozilla/5.0' };

const parseTaille = () => 0;
async function lister(rel, fichiers) {
  // Le serveur affiche le contenu des dossiers (listage Apache) : on s'en sert pour tout parcourir.
  const html = await (await fetch(BASE + rel, { headers: ENTETES })).text();
  const re = /<a href="([^"?/][^"]*)">/g; let m; const sous = [];
  while ((m = re.exec(html))) { const nom = m[1]; if (nom.endsWith('/')) sous.push(rel + nom); else fichiers.push(rel + nom); }
  for (const s of sous) await lister(s, fichiers);
}
async function telecharger(rel) {
  const r = await fetch(BASE + rel, { headers: ENTETES });
  if (!r.ok) throw new Error(rel + ' : HTTP ' + r.status);
  const dest = path.join(DEST, decodeURIComponent(rel));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}

(async () => {
  const fichiers = [];
  for (const d of ['lib/', 'skin/', 'loading/', 'misc/', 'locale/', 'fonts/']) await lister(d, fichiers);
  const garder = fichiers.filter(f => !f.startsWith('lib/webxr-input-profiles/') && !(f.startsWith('fonts/') && !/\.woff2?$/i.test(f)));
  const racine = ['script.js', 'script_general.js', 'script_mobile.js', 'fonts.css', 'manifest.json', 'favicon.ico', 'browserconfig.xml'];
  fs.rmSync(DEST, { recursive: true, force: true });
  const file = racine.concat(garder);
  await Promise.all(Array.from({ length: 8 }, async () => { while (file.length) await telecharger(file.shift()); }));
  console.log((racine.length + garder.length) + ' fichiers téléchargés dans visite/');

  // index.html : la racine du site distant sert la page sans nom de fichier, on la récupère à part
  let html = await (await fetch(BASE, { headers: ENTETES })).text();
  html = html.replace(/href="media\//g, 'href="' + BASE + 'media/')
    .replace(/<title>[^<]*<\/title>/, '<title>Chez Ninou · Visite virtuelle 360°</title>\n    <meta name="robots" content="noindex">');
  fs.writeFileSync(path.join(DEST, 'index.html'), html);

  for (const f of ['script_general.js', 'script_mobile.js']) {
    const suffixe = f === 'script_mobile.js' ? '_mobile' : '';
    let s = fs.readFileSync(path.join(DEST, f), 'utf8');
    if (!OVERLAYS_VUE_ENSEMBLE.test(s)) throw new Error(f + ' : la liste des éléments de la vue d’ensemble a changé, adapter OVERLAYS_VUE_ENSEMBLE');
    s = s.replace(OVERLAYS_VUE_ENSEMBLE, '"overlays":[]');
    for (const id of BOUTONS_A_MASQUER) {
      const cle = '"id":"' + id + suffixe + '"';
      if (s.split(cle).length !== 2) throw new Error(f + ' : composant ' + id + ' introuvable ou en double');
      s = s.replace(cle, cle + ',"visible":false');
    }
    s = s.replace(/"media\//g, '"' + BASE + 'media/');
    fs.writeFileSync(path.join(DEST, f), s);
  }

  const fr = path.join(DEST, 'locale', 'fr.txt');
  fs.writeFileSync(fr, fs.readFileSync(fr, 'utf8').replace(CLE_PLAN, (m, cle) => cle + PLAN_LES_CLUSES));

  const cssPath = path.join(DEST, 'fonts.css');
  fs.writeFileSync(cssPath, fs.readFileSync(cssPath, 'utf8').replace(/src:\s*([^;]+);/g, (m, srcs) => { const w = srcs.match(/url\("[^"]+\.woff"\)\s*format\("woff"\)/); return w ? 'src: ' + w[0] + ';' : m; }));
  console.log('visite/ régénérée et modifiée. Vérifier visite/index.html dans un navigateur, puis publier.');
})().catch(e => { console.error('Échec :', e.message); process.exit(1); });
