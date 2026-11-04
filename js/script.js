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

  // 7. Interactive 5-Star Community Rating & Reviews System
  const starButtons = document.querySelectorAll('.star-svg-btn');
  const starValueInput = document.getElementById('selectedStarValue');
  const starRatingLabel = document.getElementById('starRatingLabel');
  const reviewForm = document.getElementById('communityReviewForm');
  const reviewsContainer = document.getElementById('reviewsContainer');

  const starDescriptions = {
    1: '1 / 5 Por mejorar',
    2: '2 / 5 Regular',
    3: '3 / 5 Bueno',
    4: '4 / 5 Muy bueno',
    5: '5 / 5 Excelente'
  };

  const updateStarsDisplay = (rating) => {
    starButtons.forEach(btn => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      if (val <= rating) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    if (starRatingLabel && starDescriptions[rating]) {
      starRatingLabel.textContent = starDescriptions[rating];
    }
  };

  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.getAttribute('data-value'), 10);
      if (starValueInput) starValueInput.value = rating;
      updateStarsDisplay(rating);
    });

    btn.addEventListener('mouseenter', () => {
      const hoverVal = parseInt(btn.getAttribute('data-value'), 10);
      starButtons.forEach(b => {
        const val = parseInt(b.getAttribute('data-value'), 10);
        if (val <= hoverVal) {
          b.classList.add('hovered');
        } else {
          b.classList.remove('hovered');
        }
      });
    });

    btn.addEventListener('mouseleave', () => {
      starButtons.forEach(b => b.classList.remove('hovered'));
    });
  });

  // Render a review card into the feed
  const prependReviewCard = (name, stars, comment, dateStr) => {
    if (!reviewsContainer) return;
    const card = document.createElement('div');
    card.className = 'review-item-card';
    card.style.animation = 'fadeIn 0.4s ease';

    const starsHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);

    card.innerHTML = `
      <div class="review-card-top">
        <span class="reviewer-name">${escapeHtml(name)}</span>
        <span class="review-stars-static">${starsHtml}</span>
      </div>
      <p class="review-text-content">${escapeHtml(comment)}</p>
      <div class="review-timestamp">${dateStr}</div>
    `;

    reviewsContainer.prepend(card);
  };

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Load persisted user reviews from localStorage
  const loadStoredReviews = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('aura_community_reviews') || '[]');
      stored.forEach(r => {
        prependReviewCard(r.name, r.stars, r.comment, r.date);
      });
    } catch (e) {
      console.error('Error loading stored reviews:', e);
    }
  };
  loadStoredReviews();

  // Review Form Submit Handler
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('reviewerName');
      const commentInput = document.getElementById('reviewerComment');
      const rating = parseInt(starValueInput?.value || '5', 10);

      const name = nameInput.value.trim() || 'Usuario de Aura';
      const comment = commentInput.value.trim();

      if (!comment) return;

      const dateStr = 'Reciente • Publicado por ti';

      // Prepend to visible feed
      prependReviewCard(name, rating, comment, dateStr);

      // Save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('aura_community_reviews') || '[]');
        stored.push({ name, stars: rating, comment, date: 'Reciente' });
        localStorage.setItem('aura_community_reviews', JSON.stringify(stored));
      } catch (err) {
        console.error('Error saving review:', err);
      }

      // Reset Form & show friendly toast
      commentInput.value = '';
      const submitBtn = reviewForm.querySelector('.btn-submit-review');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ ¡Valoración Publicada!';
        submitBtn.style.background = '#34d399';
        submitBtn.style.color = '#000000';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 2500);
      }
    });
  }

  console.log('🎵 Aura Music Landing Page initialized successfully.');
});
