# Twin Stick Shooter

A browser-based top-down twin-stick shooter built with Vite + React + TypeScript.  
Portfolio project documenting the journey from prototype to production.

## Quick Start

```bash
npm install
npm run dev
```

## Controls

| Input | Action |
|-------|--------|
| `WASD` | Move |
| Mouse | Aim |
| Left Click (hold) | Auto-fire |

## Enemy Types

| Shape | Type | Speed | HP | Points |
|-------|------|-------|----|--------|
| Red circle | Basic | Medium | 2 | 10 |
| Blue diamond | Fast | High | 1 | 15 |
| Grey square | Tank | Low | 5 | 30 |

## Project Structure

```
src/
├── game/
│   ├── constants.ts          # All tunable game values
│   ├── Game.ts               # Main orchestrator, exposes HUD to React
│   ├── entities/
│   │   ├── types.ts          # Shared interfaces (Player, Bullet, Enemy, Particle)
│   │   └── Player.ts         # Player factory + movement
│   ├── systems/
│   │   ├── InputManager.ts   # Keyboard + mouse state
│   │   ├── BulletSystem.ts   # Fire logic, bullet update, hit detection
│   │   ├── EnemySystem.ts    # Enemy movement + contact damage
│   │   ├── WaveSpawner.ts    # Wave state + difficulty scaling
│   │   ├── ParticleSystem.ts # Particle spawn + physics
│   │   └── Renderer.ts       # All Canvas 2D draw calls
│   └── utils/
│       ├── math.ts           # clamp, normalize, dist, etc.
│       └── pool.ts           # Generic typed object pool
├── components/
│   ├── GameCanvas.tsx        # Mounts canvas, owns game loop
│   ├── HUD.tsx               # Health, score, wave overlay
│   └── screens/
│       ├── MenuScreen.tsx
│       └── GameOverScreen.tsx
└── App.tsx                   # Phase state machine (menu/playing/dead)
```

## Architecture Notes

- The game loop runs entirely outside React's reconciler — React only handles menus and the HUD overlay
- `Renderer.ts` is intentionally isolated: swapping Canvas 2D for PixiJS (v0.4) only requires changes to this one file
- Object pooling prevents GC pressure during heavy particle/bullet frames
- All game values live in `constants.ts` — tweak feel without hunting through logic files

## Versioning

See [CHANGELOG.md](./CHANGELOG.md) for the full roadmap.

**Current**: v0.2.0 — Local project / architecture refactor  
**Next**: v0.3.0 — Game feel pass (screen shake, additive particles, ZzFX sound)
