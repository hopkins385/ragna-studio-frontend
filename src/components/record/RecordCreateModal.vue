<script setup lang="ts">
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
import { PlusIcon, UploadCloudIcon } from 'lucide-vue-next';
import RecordAddMediaTable from './RecordAddMediaTable.vue';

defineProps<{
  collectionId: string | undefined;
}>();

const emits = defineEmits<{
  refresh: [void];
}>();

const router = useRouter();

const open = ref(false);

function onSuccess() {
  emits('refresh');
}

const onUploadFileClick = () => {
  open.value = false;
  router.push({
    name: 'media.upload',
  });
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">
        {{ $t('record.button.add_file') }}
        <PlusIcon class="ml-2 size-4 stroke-2" />
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-4xl overflow-y-scroll max-h-[calc(100vh-4rem)]">
      <DialogHeader>
        <DialogTitle>
          {{ $t('record.add_file_dialog.title') }}
        </DialogTitle>
        <DialogDescription>
          {{ $t('record.add_file_dialog.subtitle') }}
        </DialogDescription>
        <div class="flex justify-end">
          <Button variant="outline" @click="onUploadFileClick" class="">
            Datei hochladen
            <UploadCloudIcon class="mr-2 size-4 stroke-2" />
          </Button>
        </div>
      </DialogHeader>
      <Suspense>
        <RecordAddMediaTable
          :collection-id="collectionId"
          @success="onSuccess"
        />
      </Suspense>
      <DialogFooter>
        <Button variant="outline" @click="open = false">
          {{ $t('form.button.cancel') }}
        </Button>
        <Button @click="open = false">
          {{ $t('form.button.done') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
