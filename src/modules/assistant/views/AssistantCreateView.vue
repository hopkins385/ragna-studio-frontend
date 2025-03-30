<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { useRagnaClient } from '@/composables/useRagnaClient';
import AssistantCreateForm from '@/modules/assistant/components/AssistantCreateForm.vue';
import { assistantFormSchema } from '@/modules/assistant/schemas/assistant.form';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import SectionContainer from '@components/section/SectionContainer.vue';
import useToast from '@composables/useToast';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';
import type { AssistantTool } from '@hopkins385/ragna-sdk';
import { useForm } from 'vee-validate';

const client = useRagnaClient();

const { t } = useI18n();
const authStore = useAuthStore();
const toast = useToast();

const { handleSubmit } = useForm({
  validationSchema: assistantFormSchema,
  initialValues: {
    teamId: authStore.userFirstTeamId,
    llmId: '',
    title: '',
    description: '',
    systemPrompt: '',
    isShared: false,
    tools: [],
  },
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  await client.assistant
    .createAssistant({
      teamId: authStore.userFirstTeamId,
      llmId: values.llmId,
      title: values.title,
      description: values.description,
      systemPrompt: values.systemPrompt,
      isShared: values.isShared,
      hasKnowledgeBase: false,
      hasWorkflow: false,
      tools: values.tools,
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
const assistantTools = ref<AssistantTool[]>([]);

const getTools = async () => {
  try {
    const { tools } = await client.assistantTool.fetchAllTools();
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
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('assistant.create.title')"
          :subtitle="$t('assistant.create.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <AssistantCreateForm />
    </div>
  </SectionContainer>
</template>
