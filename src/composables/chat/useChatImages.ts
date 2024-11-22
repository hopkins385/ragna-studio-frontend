import { useChatStore } from '@/stores/chat.store';
import { useMediaService } from '../services/useMediaService';

export interface ChatImage {
  src: string;
  status: 'loading' | 'loaded' | 'error';
}

export function useChatImages() {
  const allowedFileMimeTypes = [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
  ];

  const chatStore = useChatStore();
  const inputImages = ref<ChatImage[]>([]);

  const { uploadFiles } = useMediaService();

  // Vision
  function addInputImage(image: ChatImage): number | null {
    const count = inputImages.value.length;
    if (count >= 5) {
      return null;
    }
    inputImages.value = [...inputImages.value, image];
    const index = inputImages.value.length - 1;
    return index;
  }

  function updateInputImage(index: number, image: ChatImage) {
    inputImages.value = inputImages.value.map((img, i) =>
      i === index ? image : img,
    );
  }

  async function onFileReaderLoad(imageSrc: string, file: File) {
    const index = addInputImage({ src: imageSrc, status: 'loading' });
    if (index === null) {
      return;
    }
    const isVisonEnabled = chatStore.modelWithVision;

    const uploadedImages = await uploadFiles([file], isVisonEnabled);
    if (!uploadedImages || uploadedImages.length === 0) {
      updateInputImage(index, { src: imageSrc, status: 'error' });
      return;
    }
    const uploadedImage = uploadedImages[0];
    updateInputImage(index, { src: uploadedImage.path, status: 'loaded' });
  }

  function readFile(file: File | null | undefined) {
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type', file.type);
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const imageSrc = reader.result as string;
      await onFileReaderLoad(imageSrc, file);
    };
    reader.readAsDataURL(file);
  }

  function openFileDialog() {
    if (!chatStore.modelWithVision) return;
    const accept = Array.isArray(allowedFileMimeTypes)
      ? allowedFileMimeTypes.join(',')
      : allowedFileMimeTypes;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = false;
    input.onchange = () => {
      const file = input.files?.[0];
      readFile(file);
    };
    input.click();
  }

  return {
    allowedFileMimeTypes,
    inputImages,
    readFile,
    openFileDialog,
  };
}
