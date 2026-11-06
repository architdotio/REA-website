const TRACKS = [
  '/media/audio/disrespectful.mp3',
  '/media/audio/come-n-go.mp3',
];

const CHAPTER_FREQS = [480, 850, 1700, 520, 1300, 2400, 15000];

function createImpulseBuffer(
  ctx: AudioContext,
  duration: number,
  decay: number
): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

function getStoredSound(): string | null {
  try {
    return localStorage.getItem('ot-sound');
  } catch {
    return null;
  }
}

function setStoredSound(val: string): void {
  try {
    localStorage.setItem('ot-sound', val);
  } catch {}
}

export interface SoundUpdateParams {
  scrollV?: number;
  sceneF?: number;
  fly?: number;
  speed?: number;
  seam?: number;
  crack?: number;
  shatter?: number;
  awake?: number;
  footer?: number;
  modal?: boolean;
  flash?: number;
}

export class AudioManager {
  private ctx: AudioContext | null = null;
  private nodes: any = null;
  private userEnabled: boolean = getStoredSound() !== 'off';
  private isPlaying: boolean = false;
  private canPlaySfx: boolean = true;
  private gates: Record<string, boolean> = {
    seam: true,
    lift: true,
    eyes: true,
    door: true,
  };
  private lastSfxTimes: Record<string, number> = {};
  private lastTime = 0;
  private trackIndex = 0;
  private buttonEl: HTMLElement | null = null;

