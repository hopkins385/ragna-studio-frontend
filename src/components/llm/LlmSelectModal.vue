<script setup lang="ts">
import type { LargeLangModel } from '@composables/services/interfaces/large-lang-model.interface';
import { useLlmService } from '@composables/services/useLlmService';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import DialogContent from '@ui/dialog/DialogContent.vue';
import { SettingsIcon } from 'lucide-vue-next';
import LlmInfoBox from './LlmInfoBox.vue';

const props = defineProps<{
  initialDisplayName: string;
  id: string;
}>();

const emits = defineEmits<{
  'update:id': [string];
}>();

const open = ref(false);
const models = ref<LargeLangModel[] | null>(null);

const { getAllModels } = useLlmService();

const selectedModel = computed<LargeLangModel>(
  // TODO: Fix this type error
  //@ts-expect-error
  () => {
    return (
      models.value?.find(model => model.id === props.id) || {
        displayName: props.initialDisplayName,
      }
    );
  },
);

const initModels = async () => {
  const { llms } = await getAllModels();
  models.value = llms;
};

const onModelClick = (id: string) => {
  emits('update:id', id);
  open.value = false;
};

watch(open, () => {
  if (open.value === true && !models.value) {
    initModels();
  }
});
</script>

<template>
  <div class="flex items-center space-x-3">
    <div
      class="cursor-pointer rounded-lg border px-5 py-2.5 text-sm"
      @click="() => (open = true)"
    >
      {{ selectedModel.displayName }}
    </div>
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
  </div>
</template>
