// Mobile Navigation Module
const mobileNav = {
  isOpen: false,
  drawer: null,
  overlay: null,
  openBtn: null,
  closeBtn: null,

  init: function() {
    this.drawer = document.getElementById('mobile-nav-drawer');
    this.overlay = document.getElementById('mobile-nav-overlay');
    this.openBtn = document.getElementById('mobile-menu-btn');
    this.closeBtn = document.getElementById('mobile-nav-close');

    if (!this.drawer || !this.overlay || !this.openBtn) return;

    // Add event listeners
    this.openBtn.addEventListener('click', () => this.open());
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    this.overlay.addEventListener('click', () => this.close());

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on link click
    this.drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.close());
    });
  },

  open: function() {
    this.isOpen = true;
    this.drawer.style.display = 'block';
    this.overlay.style.display = 'block';
    
    // Force reflow
    void this.drawer.offsetWidth;
    
    this.drawer.classList.add('open');
    this.overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  close: function() {
    this.isOpen = false;
    this.drawer.classList.remove('open');
    this.overlay.classList.remove('show');
    document.body.style.overflow = '';
    
    // Wait for transition to complete
    setTimeout(() => {
      if (!this.isOpen) {
        this.drawer.style.display = 'none';
        this.overlay.style.display = 'none';
      }
    }, 300);
  }
};

