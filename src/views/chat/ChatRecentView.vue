<script setup lang="ts">
import { RouteName } from '@/router/enums/route-names.enum';
import { useChatService } from '@composables/services/useChatService';

const router = useRouter();
const { fetchLatestChat } = useChatService();

const forwardToChat = async () => {
  const { chat } = await fetchLatestChat();
  if (!chat || !chat?.id) {
    return router.push({
      name: RouteName.CHAT_CREATE,
    });
  }
  router.push({
    name: RouteName.CHAT_SHOW,
    params: { id: chat.id },
  });
};

onMounted(async () => {
  await forwardToChat();
});
</script>

<template>
  <div></div>
</template>