  constructor(buttonEl?: HTMLElement | null) {
    this.buttonEl = buttonEl || null;

    if (typeof window !== 'undefined') {
      window.addEventListener('sfx', (e: any) => {
        const detail = e.detail;
        this.playSfx(detail?.name || detail, detail?.arg);
      });

      let lastHoverTarget: Element | null = null;
      window.addEventListener('pointerover', (e) => {
        const target = (e.target as HTMLElement)?.closest?.(
          'a, button, .wl, .wm-thumb'
        );
        if (target && target !== lastHoverTarget) {
          this.playSfx('hover');
        }
        lastHoverTarget = target || null;
      });

      window.addEventListener(
        'click',
        (e) => {
          const target = (e.target as HTMLElement)?.closest?.('a, button');
          if (target) {
            this.playSfx('click');
          }
        },
        true
      );

      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return;
        if (document.hidden) {
          this.ctx.suspend();
          this.nodes?.el?.pause();
        } else if (this.isPlaying) {
          this.ctx.resume();
          this.nodes?.el?.play().catch(() => {});
        }
      });
    }

    this.updateButtonUI();
  }

  public setButton(el: HTMLElement | null) {
    this.buttonEl = el;
    this.updateButtonUI();
  }

  private initContext() {
    if (this.ctx) return;
    const AudioCtxClass =
      window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtxClass();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;

    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 20000;
    tone.Q.value = 0.3;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 24;
    comp.ratio.value = 3;
    comp.attack.value = 0.05;
    comp.release.value = 0.4;

    master.connect(tone).connect(comp).connect(ctx.destination);

    // Reverb
    const reverb = ctx.createConvolver();
    reverb.buffer = createImpulseBuffer(ctx, 4.2, 2.6);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.55;
    reverb.connect(reverbGain).connect(master);

    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.7;
    dryGain.connect(master);

    const bus = ctx.createGain();
    bus.connect(dryGain);
    bus.connect(reverb);

    // Background track
    const audioEl = new Audio(TRACKS[0]);
    audioEl.preload = 'auto';
    audioEl.crossOrigin = 'anonymous';
    audioEl.addEventListener('ended', () => {
      this.trackIndex = (this.trackIndex + 1) % TRACKS.length;
      audioEl.src = TRACKS[this.trackIndex];
      audioEl.play().catch(() => {});
    });

    const songF = ctx.createBiquadFilter();
    songF.type = 'lowpass';
    songF.frequency.value = CHAPTER_FREQS[0];
    songF.Q.value = 0.9;

    const songG = ctx.createGain();
    songG.gain.value = 0.8;

    const send = ctx.createGain();
    send.gain.value = 0.12;

    const peak = ctx.createBiquadFilter();
    peak.type = 'peaking';
    peak.frequency.value = 900;
    peak.Q.value = 1.6;
    peak.gain.value = 0;

    ctx.createMediaElementSource(audioEl)
      .connect(songF)
      .connect(peak)
      .connect(songG);
    songG.connect(master);
    songG.connect(send).connect(reverb);

    // Ambient noise buffer (pink/brown)
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const g = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < g.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      g[i] = (b0 + b1 + b2 + white * 0.02) * 0.9;
    }

    const noiseSrc = () => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      src.loop = true;
      src.start(0, Math.random() * 2.5);
      return src;
    };

    // Air filter
    const airF = ctx.createBiquadFilter();
    airF.type = 'lowpass';
    airF.frequency.value = 300;
    airF.Q.value = 0.9;
    const airG = ctx.createGain();
    airG.gain.value = 0;
    noiseSrc().connect(airF).connect(airG).connect(bus);

    // Seam filter
    const seamF = ctx.createBiquadFilter();
    seamF.type = 'bandpass';
    seamF.frequency.value = 400;
    seamF.Q.value = 0.8;
    const seamG = ctx.createGain();
    seamG.gain.value = 0;
    noiseSrc().connect(seamF).connect(seamG).connect(bus);

    // Rumble
    const rumbleF = ctx.createBiquadFilter();
    rumbleF.type = 'lowpass';
    rumbleF.frequency.value = 120;
    rumbleF.Q.value = 0.7;
    const rumbleG = ctx.createGain();
    rumbleG.gain.value = 0;
    noiseSrc().connect(rumbleF).connect(rumbleG).connect(bus);

    // Stress / flutter
    const stressF = ctx.createBiquadFilter();
    stressF.type = 'bandpass';
    stressF.frequency.value = 2600;
    stressF.Q.value = 1.2;
    const stressG = ctx.createGain();
    stressG.gain.value = 0;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5.3;
    const flutterG = ctx.createGain();
    flutterG.gain.value = 0;
    lfo.connect(flutterG).connect(stressG.gain);
    lfo.start();
    noiseSrc().connect(stressF).connect(stressG).connect(bus);

    // Sub sine
    const subG = ctx.createGain();
    subG.gain.value = 0;
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = 41.2;
    subOsc.connect(subG).connect(bus);
    subOsc.start();

    this.nodes = {
      master,
      tone,
      el: audioEl,
      songF,
      songG,
      peak,
      send,
      airF,
      airG,
      seamF,
      seamG,
      rumbleF,
      rumbleG,
      stressF,
      stressG,
      flutterG,
      subG,
      bus,
      noiseSrc,
    };
  }

  private envelope(
    gain: GainNode,
    time: number,
    attack: number,
    peak: number,
    decay: number
  ) {
    gain.gain.setValueAtTime(1e-4, time);
    gain.gain.exponentialRampToValueAtTime(peak, time + attack);
    gain.gain.exponentialRampToValueAtTime(1e-4, time + attack + decay);
  }

  private playTone(
    freq: number,
    {
      type = 'sine' as OscillatorType,
      a = 0.005,
      d = 0.25,
      peak = 0.08,
      to = null as number | null,
      at = 0,
    } = {}
  ) {
    if (!this.ctx || !this.nodes) return;
    const time = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    if (to) {
      osc.frequency.exponentialRampToValueAtTime(to, time + a + d);
    }
    const gain = this.ctx.createGain();
    this.envelope(gain, time, a, peak, d);
    osc.connect(gain).connect(this.nodes.bus);
    osc.start(time);
    osc.stop(time + a + d + 0.05);
  }

  private playSweep({
    from = 300,
    to = 2400,
    back = 400,
    a = 0.35,
    d = 0.9,
    peak = 0.2,
    q = 1.4,
  } = {}) {
    if (!this.ctx || !this.nodes) return;
    const time = this.ctx.currentTime;
    const src = this.nodes.noiseSrc();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, time);
    filter.frequency.exponentialRampToValueAtTime(to, time + a);
    filter.frequency.exponentialRampToValueAtTime(back, time + a + d);

    const gain = this.ctx.createGain();
    this.envelope(gain, time, a, peak, d);
    src.connect(filter).connect(gain).connect(this.nodes.bus);
    src.stop(time + a + d + 0.1);
  }

  private playBurst({
    n = 30,
    dur = 1.5,
    fMin = 2500,
    fMax = 8000,
    peak = 0.04,
    at = 0,
  } = {}) {
    if (!this.ctx || !this.nodes) return;
    const startTime = this.ctx.currentTime + at;
    for (let i = 0; i < n; i++) {
      const frac = Math.pow(Math.random(), 1.8);
      const t = startTime + frac * dur;
      const src = this.nodes.noiseSrc();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 9;
      filter.frequency.value = fMin * Math.pow(fMax / fMin, Math.random());
      const gain = this.ctx.createGain();
      const len = 0.012 + Math.random() * 0.05;
      this.envelope(
        gain,
        t,
        0.002,
        peak * (1 - frac * 0.8) * (0.4 + Math.random() * 0.6),
        len
      );
      src.connect(filter).connect(gain).connect(this.nodes.bus);
      src.stop(t + len + 0.05);
    }
  }

  public playSfx(name: string, arg: any = 1) {
    if (!this.ctx || !this.isPlaying) return;
    const now = performance.now();
    if (now - (this.lastSfxTimes[name] || 0) < 60) return;
    this.lastSfxTimes[name] = now;

    switch (name) {
      case 'tag': {
        const idx = Number(arg) || 0;
        const freqs = [880, 988, 1175, 1319, 1568];
        const f = freqs[idx % 5];
        this.playTone(f, { d: 0.35, peak: 0.05 });
        this.playTone(f * 2, { d: 0.12, peak: 0.015 });
        break;
      }
      case 'card':
        this.playTone(1320, { type: 'triangle', d: 0.09, peak: 0.03 });
        break;
      case 'open':
        this.playTone(420, { d: 0.35, peak: 0.07, to: 840 });
        this.playSweep({ from: 500, to: 3000, back: 900, a: 0.12, d: 0.35, peak: 0.07 });
        break;
      case 'close':
        this.playTone(760, { d: 0.3, peak: 0.05, to: 380 });
        this.playSweep({ from: 2600, to: 700, back: 300, a: 0.08, d: 0.3, peak: 0.05 });
        break;
      case 'seam':
        this.playSweep({ from: 220, to: 2600, back: 260, a: 0.45, d: 1.1, peak: 0.16, q: 0.9 });
        break;
      case 'eyes':
        this.playTone(38, { a: 0.5, d: 1.6, peak: 0.16, to: 55 });
        this.playSweep({ from: 180, to: 2600, back: 900, a: 1.1, d: 0.9, peak: 0.1, q: 2.2 });
        [110, 164.8, 220].forEach((freq, i) => {
          this.playTone(freq, { type: 'triangle', a: 0.45, d: 1.8, peak: 0.022 - i * 0.004, at: 0.5 + i * 0.05 });
        });
        break;
      case 'release':
        this.playTone(48, { a: 0.01, d: 2, peak: 0.34, to: 28 });
        this.playTone(96, { type: 'triangle', a: 0.01, d: 0.7, peak: 0.07, to: 48 });
        this.playSweep({ from: 2400, to: 600, back: 140, a: 0.04, d: 1.8, peak: 0.2, q: 0.7 });
        this.playBurst({ n: 26, dur: 1.4, fMin: 3000, fMax: 9000, peak: 0.03, at: 0.04 });
        break;
      case 'hover':
        this.playTone(2100, { type: 'sine', d: 0.05, peak: 0.012 });
        break;
      case 'click':
        this.playTone(900, { d: 0.08, peak: 0.03, to: 600 });
        break;
      case 'title':
        this.playTone(523.3, { a: 0.02, d: 1.1, peak: 0.025 });
        this.playTone(784, { a: 0.02, d: 1.3, peak: 0.018, at: 0.09 });
        break;
      case 'door':
        this.playTone(55, { a: 0.02, d: 1.6, peak: 0.3, to: 30 });
        this.playSweep({ from: 3000, to: 400, back: 120, a: 0.2, d: 1.5, peak: 0.16, q: 0.8 });
        break;
      case 'aura': {
        const amp = typeof arg === 'number' ? arg : 1;
        this.playTone(92, { a: 0.03, d: 0.9, peak: 0.06 * amp, to: 58 });
        this.playTone(184, { type: 'triangle', a: 0.02, d: 0.45, peak: 0.012 * amp, to: 116 });
        this.playSweep({ from: 720, to: 260, back: 140, a: 0.06, d: 0.8, peak: 0.045 * amp, q: 1.1 });
        break;
      }
      case 'lift':
        this.playTone(70, { a: 0.01, d: 0.6, peak: 0.25, to: 36 });
        this.playSweep({ from: 150, to: 1800, back: 500, a: 0.7, d: 1.4, peak: 0.18 });
        break;
    }
  }

  public update({
    scrollV = 0,
    sceneF = 0,
    fly = 0,
    speed = 0,
    seam = 0,
    crack = 0,
    shatter = 0,
    awake = 0,
    footer = 0,
    modal = false,
    flash = 0,
  }: SoundUpdateParams = {}) {
    if (!this.ctx || !this.isPlaying || !this.nodes) return;
    const now = this.ctx.currentTime;
    const maxIdx = CHAPTER_FREQS.length - 1;
    const curIdx = Math.floor(Math.max(0, Math.min(maxIdx, sceneF)));
    const nextIdx = Math.min(maxIdx, curIdx + 1);
    const weight = Math.max(0, Math.min(1, sceneF - curIdx));
    let freq = Math.exp(
      Math.log(CHAPTER_FREQS[curIdx]) * (1 - weight) +
        Math.log(CHAPTER_FREQS[nextIdx]) * weight
    );

    const crackFactor =
      Math.max(0, Math.min(1, crack)) * (1 - Math.min(1, shatter * 1.4));
    freq *= 1 - crackFactor * 0.55;
    freq *= 1 + Math.min(1, shatter) * (1 - awake) * 1.5;
    freq *= 1 + fly * 0.25;
    freq *= 1 - Math.min(1, Math.max(0, (speed - 25) / 90)) * 0.55 * (1 - fly);

    const vel = Math.min(1, scrollV * 1.6);
    freq *= 1 - vel * 0.6;
    this.nodes.send.gain.setTargetAtTime(0.12 + vel * 0.9, now, 0.15);
    this.nodes.peak.gain.setTargetAtTime(vel * 9, now, 0.12);
    this.nodes.peak.frequency.setTargetAtTime(500 + vel * 2200, now, 0.15);

    freq *= 1 - Math.min(1, seam) * 0.88;
    const modalAtten = modal ? 0.3 : 1;
    if (modal) freq = Math.min(freq, 420);
    freq = Math.min(freq, 20000 - footer * 19300);

    this.nodes.songF.frequency.setTargetAtTime(
      Math.max(120, Math.min(19000, freq)),
      now,
      0.18
    );
    this.nodes.songF.Q.value = 0.9 + seam * 3;
    this.nodes.songG.gain.setTargetAtTime(
      0.8 * modalAtten * (1 - footer * 0.3),
      now,
      0.4
    );

    const speedNorm = Math.min(1, speed / 60);
    this.nodes.airG.gain.setTargetAtTime(
      (fly * 0.13 + speedNorm * 0.09) * modalAtten,
      now,
      0.35
    );
    this.nodes.airF.frequency.setTargetAtTime(
      260 + fly * 240 + speedNorm * 900,
      now,
      0.3
    );
    this.nodes.seamG.gain.setTargetAtTime(seam * 0.3 * modalAtten, now, 0.12);
    this.nodes.seamF.frequency.setTargetAtTime(280 + seam * 1300, now, 0.12);

    const rumbleAmt =
      Math.max(0, Math.min(1, crack)) * (1 - Math.min(1, shatter * 1.6));
    this.nodes.rumbleG.gain.setTargetAtTime(rumbleAmt * 0.22 * modalAtten, now, 0.5);
    this.nodes.rumbleF.frequency.setTargetAtTime(90 + rumbleAmt * 260, now, 0.5);
    this.nodes.stressG.gain.setTargetAtTime(
      rumbleAmt * rumbleAmt * 0.012 * modalAtten,
      now,
      0.4
    );
    this.nodes.flutterG.gain.setTargetAtTime(
      rumbleAmt * rumbleAmt * 0.008 * modalAtten,
      now,
      0.4
    );
    this.nodes.stressF.frequency.setTargetAtTime(1800 + rumbleAmt * 1800, now, 0.6);

    this.nodes.subG.gain.setTargetAtTime(
      awake * (1 - fly) * 0.04 * modalAtten,
      now,
      0.6
    );

    // Gates
    if (seam > 0.7 && this.gates.seam) {
      this.gates.seam = false;
      this.playSfx('seam');
    } else if (seam < 0.3) {
      this.gates.seam = true;
    }

    if (flash > 0.4 && this.gates.door) {
      this.gates.door = false;
      this.playSfx('door');
    } else if (flash < 0.1) {
      this.gates.door = true;
    }

    if (awake > 0.55 && this.gates.eyes) {
      this.gates.eyes = false;
      this.playSfx('eyes');
    } else if (awake < 0.3) {
      this.gates.eyes = true;
    }

    if (fly > 0.05 && fly < 0.9 && this.gates.lift) {
      this.gates.lift = false;
      this.playSfx('lift');
    } else if (fly <= 0.001) {
      this.gates.lift = true;
    }
  }

  public play() {
    if (!this.userEnabled) return;
    this.initContext();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.nodes?.el?.play().catch(() => {});
    if (this.ctx && this.nodes) {
      this.nodes.master.gain.setTargetAtTime(0.9, this.ctx.currentTime, 1.6);
    }
    this.updateButtonUI();
  }

  public pause() {
    if (this.ctx && this.nodes) {
      this.nodes.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
      setTimeout(() => {
        if (!this.isPlaying) {
          this.nodes?.el?.pause();
        }
      }, 900);
    }
    this.isPlaying = false;
    this.updateButtonUI();
  }

  public toggle() {
    this.userEnabled = !this.userEnabled || !this.isPlaying;
    setStoredSound(this.userEnabled ? 'on' : 'off');
    if (this.userEnabled) {
      this.play();
    } else {
      this.pause();
    }
  }

  public enter(withSound: boolean) {
    this.userEnabled = withSound;
    setStoredSound(this.userEnabled ? 'on' : 'off');
    if (withSound) {
      this.play();
    } else {
      this.updateButtonUI();
    }
  }

  private updateButtonUI() {
    if (!this.buttonEl) return;
    const active = this.isPlaying && this.userEnabled;
    this.buttonEl.setAttribute('aria-pressed', String(active));
    this.buttonEl.classList.toggle('on', active);
    const span = this.buttonEl.querySelector('span');
    if (span) {
      span.textContent = active ? 'on' : 'off';
    }
  }

  public get on(): boolean {
    return this.isPlaying && this.userEnabled;
  }
}
