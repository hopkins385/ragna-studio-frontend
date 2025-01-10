<script setup lang="ts">
import { RouteName } from '@/router/enums/route-names.enum';
import { assistantFormSchema } from '@/schemas/assistant.form';
import ButtonLink from '@components/button/ButtonLink.vue';
import ButtonLoading from '@components/button/ButtonLoading.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import LlmSelectModal from '@components/llm/LlmSelectModal.vue';
import TabSidebar from '@components/tab/TabSidebar.vue';
import useAssistantService from '@composables/services/useAssistantService';
import {
  useAssistantToolsService,
  type AssistantTool,
} from '@composables/services/useAssistantToolsService';
import useToast from '@composables/useToast';
import { useAuthStore } from '@stores/auth.store';
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
  Workflow,
} from 'lucide-vue-next';

const { t } = useI18n();
const { fetchAllTools } = useAssistantToolsService();
const { createAssistant } = useAssistantService();

const currentTab = ref('tab1');
const isLoading = ref(false);
const assistantTools = ref<AssistantTool[] | null>(null);

const showErrorAlert = ref(false);
const errorAlertMessage = ref('');

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const initialAssistantName = computed(() => t('assistant.genai.select'));
const initialCollectionName = computed(() => t('assistant.knowledge.select'));

const initAssistantTools = async () => {
  const { tools } = await fetchAllTools();
  assistantTools.value = tools;
};

const {
  errors: formErrors,
  handleSubmit,
  resetForm,
} = useForm({
  validationSchema: assistantFormSchema,
  initialValues: {
    teamId: authStore.user?.firstTeamId || '-1',
    llmId: '',
    title: '',
    description: '',
    systemPrompt: '',
    temperature: [80],
    hasKnowledgeBase: false,
    hasWorkflow: false,
    isShared: false,
    tools: [],
  },
});

const onSubmit = handleSubmit(async values => {
  isLoading.value = true;
  try {
    await createAssistant({
      ...values,
      // TODO: calculate the token count based on the system prompt, but lets do that on the backend!
      systemPromptTokenCount: 1,
    });
    toast.success({
      description: t('assistant.create.success'),
    });
    router.push({
      name: RouteName.ASSISTANT_INDEX,
    });
    resetForm();
  } catch (error: any) {
    console.error(error);
    toast.error({
      description: t('assistant.create.error'),
    });
  } finally {
    isLoading.value = false;
  }
});

watch(
  () => formErrors.value,
  errors => {
    if (Object.keys(errors).length > 0) {
      showErrorAlert.value = true;
      errorAlertMessage.value = errors[Object.keys(errors)[0] as any] as string;
    } else {
      showErrorAlert.value = false;
      errorAlertMessage.value = '';
    }
  },
);

const siderBarTabs = [
  { id: 'tab1', icon: Settings, label: t('assistant.settings.label') },
  { id: 'tab2', icon: Stars, label: t('assistant.genai.label') },
  { id: 'tab3', icon: CircleUserRound, label: t('assistant.behavior.label') },
  { id: 'tab5', icon: BriefcaseBusiness, label: t('assistant.tools.label') },
  { id: 'tab4', icon: Book, label: t('assistant.knowledge.label') },
  { id: 'tab6', icon: Workflow, label: t('assistant.workflow.label') },
  { id: 'tab7', icon: ShieldCheck, label: t('assistant.privacy.label') },
];

onMounted(() => {
  initAssistantTools();
});
</script>

<template>
  <ErrorAlert v-model="showErrorAlert" :message="errorAlertMessage" />
  <div class="w-full flex justify-end">
    <div class="flex items-center space-x-4">
      <ButtonLink to="/assistant" variant="secondary">
        {{ $t('form.button.cancel') }}
      </ButtonLink>
      <ButtonLoading :loading="isLoading" @click="onSubmit">
        {{ $t('assistant.create.button') }}
      </ButtonLoading>
    </div>
  </div>
  <TabSidebar v-model="currentTab" :tabs="siderBarTabs">
    <!-- TAB 1-->
    <template #tab1>
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
    <template #tab2>
      <FormField v-slot="{ handleChange, value }" name="llmId">
        <FormItem>
          <FormLabel>{{ $t('assistant.genai.label') }}</FormLabel>
          <FormControl>
            <LlmSelectModal
              :id="value"
              :initial-display-name="initialAssistantName"
              @update:id="handleChange"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <!-- TAB 3-->
    <template #tab3>
      <div class="space-y-8">
        <FormField v-slot="{ componentField }" name="systemPrompt">
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
    <!-- TAB 4-->
    <template #tab4>
      <div class="text-sm border rounded-lg p-4 mt-4">
        {{ $t('assistant.alert.create_first') }}
      </div>
      <!--
      <FormField v-slot="{ handleChange, value }" name="collectionId">
        <FormItem>
          <FormLabel>Knowledge Collections (optional)</FormLabel>
          <FormDescription>
            These are the knowledge collections that can be used by the assistant.
          </FormDescription>
          <FormControl>
            <CollectionSelectModal
              :id="value"
              :initial-display-name="initialCollectionName"
              @update:id="
                (id: string) => {
                  handleChange(id), updateCollection(id);
                }
              "
              @reset="resetCollections"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      -->
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
    <!-- TAB 7 -->
    <template #tab7>
      <div class="text-sm border rounded-lg p-4 mt-4">
        {{ $t('assistant.alert.create_first') }}
      </div>
    </template>
  </TabSidebar>
</template>
