import {
  WALL_T, WORLD_W, WORLD_H,
  PLAYER_INVINCIBLE_MS, PLAYER_RADIUS,
} from "@/game/constants";
import { clamp, normalize, circlesOverlap } from "@/game/utils/math";
import { makePool, Pool } from "@/game/utils/pool";
import { Enemy, Player } from "@/game/entities/types";

export function createEnemyPool(): Pool<Enemy> {
  return makePool<Enemy>(() => ({
    x: 0, y: 0,
    hp: 1, maxHp: 1,
    speed: 90,
    radius: 16,
    damage: 10,
    type: "basic",
    hitFlash: 0,
    alive: false,
  }));
}

export interface EnemyUpdateResult {
  playerHit: boolean;
  damageDealt: number;
}

/**
 * Moves all living enemies toward the player.
 * Handles player contact damage and i-frames.
 */
export function updateEnemies(
  enemies: Pool<Enemy>,
  player: Player,
  dt: number
): EnemyUpdateResult {
  let playerHit = false;
  let damageDealt = 0;

  for (const e of enemies.living()) {
    // Seek player
    const [ex, ey] = normalize(player.x - e.x, player.y - e.y);
    e.x += ex * e.speed * dt;
    e.y += ey * e.speed * dt;

    // Stay inside arena
    e.x = clamp(e.x, WALL_T + e.radius, WORLD_W - WALL_T - e.radius);
    e.y = clamp(e.y, WALL_T + e.radius, WORLD_H - WALL_T - e.radius);

    // Hit flash cooldown
    if (e.hitFlash > 0) e.hitFlash -= dt;

    // Damage player on contact (if not invincible)
    if (
      player.alive &&
      player.invincibleTimer <= 0 &&
      circlesOverlap(player, e, PLAYER_RADIUS, e.radius)
    ) {
      player.hp -= e.damage;
      player.invincibleTimer = PLAYER_INVINCIBLE_MS / 1000;
      playerHit = true;
      damageDealt += e.damage;
    }
  }

  return { playerHit, damageDealt };
}
