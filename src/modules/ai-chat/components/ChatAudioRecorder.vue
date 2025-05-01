<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useAudioRecorder } from '@/modules/speech-to-text/composables/useAudioRecoder';
import { Loader2Icon, MicIcon } from 'lucide-vue-next';

// Props
// Emits
const emit = defineEmits<{
  transcription: [string];
  abort: [void];
}>();

// Refs
const isLoading = ref(false);
const isWaitingForPermission = ref(false);

// Composables
const client = useRagnaClient();
const {
  isRecording,
  audioChunks,
  outputFormat,
  error,
  startRecording,
  stopRecording,
  canAccessMicrophone,
} = useAudioRecorder();

// Functions
const onStartRecording = async (e: unknown) => {
  if (isWaitingForPermission.value) {
    // If we're waiting for permission, do nothing - user will press again after permission granted
    return;
  }

  // If permission state is unknown or denied, we need to request it
  if (!canAccessMicrophone.value) {
    isWaitingForPermission.value = true;
    await startRecording();

    // Stop recording immediately after permission is granted
    if (isRecording.value) {
      await stopRecording({
        stopImmediately: true,
      });
    }

    // After permission is granted, we reset but don't continue recording
    isWaitingForPermission.value = false;
    return;
  }

  // Permission already granted, start normal recording flow
  await startRecording();
};

const onStopRecording = async (e: unknown) => {
  if (!isRecording.value || isWaitingForPermission.value) {
    return;
  }
  //
  isLoading.value = true;
  // Stop recording
  await stopRecording();

  if (error.value) {
    isLoading.value = false;
    console.error('Error recording audio:', error.value);
    emit('abort');
    return;
  }

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
  // const text = 'dummy text'; // await transcribeAudio(audioBlob);
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
      @mousedown.prevent="onStartRecording"
      @mouseup.prevent="onStopRecording"
      size="icon"
      variant="ghost"
      class="group"
      type="button"
    >
      <MicIcon
        v-if="!isLoading && !isWaitingForPermission"
        class="h-5 w-5 text-stone-500 opacity-50 group-hover:opacity-100"
        :class="{ 'animate-pulse': isRecording }"
        :style="{ color: isRecording ? 'red' : 'inherit' }"
      />
      <Loader2Icon v-else class="animate-spin opacity-65" />
    </Button>
  </div>
</template>
