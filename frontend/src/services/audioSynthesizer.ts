/**
 * Free Dynamic In-Browser Web Audio Synthesizer & Procedural Foley Engine
 * Composes unique soundtracks and Foley cues tailored to each story's genre, tone, and tracks.
 * 100% Client-side, zero cost, zero external API dependencies.
 */

import { SoundEffect } from '../types';

export interface StoryAudioProfile {
  genre?: string;
  tone?: string;
  projectType?: string;
  tempoAndInstruments?: string;
  trackName?: string;
  trackIndex?: number;
}

class DynamicAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private atmosphericNode: AudioNode | null = null;
  private intervalTimer: any = null;
  private currentProfile: StoryAudioProfile = {};

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Derives unique musical chords, root key, scale, and instrument waveforms
   * matching the specific story's genre, tone, and track title.
   */
  private deriveComposition(profile: StoryAudioProfile) {
    const genre = (profile.genre || '').toLowerCase();
    const tone = (profile.tone || '').toLowerCase();
    const track = (profile.trackName || '').toLowerCase();
    const instruments = (profile.tempoAndInstruments || '').toLowerCase();

    // Unique seed for this story and track
    const seed = this.hashString(`${genre}_${tone}_${track}_${profile.trackIndex || 0}`);

    // Base root notes: C2 (65.41), D2 (73.42), Eb2 (77.78), E2 (82.41), F2 (87.31), G2 (98.00), A2 (110.00), Bb2 (116.54)
    const roots = [65.41, 73.42, 77.78, 82.41, 87.31, 98.00, 110.00, 116.54];
    const root = roots[seed % roots.length];

    // Determine scale intervals based on story genre/tone
    let intervals: number[][];

    if (genre.includes('cyber') || genre.includes('sci-fi')) {
      // Phrygian & Minor modal tension (1, b2, b3, 4, 5, b6, b7)
      intervals = [
        [1.0, 1.5, 2.0, 2.25],       // Root + 5th + Octave + minor 9th
        [0.89, 1.33, 1.78, 2.0],     // Lowered dominant
        [1.12, 1.5, 1.88, 2.25],     // Modal tension
        [1.0, 1.2, 1.5, 1.78]        // Sub-bass resolution
      ];
    } else if (genre.includes('horror') || genre.includes('mystery') || tone.includes('eerie') || tone.includes('claustrophobic')) {
      // Diminished & Suspended dark cinematic intervals
      intervals = [
        [1.0, 1.189, 1.414, 2.0],    // Diminished triad (tritone tension)
        [0.94, 1.25, 1.414, 1.88],   // Suspended 4th
        [1.0, 1.33, 1.5, 2.12],      // Ominous pedal
        [0.84, 1.12, 1.414, 1.68]    // Dark resolution
      ];
    } else if (genre.includes('fantasy') || genre.includes('adventure') || tone.includes('epic')) {
      // Lydian / Dorian soaring noble intervals (1, 2, 3, #4, 5, 6, 7)
      intervals = [
        [1.0, 1.25, 1.5, 2.0],       // Major 5th & Octave
        [1.12, 1.33, 1.68, 2.25],    // Suspended 2nd
        [1.25, 1.5, 1.88, 2.5],      // Lydian sharp 4th shimmer
        [1.0, 1.33, 1.5, 2.0]        // Triumphant anchor
      ];
    } else if (genre.includes('romance') || tone.includes('emotional') || tone.includes('poetic')) {
      // Melancholic Add9 / Minor 7th emotional chords
      intervals = [
        [1.0, 1.2, 1.5, 1.8],        // Minor 7th
        [1.12, 1.4, 1.68, 2.25],     // Add 9th warmth
        [0.8, 1.2, 1.5, 1.6],        // Inverted 6th
        [1.0, 1.25, 1.5, 2.0]        // Gentle resolution
      ];
    } else {
      // Narrative / Audio Drama / Noir subtle atmospheric progression
      intervals = [
        [1.0, 1.33, 1.5, 2.0],
        [0.9, 1.2, 1.5, 1.8],
        [1.12, 1.4, 1.68, 2.0],
        [1.0, 1.25, 1.5, 1.87]
      ];
    }

    // Convert intervals to actual frequencies
    const chordFrequencies = intervals.map((chord) =>
      chord.map((mult) => Math.round(root * mult * 100) / 100)
    );

    // Waveform timbre selection based on mentioned instruments
    let waveType: OscillatorType = 'sine';
    let filterCutoff = 550;
    let filterQ = 2.0;

    if (instruments.includes('piano') || instruments.includes('felt') || instruments.includes('keys')) {
      waveType = 'triangle';
      filterCutoff = 800;
      filterQ = 1.2;
    } else if (instruments.includes('cello') || instruments.includes('strings') || instruments.includes('orchestral')) {
      waveType = 'sawtooth';
      filterCutoff = 650;
      filterQ = 3.2;
    } else if (instruments.includes('synth') || instruments.includes('moog') || instruments.includes('bass')) {
      waveType = 'sawtooth';
      filterCutoff = 450;
      filterQ = 4.0;
    } else {
      waveType = 'sine';
      filterCutoff = 600;
      filterQ = 1.8;
    }

    return {
      root,
      chordFrequencies,
      waveType,
      filterCutoff,
      filterQ,
      isSubtle: (profile.projectType || '') === 'podcast'
    };
  }

  /**
   * Plays dynamic soundtrack based on story profile
   */
  public play(profile?: StoryAudioProfile) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (profile) this.currentProfile = profile;
    this.stopNodes();
    this.isPlaying = true;

    const comp = this.deriveComposition(this.currentProfile);
    let chordIndex = 0;

    const playChord = (chord: number[]) => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      this.stopOscillators();

      // Dynamic low-pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(comp.filterCutoff, this.ctx.currentTime);
      filter.Q.setValueAtTime(comp.filterQ, this.ctx.currentTime);
      filter.connect(this.masterGain);

      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = comp.waveType;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Expressive pitch LFO for organic instrument drift
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.18 + i * 0.08, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.8, this.ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();
        this.activeOscillators.push(lfo);

        // Smooth volume envelope
        const targetVol = (comp.isSubtle ? 0.08 : 0.14) / (i + 1);
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(targetVol, this.ctx.currentTime + 2.2);

        osc.connect(gain);
        gain.connect(filter);
        osc.start();
        this.activeOscillators.push(osc);
      });
    };

    // Play first chord
    playChord(comp.chordFrequencies[0]);

    // Cycle chords every 7 seconds
    this.intervalTimer = setInterval(() => {
      chordIndex = (chordIndex + 1) % comp.chordFrequencies.length;
      playChord(comp.chordFrequencies[chordIndex]);
    }, 7000);

    // Dynamic atmospheric bed (rain / tape hiss / wind)
    this.startAtmosphericBed(this.currentProfile);
  }

  private startAtmosphericBed(profile: StoryAudioProfile) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    const genre = (profile.genre || '').toLowerCase();

    if (genre.includes('podcast') || genre.includes('mystery')) {
      // Tape hiss / vinyl atmosphere
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);
    } else {
      // Rain / cinematic room tone
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);
    }

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.012, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.atmosphericNode = whiteNoise;
  }

  private stopOscillators() {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  private stopNodes() {
    this.stopOscillators();
    if (this.atmosphericNode) {
      try {
        (this.atmosphericNode as any).stop();
        this.atmosphericNode.disconnect();
      } catch (e) {}
      this.atmosphericNode = null;
    }
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  public stop() {
    this.stopNodes();
    this.isPlaying = false;
  }

  /**
   * Synthesizes customized Foley / SFX cues tailored to the exact SoundEffect object.
   */
  public playCustomSFX(sfx: SoundEffect | { name: string; category?: string; description?: string }) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const text = `${sfx.name} ${sfx.category || ''} ${sfx.description || ''}`.toLowerCase();
    const now = this.ctx.currentTime;

    if (text.includes('rain') || text.includes('water') || text.includes('drop') || text.includes('stream')) {
      // Realistic rain droplet patter
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.08 + Math.random() * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800 + Math.random() * 800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.06);
      }
    } else if (text.includes('thunder') || text.includes('explosion') || text.includes('boom') || text.includes('hit') || text.includes('impact') || text.includes('crash')) {
      // Cinematic sub-bass impact boom with rumble
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.25);
    } else if (text.includes('servo') || text.includes('robot') || text.includes('gear') || text.includes('mechanical') || text.includes('clockwork')) {
      // Mechanical actuator servo sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.32);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.33);
    } else if (text.includes('laser') || text.includes('beam') || text.includes('zap') || text.includes('emp') || text.includes('energy')) {
      // Futuristic laser stinger
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.28);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (text.includes('chime') || text.includes('bell') || text.includes('magic') || text.includes('music box') || text.includes('crystal')) {
      // Music box / chime harmonics
      [587.33, 739.99, 880.00, 1174.66].forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 1.25);
      });
    } else if (text.includes('footstep') || text.includes('walk') || text.includes('concrete') || text.includes('step')) {
      // Footstep Foley tap
      for (let i = 0; i < 2; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.25;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.12);
      }
    } else if (text.includes('tape') || text.includes('radio') || text.includes('static') || text.includes('frequency') || text.includes('pulse')) {
      // Radio frequency pulse
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(640, now + 0.1);
      osc.frequency.setValueAtTime(480, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    } else {
      // Default cinematic resonant cue
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.5);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.55);
    }
  }
}

export const dynamicAudioSynthesizer = new DynamicAudioSynthesizer();
