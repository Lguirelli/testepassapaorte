from pathlib import Path
import asyncio, shutil, base64, mimetypes, re, sys
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
SHOW = ROOT / 'showcase'
OUT = ROOT / 'artifacts' / 'showcase'
PAGES = ['index','explorar','lugar','parceiro','roteiro-criar','roteiro','calendario','passaporte','admin']
VIEWPORTS = {'desktop': (1440, 1000), 'mobile': (390, 844)}

def data_uri(path: Path):
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')

def inline_html(name: str):
    html = (SHOW / f'{name}.html').read_text(encoding='utf-8')
    css = (SHOW / 'styles.css').read_text(encoding='utf-8')
    css = '\n'.join(line for line in css.splitlines() if not line.lstrip().startswith('@import '))
    js = (SHOW / 'app.js').read_text(encoding='utf-8')
    html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css}</style>')
    html = html.replace('<script src="app.js"></script>', f'<script>{js}</script>')
    refs = set(re.findall(r"assets/(?:icons|illustrations)/[^'\"\)]+\.svg", html))
    for ref in refs:
        p = SHOW / ref
        if p.exists():
            html = html.replace(ref, data_uri(p))
    return html

async def main():
    errors = []
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        system_chromium = shutil.which('chromium') or shutil.which('chromium-browser')
        kwargs = {'headless': True}
        if system_chromium:
            kwargs['executable_path'] = system_chromium
        browser = await p.chromium.launch(**kwargs)
        for vp, (w, h) in VIEWPORTS.items():
            d = OUT / vp
            d.mkdir(parents=True, exist_ok=True)
            for name in PAGES:
                page = await browser.new_page(viewport={'width': w, 'height': h})
                page_errors, console_errors = [], []
                page.on('pageerror', lambda exc, box=page_errors: box.append(str(exc)))
                page.on('console', lambda msg, box=console_errors: box.append(msg.text) if msg.type == 'error' else None)
                await page.set_content(inline_html(name), wait_until='domcontentloaded', timeout=15000)
                await page.wait_for_timeout(80)
                overflow = await page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth + 1')
                if overflow:
                    errors.append(f'{vp}/{name}: horizontal overflow')
                if page_errors:
                    errors.append(f'{vp}/{name}: page errors {page_errors}')
                if console_errors:
                    errors.append(f'{vp}/{name}: console errors {console_errors}')
                # Interaction smoke checks for reference-driven patterns.
                if name == 'roteiro-criar':
                    active = await page.locator('.orbital-point.active').text_content()
                    if (active or '').strip() != '01':
                        errors.append(f'{vp}/{name}: orbital starts on {active!r}, expected 01')
                    await page.locator('[data-step-next]').click()
                    active2 = await page.locator('.orbital-point.active').text_content()
                    if (active2 or '').strip() != '02':
                        errors.append(f'{vp}/{name}: orbital did not advance to 02')
                if name == 'calendario':
                    await page.locator('[data-calendar-mode="day"]').click()
                    if not await page.locator('[data-calendar-view="day"]').evaluate('e => e.classList.contains("active")'):
                        errors.append(f'{vp}/{name}: day mode did not activate')
                await page.screenshot(path=str(d / f'{name}.png'), full_page=False)
                await page.close()
        # Dark-mode smoke: external shell dark, passport paper remains physical.
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000})
        await page.set_content(inline_html('passaporte'), wait_until='domcontentloaded')
        await page.evaluate("document.documentElement.dataset.theme='dark'")
        paper_bg = await page.locator('.passport-paper-stage').evaluate('e => getComputedStyle(e).backgroundColor')
        if 'rgb(220, 212, 198)' not in paper_bg:
            errors.append(f'dark/passaporte: paper material changed unexpectedly: {paper_bg}')
        await page.screenshot(path=str(OUT / 'passport-dark.png'), full_page=False)
        await page.close()
        await browser.close()
    if errors:
        print('\n'.join(errors))
        sys.exit(1)
    print(f'showcase visual regression ok: {len(PAGES) * len(VIEWPORTS) + 1} screenshots, no overflow/page errors')

asyncio.run(main())
