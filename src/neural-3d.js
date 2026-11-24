/**
 * NEURALIS OMNI - 3D SPATIAL NEURAL CORE
 * Real-Time 3D Synaptic Cortex & Geodesic Particle Engine
 * 100% In-Browser 3D Perspective Projection, Zero External Dependencies
 * Reacts to Audio Telemetry & Touch / Mouse Orbital Drag
 */

export class Neural3DCore {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    // 3D Geometry
    this.nodeCount = 140;
    this.nodes = [];
    this.connections = [];
    this.pulses = [];

    // Spatial Rotation & Camera
    this.rotX = 0.3;
    this.rotY = 0.5;
    this.targetRotX = 0.3;
    this.targetRotY = 0.5;
    this.velRotX = 0.002;
    this.velRotY = 0.004;

    this.radius = 160;
    this.baseRadius = 160;
    this.cameraDistance = 420;
    this.focalLength = 320;

    // Audio & State Reactivity
    this.audioEnergy = 0;
    this.isReasoning = false;
    this.active = false;
    this.animId = null;

    // Interaction State
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.initGeometry();
    this.setupInteraction();
  }

  initGeometry() {
    this.nodes = [];
    this.connections = [];

    // Fibonacci Sphere Distribution for mathematically uniform node placement
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < this.nodeCount; i++) {
      const y = 1 - (i / (this.nodeCount - 1)) * 2; // y from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      this.nodes.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        x: x * this.radius,
        y: y * this.radius,
        z: z * this.radius,
        projX: 0,
        projY: 0,
        scale: 1,
        alpha: 1,
        activity: Math.random()
      });
    }

    // Build Synaptic Edge Graph (Connect nodes within Euclidean threshold)
    const maxDist = 0.38; // Normalized threshold
    for (let i = 0; i < this.nodeCount; i++) {
      for (let j = i + 1; j < this.nodeCount; j++) {
        const dx = this.nodes[i].baseX - this.nodes[j].baseX;
        const dy = this.nodes[i].baseY - this.nodes[j].baseY;
        const dz = this.nodes[i].baseZ - this.nodes[j].baseZ;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          this.connections.push({
            a: i,
            b: j,
            dist: dist
          });
        }
      }
    }
  }

  setupInteraction() {
    const el = this.canvas;

    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.lastMouseX = clientX;
      this.lastMouseY = clientY;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const dx = clientX - this.lastMouseX;
      const dy = clientY - this.lastMouseY;

      this.targetRotY += dx * 0.008;
      this.targetRotX += dy * 0.008;

      this.lastMouseX = clientX;
      this.lastMouseY = clientY;
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    // Mouse Listeners
    el.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    // Touch Listeners (Smartphone Support)
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);
  }

  start() {
    this.active = true;
    const loop = (timestamp) => {
      if (!this.active) return;
      this.render(timestamp);
      this.animId = requestAnimationFrame(loop);
    };
    if (this.animId) cancelAnimationFrame(this.animId);
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    this.active = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  setAudioEnergy(normalizedEnergy) {
    // normalizedEnergy between 0.0 and 1.0
    this.audioEnergy = Math.max(0, Math.min(1, normalizedEnergy));
  }

  setReasoningState(isThinking) {
    this.isReasoning = isThinking;
    if (isThinking && Math.random() < 0.3) {
      this.triggerSynapticPulse();
    }
  }

  triggerSynapticPulse() {
    if (this.connections.length === 0) return;
    const randomConn = this.connections[Math.floor(Math.random() * this.connections.length)];
    this.pulses.push({
      conn: randomConn,
      progress: 0,
      speed: 0.04 + Math.random() * 0.03
    });
  }

  render(timestamp) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Dynamic Radius Expansion based on Audio Frequency & Reasoning state
    const audioExpansion = this.audioEnergy * 35;
    const reasoningPulse = this.isReasoning ? Math.sin(timestamp * 0.008) * 15 : 0;
    this.radius = this.baseRadius + audioExpansion + reasoningPulse;

    // Smooth Inertial Rotation
    if (!this.isDragging) {
      this.targetRotY += this.velRotY;
      this.targetRotX += this.velRotX;
    }
    this.rotX += (this.targetRotX - this.rotX) * 0.1;
    this.rotY += (this.targetRotY - this.rotY) * 0.1;

    const cosX = Math.cos(this.rotX);
    const sinX = Math.sin(this.rotX);
    const cosY = Math.cos(this.rotY);
    const sinY = Math.sin(this.rotY);

    // Transform and Project 3D Nodes
    for (let i = 0; i < this.nodeCount; i++) {
      const node = this.nodes[i];

      // Current spatial coordinate with breathing expansion
      const r = this.radius * (1 + Math.sin(timestamp * 0.002 + i) * 0.03);
      const px = node.baseX * r;
      const py = node.baseY * r;
      const pz = node.baseZ * r;

      // Rotate around Y axis
      const x1 = px * cosY + pz * sinY;
      const y1 = py;
      const z1 = -px * sinY + pz * cosY;

      // Rotate around X axis
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      node.x = x2;
      node.y = y2;
      node.z = z2;

      // 3D Perspective Projection
      const depth = this.cameraDistance + z2;
      const scale = this.focalLength / Math.max(10, depth);

      node.projX = centerX + x2 * scale;
      node.projY = centerY + y2 * scale;
      node.scale = scale;
      node.alpha = Math.max(0.15, Math.min(1.0, (z2 + this.radius) / (2 * this.radius)));
    }

    // Draw Synaptic Connections
    for (let i = 0; i < this.connections.length; i++) {
      const conn = this.connections[i];
      const na = this.nodes[conn.a];
      const nb = this.nodes[conn.b];

      const avgAlpha = (na.alpha + nb.alpha) * 0.5;
      const depthZ = (na.z + nb.z) * 0.5;

      if (avgAlpha > 0.2) {
        ctx.beginPath();
        ctx.moveTo(na.projX, na.projY);
        ctx.lineTo(nb.projX, nb.projY);

        if (this.isReasoning) {
          ctx.strokeStyle = `rgba(0, 229, 255, ${avgAlpha * 0.45})`;
          ctx.lineWidth = Math.max(0.6, na.scale * 1.2);
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${avgAlpha * 0.15})`;
          ctx.lineWidth = Math.max(0.4, na.scale * 0.8);
        }
        ctx.stroke();
      }
    }

    // Draw Synaptic Pulse Waves (Signal packets traveling along axons)
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed;

      if (p.progress >= 1.0) {
        this.pulses.splice(i, 1);
        continue;
      }

      const na = this.nodes[p.conn.a];
      const nb = this.nodes[p.conn.b];

      const curX = na.projX + (nb.projX - na.projX) * p.progress;
      const curY = na.projY + (nb.projY - na.projY) * p.progress;

      ctx.fillStyle = '#FF5500'; // Signal Amber Pulse
      ctx.beginPath();
      ctx.arc(curX, curY, 2.5 * na.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sort and Draw Nodes (Front to Back rendering)
    const sortedNodes = [...this.nodes].sort((a, b) => a.z - b.z);

    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      const nodeSize = Math.max(1.5, node.scale * 4.5);

      ctx.beginPath();
      ctx.arc(node.projX, node.projY, nodeSize, 0, Math.PI * 2);

      if (this.isReasoning && Math.random() < 0.15) {
        ctx.fillStyle = '#00E5FF'; // Active Synapse Cyan
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 8;
      } else if (node.z > 0) {
        ctx.fillStyle = `rgba(242, 244, 248, ${node.alpha})`;
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = `rgba(126, 130, 140, ${node.alpha * 0.6})`;
        ctx.shadowBlur = 0;
      }

      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Central Core Glow
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.radius * 0.6);
    if (this.isReasoning) {
      coreGrad.addColorStop(0, 'rgba(0, 229, 255, 0.12)');
      coreGrad.addColorStop(0.5, 'rgba(255, 85, 0, 0.05)');
      coreGrad.addColorStop(1, 'rgba(7, 8, 11, 0)');
    } else {
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      coreGrad.addColorStop(1, 'rgba(7, 8, 11, 0)');
    }
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}
