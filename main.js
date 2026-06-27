/* ===========================================
   TWINKLES BY ANJUM — main.js
   Shared across all 4 pages.
   
   Modules:
   1. Page Loader
   2. Page Transitions
   3. Navbar (scroll glass, hamburger, active link)
   4. Scroll Reveal (IntersectionObserver)
   5. Wishlist (localStorage, zero server contact)
=========================================== */

'use strict';


/* ─── 1. PAGE LOADER ─────────────────────────────────────────────
   A cute cream overlay with the brand logo that shows on every
   page load and fades away after ~900ms.
   It sits at z-index 9999 in CSS and gets the .hidden class
   (opacity:0 + visibility:hidden) added by JS.
──────────────────────────────────────────────────────────────── */
const initLoader = () => {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  /*
   * Wait for all assets to finish loading (window 'load').
   * Then wait an additional 900ms (minimum display time) so
   * the animation always plays — even on fast connections.
   */
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 900);
  });
};

/*
 * Manually trigger the loading screen for a set duration.
 * This simulates a "delay" or "processing time" for instant actions.
 */
window.triggerLoader = (duration = 600, callback) => {
  const loader = document.getElementById('pageLoader');
  if (!loader) {
    if (callback) callback();
    return;
  }

  // Show loader
  loader.classList.remove('hidden');

  // Wait half the duration, execute the callback (DOM updates), then wait the rest
  setTimeout(() => {
    if (callback) callback();
    
    setTimeout(() => {
      loader.classList.add('hidden');
    }, duration / 2);
  }, duration / 2);
};


/* ─── 2. PAGE TRANSITIONS ────────────────────────────────────────
   A light-pink overlay that fades in over 300ms before the
   browser navigates to a new internal page.
   The 'pageFadeIn' CSS animation on <body> handles the fade-in
   on the destination page — no extra JS needed there.
──────────────────────────────────────────────────────────────── */
const initPageTransitions = () => {
  const overlay = document.getElementById('transitionOverlay');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    /*
     * Skip links that should not trigger the transition:
     *  - Empty links / javascript actions
     *  - Fragment anchors (#section)
     *  - External URLs (http / https)
     *  - Email / telephone links
     *  - Links that open in new tabs (target="_blank")
     *  - Download links
     */
    if (
      !href ||
      href.trim() === '' ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      link.hasAttribute('download')
    ) {
      return;
    }

    link.addEventListener('click', (e) => {
      /* Don't intercept middle clicks, Cmd/Ctrl clicks, or Shift clicks */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
        return;
      }

      e.preventDefault();
      overlay.classList.add('active'); // fade the pink overlay in

      // Navigate after the CSS transition completes (300ms)
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
};


/* ─── 3. NAVBAR ──────────────────────────────────────────────────
   a) Scroll → adds .scrolled (frosted glass) after 20px
   b) Hamburger button → toggles mobile drawer + backdrop
   c) Active link → highlights the link matching the current page
──────────────────────────────────────────────────────────────── */
const initNavbar = () => {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const backdrop  = document.getElementById('navBackdrop');

  /* Dynamic Cart Button injection in navbar actions block */
  const actions = document.querySelector('.nav-actions');
  if (actions && !document.getElementById('cartBtn')) {
    const cartBtn = document.createElement('button');
    cartBtn.className = 'btn-cart-nav';
    cartBtn.id = 'cartBtn';
    cartBtn.setAttribute('aria-label', 'View shopping bag');
    cartBtn.innerHTML = `
      🛍️
      <span class="cart-badge" id="cartBadge" aria-live="polite"></span>
    `;
    const hamburgerBtn = document.getElementById('hamburger');
    if (hamburgerBtn) {
      actions.insertBefore(cartBtn, hamburgerBtn);
    } else {
      actions.appendChild(cartBtn);
    }
  }

  /* (a) Scroll glass effect */
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // apply immediately on load
  }

  /* (b) Mobile drawer toggle */
  const setDrawer = (open) => {
    hamburger?.classList.toggle('active', open);
    hamburger?.setAttribute('aria-expanded', String(open));
    mobileNav?.classList.toggle('open', open);
    backdrop?.classList.toggle('show', open);
    // Prevent body scroll while drawer is open
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger?.addEventListener('click', () => {
    setDrawer(!mobileNav?.classList.contains('open'));
  });

  backdrop?.addEventListener('click', () => setDrawer(false));

  // Close drawer when any mobile nav link is clicked
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setDrawer(false));
  });

  /* (c) Active link highlighting */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const linkFile = (link.getAttribute('href') || '').split('/').pop().split('?')[0];
    const isActive =
      linkFile === currentFile ||
      (currentFile === '' && linkFile === 'index.html');

    if (isActive) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
};


