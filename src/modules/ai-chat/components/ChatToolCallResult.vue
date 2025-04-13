<script setup lang="ts">
import ChatMessageBoxWrapper from '@/modules/ai-chat/components/ChatMessageBoxWrapper.vue';
import { ChevronDownIcon } from 'lucide-vue-next';

// Props
interface ChatToolCallProps {
  displayName?: string;
  content: any;
}
const props = defineProps<ChatToolCallProps>();

// Emits
// Refs
const showDetails = ref(false);

// Composables
const { t } = useI18n();

// Computed
const toolCallDisplayName = computed(() => {
  return `Tool Call - ${props.displayName ?? 'Agent'}`;
});
const toolCalls = computed(() => {
  return (
    props.content
      // map the tool calls to a new object
      .map((toolCall: any) => {
        return {
          toolCallId: toolCall?.toolCallId ?? '',
          toolName: toolCall?.toolName ?? 'Unknown Tool',
          toolArgs: toolCall?.args ? getKeyValue(toolCall?.args) : [],
          toolResults: toolCall?.result ? getKeyValue(toolCall?.result) : [],
        };
      })
  );
});

// Functions
function getKeyValue(obj: any): string[] {
  if (!obj) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.map(item => {
      return item;
    });
  }
  if (typeof obj === 'string') {
    // try to parse the string as JSON
    try {
      const parsedObj = JSON.parse(obj);
      return getKeyValue(parsedObj);
    } catch (e) {
      // if parsing fails, return the string as is
      return [obj];
    }
  }
  const objEntries = Object.entries(obj)
    // filter keys "to" and "from"
    .filter(([key]) => key !== 'to' && key !== 'from')
    .map(([key, value]) => {
      // check if value is an object
      if (typeof value === 'object' && value !== null) {
        // if it is an object, return the key and the stringified value
        return `${key}: ${JSON.stringify(value)}`;
      }
      return `${value}`;
    });
  return objEntries;
}

const toggleDetails = (e: MouseEvent) => {
  e.preventDefault();
  showDetails.value = !showDetails.value;
};

const toolDisplayNames = {
  searchWeb: t('tool.websearch.label'),
  think: t('tool.think.label'),
  texteditor: t('tool.texteditor.label'),
  webscraper: t('tool.webscraper.label'),
  knowledge: t('tool.knowledge.label'),
};

const getToolDisplayName = ({ rawName }: { rawName: string }) => {
  return toolDisplayNames[rawName as keyof typeof toolDisplayNames] ?? rawName;
};

// Hooks
</script>

<template>
  <ChatMessageBoxWrapper
    :display-name="toolCallDisplayName"
    role="assistant"
    class="pb-0 overflow-x-scroll"
  >
    <div v-for="(call, index) in toolCalls" :key="index" class="">
      <div
        class="border border-sky-100 shadow-sm mb-2 p-2 rounded-lg px-4 flex items-center space-x-2 cursor-pointer bg-sky-100"
        @click="toggleDetails"
      >
        <div>{{ getToolDisplayName({ rawName: call.toolName }) }}</div>
        <div>
          <ChevronDownIcon class="size-4 stroke-1.5" :class="{ 'rotate-180': showDetails }" />
        </div>
      </div>
      <ul class="pr-14 !ml-5" v-if="showDetails">
        <li class="flex">
          <div class="whitespace-nowrap min-w-14"><strong>Agent:</strong></div>
          <div class="">
            <div v-for="(args, index) in call.toolArgs" :key="index" class="">
              <p class="whitespace-pre-line">{{ args }}</p>
            </div>
          </div>
        </li>

        <li class="flex" v-if="call.toolName !== 'think'">
          <div class="whitespace-nowrap min-w-14"><strong>Tool:</strong></div>
          <div class="">
            <div class="" v-for="(result, index) in call.toolResults" :key="index">
              <p class="whitespace-pre-line">{{ result }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </ChatMessageBoxWrapper>
</template>
