import { useState } from "react";
import StyleBlender from "../StyleBlender.jsx";
import StyleApplicator from "../StyleApplicator.jsx";

const TABS = [
  { id: "blender",    label: "Template Browser", icon: "⬡" },
  { id: "applicator", label: "Bookmarklet Kit",  icon: "⌁" },
];

export default function App() {
  const [tab, setTab] = useState("blender");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  return (
    <div style={{
      width: "100vw", height: "100vh", display: "flex", flexDirection: "column",
      background: "#0a0a0f", color: "#e2e8f0",
      fontFamily: "'DM Sans', -apple-system, sans-serif", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        height: 44, background: "#0f1117", borderBottom: "1px solid #1e2433",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
          }}>V</div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>VibeStudio</span>
          <span style={{
            fontSize: 10, color: "#6366f1", fontWeight: 500,
            background: "#6366f120", padding: "1px 6px", borderRadius: 4,
          }}>Templator</span>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "5px 14px", borderRadius: 6,
              background: tab === t.id ? "#6366f1" : "transparent",
              border: "none",
              color: tab === t.id ? "#fff" : "#64748b",
              cursor: "pointer", fontSize: 12, fontWeight: 600,
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
              transition: "all 0.15s",
            }}>
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <a
          href="https://github.com/Rockysee/Seekr"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 11, color: "#475569", textDecoration: "none" }}
        >
          GitHub →
        </a>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        {tab === "blender" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <StyleBlender onSelect={setPreviewTemplate} />
          </div>
        )}
        {tab === "applicator" && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <StyleApplicator />
          </div>
        )}
      </div>

      {/* Template preview modal */}
      {previewTemplate && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            style={{
              background: "#0f1117", borderRadius: 16, maxWidth: 600,
              width: "90%", border: "1px solid #1e2433", overflow: "hidden",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              height: 280, backgroundImage: `url(${previewTemplate.thumb})`,
              backgroundSize: "cover", backgroundPosition: "top center",
              position: "relative",
            }}>
              <button
                onClick={() => setPreviewTemplate(null)}
                style={{
                  position: "absolute", top: 12, right: 12,
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(0,0,0,0.6)", border: "none",
                  color: "#fff", cursor: "pointer", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{previewTemplate.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#6366f1", background: "#6366f120", padding: "2px 8px", borderRadius: 6 }}>
                  {previewTemplate.style}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                {previewTemplate.src} · {previewTemplate.type} · CDO: {previewTemplate.cdo}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                {previewTemplate.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 10, color: "#475569", background: "#1e293b", padding: "2px 8px", borderRadius: 10 }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={previewTemplate.url} target="_blank" rel="noreferrer"
                  style={{ flex: 1, padding: "10px 0", background: "#6366f1", borderRadius: 8, color: "#fff", textAlign: "center", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                  Preview Live →
                </a>
                <a href={`${previewTemplate.url}/download`} target="_blank" rel="noreferrer"
                  style={{ flex: 1, padding: "10px 0", background: "#1e293b", borderRadius: 8, color: "#e2e8f0", textAlign: "center", textDecoration: "none", fontSize: 13, fontWeight: 600, border: "1px solid #334155" }}>
                  Download ZIP
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
