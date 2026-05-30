import { useState, useCallback } from "react";
import { GameCanvas } from "@/components/GameCanvas";
import { HUD } from "@/components/HUD";
import { MenuScreen } from "@/components/screens/MenuScreen";
import { GameOverScreen } from "@/components/screens/GameOverScreen";
import { HUDState } from "@/game/Game";

type Phase = "menu" | "playing" | "dead";

const DEFAULT_HUD: HUDState = {
  hp: 100, score: 0, wave: 0, waveActive: false, waveTimer: 0,
};

export default function App() {
  const [phase, setPhase]       = useState<Phase>("menu");
  const [hud, setHud]           = useState<HUDState>(DEFAULT_HUD);
  const [finalScore, setFinalScore] = useState(0);
  const [finalWave,  setFinalWave]  = useState(0);

  const handleStart = useCallback(() => {
    setHud(DEFAULT_HUD);
    setPhase("playing");
  }, []);

  const handleGameOver = useCallback((score: number, wave: number) => {
    setFinalScore(score);
    setFinalWave(wave);
    setPhase("dead");
  }, []);

  const handleHUDUpdate = useCallback((newHud: HUDState) => {
    setHud(newHud);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#111",
      position: "relative",
      overflow: "hidden",
      userSelect: "none",
    }}>
      {/* Canvas always rendered so the game can bootstrap; hidden when not playing */}
      <div style={{ width: "100%", height: "100%", display: phase === "playing" ? "block" : "none" }}>
        {phase === "playing" && (
          <GameCanvas onGameOver={handleGameOver} onHUDUpdate={handleHUDUpdate} />
        )}
      </div>

      {phase === "playing" && <HUD hud={hud} />}
      {phase === "menu"    && <MenuScreen onStart={handleStart} />}
      {phase === "dead"    && (
        <GameOverScreen
          score={finalScore}
          wave={finalWave}
          onRetry={handleStart}
          onMenu={() => setPhase("menu")}
        />
      )}
    </div>
  );
}
