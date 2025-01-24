<script setup lang="ts">
import { useChatService } from '@/composables/services/useChatService';
import { useToolIcons } from '@/composables/useToolIcons';
import { RouteName } from '@/router/enums/route-names.enum';
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

interface Props {
  assistant: Assistant;
  assistantTools: AssistantTool[];
  collections: Collection[];
}

interface Emits {
  refreshCollections: [void];
  refreshAssistant: [void];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const currentTab = ref('tab1');
const updateIsLoading = ref(false);
const newChatIsLoading = ref(false);

const initialAssistantName = computed(
  () => props.assistant?.llm.displayName ?? 'Select AI Model',
);

// TODO: why is the first collection the one that is selected?
const firstCollection = computed(
  () => props.collections?.[0] ?? { id: '-1', name: '+ Add Knowledge' },
);

const { t } = useI18n();
const { getToolIcon } = useToolIcons();
const { updateAssistant, updateHasKnowledgeBase } = useAssistantService();
const { createChat } = useChatService();

// form
const { handleSubmit, meta: formMeta } = useForm({
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

  updateIsLoading.value = true;

  try {
    await updateAssistant(props.assistant.id, {
      ...values,
    });
    toast.success({
      description: t('assistant.edit.success'),
    });
    formMeta.value.dirty = false;
  } catch (error: any) {
    console.error(error);
    toast.error({
      description: t('assistant.edit.error'),
    });
  } finally {
    updateIsLoading.value = false;
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
  // update assistant has collections
  await updateHasKnowledgeBase(props.assistant.id, true);
  emit('refreshCollections');
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
  // update assistant does not has collections
  await updateHasKnowledgeBase(props.assistant.id, false);
  emit('refreshCollections');
  toast.success({
    description: 'Collection updated successfully',
  });
}

const canLeavePage = () => {
  if (formMeta.value.dirty) {
    if (!window.confirm(t('confirm.dirty_form.description'))) {
      return false;
    }
  }
  return true;
};

const onStartChat = async () => {
  if (!canLeavePage()) {
    return;
  }

  newChatIsLoading.value = true;

  try {
    const { chat } = await createChat(props.assistant.id);
    router.push({
      name: RouteName.CHAT_SHOW,
      params: { id: chat.id },
    });
  } catch (error: any) {
    console.error(error);
    toast.error({
      description: t('assistant.new_chat.error'),
    });
  } finally {
    newChatIsLoading.value = false;
  }
};

// onBeforeRouteLeave
onBeforeRouteLeave(canLeavePage);

const siderBarTabs = [
  { id: 'tab1', icon: Settings, label: t('assistant.settings.label') },
  { id: 'tab2', icon: Stars, label: t('assistant.genai.label') },
  { id: 'tab3', icon: CircleUserRound, label: t('assistant.behavior.label') },
  { id: 'tab5', icon: BriefcaseBusiness, label: t('assistant.tools.label') },
  { id: 'tab4', icon: Book, label: t('assistant.knowledge.label') },
  { id: 'tab6', icon: Workflow, label: t('assistant.workflow.label') },
  { id: 'tab7', icon: ShieldCheck, label: t('assistant.privacy.label') },
];
</script>

<template>
  <div class="w-full flex justify-end">
    <div class="flex items-center space-x-4">
      <Button @click="$router.back()" variant="secondary">
        {{ $t('form.button.back') }}
      </Button>
      <ButtonLoading
        :loading="newChatIsLoading"
        @click="onStartChat"
        variant="outline"
      >
        {{ $t('assistant.button.new_chat') }}
      </ButtonLoading>
      <ButtonLoading :loading="updateIsLoading" @click="onSubmit">
        {{ $t('form.button.save') }}
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
            <FormLabel>{{ $t('assistant.form.description_label') }}</FormLabel>
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
      <FormField v-slot="{ handleChange }" name="llmId">
        <FormItem>
          <FormLabel>{{ $t('assistant.genai.label') }}</FormLabel>
          <FormControl>
            <LlmSelectModal
              :current-llm-id="props.assistant.llm.id"
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
    <!-- TAB 4 -->
    <template #tab4>
      <FormField v-slot="{ handleChange }" name="collectionId">
        <FormItem>
          <FormLabel>{{ $t('assistant.knowledge.label') }}</FormLabel>
          <FormDescription>
            {{ $t('assistant.knowledge.description') }}
          </FormDescription>
          <FormControl>
            <CollectionSelectModal
              :id="firstCollection.id"
              :initial-display-name="firstCollection.name"
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
    <!-- TAB 5 -->
    <template #tab5>
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
    <!-- TAB 6 -->
    <template #tab6>
      <FormField v-slot="{ componentField, value }" name="temperature">
        <FormItem>
          <FormLabel>{{ $t('assistant.workflow.label') }}</FormLabel>
          <FormDescription>
            {{ $t('assistant.workflow.description') }}
          </FormDescription>
          <FormControl>
            <div class="text-sm border px-5 py-3 w-fit">Under Construction</div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <!-- TAB 7 -->
    <template #tab7>
      <FormField v-slot="{ componentField, value }" name="temperature">
        <FormItem>
          <FormLabel>{{ $t('assistant.privacy.label') }}</FormLabel>
          <FormDescription>
            {{ $t('assistant.privacy.description') }}
          </FormDescription>
          <FormControl>
            <div class="text-sm border px-5 py-3 w-fit">Under Construction</div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </template>
    <!-- TAB 8 -->
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
