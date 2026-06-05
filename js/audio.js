// ============================================================
// audio.js — Procedural Web Audio API sound system
// ============================================================

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this._musicNodes = [];
    this._musicTimeout = null;
    this._musicPlaying = false;
    this._currentTheme = null;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.35;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);
    } catch(e) {
      console.warn('Web Audio not available:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  tone(freq, duration, type = 'sine', gain = 0.5, delay = 0, targetGain = null) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(this.sfxGain);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      const startTime = this.ctx.currentTime + delay;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
      return osc;
    } catch(e) {}
  }

  sfxJump(isDouble = false) {
    this.resume();
    if (isDouble) {
      this.tone(350, 0.08, 'sine', 0.4, 0);
      this.tone(520, 0.1, 'sine', 0.5, 0.06);
      this.tone(700, 0.12, 'sine', 0.4, 0.14);
    } else {
      this.tone(280, 0.06, 'sine', 0.4, 0);
      this.tone(420, 0.1, 'sine', 0.45, 0.05);
      this.tone(560, 0.1, 'sine', 0.35, 0.12);
    }
  }

  sfxDash() {
    this.resume();
    for (let i = 0; i < 6; i++) {
      this.tone(200 + i * 80, 0.04, 'sawtooth', 0.2, i * 0.025);
    }
  }

  sfxLetter(index) {
    this.resume();
    // Musical scale: C4=261, D=293, E=329, F=349, G=392, A=440, B=493, C5=523
    const scale = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319];
    const freq = scale[index % scale.length];
    this.tone(freq, 0.15, 'triangle', 0.55, 0);
    this.tone(freq * 1.5, 0.1, 'sine', 0.25, 0.05);
  }

  sfxWordComplete() {
    this.resume();
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      this.tone(freq, 0.2, 'triangle', 0.5, i * 0.12);
      this.tone(freq * 1.25, 0.15, 'sine', 0.2, i * 0.12 + 0.05);
    });
  }

  sfxStomp() {
    this.resume();
    this.tone(150, 0.08, 'square', 0.5, 0);
    this.tone(100, 0.12, 'square', 0.4, 0.06);
    this.tone(80, 0.15, 'sine', 0.3, 0.1);
  }

  sfxHurt() {
    this.resume();
    this.tone(400, 0.08, 'sawtooth', 0.5, 0);
    this.tone(300, 0.1, 'sawtooth', 0.45, 0.07);
    this.tone(200, 0.12, 'sawtooth', 0.4, 0.15);
    this.tone(150, 0.15, 'square', 0.35, 0.22);
  }

  sfxFail() {
    this.resume();
    const notes = [440, 370, 311, 262, 220];
    notes.forEach((freq, i) => {
      this.tone(freq, 0.2, 'sawtooth', 0.4, i * 0.15);
    });
  }

  sfxClick() {
    this.resume();
    this.tone(800, 0.04, 'square', 0.3, 0);
    this.tone(600, 0.04, 'square', 0.2, 0.03);
  }

  sfxNotYet() {
    this.resume();
    this.tone(220, 0.08, 'square', 0.4, 0);
    this.tone(180, 0.1, 'square', 0.35, 0.07);
  }

  _musicNote(freq, duration, type, gainNode, when) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.connect(gainNode);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    const env = this.ctx.createGain();
    osc.connect(env);
    env.connect(gainNode);
    env.gain.setValueAtTime(0.001, when);
    env.gain.linearRampToValueAtTime(1.0, when + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, when + duration * 0.9);
    osc.start(when);
    osc.stop(when + duration);
    this._musicNodes.push(osc);
  }

  playBgMusic(theme) {
    this.stopBgMusic();
    if (!this.ctx) return;
    this._currentTheme = theme;
    this._musicPlaying = true;
    this._scheduleMusic(theme);
  }

  _scheduleMusic(theme) {
    if (!this._musicPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const bassGain = this.ctx.createGain();
    bassGain.gain.value = 0.08;
    bassGain.connect(this.musicGain);

    const melGain = this.ctx.createGain();
    melGain.gain.value = 0.12;
    melGain.connect(this.musicGain);

    if (theme === 'forest') {
      // Gentle triangle-wave arpeggios, C major pentatonic
      const arp = [261, 329, 392, 523, 392, 329, 261, 329];
      const bass = [130, 130, 164, 164];
      const bpm = 120;
      const beat = 60 / bpm;
      arp.forEach((freq, i) => {
        this._musicNote(freq, beat * 0.7, 'triangle', melGain, now + i * beat);
      });
      bass.forEach((freq, i) => {
        this._musicNote(freq, beat * 1.8, 'triangle', bassGain, now + i * beat * 2);
      });
      const loopDur = arp.length * beat * 1000;
      this._musicTimeout = setTimeout(() => this._scheduleMusic(theme), loopDur);

    } else if (theme === 'city') {
      // Chiptune square-wave melody
      const mel = [440, 494, 523, 587, 523, 440, 392, 440];
      const bpm = 140;
      const beat = 60 / bpm;
      mel.forEach((freq, i) => {
        this._musicNote(freq, beat * 0.5, 'square', melGain, now + i * beat * 0.5);
      });
      const loopDur = mel.length * beat * 0.5 * 1000;
      this._musicTimeout = setTimeout(() => this._scheduleMusic(theme), loopDur);

    } else {
      // Generic: simple rising arpeggio
      const notes = [261, 329, 392, 523];
      const beat = 0.35;
      notes.forEach((freq, i) => {
        this._musicNote(freq, beat * 0.8, 'triangle', melGain, now + i * beat);
      });
      const loopDur = notes.length * beat * 1000;
      this._musicTimeout = setTimeout(() => this._scheduleMusic(theme), loopDur);
    }

    this._musicNodes.push(bassGain, melGain);
  }

  stopBgMusic() {
    this._musicPlaying = false;
    if (this._musicTimeout) {
      clearTimeout(this._musicTimeout);
      this._musicTimeout = null;
    }
    this._musicNodes.forEach(node => {
      try {
        if (node.stop) node.stop(0);
        node.disconnect();
      } catch(e) {}
    });
    this._musicNodes = [];
  }
}

window.AUDIO = new AudioManager();
