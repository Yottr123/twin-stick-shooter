import { useEffect, useRef, useCallback } from "react";
import { Game } from "@/game/Game";
import { createInputState, attachKeyboardListeners, updateMousePosition } from "@/game/systems/InputManager";
import { HUDState } from "@/game/Game";

interface Props {
  onGameOver: (finalScore: number, finalWave: number) => void;
  onHUDUpdate: (hud: HUDState) => void;
}

export function GameCanvas({ onGameOver, onHUDUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef   = useRef<Game | null>(null);
  const inputRef  = useRef(createInputState());
  const rafRef    = useRef<number>(0);
  const lastTsRef = useRef<number | null>(null);

  // ── Bootstrap game instance
  useEffect(() => {
    const canvas = canvasRef.current!;

    // Size canvas to its CSS size
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create game
    gameRef.current = new Game(canvas);

    // Keyboard
    const detachKeys = attachKeyboardListeners(inputRef.current);

    // Game loop
    const loop = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05); // cap at 50ms
      lastTsRef.current = ts;

      const game = gameRef.current!;
      game.update(inputRef.current, dt);
      game.renderFrame(canvas);
      onHUDUpdate(game.getHUD());

      if (game.isGameOver()) {
        const hud = game.getHUD();
        onGameOver(hud.score, hud.wave);
        return; // stop loop
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      detachKeys();
      lastTsRef.current = null;
    };
  }, []); // intentionally empty — game mounts once

  // ── Mouse handlers
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    updateMousePosition(inputRef.current, e.clientX, e.clientY, rect);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) inputRef.current.mouseDown = true;
  }, []);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) inputRef.current.mouseDown = false;
  }, []);

  const onContextMenu = useCallback((e: React.MouseEvent) => e.preventDefault(), []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onContextMenu={onContextMenu}
    />
  );
}
