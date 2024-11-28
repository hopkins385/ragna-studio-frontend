<script setup lang="ts">
import AuthProcessing from '@/components/auth/AuthProcessing.vue';
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import { useProviderAuthService } from '@/composables/services/useProviderAuthService';

const router = useRouter();
const route = useRoute();
const query = route.query;
const code = query.code?.toString() || null;
const error = query.error?.toString() || null;

const errorMessage = ref('');

const { connectGoogleDrive } = useProviderAuthService();

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (error) {
    router.push({ name: 'media.google-drive.index' });
    return;
  }
  if (!code) {
    console.error('[google drive callback]', 'Invalid code');
    errorMessage.value = 'Invalid code';
    return;
  }
  try {
    await connectGoogleDrive({ code });
    router.push({ name: 'media.google-drive.index' });
  } catch (error: any) {
    console.error('[fetch google drive callback]', error);
    errorMessage.value = 'Cannot connect Google Drive';
  }
});
</script>

<template>
  <AuthProcessing :error-message="errorMessage" />
</template>
