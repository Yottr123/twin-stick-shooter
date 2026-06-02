/**
 * sound.ts — Procedural audio via ZzFX
 *
 * ZzFX by Frank Force (MIT licence) — https://github.com/KilledByAPixel/ZzFX
 * Copied inline so there are zero external dependencies.
 *
 * How to tune sounds:
 *   Each zzfx() call takes positional parameters. The most useful ones are:
 *   zzfx(volume, randomness, frequency, attack, sustain, release, shape,
 *        shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime,
 *        repeatTime, noise, modulation, bitCrush, delay, sustainVolume,
 *        decay, tremolo)
 *
 *   shape: 0=sine 1=triangle 2=sawtooth 3=tan 4=bit-noise
 */

// ─── AudioContext (lazy — must be created after user interaction) ─────────────
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
    if (!ctx) ctx = new AudioContext();
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
}

// ─── ZzFX engine (minified core, unmodified) ─────────────────────────────────
// prettier-ignore
function zzfx(...params: number[]): AudioBufferSourceNode | undefined {
    let [
        volume = 1, randomness = 0.05, frequency = 220,
        attack = 0, sustain = 0, release = 0.1,
        shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0,
        pitchJump = 0, pitchJumpTime = 0, repeatTime = 0,
        noise = 0, modulation = 0, bitCrush = 0,
        delay = 0, sustainVolume = 1, decay = 0, tremolo = 0,
    ] = params;

    const audioCtx = getCtx();
    const sampleRate = audioCtx.sampleRate;

    let b: number[] = [],
        startSlide = (slide *= (500 * Math.PI * 2) / sampleRate ** 2),
        startFreq = (frequency *= (1 + randomness * 2 * Math.random() - randomness) * Math.PI * 2 / sampleRate),
        t = 0, tm = 0, i = 0, j = true, r = 0, c = 0, s = 0, f = 0,
        length = sampleRate * (attack + sustain + release + decay) | 0;

    for (; i < length; b[i++] = s * volume) {
        if (!(++c % (bitCrush * 100 | 0))) {
            s = shape ? shape > 1 ? shape > 2 ? shape > 3 ?
                Math.sign(Math.cos((f = Math.sin(t)) * Math.PI)) :
                (1 - (2 * t / Math.PI % 2 + 2) % 2) :
                1 - 2 * Math.abs(Math.round(t / Math.PI) - t / Math.PI) :
                f = Math.sin(t) :
                f = Math.sin(t);
            s = (j ? 1 - tremolo + tremolo * Math.sin(Math.PI * 2 * i / sampleRate * tremolo) : 1) *
                Math.sign(f) * Math.abs(f) ** shapeCurve *
                (i < sampleRate * attack ? i / (sampleRate * attack) :
                    i < sampleRate * (attack + sustain) ? 1 :
                        i < sampleRate * (attack + sustain + release) ?
                            1 - (i - sampleRate * (attack + sustain)) / (sampleRate * release) :
                            i < length ? (i - sampleRate * (attack + sustain + release)) / (sampleRate * decay) *
                                (sustainVolume - 1) + 1 : 0);
            s = delay ? s / 2 + (delay > sampleRate * i ? 0 :
                (i < sampleRate * delay ? s * Math.abs(i / (sampleRate * delay) - 1) :
                    (b[i - sampleRate * delay | 0] || 0)) / 2) : s;
            if (modulation)
                frequency += (startFreq * (Math.sin(Math.PI * 2 * tm / sampleRate) * modulation));
            frequency += slide;
            slide += deltaSlide;
            if (pitchJump && !(++r % (pitchJumpTime * sampleRate | 0))) { frequency += pitchJump; startSlide += pitchJump; }
            if (repeatTime && !(++tm % (repeatTime * sampleRate | 0))) { frequency = startFreq; slide = startSlide; j = !j; }
            t += frequency + noise * (Math.random() * 2 - 1) * noise;
        }
    }

    const buffer = audioCtx.createBuffer(1, length, sampleRate);
    buffer.getChannelData(0).set(b);
    const node = audioCtx.createBufferSource();
    node.buffer = buffer;
    node.connect(audioCtx.destination);
    node.start();
    return node;
}

// ─── Named sound functions ────────────────────────────────────────────────────
// All wrapped in try/catch — audio should never crash the game.

/** Short snappy shot sound. Call on every bullet fired. */
export function playShoot(): void {
    try {
        // High freq, fast attack, short release, slight downward slide
        zzfx(0.4, 0.05, 520, 0, 0.02, 0.08, 1, 1.5, -0.6, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0);
    } catch (_) { /* silent fail */ }
}

/** Pop/zap/thud on enemy death — varies by type. */
export function playEnemyDeath(type: "basic" | "fast" | "tank"): void {
    try {
        if (type === "basic") {
            // Mid pop with short decay
            zzfx(0.6, 0.1, 180, 0, 0.02, 0.15, 0, 1, -2, 0, 0, 0, 0, 0.1, 0, 0, 0, 1, 0.05, 0);
        } else if (type === "fast") {
            // High zap — quick pitch drop
            zzfx(0.5, 0.05, 680, 0, 0, 0.1, 2, 1, -5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0);
        } else {
            // Tank: low thud with noise
            zzfx(0.8, 0.05, 60, 0, 0.02, 0.2, 0, 1.2, -1, 0, 0, 0, 0, 0.4, 0, 4, 0, 1, 0.05, 0);
        }
    } catch (_) { /* silent fail */ }
}

/** Low distorted thud when player takes damage. */
export function playPlayerHit(): void {
    try {
        zzfx(1.0, 0.1, 80, 0, 0.01, 0.25, 3, 1.5, -1.5, 0, 0, 0, 0, 0.3, 0, 6, 0, 0.8, 0.05, 0);
    } catch (_) { /* silent fail */ }
}

/** Brief ascending sweep on wave start. */
export function playWaveStart(): void {
    try {
        zzfx(0.4, 0, 300, 0.05, 0.1, 0.15, 1, 1, 3, 0, 180, 0.1, 0, 0, 0, 0, 0, 1, 0, 0);
    } catch (_) { /* silent fail */ }
}

/**
 * Warms up the AudioContext on first user interaction.
 * Call this once on the first mouse click before any sounds play.
 */
export function initAudio(): void {
    try { getCtx(); } catch (_) { /* silent fail */ }
}
