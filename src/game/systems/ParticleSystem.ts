import {
  PARTICLE_LIFETIME, PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX,
  MUZZLE_PARTICLE_COUNT, MUZZLE_PARTICLE_LIFETIME,
  MUZZLE_PARTICLE_SPEED, MUZZLE_SPREAD_ANGLE,
} from "@/game/constants";
import { makePool, Pool } from "@/game/utils/pool";
import { Particle } from "@/game/entities/types";
import { randBetween } from "@/game/utils/math";

export function createParticlePool(): Pool<Particle> {
  return makePool<Particle>(() => ({
    x: 0, y: 0,
    vx: 0, vy: 0,
    life: 0, maxLife: PARTICLE_LIFETIME,
    r: 255, g: 255, b: 255,
    size: 3,
    alive: false,
  }));
}

/** General-purpose burst — used for enemy death, player hit, etc. */
export function spawnParticles(
  pool: Pool<Particle>,
  x: number,
  y: number,
  count: number,
  r: number,
  g: number,
  b: number,
  sizeOverride?: number
): void {
  for (let i = 0; i < count; i++) {
    const p = pool.get();
    const angle = Math.random() * Math.PI * 2;
    const speed = randBetween(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX);
    p.x       = x;
    p.y       = y;
    p.vx      = Math.cos(angle) * speed;
    p.vy      = Math.sin(angle) * speed;
    p.life    = PARTICLE_LIFETIME * randBetween(0.6, 1.0);
    p.maxLife = p.life;
    p.r = r; p.g = g; p.b = b;
    p.size    = sizeOverride ?? randBetween(2, 5);
  }
}

/**
 * Muzzle flash — tight directional burst from barrel tip.
 * Particles fan outward within MUZZLE_SPREAD_ANGLE either side of barrelAngle.
 */
export function spawnMuzzleFlash(
  pool: Pool<Particle>,
  x: number,
  y: number,
  barrelAngle: number
): void {
  for (let i = 0; i < MUZZLE_PARTICLE_COUNT; i++) {
    const p = pool.get();
    const spread = (Math.random() - 0.5) * 2 * MUZZLE_SPREAD_ANGLE;
    const angle  = barrelAngle + spread;
    const speed  = MUZZLE_PARTICLE_SPEED * randBetween(0.6, 1.0);
    p.x       = x;
    p.y       = y;
    p.vx      = Math.cos(angle) * speed;
    p.vy      = Math.sin(angle) * speed;
    p.life    = MUZZLE_PARTICLE_LIFETIME * randBetween(0.7, 1.0);
    p.maxLife = p.life;
    // Warm yellow-white flash
    p.r = 255; p.g = 220; p.b = 120;
    p.size = randBetween(2, 4);
  }
}

export function updateParticles(pool: Pool<Particle>, dt: number): void {
  for (const p of pool.living()) {
    p.x  += p.vx * dt;
    p.y  += p.vy * dt;
    // Friction
    p.vx *= 1 - dt * 4;
    p.vy *= 1 - dt * 4;
    p.life -= dt;
    if (p.life <= 0) p.alive = false;
  }
}
