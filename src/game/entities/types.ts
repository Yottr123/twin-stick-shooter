import { Poolable } from "@/game/utils/pool";

export type EnemyType = "basic" | "tank" | "fast";

export interface Player {
  x: number;
  y: number;
  angle: number;
  hp: number;
  invincibleTimer: number;
  alive: boolean;
}

export interface Bullet extends Poolable {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  // Trail: store previous position for motion-blur line rendering (v0.2+)
  prevX: number;
  prevY: number;
}

export interface Enemy extends Poolable {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  radius: number;
  damage: number;
  type: EnemyType;
  hitFlash: number;
}

export interface Particle extends Poolable {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  g: number;
  b: number;
  size: number;
}
