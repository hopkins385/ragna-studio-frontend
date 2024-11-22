<script setup lang="ts">
import useAssistantService, {
  type Assistant,
} from '@composables/services/useAssistantService';
import { type AssistantTool } from '@composables/services/useAssistantToolsService';
import useToast from '@composables/useToast';
import { assistantFormSchema } from '@/schemas/assistant.form';
import { useAuthStore } from '@stores/auth.store';
import { useForm } from 'vee-validate';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import LlmSelectModal from '../llm/LlmSelectModal.vue';
import type { Collection } from '@/composables/services/useCollectionService';
import useCollectionAbleService from '@/composables/services/useCollectionAbleService';
import CollectionSelectModal from '../collection/CollectionSelectModal.vue';

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
const router = useRouter();

const { replaceCollectionTo, detachAllCollectionsFrom } =
  useCollectionAbleService();

const initialAssistantName = computed(
  () => props.assistant?.llm.displayName ?? 'Select AI Model',
);

const initialCollectionName = computed(
  () => props.collections?.[0]?.name ?? 'Select Knowledge Collection',
);

const { updateAssistant } = useAssistantService();

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
const { errors, handleSubmit, isSubmitting, isValidating } = useForm({
  validationSchema: assistantFormSchema,
  initialValues: {
    teamId: authStore.user?.teams[0].team.id || '-1',
    llmId: props.assistant?.llm.id || '',
    title: props.assistant?.title || '',
    description: props.assistant?.description || '',
    systemPrompt: props.assistant?.systemPrompt || '',
    isShared: props.assistant?.isShared || false,
    tools: props.assistant?.tools.map(tool => tool?.toolId) || [],
  },
});

const onSubmit = handleSubmit(async values => {
  if (!props.assistant) {
    throw new Error('Assistant not found');
  }
  try {
    await updateAssistant(props.assistant.id, {
      ...values,
      systemPromptTokenCount: 1, // TODO: calculate token count
    });
    toast.success({
      description: 'Assistant updated successfully',
    });
    router.back();
  } catch (error: any) {
    toast.error({
      description: 'Failed to update assistant',
    });
  }
});
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel> Title </FormLabel>
        <FormDescription>
          This is the title of the assistant that will be displayed to the user.
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
          This is the description of the assistant that will be displayed to the
          user.
        </FormDescription>
        <FormControl>
          <Input
            type="text"
            placeholder="A very short description"
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
            :initial-display-name="initialAssistantName"
            @update:id="handleChange"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="systemPrompt">
      <FormItem>
        <FormLabel> assistant.form.systemPrompt.label </FormLabel>
        <FormDescription>
          assistant.form.systemPrompt.description
        </FormDescription>
        <FormControl>
          <Textarea v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

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

    <FormField v-slot="{ handleChange, value }" type="checkbox" name="isShared">
      <FormItem>
        <FormLabel>Shared</FormLabel>
        <FormDescription>
          If the assistant is shared, it is available to your whole
          organization. If unshared then it is only available to your team.
        </FormDescription>
        <FormControl>
          <Switch :checked="value" @update:checked="handleChange" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">Update Assistant</Button>
  </form>
</template>
