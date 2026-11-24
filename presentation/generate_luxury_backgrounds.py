"""
Generate high-resolution (1920x1080) luxury architectural backgrounds and technical diagrams
for the Neuralis Omni Executive Presentation Deck.
Eliminates flat dark backgrounds by synthesizing professional engineered textures,
studio lighting gradients, circuit wireframe coordinates, and high-density system schematics.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ASSETS_DIR = r"S:\Antigravity\projects\neuralis-omni\presentation\assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_master_background():
    """Generates an ultra-premium titanium-slate architectural blueprint background (1920x1080)"""
    w, h = 1920, 1080
    img = Image.new("RGBA", (w, h), (18, 22, 32, 255))
    draw = ImageDraw.Draw(img)

    # 1. Base gradient - Rich deep slate with cool titanium tone
    for y in range(h):
        ratio = y / h
        r = int(22 + ratio * 8)
        g = int(26 + ratio * 10)
        b = int(38 + ratio * 14)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # 2. Studio Lighting Glows (Top-left cool cyan, top-right electric amber, bottom center deep blue)
    glow_overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_overlay)

    # Cool cyan studio highlight top-left
    for radius in range(500, 0, -10):
        alpha = int((1 - radius / 500) * 45)
        glow_draw.ellipse([-150 - radius, -150 - radius, -150 + radius, -150 + radius], fill=(0, 229, 255, alpha))

    # Subtle titanium rim light top-right
    for radius in range(450, 0, -15):
        alpha = int((1 - radius / 450) * 35)
        glow_draw.ellipse([w + 100 - radius, -100 - radius, w + 100 + radius, -100 + radius], fill=(255, 85, 0, alpha))

    # Deep focus glow center
    for radius in range(700, 0, -20):
        alpha = int((1 - radius / 700) * 25)
        glow_draw.ellipse([w // 2 - radius, h // 2 - radius, w // 2 + radius, h // 2 + radius], fill=(30, 48, 80, alpha))

    img = Image.alpha_composite(img, glow_overlay)
    draw = ImageDraw.Draw(img)

    # 3. Precision Engineering Grid (40px minor, 200px major)
    for x in range(0, w, 40):
        is_major = (x % 200 == 0)
        col = (255, 255, 255, 20 if is_major else 8)
        width = 2 if is_major else 1
        draw.line([(x, 0), (x, h)], fill=col, width=width)

    for y in range(0, h, 40):
        is_major = (y % 200 == 0)
        col = (255, 255, 255, 20 if is_major else 8)
        width = 2 if is_major else 1
        draw.line([(0, y), (w, y)], fill=col, width=width)

    # 4. Precision Crosshair Caliper Marks & Coordinates
    for x in [200, 600, 1000, 1400, 1800]:
        for y in [120, 360, 600, 840, 1000]:
            draw.line([(x - 8, y), (x + 8, y)], fill=(0, 229, 255, 120), width=1)
            draw.line([(x, y - 8), (x, y + 8)], fill=(0, 229, 255, 120), width=1)

    # 5. Top and bottom high-precision ruler bars
    draw.rectangle([0, 0, w, 6], fill=(0, 229, 255, 180))
    draw.rectangle([0, h - 6, w, h], fill=(255, 85, 0, 180))

    out_file = os.path.join(ASSETS_DIR, "slide_bg_master.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_hardware_comparison():
    """Generates an architectural diagram comparing Legacy Hardware vs Neuralis Edge Software"""
    w, h = 1200, 640
    img = Image.new("RGBA", (w, h), (24, 28, 40, 255))
    draw = ImageDraw.Draw(img)

    # Subtle inner grid
    for x in range(0, w, 30):
        draw.line([(x, 0), (x, h)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, h, 30):
        draw.line([(0, y), (w, y)], fill=(255, 255, 255, 10), width=1)

    # Left Container: Traditional Hardware Failure Mode
    draw.rectangle([40, 40, 560, 600], fill=(32, 24, 28, 230), outline=(227, 6, 19, 180), width=2)
    draw.rectangle([40, 40, 560, 90], fill=(227, 6, 19, 50))
    # Right Container: Neuralis Edge Architecture
    draw.rectangle([640, 40, 1160, 600], fill=(20, 34, 38, 230), outline=(16, 185, 129, 180), width=2)
    draw.rectangle([640, 40, 1160, 90], fill=(16, 185, 129, 50))

    # Center VS Badge
    draw.ellipse([570, 290, 630, 350], fill=(255, 85, 0, 255), outline=(255, 255, 255, 200), width=2)

    # Schematics inside left box (circuit lines & broken breadboard wires)
    draw.line([(100, 200), (220, 200), (260, 320), (380, 320)], fill=(227, 6, 19, 200), width=3)
    draw.ellipse([215, 195, 225, 205], fill=(227, 6, 19, 255))
    # Red X cross
    draw.line([(450, 180), (510, 240)], fill=(227, 6, 19, 255), width=4)
    draw.line([(510, 180), (450, 240)], fill=(227, 6, 19, 255), width=4)

    # Schematics inside right box (clean parallel data pipeline & green check)
    for i in range(4):
        yy = 200 + i * 70
        draw.line([(700, yy), (1000, yy)], fill=(16, 185, 129, 160), width=3)
        draw.ellipse([695, yy - 5, 705, yy + 5], fill=(0, 229, 255, 255))
        draw.ellipse([995, yy - 5, 1005, yy + 5], fill=(16, 185, 129, 255))

    out_file = os.path.join(ASSETS_DIR, "visual_comparison.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_consensus_diagram():
    """Generates an architectural diagram for 4-Agent inter-process consensus"""
    w, h = 1200, 640
    img = Image.new("RGBA", (w, h), (24, 28, 42, 255))
    draw = ImageDraw.Draw(img)

    # Circular bus
    cx, cy = 600, 320
    r = 200
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 229, 255, 100), width=2)
    draw.ellipse([cx - r + 30, cy - r + 30, cx + r - 30, cy + r - 30], outline=(255, 85, 0, 80), width=1)

    # 4 Nodes (Alpha, Beta, Gamma, Delta)
    nodes = [
        ("ALPHA", cx, cy - r, (0, 229, 255)),
        ("BETA", cx + r, cy, (255, 85, 0)),
        ("GAMMA", cx, cy + r, (212, 175, 55)),
        ("DELTA", cx - r, cy, (16, 185, 129))
    ]

    for name, nx, ny, color in nodes:
        draw.ellipse([nx - 45, ny - 45, nx + 45, ny + 45], fill=(28, 36, 52, 255), outline=color, width=3)
        draw.ellipse([nx - 12, ny - 12, nx + 12, ny + 12], fill=color)

    # Cross connections
    draw.line([(cx, cy - r), (cx + r, cy)], fill=(0, 229, 255, 160), width=2)
    draw.line([(cx + r, cy), (cx, cy + r)], fill=(255, 85, 0, 160), width=2)
    draw.line([(cx, cy + r), (cx - r, cy)], fill=(212, 175, 55, 160), width=2)
    draw.line([(cx - r, cy), (cx, cy - r)], fill=(16, 185, 129, 160), width=2)
    draw.line([(cx, cy - r), (cx, cy + r)], fill=(255, 255, 255, 100), width=1)
    draw.line([(cx - r, cy), (cx + r, cy)], fill=(255, 255, 255, 100), width=1)

    out_file = os.path.join(ASSETS_DIR, "visual_consensus.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_system_architecture_diagram():
    """Generates the full-stack client-side execution architecture diagram"""
    w, h = 1200, 640
    img = Image.new("RGBA", (w, h), (22, 26, 38, 255))
    draw = ImageDraw.Draw(img)

    # 3-Tier Layer Architecture
    layers = [
        ("HARDWARE SENSOR LAYER (Webcam 60FPS + 48kHz Mic)", 80, (0, 229, 255)),
        ("DSP & FEATURE EXTRACTION LAYER (Subsampling, 128-FFT, Pitch Autocorrelation)", 240, (255, 85, 0)),
        ("COGNITIVE & REASONING LAYER (o1/R1 Multi-Stage Proofs + RAFT Consensus)", 400, (16, 185, 129))
    ]

    for title, y, col in layers:
        draw.rectangle([80, y, 1120, y + 100], fill=(28, 34, 48, 230), outline=col, width=2)
        # Indicator lights
        for i in range(6):
            xx = 920 + i * 30
            draw.ellipse([xx, y + 42, xx + 16, y + 58], fill=col)

    # Vertical interconnect arrows
    for x in [300, 600, 900]:
        draw.line([(x, 180), (x, 240)], fill=(255, 255, 255, 180), width=2)
        draw.line([(x, 340), (x, 400)], fill=(255, 255, 255, 180), width=2)

    out_file = os.path.join(ASSETS_DIR, "visual_architecture.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

if __name__ == "__main__":
    generate_master_background()
    generate_hardware_comparison()
    generate_consensus_diagram()
    generate_system_architecture_diagram()
