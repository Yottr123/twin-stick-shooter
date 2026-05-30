import React from "react";

interface Props {
  score: number;
  wave: number;
  onRetry: () => void;
  onMenu: () => void;
}

export function GameOverScreen({ score, wave, onRetry, onMenu }: Props) {
  return (
    <div style={overlay}>
      <div style={{ fontSize: 32, color: "#c0392b", letterSpacing: 4, fontWeight: "bold" }}>
        GAME OVER
      </div>
      <div style={{ height: 12 }} />
      <div style={{ fontSize: 12, color: "#666", letterSpacing: 2 }}>
        SCORE &nbsp; {String(score).padStart(6, "0")}
      </div>
      <div style={{ fontSize: 12, color: "#555", letterSpacing: 2 }}>
        WAVE &nbsp;&nbsp; {wave}
      </div>
      <div style={{ height: 24 }} />
      <button onClick={onRetry} style={btnPrimary}>RETRY</button>
      <button onClick={onMenu}  style={btnSecondary}>MENU</button>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "absolute", inset: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  background: "rgba(0,0,0,0.80)",
  zIndex: 10,
  fontFamily: "monospace",
  gap: 8,
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 40px",
  background: "transparent",
  border: "1px solid #555",
  color: "#e8e8e8",
  fontSize: 13,
  letterSpacing: 4,
  cursor: "pointer",
  fontFamily: "monospace",
  marginTop: 8,
};

const btnSecondary: React.CSSProperties = {
  ...btnPrimary,
  border: "none",
  color: "#444",
  fontSize: 11,
  marginTop: 0,
};
