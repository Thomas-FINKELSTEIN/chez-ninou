/* Chez Ninou — petits comportements du site (aucune dépendance).
   1. Menu mobile   2. Lightbox galerie   3. Formulaire de réservation (mailto)
   4. Apparition au défilement   5. Année du footer */

// Adresse qui reçoit les demandes de réservation.
const EMAIL_CONTACT = 'chezninou66@gmail.com';

/* ---------- 1. Menu mobile ---------- */
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
if (burger && nav) {
  const fermerMenu = () => {
    nav.classList.remove('ouvert');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
  };
  burger.addEventListener('click', () => {
    const ouvert = nav.classList.toggle('ouvert');
    burger.setAttribute('aria-expanded', String(ouvert));
    burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', fermerMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerMenu(); });
}

/* ---------- 2. Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const liens = Array.from(document.querySelectorAll('[data-lightbox]'));
if (lightbox && liens.length) {
  const img = lightbox.querySelector('img');
  const legende = lightbox.querySelector('figcaption');
  let index = 0;

  const afficher = i => {
    index = (i + liens.length) % liens.length;
    const lien = liens[index];
    img.src = lien.getAttribute('href');
    img.alt = lien.dataset.caption || '';
    legende.textContent = lien.dataset.caption || '';
  };
  const ouvrir = i => {
    afficher(i);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    lightbox.querySelector('.lb-fermer').focus();
  };
  const fermer = () => {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    liens[index].focus();
  };

  liens.forEach((lien, i) => lien.addEventListener('click', e => { e.preventDefault(); ouvrir(i); }));
  lightbox.querySelector('.lb-fermer').addEventListener('click', fermer);
  lightbox.querySelector('.lb-prec').addEventListener('click', () => afficher(index - 1));
  lightbox.querySelector('.lb-suiv').addEventListener('click', () => afficher(index + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) fermer(); });
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') fermer();
    if (e.key === 'ArrowLeft') afficher(index - 1);
    if (e.key === 'ArrowRight') afficher(index + 1);
  });

  // Balayage tactile gauche/droite
  let departX = null;
  lightbox.addEventListener('touchstart', e => { departX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (departX === null) return;
    const dx = e.changedTouches[0].clientX - departX;
    if (Math.abs(dx) > 50) afficher(dx < 0 ? index + 1 : index - 1);
    departX = null;
  });
}

/* ---------- 3. Formulaire de réservation ---------- */
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

  // Les boutons « Demander les dates » présélectionnent le gîte.
  document.querySelectorAll('[data-gite]').forEach(btn => {
    btn.addEventListener('click', () => { form.gite.value = btn.dataset.gite; });
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
      erreur.textContent = 'La date de départ doit être après la date d\'arrivée.';
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

/* ---------- 3b. Visite virtuelle 360° (3DVista hébergée chez geasy.fr) ---------- */
const VISITE_URL = 'https://geasy.fr/chez-ninou/';
const visite = document.getElementById('visite');
if (visite) {
  const iframe = visite.querySelector('iframe');
  const lancer = visite.querySelector('.visite-lancer');
  const chips = visite.querySelectorAll('.chip');
  let scene = '';
  const urlScene = s => VISITE_URL + (s ? '?media-name=' + encodeURIComponent(s) : '');
  const charger = () => {
    const url = urlScene(scene);
    if (iframe.src !== url) iframe.src = url;
    iframe.hidden = false;
    visite.classList.add('visite-active');
  };
  const choisir = s => {
    scene = s;
    chips.forEach(c => { const actif = c.dataset.scene === s; c.classList.toggle('actif', actif); c.setAttribute('aria-pressed', String(actif)); });
    if (!iframe.hidden) charger();
  };
  lancer.addEventListener('click', charger);
  chips.forEach(c => c.addEventListener('click', () => choisir(c.dataset.scene)));
  // Liens « Visite 360° » des cartes gîtes : on choisit la scène et on lance.
  document.querySelectorAll('[data-visite]').forEach(a => a.addEventListener('click', () => { choisir(a.dataset.visite); charger(); }));
}

/* ---------- 4. Apparition au défilement ---------- */
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

/* ---------- 5. Année ---------- */
const annee = document.getElementById('annee');
if (annee) annee.textContent = new Date().getFullYear();
