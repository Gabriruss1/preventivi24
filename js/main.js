// Preventivi24 - Main JavaScript

// ---- Scroll reveal (CSS transitions, no external libraries) ----
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var pending = Array.prototype.slice.call(
    document.querySelectorAll('.reveal, .reveal-stagger')
  );
  if (!pending.length) return;

  document.documentElement.classList.add('js-anim');

  function revealPending() {
    var limit = window.innerHeight * 0.92;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add('visible');
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      revealPending();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  revealPending();
})();

// ---- FAQ accordion ----
(function () {
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var summary = item.querySelector('summary');
    var content = item.querySelector('p');
    if (!summary || !content) return;

    // Start closed
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.hasAttribute('open')) {
        // Closing
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(function () {
          content.style.maxHeight = '0';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
        });
        setTimeout(function () {
          item.removeAttribute('open');
        }, 300);
      } else {
        // Opening
        item.setAttribute('open', '');
        content.style.maxHeight = '0';
        content.style.paddingTop = '';
        content.style.paddingBottom = '';
        requestAnimationFrame(function () {
          content.style.maxHeight = content.scrollHeight + 'px';
        });
      }
    });
  });
})();

// ---- Scroll progress bar ----
(function () {
  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

// ---- Back to top button ----
(function () {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '&uarr;';
  btn.setAttribute('aria-label', 'Torna su');
  btn.setAttribute('tabindex', '-1');
  btn.setAttribute('aria-hidden', 'true');
  document.body.appendChild(btn);

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('aria-hidden', 'false');
    } else {
      btn.classList.remove('visible');
      btn.setAttribute('tabindex', '-1');
      btn.setAttribute('aria-hidden', 'true');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
})();

// ---- Mobile menu ----
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  if (!menu.id) menu.id = 'mobile-menu';
  toggle.setAttribute('aria-controls', menu.id);
  toggle.setAttribute('aria-expanded', 'false');

  function closeMenu() {
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    var active = menu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', active ? 'true' : 'false');
    document.body.style.overflow = active ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when switching to desktop layout
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && menu.classList.contains('active')) {
      closeMenu();
    }
  });
})();

// ---- Show selected plan from query string ----
(function () {
  var params = new URLSearchParams(window.location.search);
  var servizio = params.get('servizio');
  if (!servizio) return;
  var field = document.getElementById('servizioField');
  if (field) field.value = servizio;
  var info = document.querySelector('.contact-info');
  if (info) {
    var note = document.createElement('p');
    note.style.cssText = 'font-size:14px;color:var(--amber);margin-top:12px;font-weight:600;';
    var labels = { pilota: 'Piano Pilota (190 € + IVA)', sistema: 'Piano Sistema (1.290 € + IVA)', gestione: 'Piano Gestione (490 €/mese + IVA)' };
    note.textContent = 'Hai selezionato: ' + (labels[servizio] || servizio) + '.';
    info.appendChild(note);
  }
})();
(function () {
  var form = document.querySelector('#contactForm');
  if (!form) return;

  var btn = form.querySelector('button[type="submit"]');
  var status = document.getElementById('formStatus');

  function setBtn(label, disabled) {
    if (btn) { btn.textContent = label; btn.disabled = !!disabled; }
  }
  function setStatus(text, cls) {
    if (status) {
      status.style.display = '';
      status.textContent = text;
      status.className = 'form-status' + (cls ? ' ' + cls : '');
    }
  }
  function clearStatus() {
    if (status) { status.style.display = 'none'; status.textContent = ''; status.className = 'form-status'; }
  }

  form.addEventListener('submit', function (e) {
    var honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value && honey.value.trim() !== '') {
      // Honeypot: bot submission -> block completely, no HTML fallback
      e.preventDefault();
      return;
    }
    e.preventDefault();

    setBtn('Invio in corso...', true);
    clearStatus();

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 15000);

    fetch('https://formsubmit.co/ajax/russo.enterprise.biz@gmail.com', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    })
    .then(function (response) {
      clearTimeout(timeoutId);
      return response.json().then(function (data) {
        var ok = response.ok && (data.success === 'true' || data.success === true);
        if (ok) {
          form.reset();
          window.location.href = 'grazie.html';
          return;
        }
        if (data.message && String(data.message).indexOf('Activation') !== -1) {
          setBtn('Invia richiesta', false);
          setStatus('Il modulo è stato ricevuto, ma la casella di destinazione non è ancora attiva. Riprova più tardi oppure scrivici direttamente a russo.enterprise.biz@gmail.com.', 'error');
          return;
        }
        throw new Error(data.message || 'Server error');
      });
    })
    .catch(function (err) {
      clearTimeout(timeoutId);
      setBtn('Invia richiesta', false);

      var nome = (form.querySelector('[name="nome"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var azienda = (form.querySelector('[name="azienda"]') || {}).value || '';
      var settore = (form.querySelector('[name="settore"]') || {}).value || '';
      var telefono = (form.querySelector('[name="telefono"]') || {}).value || '';
      var messaggio = (form.querySelector('[name="messaggio"]') || {}).value || '';

      var subject = encodeURIComponent('Richiesta preventivo - ' + nome + ' - ' + azienda);
      var mailBody = encodeURIComponent(
        'Nuova richiesta dal sito Preventivi24\n\n' +
        'Nome: ' + nome + '\n' +
        'Email: ' + email + '\n' +
        'Azienda: ' + azienda + '\n' +
        'Settore: ' + settore + '\n' +
        'Telefono: ' + telefono + '\n\n' +
        'Messaggio:\n' + messaggio
      );
      var mailto = 'mailto:russo.enterprise.biz@gmail.com?subject=' + subject + '&body=' + mailBody;

      setStatus('La richiesta non è stata inviata dal modulo. Puoi riprovare, oppure inviarla via email con il pulsante qui sotto.', 'error');

      var existing = form.querySelector('.mailto-fallback');
      if (existing) existing.remove();
      var fallback = document.createElement('p');
      fallback.className = 'mailto-fallback form-note';
      fallback.innerHTML = '<a href="' + mailto + '" class="btn btn--amber" style="display:inline-block;margin-top:8px;">Apri l\'app di posta con il messaggio precompilato</a>';
      if (status && status.parentNode) status.parentNode.insertBefore(fallback, status.nextSibling);
    });
  });
})();
