import {
  BULLET_SPEED, BULLET_RADIUS, BULLET_LIFETIME,
  FIRE_RATE, WALL_T, WORLD_W, WORLD_H, PLAYER_RADIUS,
} from "@/game/constants";
import { makePool, Pool } from "@/game/utils/pool";
import { circlesOverlap } from "@/game/utils/math";
import { Bullet, Enemy, Particle, Player } from "@/game/entities/types";
import { InputState } from "./InputManager";
import { spawnMuzzleFlash } from "./ParticleSystem";

export function createBulletPool(): Pool<Bullet> {
  return makePool<Bullet>(() => ({
    x: 0, y: 0,
    vx: 0, vy: 0,
    life: 0,
    prevX: 0, prevY: 0,
    alive: false,
  }));
}

/**
 * Handles auto-fire logic.
 * Spawns a bullet and a muzzle flash when fire conditions are met.
 * Returns true if a bullet was fired this frame.
 */
export function updateFiring(
  bullets: Pool<Bullet>,
  particles: Pool<Particle>,
  player: Player,
  input: InputState,
  fireTimerRef: { current: number },
  dt: number
): boolean {
  fireTimerRef.current -= dt;
  if (!input.mouseDown || fireTimerRef.current > 0) return false;

  fireTimerRef.current = FIRE_RATE;

  // Spawn bullet
  const b = bullets.get();
  const barrelLen = PLAYER_RADIUS + 8;
  const bx = player.x + Math.cos(player.angle) * barrelLen;
  const by = player.y + Math.sin(player.angle) * barrelLen;
  b.prevX = b.x = bx;
  b.prevY = b.y = by;
  b.vx   = Math.cos(player.angle) * BULLET_SPEED;
  b.vy   = Math.sin(player.angle) * BULLET_SPEED;
  b.life = BULLET_LIFETIME;

  // Muzzle flash at barrel tip
  spawnMuzzleFlash(particles, bx, by, player.angle);

  return true;
}

export interface BulletHitResult {
  enemy: Enemy;
  killed: boolean;
}

/**
 * Moves bullets, records previous position for trail rendering,
 * despawns out-of-bounds/expired ones, and checks enemy collisions.
 */
export function updateBullets(
  bullets: Pool<Bullet>,
  enemies: Pool<Enemy>,
  dt: number
): BulletHitResult[] {
  const hits: BulletHitResult[] = [];

  for (const b of bullets.living()) {
    // Store previous position before moving (used by Renderer for trails)
    b.prevX = b.x;
    b.prevY = b.y;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    // Wall or lifetime expiry
    if (
      b.life <= 0 ||
      b.x < WALL_T || b.x > WORLD_W - WALL_T ||
      b.y < WALL_T || b.y > WORLD_H - WALL_T
    ) {
      b.alive = false;
      continue;
    }

    // Enemy collision
    for (const e of enemies.living()) {
      if (circlesOverlap(b, e, BULLET_RADIUS, e.radius)) {
        b.alive = false;
        e.hp -= 1;
        e.hitFlash = 0.12;
        const killed = e.hp <= 0;
        if (killed) e.alive = false;
        hits.push({ enemy: e, killed });
        break;
      }
    }
  }

  return hits;
}
