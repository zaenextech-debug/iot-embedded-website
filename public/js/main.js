document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbar = document.querySelector('.navbar');
  mobileMenuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
    mobileMenuBtn.innerHTML = navbar.classList.contains('active')
      ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.navbar a').forEach(a => {
    a.addEventListener('click', () => {
      if (navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Header scroll shadow
  const header = document.querySelector('.header');
  const onScrollHeader = () => {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollHeader);
  onScrollHeader();

  // Back to top
  const backToTopBtn = document.querySelector('.back-to-top');
  const onScrollTop = () => {
    if (window.scrollY > 300) backToTopBtn.classList.add('active');
    else backToTopBtn.classList.remove('active');
  };
  window.addEventListener('scroll', onScrollTop);
  onScrollTop();

  // Smooth scroll for # and /# links, with fixed-header offset
  const smoothLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', e => {
      const raw = link.getAttribute('href');
      const targetId = raw.startsWith('/#') ? raw.slice(1) : raw;
      if (targetId.length <= 1) return;
      const el = document.querySelector(targetId);
      if (el) {
        e.preventDefault();
        const headerOffset = 80;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        // set active state
        setActiveLink(targetId.replace('#',''));
      }
    });
  });

  // Reveal animation on scroll
  const revealTargets = document.querySelectorAll('.service-card, .project-card, .testimonial-card');
  const initReveal = () => {
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
    });
  };
  const animateOnScroll = () => {
    revealTargets.forEach(el => {
      const pos = el.getBoundingClientRect().top;
      if (pos < window.innerHeight - 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };
  initReveal();
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // Scroll spy to highlight active nav item
  const sections = ['home','about','services','projects','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = (id) => {
    document.querySelectorAll('.navbar a').forEach(a => a.classList.remove('active'));
    const link = document.querySelector(`.navbar a[href="/#${id}"], .navbar a[href="#${id}"]`);
    if (link) link.classList.add('active');
  };

  const onScrollSpy = () => {
    let current = 'home';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    setActiveLink(current);
  };
  window.addEventListener('scroll', onScrollSpy);
  onScrollSpy();
});
