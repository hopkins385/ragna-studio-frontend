<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import AssistantCreateForm from '@components/assistant/AssistantCreateForm.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import useAssistantService from '@composables/services/useAssistantService';
import type { AssistantTool } from '@composables/services/useAssistantToolsService';
import { useAssistantToolsService } from '@composables/services/useAssistantToolsService';
import useToast from '@composables/useToast';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';
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
