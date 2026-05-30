// ─── World ────────────────────────────────────────────────────────────────────
export const WORLD_W = 1600;
export const WORLD_H = 1600;
export const WALL_T  = 40;

// ─── Player ───────────────────────────────────────────────────────────────────
export const PLAYER_SPEED         = 260;   // px/s  — bumped up from 220 for snappier feel
export const PLAYER_RADIUS        = 14;
export const PLAYER_MAX_HP        = 100;
export const PLAYER_INVINCIBLE_MS = 800;   // ms of i-frames after hit

// ─── Bullets ──────────────────────────────────────────────────────────────────
export const BULLET_SPEED    = 560;        // px/s  — slightly faster than v0.1
export const BULLET_RADIUS   = 5;
export const BULLET_LIFETIME = 1.4;        // seconds before auto-despawn
export const FIRE_RATE       = 0.11;       // seconds between shots (tighter than v0.1)

// ─── Enemy: Basic ─────────────────────────────────────────────────────────────
export const BASIC_RADIUS = 16;
export const BASIC_SPEED  = 90;
export const BASIC_HP     = 2;
export const BASIC_DAMAGE = 10;

// ─── Enemy: Tank ──────────────────────────────────────────────────────────────
export const TANK_RADIUS = 22;
export const TANK_SPEED  = 50;
export const TANK_HP     = 5;
export const TANK_DAMAGE = 20;

// ─── Enemy: Fast ──────────────────────────────────────────────────────────────
export const FAST_RADIUS = 11;
export const FAST_SPEED  = 170;
export const FAST_HP     = 1;
export const FAST_DAMAGE = 8;

// ─── Waves ────────────────────────────────────────────────────────────────────
export const WAVE_BREAK_DURATION = 3.0;    // seconds between waves
export const WAVE_SPEED_SCALE    = 0.06;   // speed increase per wave (multiplier)

// ─── Particles ────────────────────────────────────────────────────────────────
export const PARTICLE_LIFETIME = 0.55;     // seconds
export const PARTICLE_SPEED_MIN = 60;
export const PARTICLE_SPEED_MAX = 140;

// ─── Scoring ──────────────────────────────────────────────────────────────────
export const SCORE_BASIC = 10;
export const SCORE_FAST  = 15;
export const SCORE_TANK  = 30;