/* ─── 4. SCROLL REVEAL ───────────────────────────────────────────
   Observes every element with class .reveal.
   When it enters the viewport (12% visible), adds .visible
   which triggers the CSS opacity/transform transition.
   Elements are un-observed after their first reveal (animate once).
──────────────────────────────────────────────────────────────── */
const initScrollReveal = () => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once, then stop watching
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
};

/*
 * Re-exported for shop.js to call after it dynamically adds
 * product cards (which are not present at DOMContentLoaded).
 */
window.initScrollReveal = initScrollReveal;


/* ─── 5. WISHLIST ────────────────────────────────────────────────
   100% client-side. Stores an array of product IDs in localStorage.
   
   Security note:
     localStorage is origin-scoped and never leaves the browser.
     There is no server, no network call, no session, no cookie.
     A remote attacker has ZERO access to this data.
   
   Data structure:
     localStorage['tba_wishlist'] = JSON.stringify([1, 7, 12, ...])
──────────────────────────────────────────────────────────────── */
const Wishlist = (() => {
  const KEY = 'tba_wishlist'; // localStorage key

  /* Read the saved wishlist array (safe, returns [] on error) */
  const get = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  };

  /* Persist the wishlist array to localStorage */
  const save = (items) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      // Quota exceeded or private mode — fail silently
      console.warn('[Wishlist] Could not save to localStorage:', e.message);
    }
  };

  /*
   * Toggle a product in/out of the wishlist.
   * @param  {number} productId
   * @returns {boolean} true = added, false = removed
   */
  const toggle = (productId) => {
    const items = get();
    const idx   = items.indexOf(productId);
    const added = idx === -1;
    if (added) {
      items.push(productId);
    } else {
      items.splice(idx, 1);
    }
    save(items);
    updateBadge();
    return added;
  };

  /* Check if a product is currently wishlisted */
  const isWishlisted = (productId) => get().includes(productId);

  /* Sync the navbar badge number with localStorage */
  const updateBadge = () => {
    const count = get().length;
    const badge = document.getElementById('wishlistBadge');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  };

  return { get, toggle, isWishlisted, updateBadge };
})();

/* Make Wishlist available to other scripts (shop.js, inline) */
window.Wishlist = Wishlist;


/* ─── 5b. SHOPPING BAG (CART) MODULE ──────────────────────────────────
   Stores items in localStorage as [{ id: Number, quantity: Number }].
   Injects the slide-out Cart Drawer and navbar Cart Badge.
──────────────────────────────────────────────────────────────── */
const Cart = (() => {
  const KEY = 'tba_cart';

  const get = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  };

  const save = (items) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('[Cart] Save failed:', e.message);
    }
    updateBadge();
    renderDrawer();
  };

  const add = (productId) => {
    const items = get();
    const existing = items.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ id: productId, quantity: 1 });
    }
    save(items);
    toggleDrawer(true); // Auto-open drawer when item is added
  };

  const remove = (productId) => {
    const items = get().filter(item => item.id !== productId);
    save(items);
  };

  const updateQuantity = (productId, quantity) => {
    let items = get();
    const existing = items.find(item => item.id === productId);
    if (existing) {
      existing.quantity = Math.max(0, quantity);
      if (existing.quantity === 0) {
        items = items.filter(item => item.id !== productId);
      }
    }
    save(items);
  };

  const clear = () => save([]);

  const getCount = () => get().reduce((sum, item) => sum + item.quantity, 0);

  const getSubtotal = () => {
    const items = get();
    const catalog = window.PRODUCTS || [];
    return items.reduce((sum, item) => {
      const prod = catalog.find(p => p.id === item.id);
      return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);
  };

  const toggleDrawer = (open) => {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    backdrop?.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const updateBadge = () => {
    const count = getCount();
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  };

  const renderDrawer = () => {
    const listEl = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartSubtotalVal');
    if (!listEl) return;

    const items = get();
    const catalog = window.PRODUCTS || [];

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="cart-empty-state">
          <span class="cart-empty-emoji">🛍️</span>
          <p>Your bag is empty!</p>
          <a href="shop.html" class="btn-secondary" style="font-size: 0.72rem; padding: 8px 16px;">Shop Now ✨</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = 'Rs. 0';
      return;
    }

    listEl.innerHTML = items.map(item => {
      const prod = catalog.find(p => p.id === item.id);
      if (!prod) return '';

      // Set category emojis
      const emojis = { bracelets: '📿', charms: '📱', hair: '🎀', anklets: '✦', gifts: '🎁' };
      const emoji = emojis[prod.category] || '✨';

      return `
        <div class="cart-item" data-id="${prod.id}">
          <div class="cart-item-avatar">${emoji}</div>
          <div class="cart-item-info">
            <h4>${prod.name}</h4>
            <p>Rs. ${prod.price.toLocaleString()}</p>
            <div class="cart-qty-ctrl">
              <button class="qty-btn btn-qty-minus" data-id="${prod.id}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn btn-qty-plus" data-id="${prod.id}">+</button>
            </div>
          </div>
          <button class="btn-remove-item" data-id="${prod.id}" aria-label="Remove item">&times;</button>
        </div>
      `;
    }).join('');

    if (subtotalEl) {
      subtotalEl.textContent = 'Rs. ' + getSubtotal().toLocaleString();
    }

    // Attach listeners
    listEl.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const current = get().find(i => i.id === id)?.quantity || 0;
        updateQuantity(id, current - 1);
      });
    });

    listEl.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const current = get().find(i => i.id === id)?.quantity || 0;
        updateQuantity(id, current + 1);
      });
    });

    listEl.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        remove(id);
      });
    });
  };

  return { get, add, remove, updateQuantity, clear, getCount, getSubtotal, toggleDrawer, updateBadge, renderDrawer };
})();

