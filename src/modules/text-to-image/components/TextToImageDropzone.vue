<script setup lang="ts">
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { ImageIcon } from 'lucide-vue-next';

// Props
const props = defineProps<{
  allowedFileTypes?: string[];
}>();
// Emits

// Refs
const modelValue = defineModel<File | null>();
const imageDropZoneRef = useTemplateRef('image-drop-zone');

// Composables
const { setErrorAlert, unsetErrorAlert, errorAlert } = useErrorAlert();

// Computed

// Functions
const validateImage = (file: File | null): string | null => {
  if (!file) {
    return 'No file selected';
  }
  if (!file.type.startsWith('image/')) {
    return 'File is not an image';
  }
  if (props.allowedFileTypes && !props.allowedFileTypes.includes(file.type)) {
    return `Unsupported file type: ${file.type}`;
  }
  if (file.size === 0) {
    return 'File is empty';
  }
  if (file.size > 15000000) {
    // 15 MB
    return 'File size exceeds the limit of 15 MB';
  }
  return null;
};

const updateImage = (file: File | null) => {
  modelValue.value = file;
};

const handleDropzoneDrop = (files: File[] | FileList | null, event?: DragEvent) => {
  unsetErrorAlert();
  const image = files?.[0] ?? null;
  const error = validateImage(image);
  if (error) {
    console.error(error);
    setErrorAlert({
      title: 'Unsupported Image',
      description: error,
    });
    return;
  }
  updateImage(image);
};

const handleFileInputChange = (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files;
  handleDropzoneDrop(files);
};

const handleDropzoneClick = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', handleFileInputChange);
  fileInput.click();
};

const onClickDropzone = (e: MouseEvent) => {
  e.stopPropagation();
  handleDropzoneClick();
};

// Hooks
const { isOverDropZone } = useDropZone(imageDropZoneRef, { onDrop: handleDropzoneDrop });
</script>

<template>
  <div
    id="image-drop-zone"
    ref="image-drop-zone"
    class="group relative flex size-full cursor-pointer flex-col items-center justify-center"
    @click.prevent="onClickDropzone"
  >
    <!-- Error -->
    <ErrorAlert
      v-model="errorAlert.open"
      :title="errorAlert.title"
      :description="errorAlert.description"
      class="absolute top-0 left-0 z-10 w-full"
    />
    <!-- Dropzone -->
    <div class="flex size-full items-center justify-center text-center p-5">
      <div
        class="flex shrink-0 flex-col size-full items-center justify-center space-y-2 rounded-lg border border-dashed border-slate-300 p-10 opacity-75"
        :class="{ 'opacity-100 shadow-xl': isOverDropZone }"
      >
        <ImageIcon
          class="size-6 stroke-1.5 shrink-0"
          :class="{ 'text-green-700': isOverDropZone }"
        />
        <span class="text-xs whitespace-pre-line">
          {{ $t('textToImage.dropzone.drag_and_drop') }}
        </span>
      </div>
    </div>
  </div>
</template>
