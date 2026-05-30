import {
  WORLD_W, WORLD_H, WALL_T,
  BASIC_RADIUS, BASIC_SPEED, BASIC_HP, BASIC_DAMAGE,
  TANK_RADIUS, TANK_SPEED, TANK_HP, TANK_DAMAGE,
  FAST_RADIUS, FAST_SPEED, FAST_HP, FAST_DAMAGE,
  WAVE_BREAK_DURATION, WAVE_SPEED_SCALE,
} from "@/game/constants";
import { Pool } from "@/game/utils/pool";
import { Enemy, EnemyType } from "@/game/entities/types";

export interface WaveState {
  wave: number;
  enemiesLeft: number;
  waveActive: boolean;
  waveTimer: number;
}

export function createWaveState(): WaveState {
  return { wave: 0, enemiesLeft: 0, waveActive: false, waveTimer: 0 };
}

function edgeSpawn(): { x: number; y: number } {
  const edge = Math.floor(Math.random() * 4);
  const margin = WALL_T + 60;
  const rangeW = WORLD_W - margin * 2;
  const rangeH = WORLD_H - margin * 2;
  if (edge === 0) return { x: margin + Math.random() * rangeW, y: margin };
  if (edge === 1) return { x: margin + Math.random() * rangeW, y: WORLD_H - margin };
  if (edge === 2) return { x: margin, y: margin + Math.random() * rangeH };
  return { x: WORLD_W - margin, y: margin + Math.random() * rangeH };
}

function spawnEnemy(
  pool: Pool<Enemy>,
  type: EnemyType,
  hp: number,
  speed: number,
  radius: number,
  damage: number
): void {
  const e = pool.get();
  const pos = edgeSpawn();
  e.x       = pos.x;
  e.y       = pos.y;
  e.type    = type;
  e.hp      = hp;
  e.maxHp   = hp;
  e.speed   = speed;
  e.radius  = radius;
  e.damage  = damage;
  e.hitFlash = 0;
}

export function spawnWave(waveState: WaveState, enemies: Pool<Enemy>): void {
  waveState.wave += 1;
  const w = waveState.wave;
  const speedMult = 1 + (w - 1) * WAVE_SPEED_SCALE;

  const basicCount = 3 + w * 2;
  const tankCount  = Math.floor(w / 2);
  const fastCount  = Math.floor(w / 3);

  for (let i = 0; i < basicCount; i++)
    spawnEnemy(enemies, "basic", BASIC_HP, BASIC_SPEED * speedMult, BASIC_RADIUS, BASIC_DAMAGE);

  for (let i = 0; i < tankCount; i++)
    spawnEnemy(enemies, "tank", TANK_HP, TANK_SPEED * speedMult, TANK_RADIUS, TANK_DAMAGE);

  for (let i = 0; i < fastCount; i++)
    spawnEnemy(enemies, "fast", FAST_HP, FAST_SPEED * speedMult, FAST_RADIUS, FAST_DAMAGE);

  waveState.enemiesLeft = basicCount + tankCount + fastCount;
  waveState.waveActive  = true;
}

/**
 * Tick the wave timer. Call each frame.
 * Returns true if a new wave just started.
 */
export function updateWaveState(
  waveState: WaveState,
  enemies: Pool<Enemy>,
  dt: number
): boolean {
  if (waveState.waveActive) {
    // Count living enemies
    waveState.enemiesLeft = enemies.living().length;
    if (waveState.enemiesLeft <= 0) {
      waveState.waveActive = false;
      waveState.waveTimer  = WAVE_BREAK_DURATION;
    }
    return false;
  }

  // Between waves: count down
  waveState.waveTimer -= dt;
  if (waveState.waveTimer <= 0) {
    spawnWave(waveState, enemies);
    return true;
  }
  return false;
}
