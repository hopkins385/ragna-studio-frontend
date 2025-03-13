<script setup lang="ts">
import { aiChatService } from '@/modules/ai-chat/ai-chat.service';
import { RouteName } from '@/router/enums/route-names.enum';

const router = useRouter();

const forwardToChat = async () => {
  const { chat } = await aiChatService.fetchLatestChat();
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
