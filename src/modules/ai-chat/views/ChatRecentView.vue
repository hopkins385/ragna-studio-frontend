<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import { RouteName } from '@/router/enums/route-names.enum';

const client = useRagnaClient();
const router = useRouter();

const forwardToChat = async () => {
  const { chat } = await client.aiChat.fetchLatestChat();
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
