/* Chez Ninou — comportements du site (aucune dépendance).
   1. En-tête   2. Menu mobile   3. Hero : visite 360° en plein écran + mode immersif
   4. Visite 360° en fenêtre plein écran (gîtes, scènes)   5. Lightbox photos
   6. Formulaire de réservation (mailto)   7. Apparition au défilement   8. Année */

// Adresse qui reçoit les demandes de réservation.
const EMAIL_CONTACT = 'chezninou66@gmail.com';

// Visite 3DVista hébergée par geasy.fr. Une scène = un nom de panorama (paramètre media-name).
const VISITE_URL = 'https://geasy.fr/chez-ninou/';
const NOMS_SCENES = { '': 'Vue d’ensemble', chambre_rdc_1: 'Le Studio', blanc_1: 'Le Gîte Bleu', rouge_1: 'Le Gîte Rose', piscine: 'La piscine' };
const urlScene = s => VISITE_URL + (s ? '?media-name=' + encodeURIComponent(s) : '');
const activerChips = (conteneur, scene) => {
  conteneur.querySelectorAll('.chip').forEach(c => {
    const actif = c.dataset.scene === scene;
    c.classList.toggle('actif', actif);
    c.setAttribute('aria-pressed', String(actif));
  });
};

/* ---------- 1. En-tête : transparent sur la visite, opaque ensuite ---------- */
const entete = document.getElementById('entete');
const majEntete = () => entete.classList.toggle('solide', window.scrollY > 40);
majEntete();
window.addEventListener('scroll', majEntete, { passive: true });

/* ---------- 2. Menu mobile plein écran ---------- */
const burger = document.querySelector('.burger');
const menuMobile = document.getElementById('menu-mobile');
let menuOuvert = false;
const ouvrirMenu = () => {
  menuOuvert = true;
  menuMobile.hidden = false;
  requestAnimationFrame(() => menuMobile.classList.add('ouvert'));
  entete.classList.add('menu-ouvert');
  document.body.classList.add('no-scroll');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Fermer le menu');
};
const fermerMenu = () => {
  if (!menuOuvert) return;
  menuOuvert = false;
  menuMobile.classList.remove('ouvert');
  entete.classList.remove('menu-ouvert');
  document.body.classList.remove('no-scroll');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Ouvrir le menu');
  setTimeout(() => { if (!menuOuvert) menuMobile.hidden = true; }, 300);
};
burger.addEventListener('click', () => (menuOuvert ? fermerMenu() : ouvrirMenu()));
menuMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', fermerMenu));

/* ---------- 3. Hero : la visite virtuelle en plein écran ---------- */
const hero = document.getElementById('haut');
const heroIframe = hero.querySelector('.hero-iframe');
const heroControles = hero.querySelector('.hero-controles');
const badgeTexte = hero.querySelector('.badge-texte');
const boutonExplorer = document.getElementById('explorer');
const boutonQuitter = document.getElementById('quitter');
let sceneHero = '';
let immersif = false;

const chargerHero = () => { heroIframe.src = urlScene(sceneHero); };
heroIframe.addEventListener('load', () => {
  if (!heroIframe.getAttribute('src')) return;
  // Le lecteur affiche encore son propre écran de chargement pendant ~1 s.
  setTimeout(() => {
    hero.classList.add('pret');
    badgeTexte.textContent = 'Visite virtuelle en direct · 32 panoramas';
  }, 1200);
});

// Économie de données activée : on attend le clic. Sinon la visite démarre tout de suite.
const economieDonnees = navigator.connection && navigator.connection.saveData;
if (economieDonnees) badgeTexte.textContent = 'Visite virtuelle · cliquez sur Explorer pour la lancer';
else chargerHero();

const entrerImmersif = () => {
  if (!heroIframe.getAttribute('src')) chargerHero();
  immersif = true;
  hero.classList.add('immersif');
  document.body.classList.add('immersif');
  heroControles.hidden = false;
  fermerMenu();
  boutonQuitter.focus({ preventScroll: true });
};
const sortirImmersif = () => {
  if (!immersif) return;
  immersif = false;
  hero.classList.remove('immersif');
  document.body.classList.remove('immersif');
  heroControles.hidden = true;
  if (document.fullscreenElement === hero) document.exitFullscreen().catch(() => {});
};
boutonExplorer.addEventListener('click', () => {
  hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
  entrerImmersif();
});
boutonQuitter.addEventListener('click', () => { sortirImmersif(); boutonExplorer.focus({ preventScroll: true }); });
document.getElementById('hero-plein-ecran').addEventListener('click', () => {
  if (hero.requestFullscreen) hero.requestFullscreen().catch(() => {});
});
heroControles.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
  sceneHero = chip.dataset.scene;
  activerChips(heroControles, sceneHero);
  chargerHero();
}));
// Un clic sur un lien du site quitte le mode immersif.
document.querySelectorAll('.entete a, .menu-mobile a').forEach(a => a.addEventListener('click', sortirImmersif));
// Si la visite sort de l'écran (défilement au clavier, à la barre), on rend la page à l'utilisateur.
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (!e.isIntersecting && immersif) sortirImmersif(); });
  }, { threshold: 0.35 }).observe(hero);
}

/* ---------- 4. Visite 360° en fenêtre plein écran ---------- */
const modal = document.getElementById('modal-visite');
const modalIframe = modal.querySelector('iframe');
const modalNom = document.getElementById('modal-scene-nom');
const modalFermer = document.getElementById('modal-fermer');
let modalOuvert = false;
let focusAvantModal = null;

