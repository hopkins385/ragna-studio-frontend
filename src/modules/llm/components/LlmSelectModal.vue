<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import type { LargeLangModel } from '@hopkins385/ragna-sdk';
import LlmInfoBox from './LlmInfoBox.vue';

const props = defineProps<{
  currentLlmId: string;
}>();

const emits = defineEmits<{
  'update:id': [string];
}>();

const open = ref(false);
const models = ref<LargeLangModel[] | null>(null);
const activeModelId = ref(props.currentLlmId);

const client = useRagnaClient();

const initModels = async () => {
  if (models.value) return;
  const { llms } = await client.llm.getAllModels();
  models.value = llms;
};

const onModelClick = (id: string) => {
  emits('update:id', id);
  activeModelId.value = id;
  open.value = false;
};

/*watch(open, () => {
  if (open.value === true && !models.value) {
    initModels();
  }
});*/

onMounted(() => {
  initModels();
});
</script>

<template>
  <div class="flex items-center space-x-3">
    <div class="grid grid-cols-3 gap-4 mb-4">
      <LlmInfoBox
        v-for="model in models"
        :key="model.id"
        :display-name="model.displayName"
        :provider-name="model.provider.name"
        :host-region="model.host.region"
        :infos="model.infos"
        :capability="model.capability"
        :selected="model.id === activeModelId"
        @click="() => onModelClick(model.id)"
      />
    </div>
    <!--
    <div
      class="cursor-pointer rounded-lg border px-5 py-2.5 text-sm"
      @click="() => (open = true)"
    >
      {{ selectedModel.displayName }}
    </div>
    -->
    <!--
    <Dialog v-model:open="open">

      <DialogTrigger as-child>
        <Button variant="outline" size="icon">
          <SettingsIcon class="size-4 stroke-1.5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        class="min-w-[1000px] max-h-[calc(100vh-12rem)] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Ai Model</DialogTitle>
          <DialogDescription>
            This is a list of all available Large Language Models.
          </DialogDescription>
        </DialogHeader>
        <Suspense>
          <div class="grid grid-cols-3 gap-4">
            <LlmInfoBox
              v-for="model in models"
              :key="model.id"
              :display-name="model.displayName"
              :provider-name="model.provider.name"
              :host-region="model.host.region"
              :infos="model.infos"
              :capability="model.capability"
              @click="() => onModelClick(model.id)"
            />
          </div>
        </Suspense>
        <DialogFooter>
          <Button variant="outline" @click="open = false">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    -->
  </div>
</template>
