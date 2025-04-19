<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useToolIcons } from '@/modules/assistant-tool/composables/useToolIcons';
import { createAssistantFormSchema } from '@/modules/assistant/schemas/assistant.form';
import LlmSelectModal from '@/modules/llm/components/LlmSelectModal.vue';
import PromptWizardDialog from '@/modules/prompt-wizard/components/PromptWizardDialog.vue';
import { RouteName } from '@/router/enums/route-names.enum';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import TabSidebar from '@components/tab/TabSidebar.vue';
import useToast from '@composables/useToast';
import type { AssistantTool } from '@hopkins385/ragna-sdk';
import ButtonLink from '@ui/button/ButtonLink.vue';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import {
  Book,
  BriefcaseBusiness,
  CircleUserRound,
  Settings,
  ShieldCheck,
  Stars,
} from 'lucide-vue-next';

// Props
// Emits

// Refs
const currentTab = ref('title');
const isLoading = ref(false);
const assistantTools = ref<AssistantTool[] | null>(null);

// Composables
const client = useRagnaClient();
const toast = useToast();
const router = useRouter();
const { t } = useI18n();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { getToolIcon } = useToolIcons();

// Computed
const initialAssistantName = computed(() => t('assistant.genai.select'));
const initialCollectionName = computed(() => t('assistant.knowledge.select'));

// Functions
const initAssistantTools = async () => {
  const { tools } = await client.assistantTool.fetchAllTools();
  assistantTools.value = tools;
};

const {
  errors: formErrors,
  handleSubmit,
  resetForm,
} = useForm({
  validationSchema: createAssistantFormSchema,
  initialValues: {
    llmId: '',
    title: '',
    description: '',
    systemPrompt: '',
    // temperature: [80],
    // hasKnowledgeBase: false,
    // hasWorkflow: false,
    isShared: false,
    tools: [],
  },
});

const tabsWithErrors = computed<string[]>(() => {
  if (!formErrors.value) return [];
  const errorTabs = new Set();
  Object.keys(formErrors.value).forEach(fieldName => {
    const tabId = siderBarTabs.find(tab => tab.id === fieldName)?.id;
    if (tabId) {
      errorTabs.add(tabId);
    }
  });
  return Array.from(errorTabs) as string[];
});

const onSubmit = handleSubmit(async values => {
  unsetErrorAlert();
  isLoading.value = true;

  try {
    await client.assistant.createAssistant({
      llmId: values.llmId,
      title: values.title,
      description: values.description,
      systemPrompt: values.systemPrompt,
      isShared: values.isShared,
      hasKnowledgeBase: false,
      hasWorkflow: false,
      tools: values.tools,
      // temperature: values.temperature,
    });
    toast.success({
      description: t('assistant.create.success'),
    });
    router.push({
      name: RouteName.ASSISTANT_INDEX,
    });
    resetForm();
  } catch (error) {
    setErrorAlert(error);
  } finally {
    isLoading.value = false;
  }
});

const siderBarTabs = [
  { id: 'title', icon: Settings, label: t('assistant.settings.label') },
  { id: 'systemPrompt', icon: CircleUserRound, label: t('assistant.behavior.label') },
  { id: 'llmId', icon: Stars, label: t('assistant.genai.label') },
  { id: 'tools', icon: BriefcaseBusiness, label: t('assistant.tools.label') },
  { id: 'tab5', icon: Book, label: t('assistant.knowledge.label') },
  { id: 'tab6', icon: ShieldCheck, label: t('assistant.privacy.label') },
];

onMounted(() => {
  initAssistantTools();
});

onBeforeUnmount(() => {
  client.assistant.abortRequest();
});
</script>

<template>
  <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />
  <div class="w-full flex justify-end">
    <div class="flex items-center space-x-4">
      <ButtonLink to="/assistant" variant="secondary">
        {{ $t('form.button.cancel') }}
      </ButtonLink>
      <ButtonLoading :loading="isLoading" @click="onSubmit" type="submit">
        {{ $t('assistant.create.button') }}
      </ButtonLoading>
    </div>
  </div>
  <TabSidebar v-model="currentTab" :tabs="siderBarTabs" :error-tabs="tabsWithErrors">
    <!-- TAB 1-->
    <template #title>
      <div class="space-y-8">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>{{ $t('assistant.form.name_label') }}</FormLabel>
            <FormDescription>
              {{ $t('assistant.form.name_description') }}
            </FormDescription>
            <FormControl>
              <Input type="text" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>
              {{ $t('assistant.form.description_label') }}
            </FormLabel>
            <FormDescription>
              {{ $t('assistant.form.description_description') }}
            </FormDescription>
            <FormControl>
              <Textarea type="text" placeholder="" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </template>
    <!-- TAB 2-->
    <template #systemPrompt>
      <div class="space-y-8">
        <FormField v-slot="{ componentField, value, handleChange }" name="systemPrompt">
          <div>
            <PromptWizardDialog :input-prompt="value" @update-prompt="handleChange" />
          </div>
          <FormItem>
            <FormLabel>{{ $t('assistant.behavior.label') }}</FormLabel>
            <FormDescription>
              {{ $t('assistant.behavior.description') }}
            </FormDescription>
            <FormControl>
              <Textarea rows="10" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </template>
    <!-- TAB 3-->
    <template #llmId>
      <FormField v-slot="{ handleChange, value }" name="llmId">
        <FormItem>
          <FormLabel>{{ $t('assistant.genai.label') }}</FormLabel>
          <FormControl>
            <LlmSelectModal :current-llm-id="value" @update:id="handleChange" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <!-- TAB 4-->
    <template #tools>
      <FormField name="tools">
        <FormItem>
          <div class="mb-4 space-y-2">
            <FormLabel>{{ $t('assistant.tools.label') }}</FormLabel>
            <FormDescription>
              {{ $t('assistant.tools.description') }}
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
            <FormItem
              class="flex flex-row items-center space-x-3 border border-transparent space-y-4 w-fit"
            >
              <FormControl>
                <Checkbox :checked="value?.includes(tool.id)" @update:checked="handleChange" />
              </FormControl>
              <FormLabel class="font-normal flex space-x-3">
                <div class="size-8 flex justify-center">
                  <component
                    :is="getToolIcon(tool?.iconName)"
                    class="size-5 stroke-1.5 text-gray-500 shrink-0"
                  />
                </div>
                <div class="space-y-1">
                  <h2 class="text-sm">{{ $t(`tool.${tool.name.toString()}.label`) }}</h2>
                  <p class="opacity-75 text-xs">
                    {{ $t(`tool.${tool.name.toString()}.description`) }}
                  </p>
                </div>
              </FormLabel>
            </FormItem>
          </FormField>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <!-- TAB 5-->
    <template #tab5>
      <div class="text-sm border rounded-lg p-4 mt-4">
        {{ $t('assistant.alert.create_first') }}
      </div>
      <!--
      <FormField name="tools">
        <FormItem>
          <div class="mb-4 space-y-2">
            <FormLabel> Tools (optional)</FormLabel>
            <FormDescription>
              Select the tools the agent can use.
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
      -->
    </template>
    <!-- TAB 6 -->
    <template #tab6>
      <div class="text-sm border rounded-lg p-4 mt-4">
        {{ $t('assistant.alert.create_first') }}
      </div>
    </template>
  </TabSidebar>
</template>
