// Preventivi24 - Main JavaScript
// GSAP ScrollTrigger animations + interactions

// Load GSAP from CDN
(function() {
  const gsapScript = document.createElement('script');
  gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  gsapScript.onload = function() {
    const stScript = document.createElement('script');
    stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
    stScript.onload = initAnimations;
    document.head.appendChild(stScript);
  };
  document.head.appendChild(gsapScript);
})();

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // ---- Scroll-triggered reveals ----
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function(el) {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ---- Stagger reveals ----
  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  staggerContainers.forEach(function(container) {
    const children = container.children;
    gsap.fromTo(children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ---- Counting animation for prices ----
  const priceElements = document.querySelectorAll('[data-count]');
  priceElements.forEach(function(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: function() {
        el.textContent = Math.round(obj.val).toLocaleString('it-IT');
      }
    });
  });

  // ---- Hero comparison animation ----
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    const rows = heroVisual.querySelectorAll('.quote-row');
    gsap.fromTo(rows,
      { opacity: 0, x: 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.3,
        ease: 'power2.out',
        delay: 0.5,
      }
    );
  }

  // ---- Option cards entrance ----
  const optionCards = document.querySelectorAll('.option-card');
  if (optionCards.length) {
    gsap.fromTo(optionCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.option-cards',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // ---- Process steps entrance ----
  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    gsap.fromTo(processSteps,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.process-steps',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // ---- Price cards entrance ----
  const priceCards = document.querySelectorAll('.price-card');
  if (priceCards.length) {
    gsap.fromTo(priceCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // ---- Problem items entrance ----
  const problemItems = document.querySelectorAll('.problem-item');
  if (problemItems.length) {
    gsap.fromTo(problemItems,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.problem-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // ---- FAQ accordion animation ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    const summary = item.querySelector('summary');
    const content = item.querySelector('p');
    if (!summary || !content) return;

    // Start closed
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

    summary.addEventListener('click', function(e) {
      e.preventDefault();
      if (item.hasAttribute('open')) {
        // Closing
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(function() {
          content.style.maxHeight = '0';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
        });
        setTimeout(function() {
          item.removeAttribute('open');
        }, 300);
      } else {
        // Opening
        item.setAttribute('open', '');
        content.style.maxHeight = '0';
        content.style.paddingTop = '';
        content.style.paddingBottom = '';
        requestAnimationFrame(function() {
          content.style.maxHeight = content.scrollHeight + 'px';
        });
      }
    });
  });
}

// ---- Scroll progress bar ----
(function() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

// ---- Back to top button ----
(function() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '&uarr;';
  btn.setAttribute('aria-label', 'Torna su');
  document.body.appendChild(btn);

  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ---- Mobile menu ----
(function() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function() {
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

// ---- Form AJAX submit (FormSubmit) ----
(function() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  // Show success message if redirected back with ?sent=1
  if (window.location.search.indexOf('sent=1') !== -1) {
    const status = document.getElementById('formStatus');
    if (status) {
      status.style.display = '';
      status.textContent = 'Messaggio inviato! Ti risponderemo entro 24 ore.';
      status.className = 'form-status success';
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const status = document.getElementById('formStatus');
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
    .then(function(response) {
      return response.json().then(function(data) {
        const ok = response.ok && (data.success === 'true' || data.success === true);
        if (ok) {
          form.reset();
          if (btn) {
            btn.textContent = 'Invia richiesta';
            btn.disabled = false;
          }
          if (status) {
            status.style.display = '';
            status.textContent = 'Messaggio inviato! Ti risponderemo entro 24 ore.';
            status.className = 'form-status success';
          }
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
    .catch(function() {
      // Fallback: build mailto link so the request is never lost
      const nome = form.querySelector('[name="nome"]').value;
      const email = form.querySelector('[name="email"]').value;
      const azienda = form.querySelector('[name="azienda"]').value;
      const settore = form.querySelector('[name="settore"]').value;
      const telefono = form.querySelector('[name="telefono"]').value;
      const messaggio = form.querySelector('[name="messaggio"]').value;

      const subject = encodeURIComponent('Richiesta preventivo - ' + nome + ' - ' + azienda);
      const mailBody = encodeURIComponent(
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

// ---- Skip to content ----
(function() {
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main-content';
  skip.textContent = 'Salta al contenuto';
  document.body.prepend(skip);
})();
