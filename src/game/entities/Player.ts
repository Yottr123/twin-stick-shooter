import { WORLD_W, WORLD_H, WALL_T, PLAYER_SPEED, PLAYER_RADIUS, PLAYER_MAX_HP } from "@/game/constants";
import { clamp, normalize } from "@/game/utils/math";
import { Player } from "./types";
import { InputState } from "@/game/systems/InputManager";

export function createPlayer(): Player {
  return {
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    angle: 0,
    hp: PLAYER_MAX_HP,
    invincibleTimer: 0,
    alive: true,
  };
}

export function updatePlayer(player: Player, input: InputState, dt: number): void {
  // ── Movement
  let mx = 0, my = 0;
  if (input.keys["w"] || input.keys["arrowup"])    my -= 1;
  if (input.keys["s"] || input.keys["arrowdown"])  my += 1;
  if (input.keys["a"] || input.keys["arrowleft"])  mx -= 1;
  if (input.keys["d"] || input.keys["arrowright"]) mx += 1;

  if (mx !== 0 || my !== 0) {
    const [nx, ny] = normalize(mx, my);
    player.x += nx * PLAYER_SPEED * dt;
    player.y += ny * PLAYER_SPEED * dt;
  }

  // Clamp inside arena walls
  player.x = clamp(player.x, WALL_T + PLAYER_RADIUS, WORLD_W - WALL_T - PLAYER_RADIUS);
  player.y = clamp(player.y, WALL_T + PLAYER_RADIUS, WORLD_H - WALL_T - PLAYER_RADIUS);

  // ── Aim toward mouse (world coords)
  const dx = input.mouseWorld.x - player.x;
  const dy = input.mouseWorld.y - player.y;
  player.angle = Math.atan2(dy, dx);

  // ── Invincibility countdown
  if (player.invincibleTimer > 0) player.invincibleTimer -= dt;
}
