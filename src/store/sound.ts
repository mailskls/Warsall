// Synthesized Web Audio sound effects — no external assets.
// Pleasant, soft, fintech/mini-app aesthetic. AudioContext initializes
// safely on the first user-initiated call (browsers block autoplay).

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = true;

  /** Lazily create the AudioContext. Must be triggered by a user gesture. */
  private ensure(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    }
    try {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
    return this.ctx;
  }

  /** Call on any user gesture to unlock audio on mobile/Safari. */
  unlock() {
    this.ensure();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
  }

  // ---- primitives ----

  /** A single oscillator note with an exponential decay envelope. */
  private tone(
    freq: number,
    dur: number,
    opts: { type?: OscillatorType; vol?: number; delay?: number; attack?: number; glideTo?: number } = {},
  ) {
    if (!this.enabled) return;
    const ctx = this.ensure(); if (!ctx || !this.master) return;
    const { type = 'sine', vol = 0.08, delay = 0, attack = 0.005, glideTo } = opts;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain); gain.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  /** Filtered noise burst, useful for thuds/whooshes. */
  private noise(dur: number, opts: { vol?: number; type?: BiquadFilterType; freq?: number; q?: number; delay?: number; glideTo?: number } = {}) {
    if (!this.enabled) return;
    const ctx = this.ensure(); if (!ctx || !this.master) return;
    const { vol = 0.08, type = 'lowpass', freq = 400, q = 1, delay = 0, glideTo } = opts;
    const t0 = ctx.currentTime + delay;
    const frames = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type; filter.frequency.setValueAtTime(freq, t0); filter.Q.value = q;
    if (glideTo) filter.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter); filter.connect(gain); gain.connect(this.master);
    src.start(t0); src.stop(t0 + dur);
  }

  // ---- UI sounds ----

  /** Soft glassy tap for clicks/navigation. */
  click() {
    this.tone(520, 0.06, { type: 'sine', vol: 0.05 });
    this.tone(1040, 0.04, { type: 'sine', vol: 0.02, delay: 0.005 });
  }

  // ---- Mines ----

  /** Ascending crystal chime; pitch rises with each consecutive gem (step ≥ 0). */
  gem(step = 0) {
    const base = 660 * Math.pow(2, Math.min(step, 12) / 12);
    this.tone(base, 0.12, { type: 'sine', vol: 0.06 });
    this.tone(base * 1.5, 0.14, { type: 'sine', vol: 0.04, delay: 0.02 });
    this.tone(base * 2, 0.1, { type: 'sine', vol: 0.02, delay: 0.04 });
  }

  /** Soft muffled low-frequency thud for bomb/loss. */
  bomb() {
    this.tone(150, 0.28, { type: 'sine', vol: 0.09, glideTo: 60 });
    this.noise(0.3, { vol: 0.05, type: 'lowpass', freq: 220, q: 2, glideTo: 80 });
  }

  // ---- Crash ----

  /** Subtle gentle ascending tick as the multiplier climbs (varies by step). */
  crashTick(step = 0) {
    const f = 440 + Math.min(step, 20) * 28;
    this.tone(f, 0.03, { type: 'triangle', vol: 0.02 });
  }

  /** Crisp celebratory two-tone bell chord on successful cashout. */
  cashout() {
    this.tone(784, 0.16, { type: 'sine', vol: 0.06 });        // G5
    this.tone(1175, 0.22, { type: 'sine', vol: 0.06, delay: 0.08 }); // D6
    this.tone(1568, 0.28, { type: 'sine', vol: 0.03, delay: 0.16 }); // G6
  }

  /** Soft descending whoosh on crash. */
  crash() {
    this.noise(0.5, { vol: 0.07, type: 'lowpass', freq: 800, q: 0.7, glideTo: 120 });
    this.tone(300, 0.4, { type: 'sine', vol: 0.05, glideTo: 90 });
  }

  // ---- Dice / Bubbles ----

  /** Rapid soft rolling tick during roll/inflation. */
  rollTick() {
    this.tone(660, 0.025, { type: 'triangle', vol: 0.018 });
  }

  /** Bubble inflate tick (slightly softer, airy). */
  bubbleTick() {
    this.tone(520, 0.03, { type: 'sine', vol: 0.02 });
  }

  // ---- Win / Lose ----

  /** Positive ascending chime for a win. */
  win() {
    this.tone(660, 0.1, { type: 'triangle', vol: 0.06 });
    this.tone(880, 0.12, { type: 'triangle', vol: 0.06, delay: 0.09 });
    this.tone(1320, 0.2, { type: 'sine', vol: 0.04, delay: 0.18 });
  }

  /** Soft muted tap for a loss. */
  lose() {
    this.tone(200, 0.18, { type: 'sine', vol: 0.05, glideTo: 140 });
  }

  // ---- Coins / Bonus ----

  /** Sparkling coin-cascade arpeggio for bonus claim or refill. */
  coins() {
    const notes = [784, 988, 1175, 1568, 1976]; // G5 B5 D6 G6 B6
    notes.forEach((f, i) => {
      this.tone(f, 0.18, { type: 'sine', vol: 0.05, delay: i * 0.06 });
      this.tone(f * 2, 0.12, { type: 'sine', vol: 0.02, delay: i * 0.06 + 0.01 });
    });
  }
}

export const sfx = new SoundEngine();
