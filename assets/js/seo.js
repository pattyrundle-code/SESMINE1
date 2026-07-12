/**
 * SESMine — seo.js
 * Injects meta tags, OG tags, structured data and canonical URLs.
 * Load with defer on every page.
 */
(function () {
  'use strict';

  const BASE_URL    = 'https://sesmine.com';
  const LOGO_URL    = 'https://cdn.grapesjs.com/workspaces/cmjdh0oo603xm12grpuiruk7p/assets/f6b95b3d-49d1-4e77-b952-49ed80c4befa__image-9-14-1404-ap-at-8.42-pm.png';
  const DEFAULT_IMG = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80&fit=crop';

  // ── Page meta map ────────────────────────────────────────
  const PAGE_META = {
    'index.html': {
      title:       'SESMine — Mining Intelligence Platform',
      description: 'The all-in-one mining intelligence platform. Live commodity prices, AI CAPEX forecasting, 6 intelligence hubs for engineering, safety, sustainability and more.',
      keywords:    'mining software, CAPEX estimator, commodity prices, mining intelligence, ESG mining, mining analytics',
      image:       DEFAULT_IMG
    },
    'hub-preview.html': {
      title:       'Intelligence Hubs — SESMine',
      description: 'Six purpose-built intelligence hubs: Economics, Engineering, Procurement, Safety, Sustainability and Innovation — all in one platform.',
      keywords:    'mining hubs, economics hub, engineering hub, safety hub, sustainability hub',
      image:       DEFAULT_IMG
    },
    'pricing.html': {
      title:       'Pricing — SESMine',
      description: 'Simple, transparent pricing for SESMine. Free, Pro and Enterprise plans for mining professionals and teams.',
      keywords:    'SESMine pricing, mining software pricing, free mining tools',
      image:       DEFAULT_IMG
    },
    'resources.html': {
      title:       'Mining Resources & Guides — SESMine',
      description: 'Free mining industry guides, CAPEX benchmarks, technical papers and Excel templates from SESMine.',
      keywords:    'mining guides, CAPEX benchmark, mining templates, free mining resources',
      image:       DEFAULT_IMG
    },
    'news.html': {
      title:       'Mining Industry News — SESMine',
      description: 'Latest mining news, commodity market updates, technology developments and regulatory changes.',
      keywords:    'mining news, commodity prices, mining industry, copper gold lithium',
      image:       DEFAULT_IMG
    },
    'contact.html': {
      title:       'Contact — SESMine',
      description: 'Get in touch with the SESMine team for sales, support, partnerships and general enquiries.',
      keywords:    'SESMine contact, mining software support',
      image:       DEFAULT_IMG
    },
    'ai-predictor.html': {
      title:       'AI CAPEX Predictor — SESMine',
      description: 'AI-powered mining CAPEX estimation with ±3.2% accuracy. Trained on 2,400+ global projects.',
      keywords:    'mining CAPEX estimator, AI mining, capital cost estimation, mining feasibility',
      image:       'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80&fit=crop'
    }
  };

  // ── Helpers ──────────────────────────────────────────────
  function setMeta(name, content, property) {
    if (!content) return;
    const attr = property ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.rel = 'canonical';
      document.head.appendChild(el);
    }
    el.href = url;
  }

  function injectStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // ── Main init ────────────────────────────────────────────
  function init() {
    const path     = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const meta     = PAGE_META[filename] || PAGE_META['index.html'];
    const fullURL  = BASE_URL + path;

    // Standard meta
    setMeta('description',        meta.description);
    setMeta('keywords',           meta.keywords);
    setMeta('author',             'SESMine Pty Ltd');
    setMeta('robots',             'index, follow');
    setMeta('theme-color',        '#f5a623');
    setMeta('application-name',   'SESMine');

    // Open Graph
    setMeta('og:title',           meta.title,       true);
    setMeta('og:description',     meta.description, true);
    setMeta('og:image',           meta.image,       true);
    setMeta('og:url',             fullURL,          true);
    setMeta('og:type',            'website',        true);
    setMeta('og:site_name',       'SESMine',        true);
    setMeta('og:locale',          'en_AU',          true);

    // Twitter Card
    setMeta('twitter:card',       'summary_large_image');
    setMeta('twitter:title',      meta.title);
    setMeta('twitter:description',meta.description);
    setMeta('twitter:image',      meta.image);
    setMeta('twitter:site',       '@sesmine');

    // Canonical
    setCanonical(fullURL);

    // Update <title> if not already set well
    if (document.title === 'SESMine' || !document.title) {
      document.title = meta.title;
    }

    // Organisation structured data (homepage only)
    if (filename === 'index.html' || filename === '') {
      injectStructuredData({
        '@context':   'https://schema.org',
        '@type':      'SoftwareApplication',
        'name':       'SESMine',
        'url':        BASE_URL,
        'logo':       LOGO_URL,
        'description': meta.description,
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'description': 'Free plan available'
        },
        'publisher': {
          '@type':  'Organization',
          'name':   'SESMine Pty Ltd',
          'url':    BASE_URL,
          'logo':   LOGO_URL,
          'address': {
            '@type':           'PostalAddress',
            'addressLocality': 'Perth',
            'addressRegion':   'WA',
            'addressCountry':  'AU'
          }
        }
      });
    }

    // Breadcrumb structured data
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 0) {
      const items = [{ '@type':'ListItem', 'position':1, 'name':'Home', 'item': BASE_URL }];
      parts.forEach((part, i) => {
        items.push({
          '@type':    'ListItem',
          'position': i + 2,
          'name':     part.replace('.html','').replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()),
          'item':     BASE_URL + '/' + parts.slice(0, i+1).join('/')
        });
      });
      injectStructuredData({ '@context':'https://schema.org', '@type':'BreadcrumbList', 'itemListElement': items });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
