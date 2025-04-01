<script setup lang="ts">
import { useScreenCapture } from '@/modules/media/composable/use-screencapture';

const { isCapturing, screenshotUrl, error, captureScreen, downloadScreenshot, resetScreenshot } =
  useScreenCapture();
</script>

<template>
  <div class="screen-capture">
    <button @click="captureScreen" :disabled="isCapturing">
      {{ isCapturing ? 'Capturing...' : 'Capture Screen' }}
    </button>

    <div v-if="error" class="error">
      {{ error.message }}
    </div>

    <div v-if="screenshotUrl" class="screenshot-container">
      <img :src="screenshotUrl" alt="Screenshot" />
      <div class="actions">
        <button @click="downloadScreenshot()">Download</button>
        <button @click="resetScreenshot">Discard</button>
      </div>
    </div>
  </div>
</template>
