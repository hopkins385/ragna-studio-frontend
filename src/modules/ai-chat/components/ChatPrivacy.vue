<script setup lang="ts">
import QuestionToolTip from '@/components/question/QuestionToolTip.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import { Switch } from '@/components/ui/switch';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import Button from '@ui/button/Button.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { RotateCcwIcon, ShieldCheckIcon, ShieldIcon } from 'lucide-vue-next';

// Props
// Emits

// Refs

// Composables
const settings = useAiChatSettingsStore();

// Computed
// Functions

// Hooks
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        class="group"
        :class="{
          'border-blue-300': settings.privacyNerActive,
        }"
      >
        <ShieldCheckIcon v-if="settings.privacyNerActive" class="size-4 text-blue-600" />
        <ShieldIcon v-else class="size-4 text-primary/60" />
      </Button>
    </PopoverTrigger>

    <PopoverContent align="end" class="mt-1 w-60 text-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <ShieldIcon class="size-4 text-primary/60" />
          {{ $t('chat.settings.privacy.title') }}
        </div>
        <button>
          <RotateCcwIcon class="size-3 opacity-60" />
        </button>
      </div>
      <Separator class="my-3" />
      <div class="flex flex-col gap-2">
        <!-- Privacy Switch -->
        <div class="flex flex-col">
          <div>
            {{ $t('chat.settings.privacy.label') }}
            <QuestionToolTip
              :title="$t('chat.settings.privacy.label')"
              :content="$t('chat.settings.privacy.description')"
            />
          </div>
          <Switch
            class="-ml-2 mt-1 scale-75"
            :checked="settings.privacyNerActive"
            @update:checked="val => (settings.privacyNerActive = val)"
          />
        </div>
        <!-- Confirmation Switch -->
        <!--
        <div class="flex flex-col">
          <div>
            {{ $t('chat.settings.privacy_confirm.label') }}
            <QuestionToolTip
              :title="$t('chat.settings.privacy_confirm.label')"
              :content="$t('chat.settings.privacy_confirm.description')"
            />
          </div>
          <Switch
            class="-ml-2 mt-1 scale-75"
            :checked="settings.privacyNerActive"
            @update:checked="val => (settings.privacyNerActive = val)"
          />
        </div>
        -->
      </div>
    </PopoverContent>
  </Popover>
</template>
