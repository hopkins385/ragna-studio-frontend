type AudioQualityType = 'low' | 'medium' | 'high';

// Define output format options
const MIME_TYPES = {
  WEBM_OPUS: 'audio/webm;codecs=opus',
  WEBM_PCM: 'audio/webm;codecs=pcm',
  MP4_AAC: 'audio/mp4;codecs=aac',
  WAV: 'audio/wav',
  MP3: 'audio/mpeg',
  MP4: 'audio/mp4', // Default as MP4 works on Safari and Chrome
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

  // Permissions
  const canAccessMicrophone = ref(false);

  // Configuration Refs
  const outputFormat = ref<OutputFormatType>(MIME_TYPES.MP4); // Default MIME type
  const audioQuality = ref<AudioQualityType>('medium');
  const timeslice = ref(1000); // Collect data chunks every second

  // Audio constraints
  const audioConfig = ref({
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 16000, // 16kHz is a common sample rate for speech
    channelCount: 1, // Mono audio
  });

  // Computed properties for derived values
  const audioBitrate = computed(() => {
    switch (audioQuality.value) {
      case 'low':
        return 16000;
      case 'medium':
        return 32000;
      case 'high':
        return 128000;
      default:
        return 32000;
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

      // Check if the browser supports MediaRecorder
      if (!('MediaRecorder' in window)) {
        error.value = new Error('MediaRecorder is not supported in this browser.');
        console.error('MediaRecorder is not supported in this browser.');
        return;
      }

      // Get access to the microphone
      try {
        microphoneStream.value = await navigator.mediaDevices.getUserMedia({
          audio: audioConfig.value,
          video: false,
        });
        canAccessMicrophone.value = true;
      } catch (err: unknown) {
        // Handle specific permission errors
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            error.value = new Error(
              'Microphone permission denied. Please allow microphone access to record audio.',
            );
          } else if (err.name === 'AbortError') {
            error.value = new Error('Recording request was aborted. Please try again.');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            error.value = new Error(
              'No microphone found. Please connect a microphone and try again.',
            );
          } else {
            error.value = new Error(`Microphone error: ${err.message}`);
          }
        } else {
          error.value = err instanceof Error ? err : new Error(String(err));
        }
        console.error('Error accessing microphone:', error.value);
        isRecording.value = false;
        return; // Exit early since we can't continue without microphone access
      }

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
      console.error('Error starting recorder:', err);
      isRecording.value = false;
      cleanupStream();
    }
  };

  // Clean up microphone stream
  const cleanupStream = () => {
    if (microphoneStream.value) {
      microphoneStream.value.getTracks().forEach(track => track.stop());
      microphoneStream.value = null;
    }
  };

  const stopRecording = async (options?: { stopImmediately?: boolean }) => {
    if (!mediaRecorder.value || !isRecording.value) {
      error.value = new Error('Recorder is not active');
      console.warn('Recorder is not active');
      return;
    }
    try {
      if (!options?.stopImmediately) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      mediaRecorder.value.stop();
      // isRecording will be set to false in the onstop handler
    } catch (err) {
      console.error('Error stopping recorder:', err);
      isRecording.value = false;
      cleanupStream();
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

  // Check for microphone permissions using the Permissions API
  const checkMicrophonePermission = async () => {
    try {
      // Check if browser supports the permissions API
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({
          name: 'microphone' as PermissionName,
        });

        if (permissionStatus.state === 'granted') {
          canAccessMicrophone.value = true;
        }

        // Set up a listener for permission changes
        permissionStatus.addEventListener('change', () => {
          canAccessMicrophone.value = permissionStatus.state === 'granted';
        });

        // Return cleanup function to remove event listener
        return () => {
          permissionStatus.removeEventListener('change', () => {
            // Remove the listener when no longer needed
          });
        };
      }
    } catch (err) {
      console.warn('Unable to check microphone permissions:', err);
      // Fall back to the existing detection mechanism
    }

    // Return empty cleanup function if permissions API not available
    return () => {};
  };

  // Initialize permission check
  let cleanupPermissionListener = () => {};

  onMounted(async () => {
    cleanupPermissionListener = (await checkMicrophonePermission()) || (() => {});
  });

  // Ensure cleanup on component unmount
  onUnmounted(() => {
    stopRecording();
    stopRecordingTimer();
    cleanupStream();
    cleanupPermissionListener();
  });

  return {
    isRecording,
    audioChunks,
    recordingDuration,
    canAccessMicrophone,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    outputFormat,
    audioQuality,
    setAudioQuality,
    setOutputFormat,
    MIME_TYPES,
    checkMicrophonePermission, // Expose the check function in case we need to call it manually
  };
}
