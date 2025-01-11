import { defineStore } from 'pinia';

const SUPPORTED_LOCALES = ['de', 'en'];

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    _currentLocale: 'de',
  }),

  getters: {
    currentLocale(state) {
      const locale = localStorage.getItem('locale');
      if (locale && SUPPORTED_LOCALES.includes(locale)) {
        state._currentLocale = locale;
        return locale;
      } else {
        return state._currentLocale;
      }
    },
  },

  actions: {
    setLocale(newLocale: string) {
      if (!SUPPORTED_LOCALES.includes(newLocale)) {
        throw new Error('Unsupported locale');
      }
      this._currentLocale = newLocale;
      localStorage.setItem('locale', newLocale);
    },
  },
});
