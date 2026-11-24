"""
NEURALIS OMNI - LOCAL SERVER & MOBILE CONTINUITY HOST
Automatically detects Local LAN IP, hosts on port 8080, and prints phone pairing details.
"""

import http.server
import socketserver
import socket
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable cache during development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run():
    lan_ip = get_lan_ip()
    local_url = f"http://localhost:{PORT}"
    mobile_url = f"http://{lan_ip}:{PORT}"

    print("=" * 68)
    print(" >>> NEURALIS OMNI: SOVEREIGN MULTIMODAL AI RUNTIME HOST <<< ")
    print("=" * 68)
    print(f"[*] Local Host (Laptop)   : {local_url}")
    print(f"[*] Mobile Host (Phone)    : {mobile_url}")
    print(f"[*] Root Directory         : {DIRECTORY}")
    print("-" * 68)
    print(" >>> LIVE DEMO INSTRUCTIONS FOR YOUR PROFESSOR / SIR <<<")
    print(f" 1. Open on your Laptop   : {local_url}")
    print(f" 2. Open on your Phone    : Connect phone to same Wi-Fi & open {mobile_url}")
    print(" 3. Zero hardware needed  : Runs 100% in-browser on phone & laptop!")
    print("=" * 68)
    print(f"Serving HTTP on 0.0.0.0 port {PORT} (Press Ctrl+C to stop)...")

    # Change to root dir
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == '__main__':
    run()
