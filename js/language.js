// Language Switching Module
const languageSwitcher = {
  currentLang: 'en',
  translations: {},

  init: async function() {
    // Load saved language or detect browser language
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    this.currentLang = savedLang || browserLang;

    // Load translations
    await this.loadTranslations();

    // Set initial language
    this.switchTo(this.currentLang);

    // Add click listeners to language toggle buttons
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const newLang = this.currentLang === 'en' ? 'zh' : 'en';
        this.switchTo(newLang);
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

  switchTo: function(lang) {
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

    // Update language toggle button text
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.textContent = lang === 'en' ? '中文' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : 'Switch to English');
    });

    // Update dynamic content
    this.updateDynamicContent();
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
  },

  getNestedProperty: function(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
};

