// Scroll Animations Module
const animations = {
  observer: null,

  init: function() {
    // Set up Intersection Observer for fade-in animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
      this.observer.observe(el);
    });

    // Initialize count-up animations for statistics
    this.initCountUp();
  },

  initCountUp: function() {
    const stats = document.querySelectorAll('[data-count]');
    
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          this.countUp(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    stats.forEach(stat => countObserver.observe(stat));
  },

  countUp: function(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }
};

