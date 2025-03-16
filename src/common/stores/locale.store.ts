import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const SUPPORTED_LOCALES = ['de', 'en'];

export const useLocaleStore = defineStore('locale', () => {
  const _currentLocale = ref('de');

  const currentLocale = computed(() => {
    const locale = localStorage.getItem('locale');
    if (locale && SUPPORTED_LOCALES.includes(locale)) {
      _currentLocale.value = locale;
      return locale;
    }
    return _currentLocale.value;
  });

  function setLocale(newLocale: string) {
    if (!SUPPORTED_LOCALES.includes(newLocale)) {
      throw new Error('Unsupported locale');
    }
    _currentLocale.value = newLocale;
    localStorage.setItem('locale', newLocale);
  }

  return {
    currentLocale,
    setLocale,
  };
});
