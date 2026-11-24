"""
Generate high-resolution (1400x800) light-mode executive corporate diagrams and assets
for the Neuralis Omni Executive Presentation Deck.
Eliminates dark backgrounds and amateur line art by producing crisp, publication-grade,
Apple/McKinsey-level white-canvas diagrams.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = r"S:\Antigravity\projects\neuralis-omni\presentation\assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_light_comparison():
    """Generates an executive comparison graphic on pure white canvas"""
    w, h = 1200, 680
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Outer border & subtle card shadow
    draw.rectangle([20, 20, w - 20, h - 20], fill=(248, 250, 252, 255), outline=(226, 232, 240, 255), width=2)

    # Column 1: Legacy Hardware (Red Tint)
    draw.rectangle([60, 60, 560, h - 60], fill=(254, 242, 242, 255), outline=(254, 202, 202, 255), width=2)
    # Header bar
    draw.rectangle([60, 60, 560, 140], fill=(239, 68, 68, 255))
    # Red Warning Icon circle
    draw.ellipse([80, 80, 120, 120], fill=(255, 255, 255, 255))
    draw.line([(93, 100), (107, 100)], fill=(239, 68, 68, 255), width=4)

    # Column 2: Neuralis Edge Software (Emerald Tint)
    draw.rectangle([640, 60, 1140, h - 60], fill=(240, 253, 244, 255), outline=(187, 247, 208, 255), width=2)
    # Header bar
    draw.rectangle([640, 60, 1140, 140], fill=(16, 185, 129, 255))
    # Green Check Icon circle
    draw.ellipse([660, 80, 700, 120], fill=(255, 255, 255, 255))
    draw.line([(672, 100), (678, 108), (688, 92)], fill=(16, 185, 129, 255), width=4)

    # Left Column Schematics (Broken wires, hardware failure)
    draw.rectangle([100, 180, 520, 320], fill=(255, 255, 255, 255), outline=(252, 165, 165, 255), width=1)
    # Breadboard dots
    for bx in range(130, 500, 30):
        for by in range(200, 300, 20):
            draw.ellipse([bx - 2, by - 2, bx + 2, by + 2], fill=(203, 213, 225, 255))
    # Broken wire
    draw.line([(160, 220), (280, 240)], fill=(239, 68, 68, 255), width=3)
    draw.line([(320, 260), (440, 240)], fill=(239, 68, 68, 255), width=3)
    draw.ellipse([275, 235, 285, 245], fill=(239, 68, 68, 255))
    draw.ellipse([315, 255, 325, 265], fill=(239, 68, 68, 255))

    # Metric badge 1
    draw.rectangle([100, 360, 520, 430], fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    draw.rectangle([100, 450, 520, 520], fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    draw.rectangle([100, 540, 520, 600], fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)

    # Right Column Schematics (Clean software pipeline)
    draw.rectangle([680, 180, 1100, 320], fill=(255, 255, 255, 255), outline=(134, 239, 172, 255), width=1)
    # Flow pipeline bars
    for i in range(4):
        yy = 205 + i * 28
        draw.line([(720, yy), (1060, yy)], fill=(16, 185, 129, 200), width=4)
        draw.ellipse([715, yy - 5, 725, yy + 5], fill=(2, 132, 199, 255))
        draw.ellipse([1055, yy - 5, 1065, yy + 5], fill=(16, 185, 129, 255))

    # Metric badge 2
    draw.rectangle([680, 360, 1100, 430], fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    draw.rectangle([680, 450, 1100, 520], fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)
    draw.rectangle([680, 540, 1100, 600], fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=1)

    out_file = os.path.join(ASSETS_DIR, "executive_comparison.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_light_cortex():
    """Generates an ultra-crisp 3D geodesic neural manifold on pristine white canvas"""
    w, h = 1000, 800
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    cx, cy = 500, 400
    r = 270

    # Soft ambient drop shadow beneath sphere
    for i in range(40, 0, -2):
        alpha = int((1 - i / 40) * 30)
        draw.ellipse([cx - 240 - i, cy + 220 - i // 3, cx + 240 + i, cy + 260 + i // 3], fill=(15, 23, 42, alpha))

    # Fibonacci nodes
    nodes = []
    phi = math.pi * (3 - math.sqrt(5))
    for i in range(130):
        y = 1 - (i / 129) * 2
        rad = math.sqrt(1 - y * y)
        theta = phi * i
        x = math.cos(theta) * rad
        z = math.sin(theta) * rad

        px = cx + x * r
        py = cy + y * r * 0.92
        nodes.append((px, py, z))

    # Connections
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            dx = nodes[i][0] - nodes[j][0]
            dy = nodes[i][1] - nodes[j][1]
            dist = math.sqrt(dx * dx + dy * dy)
            if dist < 72:
                # Front vs back depth coloring
                z_avg = (nodes[i][2] + nodes[j][2]) / 2
                if z_avg > 0:
                    draw.line([(nodes[i][0], nodes[i][1]), (nodes[j][0], nodes[j][1])], fill=(2, 132, 199, 140), width=2)
                else:
                    draw.line([(nodes[i][0], nodes[i][1]), (nodes[j][0], nodes[j][1])], fill=(203, 213, 225, 90), width=1)

    # Nodes
    for px, py, z in nodes:
        if z > 0:
            size = 4
            draw.ellipse([px - size - 2, py - size - 2, px + size + 2, py + size + 2], fill=(224, 242, 254, 255))
            draw.ellipse([px - size, py - size, px + size, py + size], fill=(2, 132, 199, 255))
            draw.ellipse([px - 1, py - 1, px + 1, py + 1], fill=(255, 255, 255, 255))
        else:
            size = 2.5
            draw.ellipse([px - size, py - size, px + size, py + size], fill=(148, 163, 184, 180))

    out_file = os.path.join(ASSETS_DIR, "executive_cortex.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_light_hud():
    """Generates an executive optical vision HUD on luminous white canvas"""
    w, h = 1200, 760
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Background card with soft border
    draw.rectangle([10, 10, w - 10, h - 10], fill=(248, 250, 252, 255), outline=(226, 232, 240, 255), width=2)

    # Bounding Box for Face
    bx1, by1 = 340, 130
    bx2, by2 = 860, 630
    draw.rectangle([bx1, by1, bx2, by2], outline=(2, 132, 199, 255), width=2)

    # High-precision machined corner brackets
    arm = 45
    corners = [
        ((bx1, by1), (bx1 + arm, by1), (bx1, by1 + arm)),
        ((bx2, by1), (bx2 - arm, by1), (bx2, by1 + arm)),
        ((bx1, by2), (bx1 + arm, by2), (bx1, by2 - arm)),
        ((bx2, by2), (bx2 - arm, by2), (bx2, by2 - arm))
    ]
    for c, h_line, v_line in corners:
        draw.line([c, h_line], fill=(2, 132, 199, 255), width=5)
        draw.line([c, v_line], fill=(2, 132, 199, 255), width=5)

    # Facial oval target
    cx, cy = 600, 360
    draw.ellipse([cx - 150, cy - 200, cx + 150, cy + 200], outline=(14, 165, 233, 160), width=2)

    # Eye fixation crosshairs
    for ex in [cx - 65, cx + 65]:
        draw.ellipse([ex - 35, cy - 35, ex + 35, cy + 35], outline=(16, 185, 129, 200), width=2)
        draw.line([(ex - 45, cy), (ex + 45, cy)], fill=(16, 185, 129, 180), width=1)
        draw.line([(ex, cy - 45), (ex, cy + 45)], fill=(16, 185, 129, 180), width=1)
        draw.ellipse([ex - 6, cy - 6, ex + 6, cy + 6], fill=(16, 185, 129, 255))

    # Gaze vector indicator
    draw.line([(cx, cy), (cx, cy - 140)], fill=(234, 88, 12, 255), width=3)
    draw.ellipse([cx - 8, cy - 148, cx + 8, cy - 132], fill=(234, 88, 12, 255))

    # Telemetry badges in corners
    draw.rectangle([bx1 + 15, by1 + 15, bx1 + 180, by1 + 55], fill=(255, 255, 255, 240), outline=(226, 232, 240, 255), width=1)
    draw.rectangle([bx2 - 200, by1 + 15, bx2 - 15, by1 + 55], fill=(255, 255, 255, 240), outline=(226, 232, 240, 255), width=1)
    draw.rectangle([bx1 + 15, by2 - 55, bx1 + 220, by2 - 15], fill=(255, 255, 255, 240), outline=(226, 232, 240, 255), width=1)

    out_file = os.path.join(ASSETS_DIR, "executive_hud.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_light_fft():
    """Generates an executive 128-band FFT spectrogram on luminous white canvas"""
    w, h = 1200, 600
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Base grid
    for y in range(80, 520, 60):
        draw.line([(60, y), (1140, y)], fill=(241, 245, 249, 255), width=1)
    draw.line([(60, 520), (1140, 520)], fill=(203, 213, 225, 255), width=2)

    # 48 frequency bars with gradient
    num_bars = 48
    bar_w = 16
    gap = 7
    start_x = (w - (num_bars * (bar_w + gap))) // 2

    for i in range(num_bars):
        f1 = math.exp(-((i - 12) ** 2) / 28) * 360
        f2 = math.exp(-((i - 26) ** 2) / 40) * 240
        f3 = math.exp(-((i - 38) ** 2) / 20) * 130
        h_bar = max(24, min(420, int(f1 + f2 + f3 + (math.sin(i * 0.7) * 35))))

        x = start_x + i * (bar_w + gap)
        y = 520 - h_bar

        # Beautiful vibrant gradient color (Blue -> Teal -> Emerald)
        col = (2, 132, 199, 255) if h_bar > 280 else ((14, 165, 233, 255) if h_bar > 150 else (16, 185, 129, 220))
        draw.rectangle([x, y, x + bar_w, 520], fill=col)
        # Peak specular cap
        draw.rectangle([x, y - 4, x + bar_w, y], fill=(15, 23, 42, 200))

    out_file = os.path.join(ASSETS_DIR, "executive_fft.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_light_consensus():
    """Generates an executive 4-Agent distributed consensus diagram on white canvas"""
    w, h = 1200, 640
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    cx, cy = 600, 320
    r = 200

    # Concentric orbital bus rings
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(226, 232, 240, 255), width=3)
    draw.ellipse([cx - r + 35, cy - r + 35, cx + r - 35, cy + r - 35], outline=(241, 245, 249, 255), width=2)

    # Central Broadcast Hub
    draw.ellipse([cx - 50, cy - 50, cx + 50, cy + 50], fill=(248, 250, 252, 255), outline=(2, 132, 199, 255), width=2)

    nodes = [
        ("ALPHA", cx, cy - r, (2, 132, 199)),
        ("BETA", cx + r, cy, (234, 88, 12)),
        ("GAMMA", cx, cy + r, (217, 119, 6)),
        ("DELTA", cx - r, cy, (16, 185, 129))
    ]

    for name, nx, ny, color in nodes:
        # Connecting lines to center
        draw.line([(cx, cy), (nx, ny)], fill=color, width=2)
        # Node container
        draw.ellipse([nx - 46, ny - 46, nx + 46, ny + 46], fill=(255, 255, 255, 255), outline=color, width=3)
        draw.ellipse([nx - 14, ny - 14, nx + 14, ny + 14], fill=color)

    # Outer mesh connections
    draw.line([(cx, cy - r), (cx + r, cy)], fill=(203, 213, 225, 255), width=2)
    draw.line([(cx + r, cy), (cx, cy + r)], fill=(203, 213, 225, 255), width=2)
    draw.line([(cx, cy + r), (cx - r, cy)], fill=(203, 213, 225, 255), width=2)
    draw.line([(cx - r, cy), (cx, cy - r)], fill=(203, 213, 225, 255), width=2)

    out_file = os.path.join(ASSETS_DIR, "executive_consensus.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

def generate_light_architecture():
    """Generates the executive full-stack client-side execution architecture diagram"""
    w, h = 1200, 640
    img = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # 3-Tier Layer Architecture
    layers = [
        ("LAYER 1: SENSOR INGESTION (Hardware-Accelerated 60 FPS Camera & 48 kHz Audio)", 70, (2, 132, 199)),
        ("LAYER 2: EDGE SIGNAL EXTRACTION (Luminance Optical Flow & 128-FFT Dispersion)", 240, (234, 88, 12)),
        ("LAYER 3: COGNITIVE ARBITRATION (o1/R1 Test-Time Compute & RAFT Distributed Consensus)", 410, (16, 185, 129))
    ]

    for title, y, col in layers:
        draw.rectangle([80, y, 1120, y + 110], fill=(248, 250, 252, 255), outline=col, width=2)
        # Left accent stripe
        draw.rectangle([80, y, 92, y + 110], fill=col)

        # Status indicator dots
        for i in range(5):
            xx = 980 + i * 24
            draw.ellipse([xx, y + 45, xx + 12, y + 57], fill=col)

    # Interconnect flow arrows
    for x in [320, 600, 880]:
        draw.line([(x, 180), (x, 240)], fill=(148, 163, 184, 255), width=3)
        draw.polygon([(x - 6, 235), (x + 6, 235), (x, 242)], fill=(148, 163, 184, 255))

        draw.line([(x, 350), (x, 410)], fill=(148, 163, 184, 255), width=3)
        draw.polygon([(x - 6, 405), (x + 6, 405), (x, 412)], fill=(148, 163, 184, 255))

    out_file = os.path.join(ASSETS_DIR, "executive_architecture.png")
    img.save(out_file, "PNG")
    print(f"[OK] Generated {out_file}")
    return out_file

if __name__ == "__main__":
    generate_light_comparison()
    generate_light_cortex()
    generate_light_hud()
    generate_light_fft()
    generate_light_consensus()
    generate_light_architecture()
