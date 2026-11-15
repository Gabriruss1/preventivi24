#!/usr/bin/env python
"""Publish check per Preventivi24.

Verifica che il sito statico non contenga residui noti (segnaposto, codice
PowerShell, animazioni esterne) e che le pagine citate nella sitemap esistano.

Uso:
    python scripts/publish_check.py
"""

import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FORBIDDEN_PATTERNS = [
    (r"Out-File", "codice PowerShell residuo"),
    (r"C:\\\\Users", "percorso di cartella residuo"),
    (r"\[da inserire\]", "segnaposto"),
    (r"tel:\+39", "link telefono morto"),
    (r"data-count", "contatori non implementati"),
    (r"\bgsap\b", "dipendenza GSAP"),
    (r"cdnjs", "CDN estero"),
    (r"preloader", "preloader residuo"),
    (r"page-transition", "transizione di pagina residua"),
]

REQUIRED_PAGES = [
    "index.html",
    "come-funziona.html",
    "esempi.html",
    "servizi.html",
    "contatti.html",
    "grazie.html",
    "privacy.html",
    "cookie.html",
    "404.html",
]

SITEMAP = os.path.join(ROOT, "sitemap.xml")


def check_html_files():
    problems = []
    for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
        name = os.path.basename(path)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        for pattern, label in FORBIDDEN_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                problems.append("%s: troppo %s" % (name, label))
        if "</html>" in content:
            after = content.split("</html>", 1)[1]
            if after.strip():
                problems.append("%s: contenuto dopo </html>" % name)
    return problems


def check_required_pages():
    problems = []
    for page in REQUIRED_PAGES:
        if not os.path.exists(os.path.join(ROOT, page)):
            problems.append("pagina mancante: %s" % page)
    return problems


def check_sitemap():
    problems = []
    import xml.etree.ElementTree as ET

    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    try:
        tree = ET.parse(SITEMAP)
    except Exception as e:
        return ["sitemap.xml non valido XML: %s" % e]
    urls = tree.getroot().findall("s:url", ns)
    for url in urls:
        loc = url.find("s:loc", ns)
        if loc is None or not loc.text:
            problems.append("sitemap: url senza loc")
            continue
        m = re.match(r"https://gabriruss1\.github\.io/preventivi24(/.*)?$", loc.text.strip())
        if not m:
            problems.append("sitemap: URL esterna non ammessa: %s" % loc.text)
            continue
        tail = m.group(1) or "/"
        target_rel = tail.strip("/")
        target = os.path.join(ROOT, target_rel) if target_rel else os.path.join(ROOT, "index.html")
        if not os.path.exists(target):
            problems.append("sitemap: URL non risolvibile -> %s" % loc.text)
    return problems


def main():
    problems = []
    problems += check_html_files()
    problems += check_required_pages()
    problems += check_sitemap()
    if problems:
        print("PUBLISH CHECK FALLITO")
        for p in problems:
            print(" -", p)
        sys.exit(1)
    print("PUBLISH CHECK OK")


if __name__ == "__main__":
    main()
