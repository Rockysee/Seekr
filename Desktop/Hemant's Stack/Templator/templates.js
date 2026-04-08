/**
 * VibeStudio Template Database
 * Sources: HTML5 UP · Start Bootstrap · Creative Tim (free tier)
 * CDO Taxonomy aligned with VibeStudio CDO Landscape doc (Apr 2026)
 *
 * Schema:
 *   id          — unique int
 *   name        — display name
 *   style       — visual style tag (maps to STYLE_COLORS in canvas)
 *   type        — content category
 *   thumb       — preview image URL
 *   url         — live preview URL
 *   src         — source/author
 *   tags        — CDO taxonomy attributes (minimalist, bold, warm, tech-forward, etc.)
 *   cdo         — closest CDO match from landscape doc
 *   premium     — false = free
 *   responsive  — mobile-ready
 */

// ─────────────────────────────────────────────
// CDO → Style mapping reference
// minimalist   → Jony Ive, Katie Dill, Michael Bierut
// editorial    → Paula Scher, Michael Bierut
// creative     → Jessica Walsh, May-Li Khoe
// dark-luxury  → Eddie Opara
// bento-grid   → Matías Duarte
// glassmorphism→ Eddie Opara, Jessica Walsh
// corporate    → Katie Dill, Matías Duarte
// parallax     → Alex Schleifer
// fullscreen   → Jessica Walsh
// masonry      → Alex Schleifer
// sidebar      → Katie Dill
// horizontal-scroll → Matías Duarte
// ─────────────────────────────────────────────

export const STYLE_COLORS = {
  "minimalist":        "#64748b",
  "editorial":         "#8b5cf6",
  "creative":          "#ec4899",
  "dark-luxury":       "#1e293b",
  "bento-grid":        "#f59e0b",
  "masonry":           "#10b981",
  "fullscreen":        "#06b6d4",
  "glassmorphism":     "#6366f1",
  "parallax":          "#ef4444",
  "sidebar":           "#14b8a6",
  "horizontal-scroll": "#f97316",
  "corporate":         "#3b82f6",
  "coming-soon":       "#a855f7",
  "dashboard":         "#0ea5e9",
  "ecommerce":         "#22c55e",
  "agency":            "#f43f5e",
};

export const CDO_PROFILES = {
  "Jony Ive":        { attributes: ["minimalist", "craft-oriented", "luxurious"], color: "#f8fafc" },
  "Katie Dill":      { attributes: ["minimalist", "systematic", "corporate"],     color: "#3b82f6" },
  "Michael Bierut":  { attributes: ["minimalist", "systematic", "editorial"],     color: "#64748b" },
  "Paula Scher":     { attributes: ["editorial", "bold", "maximalist"],           color: "#8b5cf6" },
  "Jessica Walsh":   { attributes: ["creative", "bold", "maximalist", "playful"], color: "#ec4899" },
  "May-Li Khoe":     { attributes: ["creative", "playful", "accessible"],         color: "#06b6d4" },
  "Eddie Opara":     { attributes: ["dark-luxury", "tech-forward", "systematic"], color: "#6366f1" },
  "Matías Duarte":   { attributes: ["corporate", "systematic", "tech-forward"],   color: "#3b82f6" },
  "Alex Schleifer":  { attributes: ["warm", "parallax", "accessible"],            color: "#f59e0b" },
  "Virgil Abloh":    { attributes: ["creative", "accessible", "conceptual"],      color: "#f97316" },
};

// ─────────────────────────────────────────────
// TEMPLATE DATABASE
// ─────────────────────────────────────────────

