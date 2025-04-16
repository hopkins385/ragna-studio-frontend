<script setup lang="ts">
import TabSidebar from '@/components/tab/TabSidebar.vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlobeIcon } from 'lucide-vue-next';

const langLookup: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
};

// refs
const currentTab = ref('tab2');

// composables
const { availableLocales } = useI18n();

// functions
const getLocale = (lang: string) => {
  return langLookup[lang];
};
</script>

<template>
  <TabSidebar
    v-model="currentTab"
    :tabs="[
      // { id: 'tab1', icon: Settings, label: $t('settings.label.standards') },
      { id: 'tab2', icon: GlobeIcon, label: $t('settings.label.language') },
      // { id: 'tab3', icon: Paintbrush, label: $t('settings.label.theme') },
    ]"
  >
    <template #tab1> </template>
    <template #tab2>
      <div class="locale-changer max-w-xs">
        <div class="text-sm font-semibold mb-2">
          {{ $t('settings.label.language') }}
        </div>
        <Select v-model="$i18n.locale">
          <SelectTrigger>
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem :value="lang" v-for="(lang, i) in availableLocales" :key="`Lang${i}`">
                {{ getLocale(lang) }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </template>
    <!--
    <template #tab3>
      <div>Colors</div>
    </template>
    -->
  </TabSidebar>
</template>
