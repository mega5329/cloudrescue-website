// Language Switching Module
const languageSwitcher = {
  currentLang: 'en',
  translations: {},

  init: async function() {
    // Check URL parameter first (highest priority)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    // Normalize language codes (cn -> zh)
    let selectedLang = null;
    if (urlLang) {
      selectedLang = urlLang === 'cn' ? 'zh' : urlLang;
      // Validate that it's a supported language
      if (selectedLang !== 'en' && selectedLang !== 'zh') {
        selectedLang = null;
      }
    }
    
    // Fallback to saved language or browser language
    if (!selectedLang) {
      const savedLang = localStorage.getItem('language');
      const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
      selectedLang = savedLang || browserLang;
    }
    
    this.currentLang = selectedLang;

    // Load translations
    await this.loadTranslations();

    // Set initial language
    this.switchTo(this.currentLang);

    // Add click listeners to language toggle buttons
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const newLang = this.currentLang === 'en' ? 'zh' : 'en';
        this.switchTo(newLang, true);
      });
    });
  },

  loadTranslations: async function() {
    try {
      const enResponse = await fetch('/locales/en.json');
      const zhResponse = await fetch('/locales/zh.json');
      this.translations.en = await enResponse.json();
      this.translations.zh = await zhResponse.json();
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  },

  switchTo: function(lang, updateUrl = false) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);

    // Update document language
    document.documentElement.lang = lang;

    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
      if (element.getAttribute('data-lang') === lang) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });

    // Update language toggle button text and ARIA labels
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.textContent = lang === 'en' ? '中文' : 'EN';
      const label = lang === 'en' ? 'Switch to Chinese' : 'Switch to English';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });

    // Update dynamic content
    this.updateDynamicContent();
    
    // Announce language change to screen readers
    if (window.AccessibilityManager) {
      const announcement = lang === 'en' 
        ? 'Language changed to English' 
        : '语言已切换至中文';
      window.AccessibilityManager.announce(announcement);
    }
    
    // Update URL parameter if requested
    if (updateUrl) {
      const url = new URL(window.location);
      // Use 'cn' for Chinese in URL for simplicity
      const langParam = lang === 'zh' ? 'cn' : lang;
      url.searchParams.set('lang', langParam);
      window.history.pushState({}, '', url);
    }
  },

  updateDynamicContent: function() {
    const t = this.translations[this.currentLang];
    if (!t) return;

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const value = this.getNestedProperty(t, key);
      if (value) {
        element.textContent = value;
      }
    });
    
    // Update SEO meta tags
    this.updateMetaTags(t);
  },
  
  updateMetaTags: function(translations) {
    if (!translations.meta) return;
    
    // Update page title
    if (translations.meta.title) {
      document.title = translations.meta.title;
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && translations.meta.description) {
      metaDescription.setAttribute('content', translations.meta.description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && translations.meta.keywords) {
      metaKeywords.setAttribute('content', translations.meta.keywords);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && translations.meta.ogTitle) {
      ogTitle.setAttribute('content', translations.meta.ogTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && translations.meta.ogDescription) {
      ogDescription.setAttribute('content', translations.meta.ogDescription);
    }
    
    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && translations.meta.ogTitle) {
      twitterTitle.setAttribute('content', translations.meta.ogTitle);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && translations.meta.ogDescription) {
      twitterDescription.setAttribute('content', translations.meta.ogDescription);
    }
    
    // Update og:locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute('content', this.currentLang === 'zh' ? 'zh_CN' : 'en_US');
    }
  },

  getNestedProperty: function(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
};

