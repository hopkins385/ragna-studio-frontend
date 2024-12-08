<script setup lang="ts">
import { useToolIcons } from '@/composables/useToolIcons';
import ButtonLoading from '@components/button/ButtonLoading.vue';
import CollectionSelectModal from '@components/collection/CollectionSelectModal.vue';
import LlmSelectModal from '@components/llm/LlmSelectModal.vue';
import TabSidebar from '@components/tab/TabSidebar.vue';
import type { Assistant } from '@composables/services/useAssistantService';
import useAssistantService from '@composables/services/useAssistantService';
import type { AssistantTool } from '@composables/services/useAssistantToolsService';
import useCollectionAbleService from '@composables/services/useCollectionAbleService';
import type { Collection } from '@composables/services/useCollectionService';
import useToast from '@composables/useToast';
import { assistantFormSchema } from '@schemas/assistant.form';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@ui/button';
import Checkbox from '@ui/checkbox/Checkbox.vue';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { Slider } from '@ui/slider';
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

const { handleSubmit } = useForm({
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
    throw new Error('Agent not found');
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

// tool icons
const { getToolIcon } = useToolIcons();
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
      { id: 'tab2', icon: Stars, label: 'Generative Ai' },
      { id: 'tab3', icon: CircleUserRound, label: 'Behavior' },
      { id: 'tab4', icon: Book, label: 'Knowledge' },
      { id: 'tab5', icon: BriefcaseBusiness, label: 'Capabilities' },
      { id: 'tab6', icon: Workflow, label: 'Workflow' },
      { id: 'tab7', icon: ShieldCheck, label: 'Privacy' },
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
            <FormLabel> Behavior </FormLabel>
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
            <FormLabel> Tools</FormLabel>
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
            <FormItem
              class="flex flex-row items-center space-x-3 border border-transparent space-y-4 w-fit"
            >
              <FormControl>
                <Checkbox
                  :checked="value?.includes(tool.id)"
                  @update:checked="handleChange"
                />
              </FormControl>
              <FormLabel class="font-normal flex space-x-3">
                <div class="size-8 flex justify-center">
                  <component
                    :is="getToolIcon(tool?.iconName)"
                    class="size-5 stroke-1.5 text-gray-500"
                  />
                </div>
                <div class="space-y-1">
                  <h2 class="text-sm">{{ tool.name }}</h2>
                  <p class="opacity-75 text-xs">{{ tool.description }}</p>
                </div>
              </FormLabel>
            </FormItem>
          </FormField>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <template #tab6>
      <FormField v-slot="{ componentField, value }" name="temperature">
        <FormItem>
          <FormLabel> Workflow </FormLabel>
          <FormDescription>
            Attached Workflow that can be executed by the agent.
          </FormDescription>
          <FormControl>
            <div class="text-sm opacity-75">Feature coming soon</div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <template #tab7>
      <FormField v-slot="{ componentField, value }" name="temperature">
        <FormItem>
          <FormLabel> Data Protection Add-On </FormLabel>
          <FormDescription>
            Removal of Personal Identifiable Information (PII) before the data
            is used by the agent.
          </FormDescription>
          <FormControl>
            <div clasS=" max-w-sm"></div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <template #tab8>
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
                :disabled="true"
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
