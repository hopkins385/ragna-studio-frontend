import { ref } from 'vue';

export function useScreenCapture() {
  const isCapturing = ref<boolean>(false);
  const screenshotUrl = ref<string | null>(null);
  const error = ref<Error | null>(null);

  const captureScreen = async (): Promise<void> => {
    isCapturing.value = true;
    error.value = null;

    try {
      // Request screen capture permission and get the media stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' } as MediaTrackConstraints,
      });

      // Create a video element to capture a frame
      const video = document.createElement('video');
      video.srcObject = stream;

      // Wait for the video to load enough data
      await new Promise<boolean>(resolve => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });

      // Create a canvas element to draw the video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL
        screenshotUrl.value = canvas.toDataURL('image/png');
      }

      // Stop all tracks in the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      console.error('Error capturing screen:', err);
    } finally {
      isCapturing.value = false;
    }
  };

  const downloadScreenshot = (filename?: string): void => {
    if (!screenshotUrl.value) return;

    const link = document.createElement('a');
    link.href = screenshotUrl.value;
    link.download =
      filename || `screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    link.click();
  };

  const resetScreenshot = (): void => {
    screenshotUrl.value = null;
  };

  return {
    isCapturing,
    screenshotUrl,
    error,
    captureScreen,
    downloadScreenshot,
    resetScreenshot,
  };
}
