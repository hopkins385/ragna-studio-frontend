<script setup lang="ts">
import { useLlmService } from '@composables/services/useLlmService';
import { SettingsIcon } from 'lucide-vue-next';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { Button } from '@ui/button';
import DialogContent from '@ui/dialog/DialogContent.vue';

const props = defineProps<{
  initialDisplayName: string;
  id: string;
}>();

const emits = defineEmits<{
  'update:id': [string];
}>();

const open = ref(false);
const models = ref<any[] | null>(null);

const { getAllModels } = useLlmService();
const initModels = async () => {
  const { models: allModels } = await getAllModels();
  models.value = allModels;
};

const selectedModel = computed(() => {
  return (
    models.value?.find((model: any) => model.id === props.id) || {
      displayName: props.initialDisplayName,
    }
  );
});

function onModelClick(id: string) {
  emits('update:id', id);
  open.value = false;
}

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Model</DialogTitle>
          <DialogDescription>
            This is a list of all available Large Language Models.
          </DialogDescription>
        </DialogHeader>
        <Suspense>
          <div class="space-y-2">
            <div
              v-for="model in models"
              :key="model.id"
              @click="() => onModelClick(model.id)"
            >
              <Button
                :variant="model.id !== props.id ? 'outline' : 'default'"
                size="sm"
              >
                {{ model.displayName }}
              </Button>
            </div>
          </div>
        </Suspense>
        <DialogFooter>
          <Button variant="outline" @click="open = false">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
