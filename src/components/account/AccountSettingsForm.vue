<script setup lang="ts">
import { Settings } from 'lucide-vue-next';
import TabSidebar from '../tab/TabSidebar.vue';

const { availableLocales } = useI18n();

const currentTab = ref('tab2');
</script>

<template>
  <TabSidebar
    v-model="currentTab"
    :tabs="[
      // { id: 'tab1', icon: Settings, label: $t('settings.label.default') },
      { id: 'tab2', icon: Settings, label: $t('settings.label.language') },
      // { id: 'tab3', icon: Settings, label: $t('settings.label.theme') },
    ]"
  >
    <template #tab1> </template>
    <template #tab2>
      <div class="locale-changer">
        <select v-model="$i18n.locale">
          <option
            v-for="(lang, i) in availableLocales"
            :key="`Lang${i}`"
            :value="lang"
          >
            {{ lang }}
          </option>
        </select>
      </div>
    </template>
  </TabSidebar>
</template>