window.Cart = Cart;

const initCartDrawer = () => {
  if (document.getElementById('cartDrawer')) return;

  const drawer = document.createElement('div');
  drawer.id = 'cartDrawer';
  drawer.className = 'cart-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-label', 'Shopping Bag');
  
  drawer.innerHTML = `
    <div class="cart-drawer-header">
      <h3>Shopping Bag 🛍️</h3>
      <button class="btn-close-cart" id="closeCartBtn" aria-label="Close shopping bag">&times;</button>
    </div>
    <div class="cart-drawer-body">
      <div class="cart-items-list" id="cartItemsList">
        <!-- Dynamically drawn items -->
      </div>
    </div>
    <div class="cart-drawer-footer">
      <div class="cart-subtotal-row">
        <span>Subtotal:</span>
        <span id="cartSubtotalVal">Rs. 0</span>
      </div>
      <p class="cart-shipping-note">Shipping calculated at checkout.</p>
      <a href="checkout.html" class="btn-primary btn-checkout-drawer" id="checkoutBtn" style="display: block; text-align: center; width: 100%;">Go to Checkout ✨</a>
    </div>
  `;
  document.body.appendChild(drawer);

  const backdrop = document.createElement('div');
  backdrop.id = 'cartBackdrop';
  backdrop.className = 'cart-backdrop';
  document.body.appendChild(backdrop);

  // Wire click events
  document.getElementById('cartBtn')?.addEventListener('click', () => Cart.toggleDrawer(true));
  document.getElementById('closeCartBtn')?.addEventListener('click', () => Cart.toggleDrawer(false));
  backdrop.addEventListener('click', () => Cart.toggleDrawer(false));
  
  // Render initial items (if any are saved in localStorage)
  Cart.renderDrawer();
};


/* ─── 6. COOKIE UTILITIES & CONSENT BANNER ────────────────────────
   Standard document.cookie API helpers to set/get cookies.
   Spawns a custom Cookie Consent banner if the user hasn't accepted yet.
──────────────────────────────────────────────────────────────── */
const Cookies = {
  set(name, value, days = 365) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
  },
  get(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
};

const initCookieConsent = () => {
  const COOKIE_NAME = 'tba_cookies_accepted';
  if (Cookies.get(COOKIE_NAME)) return;

  /* Dynamically inject the banner HTML to keep all 4 static pages clean */
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'Cookie Consent');
  banner.innerHTML = `
    <div class="cookie-content">
      <span class="cookie-emoji" aria-hidden="true">🍪</span>
      <div class="cookie-text">
        <strong>We use cookies!</strong> We use a tiny bit of cookie sweetness to make your shopping experience sparkle. Accept? ✨
      </div>
    </div>
    <div class="cookie-actions">
      <button class="cookie-btn-decline" id="declineCookies">No thanks</button>
      <button class="btn-primary cookie-btn-accept" id="acceptCookies">Yes, please! 💖</button>
    </div>
  `;
  document.body.appendChild(banner);

  /* Brief entrance delay after page load */
  setTimeout(() => {
    banner.classList.add('show');
  }, 1000);

  const acceptBtn  = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');

  acceptBtn?.addEventListener('click', () => {
    Cookies.set(COOKIE_NAME, 'true', 365);
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 500);
  });

  declineBtn?.addEventListener('click', () => {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 500);
  });
};


/* ─── BOOT ───────────────────────────────────────────────────────
   Initialise everything once the DOM is ready.
──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initPageTransitions();
  initNavbar();
  initScrollReveal();
  initCookieConsent();
  initCartDrawer();
  Wishlist.updateBadge();
  Cart.updateBadge();
});

