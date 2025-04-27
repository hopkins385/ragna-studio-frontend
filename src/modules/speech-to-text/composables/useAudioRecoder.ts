import { computed, onUnmounted, ref } from 'vue';

type AudioQualityType = 'low' | 'medium' | 'high';

// Define output format options
const MIME_TYPES = {
  WEBM_OPUS: 'audio/webm;codecs=opus',
  WEBM_PCM: 'audio/webm;codecs=pcm',
  MP4_AAC: 'audio/mp4;codecs=aac',
  OGG_OPUS: 'audio/ogg;codecs=opus',
  WAV: 'audio/wav',
} as const;

type OutputFormatType = (typeof MIME_TYPES)[keyof typeof MIME_TYPES];

export function useAudioRecorder() {
  const isRecording = ref(false);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const recordingDuration = ref(0);
  const recordingTimer = ref<number | null>(null);
  const microphoneStream = ref<MediaStream | null>(null);
  const error = ref<Error | null>(null);

  // Configuration Refs
  const outputFormat = ref<OutputFormatType>(MIME_TYPES.WEBM_OPUS); // Default MIME type
  const audioQuality = ref<AudioQualityType>('medium');
  const timeslice = ref(1000); // Collect data chunks every second

  // Audio constraints
  const audioConfig = ref({
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 16000, // 44100,
  });

  // Computed properties for derived values
  const audioBitrate = computed(() => {
    switch (audioQuality.value) {
      case 'low':
        return 64000;
      case 'medium':
        return 128000;
      case 'high':
        return 256000;
      default:
        return 128000;
    }
  });

  // Determine the best supported output format
  const getSupportedMimeType = (): OutputFormatType => {
    // Try the user's preferred format first
    if (MediaRecorder.isTypeSupported(outputFormat.value)) {
      return outputFormat.value;
    }

    // Fall back to other formats in priority order
    for (const type of Object.values(MIME_TYPES)) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.info(`Selected supported MIME type: ${type}`);
        return type;
      }
    }

    // If none are explicitly supported, return the default and hope for the best
    console.warn('No explicitly supported MIME types found. Using default.');
    return MIME_TYPES.WEBM_OPUS;
  };

  const startRecordingTimer = () => {
    recordingDuration.value = 0;
    recordingTimer.value = window.setInterval(() => {
      recordingDuration.value += 1;
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }
  };

  const startRecording = async () => {
    error.value = null;

    try {
      // Stop any existing recording
      if (isRecording.value) {
        stopRecording();
      }

      // Reset state
      audioChunks.value = [];

      // Get access to the microphone
      microphoneStream.value = await navigator.mediaDevices.getUserMedia({
        audio: audioConfig.value,
        video: false,
      });

      // Determine the most appropriate MIME type
      const finalMimeType = getSupportedMimeType();

      // Configure MediaRecorder options
      const options: MediaRecorderOptions = {
        mimeType: finalMimeType,
        audioBitsPerSecond: audioBitrate.value,
      };

      // Create and start the media recorder
      mediaRecorder.value = new MediaRecorder(microphoneStream.value, options);

      mediaRecorder.value.ondataavailable = event => {
        if (event.data.size < 1) return;
        audioChunks.value.push(event.data);
      };

      mediaRecorder.value.onerror = event => {
        console.error('MediaRecorder error:', event);
        error.value = new Error('Recording error occurred');
        stopRecording();
      };

      mediaRecorder.value.onstop = () => {
        // create a blob from the audio chunks
        // const audioBlob = new Blob(audioChunks.value, { type: finalMimeType });
        // Clean up microphone access
        cleanupStream();
        isRecording.value = false;
        stopRecordingTimer();
      };

      // Start the recorder with timeslice to get incremental data
      mediaRecorder.value.start(timeslice.value);
      // add small delay to ensure the recorder is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      // Set the recording state
      isRecording.value = true;
      startRecordingTimer();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      console.error('Error accessing microphone or starting recorder:', err);
      isRecording.value = false;
      cleanupStream();
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.value && isRecording.value) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        mediaRecorder.value.stop();
        // isRecording will be set to false in the onstop handler
      } catch (err) {
        console.error('Error stopping recorder:', err);
        isRecording.value = false;
        cleanupStream();
      }
    }
  };

  const cancelRecording = () => {
    stopRecording();
    audioChunks.value = [];
  };

  // Set quality preset
  const setAudioQuality = (quality: AudioQualityType) => {
    audioQuality.value = quality;
  };

  // Set output format
  const setOutputFormat = (format: OutputFormatType) => {
    outputFormat.value = format;
  };

  // Clean up microphone stream
  const cleanupStream = () => {
    if (microphoneStream.value) {
      microphoneStream.value.getTracks().forEach(track => track.stop());
      microphoneStream.value = null;
    }
  };

  // Ensure cleanup on component unmount
  onUnmounted(() => {
    stopRecording();
    stopRecordingTimer();
    cleanupStream();
  });

  return {
    isRecording,
    audioChunks,
    recordingDuration,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    outputFormat,
    audioQuality,
    setAudioQuality,
    setOutputFormat,
    MIME_TYPES,
  };
}
