<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import { RouteName } from '@/router/enums/route-names.enum';
import useToast from '@composables/useToast';
import type { CreateAssistantFromTemplatePayload } from '@hopkins385/ragna-sdk';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
import { Dialog, DialogContent } from '@ui/dialog';

interface Props {
  templateId: string;
  title: string;
  description: string;
  free: boolean;
  bgColorClass: string;
}

const props = defineProps<Props>();
const modelValue = defineModel<boolean>({ required: true });

const client = useRagnaClient();
const router = useRouter();
const toast = useToast();

const { locale } = useI18n();

const isLoading = ref(false);

const closeDialog = () => {
  modelValue.value = false;
};

const createAssistant = async () => {
  const payload: CreateAssistantFromTemplatePayload = {
    templateId: props.templateId,
    language: locale.value === 'en' ? 'en' : 'de',
  };

  try {
    // clone the template
    const { assistant } = await client.assistant.createAssistantFromTemplate(payload);
    // toast success
    toast.success({ description: 'assistant.clone.success' });
    // return the assistant
    return assistant;
  } catch (error) {
    console.error(error);
    toast.error({ description: 'assistant.clone.error' });
    throw error;
  }
};

const onCloneTemplateClick = async (payload: { startNewChat: boolean }) => {
  isLoading.value = true;

  try {
    // create Assistant from template
    const assistant = await createAssistant();
    // close the dialog
    closeDialog();
    // if start a new chat
    // if (payload.startNewChat) {
    //   const { chat } = await createChat(assistant.id);
    //   router.push({ name: RouteName.CHAT_SHOW, params: { id: chat.id } });
    // } else {
    // navigate to the assistant page
    await router.push({
      name: RouteName.ASSISTANT_EDIT,
      params: { id: assistant.id },
    });
    //}
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onBeforeUnmount(() => {
  client.assistant.abortRequest();
});
</script>

<template>
  <Dialog v-model:open="modelValue">
    <DialogContent class="min-w-[1200px] min-h-[800px]">
      <!--
      // TODO: Aria labels for this dialog (which is automatically added by the title and description components)
      <DialogHeader class="border">
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      -->
      <div class="grid grid-cols-2 border-0 bg-white rounded-md">
        <div class="">
          <div class="size-full rounded-md p-10" :class="bgColorClass">
            <h1 class="text-6xl uppercase font-bold leading-snug">
              {{ title }}
            </h1>
          </div>
        </div>
        <div class="px-10 pt-10">
          <div>
            <div class="space-y-2 mb-10">
              <span
                v-if="!free"
                class="text-xs font-semibold py-1 px-4 bg-gray-500 text-gray-50 rounded-full"
                >Pro</span
              >
              <h1 class="text-3xl font-bold">
                {{ title }}
              </h1>
            </div>
            <p class="">
              {{ description }}
            </p>
            <div class="flex space-x-3">
              <ButtonLoading :loading="isLoading" class="mt-10 px-10" @click="onCloneTemplateClick">
                Use this Template
              </ButtonLoading>
              <!--
              <ButtonLoading
                :loading="isLoading"
                class="mt-10 px-10"
                @click="() => onCloneTemplateClick({ startNewChat: true })"
              >
                Clone & Start Chat
              </ButtonLoading>
              -->
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
