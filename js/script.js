/**
 * Aura Music - Landing Page Scripts
 * Native ecosystem for Android, Windows & Linux
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.site-header');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const detailsElements = document.querySelectorAll('details');

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

  // 2. Interactive Showcase Tabs (Noctis style)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const showcaseScreens = document.querySelectorAll('.showcase-screen');
  const showcaseInfos = document.querySelectorAll('.showcase-info');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      // Update active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active screen
      showcaseScreens.forEach(screen => {
        if (screen.id === targetId) {
          screen.classList.add('active');
        } else {
          screen.classList.remove('active');
        }
      });

      // Update active info block
      showcaseInfos.forEach(info => {
        if (info.getAttribute('data-info') === targetId) {
          info.style.display = 'flex';
        } else {
          info.style.display = 'none';
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

  // 4. Smooth scrolling for anchor links with header offset
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

  // 5. Accordion behavior: close other details when opening one
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

  // 6. OS Detection to highlight appropriate download button
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
