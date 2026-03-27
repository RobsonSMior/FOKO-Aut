// ============================================================
// FOKO — Landing Page Scripts v2
// ============================================================

(function () {
  'use strict';

  // ── Header: scroll state ──
  var header = document.getElementById('header');

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Reveal on scroll ──
  var revealEls = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = el.parentElement.querySelectorAll('.reveal');
          var index = Array.prototype.indexOf.call(siblings, el);
          el.style.transitionDelay = Math.min(index * 0.1, 0.4) + 's';
          el.classList.add('visible');
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Parallax leve no hero ──
  var heroImg = document.querySelector('.hero__img');

  if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      heroImg.style.transform = 'scale(1) translateY(' + (y * 0.22) + 'px)';
    }, { passive: true });
  }

  // ── Smooth scroll em links âncora ──
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ── Pulse periódico no botão WhatsApp flutuante ──
  var waFloat = document.querySelector('.whatsapp-float');

  if (waFloat && typeof waFloat.animate === 'function') {
    function pulse() {
      waFloat.animate(
        [
          { boxShadow: '0 4px 20px rgba(37,211,102,0.35), 0 0 0 0 rgba(37,211,102,0.4)' },
          { boxShadow: '0 4px 20px rgba(37,211,102,0.35), 0 0 0 12px rgba(37,211,102,0)' }
        ],
        { duration: 900, easing: 'ease-out' }
      );
      setTimeout(pulse, 5000);
    }
    setTimeout(pulse, 4000);
  }

  // ── Active nav link on scroll ──
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav a');

  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = '#b8924a';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

})();
