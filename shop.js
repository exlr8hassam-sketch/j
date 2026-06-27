/* ===========================================
   TWINKLES BY ANJUM — shop.js
   Used ONLY on shop.html.
   
   Features:
   - Renders all 35 product cards dynamically
   - Filters by category (sidebar pills)
   - Sorts by price / name
   - Debounced search (name, description, tags)
   - Wishlist toggle per card
   - Deep-link support: shop.html?cat=bracelets
=========================================== */

'use strict';


/* ─── SHOP STATE ─────────────────────────────────────────────────
   Plain object — source of truth for current filters.
   Mutated by event handlers; renderProducts() reads it.
──────────────────────────────────────────────────────────────── */
const shopState = {
  activeCategory: 'all',   // currently selected category filter
  sortBy:         'default', // sort method key
  searchQuery:    '',        // live search string
};

/* Expose to window so the URL-param inline script can read it */
window.shopState = shopState;


/* ─── PLACEHOLDER CONFIG ─────────────────────────────────────────
   Maps each category to its placeholder gradient class and emoji.
   These style the empty image boxes until real photos are added.
──────────────────────────────────────────────────────────────── */
const PLACEHOLDER = {
  bracelets: { cls: 'placeholder-bracelets', emoji: '📿' },
  charms:    { cls: 'placeholder-charms',    emoji: '📱' },
  hair:      { cls: 'placeholder-hair',      emoji: '🎀' },
  anklets:   { cls: 'placeholder-anklets',   emoji: '✦'  },
  gifts:     { cls: 'placeholder-gifts',     emoji: '🎁' },
};


/* ─── HELPER: Get category label ─────────────────────────────────
   Looks up the human-readable label from CATEGORIES data.
──────────────────────────────────────────────────────────────── */
const getCategoryLabel = (catId) => {
  const cat = (window.CATEGORIES || []).find(c => c.id === catId);
  return cat ? cat.label : catId;
};


/* ─── FILTER & SORT ──────────────────────────────────────────────
   Returns a filtered + sorted slice of PRODUCTS[] based on
   the current shopState.  No mutation of the original array.
──────────────────────────────────────────────────────────────── */
const getFilteredProducts = () => {
  let items = [...(window.PRODUCTS || [])];

  /* 1. Category filter */
  if (shopState.activeCategory !== 'all') {
    items = items.filter(p => p.category === shopState.activeCategory);
  }

  /* 2. Search filter
        Matches against: product name, description, and all tags.
        Case-insensitive. */
  const q = shopState.searchQuery.trim().toLowerCase();
  if (q) {
    items = items.filter(p =>
      p.name.toLowerCase().includes(q)        ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  /* 3. Sort */
  switch (shopState.sortBy) {
    case 'price-asc':
      items.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      items.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      items.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      items.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // 'default' — preserve original array order (by id)
      break;
  }

  return items;
};


/* ─── BUILD CARD HTML ────────────────────────────────────────────
   Returns an HTML string for one product card.
   Called for every product in the filtered list.

   Card anatomy:
     ┌─────────────────────────────────┐
     │  [heart btn] [placeholder img]  │
     │                       [stamp]   │  ← overlaps top-right
     │  Product Name                   │
     │  Category Tag                   │
     │  [Order via DM ✨]              │
     └─────────────────────────────────┘
──────────────────────────────────────────────────────────────── */
const buildCard = (product) => {
  const cfg        = PLACEHOLDER[product.category] || PLACEHOLDER.bracelets;
  const wishlisted = window.Wishlist?.isWishlisted(product.id) ?? false;

  return /* html */`
    <article
      class="product-card reveal"
      data-product-id="${product.id}"
      data-category="${product.category}"
    >
      <!-- Image placeholder (swap src for real photo when ready) -->
      <div class="product-image-wrap">
        <div class="product-img-placeholder ${cfg.cls}" aria-label="${product.name} — photo coming soon">
          <span class="placeholder-icon" aria-hidden="true">${cfg.emoji}</span>
          <span class="placeholder-text">Photo Coming Soon</span>
        </div>

        <!-- Wishlist heart toggle -->
        <button
          class="btn-card-wishlist ${wishlisted ? 'wishlisted' : ''}"
          data-id="${product.id}"
          aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}: ${product.name}"
          title="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
        >${wishlisted ? '❤️' : '💕'}</button>
      </div>

      <!-- ✉ Postal-stamp price badge — overlaps top-right corner -->
      <div class="price-stamp" aria-label="Price: Rs. ${product.price}">
        <div class="stamp-inner">
          <span class="stamp-currency">Rs.</span>
          <span class="stamp-amount">${product.price.toLocaleString()}</span>
        </div>
      </div>

      <!-- Product info -->
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category-tag">${getCategoryLabel(product.category)}</p>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button
            type="button"
            class="btn-add-to-bag btn-order"
            data-id="${product.id}"
            aria-label="Add ${product.name} to Shopping Bag"
            style="margin-top:0;"
          >Add to Bag 🛍️</button>
          <a
            href="https://www.instagram.com/twinklesbyanjum"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-order btn-secondary-order"
            aria-label="Order ${product.name} via Instagram DM"
            style="margin-top:0; text-align:center; justify-content:center;"
          >Direct DM 💬</a>
        </div>
      </div>
    </article>
  `;
};


/* ─── RENDER PRODUCTS ────────────────────────────────────────────
   Clears the grid, inserts fresh cards, updates the count label,
   then re-runs scroll-reveal on the newly added elements.
──────────────────────────────────────────────────────────────── */
const renderProducts = () => {
  const grid     = document.getElementById('productsGrid');
  const countEl  = document.getElementById('resultsCount');
  if (!grid) return;

  const items = getFilteredProducts();

  /* Update "Showing X items" label */
  if (countEl) {
    countEl.innerHTML =
      `Showing <span>${items.length}</span> item${items.length !== 1 ? 's' : ''}`;
  }

  /* Empty state */
  if (items.length === 0) {
    grid.innerHTML = /* html */`
      <div class="empty-state">
        <span class="empty-icon">🔍</span>
        <h3>No items found</h3>
        <p>Try a different category or search term.</p>
      </div>
    `;
    return;
  }

  /* Render cards */
  grid.innerHTML = items.map(buildCard).join('');

  /* Re-attach wishlist listeners on newly rendered cards */
  grid.querySelectorAll('.btn-card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // don't bubble up to the card

      const id    = parseInt(btn.dataset.id, 10);
      const added = window.Wishlist?.toggle(id);

      btn.textContent = added ? '❤️' : '💕';
      btn.classList.toggle('wishlisted', !!added);
      btn.title = added ? 'Remove from wishlist' : 'Add to wishlist';
      btn.setAttribute('aria-label',
        `${added ? 'Remove from wishlist' : 'Add to wishlist'}: ${
          (window.PRODUCTS || []).find(p => p.id === id)?.name || ''
        }`
      );

      /* Small pop animation */
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 210);
    });
  });

  /* Re-attach add to bag listeners on newly rendered cards */
  grid.querySelectorAll('.btn-add-to-bag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      window.Cart?.add(id);
    });
  });

  /* Trigger scroll-reveal for new cards */
  if (typeof window.initScrollReveal === 'function') {
    window.initScrollReveal();
  }
};


