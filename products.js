/* ===========================================
   TWINKLES BY ANJUM — products.js
   Static product catalogue. Zero backend.
   
   Product schema:
   {
     id:          number   — unique identifier
     name:        string   — display name
     price:       number   — price in PKR (₨)
     category:    string   — 'bracelets'|'charms'|'hair'|'anklets'|'gifts'
     description: string   — short one-line description
     tags:        string[] — for search matching
   }
=========================================== */

'use strict';

const STATIC_PRODUCTS_FALLBACK = [

  /* ── BEADED BRACELETS (7) ─────────────────────────────────── */
  {
    id: 1,
    name: 'Rose Quartz Dream',
    price: 450,
    category: 'bracelets',
    description: 'Soft pink rose quartz beads for dreamy everyday wear',
    tags: ['bracelet', 'rose', 'quartz', 'pink', 'dream']
  },
  {
    id: 2,
    name: 'Pastel Pearl Stack',
    price: 380,
    category: 'bracelets',
    description: 'A dainty multi-strand stack of pastel pearl beads',
    tags: ['bracelet', 'pearl', 'pastel', 'stack', 'multi']
  },
  {
    id: 3,
    name: 'Crystal Fairy',
    price: 520,
    category: 'bracelets',
    description: 'Iridescent AB-crystal beads that catch every light',
    tags: ['bracelet', 'crystal', 'fairy', 'iridescent', 'sparkle']
  },
  {
    id: 4,
    name: 'Sakura Blossom',
    price: 420,
    category: 'bracelets',
    description: 'Cherry-blossom pink beads inspired by spring',
    tags: ['bracelet', 'sakura', 'blossom', 'pink', 'spring']
  },
  {
    id: 5,
    name: 'Vintage Rose Beads',
    price: 490,
    category: 'bracelets',
    description: 'Classic vintage-style dusty rose bead bracelet',
    tags: ['bracelet', 'vintage', 'rose', 'classic', 'antique']
  },
  {
    id: 6,
    name: 'Strawberry Milk',
    price: 360,
    category: 'bracelets',
    description: 'Sweet strawberry milk–toned seed beads — so kawaii!',
    tags: ['bracelet', 'strawberry', 'milk', 'kawaii', 'cute']
  },
  {
    id: 7,
    name: 'Lavender Cloud',
    price: 440,
    category: 'bracelets',
    description: 'Soft lavender and white cloud-inspired bead blend',
    tags: ['bracelet', 'lavender', 'cloud', 'purple', 'soft']
  },

  /* ── PHONE CHARMS (7) ─────────────────────────────────────── */
  {
    id: 8,
    name: 'Butterfly Garden',
    price: 280,
    category: 'charms',
    description: 'Tiny resin butterflies strung on a beaded phone strap',
    tags: ['charm', 'phone', 'butterfly', 'colorful', 'garden', 'strap']
  },
  {
    id: 9,
    name: 'Starlight Pearl',
    price: 320,
    category: 'charms',
    description: 'Pearl beads with tiny golden star accent drops',
    tags: ['charm', 'phone', 'pearl', 'star', 'gold', 'starlight']
  },
  {
    id: 10,
    name: 'Cherry Blossom Drop',
    price: 290,
    category: 'charms',
    description: 'Delicate sakura charm with pink seed-bead loop',
    tags: ['charm', 'phone', 'cherry', 'blossom', 'sakura', 'drop']
  },
  {
    id: 11,
    name: 'Pink Teddy Strap',
    price: 350,
    category: 'charms',
    description: 'Adorable mini teddy bear dangling from a bead strap',
    tags: ['charm', 'phone', 'teddy', 'bear', 'pink', 'cute', 'kawaii']
  },
  {
    id: 12,
    name: 'Crystal Heart Strap',
    price: 310,
    category: 'charms',
    description: 'Crystal-clear heart pendant on a wrist-friendly loop',
    tags: ['charm', 'phone', 'crystal', 'heart', 'strap', 'clear']
  },
  {
    id: 13,
    name: 'Daisy Chain Charm',
    price: 265,
    category: 'charms',
    description: 'Tiny yellow daisy flowers beaded into a loop charm',
    tags: ['charm', 'phone', 'daisy', 'flower', 'chain', 'yellow']
  },
  {
    id: 14,
    name: 'Rainbow Beaded Strap',
    price: 340,
    category: 'charms',
    description: 'Vibrant ROYGBIV seed beads on a wrist-loop lanyard',
    tags: ['charm', 'phone', 'rainbow', 'beaded', 'colorful', 'lanyard']
  },

  /* ── HAIR ACCESSORIES (7) ─────────────────────────────────── */
  {
    id: 15,
    name: 'Ribbon Bow Clip',
    price: 180,
    category: 'hair',
    description: 'Oversized satin ribbon bow snap-clip — so cute',
    tags: ['hair', 'bow', 'ribbon', 'clip', 'snap', 'cute']
  },
  {
    id: 16,
    name: 'Pearl Hair Pin Set',
    price: 220,
    category: 'hair',
    description: 'Set of 4 dainty pearl-topped bobby pins',
    tags: ['hair', 'pearl', 'pin', 'set', 'bobby', 'dainty']
  },
  {
    id: 17,
    name: 'Beaded Scrunchie',
    price: 195,
    category: 'hair',
    description: 'Velvet scrunchie with a handmade seed-bead trim ring',
    tags: ['hair', 'scrunchie', 'beaded', 'velvet', 'handmade']
  },
  {
    id: 18,
    name: 'Floral Bobby Pins',
    price: 165,
    category: 'hair',
    description: 'Set of 6 miniature polymer clay flower bobby pins',
    tags: ['hair', 'floral', 'bobby', 'pins', 'flowers', 'clay']
  },
  {
    id: 19,
    name: 'Crystal Headband',
    price: 280,
    category: 'hair',
    description: 'Delicate crystal-embellished satin headband',
    tags: ['hair', 'crystal', 'headband', 'satin', 'elegant']
  },
  {
    id: 20,
    name: 'Vintage Barrette',
    price: 210,
    category: 'hair',
    description: 'French-twist barrette with pearl & gold accents',
    tags: ['hair', 'barrette', 'vintage', 'french', 'pearl', 'gold']
  },
  {
    id: 21,
    name: 'Twisted Pearl Band',
    price: 240,
    category: 'hair',
    description: 'Twisted rope headband with freshwater pearl detail',
    tags: ['hair', 'pearl', 'headband', 'twisted', 'rope', 'band']
  },

  /* ── ANKLETS (7) ──────────────────────────────────────────── */
  {
    id: 22,
    name: 'Dainty Pearl Anklet',
    price: 380,
    category: 'anklets',
    description: 'Single-strand freshwater pearl anklet, so elegant',
    tags: ['anklet', 'pearl', 'dainty', 'elegant', 'single']
  },
  {
    id: 23,
    name: 'Crystal Star Anklet',
    price: 420,
    category: 'anklets',
    description: 'Tiny crystal stars strung on a delicate silver chain',
    tags: ['anklet', 'crystal', 'star', 'silver', 'chain']
  },
  {
    id: 24,
    name: 'Butterfly Beads',
    price: 395,
    category: 'anklets',
    description: 'Colorful butterfly bead anklet — perfect for summer',
    tags: ['anklet', 'butterfly', 'beads', 'summer', 'colorful']
  },
  {
    id: 25,
    name: 'Shell & Bead Anklet',
    price: 350,
    category: 'anklets',
    description: 'Natural shell chips mixed with seed beads — boho chic',
    tags: ['anklet', 'shell', 'bead', 'natural', 'boho', 'beach']
  },
  {
    id: 26,
    name: 'Charm Bell Anklet',
    price: 410,
    category: 'anklets',
    description: 'Tiny golden bells and seed beads — jingle softly',
    tags: ['anklet', 'charm', 'bell', 'golden', 'jingle']
  },
  {
    id: 27,
    name: 'Pink Opal Anklet',
    price: 460,
    category: 'anklets',
    description: 'Precious pink opal beads on a shimmery single strand',
    tags: ['anklet', 'opal', 'pink', 'precious', 'shimmer']
  },
  {
    id: 28,
    name: 'Flower Power Anklet',
    price: 370,
    category: 'anklets',
    description: 'Resin daisy flower charms on a colorful beaded base',
    tags: ['anklet', 'flower', 'daisy', 'charm', 'cute', 'resin']
  },

  /* ── GIFT SETS (7) ────────────────────────────────────────── */
  {
    id: 29,
    name: 'Pink Dream Gift Box',
    price: 850,
    category: 'gifts',
    description: 'A curated box of our bestselling pink pieces',
    tags: ['gift', 'set', 'box', 'pink', 'dream', 'bestseller']
  },
  {
    id: 30,
    name: 'Bestie Bundle Set',
    price: 720,
    category: 'gifts',
    description: 'Matching bracelet & charm set for you and your bestie',
    tags: ['gift', 'bestie', 'matching', 'bundle', 'friends', 'pair']
  },
  {
    id: 31,
    name: 'Self-Love Kit',
    price: 980,
    category: 'gifts',
    description: 'Treat yourself — a sparkly self-love jewellery kit',
    tags: ['gift', 'self-love', 'kit', 'sparkle', 'treat', 'yourself']
  },
  {
    id: 32,
    name: 'Sparkle Collection Box',
    price: 1100,
    category: 'gifts',
    description: 'Premium crystal & pearl assortment in a ribbon gift box',
    tags: ['gift', 'sparkle', 'crystal', 'pearl', 'premium', 'ribbon']
  },
  {
    id: 33,
    name: 'Mini Charm Set',
    price: 650,
    category: 'gifts',
    description: '5 assorted mini phone charms in a velvet pouch',
    tags: ['gift', 'charm', 'mini', 'set', 'pouch', 'velvet']
  },
  {
    id: 34,
    name: 'Birthday Surprise Pack',
    price: 890,
    category: 'gifts',
    description: 'Curated birthday box: bracelet + charm + hair clip',
    tags: ['gift', 'birthday', 'surprise', 'pack', 'special', 'curated']
  },
  {
    id: 35,
    name: "Couple's Crystal Set",
    price: 1200,
    category: 'gifts',
    description: 'Matching crystal bracelets for two — perfectly paired',
    tags: ['gift', 'couple', 'crystal', 'matching', 'set', 'pair']
  }
];

/* Set the default source of truth to the static local fallback catalog */
let PRODUCTS = [...STATIC_PRODUCTS_FALLBACK];

/* ─── CATEGORY METADATA ──────────────────────────────────────────
   Used by the sidebar filter pills and the homepage category cards.
──────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',       label: 'All Items',         emoji: '✨', count: PRODUCTS.length },
  { id: 'bracelets', label: 'Beaded Bracelets',  emoji: '📿', count: 7 },
  { id: 'charms',    label: 'Phone Charms',      emoji: '📱', count: 7 },
  { id: 'hair',      label: 'Hair Accessories',  emoji: '🎀', count: 7 },
  { id: 'anklets',   label: 'Anklets',           emoji: '✦',  count: 7 },
  { id: 'gifts',     label: 'Gift Sets',         emoji: '🎁', count: 7 },
];

/* Expose globally so shop.js and inline scripts can access */
window.PRODUCTS   = PRODUCTS;
window.CATEGORIES = CATEGORIES;


