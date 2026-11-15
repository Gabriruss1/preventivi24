# Preventivi24 - Sito web

Sito statico per il servizio di riscrittura preventivi su 3 opzioni.

## Struttura

```
sito/
├── index.html          # Landing page
├── come-funziona.html  # Come funziona + esempio reale
├── servizi.html        # Servizi e prezzi
├── contatti.html       # Form di contatto
└── css/
    └── style.css       # Stile principale
```

## Come mettere online GRATIS

### Opzione 1: GitHub Pages (consigliata)

1. Crea un account su github.com (gratuito)
2. Crea un nuovo repository (es. "preventivi24-sito")
3. Carica tutti i file della cartella `sito/` nel repository
4. Vai su Settings → Pages → Source: "Deploy from a branch" → Branch: "main" → Folder: "/ (root)"
5. Il sito sara online su: https://TUO-USERNAME.github.io/preventivi24-sito/

### Opzione 2: Netlify (ancora piu semplice)

1. Vai su netlify.com e crea un account gratuito
2. Trascina la cartella `sito/` nella dashboard di Netlify
3. Il sito sara online in 30 secondi su un URL tipo: https://random-name.netlify.app
4. Puoi personalizzare il nome del sito nelle impostazioni

### Opzione 3: Cloudflare Pages

1. Vai su pages.cloudflare.com e crea un account gratuito
2. Connetti il tuo repository GitHub o carica i file direttamente
3. Il sito sara online su: https://TUO-PROGETTO.pages.dev

## Dominio personalizzato (opzionale, ~10-15€/anno)

Per avere un dominio tipo preventivi24.it:

1. Acquista il dominio su un registrar (es. Register.it, Aruba, Namecheap)
   - Costo: ~10-15€/anno per un .it
   - Budget: max 25€/anno (come da piano)

2. Configura il DNS:
   - GitHub Pages: aggiungi un record CNAME o A nel pannello del registrar
   - Netlify: aggiungi il dominio nelle impostazioni del sito, poi configura il DNS

3. HTTPS: attivato automaticamente da GitHub Pages / Netlify / Cloudflare

## Da personalizzare prima di pubblicare

- [ ] Sostituire [da inserire] con Partita IVA e telefono reali
- [ ] Configurare il form di contatto (Formspree o Netlify Forms)
- [ ] Sostituire info@preventivi24.it con l'email reale
- [ ] Aggiungere il logo (se ce l hai)
- [ ] Aggiungere la privacy policy completa
- [ ] Verificare che tutti i link funzionino

## Form di contatto

Il form usa Formspree (gratuito fino a 50 invii/mese). Per attivarlo:

1. Vai su formspree.io e crea un account gratuito
2. Crea un nuovo form
3. Copia l'endpoint (es. https://formspree.io/f/abc123)
4. Sostituisci "YOUR_FORM_ID" in contatti.html con il tuo ID

Alternativa: se usi Netlify, puoi usare Netlify Forms (gratuito) aggiungendo `netlify` all'attributo form.

## Note

- Il sito e completamente statico (HTML + CSS). Nessun backend, nessun database.
- Nessun costo di hosting (GitHub Pages / Netlify / Cloudflare Pages sono gratuiti).
- Il costo unico e il dominio (~10-15€/anno).
- Il sito e responsive (funziona su mobile e desktop).
- SEO: meta description e title impostati per ogni pagina.
