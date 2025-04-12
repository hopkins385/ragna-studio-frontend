<script setup lang="ts">
/**
 * Component: ChatSettings
 */
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { RouteName } from '@/router/enums/route-names.enum';
import QuestionToolTip from '@components/question/QuestionToolTip.vue';
import { Button } from '@ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { Separator } from '@ui/separator';
import { Slider } from '@ui/slider';
import { Switch } from '@ui/switch';
import { RotateCcwIcon, SlidersHorizontalIcon } from 'lucide-vue-next';

interface ChatSettingsProps {
  assistantId?: string | null;
}

interface ChatSettingsEmits {
  resetChat: [void];
}

const props = defineProps<ChatSettingsProps>();
const emit = defineEmits<ChatSettingsEmits>();

const router = useRouter();

const show = ref(false);
const settings = useAiChatSettingsStore();

const hasPresencePenaltySetting = false;
const hasMaxTokensSetting = false;

function onEditAssistantClick() {
  if (!props.assistantId) return;
  router.push({
    name: RouteName.ASSISTANT_EDIT,
    params: { id: props.assistantId },
    query: { tab: 'systemPrompt' },
  });
}
</script>

<template>
  <Popover v-model:open="show">
    <PopoverTrigger as-child>
      <Button variant="outline" size="icon" class="group">
        <SlidersHorizontalIcon class="size-4 stroke-1.5 text-primary/70 group-hover:stroke-2" />
      </Button>
    </PopoverTrigger>

    <PopoverContent align="end" class="mt-1 w-60 text-sm">
      <div class="flex items-center justify-between">
        <span>{{ $t('chat.settings.title') }}</span>
        <button @click="settings.resetSettings()">
          <RotateCcwIcon class="size-3 opacity-60" />
        </button>
      </div>
      <Separator class="my-3" />
      <!-- chat model selector -->
      <!--
      <div
        class="pointer-events-auto flex items-center space-x-4 text-muted-foreground"
      >
        <ChatModelSelector />
      </div>
      <Separator class="my-3" />
      -->
      <Button variant="outline" size="sm" class="w-full" @click="onEditAssistantClick">
        {{ $t('chat.settings.button.edit_assistant') }}
      </Button>
      <Separator class="my-3" />
      <Button
        variant="outline"
        size="sm"
        class="w-full hover:text-destructive"
        @click="() => emit('resetChat')"
      >
        {{ $t('chat.settings.button.reset_chat') }}
      </Button>
      <Separator class="my-3" />
      <div class="my-5 flex flex-col space-y-4">
        <div class="flex w-full justify-between">
          <div>
            {{ $t('chat.settings.think.title') }}
            <QuestionToolTip
              :title="$t('chat.settings.think.title')"
              :content="$t('chat.settings.think.description')"
            />
          </div>
          <div>{{ $t(settings.getThinkLevelLabel) }}</div>
        </div>
        <Slider
          v-model="settings.thinkLevel"
          :default-value="[0]"
          :max="3"
          :step="1"
          class="slider"
        />
      </div>
      <div class="my-5 flex flex-col space-y-4">
        <div class="flex w-full justify-between">
          <div>
            {{ $t('chat.settings.temperature.title') }}
            <QuestionToolTip
              :title="$t('chat.settings.temperature.title')"
              :content="$t('chat.settings.temperature.description')"
            />
          </div>
          <div>{{ settings.getTemperature }}</div>
        </div>
        <Slider
          v-model="settings.temperature"
          :default-value="[80]"
          :max="200"
          :step="10"
          class="slider"
        />
      </div>
      <div class="flex flex-col">
        <div>
          {{ $t('chat.settings.include_tool_call.title') }}
          <QuestionToolTip
            :title="$t('chat.settings.include_tool_call.title')"
            :content="$t('chat.settings.include_tool_call.description')"
          />
        </div>
        <Switch
          class="-ml-2 mt-1 scale-75"
          :checked="settings.includeToolCalls"
          @update:checked="val => (settings.includeToolCalls = val)"
        />
      </div>

      <div class="flex flex-col">
        <div>
          {{ $t('chat.settings.on_enter_submit.title') }}
          <QuestionToolTip
            :title="$t('chat.settings.on_enter_submit.title')"
            :content="$t('chat.settings.on_enter_submit.description')"
          />
        </div>
        <Switch
          class="-ml-2 mt-1 scale-75"
          :checked="settings.submitOnEnter"
          @update:checked="val => (settings.submitOnEnter = val)"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>

<style>
.slider {
  @apply [&_[role=slider]]:size-4 [&_[role=slider]]:border [&_[role=slider]]:hover:cursor-grab [&_[role=slider]]:active:cursor-grabbing;
}
</style>
