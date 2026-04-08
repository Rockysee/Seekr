/**
 * StyleKits.js
 * VibeStudio — Per-style CSS kit definitions + blend interpolator + CSS generator
 *
 * Each kit defines CSS variable values that get injected into a live page.
 * blendKits(kitA, kitB, ratio) interpolates between two kits.
 * generateCSS(kit) returns a full injectable stylesheet string.
 */

// ─────────────────────────────────────────────
// Color utilities
// ─────────────────────────────────────────────

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

/**
 * Linearly interpolate between two hex colors.
 * @param {string} hexA
 * @param {string} hexB
 * @param {number} t  0 = full A, 1 = full B
 */
export function lerpHex(hexA, hexB, t) {
  // Handle rgba strings gracefully — fall back to hexB at t > 0.5
  if (!hexA.startsWith("#") || !hexB.startsWith("#")) return t < 0.5 ? hexA : hexB;
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

// ─────────────────────────────────────────────
// Kit schema
// Each kit: { bg, bgSecondary, textPrimary, textSecondary,
//             accent, accentHover, border, radius,
//             fontFamily, shadow, bodyBg }
// ─────────────────────────────────────────────

export const STYLE_KITS = {
  minimalist: {
    bg:           "#ffffff",
    bgSecondary:  "#f8fafc",
    textPrimary:  "#0f172a",
    textSecondary:"#64748b",
    accent:       "#1e293b",
    accentHover:  "#334155",
    border:       "#e2e8f0",
    radius:       "4px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 1px 3px rgba(0,0,0,0.08)",
    bodyBg:       "#ffffff",
  },
  editorial: {
    bg:           "#fafaf9",
    bgSecondary:  "#f5f5f4",
    textPrimary:  "#1c1917",
    textSecondary:"#78716c",
    accent:       "#8b5cf6",
    accentHover:  "#7c3aed",
    border:       "#e7e5e4",
    radius:       "2px",
    fontFamily:   "'Georgia', 'Times New Roman', Times, serif",
    shadow:       "none",
    bodyBg:       "#fafaf9",
  },
  creative: {
    bg:           "#fff1f2",
    bgSecondary:  "#ffe4e6",
    textPrimary:  "#1f2937",
    textSecondary:"#6b7280",
    accent:       "#ec4899",
    accentHover:  "#db2777",
    border:       "#fecdd3",
    radius:       "16px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 8px 32px rgba(236,72,153,0.2)",
    bodyBg:       "#fff1f2",
  },
  "dark-luxury": {
    bg:           "#0a0a0f",
    bgSecondary:  "#0f1117",
    textPrimary:  "#e2e8f0",
    textSecondary:"#94a3b8",
    accent:       "#6366f1",
    accentHover:  "#818cf8",
    border:       "#1e2433",
    radius:       "8px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 4px 24px rgba(0,0,0,0.6)",
    bodyBg:       "#0a0a0f",
  },
  "bento-grid": {
    bg:           "#fefce8",
    bgSecondary:  "#fef9c3",
    textPrimary:  "#1c1917",
    textSecondary:"#78716c",
    accent:       "#f59e0b",
    accentHover:  "#d97706",
    border:       "#fde68a",
    radius:       "16px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 2px 8px rgba(245,158,11,0.15)",
    bodyBg:       "#fefce8",
  },
  masonry: {
    bg:           "#f0fdf4",
    bgSecondary:  "#dcfce7",
    textPrimary:  "#14532d",
    textSecondary:"#166534",
    accent:       "#10b981",
    accentHover:  "#059669",
    border:       "#bbf7d0",
    radius:       "8px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 2px 8px rgba(16,185,129,0.15)",
    bodyBg:       "#f0fdf4",
  },
  fullscreen: {
    bg:           "#082f49",
    bgSecondary:  "#0c4a6e",
    textPrimary:  "#f0f9ff",
    textSecondary:"#7dd3fc",
    accent:       "#06b6d4",
    accentHover:  "#0891b2",
    border:       "#164e63",
    radius:       "4px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 8px 32px rgba(6,182,212,0.2)",
    bodyBg:       "#082f49",
  },
  glassmorphism: {
    bg:           "#13131d",
    bgSecondary:  "rgba(255,255,255,0.06)",
    textPrimary:  "#f8fafc",
    textSecondary:"#94a3b8",
    accent:       "#6366f1",
    accentHover:  "#818cf8",
    border:       "rgba(255,255,255,0.12)",
    radius:       "12px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
    bodyBg:       "#13131d",
  },
  parallax: {
    bg:           "#1a0505",
    bgSecondary:  "#2d1515",
    textPrimary:  "#fef2f2",
    textSecondary:"#fca5a5",
    accent:       "#ef4444",
    accentHover:  "#dc2626",
    border:       "#450a0a",
    radius:       "6px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 4px 16px rgba(239,68,68,0.3)",
    bodyBg:       "#1a0505",
  },
  sidebar: {
    bg:           "#f8fafc",
    bgSecondary:  "#f1f5f9",
    textPrimary:  "#0f172a",
    textSecondary:"#64748b",
    accent:       "#14b8a6",
    accentHover:  "#0d9488",
    border:       "#e2e8f0",
    radius:       "6px",
    fontFamily:   "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 1px 3px rgba(0,0,0,0.08)",
    bodyBg:       "#f8fafc",
  },
  "horizontal-scroll": {
    bg:           "#fff7ed",
    bgSecondary:  "#ffedd5",
    textPrimary:  "#1c1917",
    textSecondary:"#78716c",
    accent:       "#f97316",
    accentHover:  "#ea580c",
    border:       "#fed7aa",
    radius:       "8px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 4px 16px rgba(249,115,22,0.2)",
    bodyBg:       "#fff7ed",
  },
  corporate: {
    bg:           "#ffffff",
    bgSecondary:  "#f1f5f9",
    textPrimary:  "#0f172a",
    textSecondary:"#475569",
    accent:       "#3b82f6",
    accentHover:  "#2563eb",
    border:       "#cbd5e1",
    radius:       "6px",
    fontFamily:   "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 1px 4px rgba(0,0,0,0.1)",
    bodyBg:       "#ffffff",
  },
  "coming-soon": {
    bg:           "#faf5ff",
    bgSecondary:  "#f3e8ff",
    textPrimary:  "#3b0764",
    textSecondary:"#7e22ce",
    accent:       "#a855f7",
    accentHover:  "#9333ea",
    border:       "#e9d5ff",
    radius:       "12px",
    fontFamily:   "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 4px 16px rgba(168,85,247,0.2)",
    bodyBg:       "#faf5ff",
  },
  dashboard: {
    bg:           "#0f172a",
    bgSecondary:  "#1e293b",
    textPrimary:  "#f1f5f9",
    textSecondary:"#94a3b8",
    accent:       "#0ea5e9",
    accentHover:  "#0284c7",
    border:       "#334155",
    radius:       "8px",
    fontFamily:   "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    shadow:       "0 4px 16px rgba(0,0,0,0.4)",
    bodyBg:       "#0f172a",
  },
};

// ─────────────────────────────────────────────
// Blend
// ─────────────────────────────────────────────

/**
 * Blend two kits by interpolating all color values.
 * Non-color properties (radius, fontFamily, shadow) snap at ratio 0.5.
 * @param {string} styleA
 * @param {string} styleB
 * @param {number} ratio  0 = full A, 1 = full B
 * @returns {Object} blended kit
 */
export function blendKits(styleA, styleB, ratio = 0.5) {
  const kitA = STYLE_KITS[styleA] || STYLE_KITS.minimalist;
  const kitB = STYLE_KITS[styleB] || STYLE_KITS["dark-luxury"];

  const lerp = (a, b) => lerpHex(a, b, ratio);
  const snap = (a, b) => ratio < 0.5 ? a : b;

  return {
    bg:           lerp(kitA.bg, kitB.bg),
    bgSecondary:  lerp(kitA.bgSecondary, kitB.bgSecondary),
    textPrimary:  lerp(kitA.textPrimary, kitB.textPrimary),
    textSecondary:lerp(kitA.textSecondary, kitB.textSecondary),
    accent:       lerp(kitA.accent, kitB.accent),
    accentHover:  lerp(kitA.accentHover, kitB.accentHover),
    border:       lerp(kitA.border, kitB.border),
    radius:       snap(kitA.radius, kitB.radius),
    fontFamily:   snap(kitA.fontFamily, kitB.fontFamily),
    shadow:       snap(kitA.shadow, kitB.shadow),
    bodyBg:       lerp(kitA.bodyBg, kitB.bodyBg),
  };
}

// ─────────────────────────────────────────────
// CSS Generator
// ─────────────────────────────────────────────

/**
 * Generate a full injectable CSS string from a kit.
 * Targets common HTML elements with !important overrides
 * so it works on sites that don't use CSS variables.
 * @param {Object} kit
 * @param {string} [label] - comment label for the CSS file header
 * @returns {string}
 */
export function generateCSS(kit, label = "VibeStudio Style Kit") {
  const { bg, bgSecondary, textPrimary, textSecondary, accent, accentHover, border, radius, fontFamily, shadow, bodyBg } = kit;

  return `
/* ================================================
   ${label}
   Generated by VibeStudio Style Blender
   ${new Date().toISOString()}
   Apply as: <link rel="stylesheet" href="vs-kit.css">
   ================================================ */

/* CSS Variables */
:root {
  --vs-bg:             ${bg};
  --vs-bg-secondary:   ${bgSecondary};
  --vs-text-primary:   ${textPrimary};
  --vs-text-secondary: ${textSecondary};
  --vs-accent:         ${accent};
  --vs-accent-hover:   ${accentHover};
  --vs-border:         ${border};
  --vs-radius:         ${radius};
  --vs-font-family:    ${fontFamily};
  --vs-shadow:         ${shadow};
}

/* Base */
html, body {
  background-color: ${bodyBg} !important;
  color: ${textPrimary} !important;
  font-family: ${fontFamily} !important;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  color: ${textPrimary} !important;
  font-family: ${fontFamily} !important;
}

/* Body text */
p, li, td, th, label, span, blockquote, figcaption {
  color: ${textSecondary} !important;
  font-family: ${fontFamily} !important;
}

/* Links */
a {
  color: ${accent} !important;
}
a:hover {
  color: ${accentHover} !important;
}

/* Buttons */
button,
input[type="submit"],
input[type="button"],
input[type="reset"],
.btn,
[class*="btn-"],
[class*="button"] {
  background-color: ${accent} !important;
  color: #ffffff !important;
  border-color: ${accent} !important;
  border-radius: ${radius} !important;
  font-family: ${fontFamily} !important;
  box-shadow: ${shadow} !important;
}
button:hover,
input[type="submit"]:hover,
.btn:hover,
[class*="btn-"]:hover {
  background-color: ${accentHover} !important;
  border-color: ${accentHover} !important;
}

/* Inputs */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="search"],
input[type="url"],
input[type="tel"],
input[type="number"],
textarea,
select {
  background-color: ${bgSecondary} !important;
  color: ${textPrimary} !important;
  border-color: ${border} !important;
  border-radius: ${radius} !important;
  font-family: ${fontFamily} !important;
}
input::placeholder,
textarea::placeholder {
  color: ${textSecondary} !important;
}

/* Navigation */
nav, header, .navbar, .nav, .header, [role="navigation"], [role="banner"] {
  background-color: ${bgSecondary} !important;
  border-color: ${border} !important;
}

nav a, header a, .navbar a, .nav a {
  color: ${textPrimary} !important;
}

nav a:hover, header a:hover, .navbar a:hover {
  color: ${accent} !important;
}

/* Sections */
section, main, article, aside, .section, .container, .wrapper {
  background-color: ${bg} !important;
}

/* Alternate bg sections */
section:nth-child(even), .section-alt, .bg-light, .bg-white, .bg-gray {
  background-color: ${bgSecondary} !important;
}

/* Cards */
.card, .tile, .panel, .box, article,
[class*="card"], [class*="panel"] {
  background-color: ${bgSecondary} !important;
  border-color: ${border} !important;
  border-radius: ${radius} !important;
  box-shadow: ${shadow} !important;
}

/* Footer */
footer, .footer, [role="contentinfo"] {
  background-color: ${bgSecondary} !important;
  color: ${textSecondary} !important;
  border-color: ${border} !important;
}

/* Dividers */
hr, .divider {
  border-color: ${border} !important;
}

/* Tables */
table {
  border-color: ${border} !important;
}
thead, th {
  background-color: ${bgSecondary} !important;
  color: ${textPrimary} !important;
}
td {
  border-color: ${border} !important;
}
tr:hover {
  background-color: ${bgSecondary} !important;
}

/* Code blocks */
code, pre, kbd {
  background-color: ${bgSecondary} !important;
  color: ${accent} !important;
  border-color: ${border} !important;
  border-radius: ${radius} !important;
}

/* Modals / overlays */
.modal-content, .dialog, [role="dialog"] {
  background-color: ${bgSecondary} !important;
  border-color: ${border} !important;
  border-radius: ${radius} !important;
  box-shadow: ${shadow} !important;
}

/* Badges / tags / pills */
.badge, .tag, .pill, .chip,
[class*="badge"], [class*="tag"] {
  background-color: ${accent} !important;
  color: #ffffff !important;
  border-radius: 999px !important;
}

/* Active / selected states */
.active, .selected, [aria-selected="true"], [aria-current="page"] {
  color: ${accent} !important;
  border-color: ${accent} !important;
}

/* Scrollbar (webkit) */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: ${bg}; }
::-webkit-scrollbar-thumb { background: ${border}; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: ${accent}; }
`.trim();
}

/**
 * Generate CSS from a blended style pair directly.
 * Convenience wrapper: blendKits + generateCSS in one call.
 */
export function generateBlendedCSS(styleA, styleB, ratio = 0.5, label) {
  const kit = blendKits(styleA, styleB, ratio);
  return { css: generateCSS(kit, label || `${styleA} × ${styleB} (${Math.round(ratio * 100)}%)`), kit };
}
