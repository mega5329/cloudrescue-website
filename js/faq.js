// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', async function() {
  console.log('FAQ script loaded');

  // Initialize language switcher
  if (typeof languageSwitcher !== 'undefined') {
    try {
      await languageSwitcher.init();
      console.log('Language switcher initialized');
    } catch (error) {
      console.error('Error initializing language switcher:', error);
    }
  }

  // Initialize mobile navigation
  if (typeof mobileNav !== 'undefined') {
    try {
      mobileNav.init();
      console.log('Mobile navigation initialized');
    } catch (error) {
      console.error('Error initializing mobile navigation:', error);
    }
  }

  // Initialize animations
  if (typeof animations !== 'undefined') {
    try {
      animations.init();
      console.log('Animations initialized');
    } catch (error) {
      console.error('Error initializing animations:', error);
    }
  }

  // Initialize FAQ accordions
  const faqQuestions = document.querySelectorAll('.faq-question');
  console.log('Found FAQ questions:', faqQuestions.length);

  faqQuestions.forEach((question, index) => {
    console.log(`Setting up FAQ question ${index + 1}`);

    question.addEventListener('click', function() {
      console.log('FAQ question clicked:', this);

      const faqItem = this.closest('.faq-item');
      const answer = faqItem.querySelector('.faq-answer');
      const icon = this.querySelector('.faq-icon');

      if (!answer) {
        console.error('FAQ answer element not found');
        return;
      }

      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      console.log('Is open:', isOpen);

      // Close all other answers first
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== faqItem) {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');

          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0px';
            otherAnswer.classList.remove('open');
          }
          if (otherIcon) {
            otherIcon.textContent = '+';
            otherIcon.style.transform = 'rotate(0deg)';
          }
        }
      });

      // Toggle current answer
      if (isOpen) {
        // Close current answer
        answer.style.maxHeight = '0px';
        answer.classList.remove('open');
        if (icon) {
          icon.textContent = '+';
          icon.style.transform = 'rotate(0deg)';
        }
        console.log('Closed answer');
      } else {
        // Open current answer
        // Use scrollHeight + extra space to ensure full content is visible
        answer.style.maxHeight = (answer.scrollHeight + 10) + 'px';
        answer.classList.add('open');
        if (icon) {
          icon.textContent = '−'; // Use minus sign when open
          icon.style.transform = 'rotate(0deg)';
        }
        console.log('Opened answer, height:', (answer.scrollHeight + 10) + 'px');
      }
    });
  });
});