# Twinkles by Anjum — Website

A fully responsive, static frontend website for **Twinkles by Anjum** — handmade jewellery & accessories by Misbah Iqbal, Multan, Pakistan.

---

## 📁 File Structure

```
Tales By Anjum/
├── index.html          ← Home page
├── shop.html           ← Shop (35 products, filter, sort, search)
├── story.html          ← Our Story
├── contact.html        ← Contact Us (client-only form)
│
├── css/
│   └── style.css       ← Full design system (all pages)
│
├── js/
│   ├── main.js         ← Shared: loader, transitions, navbar, wishlist
│   ├── products.js     ← All 35 products + category metadata
│   └── shop.js         ← Shop page logic (filter / sort / search)
│
├── images/
│   └── logo.png        ← ⚠ ADD YOUR LOGO HERE (see below)
│
└── fonts/              ← Optional: add custom font files here
    ├── Avalanche.woff2
    ├── Avalanche.woff
    ├── Hinato.woff2
    └── Hinato.woff
```

---

## 🖼 Adding Your Logo

1. Save your **Twinkles by Anjum** logo image as `images/logo.png`
2. That's it — it will appear in the navbar, loader, and footer automatically.

---

## 🔤 Custom Fonts (Optional)

The site uses **Google Fonts** (Playfair Display + Nunito) as beautiful fallbacks.

To use the actual Avalanche & Hinato fonts:
1. Obtain the `.woff2` and `.woff` files for each font.
2. Place them in the `/fonts/` directory (create it if needed).
3. The `@font-face` rules in `css/style.css` are already configured to load them automatically.

---

## 🛒 Shop Categories

| Category          | Products |
|-------------------|----------|
| Beaded Bracelets  | 7        |
| Phone Charms      | 7        |
| Hair Accessories  | 7        |
| Anklets           | 7        |
| Gift Sets         | 7        |
| **Total**         | **35**   |

---

## 📸 Adding Product Photos

Product image placeholders are styled CSS boxes. To add real photos:

1. Add your image files to the `images/` folder.
2. In `js/shop.js` → `buildCard()` function, replace the `.product-img-placeholder` div with an `<img>` tag.
3. Do the same in the inline script in `index.html` for featured cards.

---

## 🔒 Security

- **100% static** — no server, no database, no backend.
- **No user data is ever transmitted** anywhere.
- The contact form saves locally to `localStorage` only.
- The wishlist saves locally to `localStorage` only.
- Safe to deploy on **Netlify**, **Vercel**, **GitHub Pages**, or **Hostbreak**.

---

## 🚀 Deployment (Netlify)

1. Go to [netlify.com](https://netlify.com) → **Add new site → Deploy manually**
2. Drag and drop the entire `Tales By Anjum` folder
3. Done! Your site is live. ✨

---

## ✨ Features

- ✅ Cute sparkle page loader on every page
- ✅ Smooth pink fade page transitions
- ✅ Frosted glass navbar (on scroll)
- ✅ Mobile hamburger drawer
- ✅ Hero section with morphing blob + floating beads
- ✅ Scroll-reveal animations (IntersectionObserver)
- ✅ Shop with sidebar category filters + search + sort
- ✅ 35 product cards with **postal stamp price badge**
- ✅ Per-card wishlist (localStorage)
- ✅ Category deep-link: `shop.html?cat=bracelets`
- ✅ Contact form with client-side validation
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ SEO meta tags on every page

---

Made with 💕 for Twinkles by Anjum
