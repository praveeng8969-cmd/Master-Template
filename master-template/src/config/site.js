/* ================================================================== */
/*  SITE CONFIGURATION — edit THIS ONE file to rebrand the store      */
/*  for ANY business: bike accessories, clothing, electronics, pets,  */
/*  cosmetics, furniture, groceries, sports, jewelry, books...        */
/*                                                                    */
/*  Changing the values below instantly transforms:                   */
/*   • Logo & store name              • Hero banner                   */
/*   • Primary / secondary colors     • Categories & products (JSON)  */
/*   • Contact details                • Social links                  */
/* ================================================================== */

export const siteConfig = {
  /* ---------------------------------------------------------------- */
  /*  Identity                                                         */
  /* ---------------------------------------------------------------- */
  storeName: 'VortexNova',
  tagline: 'Premium Lifestyle & Essentials',
  logoImage: null, // e.g. "/logo.png" — when null a styled text logo is rendered
  announcement: [
    'Complimentary shipping on orders over ₹99',
    'New season collection — up to 40% off',
    'Sign up for 10% off your first order',
  ],

  /* ---------------------------------------------------------------- */
  /*  Colors — RGB values (0-255). Use any combination.                */
  /* ---------------------------------------------------------------- */
  colors: {
    light: {
      primary: '10 10 10', //  brand color (buttons, links, accents)
      secondary: '115 115 115',
      accent: '10 10 10', //  highlight color (badges, hover states)
    },
    dark: {
      primary: '250 250 250',
      secondary: '163 163 163',
      accent: '250 250 250',
    },
  },

  /* ---------------------------------------------------------------- */
  /*  Currency & money                                                 */
  /* ---------------------------------------------------------------- */
  currency: 'INR', // ISO code used by Intl formatter (USD, EUR, INR, GBP...)
  taxRate: 0.08, // 8% tax applied at checkout
  freeShippingThreshold: 99, // free shipping above this subtotal
  shippingFee: 8, // flat shipping fee

  /* ---------------------------------------------------------------- */
  /*  Hero banner (also see src/data/banners.json)                     */
  /* ---------------------------------------------------------------- */
  hero: {
    headline: 'Timeless Pieces,\nCurated for You',
    subheadline:
      'Discover a thoughtfully curated collection of premium products — designed to elevate your everyday.',
    primaryCta: { label: 'Shop Collection', link: '/shop' },
    secondaryCta: { label: 'Explore Categories', link: '/categories' },
    stats: [
      { value: '50K+', label: 'Happy Customers' },
      { value: '120+', label: 'Premium Brands' },
      { value: '4.9★', label: 'Average Rating' },
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  Contact details                                                  */
  /* ---------------------------------------------------------------- */
  contact: {
    address: '128 Madison Avenue, Suite 400, New York, NY 10016',
    phone: '+1 (212) 555-0187',
    email: 'support@vortexnova.store',
    hours: 'Mon – Sat, 9:00 AM – 7:00 PM EST',
    whatsapp: '12125550187', // digits only, used for the floating button
    mapQuery: 'Madison Avenue New York',
  },

  /* ---------------------------------------------------------------- */
  /*  Social links                                                     */
  /* ---------------------------------------------------------------- */
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
    pinterest: 'https://pinterest.com',
  },

  /* ---------------------------------------------------------------- */
  /*  Copy blocks                                                      */
  /* ---------------------------------------------------------------- */
  about: {
    intro:
      'VortexNova was founded on a simple belief: everyday products should be extraordinary. We partner with independent makers and world-class brands to bring you a small, considered selection — nothing loud, nothing temporary, only pieces built to last.',
    mission:
      'To curate premium essentials that make everyday life feel a little more elevated — with honest pricing, sustainable sourcing and a shopping experience that feels effortless.',
    stats: [
      { value: '2016', label: 'Founded' },
      { value: '38', label: 'Countries served' },
      { value: '12', label: 'Design awards' },
      { value: '4.9/5', label: 'Customer rating' },
    ],
  },

  features: [
    { icon: 'Truck', title: 'Free Shipping', text: 'On all orders over ₹99' },
    { icon: 'RotateCcw', title: 'Easy Returns', text: '30-day money-back guarantee' },
    { icon: 'ShieldCheck', title: 'Secure Payment', text: '256-bit SSL checkout' },
    { icon: 'Headphones', title: '24/7 Support', text: 'Real humans, always on' },
  ],

  couponCodes: {
    WELCOME10: { type: 'percent', value: 10, label: '10% off your order' },
    SAVE20: { type: 'percent', value: 20, label: '20% off your order' },
    FREESHIP: { type: 'shipping', value: 0, label: 'Free shipping' },
  },

  // Dummy user shown in the avatar menu (no backend)
  user: {
    name: 'Alex Morgan',
    email: 'alex@example.com',
  },
}

/* Quick brand presets — copy one of these into `colors` above        */
/* to instantly restyle the whole store for a different business.     */
export const brandPresets = {
  // { primary, accent }  e.g. bike / sports: '#0A0A0A', '#D97706'
}
