<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useToolIcons } from '@/modules/assistant-tool/composables/useToolIcons';
import { updateAssistantFormSchema } from '@/modules/assistant/schemas/assistant.form';
import CollectionSelectModal from '@/modules/collection/components/CollectionSelectModal.vue';
import LlmSelectModal from '@/modules/llm/components/LlmSelectModal.vue';
import PromptWizardDialog from '@/modules/prompt-wizard/components/PromptWizardDialog.vue';
import { RouteName } from '@/router/enums/route-names.enum';
import TabSidebar from '@components/tab/TabSidebar.vue';
import useToast from '@composables/useToast';
import type { Assistant, AssistantTool, Collection } from '@hopkins385/ragna-sdk';
import { Button } from '@ui/button';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
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
import { Textarea } from '@ui/textarea';
import {
  Book,
  BriefcaseBusiness,
  CircleUserRound,
  Settings,
  ShieldCheck,
  Stars,
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
const route = useRoute();
const toast = useToast();

const updateIsLoading = ref(false);
const newChatIsLoading = ref(false);

const initialAssistantName = computed(() => props.assistant?.llm.displayName ?? 'Select AI Model');

// TODO: why is the first collection the one that is selected?
const firstCollection = computed(
  () => props.collections?.[0] ?? { id: '-1', name: '+ Add Knowledge' },
);

const client = useRagnaClient();
const { getToolIcon } = useToolIcons();

// form
const {
  handleSubmit,
  meta: formMeta,
  errors: formErrors,
} = useForm({
  validationSchema: updateAssistantFormSchema,
  initialValues: {
    llmId: props.assistant?.llm.id || '',
    title: props.assistant?.title || '',
    description: props.assistant?.description || '',
    systemPrompt: props.assistant?.systemPrompt || '',
    // temperature: [80], // props.assistant?.temperature ||
    isShared: props.assistant?.isShared || false,
    tools: props.assistant?.tools.map((tool: AssistantTool) => tool?.toolId) || [],
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
  if (!props.assistant) {
    throw new Error('Agent not found');
  }

  updateIsLoading.value = true;

  try {
    await client.assistant.updateAssistant(props.assistant.id, {
      llmId: values.llmId,
      title: values.title,
      description: values.description,
      systemPrompt: values.systemPrompt,
      isShared: values.isShared,
      hasKnowledgeBase: values.hasKnowledgeBase,
      hasWorkflow: values.hasWorkflow,
      tools: values.tools,
      // temperature: values.temperature[0],
    });
    toast.success({
      description: 'assistant.edit.success',
    });
    formMeta.value.dirty = false;
  } catch (error: any) {
    console.error(error);
    toast.error({
      description: 'assistant.edit.error',
    });
  } finally {
    updateIsLoading.value = false;
  }
});

// collections
async function updateCollection(collectionId: string) {
  const model = {
    type: 'assistant',
    id: props.assistant.id,
  };
  await client.collectionAble.replaceCollectionTo(collectionId, { model });
  // update assistant has collections
  await client.assistant.updateHasKnowledgeBase(props.assistant.id, true);
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
  await client.collectionAble.detachAllCollectionsFrom({ model });
  // update assistant does not has collections
  await client.assistant.updateHasKnowledgeBase(props.assistant.id, false);
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
    const { chat } = await client.aiChat.createChat({ assistantId: props.assistant.id });
    router.push({
      name: RouteName.CHAT_SHOW,
      params: { id: chat.id },
    });
  } catch (error: any) {
    console.error(error);
    toast.error({
      description: 'assistant.new_chat.error',
    });
  } finally {
    newChatIsLoading.value = false;
  }
};

const { t } = useI18n();
const siderBarTabs = [
  { id: 'title', icon: Settings, label: t('assistant.settings.label') },
  { id: 'systemPrompt', icon: CircleUserRound, label: t('assistant.behavior.label') },
  { id: 'llmId', icon: Stars, label: t('assistant.genai.label') },
  { id: 'tools', icon: BriefcaseBusiness, label: t('assistant.tools.label') },
  { id: 'knowledge', icon: Book, label: t('assistant.knowledge.label') },
  { id: 'privacy', icon: ShieldCheck, label: t('assistant.privacy.label') },
];

// Current tab and query parameter
const queryTab = computed(() => {
  const tab = route.query.tab?.toString();
  if (tab && siderBarTabs.some(t => t.id === tab)) {
    return tab;
  }
  return 'title';
});
const currentTab = ref(queryTab.value);

watch(currentTab, (newTab: string) => {
  router.replace({
    query: { ...route.query, tab: newTab },
  });
});

// onBeforeRouteLeave
onBeforeRouteLeave(canLeavePage);

onBeforeUnmount(() => {
  client.assistant.abortRequest();
});
</script>

<template>
  <div>
    <div class="w-full flex justify-end pb-2 -mt-3">
      <div class="flex items-center space-x-4">
        <Button @click="$router.back()" variant="secondary">
          {{ $t('form.button.back') }}
        </Button>
        <ButtonLoading :loading="newChatIsLoading" @click="onStartChat" variant="outline">
          {{ $t('assistant.button.new_chat') }}
        </ButtonLoading>
        <ButtonLoading :loading="updateIsLoading" @click="onSubmit" type="submit">
          {{ $t('form.button.save') }}
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
      <template #llmId>
        <FormField v-slot="{ handleChange }" name="llmId">
          <FormItem>
            <FormLabel>{{ $t('assistant.genai.label') }}</FormLabel>
            <FormControl>
              <LlmSelectModal
                :initial-display-name="initialAssistantName"
                :current-llm-id="props.assistant?.llm.id"
                @update:id="handleChange"
              />
              <!--
            <div class="flex items-center space-x-3">
              <LlmProviderBox
                v-for="provider in supportedProviders"
                :key="provider.name"
                :provider-name="provider.name"
                :host-region="provider.region"
                :infos="provider.infos"
                :selected="props.assistant?.llm.provider.name === provider.name"
                @click="() => handleChange(provider.name)"
              />
            </div>
            -->
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </template>
      <!-- TAB 3-->
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
      <!-- TAB 4 -->
      <template #knowledge>
        <FormField v-slot="{ handleChange }" name="knowledge">
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
      <!-- TAB 7 -->
      <template #privacy>
        <FormField name="privacy">
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
    </TabSidebar>
  </div>
</template>
