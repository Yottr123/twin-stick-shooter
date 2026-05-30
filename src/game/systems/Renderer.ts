import { WALL_T, WORLD_W, WORLD_H, PLAYER_RADIUS, BULLET_RADIUS, TANK_HP } from "@/game/constants";
import { Player, Bullet, Enemy, Particle } from "@/game/entities/types";
import { Pool } from "@/game/utils/pool";

export interface Viewport {
  w: number;
  h: number;
  camX: number;
  camY: number;
}

// ─── Arena ────────────────────────────────────────────────────────────────────

function drawArena(ctx: CanvasRenderingContext2D, vp: Viewport): void {
  // Floor fill
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(WALL_T, WALL_T, WORLD_W - WALL_T * 2, WORLD_H - WALL_T * 2);

  // Grid lines (only draw lines visible in viewport)
  const GRID = 60;
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;

  const startX = Math.floor((vp.camX + WALL_T) / GRID) * GRID;
  const startY = Math.floor((vp.camY + WALL_T) / GRID) * GRID;

  for (let gx = startX; gx <= vp.camX + vp.w; gx += GRID) {
    if (gx < WALL_T || gx > WORLD_W - WALL_T) continue;
    ctx.beginPath();
    ctx.moveTo(gx, WALL_T);
    ctx.lineTo(gx, WORLD_H - WALL_T);
    ctx.stroke();
  }
  for (let gy = startY; gy <= vp.camY + vp.h; gy += GRID) {
    if (gy < WALL_T || gy > WORLD_H - WALL_T) continue;
    ctx.beginPath();
    ctx.moveTo(WALL_T, gy);
    ctx.lineTo(WORLD_W - WALL_T, gy);
    ctx.stroke();
  }

  // Walls
  ctx.fillStyle = "#2e2e2e";
  ctx.fillRect(0, 0, WORLD_W, WALL_T);
  ctx.fillRect(0, WORLD_H - WALL_T, WORLD_W, WALL_T);
  ctx.fillRect(0, 0, WALL_T, WORLD_H);
  ctx.fillRect(WORLD_W - WALL_T, 0, WALL_T, WORLD_H);

  // Wall border accent
  ctx.strokeStyle = "#3a3a3a";
  ctx.lineWidth = 2;
  ctx.strokeRect(WALL_T, WALL_T, WORLD_W - WALL_T * 2, WORLD_H - WALL_T * 2);
}

// ─── Particles ────────────────────────────────────────────────────────────────

function drawParticles(ctx: CanvasRenderingContext2D, particles: Pool<Particle>): void {
  for (const p of particles.living()) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── Bullets ──────────────────────────────────────────────────────────────────

function drawBullets(ctx: CanvasRenderingContext2D, bullets: Pool<Bullet>): void {
  ctx.fillStyle = "#f0c040";
  for (const b of bullets.living()) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, BULLET_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── Enemies ──────────────────────────────────────────────────────────────────

function drawEnemies(ctx: CanvasRenderingContext2D, enemies: Pool<Enemy>): void {
  for (const e of enemies.living()) {
    const flashing = e.hitFlash > 0;

    if (e.type === "basic") {
      ctx.fillStyle = flashing ? "#ffffff" : "#c0392b";
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    else if (e.type === "tank") {
      ctx.fillStyle = flashing ? "#ffffff" : "#555555";
      ctx.fillRect(e.x - e.radius, e.y - e.radius, e.radius * 2, e.radius * 2);
      // HP pips above tank
      for (let i = 0; i < TANK_HP; i++) {
        ctx.fillStyle = i < e.hp ? "#aaaaaa" : "#333333";
        ctx.fillRect(e.x - e.radius + i * 9, e.y - e.radius - 9, 7, 4);
      }
    }

    else if (e.type === "fast") {
      ctx.fillStyle = flashing ? "#ffffff" : "#2980b9";
      ctx.beginPath();
      ctx.moveTo(e.x,            e.y - e.radius);
      ctx.lineTo(e.x + e.radius, e.y);
      ctx.lineTo(e.x,            e.y + e.radius);
      ctx.lineTo(e.x - e.radius, e.y);
      ctx.closePath();
      ctx.fill();
    }
  }
}

// ─── Player ───────────────────────────────────────────────────────────────────

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  if (!player.alive) return;

  // Blink during invincibility frames
  const blink =
    player.invincibleTimer > 0 &&
    Math.floor(player.invincibleTimer * 10) % 2 === 0;
  if (blink) return;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  // Body
  ctx.fillStyle = "#e8e8e8";
  ctx.beginPath();
  ctx.arc(0, 0, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Barrel
  ctx.fillStyle = "#bbbbbb";
  ctx.fillRect(PLAYER_RADIUS - 4, -4, 14, 8);

  // Direction indicator dot
  ctx.fillStyle = "#444444";
  ctx.beginPath();
  ctx.arc(6, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Main render entry ────────────────────────────────────────────────────────

export function render(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  player: Player,
  bullets: Pool<Bullet>,
  enemies: Pool<Enemy>,
  particles: Pool<Particle>
): void {
  // Clear canvas
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, vp.w, vp.h);

  // Apply camera transform
  ctx.save();
  ctx.translate(-vp.camX, -vp.camY);

  drawArena(ctx, vp);
  drawParticles(ctx, particles);
  drawBullets(ctx, bullets);
  drawEnemies(ctx, enemies);
  drawPlayer(ctx, player);

  ctx.restore();
}
