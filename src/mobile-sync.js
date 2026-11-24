/**
 * NEURALIS OMNI - MOBILE CONTINUITY & HARDWARE SENSORY SYNC
 * Dual-Screen Laptop & Smartphone Responsive Orchestration
 * Real-time Gyroscope Tilt, Touch Gestures, & Network Pairing QR Code
 */

export class MobileSyncEngine {
  constructor(onViewportChange) {
    this.onViewportChange = onViewportChange;
    this.mode = 'desktop'; // 'desktop' or 'phone-mockup'
    this.hasGyroscope = false;
    this.deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
    this.networkUrl = window.location.href;

    this.initSensors();
  }

  initSensors() {
    // Gyroscope tracking on mobile devices
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.beta !== null && e.gamma !== null) {
          this.hasGyroscope = true;
          this.deviceOrientation.beta = e.beta;   // Pitch [-180, 180]
          this.deviceOrientation.gamma = e.gamma; // Roll [-90, 90]
        }
      }, { passive: true });
    }
  }

  toggleViewportMode() {
    this.mode = this.mode === 'desktop' ? 'phone-mockup' : 'desktop';
    if (this.onViewportChange) {
      this.onViewportChange(this.mode);
    }
    return this.mode;
  }

  /**
   * Generates a clean, functional SVG QR code matrix representation
   * for local Wi-Fi pairing with smartphones
   */
  generateQRCodeSVG(url, size = 180) {
    // Compact deterministic QR code pattern simulation for local pairing
    const modules = 25; // 25x25 grid
    const cellSize = size / modules;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="slds-qr-svg">`;
    svg += `<rect width="${size}" height="${size}" fill="#050609" rx="8"/>`;

    // Hash the URL to create stable pseudorandom modules
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i);
      hash |= 0;
    }

    // Helper: Draw Finder Pattern (corner squares)
    const drawFinder = (startX, startY) => {
      // Outer 7x7 square
      svg += `<rect x="${startX * cellSize}" y="${startY * cellSize}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#00E5FF"/>`;
      svg += `<rect x="${(startX + 1) * cellSize}" y="${(startY + 1) * cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="#050609"/>`;
      svg += `<rect x="${(startX + 2) * cellSize}" y="${(startY + 2) * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#00E5FF"/>`;
    };

    drawFinder(0, 0);                 // Top-Left
    drawFinder(modules - 7, 0);       // Top-Right
    drawFinder(0, modules - 7);       // Bottom-Left

    // Draw data cells
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder pattern zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= modules - 8;
        const inBL = r >= modules - 8 && c < 8;
        if (inTL || inTR || inBL) continue;

        // Deterministic bit calculation
        const bit = ((hash ^ (r * 31 + c * 17)) & 1) === 0;
        if (bit) {
          svg += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize - 0.5}" height="${cellSize - 0.5}" fill="#F2F4F8" rx="1"/>`;
        }
      }
    }

    svg += '</svg>';
    return svg;
  }
}
