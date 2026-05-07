/* =========================================================
   Quack, Quack, Pippin — Redesign script.js
   Mobile menu · FAQ accordion · smooth scroll · reveal-on-scroll
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks  = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    // Close menu when any link is tapped
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------- FAQ — collapse the others when one opens ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Smooth-scroll for in-page anchors with sticky-nav offset ---------- */
  const navEl = document.querySelector('.nav');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = navEl ? navEl.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });

  /* ---------- Intro video — autoplay muted, unmute on click ---------- */
  const introVideo = document.getElementById('introVideo');
  const introBtn   = document.getElementById('introSoundBtn');

  if (introVideo && introBtn) {
    // Make sure the muted-autoplay actually starts (some browsers need a nudge)
    const tryPlay = () => introVideo.play().catch(() => { /* ignore — autoplay denied */ });
    if (introVideo.readyState >= 2) tryPlay();
    introVideo.addEventListener('canplay', tryPlay, { once: true });

    // Toggle sound. Also rewind the first time so users hear from the start.
    let firstUnmute = true;
    introBtn.addEventListener('click', () => {
      const willUnmute = introVideo.muted;
      introVideo.muted = !willUnmute === false ? true : false;
      // (above is the same as: introVideo.muted = !willUnmute, written defensively)
      introVideo.muted = !willUnmute;
      introBtn.setAttribute('aria-pressed', String(willUnmute));
      introBtn.setAttribute('aria-label', willUnmute ? 'Mute video' : 'Unmute video');
      if (willUnmute && firstUnmute) {
        introVideo.currentTime = 0;
        firstUnmute = false;
      }
      introVideo.play().catch(() => {});
    });

    // Pause when tab loses focus, resume when it returns (saves battery)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) introVideo.pause();
      else                 introVideo.play().catch(() => {});
    });
  }

  /* ---------- Signup form — client-side validation + Netlify Forms submit ----------
     The form posts to Netlify (data-netlify="true" + hidden form-name).
     We handle the submission with fetch so the user stays on-page and we
     show a friendly inline status message. */
  const signupForm   = document.getElementById('signup-form');
  const signupStatus = document.getElementById('form-status');

  if (signupForm && signupStatus) {
    const setStatus = (text, isError = false) => {
      signupStatus.textContent = text;
      signupStatus.classList.toggle('error', isError);
    };

    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = signupForm.querySelector('input[name="email"]');
      const email = (emailInput?.value || '').trim();

      // Basic email shape check (server will validate too)
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        setStatus('Please enter a valid email address.', true);
        emailInput?.focus();
        return;
      }

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending…');

      try {
        const formData = new FormData(signupForm);
        const body = new URLSearchParams(formData).toString();
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });
        if (!res.ok) throw new Error('Network error');
        setStatus('Thanks! You\'re on the list. We\'ll be in touch.');
        signupForm.reset();
      } catch (err) {
        setStatus('Hmm, something went wrong. Please try again, or email us directly.', true);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Entry reveals — handmade pop / zine vocabulary ----------
     Single IntersectionObserver, fires once per element, unobserves.
     Stagger via data-reveal-delay (ms). Reduced-motion users skip
     entirely: the CSS is gated behind @media (no-preference), so when
     this code does nothing, elements are already visible at rest. The
     marker-strike on the hero <em> is a special case — its keyframe
     fires on the pseudo-element when the parent <em> gets .is-in. */
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        if (delay > 0) {
          setTimeout(() => el.classList.add('is-in'), delay);
        } else {
          el.classList.add('is-in');
        }
        obs.unobserve(el);
      });
    }, {
      // Trigger a touch before the element fully enters the viewport,
      // so the animation feels like it's already underway by the time
      // the element is in clear view.
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05
    });
    targets.forEach(el => io.observe(el));
  }
})();
