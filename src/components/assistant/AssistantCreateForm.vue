<script setup lang="ts">
import {
  Book,
  BriefcaseBusiness,
  CircleUserRound,
  Settings,
  Stars,
} from 'lucide-vue-next';
import TabSidebar from '../tab/TabSidebar.vue';
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
import LlmSelectModal from '../llm/LlmSelectModal.vue';
import ErrorAlert from '../error/ErrorAlert.vue';
import { assistantFormSchema } from '@/schemas/assistant.form';
import { useAuthStore } from '@/stores/auth.store';
import useToast from '@/composables/useToast';
import ButtonLoading from '../button/ButtonLoading.vue';
import {
  useAssistantToolsService,
  type AssistantTool,
} from '@/composables/services/useAssistantToolsService';
import { Checkbox } from '@ui/checkbox';
import { Button } from '@ui/button';
import useAssistantService from '@/composables/services/useAssistantService';

const currentTab = ref('tab1');
const isLoading = ref(false);
const assistantTools = ref<AssistantTool[] | null>(null);

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const initialAssistantName = computed(() => 'Select AI Model');
const initialCollectionName = computed(() => 'Select Knowledge Collection');

const { fetchAllTools } = useAssistantToolsService();
const { createAssistant } = useAssistantService();

const initAssistantTools = async () => {
  const { tools } = await fetchAllTools();
  assistantTools.value = tools;
};

const { errors, handleSubmit, isSubmitting, isValidating, resetForm } = useForm(
  {
    validationSchema: assistantFormSchema,
    initialValues: {
      teamId: authStore.user?.firstTeamId || '-1',
      llmId: '',
      title: '',
      description: '',
      systemPrompt: '',
      temperature: [80],
      isShared: false,
      tools: [],
    },
  },
);

const onSubmit = handleSubmit(async values => {
  isLoading.value = true;
  try {
    await createAssistant({
      ...values,
      systemPromptTokenCount: 1,
    });
    toast.success({
      description: 'Agent created',
    });
    resetForm();
    router.back();
  } catch (error: any) {
    console.error(error);
    toast.error({
      description: 'Failed to create agent',
    });
  } finally {
    isLoading.value = false;
  }
});

const showErrorAlert = ref(false);
const errorAlertMessage = ref('');

watch(
  () => errors.value,
  errors => {
    if (Object.keys(errors).length > 0) {
      showErrorAlert.value = true;
      errorAlertMessage.value = 'Please fill out all required fields.'; //errors[Object.keys(errors)[0]];
    } else {
      showErrorAlert.value = false;
      errorAlertMessage.value = '';
    }
  },
);

onMounted(() => {
  initAssistantTools();
});
</script>

<template>
  <ErrorAlert v-model="showErrorAlert" :message="errorAlertMessage" />
  <div class="w-full flex justify-end">
    <div class="flex items-center space-x-4">
      <Button @click="$router.back()" variant="outline"> Cancel </Button>
      <ButtonLoading :loading="isLoading" @click="onSubmit">
        Create Agent
      </ButtonLoading>
    </div>
  </div>
  <TabSidebar
    v-model="currentTab"
    :tabs="[
      { id: 'tab1', icon: Settings, label: 'Agent Details' },
      { id: 'tab2', icon: Stars, label: 'Generative AI' },
      { id: 'tab3', icon: CircleUserRound, label: 'Behaviour' },
      { id: 'tab4', icon: Book, label: 'Knowledge' },
      { id: 'tab5', icon: BriefcaseBusiness, label: 'Capabilities' },
      // { id: 'tab6', icon: Settings2, label: 'Advanced' },
    ]"
  >
    <template #tab1>
      <!-- TAB 1-->
      <div class="space-y-8">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel> Title </FormLabel>
            <FormDescription>
              This is the title of the agent that will be displayed.
            </FormDescription>
            <FormControl>
              <Input
                type="text"
                placeholder="A very short Title (max 3 words)"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel> Description </FormLabel>
            <FormDescription>
              This is the description of the agent.
            </FormDescription>
            <FormControl>
              <Textarea
                type="text"
                placeholder="A very short description"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <!-- END TAB 1-->
    </template>
    <template #tab2>
      <!-- TAB 2-->
      <FormField v-slot="{ handleChange, value }" name="llmId">
        <FormItem>
          <FormLabel> Ai Model </FormLabel>
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
      <!-- END TAB 2-->
    </template>
    <template #tab3>
      <!-- TAB 3-->
      <div class="space-y-8">
        <FormField v-slot="{ componentField }" name="systemPrompt">
          <FormItem>
            <FormLabel> Behaviour </FormLabel>
            <FormDescription>
              Describe how the assistant should behave.
            </FormDescription>
            <FormControl>
              <Textarea rows="10" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <!-- END TAB 3-->
    </template>
    <template #tab4>
      <div class="text-sm border rounded-lg p-4 mt-4">
        This property can only be set after the agent is created
      </div>
      <!--
      <FormField v-slot="{ handleChange, value }" name="collectionId">
        <FormItem>
          <FormLabel>Knowledge Collections (optional)</FormLabel>
          <FormDescription>
            These are the knowledge collections that can be used by the agent.
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
    <template #tab5>
      <!-- Tools -->
      <div class="text-sm border rounded-lg p-4 mt-4">
        This property can only be set after the agent is created
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
  </TabSidebar>
</template>
