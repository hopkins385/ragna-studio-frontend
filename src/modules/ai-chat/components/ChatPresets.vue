<script setup lang="ts">
import ChatPresetBox from './ChatPresetBox.vue';

defineEmits<{
  clicked: [string];
}>();

const presets = [
  {
    id: 1,
    title: 'Freizeitideen',
    description:
      'Erstelle mir eine Liste mit Hobbys, denen ich in meiner knappen Freizeit nachgehen kann',
    prompt:
      'Erstelle mir eine Liste mit Hobbys, denen ich in meiner knappen Freizeit nachgehen kann.',
    icon: 'clipboard',
    color: 'blue',
  },
  {
    id: 1,
    title: 'Packliste für Reise',
    description:
      'Was sollte ich für eine zehntägige Reise in eine Bergregion einpacken?',
    prompt:
      'Was sollte ich für eine zehntägige Reise in eine Bergregion einpacken?',
    icon: 'map',
    color: 'green',
  },
  {
    id: 1,
    title: 'Geschenk für Freund',
    description:
      'Ich brauche ein Geschenk für meinen Freund, der gerne bei kaltem Wetter wandert',
    prompt:
      'Ich brauche ein Geschenk für meinen Freund, der gerne bei kaltem Wetter wandert.',
    icon: 'gift',
    color: 'red',
  },
  {
    id: 1,
    title: 'Schreiben',
    description:
      'Schreibe eine schöne Fabel über einen Fisch und einen Frosch, die sich lieben',
    prompt:
      'Schreibe eine schöne Fabel über einen Fisch und einen Frosch, die sich lieben.',
    icon: 'text',
    color: 'yellow',
  },
  {
    id: 1,
    title: 'Programmieren',
    description:
      'Erstelle ein Python Programm, das die ersten 100 Primzahlen ausgibt',
    prompt:
      'Erstelle ein Python Programm, das die ersten 100 Primzahlen ausgibt.',
    icon: 'code',
    color: 'purple',
  },
  {
    id: 1,
    title: 'Kochen',
    description:
      'Erstell mir ein Rezept für ein leckeres Gericht mit Kartoffeln inklusive Einkaufsliste',
    prompt:
      'Erstell mir ein Rezept für ein leckeres Gericht mit Kartoffeln inklusive Einkaufsliste.',
    icon: 'cook',
    color: 'orange',
  },
];

const MAX_PREVIEW_PRESETS = 3;

const showAllPresets = ref(false);
const visiblePresets = computed(() =>
  showAllPresets.value ? presets : presets.slice(0, MAX_PREVIEW_PRESETS),
);
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-wrap gap-4 max-w-4xl items-center justify-center">
      <ChatPresetBox
        v-for="(preset, index) in visiblePresets"
        :key="index"
        :title="preset.title"
        :icon-name="preset.icon"
        :icon-color="preset.color"
        @click="() => $emit('clicked', preset.prompt)"
      />
      <ChatPresetBox
        v-if="!showAllPresets"
        title="Mehr"
        iconName="help"
        iconColor="blue"
        @click="() => (showAllPresets = true)"
      />
    </div>
  </div>
</template>
