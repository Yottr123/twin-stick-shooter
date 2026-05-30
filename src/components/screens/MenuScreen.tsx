import React from "react";

interface Props {
  onStart: () => void;
}

export function MenuScreen({ onStart }: Props) {
  return (
    <div style={overlay}>
      <div style={{ fontSize: 36, fontWeight: "bold", color: "#e8e8e8", letterSpacing: 4 }}>
        TWIN STICK
      </div>
      <div style={{ fontSize: 13, color: "#555", letterSpacing: 2 }}>
        SHOOTER — v0.1
      </div>

      <div style={{ height: 28 }} />

      <div style={{ fontSize: 12, color: "#555", lineHeight: 2.2, textAlign: "center" }}>
        <div>WASD &nbsp;—&nbsp; Move</div>
        <div>Mouse &nbsp;—&nbsp; Aim</div>
        <div>Left Click &nbsp;—&nbsp; Shoot (hold to auto-fire)</div>
      </div>

      <div style={{ height: 12 }} />

      <div style={{ fontSize: 11, color: "#3a3a3a", lineHeight: 2.2, textAlign: "center" }}>
        <div>● Red circle &nbsp;— Basic (10 pts)</div>
        <div>◆ Blue diamond — Fast (15 pts)</div>
        <div>■ Grey square &nbsp;— Tank (30 pts)</div>
      </div>

      <div style={{ height: 24 }} />

      <button onClick={onStart} style={btn}>START</button>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "absolute", inset: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  background: "#111",
  zIndex: 10,
  fontFamily: "monospace",
  gap: 4,
};

const btn: React.CSSProperties = {
  padding: "10px 40px",
  background: "transparent",
  border: "1px solid #444",
  color: "#e8e8e8",
  fontSize: 13,
  letterSpacing: 4,
  cursor: "pointer",
  fontFamily: "monospace",
};
