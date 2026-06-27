document.addEventListener('DOMContentLoaded', () => {

  // 0. SCROLL REVEAL
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 1. STICKY NAV
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // 2. HAMBURGER MENU
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.textContent = open ? '✕' : '☰';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.textContent = '☰';
    }));
  }

  // 3. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight + 12 : 80);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // 4. HERO COUNTDOWN TIMER
  const timerEl = document.getElementById('hero-timer');
  if (timerEl) {
    let s = 43;
    setInterval(() => {
      s = s <= 0 ? 59 : s - 1;
      timerEl.textContent = '0:' + String(s).padStart(2, '0');
    }, 1000);
  }

  // 5. INCOME CALCULATOR
  const slider = document.getElementById('deals-slider');
  const dealsCountEl = document.getElementById('deals-count');
  const bruttoEl = document.getElementById('brutto');
  const nettoEl = document.getElementById('netto');
  const planBtns = document.querySelectorAll('.plan-btn');

  // TODO: Update prices when finalized
  const planData = {
    starter: { price: 197, provision: 1060 },
    pro:     { price: 297, provision: 1100 },
    team:    { price: 597, provision: 1100 }
  };
  let currentPlan = 'pro';

  function updateCalc() {
    if (!slider) return;
    const deals = parseInt(slider.value);
    const { price, provision } = planData[currentPlan];
    const brutto = deals * provision;
    const netto = Math.max(0, brutto - price);
    if (dealsCountEl) dealsCountEl.textContent = deals;
    if (bruttoEl) bruttoEl.textContent = brutto.toLocaleString('de-DE') + ' €';
    if (nettoEl) nettoEl.textContent = netto.toLocaleString('de-DE') + ' €';
    const pct = ((deals - 1) / 29) * 100;
    slider.style.background = `linear-gradient(to right, var(--brand) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  }

  if (slider) {
    slider.addEventListener('input', updateCalc);
    updateCalc();
  }

  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      planBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlan = btn.dataset.plan;
      updateCalc();
    });
  });

  // 6. FORM SUBMISSION
  const form = document.getElementById('apply-form');
  const formSuccess = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Wird gesendet...';
      btn.disabled = true;
      const action = form.action;
      if (!action || action.includes('GOOGLE_APPS_SCRIPT_URL')) {
        setTimeout(() => {
          form.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        }, 800);
        return;
      }
      try {
        await fetch(action, { method: 'POST', body: new FormData(form), mode: 'no-cors' });
        form.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } catch {
        btn.textContent = orig;
        btn.disabled = false;
        alert('Fehler beim Senden. Schreib uns direkt: info@growback.online');
      }
    });
  }

});
