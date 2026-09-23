/* ============================================================
   JOHN LATIF — PORTFOLIO
   script.js
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. PRELOADER
     ========================================================= */
  function initPreloader() {
    const preloader = $('#preloader');
    const main = $('#mainContent');
    if (!preloader || !main) return;

    const TOTAL = 3000;
    const TRANSITION = 900;

    setTimeout(() => {
      preloader.classList.add('exit');

      setTimeout(() => {
        main.classList.add('visible');
      }, TRANSITION * 0.4);

      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => { preloader.style.display = 'none'; }, 800);
      }, TRANSITION);
    }, TOTAL);
  }

  /* =========================================================
     2. NAVBAR
     ========================================================= */
  function initNavbar() {
    const navbar = $('#navbar');
    const navLinks = $$('.nav-link');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 20);

        let current = 'home';
        navLinks.forEach(link => {
          const id = link.dataset.section;
          const section = document.getElementById(id);
          if (!section) return;
          const top = section.offsetTop - 120;
          if (y >= top) current = id;
        });

        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === current);
        });

        ticking = false;
      });
    }, { passive: true });
  }

  /* =========================================================
     3. MOBILE MENU
     ========================================================= */
  function initMobileMenu() {
    const toggle = $('#menuToggle');
    const menu = $('#mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
    });

    $$('a', menu).forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* =========================================================
     4. SMOOTH SCROLL
     ========================================================= */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  }

  /* =========================================================
     5. REVEAL (خفيف)
     ========================================================= */
  function initReveal() {
    const els = $$(
      '.reveal, .reveal-title, .skills-block, ' +
      '.about-grid > *, .projects-grid > *, ' +
      '.contact-grid > *, .footer-inner > *'
    );
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add('visible', 'reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(el => observer.observe(el));
  }

  /* =========================================================
     6. TYPEWRITER
     ========================================================= */
  const TYPE_ROLES = {
    en: ['Web Developer', 'Full Stack Developer'],
    ar: ['مطور ويب', 'مطور فل ستاك']
  };

  let typewriterTimer = null;

  function startTypewriter(lang) {
    const el = $('#typeContent');
    if (!el) return;

    if (typewriterTimer) clearTimeout(typewriterTimer);

    const roles = TYPE_ROLES[lang] || TYPE_ROLES.en;
    let i = 0, j = 0, deleting = false;

    function loop() {
      const current = roles[i];

      if (!deleting) {
        el.textContent = current.substring(0, ++j);
        if (j === current.length) {
          deleting = true;
          typewriterTimer = setTimeout(loop, 1800);
          return;
        }
      } else {
        el.textContent = current.substring(0, --j);
        if (j === 0) {
          deleting = false;
          i = (i + 1) % roles.length;
        }
      }
      typewriterTimer = setTimeout(loop, deleting ? 45 : 90);
    }

    el.textContent = '';
    loop();
  }

  /* =========================================================
     7. PARALLAX
     ========================================================= */
  function initParallax() {
    if (prefersReducedMotion) return;

    const glows = $$('.hero-glow, .hero-glow-2');
    if (!glows.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        glows.forEach((glow, i) => {
          const speed = 0.15 + i * 0.08;
          glow.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* =========================================================
     8. HERO IMAGE 3D TILT
     ========================================================= */
  function initHeroTilt() {
    if (prefersReducedMotion) return;

    const wrap = $('.hero-image-inner');
    if (!wrap) return;

    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      wrap.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      wrap.style.transition = 'transform 0.15s ease-out';
    });

    wrap.addEventListener('mouseleave', () => {
      wrap.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
      wrap.style.transition = 'transform 0.6s ease';
    });
  }

  /* =========================================================
     9. BACK TO TOP
     ========================================================= */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top-floating';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    btn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 999;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #FA6E00, #E60026);
      color: #fff;
      font-size: 1.25rem;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(230, 0, 38, 0.4);
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const show = window.scrollY > 600;
        btn.style.opacity = show ? '1' : '0';
        btn.style.pointerEvents = show ? 'auto' : 'none';
        btn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================
     10. LANGUAGE TOGGLE
     ========================================================= */
  let currentLang = 'en';

  function initLangToggle() {
    const btn = $('#langBtn');
    if (!btn) return;

    applyLangInstant('en');

    btn.addEventListener('click', e => {
      const nextLang = currentLang === 'en' ? 'ar' : 'en';
      switchLanguage(nextLang, e);
    });
  }

  function applyLangInstant(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    $$('[data-en][data-ar]').forEach(el => {
      const text = el.dataset[lang];
      if (text) el.textContent = text;
    });

    const text = $('.lang-text');
    if (text) text.textContent = lang === 'ar' ? 'EN' : 'AR';

    document.title = lang === 'ar'
      ? 'جون لطيف — مطور فل ستاك'
      : 'John Latif — Full Stack Developer';

    startTypewriter(lang);
  }

  function switchLanguage(nextLang, event) {
    if (nextLang === currentLang) return;

    const overlay = $('#langOverlay');
    const overlayText = $('#langOverlayText');
    if (!overlay) {
      applyLangInstant(nextLang);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    overlay.style.setProperty('--origin-x', x + '%');
    overlay.style.setProperty('--origin-y', y + '%');

    if (overlayText) {
      overlayText.textContent = nextLang === 'ar' ? 'AR' : 'EN';
    }

    overlay.classList.add('active');

    setTimeout(() => {
      applyLangInstant(nextLang);
      currentLang = nextLang;
    }, 400);

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 750);
  }

  /* =========================================================
     11. EXTERNAL LINKS
     ========================================================= */
  function initExternalLinks() {
    $$('a[href^="http"]').forEach(link => {
      if (!link.hostname || link.hostname === window.location.hostname) return;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* =========================================================
     12. INIT
     ========================================================= */
  function init() {
    initPreloader();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initLangToggle();
    initParallax();
    initHeroTilt();
    initBackToTop();
    initExternalLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
