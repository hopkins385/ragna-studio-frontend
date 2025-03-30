<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import { Checkbox } from '@components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import type { AssistantTool } from '@hopkins385/ragna-sdk';

const client = useRagnaClient();

const tools = ref<AssistantTool[]>([]);
const status = ref('idle');

const getTools = async () => {
  status.value = 'pending';
  try {
    const { tools: theTools } = await client.assistantTool.fetchAllTools();
    tools.value = theTools;
    status.value = 'success';
  } catch (error) {
    console.error(error);
    status.value = 'error';
  }
};

onMounted(async () => await getTools());
</script>

<template>
  <FormField name="tools">
    <FormItem>
      <div class="mb-4 space-y-2">
        <FormLabel> Functions (optional)</FormLabel>
        <FormDescription> These are the functions the assistant can use. </FormDescription>
      </div>

      <span class="text-sm">{{ status === 'pending' ? 'Loading...' : '' }}</span>
      <span class="text-sm">{{ status === 'error' ? 'Failed to load tools' : '' }}</span>

      <FormField
        v-for="item in tools"
        v-slot="{ value, handleChange }"
        :key="item.id"
        type="checkbox"
        :value="item.id"
        :unchecked-value="false"
        name="tools"
      >
        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox :checked="value?.includes(item.id)" @update:checked="handleChange" />
          </FormControl>
          <FormLabel class="font-normal"> {{ item.name }} </FormLabel>
        </FormItem>
      </FormField>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
