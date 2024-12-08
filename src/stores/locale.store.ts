import { defineStore } from 'pinia';

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    currentLocale: localStorage.getItem('locale') || 'de-DE',
  }),

  actions: {
    setLocale(newLocale: string) {
      this.currentLocale = newLocale;
      localStorage.setItem('locale', newLocale);
    },
  },
});
