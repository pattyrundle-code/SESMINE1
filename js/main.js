/**
 * SESMine — main.js
 * Global UI helpers: toast, reveal observer, logo loader,
 * dropdown, modal, tabs, clock, ripple effects.
 */
(function () {
  'use strict';

  // ── Toast notification system ──────────────────────────
  let toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'sesmine-toasts';
      toastContainer.style.cssText = `
        position:fixed;top:20px;right:20px;z-index:9999;
        display:flex;flex-direction:column;gap:10px;
        pointer-events:none;
      `;
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  window.SESMine = window.SESMine || {};

  SESMine.showToast = function (message, type = 'info', duration = 3500) {
    const colors = {
      success: { bg:'rgba(46,204,113,0.12)',  border:'rgba(46,204,113,0.35)',  icon:'✓', color:'#2ecc71' },
      error:   { bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.35)',   icon:'✕', color:'#ef4444' },
      warning: { bg:'rgba(245,166,35,0.12)',  border:'rgba(245,166,35,0.35)',  icon:'⚠', color:'#f5a623' },
      info:    { bg:'rgba(99,102,241,0.12)',  border:'rgba(99,102,241,0.35)',  icon:'ℹ', color:'#6366f1' }
    };
    const style = colors[type] || colors.info;
    const toast = document.createElement('div');
    toast.style.cssText = `
      display:flex;align-items:center;gap:10px;
      padding:12px 16px;
      background:${style.bg};
      border:1px solid ${style.border};
      border-radius:10px;
      font-family:var(--font-body);
      font-size:0.82rem;
      font-weight:500;
      color:var(--color-text-primary,#f0f2f5);
      box-shadow:0 4px 20px rgba(0,0,0,0.4);
      pointer-events:all;
      cursor:pointer;
      max-width:340px;
      animation:slideInToast 0.3s ease both;
      backdrop-filter:blur(8px);
    `;
    toast.innerHTML = `
      <span style="font-size:0.9rem;color:${style.color};flex-shrink:0">${style.icon}</span>
      <span style="flex:1;line-height:1.4">${message}</span>
      <span style="font-size:1rem;color:rgba(255,255,255,0.3);flex-shrink:0;margin-left:4px">×</span>
    `;
    toast.addEventListener('click', () => dismissToast(toast));
    getToastContainer().appendChild(toast);
    setTimeout(() => dismissToast(toast), duration);
    return toast;
  };

  function dismissToast(toast) {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateX(16px)';
    setTimeout(() => toast.remove(), 300);
  }

  // ── Intersection Observer — reveal on scroll ───────────
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
  }

  // ── Logo loader ────────────────────────────────────────
  function initLogoLoader() {
    const LOGO_URL = 'https://cdn.grapesjs.com/workspaces/cmjdh0oo603xm12grpuiruk7p/assets/f6b95b3d-49d1-4e77-b952-49ed80c4befa__image-9-14-1404-ap-at-8.42-pm.png';
    document.querySelectorAll('[data-sesmine-logo]').forEach(img => {
      if (!img.src || img.src === window.location.href) {
        img.src = LOGO_URL;
      }
      img.onerror = () => { img.style.display = 'none'; };
    });
  }

  // ── Dropdown toggle ────────────────────────────────────
  function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dd => {
      const trigger = dd.querySelector('[data-dropdown-trigger]') || dd.querySelector('button');
      if (!trigger) return;
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dd.classList.contains('open');
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        if (!isOpen) dd.classList.add('open');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    });
  }

  // ── Modal system ───────────────────────────────────────
  SESMine.openModal = function (id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  SESMine.closeModal = function (id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(o => {
          o.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });
  }

  // ── Tab system ─────────────────────────────────────────
  SESMine.initTabs = function (containerSelector) {
    const containers = document.querySelectorAll(containerSelector || '[data-tabs]');
    containers.forEach(container => {
      const buttons = container.querySelectorAll('.tab-btn');
      const panels  = container.querySelectorAll('.tab-panel');
      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          if (panels[i]) panels[i].classList.add('active');
        });
      });
    });
  };

  // ── Toggle switch ──────────────────────────────────────
  SESMine.initToggles = function () {
    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('on');
        const cb = toggle.dataset.onChange;
        if (cb && window[cb]) window[cb](toggle.classList.contains('on'), toggle);
      });
    });
  };

  // ── Ripple effect on buttons ───────────────────────────
  function initRipple() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect   = btn.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position:absolute;
          width:${size}px;height:${size}px;
          left:${e.clientX - rect.left - size/2}px;
          top:${e.clientY - rect.top - size/2}px;
          background:rgba(255,255,255,0.2);
          border-radius:50%;
          pointer-events:none;
          animation:ripple 0.5s ease-out forwards;
        `;
        if (getComputedStyle(btn).position === 'static') {
          btn.style.position = 'relative';
        }
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
      });
    });
  }

  // ── Smooth number counter ──────────────────────────────
  SESMine.animateCounter = function (el, target, duration = 1200, prefix = '', suffix = '') {
    const start    = 0;
    const startTime= performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress= Math.min(elapsed / duration, 1);
      const eased   = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  };

  // ── Copy to clipboard ──────────────────────────────────
  SESMine.copyToClipboard = function (text, successMsg = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text)
      .then(()  => SESMine.showToast(successMsg, 'success'))
      .catch(()  => SESMine.showToast('Copy failed — please copy manually.', 'error'));
  };

  // ── Format helpers ─────────────────────────────────────
  SESMine.formatCurrency = function (val, decimals = 0) {
    if (val >= 1e9) return '$' + (val/1e9).toFixed(2) + 'B';
    if (val >= 1e6) return '$' + (val/1e6).toFixed(1) + 'M';
    if (val >= 1e3) return '$' + (val/1e3).toFixed(decimals) + 'K';
    return '$' + val.toFixed(decimals);
  };

  SESMine.formatNumber = function (val) {
    return val.toLocaleString('en-AU');
  };

  SESMine.formatDate = function (date) {
    return new Date(date).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  SESMine.formatTime = function (date) {
    return new Date(date).toLocaleTimeString('en-AU', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // ── Debounce ───────────────────────────────────────────
  SESMine.debounce = function (fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  // ── Throttle ───────────────────────────────────────────
  SESMine.throttle = function (fn, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ── Local storage helpers ──────────────────────────────
  SESMine.store = {
    get:    (key, fallback = null) => {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set:    (key, val) => {
      try { localStorage.setItem(key, JSON.stringify(val)); return true; }
      catch { return false; }
    },
    remove: (key) => localStorage.removeItem(key),
    clear:  ()    => localStorage.clear()
  };

  // ── DOM ready init ─────────────────────────────────────
  function init() {
    initReveal();
    initLogoLoader();
    initDropdowns();
    initModals();
    initRipple();
    SESMine.initTabs();
    SESMine.initToggles();

    // Animate all .kpi-card__value numbers on load
    document.querySelectorAll('[data-count-to]').forEach(el => {
      const target = parseFloat(el.dataset.countTo);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (!isNaN(target)) SESMine.animateCounter(el, target, 1200, prefix, suffix);
    });

    // Auto-dismiss flash messages
    document.querySelectorAll('[data-autohide]').forEach(el => {
      const ms = parseInt(el.dataset.autohide) || 4000;
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity    = '0';
        setTimeout(() => el.remove(), 400);
      }, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

