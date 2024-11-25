<script setup lang="ts">
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import { Button } from '@ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { Switch } from '@ui/switch';
import useAssistantService from '@composables/services/useAssistantService';
import useToast from '@composables/useToast';
import { assistantFormSchema } from '@/schemas/assistant.form';
import { useAuthStore } from '@stores/auth.store';
import { useForm } from 'vee-validate';
import LlmSelectModal from '@components/llm/LlmSelectModal.vue';
import { Textarea } from '@ui/textarea';
import {
  useAssistantToolsService,
  type AssistantTool,
} from '@/composables/services/useAssistantToolsService';
import { Checkbox } from '@/components/ui/checkbox';

const router = useRouter();

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
      router.push({ name: 'assistant.list' });
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
</script>

<template>
  <SectionContainer>
    <SectionHeading title="Create Assistant" />
    <div class="rounded-lg border bg-white p-10">
      <form class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel> Title </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Title (max 3 words)"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel> Description </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Short description"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ handleChange, value }" name="llmId">
          <FormItem>
            <FormLabel> Ai Model </FormLabel>

            <FormControl>
              <LlmSelectModal
                :id="value"
                initial-display-name="Select AI Model"
                @update:id="handleChange"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="systemPrompt">
          <FormItem>
            <FormLabel> assistant.form.systemPrompt.label </FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" />
            </FormControl>
            <FormDescription>
              assistant.form.systemPrompt.description
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Tools -->
        <FormField name="tools">
          <FormItem>
            <div class="mb-4 space-y-2">
              <FormLabel> Functions (optional)</FormLabel>
              <FormDescription>
                These are the functions the assistant can use.
              </FormDescription>
            </div>

            <FormField
              v-for="tool in assistantTools"
              v-slot="{ value, handleChange }"
              :key="tool.id"
              type="checkbox"
              :value="tool.id"
              :unchecked-value="false"
              name="tools"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :checked="value?.includes(tool.id)"
                    @update:checked="handleChange"
                  />
                </FormControl>
                <FormLabel class="font-normal"> {{ tool.name }} </FormLabel>
              </FormItem>
            </FormField>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="hidden text-sm">Knowledge Base<br />tbd</div>

        <FormField
          v-slot="{ handleChange, value }"
          type="checkbox"
          name="isShared"
        >
          <FormItem>
            <FormLabel>Shared</FormLabel>
            <FormControl>
              <Switch :checked="value" @update:checked="handleChange" />
            </FormControl>
            <FormDescription>
              If the assistant is shared it will be available to your whole
              organization.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit">Create Assistant</Button>
      </form>
    </div>
  </SectionContainer>
</template>
