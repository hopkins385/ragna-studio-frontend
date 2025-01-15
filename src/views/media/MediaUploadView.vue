<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import MediaList from '@/components/media/MediaList.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import FileDropzone from '@components/file/FileDropzone.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import { useMediaService } from '@composables/services/useMediaService';
import bgImgUrl from '@images/bg_upload.png?q=100&format=webp&imagetools';
import Button from '@ui/button/Button.vue';

interface MediaUploadViewEmits {
  refresh: [void];
}

defineEmits<MediaUploadViewEmits>();

const router = useRouter();
const route = useRoute();

const page = ref(1);

const refreshData = ref(false);
const openFileDialog = ref(false);

const { t } = useI18n();
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
  nextTick(() => {
    refreshData.value = false;
  });
};

const onOpenFileDialog = () => {
  openFileDialog.value = true;
  nextTick(() => {
    openFileDialog.value = false;
  });
};

const onBrowseFiles = () => {
  onOpenFileDialog();
};

useHead({
  title: t('media.uploads.title'),
  meta: [
    {
      name: 'description',
      content: t('media.uploads.description'),
    },
  ],
});
</script>

<template>
  <SectionContainer class="space-y-4">
    <Heading :img-url="bgImgUrl" bg-position="center">
      <template #top>
        <HeadingTitle
          :title="t('media.uploads.title')"
          :subtitle="t('media.uploads.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <BoxContainer>
      <FileDropzone
        v-model="dropzoneFiles"
        :max-files="10"
        :open-file-dialog="openFileDialog"
      />
      <div class="flex justify-end">
        <div class="flex items-center justify-center pt-4">
          <div v-if="isLoading" class="pr-5 text-sm">
            {{ t('media.uploads.status.processing') }}
          </div>
          <div class="flex justify-center items-center space-x-2">
            <Button
              :disabled="isLoading"
              variant="outline"
              @click.prevent="onBrowseFiles"
            >
              {{ t('media.uploads.button.browse') }}
            </Button>
            <Button
              :disabled="isLoading || !dropzoneFiles.length"
              @click.prevent="onSubmit"
            >
              {{ t('media.uploads.button.upload') }}
            </Button>
          </div>
        </div>
      </div>
    </BoxContainer>
    <BoxContainer class="!p-0">
      <MediaList
        :page="page"
        @update:page="setRoutePage"
        v-model:refresh="refreshData"
      />
    </BoxContainer>
    <div class="h-1"></div>
  </SectionContainer>
</template>
