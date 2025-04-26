<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useAudioRecorder } from '@/modules/speech-to-text/composables/useAudioRecoder';
import { MicIcon } from 'lucide-vue-next';

// Imports

// Props
// Emits
const emit = defineEmits<{
  transcription: [string];
  abort: [void];
}>();

// Refs

// Composables
const client = useRagnaClient();
const { isRecording, audioChunks, outputFormat, startRecording, stopRecording } =
  useAudioRecorder();

// Computed
// Functions
const onStartRecording = () => {
  startRecording();
};

const onStopRecording = async () => {
  // delay to ensure audio is recorded
  await new Promise(resolve => setTimeout(resolve, 1000));
  stopRecording();
  const audioBlob = new Blob(audioChunks.value, { type: outputFormat.value });
  if (!audioBlob) {
    console.log('No audio recorded');
    emit('abort');
    return;
  }
  // await playAudio(audioBlob);
  const text = await transcribeAudio(audioBlob);
  emit('transcription', text);
};

const playAudio = async (audioBlob: Blob) => {
  console.log('Playing audio...');
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

const transcribeAudio = async (audioBlob: Blob) => {
  // send to api
  const formData = new FormData();
  formData.append('audioFile', audioBlob, 'audio.webm');

  console.log('Transcribing audio...');
  console.log('FormData', formData);
  try {
    const { text } = await client.speechToText.transcribeAudio(formData);
    console.log('Transcribed text:', text);
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
      @mousedown.prevent="() => onStartRecording()"
      @mouseup.prevent="async () => await onStopRecording()"
      size="icon"
      variant="ghost"
      class="group"
      type="button"
    >
      <MicIcon
        class="h-5 w-5 text-stone-500 opacity-50 group-hover:opacity-100"
        :class="{ 'animate-pulse': isRecording }"
        :style="{ color: isRecording ? 'red' : 'inherit' }"
      />
    </Button>
  </div>
</template>
