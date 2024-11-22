<script setup lang="ts">
import BoxContainer from '@components/box/BoxContainer.vue';
import FileDropzone from '@components/file/FileDropzone.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import Button from '@ui/button/Button.vue';
import { useMediaService } from '@composables/services/useMediaService';
import MediaList from '@/components/media/MediaList.vue';

const emits = defineEmits<{
  refresh: [void];
}>();

const router = useRouter();
const route = useRoute();

const page = ref(1);

const refreshData = ref(false);
const openFileDialog = ref(false);

const { dropzoneFiles, isLoading, uploadFiles } = useMediaService();

function setRoutePage(value: number) {
  page.value = value;
  const query = { ...route.query, page: value.toString() };
  router.push({ query });
}

const onSubmit = async (e: Event) => {
  if (dropzoneFiles.value.length === 0) {
    return;
  }
  await uploadFiles(dropzoneFiles.value);
  onRefreshData();
};

const onRefreshData = () => {
  refreshData.value = true;
  setTimeout(() => {
    refreshData.value = false;
  }, 0);
};

const onOpenFileDialog = () => {
  openFileDialog.value = true;
  setTimeout(() => {
    openFileDialog.value = false;
  }, 0);
};

const onBrowseFiles = () => {
  onOpenFileDialog();
};
</script>

<template>
  <SectionContainer class="space-y-4">
    <SectionHeading
      title="Uploads"
      subtitle="You can view your uploaded files below."
    />
    <BoxContainer>
      <FileDropzone
        v-model="dropzoneFiles"
        :open-file-dialog="openFileDialog"
      />
      <div class="flex justify-end">
        <div class="flex items-center justify-center pt-4">
          <div v-if="isLoading" class="pr-5 text-sm">Uploading...</div>
          <div class="flex justify-center items-center space-x-2">
            <Button
              :disabled="isLoading"
              variant="outline"
              @click.prevent="onBrowseFiles"
            >
              Browse Files
            </Button>
            <Button :disabled="isLoading" @click.prevent="onSubmit">
              Upload Files
            </Button>
          </div>
        </div>
      </div>
    </BoxContainer>
    <BoxContainer>
      <MediaList
        :page="page"
        @update:page="setRoutePage"
        v-model:refresh="refreshData"
      />
    </BoxContainer>
    <div class="h-1"></div>
  </SectionContainer>
</template>
