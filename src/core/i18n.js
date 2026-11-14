//- No-op in case this is running outside of SillyTavern
const { extension_settings } = typeof self.SillyTavern !== 'undefined' ? self.SillyTavern.getContext() : { extension_settings: {} };
// Derive extension folder path dynamically from current script URL to avoid hardcoding the folder name
const _i18nScriptUrl = import.meta.url;
const _i18nMatch = _i18nScriptUrl.match(/extensions\/(third-party\/[^/]+)\//);
const _i18nExtensionFolderPath = _i18nMatch ? `scripts/extensions/${_i18nMatch[1]}` : 'scripts/extensions/third-party/Dooms-Enhancement-Suite';
// Chinese localization is now the default locale, with graceful fallback to English.
class Internationalization {
    constructor() {
        this.currentLanguage = 'zh-CN';
        this.translations = {};
    }
    async init() {
        await this.loadTranslations(this.currentLanguage);
        this.applyTranslations(document.body);
    }
    async loadTranslations(lang) {
        const fetchUrl = `/${_i18nExtensionFolderPath}/src/i18n/${lang}.json`;
        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                console.warn(`[Dooms-Tracker-i18n] Failed to load ${lang}, falling back to en`);
                if (lang !== 'en') {
                    await this.loadTranslations('en');
                }
                return;
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('[Dooms-Tracker-i18n] CRITICAL error loading translation file:', error);
        }
    }
    applyTranslations(rootElement) {
        if (!rootElement) {
            return;
        }
        // 1. Translate textContent
        const textElements = rootElement.querySelectorAll('[data-i18n-key]');
        textElements.forEach(element => {
            const key = element.dataset.i18nKey;
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        // 2. Translate title attribute
        const titleElements = rootElement.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.dataset.i18nTitle;
            const translation = this.getTranslation(key);
            if (translation) {
                element.setAttribute('title', translation);
            }
        });
        // 3. Translate aria-label attribute
        const ariaLabelElements = rootElement.querySelectorAll('[data-i18n-aria-label]');
        ariaLabelElements.forEach(element => {
            const key = element.dataset.i18nAriaLabel;
            const translation = this.getTranslation(key);
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });
    }
    getTranslation(key) {
        return this.translations[key] || null;
    }
}
export const i18n = new Internationalization();
