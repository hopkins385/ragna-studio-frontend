<script setup lang="ts">
import { useChatService } from '@/composables/services/useChatService';

const router = useRouter();
const { fetchLatestChat } = useChatService();

onMounted(async () => {
  const { chat } = await fetchLatestChat();
  if (!chat.id) {
    router.push('/chat/create');
  }
  router.push(`/chat/${chat.id}`);
});
</script>

<template>
  <div></div>
</template>
