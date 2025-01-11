<script setup lang="ts">
import { setLocale as setVeeLocale } from '@vee-validate/i18n';
import { RouterView } from 'vue-router';
import { useLocaleStore } from './stores/locale.store';

// Types
type LocaleStatus = 'loading' | 'ready' | 'error';

// Composables
const localeStore = useLocaleStore();
const { locale } = useI18n();
const localeStatus = ref<LocaleStatus>('loading');

const setDocumentLang = (lang: string) => {
  document.documentElement.lang = lang;
  // document.querySelector('html').setAttribute('lang', localeStore.currentLocale)
};

// Initialize locale
const initializeLocale = async () => {
  try {
    localeStatus.value = 'loading';

    if (localeStore.currentLocale) {
      locale.value = localeStore.currentLocale;
      setVeeLocale(localeStore.currentLocale);
      console.log(`Locale set to ${localeStore.currentLocale}`);
    }

    localeStatus.value = 'ready';
  } catch (error) {
    console.error('Failed to initialize locale:', error);
    localeStatus.value = 'error';
  }
};

// Watch for locale changes
watch(locale, async newLocale => {
  try {
    localeStore.setLocale(newLocale);
  } catch (error) {
    console.error(`Failed to set locale to ${newLocale}:`, error);
  }
});

// Initialize on component mount
initializeLocale();

// Layout handling is managed by the layout middleware

// TODO: Proper locale error handling

onMounted(() => {
  // Set the document lang attribute
  setDocumentLang(localeStore.currentLocale);
});
</script>

<template>
  <component :is="$route.meta.layoutComponent">
    <template v-if="localeStatus === 'error'">
      <div role="alert" class="error-message">
        {{ $t('errors.locale_loading_failed') }}
      </div>
    </template>

    <template v-else-if="localeStatus === 'loading'">
      <div role="status" class="loading-indicator">
        {{ $t('common.loading') }}
      </div>
    </template>

    <RouterView v-else />
  </component>
</template>

<style scoped>
.error-message {
  color: var(--error-color);
  padding: 1rem;
  text-align: center;
}

.loading-indicator {
  padding: 1rem;
  text-align: center;
}
</style>
