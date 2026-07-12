/**
 * SESMine — config.js
 * Auth, session management, plan access control.
 * Must be loaded FIRST on every page.
 */
(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────
  const SESSION_KEY  = 'sesmine_session';
  const USERS_KEY    = 'sesmine_users';
  const VERSION      = '1.0.0';

  // ── Plan → hub access map ──────────────────────────────
  const HUB_ACCESS = {
    free: [
      'economics-hub'
    ],
    pro: [
      'economics-hub',
      'engineering-hub',
      'procurement-hub',
      'safety-hub',
      'sustainability-hub',
      'innovation-hub'
    ],
    enterprise: [
      'economics-hub',
      'engineering-hub',
      'procurement-hub',
      'safety-hub',
      'sustainability-hub',
      'innovation-hub'
    ],
    admin: [
      'economics-hub',
      'engineering-hub',
      'procurement-hub',
      'safety-hub',
      'sustainability-hub',
      'innovation-hub'
    ]
  };

  // ── Tool access map ────────────────────────────────────
  const TOOL_ACCESS = {
    free:       ['cost-calculator'],
    pro:        ['cost-calculator', 'ai-predictor', 'equipment-database'],
    enterprise: ['cost-calculator', 'ai-predictor', 'equipment-database'],
    admin:      ['cost-calculator', 'ai-predictor', 'equipment-database']
  };

  // ── Seed demo users (first run only) ──────────────────
  function seedUsers() {
    if (localStorage.getItem(USERS_KEY)) return;
    const users = [
      {
        userId:    'usr_admin_001',
        email:     'admin@sesmine.com',
        password:  'Admin123!',
        firstName: 'Alex',
        lastName:  'Morgan',
        company:   'SESMine Pty Ltd',
        role:      'admin',
        plan:      'enterprise',
        avatar:    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
        createdAt: '2025-01-01T00:00:00Z'
      },
      {
        userId:    'usr_pro_001',
        email:     'pro@sesmine.com',
        password:  'Pro123!',
        firstName: 'Sarah',
        lastName:  'Chen',
        company:   'BHP Group',
        role:      'user',
        plan:      'pro',
        avatar:    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
        createdAt: '2025-06-01T00:00:00Z'
      },
      {
        userId:    'usr_free_001',
        email:     'free@sesmine.com',
        password:  'Free123!',
        firstName: 'James',
        lastName:  'Wilson',
        company:   'Junior Mining Co.',
        role:      'user',
        plan:      'free',
        avatar:    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
        createdAt: '2026-01-15T00:00:00Z'
      },
      {
        userId:    'usr_ent_001',
        email:     'enterprise@sesmine.com',
        password:  'Ent123!',
        firstName: 'Priya',
        lastName:  'Patel',
        company:   'Rio Tinto',
        role:      'user',
        plan:      'enterprise',
        avatar:    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
        createdAt: '2025-09-01T00:00:00Z'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ── Session helpers ────────────────────────────────────
  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
               || localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setSession(user, remember = false) {
    const session = {
      userId:    user.userId,
      email:     user.email,
      firstName: user.firstName,
      lastName:  user.lastName,
      company:   user.company  || '',
      role:      user.role     || 'user',
      plan:      user.plan     || 'free',
      avatar:    user.avatar   || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName+'+'+user.lastName)}&background=f5a623&color=fff&size=80`,
      loginAt:   new Date().toISOString()
    };
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  // ── Auth API ───────────────────────────────────────────
  function isLoggedIn() {
    return !!getSession();
  }

  function requireAuth(redirectTo) {
    if (!isLoggedIn()) {
      const dest = redirectTo || window.location.pathname;
      window.location.href = '/auth/login.html?redirect=' + encodeURIComponent(dest);
      return false;
    }
    return true;
  }

  function requireAdmin() {
    if (!isLoggedIn()) {
      window.location.href = '/auth/login.html';
      return false;
    }
    const session = getSession();
    if (session.role !== 'admin') {
      window.location.href = '/dashboard/main-dashboard.html';
      return false;
    }
    return true;
  }

  function canAccessHub(hubSlug) {
    const session = getSession();
    if (!session) return false;
    if (session.role === 'admin') return true;
    const allowed = HUB_ACCESS[session.plan] || HUB_ACCESS.free;
    return allowed.includes(hubSlug);
  }

  function canAccessTool(toolSlug) {
    const session = getSession();
    if (!session) return false;
    if (session.role === 'admin') return true;
    const allowed = TOOL_ACCESS[session.plan] || TOOL_ACCESS.free;
    return allowed.includes(toolSlug);
  }

  function login(email, password, remember = false) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user  = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.password === password
    );
    if (!user) return { success: false, error: 'Invalid email or password.' };
    const session = setSession(user, remember);
    return { success: true, session };
  }

  function register(data) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (exists) return { success: false, error: 'An account with this email already exists.' };

    const newUser = {
      userId:    'usr_' + Date.now(),
      email:     data.email.trim().toLowerCase(),
      password:  data.password,
      firstName: data.firstName.trim(),
      lastName:  data.lastName.trim(),
      company:   (data.company || '').trim(),
      role:      'user',
      plan:      'free',
      avatar:    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName+'+'+data.lastName)}&background=f5a623&color=fff&size=80`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const session = setSession(newUser, false);
    return { success: true, session };
  }

  function logout() {
    clearSession();
    window.location.href = '/auth/login.html';
  }

  function updatePlan(plan) {
    const session = getSession();
    if (!session) return false;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx   = users.findIndex(u => u.userId === session.userId);
    if (idx === -1) return false;
    users[idx].plan = plan;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Refresh session
    setSession(users[idx], !!localStorage.getItem(SESSION_KEY));
    return true;
  }

  // ── Hub guard (called from hub pages) ─────────────────
  function requireHub(hubSlug) {
    if (!isLoggedIn()) {
      window.location.href = '/auth/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    if (!canAccessHub(hubSlug)) {
      window.location.href = '/pricing.html?hub=' + encodeURIComponent(hubSlug);
      return false;
    }
    return true;
  }

  // ── Expose public API ──────────────────────────────────
  window.SESMine = window.SESMine || {};
  Object.assign(window.SESMine, {
    version:      VERSION,
    getSession,
    isLoggedIn,
    requireAuth,
    requireAdmin,
    requireHub,
    canAccessHub,
    canAccessTool,
    login,
    register,
    logout,
    updatePlan,
    HUB_ACCESS,
    TOOL_ACCESS
  });

  // ── Boot ───────────────────────────────────────────────
  seedUsers();

})();
