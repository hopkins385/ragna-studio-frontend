<script setup lang="ts">
import { useProviderIcons } from '@/composables/useProviderIcons';
import { useRagnaClient } from '@/composables/useRagnaClient';
import type { LargeLangModel, LargeLangModelProvider } from '@hopkins385/ragna-sdk';
import LlmInfoBox from './LlmInfoBox.vue';

const props = defineProps<{
  currentLlmId: string;
}>();

const emits = defineEmits<{
  'update:id': [string];
}>();

const open = ref(false);
const providers = ref<LargeLangModelProvider[]>([]);
const models = ref<LargeLangModel[] | null>(null);
const selectedProvider = ref<string>('Anthropic');
const activeModelId = ref(props.currentLlmId);
const isLoading = ref(false);
const error = ref<string | null>(null);

const filteredModels = computed(() => {
  if (!selectedProvider.value || !models.value) return [];
  return models.value.filter(model => model.provider.name === selectedProvider.value);
});

const client = useRagnaClient();
const { getProviderIcon } = useProviderIcons();

const initModels = async () => {
  if (models.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const { llms } = await client.llm.getAllModels();

    // Process models by provider
    const providerModelMap = llms.reduce((acc, model) => {
      const providerName = model.provider.name;
      if (!acc.has(providerName)) {
        acc.set(providerName, []);
      }
      acc.get(providerName)!.push(model);
      return acc;
    }, new Map<string, LargeLangModel[]>());

    // Sort providers alphabetically
    const sortedProviders = [...providerModelMap.keys()].sort();

    // Create providers list
    providers.value = sortedProviders.map(providerName => {
      const providerModels = providerModelMap.get(providerName) || [];
      return {
        name: providerName,
        region: providerModels[0]?.host.region || '',
      };
    });

    // Flatten sorted models
    models.value = sortedProviders.flatMap(provider => providerModelMap.get(provider) || []);

    // Set initial selected provider
    updateSelectedProviderFromActiveModel();
  } catch (err) {
    console.error('Failed to load LLM models:', err);
    error.value = 'Failed to load models. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const updateSelectedProviderFromActiveModel = () => {
  if (!models.value?.length) return;

  const activeModel = models.value.find(model => model.id === activeModelId.value);
  if (activeModel) {
    selectedProvider.value = activeModel.provider.name;
  } else if (providers.value.length) {
    selectedProvider.value = providers.value[0].name;
  }
};

const onModelClick = (id: string) => {
  emits('update:id', id);
  activeModelId.value = id;
  open.value = false;
};

const onProviderClick = (provider: string) => {
  selectedProvider.value = provider;
};

// Update activeModelId when props change
watch(
  () => props.currentLlmId,
  newId => {
    activeModelId.value = newId;
    updateSelectedProviderFromActiveModel();
  },
);

onMounted(() => {
  initModels();
});
</script>

<template>
  <div class="flex space-x-10">
    <div v-if="isLoading" class="w-full text-center py-8">Loading models...</div>

    <div v-else-if="error" class="w-full text-center py-8 text-red-500">
      {{ error }}
    </div>

    <template v-else>
      <div class="space-y-3">
        <div
          v-for="provider in providers"
          :key="provider.name"
          @click="onProviderClick(provider.name)"
          class="cursor-pointer rounded-lg border px-5 py-2.5 text-sm w-52"
          :class="{
            'bg-stone-100': selectedProvider === provider.name,
            ' hover:bg-gray-100': selectedProvider !== provider.name,
          }"
        >
          <div class="flex items-center space-x-2">
            <!-- provider icon -->
            <span>
              <component :is="getProviderIcon(provider.name)" class="stroke-1.5 size-4 mr-2" />
            </span>
            <!-- provider name -->
            <span> {{ provider.name }}</span>
          </div>
        </div>
      </div>
      <!-- LLM selection -->
      <div class="flex items-center flex-wrap gap-4">
        <LlmInfoBox
          v-for="model in filteredModels"
          :key="model.id"
          :display-name="model.displayName"
          :provider-name="model.provider.name"
          :host-region="model.host.region"
          :infos="model.infos"
          :capability="model.capability"
          :selected="model.id === activeModelId"
          @click="() => onModelClick(model.id)"
        />

        <div v-if="filteredModels.length === 0" class="p-4 text-gray-500">
          No models available for this provider.
        </div>
      </div>
    </template>
  </div>
</template>
