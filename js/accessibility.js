// ===================================
// WCAG 2.1 AA Accessibility JavaScript
// Cloud Rescue Foundation
// ===================================

const AccessibilityManager = {
  focusableElements: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  lastFocusedElement: null,

  init: function() {
    this.setupSkipLink();
    this.setupFocusTrap();
    this.setupKeyboardNavigation();
    this.announcePageChanges();
    this.setupReducedMotion();
  },

  // Skip to main content functionality
  setupSkipLink: function() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
          // Remove tabindex after focus to restore normal tab flow
          mainContent.addEventListener('blur', () => {
            mainContent.removeAttribute('tabindex');
          }, { once: true });
        }
      });
    }
  },

  // Focus trap for mobile menu
  setupFocusTrap: function() {
    const drawer = document.getElementById('mobile-nav-drawer');
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-nav-close');

    if (!drawer || !openBtn || !closeBtn) return;

    // Store all focusable elements in drawer
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;

    const updateFocusableElements = () => {
      focusableElements = Array.from(drawer.querySelectorAll(this.focusableElements));
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];
    };

    // Handle Tab key to trap focus
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    // Open menu
    openBtn.addEventListener('click', () => {
      this.lastFocusedElement = document.activeElement;
      updateFocusableElements();
      
      // Update ARIA attributes
      openBtn.setAttribute('aria-expanded', 'true');
      drawer.removeAttribute('aria-hidden');
      document.getElementById('mobile-nav-overlay').removeAttribute('aria-hidden');
      
      // Trap focus
      drawer.addEventListener('keydown', handleTabKey);
      
      // Focus first element
      setTimeout(() => {
        if (closeBtn) closeBtn.focus();
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    });

    // Close menu
    const closeMenu = () => {
      // Update ARIA attributes
      openBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.getElementById('mobile-nav-overlay').setAttribute('aria-hidden', 'true');
      
      // Remove focus trap
      drawer.removeEventListener('keydown', handleTabKey);
      
      // Restore focus
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeMenu);
    document.getElementById('mobile-nav-overlay').addEventListener('click', closeMenu);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  },

  // Enhanced keyboard navigation
  setupKeyboardNavigation: function() {
    // Ensure all interactive elements are keyboard accessible
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.setAttribute('role', 'button');
      if (!btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
      }
    });

    // Enter key for buttons that might be <div> or <span>
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.hasAttribute('role') && e.target.getAttribute('role') === 'button') {
        e.target.click();
      }
    });
  },

  // Announce dynamic content changes to screen readers
  announcePageChanges: function() {
    // Create live region for announcements
    if (!document.getElementById('a11y-announcer')) {
      const announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
  },

  // Announce message to screen readers
  announce: function(message, priority = 'polite') {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  },

  // Respect prefers-reduced-motion
  setupReducedMotion: function() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e) => {
      if (e.matches) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    };

    handleReducedMotion(mediaQuery);
    mediaQuery.addEventListener('change', handleReducedMotion);
  },

  // Form validation accessibility
  setFieldError: function(field, message) {
    field.setAttribute('aria-invalid', 'true');
    
    // Create or update error message
    let errorId = field.getAttribute('aria-describedby');
    let errorEl = errorId ? document.getElementById(errorId) : null;
    
    if (!errorEl) {
      errorId = `error-${field.id || Math.random().toString(36).substr(2, 9)}`;
      errorEl = document.createElement('div');
      errorEl.id = errorId;
      errorEl.className = 'error-message';
      errorEl.setAttribute('role', 'alert');
      field.parentNode.insertBefore(errorEl, field.nextSibling);
      field.setAttribute('aria-describedby', errorId);
    }
    
    errorEl.textContent = message;
  },

  clearFieldError: function(field) {
    field.setAttribute('aria-invalid', 'false');
    const errorId = field.getAttribute('aria-describedby');
    if (errorId) {
      const errorEl = document.getElementById(errorId);
      if (errorEl) {
        errorEl.remove();
      }
      field.removeAttribute('aria-describedby');
    }
  },

  // Add loading state
  setLoading: function(element, isLoading = true) {
    if (isLoading) {
      element.setAttribute('aria-busy', 'true');
      element.setAttribute('aria-live', 'polite');
      const originalText = element.textContent;
      element.dataset.originalText = originalText;
      this.announce('Loading...');
    } else {
      element.removeAttribute('aria-busy');
      element.removeAttribute('aria-live');
      if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
        delete element.dataset.originalText;
      }
      this.announce('Loading complete');
    }
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AccessibilityManager.init();
  });
} else {
  AccessibilityManager.init();
}

// Export for use in other scripts
window.AccessibilityManager = AccessibilityManager;

