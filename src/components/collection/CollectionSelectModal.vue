<script setup lang="ts">
import useCollectionService from '@/composables/services/useCollectionService';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { SettingsIcon } from 'lucide-vue-next';

const props = defineProps<{
  initialDisplayName: string;
  id: string | undefined;
}>();

const emits = defineEmits<{
  'update:id': [string];
  reset: [void];
}>();

const open = ref(false);

const collections = ref<any[]>([]);

const { fetchAll } = useCollectionService();

const initCollections = async () => {
  const response = await fetchAll();
  collections.value = response.collections;
};

const selectedCollection = computed(() =>
  collections.value?.find((collection: any) => collection.id === props.id),
);

const sortedCollections = computed(() => {
  if (!collections.value) return [];
  const sorted = [...collections.value];
  const index = sorted.findIndex(c => c.id === props.id);
  if (index !== -1) {
    const [selectedItem] = sorted.splice(index, 1);
    sorted.unshift(selectedItem);
  }
  return sorted;
});

const setOpen = (value: boolean) => {
  open.value = value;
};

const addCollection = async (id: string) => {
  emits('update:id', id);
  open.value = false;
};

const removeAllCollections = () => {
  emits('reset');
  open.value = false;
};

onMounted(() => {
  initCollections();
});
</script>

<template>
  <div class="flex items-center space-x-3">
    <div
      class="cursor-pointer rounded-lg border px-5 py-2.5 text-sm"
      @click="() => setOpen(true)"
    >
      {{ selectedCollection?.name || initialDisplayName }}
    </div>
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button variant="outline" size="icon">
          <SettingsIcon class="size-4 stroke-1.5" />
        </Button>
      </DialogTrigger>
      <DialogContent class="max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Add Knowledge</DialogTitle>
          <DialogDescription>
            This is a list of all available collections.
          </DialogDescription>
        </DialogHeader>
        <div class="h-[60dvh] space-y-8 overflow-y-scroll">
          <div class="space-y-4">
            <h2>Existing Collections</h2>
            <div class="grid grid-cols-4 gap-4 w-fit">
              <button
                type="button"
                class="h-20 w-52 border rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer relative"
                v-for="collection in sortedCollections"
                :key="collection.id"
                :class="{
                  'bg-secondary': collection.id === props.id,
                }"
                @click="() => addCollection(collection.id)"
              >
                <span
                  v-if="collection.id === props.id"
                  class="absolute -top-3 -right-2 border bg-white px-4 py-1 rounded-lg text-xxs"
                >
                  Assigned
                </span>
                <span class="text-sm">
                  {{ collection.name }}
                </span>
              </button>
              <button
                type="button"
                class="h-20 w-52 border border-dashed rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer relative"
                @click="() => $router.push('/collection/create')"
              >
                <span class="text-sm opacity-60"> Create New + </span>
              </button>
            </div>
          </div>
          <div>Upload Files</div>
          <div>Settings</div>
          <Button variant="outline" @click="removeAllCollections">
            Remove Knowledge
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="() => setOpen(false)">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
