from __future__ import annotations
import os
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

site = os.environ.get("SITE_URL", "").strip()
if not site:
    raise SystemExit("SITE_URL não definido")
if not site.endswith("/"):
    site += "/"

out = Path("artifacts/post-deploy")
out.mkdir(parents=True, exist_ok=True)

pages = [
    ("home", ""),
    ("explorar", "explorar.html"),
    ("passaporte", "passaporte.html"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width": 1440, "height": 1000})
    errors: list[str] = []

    for name, relative in pages:
        page = context.new_page()
        page.on("console", lambda msg: errors.append(f"console {msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(f"pageerror: {exc}"))
        response = page.goto(urljoin(site, relative), wait_until="networkidle", timeout=60_000)
        if response is None or response.status >= 400:
            raise RuntimeError(f"{name}: resposta HTTP inválida: {None if response is None else response.status}")
        body = page.locator("body").inner_text()
        if "Pacote de documentação e referências" in body:
            raise RuntimeError("GitHub Pages publicou a documentação no lugar da showcase visual")
        if name == "home":
            marker = page.locator('meta[name="passaporte-surface"][content="visual-showcase"]')
            if marker.count() != 1:
                raise RuntimeError("Marcador visual-showcase não encontrado na Home publicada")
        overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 2")
        if overflow:
            raise RuntimeError(f"{name}: overflow horizontal detectado")
        page.screenshot(path=str(out / f"{name}.png"), full_page=True)
        page.close()

    browser.close()

if errors:
    raise RuntimeError("Erros de navegador no pós-deploy:\n" + "\n".join(errors))
print(f"Pós-deploy OK: {site}")
