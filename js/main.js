/* ============================================================
   SMS Data Ltd — main.js
   Nav scroll, mobile menu, scroll animations,
   contact form validation, cookie banner
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Nav: transparent → frosted on scroll ---------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile hamburger ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (path === '/' && href === 'index.html') ||
        path.endsWith(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  /* ---------- Intersection Observer: fade-up ---------- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ---------- Legal TOC: active link on scroll ---------- */
  const tocLinks = document.querySelectorAll('.legal-toc a[href^="#"]');
  if (tocLinks.length) {
    const headings = Array.from(tocLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const tocScroll = () => {
      let current = headings[0];
      headings.forEach(h => {
        if (window.scrollY + 120 >= h.offsetTop) current = h;
      });
      tocLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
      });
    };
    window.addEventListener('scroll', tocScroll, { passive: true });
    tocScroll();
  }

  /* ---------- Contact form validation + Formspree ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'name',    msg: 'Please enter your full name.' },
        { id: 'company', msg: 'Please enter your company name.' },
        { id: 'email',   msg: 'Please enter a valid work email.', isEmail: true },
        { id: 'country', msg: 'Please select your country.' },
        { id: 'reason',  msg: 'Please select a reason for enquiry.' },
        { id: 'message', msg: 'Please enter your message.' },
      ];

      fields.forEach(({ id, msg, isEmail }) => {
        const input = document.getElementById(id);
        const err   = document.getElementById(id + '-error');
        if (!input) return;
        const val = input.value.trim();
        const bad = !val || (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
        input.classList.toggle('error', bad);
        if (err) err.classList.toggle('show', bad);
        if (bad) valid = false;
      });

      if (!valid) return;

      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.closest('.form-card').querySelector('.form-body').style.display = 'none';
          form.closest('.form-card').querySelector('.form-success').classList.add('show');
        } else {
          btn.textContent = 'Send Enquiry';
          btn.disabled = false;
          alert('Something went wrong. Please email us directly at contact@smsdata.net');
        }
      } catch {
        btn.textContent = 'Send Enquiry';
        btn.disabled = false;
        alert('Unable to send. Please email us directly at contact@smsdata.net');
      }
    });

    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = document.getElementById(input.id + '-error');
        if (err) err.classList.remove('show');
      });
    });
  }

  /* ---------- Cookie banner ---------- */
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    if (!localStorage.getItem('sms_cookies_ok')) {
      banner.classList.remove('hidden');
    }
    document.getElementById('cookie-accept')?.addEventListener('click', () => {
      localStorage.setItem('sms_cookies_ok', '1');
      banner.classList.add('hidden');
    });
  }

})();
