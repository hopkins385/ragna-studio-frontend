<script setup lang="ts">
import type { AssistantTool } from '@/composables/services/useAssistantToolsService';
import type { Collection } from '@/composables/services/useCollectionService';
import type { Assistant } from '@/composables/services/useAssistantService';
import { assistantFormSchema } from '@/schemas/assistant.form';
import TabSidebar from '../tab/TabSidebar.vue';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { useAuthStore } from '@/stores/auth.store';
import { Input } from '../ui/input';
import LlmSelectModal from '../llm/LlmSelectModal.vue';
import {
  Activity,
  Book,
  BriefcaseBusiness,
  CircleUserRound,
  Settings,
  Settings2,
  Stars,
  UserRound,
} from 'lucide-vue-next';
import { Button } from '../ui/button';
import useAssistantService from '@/composables/services/useAssistantService';
import useToast from '@/composables/useToast';
import { Textarea } from '../ui/textarea';
import ButtonLoading from '../button/ButtonLoading.vue';
import CollectionSelectModal from '../collection/CollectionSelectModal.vue';
import useCollectionAbleService from '@/composables/services/useCollectionAbleService';
import Checkbox from '../ui/checkbox/Checkbox.vue';
import { Slider } from '../ui/slider';

const props = defineProps<{
  assistant: Assistant;
  assistantTools: AssistantTool[];
  collections: Collection[];
}>();

const emits = defineEmits<{
  refreshCollections: [void];
}>();

const authStore = useAuthStore();
const toast = useToast();

const currentTab = ref('tab1');
const isLoading = ref(false);

const initialAssistantName = computed(
  () => props.assistant?.llm.displayName ?? 'Select AI Model',
);

const initialCollectionName = computed(
  () => props.collections?.[0]?.name ?? 'Select Knowledge Collection',
);

const { updateAssistant } = useAssistantService();

// form

const { errors, handleSubmit, isSubmitting, isValidating } = useForm({
  validationSchema: assistantFormSchema,
  initialValues: {
    teamId: authStore.user?.firstTeamId || '-1',
    llmId: props.assistant?.llm.id || '',
    title: props.assistant?.title || '',
    description: props.assistant?.description || '',
    systemPrompt: props.assistant?.systemPrompt || '',
    temperature: [80], // props.assistant?.temperature ||
    isShared: props.assistant?.isShared || false,
    tools: props.assistant?.tools.map(tool => tool?.toolId) || [],
  },
});

const onSubmit = handleSubmit(async values => {
  if (!props.assistant) {
    throw new Error('Assistant not found');
  }
  isLoading.value = true;
  try {
    await updateAssistant(props.assistant.id, {
      ...values,
      systemPromptTokenCount: 1, // TODO: calculate token count
    });
    toast.success({
      description: 'Agent updated',
    });
    // router.back();
  } catch (error: any) {
    console.error(error);
    toast.error({
      description: 'Failed to update agent',
    });
  } finally {
    isLoading.value = false;
  }
});

// collections

const { replaceCollectionTo, detachAllCollectionsFrom } =
  useCollectionAbleService();

async function updateCollection(collectionId: string) {
  const model = {
    type: 'assistant',
    id: props.assistant.id,
  };
  await replaceCollectionTo(collectionId, { model });
  emits('refreshCollections');
  toast.success({
    description: 'Collection updated successfully',
  });
}

async function resetCollections() {
  const model = {
    type: 'assistant',
    id: props.assistant.id,
  };
  await detachAllCollectionsFrom({ model });
  emits('refreshCollections');
  toast.success({
    description: 'Collection updated successfully',
  });
}
</script>

<template>
  <div class="w-full flex justify-end">
    <div class="flex items-center space-x-4">
      <Button @click="$router.back()" variant="outline"> Cancel </Button>
      <ButtonLoading :loading="isLoading" @click="onSubmit">
        Update Agent
      </ButtonLoading>
    </div>
  </div>
  <TabSidebar
    v-model="currentTab"
    :tabs="[
      { id: 'tab1', icon: Settings, label: 'Agent Details' },
      { id: 'tab2', icon: Stars, label: 'Generative AI' },
      { id: 'tab3', icon: CircleUserRound, label: 'Behaviour' },
      { id: 'tab4', icon: Book, label: 'Knowledge Collections' },
      { id: 'tab5', icon: BriefcaseBusiness, label: 'Capabilities' },
      { id: 'tab6', icon: Settings2, label: 'Advanced' },
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
    </template>
    <template #tab5>
      <!-- Tools -->
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
    </template>
    <template #tab6>
      <FormField v-slot="{ componentField, value }" name="temperature">
        <FormItem>
          <FormLabel> Creativity </FormLabel>
          <FormDescription>
            A higher creativity typically makes the output of the agent more
            diverse and creative.<br />We recommend a value between 0.7 and 0.9
          </FormDescription>
          <FormControl>
            <div clasS=" max-w-sm">
              <Slider
                v-bind="componentField"
                :default-value="[80]"
                :max="100"
                :step="1"
                class="slider"
              />
            </div>
          </FormControl>
          <FormMessage />
          <FormDescription>
            {{ value[0] / 100 }}
          </FormDescription>
        </FormItem>
      </FormField>
    </template>
  </TabSidebar>
</template>
