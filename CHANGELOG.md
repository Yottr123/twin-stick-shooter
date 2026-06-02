# Changelog

All notable changes to Twin Stick Shooter are documented here.
Versions follow the roadmap established during prototyping.

---

## [v0.1.0] — Initial Prototype (Artifact)
**Status**: Complete
**Format**: Single-file React artifact (browser only)

### Added
- Delta-time game loop via `requestAnimationFrame`
- WASD movement + mouse aim + left-click auto-fire
- Object pooling for bullets and particles
- Camera that follows the player
- Circle vs circle collision detection
- Invincibility frames (i-frames) after player is hit
- 3 enemy types: Basic (circle), Fast (diamond), Tank (square with HP pips)
- Wave spawner with linear difficulty scaling
- Particle burst on enemy death and player hit
- React HUD: health bar, score, wave counter
- Game state machine: Menu → Playing → Game Over

---

## [v0.2.0] — Local Project / Architecture Refactor
**Status**: Complete
**Format**: Vite + React + TypeScript local project

### Changed
- Migrated from single artifact file to proper multi-file project structure
- All game logic extracted from React into dedicated TypeScript modules

### Architecture
- `game/constants.ts` — all tunable values in one place
- `game/utils/math.ts` — shared math helpers (clamp, normalize, dist, etc.)
- `game/utils/pool.ts` — generic typed object pool
- `game/entities/types.ts` — shared entity interfaces (Player, Bullet, Enemy, Particle)
- `game/entities/Player.ts` — player factory + movement update
- `game/systems/InputManager.ts` — keyboard/mouse state, world-space sync
- `game/systems/BulletSystem.ts` — fire logic, bullet update, hit detection
- `game/systems/EnemySystem.ts` — enemy movement, player contact damage
- `game/systems/WaveSpawner.ts` — wave state, enemy spawning, difficulty scaling
- `game/systems/ParticleSystem.ts` — particle spawn, physics update
- `game/systems/Renderer.ts` — all Canvas 2D draw calls (renderer-agnostic boundary)
- `game/Game.ts` — orchestrates all systems, exposes HUD snapshot to React
- `components/GameCanvas.tsx` — mounts canvas, owns game loop, bridges to React
- `components/HUD.tsx` — health bar, score, wave display
- `components/screens/MenuScreen.tsx` — start screen
- `components/screens/GameOverScreen.tsx` — death screen with final stats
- `App.tsx` — top-level phase state machine

### Tuned
- Player speed: 220 → 260 px/s
- Bullet speed: 520 → 560 px/s
- Fire rate: 0.13s → 0.11s between shots

---

## [v0.3.0] — Game Feel Pass
**Status**: Complete

### Added
- **Additive blend particles** — `globalCompositeOperation = "lighter"` on particle draw pass; overlapping particles add color values producing a natural glow on the dark background
- **Bullet motion trails** — bullets rendered as lines from `(prevX, prevY)` to `(x, y)` instead of circles; faster bullets produce longer streaks naturally
- **Muzzle flash** — small particle burst at barrel tip on every shot; warm yellow/white, 4 particles, tight spread
- **ZzFX sound synthesis** — zero-dependency procedural audio via Web Audio API; sounds synthesized from numeric parameters, no audio files needed
  - `playShoot()` — short high-pitched snap
  - `playEnemyDeath(type)` — varies by enemy type; basic=pop, fast=zap, tank=thud
  - `playPlayerHit()` — low distorted thud
  - `playWaveStart()` — brief ascending sweep
- AudioContext initialized on first user interaction (browser autoplay policy compliance)

### Deferred
- **Screen shake** — moved to v0.4; want to nail the PixiJS migration first so shake is implemented once in the new renderer rather than twice

### Files changed
- `CHANGELOG.md`
- `src/game/constants.ts` — muzzle flash tuning constants
- `src/game/utils/sound.ts` — new file; ZzFX + named sound functions
- `src/game/systems/ParticleSystem.ts` — muzzle flash spawn helper added
- `src/game/systems/BulletSystem.ts` — muzzle flash triggered on fire
- `src/game/systems/Renderer.ts` — additive blending, bullet trail rendering
- `src/game/Game.ts` — sound calls wired to game events

---

## [v0.4.0] — PixiJS Migration + Screen Shake *(Planned)*
- Replace Canvas 2D renderer (`Renderer.ts`) with PixiJS WebGL renderer
- Screen shake on player hit, player death, and wave start
- Bloom/glow filter via PixiJS BlurFilter composite
- Sprite batching for large particle counts
- Neon aesthetic pass

## [v0.5.0] — BSP Procedural Rooms *(Planned)*
- Binary Space Partitioning room generator
- Room-to-room transitions (doors, corridors)
- Minimap overlay
- Enemies spawn per-room rather than from screen edge

## [v0.6.0] — Weapons & Pickups *(Planned)*
- Weapon variety: shotgun, laser, rocket
- Pickup drops from enemies (health, weapon, score multiplier)
- XP and leveling system

## [v0.7.0] — Boss Waves *(Planned)*
- Boss enemy every 5 waves with scripted attack patterns
- Phase-based boss health (visual phase transitions)

## [v1.0.0] — Portfolio Release *(Planned)*
- Final aesthetic polish
- High score leaderboard (localStorage)
- Shareable URL with score param
- README with architecture writeup for portfolio
