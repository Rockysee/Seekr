/**
 * StyleApplicator.jsx
 * VibeStudio — Bookmarklet-based Style Applicator
 *
 * How it works:
 *   1. User picks styles / blend / preset
 *   2. A bookmarklet is generated containing the full CSS kit inline
 *   3. User drags the bookmarklet to their browser toolbar (one time)
 *   4. User navigates to any localhost (or any site)
 *   5. Clicks the bookmarklet → CSS kit injects directly into the live page
 *   6. Re-clicking toggles the kit off/on
 *   7. Export: download .css file or copy the bookmarklet href directly
 */

import { useState, useMemo, useCallback } from "react";
import { STYLES, STYLE_COLORS, STYLE_BLENDS } from "./templates.js";
import { blendKits, generateCSS } from "./StyleKits.js";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Builds a self-contained bookmarklet href from a CSS string.
 * Clicking it on any page injects the kit; clicking again removes it (toggle).
 */
function buildBookmarklet(css) {
  const escaped = css
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  const script = `
(function(){
  var ID='__vs_kit__';
  var existing=document.getElementById(ID);
  if(existing){existing.remove();return;}
  var s=document.createElement('style');
  s.id=ID;
  s.textContent=\`${escaped}\`;
  document.head.appendChild(s);
})();
`.trim();

  return "javascript:" + encodeURIComponent(script);
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StylePill({ style, selected, side, onClick }) {
  const color = STYLE_COLORS[style] || "#6366f1";
  const activeColor = side === "B" ? "#a855f7" : "#6366f1";
  return (
    <button onClick={onClick} style={{
      padding: "3px 9px", borderRadius: 20, fontFamily: "inherit",
      border: `1px solid ${selected ? activeColor : "#334155"}`,
      background: selected ? `${activeColor}20` : "transparent",
      color: selected ? activeColor : "#64748b",
      cursor: "pointer", fontSize: 10, fontWeight: 600,
      whiteSpace: "nowrap", transition: "all 0.12s",
    }}>{style}</button>
  );
}

function Step({ n, label, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        background: done ? "#10b981" : "#1e293b",
        border: `1px solid ${done ? "#10b981" : "#334155"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 700, color: done ? "#fff" : "#475569",
      }}>{done ? "✓" : n}</div>
      <span style={{ fontSize: 12, color: done ? "#94a3b8" : "#e2e8f0" }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

export default function StyleApplicator() {
  const [mode, setMode] = useState("blend");       // blend | preset | single
  const [styleA, setStyleA] = useState("minimalist");
  const [styleB, setStyleB] = useState("dark-luxury");
  const [ratio, setRatio] = useState(0.5);
  const [selectedPreset, setSelectedPreset] = useState("midnight-minimal");
  const [singleStyle, setSingleStyle] = useState("dark-luxury");
  const [copied, setCopied] = useState(false);

  const colorA = STYLE_COLORS[mode === "preset" ? (STYLE_BLENDS[selectedPreset]?.styleA || styleA) : styleA] || "#6366f1";
  const colorB = STYLE_COLORS[mode === "preset" ? (STYLE_BLENDS[selectedPreset]?.styleB || styleB) : styleB] || "#a855f7";

  const activeKit = useMemo(() => {
    if (mode === "single") return blendKits(singleStyle, singleStyle, 0);
    if (mode === "preset") {
      const p = STYLE_BLENDS[selectedPreset];
      if (p) return blendKits(p.styleA, p.styleB, p.ratio);
    }
    return blendKits(styleA, styleB, ratio);
  }, [mode, styleA, styleB, ratio, selectedPreset, singleStyle]);

  const label = useMemo(() => {
    if (mode === "preset") return STYLE_BLENDS[selectedPreset]?.name || selectedPreset;
    if (mode === "single") return singleStyle;
    return `${styleA} × ${styleB} (${Math.round(ratio * 100)}%)`;
  }, [mode, selectedPreset, singleStyle, styleA, styleB, ratio]);

  const activeCSS = useMemo(() => generateCSS(activeKit, `VibeStudio — ${label}`), [activeKit, label]);
  const bookmarkletHref = useMemo(() => buildBookmarklet(activeCSS), [activeCSS]);

  const copyBookmarklet = useCallback(() => {
    navigator.clipboard.writeText(bookmarkletHref).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [bookmarkletHref]);

  const exportCSS = useCallback(() => {
    downloadBlob(activeCSS, "vs-kit.css", "text/css");
  }, [activeCSS]);

  // Kit preview swatches
  const swatches = [
    { label: "bg",      color: activeKit.bg },
    { label: "bg2",     color: activeKit.bgSecondary },
    { label: "text",    color: activeKit.textPrimary },
    { label: "muted",   color: activeKit.textSecondary },
    { label: "accent",  color: activeKit.accent },
    { label: "border",  color: activeKit.border },
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#0a0a0f", color: "#e2e8f0", overflow: "auto",
      fontFamily: "'DM Sans', -apple-system, sans-serif", fontSize: 13,
    }}>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: `linear-gradient(135deg, ${colorA}, ${colorB})`, flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Style Applicator</span>
          <span style={{ fontSize: 10, color: "#334155", marginLeft: 2 }}>bookmarklet</span>
        </div>

        {/* How it works */}
        <div style={{ background: "#0f1117", border: "1px solid #1e2433", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>How it works</div>
          <Step n={1} label="Pick a style or blend below" done />
          <Step n={2} label="Drag the bookmarklet button to your browser toolbar" />
          <Step n={3} label="Navigate to any page (localhost or live)" />
          <Step n={4} label="Click the bookmarklet — kit injects instantly" />
          <Step n={5} label="Click again to toggle off" />
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", borderRadius: 6, border: "1px solid #1e2433", overflow: "hidden" }}>
          {["blend", "preset", "single"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "6px 0", background: mode === m ? "#1e293b" : "transparent",
              border: "none", color: mode === m ? "#e2e8f0" : "#475569",
              cursor: "pointer", fontSize: 11, fontWeight: 600,
              textTransform: "capitalize", fontFamily: "inherit",
            }}>{m}</button>
          ))}
        </div>

        {/* Style controls */}
        {mode === "blend" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 5 }}>
                A — <span style={{ color: colorA, fontWeight: 700 }}>{styleA}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {STYLES.map(s => (
                  <StylePill key={s} style={s} selected={styleA === s} side="A"
                    onClick={() => { setStyleA(s); if (s === styleB) setStyleB(STYLES.find(x => x !== s)); }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 5 }}>
                B — <span style={{ color: colorB, fontWeight: 700 }}>{styleB}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {STYLES.map(s => (
                  <StylePill key={s} style={s} selected={styleB === s} side="B"
                    onClick={() => { setStyleB(s); if (s === styleA) setStyleA(STYLES.find(x => x !== s)); }} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginBottom: 4 }}>
                <span style={{ color: colorA }}>← {styleA}</span>
                <span>{Math.round(ratio * 100)}%</span>
                <span style={{ color: colorB }}>{styleB} →</span>
              </div>
              <div style={{ position: "relative", height: 18, display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${colorA}, ${colorB})` }} />
                <input type="range" min={0} max={1} step={0.05} value={ratio}
                  onChange={e => setRatio(parseFloat(e.target.value))}
                  style={{ width: "100%", appearance: "none", background: "transparent", cursor: "pointer", position: "relative", zIndex: 1, height: 18, margin: 0, padding: 0 }} />
              </div>
            </div>
          </div>
        )}

        {mode === "preset" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(STYLE_BLENDS).map(([key, blend]) => {
              const ca = STYLE_COLORS[blend.styleA] || "#6366f1";
              const cb = STYLE_COLORS[blend.styleB] || "#a855f7";
              return (
                <button key={key} onClick={() => setSelectedPreset(key)} style={{
                  padding: "8px 10px", borderRadius: 7, textAlign: "left",
                  background: selectedPreset === key ? "#1e293b" : "transparent",
                  border: `1px solid ${selectedPreset === key ? blend.accent : "#1e2433"}`,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 22, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${ca}, ${cb})`, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: selectedPreset === key ? "#e2e8f0" : "#64748b" }}>{blend.name}</span>
                    <span style={{ fontSize: 10, color: "#334155", marginLeft: "auto" }}>{blend.styleA} + {blend.styleB}</span>
                  </div>
                  {selectedPreset === key && (
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>{blend.description}</div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {mode === "single" && (
          <div>
            <div style={{ fontSize: 10, color: "#475569", marginBottom: 5 }}>
              Style — <span style={{ color: STYLE_COLORS[singleStyle] || "#6366f1", fontWeight: 700 }}>{singleStyle}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {STYLES.map(s => (
                <StylePill key={s} style={s} selected={singleStyle === s}
                  onClick={() => setSingleStyle(s)} />
              ))}
            </div>
          </div>
        )}

        {/* Kit preview swatches */}
        <div style={{ background: "#0f1117", border: "1px solid #1e2433", borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Kit Preview — {label}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {swatches.map(s => (
              <div key={s.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: 24, borderRadius: 4, background: s.color, border: "1px solid #1e2433" }} title={s.color} />
                <span style={{ fontSize: 9, color: "#475569" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, fontSize: 10, color: "#64748b" }}>
            <span>radius: <strong style={{ color: "#94a3b8" }}>{activeKit.radius}</strong></span>
            <span style={{ color: "#334155" }}>·</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              font: <strong style={{ color: "#94a3b8" }}>{activeKit.fontFamily.split(",")[0]}</strong>
            </span>
          </div>
        </div>

        {/* ── Bookmarklet drop zone ── */}
        <div style={{ background: "#0f1117", border: "1px solid #1e2433", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            Bookmarklet
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
            Drag the button below into your browser bookmark bar. Then visit any page and click it.
          </div>

          {/* Draggable bookmarklet button */}
          <a
            href={bookmarkletHref}
            onClick={e => e.preventDefault()}
            draggable="true"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 16px", borderRadius: 8, cursor: "grab",
              background: `linear-gradient(135deg, ${colorA}22, ${colorB}22)`,
              border: `1px solid ${colorA}55`,
              color: "#e2e8f0", textDecoration: "none",
              fontSize: 12, fontWeight: 700, fontFamily: "inherit",
              userSelect: "none",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 3, background: `linear-gradient(135deg, ${colorA}, ${colorB})`, flexShrink: 0 }} />
            VibeKit: {label}
            <span style={{ fontSize: 10, color: "#475569", fontWeight: 400 }}>← drag me</span>
          </a>

          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <button onClick={copyBookmarklet} style={{
              flex: 1, padding: "8px 0", borderRadius: 6,
              background: copied ? "#10b98120" : "#1e293b",
              border: `1px solid ${copied ? "#10b981" : "#334155"}`,
              color: copied ? "#10b981" : "#94a3b8",
              cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
            }}>
              {copied ? "✓ Copied" : "Copy bookmarklet href"}
            </button>
            <button onClick={exportCSS} style={{
              flex: 1, padding: "8px 0", borderRadius: 6,
              background: "#1e293b", border: "1px solid #334155",
              color: "#94a3b8", cursor: "pointer",
              fontSize: 11, fontWeight: 600, fontFamily: "inherit",
            }}>↓ Download .css</button>
          </div>
        </div>

        {/* Manual paste fallback */}
        <div style={{ background: "#0f1117", border: "1px solid #1e2433", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Can't drag? Paste manually
          </div>
          <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
            1. Copy the bookmarklet href above<br />
            2. Create a new bookmark in your browser<br />
            3. Paste as the URL field<br />
            4. Name it "VibeKit"
          </div>
        </div>

      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%;
          background: #e2e8f0; border: 2px solid #1e293b; cursor: pointer;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.4);
        }
        input[type=range]::-moz-range-thumb {
          width: 12px; height: 12px; border-radius: 50%;
          background: #e2e8f0; border: 2px solid #1e293b; cursor: pointer;
        }
      `}</style>
    </div>
  );
}
