<script setup lang="ts">
import AssistantCreateForm from '@components/assistant/AssistantCreateForm.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import useAssistantService from '@composables/services/useAssistantService';
import type { AssistantTool } from '@composables/services/useAssistantToolsService';
import { useAssistantToolsService } from '@composables/services/useAssistantToolsService';
import useToast from '@composables/useToast';
import { assistantFormSchema } from '@schemas/assistant.form';
import { useAuthStore } from '@stores/auth.store';
import { useForm } from 'vee-validate';

const router = useRouter();

const { t } = useI18n();
const { createAssistant } = useAssistantService();
const authStore = useAuthStore();
const toast = useToast();

const { handleSubmit } = useForm({
  validationSchema: assistantFormSchema,
  initialValues: {
    teamId: authStore.user?.firstTeamId || undefined,
    llmId: '',
    title: '',
    description: '',
    systemPrompt: '',
    isShared: false,
    tools: [],
  },
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  await createAssistant({
    ...values,
    systemPromptTokenCount: 1,
  })
    .then(() => {
      toast.success({
        description: 'Assistant created successfully',
      });
      resetForm();
      // router.push({ name: RouteName.A });
    })
    .catch(() => {
      toast.error({
        description: 'Failed to create assistant',
      });
    });
});

// tools
const { fetchAllTools } = useAssistantToolsService();

const assistantTools = ref<AssistantTool[]>([]);

const getTools = async () => {
  try {
    const { tools } = await fetchAllTools();
    assistantTools.value = tools;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => getTools());

useHead({
  title: t('assistant.create.title'),
  meta: [
    {
      name: 'description',
      content: t('assistant.create.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <SectionHeading
      :title="$t('assistant.create.title')"
      :subtitle="$t('assistant.create.subtitle')"
    />
    <div class="px-5">
      <AssistantCreateForm />
    </div>
  </SectionContainer>
</template>
