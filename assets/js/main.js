/**
 * Coastal Content Labs | Main JavaScript
 * Based on Atlas by BootstrapMade (Bootstrap 5)
 * Original template: https://bootstrapmade.com/newtemplate-bootstrap-website-template/
 * License: https://bootstrapmade.com/license/
 */

(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('#header');
  const navMenu = document.querySelector('#navmenu');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const scrollTop = document.querySelector('#scroll-top');
  const preloader = document.querySelector('#preloader');
  const navLinks = [...document.querySelectorAll('#navmenu a[href^="#"]')];

  /** Mobile navigation */
  function setMobileNavOpen(open) {
    if (!mobileToggle) return;

    body.classList.toggle('mobile-nav-active', open);
    mobileToggle.classList.toggle('bi-list', !open);
    mobileToggle.classList.toggle('bi-x', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  if (mobileToggle) {
    mobileToggle.setAttribute('aria-controls', 'navmenu');
    setMobileNavOpen(false);

    mobileToggle.addEventListener('click', () => {
      setMobileNavOpen(!body.classList.contains('mobile-nav-active'));
    });

    // The Atlas toggle is an <i role="button">, so add keyboard activation.
    mobileToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        mobileToggle.click();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => setMobileNavOpen(false));
    });

    // Dismiss the full-screen mobile navigation overlay.
    navMenu?.addEventListener('click', (event) => {
      if (event.target === navMenu) setMobileNavOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && body.classList.contains('mobile-nav-active')) {
        setMobileNavOpen(false);
        mobileToggle.focus();
      }
    });
  }

  /** Scrolled header, back-to-top control, and active section navigation */
  function updateScrollState() {
    const scrolled = window.scrollY > 100;
    if (header?.classList.contains('fixed-top') ||
        header?.classList.contains('sticky-top') ||
        header?.classList.contains('scroll-up-sticky')) {
      body.classList.toggle('scrolled', scrolled);
    }
    scrollTop?.classList.toggle('active', scrolled);

    const readingPosition = window.scrollY + (header?.offsetHeight || 0) + 90;
    navLinks.forEach((link) => {
      const section = document.getElementById(link.hash.slice(1));
      const isActive = section &&
        readingPosition >= section.offsetTop &&
        readingPosition < section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', Boolean(isActive));
    });
  }

  let scrollUpdatePending = false;
  function scheduleScrollUpdate() {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    window.requestAnimationFrame(() => {
      updateScrollState();
      scrollUpdatePending = false;
    });
  }

  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate);
  window.addEventListener('load', scheduleScrollUpdate);
  scheduleScrollUpdate();

  scrollTop?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /** Remove the initial loading indicator once all resources finish loading. */
  if (preloader) {
    if (document.readyState === 'complete') {
      preloader.remove();
    } else {
      window.addEventListener('load', () => preloader.remove(), { once: true });
    }
  }

  /** GA4 CTA tracking. Never send inquiry contents or user-entered data. */
  const ctaLinks = document.querySelectorAll(
    '.hero .btn-primary-action, #ventures .venture-button, #contact a[href^="mailto:"], #footer a[href^="mailto:"]'
  );

  ctaLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof window.gtag !== 'function') return;

      const href = link.getAttribute('href') || '';
      const destination = href.startsWith('mailto:')
        ? 'email'
        : href.startsWith('#')
          ? 'on-page'
          : new URL(href, window.location.href).hostname;

      window.gtag('event', 'cta_click', {
        cta_label: link.textContent.trim().replace(/\s+/g, ' '),
        cta_location: link.closest('section, footer')?.id || 'page',
        cta_destination: destination
      });
    });
  });
})();