/* ─── RENDER SIDEBAR CATEGORY PILLS ─────────────────────────────
   Builds the filter pills from CATEGORIES data and wires clicks.
──────────────────────────────────────────────────────────────── */
const renderSidebarFilters = () => {
  const container = document.getElementById('categoryFilters');
  if (!container || !window.CATEGORIES) return;

  container.innerHTML = window.CATEGORIES.map(cat => {
    /* Calculate dynamic count based on current PRODUCTS array */
    const count = cat.id === 'all'
      ? (window.PRODUCTS || []).length
      : (window.PRODUCTS || []).filter(p => p.category === cat.id).length;

    return /* html */`
      <button
        class="filter-pill ${cat.id === shopState.activeCategory ? 'active' : ''}"
        data-category="${cat.id}"
        aria-label="Filter by ${cat.label}"
        aria-pressed="${cat.id === shopState.activeCategory}"
      >
        <span class="pill-emoji" aria-hidden="true">${cat.emoji}</span>
        ${cat.label}
        <span class="pill-count">${count}</span>
      </button>
    `;
  }).join('');

  /* Click handler for each pill */
  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.category;
      shopState.activeCategory = cat;

      /* Update active state on all pills */
      container.querySelectorAll('.filter-pill').forEach(p => {
        const isActive = p.dataset.category === cat;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-pressed', String(isActive));
      });

      /* Simulate a loading delay when filtering */
      if (window.triggerLoader) {
        window.triggerLoader(400, () => renderProducts());
      } else {
        renderProducts();
      }
    });
  });
};


/* ─── SORT DROPDOWN ──────────────────────────────────────────── */
const initSort = () => {
  const select = document.getElementById('sortSelect');
  if (!select) return;

  select.addEventListener('change', () => {
    shopState.sortBy = select.value;
    
    /* Simulate a loading delay when sorting */
    if (window.triggerLoader) {
      window.triggerLoader(400, () => renderProducts());
    } else {
      renderProducts();
    }
  });
};


/* ─── DEBOUNCED SEARCH ───────────────────────────────────────── */
const initSearch = () => {
  const input = document.getElementById('shopSearch');
  if (!input) return;

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      shopState.searchQuery = input.value;
      renderProducts();
    }, 280); // 280ms debounce — fast enough to feel live
  });
};


/* ─── URL PARAM: ?cat= ───────────────────────────────────────────
   Reads the 'cat' query-string param and pre-selects that category.
   e.g., shop.html?cat=bracelets — opens with Bracelets selected.
──────────────────────────────────────────────────────────────── */
const applyURLParams = () => {
  const params = new URLSearchParams(window.location.search);
  const cat    = params.get('cat');

  if (cat && (window.CATEGORIES || []).some(c => c.id === cat)) {
    shopState.activeCategory = cat;
  }
};


/* ─── INIT ───────────────────────────────────────────────────────
   Entry point — called on DOMContentLoaded for shop.html.
──────────────────────────────────────────────────────────────── */
const initShop = () => {
  applyURLParams();        // must run before renderSidebarFilters
  renderSidebarFilters();  // build pills (respects pre-selected cat)
  renderProducts();        // render initial product grid
  initSort();              // wire sort dropdown
  initSearch();            // wire search input
};

document.addEventListener('DOMContentLoaded', initShop);
