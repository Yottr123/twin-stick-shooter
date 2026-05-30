import React from "react";
import { HUDState } from "@/game/Game";

const PLAYER_MAX_HP = 100;

interface Props {
  hud: HUDState;
}

export function HUD({ hud }: Props) {
  const hpPct    = (hud.hp / PLAYER_MAX_HP) * 100;
  const hpColor  = hud.hp > 40 ? "#e8e8e8" : "#c0392b";
  const nextWave = !hud.waveActive ? Math.max(0, hud.waveTimer) : -1;

  return (
    <>
      {/* ── Top bar */}
      <div style={topBar}>
        {/* Health */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={label}>HP</span>
          <div style={hpTrack}>
            <div style={{ ...hpFill, width: `${hpPct}%`, background: hpColor }} />
          </div>
          <span style={label}>{hud.hp}</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Wave */}
        <div style={{ ...label, letterSpacing: 2 }}>
          {nextWave > 0
            ? `WAVE ${hud.wave + 1} IN ${Math.ceil(nextWave)}s`
            : `WAVE ${hud.wave}`}
        </div>

        {/* Score */}
        <div style={score}>{String(hud.score).padStart(6, "0")}</div>
      </div>

      {/* ── Wave incoming banner */}
      {nextWave > 0 && nextWave < 3 && (
        <div style={banner}>NEXT WAVE INCOMING</div>
      )}
    </>
  );
}

// ── Styles
const topBar: React.CSSProperties = {
  position: "absolute", top: 0, left: 0, right: 0,
  padding: "10px 18px",
  display: "flex", alignItems: "center", gap: 20,
  zIndex: 5, pointerEvents: "none",
  fontFamily: "monospace",
};

const label: React.CSSProperties = {
  color: "#666", fontSize: 11, letterSpacing: 1,
};

const hpTrack: React.CSSProperties = {
  width: 120, height: 7,
  background: "#2a2a2a", borderRadius: 2,
};

const hpFill: React.CSSProperties = {
  height: "100%", borderRadius: 2, transition: "width 0.1s",
};

const score: React.CSSProperties = {
  color: "#e8e8e8", fontSize: 13,
  letterSpacing: 3, fontWeight: "bold",
};

const banner: React.CSSProperties = {
  position: "absolute", top: 44, left: "50%",
  transform: "translateX(-50%)",
  color: "#555", fontSize: 10, letterSpacing: 3,
  zIndex: 5, pointerEvents: "none",
  fontFamily: "monospace",
};
