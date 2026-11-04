/**
 * AURA MUSIC — Boutique Web Architecture & Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const detailsElements = document.querySelectorAll('.faq-item');

  // 1. Header scroll effect (blur & shadow)
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Interactive Segmented Control Showcase
  const segmentButtons = document.querySelectorAll('.segment-btn');
  const showcaseSlides = document.querySelectorAll('.showcase-slide');
  const showcaseMetas = document.querySelectorAll('.showcase-meta-bar');

  segmentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-slide');
      if (!targetId) return;

      // Update active segmented button
      segmentButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active slide
      showcaseSlides.forEach(slide => {
        if (slide.id === targetId) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update active meta description bar
      showcaseMetas.forEach(meta => {
        if (meta.getAttribute('data-meta') === targetId) {
          meta.style.display = 'flex';
        } else {
          meta.style.display = 'none';
        }
      });
    });
  });

  // 3. Active section highlight in navigation
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // 4. Smooth scrolling with header offset
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  // 5. Accordion: smooth toggle & single-open mode
  detailsElements.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        detailsElements.forEach(otherDetail => {
          if (otherDetail !== detail && otherDetail.open) {
            otherDetail.open = false;
          }
        });
      }
    });
  });

  // 6. OS Detection to highlight appropriate download badge
  const detectOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform?.toLowerCase() || '';
    
    if (/android/.test(userAgent)) {
      document.body.classList.add('os-android');
    } else if (/win/.test(platform) || /windows/.test(userAgent)) {
      document.body.classList.add('os-windows');
    } else if (/linux/.test(platform) || /linux/.test(userAgent)) {
      document.body.classList.add('os-linux');
    }
  };
  detectOS();

  console.log('🎵 Aura Music Landing Page initialized successfully.');
});
