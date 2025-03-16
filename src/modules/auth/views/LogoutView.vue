<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { RouteName } from '@/router/enums/route-names.enum';

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
