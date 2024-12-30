<script setup lang="ts">
import { RouteName } from '@/router/enums/route-names.enum';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();

const onLogout = async () => {
  await authStore.logout();
  await router.push({ name: RouteName.LOGIN });
};

onBeforeMount(async () => {
  await onLogout();
});
</script>

<template>
  <div></div>
</template>
