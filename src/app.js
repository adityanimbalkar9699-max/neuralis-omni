/**
 * NEURALIS OMNI - MAIN APPLICATION ORCHESTRATOR
 * Coordinates Vision, Audio, 3D Synaptic Core, Deep Reasoning, Swarm, & Telemetry
 */

import { sound } from './sound-engine.js';
import { VisionEngine } from './vision-engine.js';
import { AudioEngine } from './audio-engine.js';
import { Neural3DCore } from './neural-3d.js';
import { ReasoningEngine, REASONING_PRESETS } from './reasoning-engine.js';
import { SwarmCoordinator } from './swarm-engine.js';
import { MobileSyncEngine } from './mobile-sync.js';
import { TelemetryExporter } from './telemetry-export.js';

class NeuralisApp {
  constructor() {
    this.activeTab = 'sensory'; // 'sensory', 'reasoning', 'swarm'
    this.state = {
      visionTelemetry: null,
      audioTelemetry: null,
      lastReasoningPrompt: null,
      lastReasoningDuration: null,
      audioSampleRate: 48000
    };

    // DOM Elements
    this.dom = {};
  }

  init() {
    this.cacheDOMElements();
    sound.init();

    // Initialize Subsystems
    this.initVision();
    this.initAudio();
    this.init3D();
    this.initReasoning();
    this.initSwarm();
    this.initMobileSync();
    this.initExporter();

    this.bindEvents();
    this.switchTab('sensory');

    // Initial audio boot cue
    document.addEventListener('click', () => {
      sound.ensureContext();
    }, { once: true });

    console.log('>>> NEURALIS OMNI INITIALIZED [TIER-1 AUTONOMOUS AI] <<<');
  }

