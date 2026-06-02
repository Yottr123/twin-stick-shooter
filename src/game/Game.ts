import { PLAYER_MAX_HP, SCORE_BASIC, SCORE_FAST, SCORE_TANK } from "@/game/constants";
import { createPlayer, updatePlayer } from "@/game/entities/Player";
import { Player, Bullet, Enemy, Particle } from "@/game/entities/types";
import { Pool } from "@/game/utils/pool";
import { InputState, syncMouseWorld } from "@/game/systems/InputManager";
import { createBulletPool, updateFiring, updateBullets } from "@/game/systems/BulletSystem";
import { createEnemyPool, updateEnemies } from "@/game/systems/EnemySystem";
import { createParticlePool, spawnParticles, updateParticles } from "@/game/systems/ParticleSystem";
import { createWaveState, spawnWave, updateWaveState, WaveState } from "@/game/systems/WaveSpawner";
import { render, Viewport } from "@/game/systems/Renderer";
import { clamp } from "@/game/utils/math";
import {
  initAudio,
  playShoot,
  playEnemyDeath,
  playPlayerHit,
  playWaveStart,
} from "@/game/utils/sound";

export interface HUDState {
  hp: number;
  score: number;
  wave: number;
  waveActive: boolean;
  waveTimer: number;
}

export class Game {
  // ── Entities
  player:    Player;
  bullets:   Pool<Bullet>;
  enemies:   Pool<Enemy>;
  particles: Pool<Particle>;

  // ── Systems state
  waveState: WaveState;
  fireTimer: { current: number } = { current: 0 };
  score:     number = 0;

  // ── Rendering
  ctx: CanvasRenderingContext2D;
  vp:  Viewport = { w: 0, h: 0, camX: 0, camY: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.ctx       = canvas.getContext("2d")!;
    this.player    = createPlayer();
    this.bullets   = createBulletPool();
    this.enemies   = createEnemyPool();
    this.particles = createParticlePool();
    this.waveState = createWaveState();

    spawnWave(this.waveState, this.enemies);
  }

  update(input: InputState, dt: number): void {
    const { player } = this;
    if (!player.alive) return;

    // ── Sync mouse to world space
    syncMouseWorld(input, this.vp.camX, this.vp.camY);

    // ── Player
    updatePlayer(player, input, dt);

    // ── Shooting — init audio on first click (browser autoplay policy)
    const fired = updateFiring(this.bullets, this.particles, player, input, this.fireTimer, dt);
    if (fired) {
      initAudio();
      playShoot();
    }

    // ── Bullet update + hit detection
    const hits = updateBullets(this.bullets, this.enemies, dt);
    for (const { enemy, killed } of hits) {
      if (killed) {
        this.score += enemy.type === "tank" ? SCORE_TANK
                    : enemy.type === "fast" ? SCORE_FAST
                    : SCORE_BASIC;

        // Particle burst colors by type
        const [r, g, b] =
          enemy.type === "tank"  ? [80, 80, 80]   :
          enemy.type === "fast"  ? [60, 120, 200] :
                                   [200, 60, 60];
        spawnParticles(this.particles, enemy.x, enemy.y,
          enemy.type === "tank" ? 12 : 7, r, g, b);

        playEnemyDeath(enemy.type);
      }
    }

    // ── Enemy update + player contact
    const { playerHit } = updateEnemies(this.enemies, player, dt);
    if (playerHit) {
      spawnParticles(this.particles, player.x, player.y, 5, 220, 60, 60);
      playPlayerHit();
      if (player.hp <= 0) {
        player.hp    = 0;
        player.alive = false;
        spawnParticles(this.particles, player.x, player.y, 20, 220, 80, 80);
      }
    }

    // ── Particles
    updateParticles(this.particles, dt);

    // ── Wave management — play sound when a new wave starts
    const newWave = updateWaveState(this.waveState, this.enemies, dt);
    if (newWave) playWaveStart();
  }

  renderFrame(canvas: HTMLCanvasElement): void {
    this.vp.w    = canvas.width;
    this.vp.h    = canvas.height;
    this.vp.camX = clamp(this.player.x - this.vp.w / 2, 0, Math.max(0, 1600 - this.vp.w));
    this.vp.camY = clamp(this.player.y - this.vp.h / 2, 0, Math.max(0, 1600 - this.vp.h));

    render(this.ctx, this.vp, this.player, this.bullets, this.enemies, this.particles);
  }

  getHUD(): HUDState {
    return {
      hp:         this.player.hp,
      score:      this.score,
      wave:       this.waveState.wave,
      waveActive: this.waveState.waveActive,
      waveTimer:  this.waveState.waveTimer,
    };
  }

  isGameOver(): boolean {
    return !this.player.alive;
  }
}
