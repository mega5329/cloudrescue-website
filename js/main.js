// Main Application
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize all modules
  await languageSwitcher.init();
  mobileNav.init();
  animations.init();

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
});