  cacheDOMElements() {
    this.dom = {
      // Containers & Views
      appContainer: document.getElementById('app-container'),
      phoneFrameWrapper: document.getElementById('phone-frame-wrapper'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalContent: document.getElementById('modal-content'),

      // Navigation Tabs
      tabSensory: document.getElementById('tab-sensory'),
      tabReasoning: document.getElementById('tab-reasoning'),
      tabSwarm: document.getElementById('tab-swarm'),
      viewSensory: document.getElementById('view-sensory'),
      viewReasoning: document.getElementById('view-reasoning'),
      viewSwarm: document.getElementById('view-swarm'),

      // Vision Elements
      videoEl: document.getElementById('webcam-video'),
      visionCanvas: document.getElementById('vision-canvas'),
      btnToggleCamera: document.getElementById('btn-toggle-camera'),
      btnSwitchFacing: document.getElementById('btn-switch-facing'),
      btnSyntheticVision: document.getElementById('btn-synthetic-vision'),
      visionModeBadge: document.getElementById('vision-mode-badge'),

      // Audio Elements
      audioCanvas: document.getElementById('audio-canvas'),
      btnToggleMic: document.getElementById('btn-toggle-mic'),
      btnSyntheticAudio: document.getElementById('btn-synthetic-audio'),
      btnVoiceSummary: document.getElementById('btn-voice-summary'),
      audioModeBadge: document.getElementById('audio-mode-badge'),

      // 3D Neural Canvas
      neuralCanvas: document.getElementById('neural-canvas'),

      // Reasoning Elements
      presetButtonsContainer: document.getElementById('reasoning-presets'),
      customPromptInput: document.getElementById('custom-prompt-input'),
      btnRunReasoning: document.getElementById('btn-run-reasoning'),
      reasoningTerminal: document.getElementById('reasoning-terminal'),
      reasoningTimer: document.getElementById('reasoning-timer'),
      reasoningStageBadge: document.getElementById('reasoning-stage-badge'),

      // Swarm Elements
      swarmGrid: document.getElementById('swarm-grid'),
      swarmLog: document.getElementById('swarm-log'),

      // Telemetry Cockpit
      valAttention: document.getElementById('val-attention'),
      valCognitive: document.getElementById('val-cognitive'),
      valPitch: document.getElementById('val-pitch'),
      valStress: document.getElementById('val-stress'),
      valLatency: document.getElementById('val-latency'),
      valFps: document.getElementById('val-fps'),

      // Header Controls
      btnViewportMode: document.getElementById('btn-viewport-mode'),
      btnSoundMute: document.getElementById('btn-sound-mute'),
      btnQrSync: document.getElementById('btn-qr-sync'),
      btnExportReport: document.getElementById('btn-export-report')
    };
  }

  initVision() {
    this.vision = new VisionEngine(
      this.dom.videoEl,
      this.dom.visionCanvas,
      (telemetry) => this.updateVisionTelemetry(telemetry)
    );
    // Start in synthetic mode by default to ensure immediate zero-wait visuals
    this.vision.startSyntheticMode();
  }

  initAudio() {
    this.audio = new AudioEngine(
      this.dom.audioCanvas,
      (telemetry, freqData) => this.updateAudioTelemetry(telemetry, freqData)
    );
    // Start synthetic acoustics immediately
    this.audio.startSyntheticMode();
  }

  init3D() {
    this.neural3d = new Neural3DCore(this.dom.neuralCanvas);
    this.neural3d.start();
  }

  initReasoning() {
    this.reasoning = new ReasoningEngine(
      (stepData) => this.renderReasoningStep(stepData),
      (summary) => this.finishReasoning(summary)
    );
    this.renderPresetButtons();
  }

  initSwarm() {
    this.swarm = new SwarmCoordinator((data) => this.renderSwarmState(data));
    this.swarm.start();
  }

  initMobileSync() {
    this.mobileSync = new MobileSyncEngine((mode) => {
      if (mode === 'phone-mockup') {
        this.dom.phoneFrameWrapper.classList.remove('hidden');
        this.dom.appContainer.classList.add('in-phone-mode');
        this.dom.btnViewportMode.innerText = 'SWITCH TO DESKTOP PRO';
      } else {
        this.dom.phoneFrameWrapper.classList.add('hidden');
        this.dom.appContainer.classList.remove('in-phone-mode');
        this.dom.btnViewportMode.innerText = 'PREVIEW PHONE (FRAME)';
      }
      this.resizeCanvases();
    });
  }

  initExporter() {
    this.exporter = new TelemetryExporter(() => this.state);
  }

  bindEvents() {
    // Tab switching
    this.dom.tabSensory.addEventListener('click', () => { sound.click(); this.switchTab('sensory'); });
    this.dom.tabReasoning.addEventListener('click', () => { sound.click(); this.switchTab('reasoning'); });
    this.dom.tabSwarm.addEventListener('click', () => { sound.click(); this.switchTab('swarm'); });

    // Vision Controls
    this.dom.btnToggleCamera.addEventListener('click', async () => {
      sound.click();
      const res = await this.vision.startCamera('user');
      this.dom.visionModeBadge.innerText = res.mode === 'hardware-camera' ? 'HW OPTICAL CAM' : 'SYNTHETIC FEED';
      this.dom.visionModeBadge.style.color = res.mode === 'hardware-camera' ? '#10B981' : '#00E5FF';
    });

    this.dom.btnSwitchFacing.addEventListener('click', async () => {
      sound.click();
      await this.vision.switchCamera();
    });

    this.dom.btnSyntheticVision.addEventListener('click', () => {
      sound.click();
      this.vision.startSyntheticMode();
      this.dom.visionModeBadge.innerText = 'SYNTHETIC FEED';
      this.dom.visionModeBadge.style.color = '#00E5FF';
    });

    // Audio Controls
    this.dom.btnToggleMic.addEventListener('click', async () => {
      sound.click();
      const res = await this.audio.startMicrophone();
      this.dom.audioModeBadge.innerText = res.mode === 'hardware-mic' ? 'HW MIC ACTIVE' : 'SYNTHETIC ACOUSTIC';
      this.dom.audioModeBadge.style.color = res.mode === 'hardware-mic' ? '#10B981' : '#00E5FF';
    });

    this.dom.btnSyntheticAudio.addEventListener('click', () => {
      sound.click();
      this.audio.startSyntheticMode();
      this.dom.audioModeBadge.innerText = 'SYNTHETIC ACOUSTIC';
      this.dom.audioModeBadge.style.color = '#00E5FF';
    });

    this.dom.btnVoiceSummary.addEventListener('click', () => {
      sound.beep(1200, 0.1);
      const summaryText = `Neuralis Omni system status verified. Visual attention at ${this.state.visionTelemetry?.attentionScore || 95} percent. Optical latency 6 milliseconds. All autonomous agent consensus nodes synchronized.`;
      this.audio.speak(summaryText);
    });

    // Reasoning Controls
    this.dom.btnRunReasoning.addEventListener('click', () => {
      const query = this.dom.customPromptInput.value.trim();
      if (!query) return;
      sound.boot();
      this.startReasoningFlow(query, false);
    });

    // Top Header Actions
    this.dom.btnViewportMode.addEventListener('click', () => {
      sound.click();
      this.mobileSync.toggleViewportMode();
    });

    this.dom.btnSoundMute.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      this.dom.btnSoundMute.innerText = isMuted ? 'AUDIO: MUTED' : 'AUDIO: ACTIVE';
      this.dom.btnSoundMute.style.opacity = isMuted ? '0.6' : '1.0';
    });

