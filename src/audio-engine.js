/**
 * NEURALIS OMNI - ACOUSTIC TELEMETRY & NEURAL VOICE ENGINE
 * Real-Time FFT Spectrum Analysis, Pitch Tracking, Stress Index & Neural Voice Synthesis
 * 100% In-Browser, Web Audio API + Web Speech API
 */

export class AudioEngine {
  constructor(canvasElement, onAcousticUpdate) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.onAcousticUpdate = onAcousticUpdate;

    this.audioCtx = null;
    this.analyser = null;
    this.micStream = null;
    this.source = null;
    this.active = false;
    this.syntheticMode = false;

    // Buffer arrays
    this.dataArray = null;
    this.timeDataArray = null;
    this.bufferLength = 0;

    // Acoustic Telemetry State
    this.telemetry = {
      dbLevel: -48.0,
      pitchHz: 130.0,
      stressIndex: 12.4,
      vadActive: false,
      spectralCentroid: 1420,
      speechRateWpm: 148,
      mode: 'idle'
    };

    this.animId = null;
    this.syntheticPhase = 0;

    // Speech Synthesis
    this.synth = window.speechSynthesis || null;
    this.selectedVoice = null;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Prefer high-quality English neural/natural voices
      this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) || voices[0];
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  async startMicrophone() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error('Web Audio API not supported');

      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this.timeDataArray = new Uint8Array(this.bufferLength);

      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.source = this.audioCtx.createMediaStreamSource(this.micStream);
      this.source.connect(this.analyser);

      this.syntheticMode = false;
      this.active = true;
      this.telemetry.mode = 'hardware-mic';
      this.startRenderLoop();
      return { success: true, mode: 'hardware-mic' };
    } catch (err) {
      console.warn('Microphone access denied or unavailable. Activating Synthetic Acoustic Stream:', err.message);
      this.startSyntheticMode();
      return { success: true, mode: 'synthetic-acoustic', fallbackReason: err.message };
    }
  }

  startSyntheticMode() {
    this.syntheticMode = true;
    this.active = true;
    this.bufferLength = 128;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.timeDataArray = new Uint8Array(this.bufferLength);
    this.telemetry.mode = 'synthetic-acoustic';
    this.startRenderLoop();
  }

  stop() {
    this.active = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
    }
  }

  startRenderLoop() {
    const loop = (timestamp) => {
      if (!this.active) return;
      this.render(timestamp);
      this.animId = requestAnimationFrame(loop);
    };
    if (this.animId) cancelAnimationFrame(this.animId);
    this.animId = requestAnimationFrame(loop);
  }

  render(now) {
    if (this.syntheticMode || !this.analyser) {
      this.computeSyntheticAcoustics(now);
    } else {
      this.computeHardwareAcoustics();
    }

    if (this.ctx && this.canvas) {
      this.drawSpectrogram(now);
    }

    if (this.onAcousticUpdate) {
      this.onAcousticUpdate(this.telemetry, this.dataArray);
    }
  }

  computeHardwareAcoustics() {
    this.analyser.getByteFrequencyData(this.dataArray);
    this.analyser.getByteTimeDomainData(this.timeDataArray);

    // Compute RMS and dBFS
    let sumSquares = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      const normalized = (this.timeDataArray[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / this.bufferLength);
    const db = rms > 0.0001 ? 20 * Math.log10(rms) : -90;
    this.telemetry.dbLevel = +Math.max(-90, Math.min(0, db)).toFixed(1);

    // Voice Activity Detection (VAD) threshold
    this.telemetry.vadActive = this.telemetry.dbLevel > -42.0;

    // Fundamental Frequency Peak Bin Estimation
    let maxVal = 0;
    let maxIndex = 0;
    for (let i = 2; i < this.bufferLength / 2; i++) {
      if (this.dataArray[i] > maxVal) {
        maxVal = this.dataArray[i];
        maxIndex = i;
      }
    }
    const nyquist = this.audioCtx ? this.audioCtx.sampleRate / 2 : 24000;
    const estPitch = (maxIndex * nyquist) / this.bufferLength;
    if (this.telemetry.vadActive && estPitch > 60 && estPitch < 500) {
      this.telemetry.pitchHz = +estPitch.toFixed(1);
    }

    // Stress Index calculation from high frequency micro-tremors
    let highFreqEnergy = 0;
    for (let i = Math.floor(this.bufferLength * 0.6); i < this.bufferLength; i++) {
      highFreqEnergy += this.dataArray[i];
    }
    this.telemetry.stressIndex = +(Math.min(95, 8.0 + (highFreqEnergy / 50))).toFixed(1);
  }

  computeSyntheticAcoustics(now) {
    this.syntheticPhase += 0.05;
    const time = now * 0.001;

    // Simulate periodic speech rhythm (bursts of speaking and listening)
    const speechCycle = Math.sin(time * 0.8);
    const isSpeaking = speechCycle > 0.1;
    this.telemetry.vadActive = isSpeaking;

    const baseDb = isSpeaking ? -24.0 + Math.sin(time * 4) * 6 : -52.0;
    this.telemetry.dbLevel = +baseDb.toFixed(1);
    this.telemetry.pitchHz = +(142.0 + Math.sin(time * 1.5) * 18.0).toFixed(1);
    this.telemetry.stressIndex = +(14.5 + Math.abs(Math.sin(time * 0.6)) * 8.2).toFixed(1);

    // Populate synthetic frequency bins with realistic acoustic roll-off
    for (let i = 0; i < this.bufferLength; i++) {
      if (isSpeaking) {
        const formant1 = Math.exp(-Math.pow(i - 12, 2) / 25);
        const formant2 = Math.exp(-Math.pow(i - 28, 2) / 40);
        const noise = (Math.random() - 0.5) * 20;
        this.dataArray[i] = Math.min(255, Math.max(10, Math.floor((formant1 * 210 + formant2 * 140 + noise) * (0.8 + Math.sin(this.syntheticPhase) * 0.2))));
      } else {
        this.dataArray[i] = Math.floor(Math.random() * 18 + 5);
      }
    }
  }

  drawSpectrogram(now) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Technical background grid
    ctx.fillStyle = '#050609';
    ctx.fillRect(0, 0, w, h);

    // Subtle horizontal gridlines (dB levels: 0, -20, -40, -60)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Frequency Bars with SLDS Precision Telemetry Amber & Cyan
    const barCount = 48;
    const step = Math.floor(this.bufferLength / barCount);
    const barWidth = (w / barCount) - 1.5;

    for (let i = 0; i < barCount; i++) {
      const val = this.dataArray ? this.dataArray[i * step] : 0;
      const barHeight = (val / 255) * (h - 12);
      const x = i * (barWidth + 1.5);
      const y = h - barHeight;

      // Color grading: High precision cyan with signal amber peaks
      if (val > 180) {
        ctx.fillStyle = '#FF5500'; // Teenage Engineering Amber peak
      } else if (val > 90) {
        ctx.fillStyle = '#00E5FF'; // Telemetry Cyan
      } else {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.35)';
      }

      ctx.fillRect(x, y, barWidth, barHeight);

      // Specular Top Cap on each bar
      if (barHeight > 3) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, barWidth, 1.5);
      }
    }

    // Telemetry Status Badge overlay
    ctx.font = '600 9px "Geist Mono", monospace';
    ctx.fillStyle = this.telemetry.vadActive ? '#10B981' : '#7E828C';
    ctx.fillText(`VAD: ${this.telemetry.vadActive ? 'TRANSMITTING' : 'IDLE / LISTENING'}`, 10, 16);

    ctx.fillStyle = '#9BA1B0';
    ctx.fillText(`PITCH: ${this.telemetry.pitchHz} Hz`, w - 100, 16);
    ctx.fillText(`ENERGY: ${this.telemetry.dbLevel} dBFS`, w - 210, 16);
  }

  /**
   * Neural Speech Synthesis: Speaks text with natural pacing
   */
  speak(text) {
    if (!this.synth) return;
    try {
      this.synth.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
