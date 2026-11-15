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
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  toggle.addEventListener('click', function () {
    var active = menu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', active ? 'true' : 'false');
    document.body.style.overflow = active ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

// ---- Form AJAX submit (FormSubmit) ----
(function () {
  var form = document.querySelector('#contactForm');
  if (!form) return;

  // Show success message if redirected back with ?sent=1
  if (window.location.search.indexOf('sent=1') !== -1) {
    var status = document.getElementById('formStatus');
    if (status) {
      status.style.display = '';
      status.textContent = 'Messaggio inviato! Ti risponderemo entro 24 ore.';
      status.className = 'form-status success';
    }
  }

  form.addEventListener('submit', function (e) {
    var honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value && honey.value.trim() !== '') {
      // Honeypot: bot submission -> ignore silently
      return;
    }
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var status = document.getElementById('formStatus');
    if (btn) {
      btn.textContent = 'Invio in corso...';
      btn.disabled = true;
    }
    if (status) {
      status.style.display = 'none';
      status.className = 'form-status';
    }

    fetch('https://formsubmit.co/ajax/russo.enterprise.biz@gmail.com', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (response) {
      return response.json().then(function (data) {
        var ok = response.ok && (data.success === 'true' || data.success === true);
        if (ok) {
          form.reset();
          window.location.href = 'grazie.html';
          return;
        }
        if (data.message && String(data.message).indexOf('Activation') !== -1) {
          if (btn) {
            btn.textContent = 'Invia richiesta';
            btn.disabled = false;
          }
          if (status) {
            status.style.display = '';
            status.textContent = 'Messaggio ricevuto! Completa l’attivazione dalla casella email per ricevere le richieste.';
            status.className = 'form-status success';
          }
          return;
        }
        throw new Error(data.message || 'Server error');
      });
    })
    .catch(function () {
      // Fallback: build mailto link so the request is never lost
      var nome = form.querySelector('[name="nome"]').value;
      var email = form.querySelector('[name="email"]').value;
      var azienda = form.querySelector('[name="azienda"]').value;
      var settore = form.querySelector('[name="settore"]').value;
      var telefono = form.querySelector('[name="telefono"]').value;
      var messaggio = form.querySelector('[name="messaggio"]').value;

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
      window.location.href = 'mailto:russo.enterprise.biz@gmail.com?subject=' + subject + '&body=' + mailBody;

      if (btn) {
        btn.textContent = 'Invia richiesta';
        btn.disabled = false;
      }
      if (status) {
        status.style.display = '';
        status.textContent = 'Il tuo client email si aprirà con il messaggio precompilato. Premi Invia per spedirlo.';
        status.className = 'form-status success';
      }
    });
  });
})();
