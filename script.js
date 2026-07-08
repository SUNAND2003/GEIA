/* ===========================================================
   Autism & Individual Needs Academy — Shared behaviour
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const runCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(c => cio.observe(c));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- Testimonial carousel ---------- */
  const track = document.querySelector('.testi-track');
  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    const dotsWrap = document.querySelector('.testi-dots');
    let index = 0;
    let timer;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('button');

    function goTo(i) {
      index = (i + cards.length) % cards.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }
    function autoplay() {
      timer = setInterval(() => goTo(index + 1), 6000);
    }
    autoplay();
    track.closest('.testi-track-wrap').addEventListener('mouseenter', () => clearInterval(timer));
    track.closest('.testi-track-wrap').addEventListener('mouseleave', autoplay);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Blog category filters ---------- */
  const filterBtns = document.querySelectorAll('.chip-filters button');
  const blogCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        blogCards.forEach(card => {
          const show = cat === 'all' || card.getAttribute('data-category') === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Blog search ---------- */
  const searchInput = document.querySelector('.search-box input');
  if (searchInput && blogCards.length) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      blogCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        card.style.display = title.includes(q) ? '' : 'none';
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('show', window.scrollY > 500);
    });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Forms (contact + newsletter) — front-end only ---------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.querySelector('.form-success');
      success.classList.add('show');
      contactForm.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  document.querySelectorAll('.newsletter-row').forEach(row => {
    row.addEventListener('submit', (e) => e.preventDefault());
    const btn = row.querySelector('button');
    const input = row.querySelector('input');
    if (btn && input) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (input.value.trim()) {
          btn.textContent = 'Subscribed ✓';
          input.value = '';
          setTimeout(() => { btn.textContent = 'Subscribe'; }, 2500);
        }
      });
    }
  });

  /* ---------- Active nav link highlight ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});