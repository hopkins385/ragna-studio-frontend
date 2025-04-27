<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useAudioRecorder } from '@/modules/speech-to-text/composables/useAudioRecoder';
import { Loader2Icon, MicIcon } from 'lucide-vue-next';

// Imports

// Props
// Emits
const emit = defineEmits<{
  transcription: [string];
  abort: [void];
}>();

// Refs
const isLoading = ref(false);

// Composables
const client = useRagnaClient();
const { isRecording, audioChunks, outputFormat, startRecording, stopRecording } =
  useAudioRecorder();

// Computed
// Functions
const onStartRecording = async () => {
  return startRecording();
};

const onStopRecording = async () => {
  isLoading.value = true;

  // Stop recording
  await stopRecording();

  // Delay to ensure all audio is processed
  await new Promise(resolve => setTimeout(resolve, 500));

  const audioBlob = new Blob(audioChunks.value, { type: outputFormat.value });
  if (!audioBlob || audioBlob.size === 0) {
    console.log('No audio recorded');
    emit('abort');
    return;
  }
  // await playAudio(audioBlob);
  const text = await transcribeAudio(audioBlob);
  emit('transcription', text);
  isLoading.value = false;
};

const playAudio = async (audioBlob: Blob) => {
  console.log('Playing audio...');
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

const transcribeAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('audioFile', audioBlob, 'audio.webm');
  try {
    const { text } = await client.speechToText.transcribeAudio(formData);
    return text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    emit('abort');
    return '';
  }
};

// Hooks
</script>

<template>
  <div>
    <Button
      @mousedown.prevent="async () => await onStartRecording()"
      @mouseup.prevent="async () => await onStopRecording()"
      size="icon"
      variant="ghost"
      class="group"
      type="button"
    >
      <MicIcon
        v-if="!isLoading"
        class="h-5 w-5 text-stone-500 opacity-50 group-hover:opacity-100"
        :class="{ 'animate-pulse': isRecording }"
        :style="{ color: isRecording ? 'red' : 'inherit' }"
      />
      <Loader2Icon v-else class="animate-spin opacity-65" />
    </Button>
  </div>
</template>
