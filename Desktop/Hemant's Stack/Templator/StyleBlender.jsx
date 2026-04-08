/**
 * StyleBlender.jsx
 * VibeStudio — Template Style Blender UI
 *
 * Usage (embed inside VibeStudio left panel templates tab):
 *   import StyleBlender from "../../../Templator/StyleBlender";
 *   <StyleBlender onSelect={(template) => setShowTemplatePreview(template)} />
 *
 * Standalone usage:
 *   Drop into any React app. Self-contained, no external deps beyond React.
 */

import { useState, useMemo } from "react";
import {
  TEMPLATES,
  STYLES,
  STYLE_COLORS,
  STYLE_BLENDS,
  blendStyles,
  applyBlend,
} from "./templates.js";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StylePill({ style, selected, onClick }) {
  const color = STYLE_COLORS[style] || "#6366f1";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        border: `1px solid ${selected ? color : "#334155"}`,
        background: selected ? `${color}25` : "transparent",
        color: selected ? color : "#64748b",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        transition: "all 0.15s",
        fontFamily: "inherit",
      }}
    >
      {style}
    </button>
  );
}

function TemplateCard({ template, onSelect, showScore }) {
  const [hovered, setHovered] = useState(false);
  const color = STYLE_COLORS[template.style] || "#6366f1";

  return (
    <div
      onClick={() => onSelect?.(template)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 8,
        overflow: "hidden",
        border: `1px solid ${hovered ? "#334155" : "#1e2433"}`,
        cursor: "pointer",
        background: "#0a0a14",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div
        style={{
          height: 90,
          backgroundImage: `url(${template.thumb})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 700,
            background: `${color}cc`,
            color: "#fff",
            backdropFilter: "blur(4px)",
          }}
        >
          {template.style}
        </div>
        {showScore && template.blendScore !== undefined && (
          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: 4,
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 700,
              background: "rgba(0,0,0,0.7)",
              color: "#a5b4fc",
              backdropFilter: "blur(4px)",
            }}
          >
            {template.blendScore.toFixed(1)} match
          </div>
        )}
      </div>
      <div style={{ padding: "7px 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {template.name}
        </div>
        <div style={{ fontSize: 9, color: "#475569", marginTop: 1 }}>
          {template.src} · {template.type}
        </div>
      </div>
    </div>
  );
}

function BlendPresetCard({ blendKey, blend, selected, onClick }) {
  const colorA = STYLE_COLORS[blend.styleA] || "#6366f1";
  const colorB = STYLE_COLORS[blend.styleB] || "#a855f7";

  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${selected ? blend.accent : "#1e2433"}`,
        background: selected ? `${blend.accent}15` : "#0a0a14",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        fontFamily: "inherit",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <div
          style={{
            width: 28,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 11, fontWeight: 700, color: selected ? "#e2e8f0" : "#94a3b8" }}>
          {blend.name}
        </span>
      </div>
      <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.4 }}>
        {blend.styleA} + {blend.styleB}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function StyleBlender({ onSelect }) {
  const [mode, setMode] = useState("preset");       // "preset" | "custom"
  const [selectedPreset, setSelectedPreset] = useState("midnight-minimal");
  const [styleA, setStyleA] = useState("minimalist");
  const [styleB, setStyleB] = useState("dark-luxury");
  const [ratio, setRatio] = useState(0.5);
  const [showScore, setShowScore] = useState(false);

  const blendResults = useMemo(() => {
    if (mode === "preset") {
      const { results } = applyBlend(selectedPreset);
      return results;
    }
    return blendStyles(styleA, styleB, ratio, 12);
  }, [mode, selectedPreset, styleA, styleB, ratio]);

  const colorA = STYLE_COLORS[styleA] || "#6366f1";
  const colorB = STYLE_COLORS[styleB] || "#a855f7";
  const activeBlend = mode === "preset" ? STYLE_BLENDS[selectedPreset] : null;
  const gradientAccentA = activeBlend ? STYLE_COLORS[activeBlend.styleA] : colorA;
  const gradientAccentB = activeBlend ? STYLE_COLORS[activeBlend.styleB] : colorB;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'DM Sans', -apple-system, sans-serif", fontSize: 13, color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{ padding: "10px 12px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${gradientAccentA}, ${gradientAccentB})`,
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 13 }}>Style Blender</span>
          <button
            onClick={() => setShowScore(s => !s)}
            title="Toggle match score"
            style={{
              marginLeft: "auto",
              padding: "2px 8px",
              borderRadius: 4,
              border: `1px solid ${showScore ? "#6366f1" : "#334155"}`,
              background: showScore ? "#6366f120" : "transparent",
              color: showScore ? "#a5b4fc" : "#475569",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            score
          </button>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", borderRadius: 6, border: "1px solid #1e2433", overflow: "hidden", marginBottom: 10 }}>
          {["preset", "custom"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "6px 0",
                background: mode === m ? "#1e293b" : "transparent",
                border: "none",
                color: mode === m ? "#e2e8f0" : "#475569",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "capitalize",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: "0 12px", flexShrink: 0 }}>
        {mode === "preset" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10, maxHeight: 200, overflowY: "auto" }}>
            {Object.entries(STYLE_BLENDS).map(([key, blend]) => (
              <BlendPresetCard
                key={key}
                blendKey={key}
                blend={blend}
                selected={selectedPreset === key}
                onClick={() => setSelectedPreset(key)}
              />
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: 10 }}>
            {/* Style A */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Style A
                <span style={{ marginLeft: 6, color: colorA, textTransform: "none", fontWeight: 700 }}>{styleA}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {STYLES.map(s => (
                  <StylePill key={s} style={s} selected={styleA === s} onClick={() => { setStyleA(s); if (s === styleB) setStyleB(STYLES.find(x => x !== s) || s); }} />
                ))}
              </div>
            </div>

            {/* Style B */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Style B
                <span style={{ marginLeft: 6, color: colorB, textTransform: "none", fontWeight: 700 }}>{styleB}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {STYLES.map(s => (
                  <StylePill key={s} style={s} selected={styleB === s} onClick={() => { setStyleB(s); if (s === styleA) setStyleA(STYLES.find(x => x !== s) || s); }} />
                ))}
              </div>
            </div>

            {/* Ratio Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginBottom: 5 }}>
                <span style={{ color: colorA, fontWeight: 600 }}>← {styleA}</span>
                <span style={{ color: "#64748b" }}>{Math.round(ratio * 100)}% {styleB}</span>
                <span style={{ color: colorB, fontWeight: 600 }}>{styleB} →</span>
              </div>
              <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 4,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={ratio}
                  onChange={e => setRatio(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    appearance: "none",
                    background: "transparent",
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 1,
                    height: 20,
                    margin: 0,
                    padding: 0,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active blend description */}
        {(activeBlend || mode === "custom") && (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              background: "#0f1117",
              border: "1px solid #1e2433",
              marginBottom: 10,
            }}
          >
            {activeBlend ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: activeBlend.accent, marginBottom: 3 }}>
                  {activeBlend.name}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>{activeBlend.description}</div>
                <div style={{ marginTop: 5, fontSize: 10, color: "#334155" }}>
                  CDO: {activeBlend.cdoPairing.join(" × ")}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 10, color: "#64748b" }}>
                Custom blend · {blendResults.length} templates matched
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: 10, color: "#334155", marginBottom: 8 }}>
          {blendResults.length} results
        </div>
      </div>

      {/* Results grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {blendResults.map(t => (
            <TemplateCard key={t.id} template={t} onSelect={onSelect} showScore={showScore} />
          ))}
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e2e8f0;
          border: 2px solid #1e293b;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.4);
        }
        input[type=range]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e2e8f0;
          border: 2px solid #1e293b;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