export const TEMPLATES = [

  // ── HTML5 UP ── (ids 1–44) ──────────────────────────────────────────────────
  {
    id: 1, name: "Paradigm Shift", style: "minimalist", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/paradigm-shift.jpg",
    url: "https://html5up.net/paradigm-shift", src: "HTML5 UP",
    tags: ["minimalist", "craft-oriented"], cdo: "Jony Ive",
    premium: false, responsive: true,
  },
  {
    id: 2, name: "Massively", style: "editorial", type: "blog",
    thumb: "https://html5up.net/uploads/images/massively.jpg",
    url: "https://html5up.net/massively", src: "HTML5 UP",
    tags: ["editorial", "bold"], cdo: "Paula Scher",
    premium: false, responsive: true,
  },
  {
    id: 3, name: "Ethereal", style: "creative", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/ethereal.jpg",
    url: "https://html5up.net/ethereal", src: "HTML5 UP",
    tags: ["creative", "playful"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 4, name: "Story", style: "minimalist", type: "landing",
    thumb: "https://html5up.net/uploads/images/story.jpg",
    url: "https://html5up.net/story", src: "HTML5 UP",
    tags: ["minimalist", "warm"], cdo: "Jony Ive",
    premium: false, responsive: true,
  },
  {
    id: 5, name: "Dimension", style: "dark-luxury", type: "landing",
    thumb: "https://html5up.net/uploads/images/dimension.jpg",
    url: "https://html5up.net/dimension", src: "HTML5 UP",
    tags: ["dark-luxury", "tech-forward"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 6, name: "Editorial", style: "editorial", type: "blog",
    thumb: "https://html5up.net/uploads/images/editorial.jpg",
    url: "https://html5up.net/editorial", src: "HTML5 UP",
    tags: ["editorial", "bold"], cdo: "Paula Scher",
    premium: false, responsive: true,
  },
  {
    id: 7, name: "Forty", style: "bento-grid", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/forty.jpg",
    url: "https://html5up.net/forty", src: "HTML5 UP",
    tags: ["bento-grid", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 8, name: "Stellar", style: "minimalist", type: "landing",
    thumb: "https://html5up.net/uploads/images/stellar.jpg",
    url: "https://html5up.net/stellar", src: "HTML5 UP",
    tags: ["minimalist", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 9, name: "Multiverse", style: "masonry", type: "gallery",
    thumb: "https://html5up.net/uploads/images/multiverse.jpg",
    url: "https://html5up.net/multiverse", src: "HTML5 UP",
    tags: ["masonry", "warm"], cdo: "Alex Schleifer",
    premium: false, responsive: true,
  },
  {
    id: 10, name: "Phantom", style: "editorial", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/phantom.jpg",
    url: "https://html5up.net/phantom", src: "HTML5 UP",
    tags: ["editorial", "systematic"], cdo: "Michael Bierut",
    premium: false, responsive: true,
  },
  {
    id: 11, name: "Hyperspace", style: "dark-luxury", type: "landing",
    thumb: "https://html5up.net/uploads/images/hyperspace.jpg",
    url: "https://html5up.net/hyperspace", src: "HTML5 UP",
    tags: ["dark-luxury", "tech-forward"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 12, name: "Future Imperfect", style: "editorial", type: "blog",
    thumb: "https://html5up.net/uploads/images/future-imperfect.jpg",
    url: "https://html5up.net/future-imperfect", src: "HTML5 UP",
    tags: ["editorial", "bold"], cdo: "Paula Scher",
    premium: false, responsive: true,
  },
  {
    id: 13, name: "Solid State", style: "dark-luxury", type: "landing",
    thumb: "https://html5up.net/uploads/images/solid-state.jpg",
    url: "https://html5up.net/solid-state", src: "HTML5 UP",
    tags: ["dark-luxury", "tech-forward"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 14, name: "Lens", style: "fullscreen", type: "gallery",
    thumb: "https://html5up.net/uploads/images/lens.jpg",
    url: "https://html5up.net/lens", src: "HTML5 UP",
    tags: ["fullscreen", "bold"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 15, name: "Fractal", style: "glassmorphism", type: "landing",
    thumb: "https://html5up.net/uploads/images/fractal.jpg",
    url: "https://html5up.net/fractal", src: "HTML5 UP",
    tags: ["glassmorphism", "tech-forward"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 16, name: "Eventually", style: "minimalist", type: "coming-soon",
    thumb: "https://html5up.net/uploads/images/eventually.jpg",
    url: "https://html5up.net/eventually", src: "HTML5 UP",
    tags: ["minimalist", "coming-soon"], cdo: "Jony Ive",
    premium: false, responsive: true,
  },
  {
    id: 17, name: "Spectral", style: "parallax", type: "landing",
    thumb: "https://html5up.net/uploads/images/spectral.jpg",
    url: "https://html5up.net/spectral", src: "HTML5 UP",
    tags: ["parallax", "warm"], cdo: "Alex Schleifer",
    premium: false, responsive: true,
  },
  {
    id: 18, name: "Photon", style: "minimalist", type: "landing",
    thumb: "https://html5up.net/uploads/images/photon.jpg",
    url: "https://html5up.net/photon", src: "HTML5 UP",
    tags: ["minimalist", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 19, name: "Highlights", style: "creative", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/highlights.jpg",
    url: "https://html5up.net/highlights", src: "HTML5 UP",
    tags: ["creative", "playful"], cdo: "May-Li Khoe",
    premium: false, responsive: true,
  },
  {
    id: 20, name: "Landed", style: "parallax", type: "landing",
    thumb: "https://html5up.net/uploads/images/landed.jpg",
    url: "https://html5up.net/landed", src: "HTML5 UP",
    tags: ["parallax", "warm"], cdo: "Alex Schleifer",
    premium: false, responsive: true,
  },
  {
    id: 21, name: "Strata", style: "sidebar", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/strata.jpg",
    url: "https://html5up.net/strata", src: "HTML5 UP",
    tags: ["sidebar", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 22, name: "Read Only", style: "sidebar", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/read-only.jpg",
    url: "https://html5up.net/read-only", src: "HTML5 UP",
    tags: ["sidebar", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 23, name: "Alpha", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/alpha.jpg",
    url: "https://html5up.net/alpha", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 24, name: "Directive", style: "minimalist", type: "landing",
    thumb: "https://html5up.net/uploads/images/directive.jpg",
    url: "https://html5up.net/directive", src: "HTML5 UP",
    tags: ["minimalist", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 25, name: "Aerial", style: "fullscreen", type: "landing",
    thumb: "https://html5up.net/uploads/images/aerial.jpg",
    url: "https://html5up.net/aerial", src: "HTML5 UP",
    tags: ["fullscreen", "bold"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 26, name: "Twenty", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/twenty.jpg",
    url: "https://html5up.net/twenty", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 27, name: "Big Picture", style: "fullscreen", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/big-picture.jpg",
    url: "https://html5up.net/big-picture", src: "HTML5 UP",
    tags: ["fullscreen", "bold"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 28, name: "Tessellate", style: "fullscreen", type: "landing",
    thumb: "https://html5up.net/uploads/images/tessellate.jpg",
    url: "https://html5up.net/tessellate", src: "HTML5 UP",
    tags: ["fullscreen", "bold", "bento-grid"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 29, name: "Prologue", style: "sidebar", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/prologue.jpg",
    url: "https://html5up.net/prologue", src: "HTML5 UP",
    tags: ["sidebar", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 30, name: "Helios", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/helios.jpg",
    url: "https://html5up.net/helios", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 31, name: "Telephasic", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/telephasic.jpg",
    url: "https://html5up.net/telephasic", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 32, name: "Strongly Typed", style: "editorial", type: "blog",
    thumb: "https://html5up.net/uploads/images/strongly-typed.jpg",
    url: "https://html5up.net/strongly-typed", src: "HTML5 UP",
    tags: ["editorial", "minimalist"], cdo: "Michael Bierut",
    premium: false, responsive: true,
  },
  {
    id: 33, name: "Parallelism", style: "horizontal-scroll", type: "gallery",
    thumb: "https://html5up.net/uploads/images/parallelism.jpg",
    url: "https://html5up.net/parallelism", src: "HTML5 UP",
    tags: ["horizontal-scroll", "tech-forward"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 34, name: "Escape Velocity", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/escape-velocity.jpg",
    url: "https://html5up.net/escape-velocity", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 35, name: "Astral", style: "minimalist", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/astral.jpg",
    url: "https://html5up.net/astral", src: "HTML5 UP",
    tags: ["minimalist", "craft-oriented"], cdo: "Jony Ive",
    premium: false, responsive: true,
  },
  {
    id: 36, name: "Striped", style: "minimalist", type: "landing",
    thumb: "https://html5up.net/uploads/images/striped.jpg",
    url: "https://html5up.net/striped", src: "HTML5 UP",
    tags: ["minimalist", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 37, name: "Dopetrope", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/dopetrope.jpg",
    url: "https://html5up.net/dopetrope", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 38, name: "Miniport", style: "minimalist", type: "portfolio",
    thumb: "https://html5up.net/uploads/images/miniport.jpg",
    url: "https://html5up.net/miniport", src: "HTML5 UP",
    tags: ["minimalist", "systematic"], cdo: "Michael Bierut",
    premium: false, responsive: true,
  },
  {
    id: 39, name: "TXT", style: "editorial", type: "blog",
    thumb: "https://html5up.net/uploads/images/txt.jpg",
    url: "https://html5up.net/txt", src: "HTML5 UP",
    tags: ["editorial", "bold"], cdo: "Paula Scher",
    premium: false, responsive: true,
  },
  {
    id: 40, name: "Verti", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/verti.jpg",
    url: "https://html5up.net/verti", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 41, name: "Zerofour", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/zerofour.jpg",
    url: "https://html5up.net/zerofour", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 42, name: "Arcana", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/arcana.jpg",
    url: "https://html5up.net/arcana", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 43, name: "Halcyonic", style: "corporate", type: "business",
    thumb: "https://html5up.net/uploads/images/halcyonic.jpg",
    url: "https://html5up.net/halcyonic", src: "HTML5 UP",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 44, name: "Minimaxing", style: "minimalist", type: "landing",
    thumb: "https://html5up.net/uploads/images/minimaxing.jpg",
    url: "https://html5up.net/minimaxing", src: "HTML5 UP",
    tags: ["minimalist", "systematic"], cdo: "Jony Ive",
    premium: false, responsive: true,
  },

  // ── Start Bootstrap ── (ids 101–120) ────────────────────────────────────────
  {
    id: 101, name: "Agency", style: "agency", type: "agency",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/agency.jpg",
    url: "https://startbootstrap.com/theme/agency", src: "Start Bootstrap",
    tags: ["creative", "bold", "warm"], cdo: "Alex Schleifer",
    premium: false, responsive: true,
  },
  {
    id: 102, name: "Clean Blog", style: "minimalist", type: "blog",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/clean-blog.jpg",
    url: "https://startbootstrap.com/theme/clean-blog", src: "Start Bootstrap",
    tags: ["minimalist", "editorial"], cdo: "Michael Bierut",
    premium: false, responsive: true,
  },
  {
    id: 103, name: "Creative", style: "creative", type: "portfolio",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/creative.jpg",
    url: "https://startbootstrap.com/theme/creative", src: "Start Bootstrap",
    tags: ["creative", "fullscreen", "bold"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 104, name: "Freelancer", style: "minimalist", type: "portfolio",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/freelancer.jpg",
    url: "https://startbootstrap.com/theme/freelancer", src: "Start Bootstrap",
    tags: ["minimalist", "warm"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 105, name: "Grayscale", style: "dark-luxury", type: "landing",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/grayscale.jpg",
    url: "https://startbootstrap.com/theme/grayscale", src: "Start Bootstrap",
    tags: ["dark-luxury", "minimalist", "parallax"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 106, name: "Landing Page", style: "corporate", type: "landing",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/landing-page.jpg",
    url: "https://startbootstrap.com/theme/landing-page", src: "Start Bootstrap",
    tags: ["corporate", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 107, name: "New Age", style: "glassmorphism", type: "landing",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/new-age.jpg",
    url: "https://startbootstrap.com/theme/new-age", src: "Start Bootstrap",
    tags: ["glassmorphism", "tech-forward"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 108, name: "One Page Wonder", style: "fullscreen", type: "landing",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/one-page-wonder.jpg",
    url: "https://startbootstrap.com/theme/one-page-wonder", src: "Start Bootstrap",
    tags: ["fullscreen", "bold", "creative"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 109, name: "Resume", style: "sidebar", type: "portfolio",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/resume.jpg",
    url: "https://startbootstrap.com/theme/resume", src: "Start Bootstrap",
    tags: ["sidebar", "minimalist", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 110, name: "SB Admin 2", style: "dashboard", type: "dashboard",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/sb-admin-2.jpg",
    url: "https://startbootstrap.com/theme/sb-admin-2", src: "Start Bootstrap",
    tags: ["corporate", "systematic", "dashboard"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 111, name: "Stylish Portfolio", style: "creative", type: "portfolio",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/stylish-portfolio.jpg",
    url: "https://startbootstrap.com/theme/stylish-portfolio", src: "Start Bootstrap",
    tags: ["creative", "sidebar", "bold"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 112, name: "Coming Soon", style: "coming-soon", type: "coming-soon",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/coming-soon.jpg",
    url: "https://startbootstrap.com/theme/coming-soon", src: "Start Bootstrap",
    tags: ["minimalist", "coming-soon"], cdo: "Jony Ive",
    premium: false, responsive: true,
  },
  {
    id: 113, name: "Business Frontpage", style: "corporate", type: "business",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/business-frontpage.jpg",
    url: "https://startbootstrap.com/template/business-frontpage", src: "Start Bootstrap",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 114, name: "Scrolling Nav", style: "minimalist", type: "landing",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/scrolling-nav.jpg",
    url: "https://startbootstrap.com/template/scrolling-nav", src: "Start Bootstrap",
    tags: ["minimalist", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 115, name: "Modern Business", style: "corporate", type: "business",
    thumb: "https://assets.startbootstrap.com/img/screenshots/themes/modern-business.jpg",
    url: "https://startbootstrap.com/template/modern-business", src: "Start Bootstrap",
    tags: ["corporate", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 116, name: "Shop Homepage", style: "ecommerce", type: "ecommerce",
    thumb: "https://assets.startbootstrap.com/img/screenshots/templates/shop-homepage.jpg",
    url: "https://startbootstrap.com/template/shop-homepage", src: "Start Bootstrap",
    tags: ["corporate", "systematic", "ecommerce"], cdo: "Alex Schleifer",
    premium: false, responsive: true,
  },
  {
    id: 117, name: "Heroic Features", style: "corporate", type: "landing",
    thumb: "https://assets.startbootstrap.com/img/screenshots/templates/heroic-features.jpg",
    url: "https://startbootstrap.com/template/heroic-features", src: "Start Bootstrap",
    tags: ["corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 118, name: "Blog Home", style: "editorial", type: "blog",
    thumb: "https://assets.startbootstrap.com/img/screenshots/templates/blog-home.jpg",
    url: "https://startbootstrap.com/template/blog-home", src: "Start Bootstrap",
    tags: ["editorial", "minimalist"], cdo: "Michael Bierut",
    premium: false, responsive: true,
  },
  {
    id: 119, name: "Portfolio Item", style: "minimalist", type: "portfolio",
    thumb: "https://assets.startbootstrap.com/img/screenshots/templates/portfolio-item.jpg",
    url: "https://startbootstrap.com/template/portfolio-item", src: "Start Bootstrap",
    tags: ["minimalist", "systematic"], cdo: "Michael Bierut",
    premium: false, responsive: true,
  },
  {
    id: 120, name: "Simple Sidebar", style: "sidebar", type: "business",
    thumb: "https://assets.startbootstrap.com/img/screenshots/templates/simple-sidebar.jpg",
    url: "https://startbootstrap.com/template/simple-sidebar", src: "Start Bootstrap",
    tags: ["sidebar", "minimalist"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },

  // ── Creative Tim (Free Tier) ── (ids 201–215) ─────────────────────────────
  {
    id: 201, name: "Paper Dashboard", style: "dashboard", type: "dashboard",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/paper-dashboard/paper-dashboard.jpg",
    url: "https://www.creative-tim.com/product/paper-dashboard", src: "Creative Tim",
    tags: ["corporate", "minimalist", "dashboard"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 202, name: "Light Bootstrap Dashboard 2", style: "dashboard", type: "dashboard",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/light-bootstrap-dashboard/light-bootstrap-dashboard.jpg",
    url: "https://www.creative-tim.com/product/light-bootstrap-dashboard", src: "Creative Tim",
    tags: ["corporate", "systematic", "dashboard"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 203, name: "Now UI Kit", style: "glassmorphism", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/now-ui-kit/now-ui-kit.jpg",
    url: "https://www.creative-tim.com/product/now-ui-kit", src: "Creative Tim",
    tags: ["glassmorphism", "minimalist", "tech-forward"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 204, name: "Black Dashboard", style: "dark-luxury", type: "dashboard",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/black-dashboard/black-dashboard.jpg",
    url: "https://www.creative-tim.com/product/black-dashboard", src: "Creative Tim",
    tags: ["dark-luxury", "tech-forward", "dashboard"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 205, name: "Argon Design System", style: "glassmorphism", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-design-system/argon-design-system.jpg",
    url: "https://www.creative-tim.com/product/argon-design-system", src: "Creative Tim",
    tags: ["glassmorphism", "corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 206, name: "Vue Material Kit", style: "creative", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/vue-material-kit/vue-material-kit.jpg",
    url: "https://www.creative-tim.com/product/vue-material-kit", src: "Creative Tim",
    tags: ["creative", "corporate", "systematic"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 207, name: "BLK Design System", style: "dark-luxury", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/blk-design-system/blk-design-system.jpg",
    url: "https://www.creative-tim.com/product/blk-design-system", src: "Creative Tim",
    tags: ["dark-luxury", "tech-forward", "glassmorphism"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },
  {
    id: 208, name: "Soft UI Design System", style: "glassmorphism", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/soft-ui-design-system.jpg",
    url: "https://www.creative-tim.com/product/soft-ui-design-system", src: "Creative Tim",
    tags: ["glassmorphism", "minimalist", "craft-oriented"], cdo: "Jony Ive",
    premium: false, responsive: true,
  },
  {
    id: 209, name: "Material Dashboard", style: "dashboard", type: "dashboard",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard/material-dashboard.jpg",
    url: "https://www.creative-tim.com/product/material-dashboard", src: "Creative Tim",
    tags: ["corporate", "systematic", "dashboard", "tech-forward"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 210, name: "Pixel UI Kit", style: "creative", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/pixel-ui-kit/pixel-ui-kit.jpg",
    url: "https://www.creative-tim.com/product/pixel-ui-kit", src: "Creative Tim",
    tags: ["creative", "bold", "playful"], cdo: "Jessica Walsh",
    premium: false, responsive: true,
  },
  {
    id: 211, name: "Tailwind Starter Kit", style: "minimalist", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/tailwind-starter-kit/tailwind-starter-kit.jpg",
    url: "https://www.creative-tim.com/learning-lab/tailwind-starter-kit/presentation", src: "Creative Tim",
    tags: ["minimalist", "corporate", "systematic"], cdo: "Katie Dill",
    premium: false, responsive: true,
  },
  {
    id: 212, name: "Notus JS", style: "glassmorphism", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/notus-js/notus-js.jpg",
    url: "https://www.creative-tim.com/product/notus-js", src: "Creative Tim",
    tags: ["glassmorphism", "corporate"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 213, name: "Vue Notus", style: "glassmorphism", type: "dashboard",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/vue-notus/vue-notus.jpg",
    url: "https://www.creative-tim.com/product/vue-notus", src: "Creative Tim",
    tags: ["glassmorphism", "corporate", "dashboard"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 214, name: "Material Kit", style: "creative", type: "landing",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-kit/material-kit.jpg",
    url: "https://www.creative-tim.com/product/material-kit", src: "Creative Tim",
    tags: ["creative", "corporate", "tech-forward"], cdo: "Matías Duarte",
    premium: false, responsive: true,
  },
  {
    id: 215, name: "Purity UI Dashboard", style: "glassmorphism", type: "dashboard",
    thumb: "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/purity-ui-dashboard/purity-ui-dashboard.jpg",
    url: "https://www.creative-tim.com/product/purity-ui-dashboard", src: "Creative Tim",
    tags: ["glassmorphism", "dark-luxury", "dashboard"], cdo: "Eddie Opara",
    premium: false, responsive: true,
  },

];

// ─────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────

/** All unique style values */
export const STYLES = [...new Set(TEMPLATES.map(t => t.style))].sort();

/** All unique type values */
export const TYPES = [...new Set(TEMPLATES.map(t => t.type))].sort();

/** All unique source values */
export const SOURCES = [...new Set(TEMPLATES.map(t => t.src))].sort();

/** All unique CDO values */
export const CDOS = [...new Set(TEMPLATES.map(t => t.cdo))].sort();

/** All unique tag values */
export const TAGS = [...new Set(TEMPLATES.flatMap(t => t.tags))].sort();

/**
 * Filter templates by any combination of style, type, src, cdo, tag, or search string.
 * @param {Object} filters
 * @param {string} [filters.search]  - matches name or style
 * @param {string} [filters.style]   - exact style match
 * @param {string} [filters.type]    - exact type match
 * @param {string} [filters.src]     - exact source match
 * @param {string} [filters.cdo]     - exact CDO match
 * @param {string} [filters.tag]     - tag must be included in tags[]
 * @param {boolean} [filters.premiumOnly] - filter to premium only
 */
export function filterTemplates({ search = "", style = "all", type = "all", src = "all", cdo = "all", tag = "all", premiumOnly = false } = {}) {
  return TEMPLATES.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.style.includes(q) && !t.tags.some(g => g.includes(q))) return false;
    }
    if (style !== "all" && t.style !== style) return false;
    if (type !== "all" && t.type !== type) return false;
    if (src !== "all" && t.src !== src) return false;
    if (cdo !== "all" && t.cdo !== cdo) return false;
    if (tag !== "all" && !t.tags.includes(tag)) return false;
    if (premiumOnly && !t.premium) return false;
    return true;
  });
}

/**
 * Get templates similar to a given template (same style or overlapping tags).
 * @param {number} id - template id
 * @param {number} [limit=6]
 */
export function getSimilar(id, limit = 6) {
  const base = TEMPLATES.find(t => t.id === id);
  if (!base) return [];
  return TEMPLATES
    .filter(t => t.id !== id)
    .map(t => ({
      ...t,
      score: (t.style === base.style ? 2 : 0) + t.tags.filter(g => base.tags.includes(g)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get templates by CDO name.
 * @param {string} cdoName
 */
export function getByCDO(cdoName) {
  return TEMPLATES.filter(t => t.cdo === cdoName);
}

// ─────────────────────────────────────────────
// STYLE BLENDER
// ─────────────────────────────────────────────

/**
 * Named style blend presets.
 * Each blend has a name, ratio (0 = full styleA, 1 = full styleB),
 * a description, and a CDO pairing that inspired it.
 */
export const STYLE_BLENDS = {
  "midnight-minimal": {
    name: "Midnight Minimal",
    styleA: "minimalist",
    styleB: "dark-luxury",
    ratio: 0.5,
    description: "Stripped-back forms inside deep dark canvases. Precision meets atmosphere.",
    cdoPairing: ["Jony Ive", "Eddie Opara"],
    accent: "#6366f1",
  },
  "crystal-editorial": {
    name: "Crystal Editorial",
    styleA: "editorial",
    styleB: "glassmorphism",
    ratio: 0.45,
    description: "Bold typographic hierarchy frosted behind translucent layers.",
    cdoPairing: ["Paula Scher", "Eddie Opara"],
    accent: "#8b5cf6",
  },
  "neon-luxe": {
    name: "Neon Luxe",
    styleA: "creative",
    styleB: "dark-luxury",
    ratio: 0.6,
    description: "Vivid saturated color pushed into a premium dark environment.",
    cdoPairing: ["Jessica Walsh", "Eddie Opara"],
    accent: "#ec4899",
  },
  "type-zero": {
    name: "Type Zero",
    styleA: "editorial",
    styleB: "minimalist",
    ratio: 0.5,
    description: "Typography as the sole design element. No decoration, pure rhythm.",
    cdoPairing: ["Paula Scher", "Michael Bierut"],
    accent: "#94a3b8",
  },
  "frost-corp": {
    name: "Frost Corp",
    styleA: "corporate",
    styleB: "glassmorphism",
    ratio: 0.4,
    description: "Enterprise UI with frosted glass surfaces and soft depth.",
    cdoPairing: ["Katie Dill", "Eddie Opara"],
    accent: "#06b6d4",
  },
  "warm-grid": {
    name: "Warm Grid",
    styleA: "bento-grid",
    styleB: "masonry",
    ratio: 0.5,
    description: "Structured bento blocks loosened into an organic, photo-rich masonry flow.",
    cdoPairing: ["Matías Duarte", "Alex Schleifer"],
    accent: "#f59e0b",
  },
  "immersive": {
    name: "Immersive",
    styleA: "fullscreen",
    styleB: "parallax",
    ratio: 0.5,
    description: "Edge-to-edge visuals with depth scrolling. The canvas disappears.",
    cdoPairing: ["Jessica Walsh", "Alex Schleifer"],
    accent: "#ef4444",
  },
  "dark-grid": {
    name: "Dark Grid",
    styleA: "bento-grid",
    styleB: "dark-luxury",
    ratio: 0.55,
    description: "Systematic grid layout submerged in a dark premium aesthetic.",
    cdoPairing: ["Matías Duarte", "Eddie Opara"],
    accent: "#334155",
  },
  "frosted-minimal": {
    name: "Frosted Minimal",
    styleA: "minimalist",
    styleB: "glassmorphism",
    ratio: 0.4,
    description: "White-space minimalism glazed with soft glass panels and blur.",
    cdoPairing: ["Jony Ive", "Eddie Opara"],
    accent: "#a5b4fc",
  },
  "executive-dark": {
    name: "Executive Dark",
    styleA: "corporate",
    styleB: "dark-luxury",
    ratio: 0.45,
    description: "B2B serious tone meets dark-mode luxury. Data-dense but atmospheric.",
    cdoPairing: ["Katie Dill", "Eddie Opara"],
    accent: "#1e40af",
  },
  "bold-press": {
    name: "Bold Press",
    styleA: "creative",
    styleB: "editorial",
    ratio: 0.5,
    description: "Magazine-grade type meets provocative art direction.",
    cdoPairing: ["Jessica Walsh", "Paula Scher"],
    accent: "#f43f5e",
  },
  "focused-sidebar": {
    name: "Focused Sidebar",
    styleA: "sidebar",
    styleB: "minimalist",
    ratio: 0.4,
    description: "Persistent navigation rail anchoring an uncluttered content canvas.",
    cdoPairing: ["Katie Dill", "Michael Bierut"],
    accent: "#14b8a6",
  },
  "vivid-frost": {
    name: "Vivid Frost",
    styleA: "creative",
    styleB: "glassmorphism",
    ratio: 0.55,
    description: "Saturated color fields viewed through layers of glass blur.",
    cdoPairing: ["Jessica Walsh", "Eddie Opara"],
    accent: "#a855f7",
  },
  "brand-press": {
    name: "Brand Press",
    styleA: "editorial",
    styleB: "corporate",
    ratio: 0.45,
    description: "Editorial rhythm applied to corporate content architecture.",
    cdoPairing: ["Michael Bierut", "Katie Dill"],
    accent: "#3b82f6",
  },
  "warm-parallax": {
    name: "Warm Parallax",
    styleA: "parallax",
    styleB: "masonry",
    ratio: 0.5,
    description: "Scrolling depth layered over a human, photography-forward mosaic.",
    cdoPairing: ["Alex Schleifer", "Alex Schleifer"],
    accent: "#f97316",
  },
};

/**
 * Build a tag-weight map from a style string.
 * Aggregates all tags from templates with that style.
 * @param {string} style
 * @returns {Object} { tagName: weight }
 */
function styleTagWeights(style) {
  const weights = {};
  TEMPLATES.filter(t => t.style === style).forEach(t => {
    t.tags.forEach(tag => { weights[tag] = (weights[tag] || 0) + 1; });
  });
  return weights;
}

/**
 * Blend two styles and return ranked templates.
 *
 * Scoring per template:
 *   - Each tag match in styleA's weight map  → +weight * (1 - ratio)
 *   - Each tag match in styleB's weight map  → +weight * ratio
 *   - Direct style match styleA              → +3 * (1 - ratio)
 *   - Direct style match styleB              → +3 * ratio
 *   - Same CDO as styleA's dominant CDO      → +1
 *
 * @param {string} styleA
 * @param {string} styleB
 * @param {number} ratio   0 = pure styleA, 1 = pure styleB, 0.5 = even blend
 * @param {number} limit
 * @returns {Array} templates with added `blendScore` and `blendRationale`
 */
export function blendStyles(styleA, styleB, ratio = 0.5, limit = 12) {
  const weightsA = styleTagWeights(styleA);
  const weightsB = styleTagWeights(styleB);

  return TEMPLATES
    .map(t => {
      let score = 0;
      const rationale = [];

      // Direct style match bonus
      if (t.style === styleA) { score += 3 * (1 - ratio); rationale.push(`style:${styleA}`); }
      if (t.style === styleB) { score += 3 * ratio; rationale.push(`style:${styleB}`); }

      // Tag overlap with styleA
      t.tags.forEach(tag => {
        if (weightsA[tag]) {
          const gain = weightsA[tag] * (1 - ratio);
          score += gain;
          if (gain > 0.5) rationale.push(`tag:${tag}(A)`);
        }
      });

      // Tag overlap with styleB
      t.tags.forEach(tag => {
        if (weightsB[tag]) {
          const gain = weightsB[tag] * ratio;
          score += gain;
          if (gain > 0.5) rationale.push(`tag:${tag}(B)`);
        }
      });

      return { ...t, blendScore: parseFloat(score.toFixed(3)), blendRationale: [...new Set(rationale)] };
    })
    .sort((a, b) => b.blendScore - a.blendScore)
    .slice(0, limit);
}

/**
 * Apply a named blend preset.
 * @param {string} blendKey  - key from STYLE_BLENDS
 * @param {number} [limit=12]
 * @returns {{ blend: Object, results: Array }}
 */
export function applyBlend(blendKey, limit = 12) {
  const blend = STYLE_BLENDS[blendKey];
  if (!blend) throw new Error(`Unknown blend: "${blendKey}". Available: ${Object.keys(STYLE_BLENDS).join(", ")}`);
  return {
    blend,
    results: blendStyles(blend.styleA, blend.styleB, blend.ratio, limit),
  };
}