const afficherSceneModal = scene => {
  modalNom.textContent = NOMS_SCENES[scene] || 'Visite';
  activerChips(modal, scene);
  modalIframe.src = urlScene(scene);
};
const ouvrirModal = scene => {
  sortirImmersif();
  fermerMenu();
  focusAvantModal = document.activeElement;
  modalOuvert = true;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  afficherSceneModal(scene);
  modalFermer.focus();
};
const fermerModal = () => {
  if (!modalOuvert) return;
  modalOuvert = false;
  if (document.fullscreenElement === modal) document.exitFullscreen().catch(() => {});
  modal.hidden = true;
  modalIframe.src = 'about:blank';
  document.body.classList.remove('no-scroll');
  if (focusAvantModal && focusAvantModal.focus) focusAvantModal.focus({ preventScroll: true });
};
document.querySelectorAll('[data-visite]').forEach(el => el.addEventListener('click', () => ouvrirModal(el.dataset.visite)));
modal.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => afficherSceneModal(chip.dataset.scene)));
modalFermer.addEventListener('click', fermerModal);
document.getElementById('modal-plein-ecran').addEventListener('click', () => {
  if (modal.requestFullscreen) modal.requestFullscreen().catch(() => {});
});

/* ---------- 5. Lightbox photos ---------- */
const lightbox = document.getElementById('lightbox');
const liens = Array.from(document.querySelectorAll('[data-lightbox]'));
let lightboxOuvert = false;
let indexPhoto = 0;
const fermerLightbox = () => {
  if (!lightboxOuvert) return;
  lightboxOuvert = false;
  lightbox.hidden = true;
  document.body.classList.remove('no-scroll');
  liens[indexPhoto].focus({ preventScroll: true });
};
if (lightbox && liens.length) {
  const img = lightbox.querySelector('img');
  const legende = lightbox.querySelector('figcaption');
  const afficher = i => {
    indexPhoto = (i + liens.length) % liens.length;
    const lien = liens[indexPhoto];
    img.src = lien.getAttribute('href');
    img.alt = lien.dataset.caption || '';
    legende.textContent = lien.dataset.caption || '';
  };
  const ouvrir = i => {
    afficher(i);
    lightboxOuvert = true;
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    lightbox.querySelector('.lb-fermer').focus();
  };
  liens.forEach((lien, i) => lien.addEventListener('click', e => { e.preventDefault(); ouvrir(i); }));
  lightbox.querySelector('.lb-fermer').addEventListener('click', fermerLightbox);
  lightbox.querySelector('.lb-prec').addEventListener('click', () => afficher(indexPhoto - 1));
  lightbox.querySelector('.lb-suiv').addEventListener('click', () => afficher(indexPhoto + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) fermerLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightboxOuvert) return;
    if (e.key === 'ArrowLeft') afficher(indexPhoto - 1);
    if (e.key === 'ArrowRight') afficher(indexPhoto + 1);
  });
  let departX = null;
  lightbox.addEventListener('touchstart', e => { departX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (departX === null) return;
    const dx = e.changedTouches[0].clientX - departX;
    if (Math.abs(dx) > 50) afficher(dx < 0 ? indexPhoto + 1 : indexPhoto - 1);
    departX = null;
  });
}

// Échap : ferme ce qui est ouvert, du plus récent au plus ancien.
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (lightboxOuvert) fermerLightbox();
  else if (modalOuvert) fermerModal();
  else if (menuOuvert) fermerMenu();
  else if (immersif) sortirImmersif();
});

/* ---------- 6. Formulaire de réservation ---------- */
const form = document.getElementById('form-resa');
if (form) {
  const erreur = form.querySelector('.form-erreur');
  const aujourdhui = new Date().toISOString().slice(0, 10);
  form.arrivee.min = aujourdhui;
  form.depart.min = aujourdhui;
  form.arrivee.addEventListener('change', () => {
    form.depart.min = form.arrivee.value || aujourdhui;
    if (form.depart.value && form.depart.value <= form.arrivee.value) form.depart.value = '';
  });

  // Les liens « Demander les dates » présélectionnent le gîte.
  document.querySelectorAll('[data-gite]').forEach(el => {
    el.addEventListener('click', () => { form.gite.value = el.dataset.gite; });
  });

  const formatDate = iso => {
    if (!iso) return '';
    const [a, m, j] = iso.split('-');
    return `${j}/${m}/${a}`;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    erreur.hidden = true;

    if (!form.checkValidity()) {
      erreur.textContent = 'Merci de renseigner votre nom, votre e-mail et vos dates.';
      erreur.hidden = false;
      form.querySelector(':invalid').focus();
      return;
    }
    if (form.depart.value <= form.arrivee.value) {
      erreur.textContent = 'La date de départ doit être après la date d’arrivée.';
      erreur.hidden = false;
      form.depart.focus();
      return;
    }

    const d = Object.fromEntries(new FormData(form));
    const sujet = `Demande de réservation · ${d.gite} · ${formatDate(d.arrivee)} → ${formatDate(d.depart)}`;
    const corps = [
      'Bonjour Ninou,',
      '',
      `Je souhaite réserver : ${d.gite}`,
      `Du ${formatDate(d.arrivee)} au ${formatDate(d.depart)}`,
      `Nombre de personnes : ${d.personnes}`,
      '',
      d.message ? `Message : ${d.message}` : '',
      '',
      `${d.nom}`,
      `${d.email}`
    ].join('\n');

    window.location.href = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
  });
}

/* ---------- 7. Apparition au défilement ---------- */
const reveals = document.querySelectorAll('.reveal');
const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reveals.length && 'IntersectionObserver' in window && !reduit) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => obs.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

/* ---------- 8. Année ---------- */
const annee = document.getElementById('annee');
if (annee) annee.textContent = new Date().getFullYear();
