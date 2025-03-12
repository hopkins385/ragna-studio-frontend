<script setup lang="ts">
import AuthProcessing from '@/components/auth/AuthProcessing.vue';
import { authProviderService } from '@/modules/auth/auth-provider.service';
import { RouteName } from '@/router/enums/route-names.enum';

const router = useRouter();
const route = useRoute();
const query = route.query;
const code = query.code?.toString() || null;
const error = query.error?.toString() || null;

const errorMessage = ref('');

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (error) {
    router.push({ name: RouteName.MEDIA_GOOGLE_DRIVE_INDEX });
    return;
  }
  if (!code) {
    console.error('[google drive callback]', 'Invalid code');
    errorMessage.value = 'Invalid code';
    return;
  }
  try {
    await authProviderService.connectGoogleDrive({ code });
    router.push({ name: RouteName.MEDIA_GOOGLE_DRIVE_INDEX });
  } catch (error: any) {
    console.error('[fetch google drive callback]', error);
    errorMessage.value = 'Cannot connect Google Drive';
  }
});
</script>

<template>
  <AuthProcessing :error-message="errorMessage" />
</template>
