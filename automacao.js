// ============================================================
// FOKO AUTOMAÇÃO — Scripts
// ============================================================
(function () {
  'use strict';

  // ── Header scroll ──
  var header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ──
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  navToggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Reveal on scroll ──
  var revealEls = document.querySelectorAll('.reveal');
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
      var idx = siblings.indexOf(el);
      el.style.transitionDelay = Math.min(idx * 0.1, 0.5) + 's';
      el.classList.add('visible');
      revealObs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function (el) { revealObs.observe(el); });

  // ── Parallax hero ──
  var heroImg = document.querySelector('.hero__img');
  if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', function () {
      heroImg.style.transform = 'scale(1) translateY(' + window.scrollY * 0.2 + 'px)';
    }, { passive: true });
  }

  // ── Active nav on scroll ──
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav a');
  var activeObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { threshold: 0.4 });
  sections.forEach(function (s) { activeObs.observe(s); });

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── WhatsApp pulse ──
  var waBtn = document.querySelector('.whatsapp-float');
  if (waBtn && typeof waBtn.animate === 'function') {
    (function pulse() {
      waBtn.animate([
        { boxShadow: '0 4px 20px rgba(37,211,102,0.35), 0 0 0 0 rgba(37,211,102,0.4)' },
        { boxShadow: '0 4px 20px rgba(37,211,102,0.35), 0 0 0 14px rgba(37,211,102,0)' }
      ], { duration: 900, easing: 'ease-out' });
      setTimeout(pulse, 5000);
    })();
  }

  // ── SIMULADOR ──
  var simAnswers = { step1: null, step2: null, step3: [] };
  var currentStep = 1;
  var totalSteps = 3;

  var progressFill  = document.getElementById('progressFill');
  var progressLabel = document.getElementById('progressLabel');
  var simBack       = document.getElementById('simBack');
  var simNext       = document.getElementById('simNext');
  var simResult     = document.getElementById('simResult');
  var simWaBtn      = document.getElementById('simWaBtn');

  function updateProgress() {
    progressFill.style.width = ((currentStep / totalSteps) * 100) + '%';
    progressLabel.textContent = 'Passo ' + currentStep + ' de ' + totalSteps;
  }

  function showStep(n) {
    document.querySelectorAll('.sim-step').forEach(function (s) { s.classList.remove('active'); });
    var step = document.querySelector('.sim-step[data-step="' + n + '"]');
    if (step) step.classList.add('active');
    simBack.style.display = n > 1 ? 'inline-flex' : 'none';
    simNext.textContent = n === totalSteps ? 'Ver estimativa' : 'Próximo';
    updateProgress();
  }

  // Step 1 & 2 — single select
  document.querySelectorAll('#step1 .sim-option, #step2 .sim-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var parent = this.closest('.sim-options');
      parent.querySelectorAll('.sim-option').forEach(function (b) { b.classList.remove('selected'); });
      this.classList.add('selected');
      var stepNum = this.closest('.sim-step').dataset.step;
      simAnswers['step' + stepNum] = this.dataset.value;
    });
  });

  // Step 3 — multi select
  document.querySelectorAll('#step3 .sim-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.classList.toggle('selected');
      var val = this.dataset.value;
      var idx = simAnswers.step3.indexOf(val);
      if (idx === -1) simAnswers.step3.push(val);
      else simAnswers.step3.splice(idx, 1);
    });
  });

  simNext.addEventListener('click', function () {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    } else {
      showResult();
    }
  });

  simBack.addEventListener('click', function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  function showResult() {
    document.querySelector('.simulator__steps').style.display = 'none';
    document.querySelector('.simulator__progress').style.display = 'none';
    document.querySelector('.simulator__nav').style.display = 'none';
    simResult.style.display = 'block';

    var tipo = simAnswers.step1 || 'Imóvel';
    var tam  = simAnswers.step2 || 'Tamanho não informado';
    var serv = simAnswers.step3.length > 0 ? simAnswers.step3.join(', ') : 'Automação geral';

    var msg = encodeURIComponent(
      'Olá! Gostaria de receber uma estimativa para meu projeto.\n' +
      'Tipo de imóvel: ' + tipo + '\n' +
      'Tamanho: ' + tam + '\n' +
      'Automação desejada: ' + serv
    );
    simWaBtn.href = 'https://wa.me/5551986523247?text=' + msg;
  }

  // ── FORMULÁRIO ──
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = document.getElementById('name').value.trim();
      var phone   = document.getElementById('whatsapp').value.trim();
      var project = document.getElementById('project').value;
      var message = document.getElementById('message').value.trim();

      if (!name || !phone || !project) {
        alert('Por favor, preencha nome, WhatsApp e tipo de projeto.');
        return;
      }

      var subject = encodeURIComponent('Novo contato via site — ' + project);
      var body = encodeURIComponent(
        'Nome: ' + name + '\n' +
        'WhatsApp: ' + phone + '\n' +
        'Tipo de projeto: ' + project +
        (message ? '\nMensagem: ' + message : '')
      );
      window.location.href = 'mailto:robson.projetosfoko@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

})();
