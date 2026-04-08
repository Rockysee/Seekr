/**
 * StyleApplicator.jsx
 * VibeStudio — Live URL Style Applicator (localhost only)
 *
 * Workflow:
 *   1. User enters a localhost URL
 *   2. Picks two styles + blend ratio (or a named preset)
 *   3. Clicks Apply — CSS kit is injected into a COPY iframe
 *   4. Side-by-side: original (untouched) | styled copy
 *   5. Export as .css override file or .html snapshot
 *
 * Embed in VibeStudio canvas area:
 *   import StyleApplicator from "../../../Templator/StyleApplicator";
 *   {leftPanel === "apply" && <StyleApplicator />}
 *   // or replace canvas entirely when tool is active
 *
 * Constraints:
 *   - Localhost URLs only (same-origin iframe injection)
 *   - No server-side proxy needed
 */

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { STYLES, STYLE_COLORS, STYLE_BLENDS } from "./templates.js";
import { blendKits, generateCSS, generateBlendedCSS } from "./StyleKits.js";

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

function isLocalhost(url) {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StylePill({ style, selected, side, onClick }) {
  const color = STYLE_COLORS[style] || "#6366f1";
  const sideColor = side === "A" ? "#6366f1" : "#a855f7";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 9px",
        borderRadius: 20,
        border: `1px solid ${selected ? (side ? sideColor : color) : "#334155"}`,
        background: selected ? `${side ? sideColor : color}20` : "transparent",
        color: selected ? (side ? sideColor : color) : "#64748b",
        cursor: "pointer",
        fontSize: 10,
        fontWeight: 600,
        whiteSpace: "nowrap",
        fontFamily: "inherit",
        transition: "all 0.12s",
      }}
    >
      {style}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    idle:      { color: "#475569", label: "Ready" },
    loading:   { color: "#f59e0b", label: "Loading…" },
    injecting: { color: "#6366f1", label: "Applying kit…" },
    done:      { color: "#10b981", label: "Kit applied" },
    error:     { color: "#ef4444", label: "Error" },
  };
  const { color, label } = map[status] || map.idle;
  return (
    <span style={{ fontSize: 10, fontWeight: 600, color, display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function StyleApplicator({ onMinimize }) {
  // URL
  const [url, setUrl] = useState("http://localhost:3000");
  const [appliedUrl, setAppliedUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // Style selection
  const [mode, setMode] = useState("blend");     // "blend" | "preset" | "single"
  const [styleA, setStyleA] = useState("minimalist");
  const [styleB, setStyleB] = useState("dark-luxury");
  const [ratio, setRatio] = useState(0.5);
  const [selectedPreset, setSelectedPreset] = useState("midnight-minimal");
  const [singleStyle, setSingleStyle] = useState("dark-luxury");

  // View
  const [view, setView] = useState("split");     // "split" | "original" | "styled"
  const [status, setStatus] = useState("idle");  // idle | loading | injecting | done | error

  // Refs
  const origIframeRef = useRef(null);
  const styledIframeRef = useRef(null);

  // ── Derive active kit ──────────────────────────────────────
  const activeKit = useMemo(() => {
    if (mode === "single") return blendKits(singleStyle, singleStyle, 0);
    if (mode === "preset") {
      const p = STYLE_BLENDS[selectedPreset];
      if (p) return blendKits(p.styleA, p.styleB, p.ratio);
    }
    return blendKits(styleA, styleB, ratio);
  }, [mode, styleA, styleB, ratio, selectedPreset, singleStyle]);

  const activeCSS = useMemo(() => {
    const label = mode === "preset"
      ? STYLE_BLENDS[selectedPreset]?.name
      : mode === "single"
        ? singleStyle
        : `${styleA} × ${styleB} (${Math.round(ratio * 100)}%)`;
    return generateCSS(activeKit, `VibeStudio — ${label}`);
  }, [activeKit, mode, selectedPreset, singleStyle, styleA, styleB, ratio]);

  // ── Inject CSS into styled iframe ──────────────────────────
  const injectCSS = useCallback(() => {
    const iframe = styledIframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) { setStatus("error"); return; }

      // Remove any previous VibeStudio injection
      const prev = doc.getElementById("__vibe-studio-kit__");
      if (prev) prev.remove();

      const style = doc.createElement("style");
      style.id = "__vibe-studio-kit__";
      style.textContent = activeCSS;
      doc.head.appendChild(style);
      setStatus("done");
    } catch (err) {
      console.error("[VibeStudio] CSS injection failed:", err);
      setStatus("error");
    }
  }, [activeCSS]);

  // ── Apply: load URL into both iframes ─────────────────────
  const handleApply = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) { setUrlError("Enter a URL"); return; }
    if (!isLocalhost(trimmed)) { setUrlError("Only localhost URLs are supported"); return; }
    setUrlError("");
    setStatus("loading");
    setAppliedUrl(trimmed);
  }, [url]);

  // ── When styled iframe loads, inject CSS ──────────────────
  const handleStyledLoad = useCallback(() => {
    setStatus("injecting");
    // small tick to let the page paint first
    setTimeout(injectCSS, 80);
  }, [injectCSS]);

  // Re-inject when kit changes (url already loaded)
  useEffect(() => {
    if (status === "done") injectCSS();
  }, [activeCSS]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Export: CSS file ──────────────────────────────────────
  const exportCSS = useCallback(() => {
    downloadBlob(activeCSS, "vs-kit.css", "text/css");
  }, [activeCSS]);

  // ── Export: HTML snapshot ─────────────────────────────────
  const exportHTML = useCallback(() => {
    const iframe = styledIframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      const html = doc.documentElement.outerHTML;
      // Ensure our style tag is embedded (it already is via injection, but just in case)
      const withMeta = html.includes("__vibe-studio-kit__")
        ? html
        : html.replace("</head>", `<style id="__vibe-studio-kit__">\n${activeCSS}\n</style>\n</head>`);
      downloadBlob(withMeta, "vs-styled.html", "text/html");
    } catch (err) {
      console.error("[VibeStudio] HTML export failed:", err);
    }
  }, [activeCSS]);

  // ── Color derivations for UI ──────────────────────────────
  const colorA = STYLE_COLORS[mode === "preset" ? (STYLE_BLENDS[selectedPreset]?.styleA || styleA) : styleA] || "#6366f1";
  const colorB = STYLE_COLORS[mode === "preset" ? (STYLE_BLENDS[selectedPreset]?.styleB || styleB) : styleB] || "#a855f7";

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#0a0a0f", color: "#e2e8f0",
      fontFamily: "'DM Sans', -apple-system, sans-serif", fontSize: 13,
    }}>

      {/* ── Top controls bar ── */}
      <div style={{
        flexShrink: 0, borderBottom: "1px solid #1e2433",
        background: "#0f1117", padding: "10px 12px",
        display: "flex", flexDirection: "column", gap: 8,
      }}>

        {/* Row 1: Title + status + minimize */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 18, height: 18, borderRadius: 5, flexShrink: 0,
            background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
          }} />
          <span style={{ fontWeight: 700, fontSize: 13 }}>Style Applicator</span>
          <span style={{ fontSize: 10, color: "#334155" }}>localhost only</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <StatusBadge status={status} />
            {onMinimize && (
              <button onClick={onMinimize} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
            )}
          </div>
        </div>

        {/* Row 2: URL input + Apply */}
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setUrlError(""); }}
              onKeyDown={e => e.key === "Enter" && handleApply()}
              placeholder="http://localhost:3000"
              style={{
                width: "100%", boxSizing: "border-box",
                background: urlError ? "#7f1d1d20" : "#1e293b",
                border: `1px solid ${urlError ? "#ef4444" : "#334155"}`,
                borderRadius: 6, padding: "6px 10px",
                color: "#e2e8f0", fontSize: 12, outline: "none",
                fontFamily: "monospace",
              }}
            />
            {urlError && (
              <div style={{ position: "absolute", top: "calc(100% + 2px)", left: 0, fontSize: 10, color: "#ef4444" }}>
                {urlError}
              </div>
            )}
          </div>
          <button
            onClick={handleApply}
            style={{
              padding: "6px 14px", borderRadius: 6,
              background: "#6366f1", border: "none",
              color: "#fff", fontWeight: 700, fontSize: 12,
              cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.target.style.background = "#818cf8"}
            onMouseLeave={e => e.target.style.background = "#6366f1"}
          >
            Apply
          </button>
        </div>

        {/* Row 3: Mode tabs */}
        <div style={{ display: "flex", gap: 2 }}>
          {["blend", "preset", "single"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "5px 0",
              background: mode === m ? "#1e293b" : "transparent",
              border: `1px solid ${mode === m ? "#334155" : "transparent"}`,
              borderRadius: 5, color: mode === m ? "#e2e8f0" : "#475569",
              cursor: "pointer", fontSize: 10, fontWeight: 600,
              textTransform: "capitalize", fontFamily: "inherit",
            }}>{m}</button>
          ))}
        </div>

        {/* Row 4: Style controls (varies by mode) */}
        {mode === "blend" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Style A */}
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>
                A — <span style={{ color: colorA, fontWeight: 700 }}>{styleA}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {STYLES.map(s => (
                  <StylePill key={s} style={s} selected={styleA === s} side="A"
                    onClick={() => { setStyleA(s); if (s === styleB) setStyleB(STYLES.find(x => x !== s)); }} />
                ))}
              </div>
            </div>
            {/* Style B */}
            <div>
              <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>
                B — <span style={{ color: colorB, fontWeight: 700 }}>{styleB}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {STYLES.map(s => (
                  <StylePill key={s} style={s} selected={styleB === s} side="B"
                    onClick={() => { setStyleB(s); if (s === styleA) setStyleA(STYLES.find(x => x !== s)); }} />
                ))}
              </div>
            </div>
            {/* Ratio slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginBottom: 4 }}>
                <span style={{ color: colorA }}>← {styleA}</span>
                <span>{Math.round(ratio * 100)}%</span>
                <span style={{ color: colorB }}>{styleB} →</span>
              </div>
              <div style={{ position: "relative", height: 18, display: "flex", alignItems: "center" }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, height: 3, borderRadius: 2,
                  background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
                }} />
                <input type="range" min={0} max={1} step={0.05} value={ratio}
                  onChange={e => setRatio(parseFloat(e.target.value))}
                  style={{ width: "100%", appearance: "none", background: "transparent", cursor: "pointer", position: "relative", zIndex: 1, height: 18, margin: 0, padding: 0 }} />
              </div>
            </div>
          </div>
        )}

        {mode === "preset" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 140, overflowY: "auto" }}>
            {Object.entries(STYLE_BLENDS).map(([key, blend]) => {
              const ca = STYLE_COLORS[blend.styleA] || "#6366f1";
              const cb = STYLE_COLORS[blend.styleB] || "#a855f7";
              return (
                <button key={key} onClick={() => setSelectedPreset(key)} style={{
                  padding: "6px 10px", borderRadius: 6, textAlign: "left",
                  background: selectedPreset === key ? "#1e293b" : "transparent",
                  border: `1px solid ${selectedPreset === key ? blend.accent : "#1e2433"}`,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 24, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${ca}, ${cb})`, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: selectedPreset === key ? "#e2e8f0" : "#64748b" }}>{blend.name}</span>
                    <span style={{ fontSize: 10, color: "#334155", marginLeft: "auto" }}>{blend.styleA} + {blend.styleB}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {mode === "single" && (
          <div>
            <div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>
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

        {/* Row 5: View toggle + Export (active after apply) */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ display: "flex", borderRadius: 5, border: "1px solid #1e2433", overflow: "hidden", flexShrink: 0 }}>
            {["split", "original", "styled"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "4px 10px", background: view === v ? "#1e293b" : "transparent",
                border: "none", color: view === v ? "#e2e8f0" : "#475569",
                cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: "inherit",
              }}>{v}</button>
            ))}
          </div>

          {status === "done" && (
            <>
              <button onClick={exportCSS} title="Download vs-kit.css" style={{
                padding: "4px 10px", borderRadius: 5, background: "#1e293b",
                border: "1px solid #334155", color: "#94a3b8", cursor: "pointer",
                fontSize: 10, fontWeight: 600, fontFamily: "inherit",
              }}>↓ CSS</button>
              <button onClick={exportHTML} title="Download vs-styled.html" style={{
                padding: "4px 10px", borderRadius: 5, background: "#1e293b",
                border: "1px solid #334155", color: "#94a3b8", cursor: "pointer",
                fontSize: 10, fontWeight: 600, fontFamily: "inherit",
              }}>↓ HTML</button>
            </>
          )}
        </div>
      </div>

      {/* ── Preview area ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {!appliedUrl ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#334155", gap: 8 }}>
            <div style={{ fontSize: 28 }}>⌨</div>
            <div style={{ fontSize: 12, textAlign: "center", lineHeight: 1.5, maxWidth: 200 }}>
              Enter a localhost URL and click <strong style={{ color: "#6366f1" }}>Apply</strong> to preview the style kit
            </div>
          </div>
        ) : (
          <>
            {/* Original iframe */}
            {(view === "split" || view === "original") && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: view === "split" ? "1px solid #1e2433" : "none" }}>
                <div style={{ padding: "4px 8px", background: "#0f1117", borderBottom: "1px solid #1e2433", fontSize: 10, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#475569", display: "inline-block" }} />
                  Original
                  <span style={{ color: "#334155", marginLeft: 4, fontFamily: "monospace" }}>{appliedUrl}</span>
                </div>
                <iframe
                  ref={origIframeRef}
                  src={appliedUrl}
                  style={{ flex: 1, border: "none", width: "100%" }}
                  title="Original"
                />
              </div>
            )}

            {/* Styled copy iframe */}
            {(view === "split" || view === "styled") && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "4px 8px", background: "#0f1117", borderBottom: "1px solid #1e2433", fontSize: 10, color: "#6366f1", display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: `linear-gradient(135deg, ${colorA}, ${colorB})`, flexShrink: 0 }} />
                  Styled copy
                  {mode === "preset" && <span style={{ color: "#334155", marginLeft: 4 }}>{STYLE_BLENDS[selectedPreset]?.name}</span>}
                  {mode === "blend" && <span style={{ color: "#334155", marginLeft: 4 }}>{styleA} × {styleB}</span>}
                  {mode === "single" && <span style={{ color: "#334155", marginLeft: 4 }}>{singleStyle}</span>}
                </div>
                <iframe
                  ref={styledIframeRef}
                  src={appliedUrl}
                  onLoad={handleStyledLoad}
                  style={{ flex: 1, border: "none", width: "100%" }}
                  title="Styled copy"
                />
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px; height: 12px; border-radius: 50%;
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
