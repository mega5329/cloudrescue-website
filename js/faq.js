// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('FAQ script loaded');

  // Initialize FAQ accordions
  const faqQuestions = document.querySelectorAll('.faq-question');
  console.log('Found FAQ questions:', faqQuestions.length);

  faqQuestions.forEach((question, index) => {
    console.log(`Setting up FAQ question ${index + 1}`);

    question.addEventListener('click', function() {
      console.log('FAQ question clicked:', this);

      const answer = this.nextElementSibling;
      const icon = this.querySelector('.faq-icon');

      if (!answer || !answer.classList.contains('faq-answer')) {
        console.error('FAQ answer element not found');
        return;
      }

      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
      console.log('Is open:', isOpen);

      // Close all other answers first
      document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
        if (otherAnswer !== answer) {
          otherAnswer.style.maxHeight = '0px';
          otherAnswer.classList.remove('open');
          const otherQuestion = otherAnswer.previousElementSibling;
          const otherIcon = otherQuestion.querySelector('.faq-icon');
          if (otherIcon) {
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
          icon.style.transform = 'rotate(0deg)';
        }
        console.log('Closed answer');
      } else {
        // Open current answer
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.classList.add('open');
        if (icon) {
          icon.style.transform = 'rotate(180deg)';
        }
        console.log('Opened answer, height:', answer.scrollHeight + 'px');
      }
    });
  });
});