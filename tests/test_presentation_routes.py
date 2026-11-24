import urllib.request

urls = [
    'http://localhost:8080/',
    'http://localhost:8080/presentation/',
    'http://localhost:8080/presentation/NEURALIS_OMNI_EXECUTIVE_DECK.pptx',
    'http://localhost:8080/presentation/assets/executive_comparison.png',
    'http://localhost:8080/presentation/assets/executive_cortex.png',
    'http://localhost:8080/presentation/assets/executive_hud.png',
    'http://localhost:8080/presentation/assets/executive_fft.png',
    'http://localhost:8080/presentation/assets/executive_consensus.png',
    'http://localhost:8080/presentation/assets/executive_architecture.png'
]

for target_url in urls:
    try:
        resp = urllib.request.urlopen(target_url)
        print(f'[PASS] {target_url} -> Status {resp.status}, length {len(resp.read())}')
    except Exception as err:
        print(f'[FAIL] {target_url} -> {err}')