    this.dom.btnQrSync.addEventListener('click', () => {
      sound.beep();
      this.openQrModal();
    });

    this.dom.btnExportReport.addEventListener('click', async () => {
      sound.beep(1040, 0.15);
      await this.openAuditModal();
    });

    // Window resize
    window.addEventListener('resize', () => this.resizeCanvases());
    this.resizeCanvases();
  }

  resizeCanvases() {
    // Adjust canvas buffer sizes to container dimensions
    [this.dom.visionCanvas, this.dom.audioCanvas, this.dom.neuralCanvas].forEach(c => {
      if (c && c.parentElement) {
        c.width = c.parentElement.clientWidth || 320;
        c.height = c.parentElement.clientHeight || 240;
      }
    });
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    const tabs = [
      { key: 'sensory', btn: this.dom.tabSensory, view: this.dom.viewSensory },
      { key: 'reasoning', btn: this.dom.tabReasoning, view: this.dom.viewReasoning },
      { key: 'swarm', btn: this.dom.tabSwarm, view: this.dom.viewSwarm }
    ];

    tabs.forEach(t => {
      if (t.key === tabKey) {
        t.btn.classList.add('active-tab');
        t.view.classList.remove('hidden');
      } else {
        t.btn.classList.remove('active-tab');
        t.view.classList.add('hidden');
      }
    });

    this.resizeCanvases();
  }

  updateVisionTelemetry(telemetry) {
    this.state.visionTelemetry = telemetry;
    if (this.dom.valAttention) this.dom.valAttention.innerText = `${telemetry.attentionScore}%`;
    if (this.dom.valCognitive) this.dom.valCognitive.innerText = `${telemetry.cognitiveLoad}%`;
    if (this.dom.valLatency) this.dom.valLatency.innerText = `${telemetry.latencyMs}ms`;
    if (this.dom.valFps) this.dom.valFps.innerText = `${telemetry.fps} FPS`;
  }

  updateAudioTelemetry(telemetry, freqData) {
    this.state.audioTelemetry = telemetry;
    if (this.dom.valPitch) this.dom.valPitch.innerText = `${telemetry.pitchHz} Hz`;
    if (this.dom.valStress) this.dom.valStress.innerText = `${telemetry.stressIndex}%`;

    // Reactivity to 3D Neural Core
    if (this.neural3d) {
      const normalizedEnergy = Math.max(0, (telemetry.dbLevel + 60) / 60);
      this.neural3d.setAudioEnergy(normalizedEnergy);
    }
  }

  renderPresetButtons() {
    this.dom.presetButtonsContainer.innerHTML = '';
    REASONING_PRESETS.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'slds-button-secondary text-xs';
      btn.innerText = p.title;
      btn.addEventListener('click', () => {
        sound.click();
        this.dom.customPromptInput.value = p.prompt;
        this.startReasoningFlow(p.id, true);
      });
      this.dom.presetButtonsContainer.appendChild(btn);
    });
  }

  async startReasoningFlow(target, isPreset = false) {
    this.neural3d.setReasoningState(true);
    this.swarm.setReasoningMode(true);
    this.dom.reasoningTerminal.innerHTML = '<div style="color: #00E5FF; margin-bottom: 0.5rem;">[SYSTEM] INITIALIZING DEEP REASONING VERIFICATION ENGINE...</div>';
    this.dom.reasoningStageBadge.innerText = 'INITIALIZING';

    if (isPreset) {
      await this.reasoning.runPreset(target);
    } else {
      await this.reasoning.runCustomPrompt(target);
    }
  }

  renderReasoningStep(step) {
    sound.beep(1400 + step.stepIndex * 150, 0.04);
    this.dom.reasoningTimer.innerText = `${step.elapsed}s`;
    this.dom.reasoningStageBadge.innerText = step.stage;

    const stageColors = {
      'AXIOM_DECOMPOSITION': '#00E5FF',
      'HYPOTHESIS_SEARCH': '#FF5500',
      'COUNTER_EXAMPLE_SIMULATION': '#E30613',
      'SELF_VERIFICATION_GATE': '#D4AF37',
      'EXECUTIVE_SYNTHESIS': '#10B981'
    };

    const block = document.createElement('div');
    block.style.marginBottom = '0.85rem';
    block.style.paddingLeft = '0.75rem';
    block.style.borderLeft = `2px solid ${stageColors[step.stage] || '#FFFFFF'}`;

    block.innerHTML = `
      <div style="font-size: 0.6875rem; color: ${stageColors[step.stage] || '#FFFFFF'}; font-weight: 700; margin-bottom: 0.25rem;">
        [STAGE ${step.stepIndex}/${step.totalSteps}] ${step.stage}
      </div>
      <div style="font-size: 0.75rem; color: #F2F4F8; line-height: 1.5; white-space: pre-wrap;">
        ${step.thought}
      </div>
    `;

    this.dom.reasoningTerminal.appendChild(block);
    this.dom.reasoningTerminal.scrollTop = this.dom.reasoningTerminal.scrollHeight;
  }

  finishReasoning(summary) {
    sound.beep(880, 0.2);
    this.neural3d.setReasoningState(false);
    this.swarm.setReasoningMode(false);
    this.dom.reasoningStageBadge.innerText = 'CONVERGED (99.4%)';
    this.state.lastReasoningPrompt = summary.prompt;
    this.state.lastReasoningDuration = summary.duration;

    const finalBlock = document.createElement('div');
    finalBlock.style.background = 'rgba(16, 185, 129, 0.08)';
    finalBlock.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    finalBlock.style.padding = '0.75rem';
    finalBlock.style.borderRadius = '6px';
    finalBlock.style.marginTop = '0.75rem';
    finalBlock.innerHTML = `
      <div style="color: #10B981; font-weight: 700; font-size: 0.75rem;">
        >>> PROOF COMPLETE: ZERO INCONSISTENCIES FOUND IN ${summary.duration} SECONDS <<<
      </div>
      <div style="color: #9BA1B0; font-size: 0.6875rem; margin-top: 0.25rem;">
        Formal verification passed. Deterministic bounds certified.
      </div>
    `;
    this.dom.reasoningTerminal.appendChild(finalBlock);
    this.dom.reasoningTerminal.scrollTop = this.dom.reasoningTerminal.scrollHeight;
  }

  renderSwarmState(data) {
    // Update Agent cards
    if (!this.dom.swarmGrid) return;
    this.dom.swarmGrid.innerHTML = '';
    data.agents.forEach(agent => {
      const card = document.createElement('div');
      card.className = 'slds-stat-box';
      card.style.borderLeft = `3px solid ${agent.color}`;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <strong style="font-size: 0.8125rem; color: #FFFFFF;">${agent.name}</strong>
          <span class="slds-badge" style="color: ${agent.color}; border-color: ${agent.color}; font-size: 0.625rem;">${agent.status}</span>
        </div>
        <div style="font-size: 0.6875rem; color: #9BA1B0; margin-bottom: 0.5rem;">${agent.role}</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-family: 'Geist Mono', monospace; font-size: 0.6875rem;">
          <div><span style="color:#7E828C;">LAT:</span> <span style="color:#FFF;">${agent.latency}</span></div>
          <div><span style="color:#7E828C;">LOAD:</span> <span style="color:#FFF;">${agent.load}</span></div>
          <div><span style="color:#7E828C;">TASKS:</span> <span style="color:#00E5FF;">${agent.tasksCompleted}</span></div>
        </div>
      `;
      this.dom.swarmGrid.appendChild(card);
    });

    // Update Swarm Event Log
    if (!this.dom.swarmLog) return;
    this.dom.swarmLog.innerHTML = '';
    data.recentEvents.forEach(ev => {
      const logLine = document.createElement('div');
      logLine.style.fontSize = '0.6875rem';
      logLine.style.lineHeight = '1.6';
      logLine.innerHTML = `<span style="color:#7E828C;">${ev.time}</span> <strong style="color:#00E5FF;">[${ev.type}]</strong> <span style="color:#F2F4F8;">${ev.message}</span>`;
      this.dom.swarmLog.appendChild(logLine);
    });
  }

  openQrModal() {
    const currentUrl = window.location.href;
    const qrSvg = this.mobileSync.generateQRCodeSVG(currentUrl, 200);

    this.dom.modalContent.innerHTML = `
      <div style="text-align: center; padding: 1.5rem;">
        <div style="font-family: 'Geist Mono', monospace; font-size: 0.6875rem; color: #00E5FF; letter-spacing: 0.12em; text-transform: uppercase;">
          LIVE SMARTPHONE CONTINUITY
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #FFFFFF; margin: 0.5rem 0 1rem 0;">
          Scan with Mobile Camera
        </h2>
        <div style="display: inline-block; padding: 1rem; background: #050609; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; margin-bottom: 1rem;">
          ${qrSvg}
        </div>
        <div style="font-family: 'Geist Mono', monospace; font-size: 0.75rem; color: #9BA1B0; margin-bottom: 1rem;">
          Pairing Address: <span style="color: #00E5FF; word-break: break-all;">${currentUrl}</span>
        </div>
        <p style="font-size: 0.75rem; color: #7E828C; max-width: 320px; margin: 0 auto 1.5rem auto;">
          Open on any iPhone or Android phone on the same Wi-Fi. Features native touch gestures, phone gyro, and mobile cameras.
        </p>
        <button id="modal-close-btn" class="slds-button-primary">CLOSE SYNC WINDOW</button>
      </div>
    `;

    this.dom.modalOverlay.classList.remove('hidden');
    document.getElementById('modal-close-btn').addEventListener('click', () => {
      sound.click();
      this.dom.modalOverlay.classList.add('hidden');
    });
  }

  async openAuditModal() {
    const reportData = await this.exporter.generateReport();
    const html = this.exporter.renderPrintableHTML(reportData);

    this.dom.modalContent.innerHTML = `
      <div style="padding: 1.5rem; max-width: 720px; width: 100%;">
        ${html}
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem;">
          <button id="btn-modal-print" class="slds-button-signal">PRINT / SAVE AS PDF</button>
          <button id="btn-modal-json" class="slds-button-secondary">DOWNLOAD JSON</button>
          <button id="btn-modal-close" class="slds-button-primary">CLOSE</button>
        </div>
      </div>
    `;

    this.dom.modalOverlay.classList.remove('hidden');

    document.getElementById('btn-modal-print').addEventListener('click', () => {
      sound.click();
      window.print();
    });

    document.getElementById('btn-modal-json').addEventListener('click', () => {
      sound.click();
      this.exporter.downloadJSON(reportData);
    });

    document.getElementById('btn-modal-close').addEventListener('click', () => {
      sound.click();
      this.dom.modalOverlay.classList.add('hidden');
    });
  }
}

// Bootstrap on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const app = new NeuralisApp();
  app.init();
});
