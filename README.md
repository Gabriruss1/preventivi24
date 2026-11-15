# Preventivi24 - Sito web

Sito statico per il servizio di riscrittura preventivi su 3 opzioni.

## Struttura

```
sito/
├── index.html          # Landing page
├── come-funziona.html  # Come funziona + esempio reale
├── servizi.html        # Servizi e prezzi
├── contatti.html       # Form di contatto
├── grazie.html          # Thank you page (dopo l'invio del form)
├── privacy.html         # Privacy policy
├── cookie.html          # Cookie policy
├── 404.html             # Page not found
├── robots.txt           # robots.txt
├── sitemap.xml          # Sitemap XML
├── images/
│   └── og.png           # Open Graph image
├── css/
│   └── style.css       # Stile principale
├── js/
│   └── main.js         # Animazioni + invio form
└── .nojekyll           # Necessario per GitHub Pages
```

## Come è pubblicato ORA (funzionante)

Il sito è online su **GitHub Pages**:

- **URL:** https://gabriruss1.github.io/preventivi24/
- **Repository:** https://github.com/Gabriruss1/preventivi24
- **Pubblicazione:** push sul branch `main` → GitHub Pages ricompila in 1-2 minuti
- **Costo:** 0 €

### Aggiornare il sito

```bash
cd "sito"
git add -A
git commit -m "Aggiornamento sito"
git push origin main
```

Dopo il push, GitHub Pages pubblica automaticamente la nuova versione.

## Form di contatto (funzionante)

Il form usa **FormSubmit** e invia ogni richiesta a `russo.enterprise.biz@gmail.com`.

- Endpoint AJAX: `https://formsubmit.co/ajax/russo.enterprise.biz@gmail.com`
- Dominio attivato: `https://gabriruss1.github.io/`
- L'attivazione va fatta una volta per dominio (link ricevuto via email e confermato).
- Se in futuro si passa a un dominio personalizzato, va rifatta l'attivazione per il nuovo dominio.
- Fallback: se il servizio non risponde, si apre il client email con il messaggio precompilato.

## Dominio personalizzato (opzionale, ~10-15 €/anno)

Per avere un dominio tipo `preventivi24.it`:

1. Acquista il dominio su un registrar (es. Register.it, Aruba, Namecheap). Costo ~10-15 €/anno.
2. Su GitHub: repository → Settings → Pages → Custom domain → inserisci il dominio.
3. Nel pannello DNS del registrar crea un record `CNAME` per `www` verso `gabriruss1.github.io` e i record `A` per l'apice verso gli IP di GitHub Pages.
4. Attendi la verifica e attiva "Enforce HTTPS".
5. Dopo il cambio dominio, **riattiva FormSubmit** per il nuovo dominio (nuova submission + click sul link di attivazione).

## Da personalizzare prima di pubblicare

- [x] Sostituire l'email finta con quella reale (`russo.enterprise.biz@gmail.com`)
- [x] Configurare il form di contatto (FormSubmit, attivo)
- [x] Pubblicare il sito (GitHub Pages)
- [x] Rimossi i segnaposto `[da inserire]` e il link `tel:+39` morto
- [ ] Aggiungere Partita IVA e telefono reali quando disponibili
- [ ] Aggiungere il logo (se disponibile)
- [ ] Privacy policy completa (oggi c'è una sintesi)

## Note

- Il sito è completamente statico (HTML + CSS + JS). Nessun backend, nessun database.
- Hosting gratuito e permanente su GitHub Pages.
- Il costo unico è il dominio (~10-15 €/anno), opzionale.
- Il sito è responsive (funziona su mobile e desktop).
- Animazioni con CSS e JavaScript nativo, senza dipendenze esterne.
- SEO: meta description e title impostati per ogni pagina.
