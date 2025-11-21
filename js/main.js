// Main Application
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize all modules safely
  try {
    if (typeof languageSwitcher !== 'undefined' && languageSwitcher.init) {
      await languageSwitcher.init();
    }
  } catch (error) {
    console.warn('Language switcher initialization failed:', error);
  }

  try {
    if (typeof mobileNav !== 'undefined' && mobileNav.init) {
      mobileNav.init();
    }
  } catch (error) {
    console.warn('Mobile nav initialization failed:', error);
  }

  try {
    if (typeof animations !== 'undefined' && animations.init) {
      animations.init();
    }
  } catch (error) {
    console.warn('Animations initialization failed:', error);
  }

  // Sticky header on scroll
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.style.display = 'block';
      } else {
        backToTop.style.display = 'none';
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function(e) {
      e.preventDefault();
      const item = this.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      
      // Close all other answers in same section
      const section = item.closest('.space-y-4');
      if (section) {
        section.querySelectorAll('.faq-answer').forEach(otherAnswer => {
          if (otherAnswer !== answer) {
            otherAnswer.style.maxHeight = '0px';
          }
        });
        section.querySelectorAll('.faq-icon').forEach(otherIcon => {
          if (otherIcon !== icon) {
            otherIcon.textContent = '+';
          }
        });
      }
      
      // Toggle current answer
      if (isOpen) {
        answer.style.maxHeight = '0px';
        icon.textContent = '+';
      } else {
        // Add extra height to ensure full content is visible
        answer.style.maxHeight = (answer.scrollHeight + 50) + 'px';
        icon.textContent = '−';
      }
    });
  });

  // Success carousel (stories)
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const slides = carousel.querySelectorAll('.success-slide');
    const wrapper = carousel.closest('.success-carousel-wrapper');
    const prevBtn = wrapper ? wrapper.querySelector('.carousel-prev') : null;
    const nextBtn = wrapper ? wrapper.querySelector('.carousel-next') : null;
    let current = 0;
    let interval;

    if (slides.length === 0 || !wrapper) return;

    // Find currently active slide
    slides.forEach((slide, idx) => {
      if (slide.classList.contains('active')) {
        current = idx;
      }
    });

    const showSlide = (index) => {
      slides.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    };

    const prevSlide = () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    };

    // Start auto-cycling if more than one slide
    if (slides.length > 1) {
      interval = setInterval(nextSlide, 4500);
    }

    // Previous button click handler
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (interval) clearInterval(interval);
        prevSlide();
        if (slides.length > 1) {
          interval = setInterval(nextSlide, 4500);
        }
      }, true);
    }

    // Next button click handler
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (interval) clearInterval(interval);
        nextSlide();
        if (slides.length > 1) {
          interval = setInterval(nextSlide, 4500);
        }
      }, true);
    }

    // Pause on hover
    if (wrapper && slides.length > 1) {
      wrapper.addEventListener('mouseenter', () => {
        if (interval) clearInterval(interval);
      });

      wrapper.addEventListener('mouseleave', () => {
        interval = setInterval(nextSlide, 4500);
      });
    }
  });
});

