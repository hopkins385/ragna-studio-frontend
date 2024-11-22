<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();

const onLogout = async () => {
  await authStore.logout();
  await router.push({ name: 'login' });
};

onBeforeMount(async () => {
  await onLogout();
});
</script>

<template>
  <div></div>
</template>
