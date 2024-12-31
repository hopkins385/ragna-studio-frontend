<script setup lang="ts">
import { RouteName } from '@/router/enums/route-names.enum';
import { useChatService } from '@composables/services/useChatService';

const router = useRouter();
const { fetchLatestChat } = useChatService();

onMounted(async () => {
  const { chat } = await fetchLatestChat();
  if (!chat.id) {
    router.push({
      name: RouteName.CHAT_CREATE,
    });
  }
  router.push({
    name: RouteName.CHAT_SHOW,
    params: { id: chat.id },
  });
});
</script>

<template>
  <div>Please come back later</div>
</template>
