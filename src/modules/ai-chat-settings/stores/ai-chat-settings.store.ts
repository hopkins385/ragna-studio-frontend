import type {
  GroupByOption,
  MaxTokens,
  PresencePenalty,
  Temperature,
  ThinkLevel,
} from '@/modules/ai-chat-settings/types/ai-chat-settings.type';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const groupByOptions = ['day', 'month', 'year'] as const;
export const thinkLevel = [0, 1, 2, 3] as const;

const defaultSettings = {
  thinkLevel: [0],
  temperature: [80],
  presencePenalty: [0],
  maxTokens: [4000],
  submitOnEnter: true,
  includeToolCalls: true,
  privacyNerActive: false,
  historyGroupBy: 'day',
};

export const useAiChatSettingsStore = defineStore(
  'ai-chat-settings',
  () => {
    //
    const selectedAssistantId = ref<string | undefined>(undefined);
    // Individual refs for each state property
    const thinkLevel = ref<ThinkLevel>(defaultSettings.thinkLevel);
    const temperature = ref<Temperature>(defaultSettings.temperature);
    const presencePenalty = ref<PresencePenalty>(defaultSettings.presencePenalty);
    const maxTokens = ref<MaxTokens>(defaultSettings.maxTokens);
    const submitOnEnter = ref(defaultSettings.submitOnEnter);
    const includeToolCalls = ref(defaultSettings.includeToolCalls);
    const privacyNerActive = ref(defaultSettings.privacyNerActive);
    const historyGroupBy = ref<GroupByOption>(defaultSettings.historyGroupBy as GroupByOption);

    // Getters as computed
    const hasSelectedAssistant = computed(() => !!selectedAssistantId.value);
    const getThinkLevel = computed(() => thinkLevel.value?.[0] || 0);
    const getThinkLevelLabel = computed(
      () =>
        [
          'chat.settings.think.off',
          'chat.settings.think.low',
          'chat.settings.think.medium',
          'chat.settings.think.high',
        ][thinkLevel.value?.[0] || 0],
    );
    const getTemperature = computed(
      () => (temperature.value?.[0] ?? defaultSettings.temperature[0]) / 20,
    );
    const getPresencePenalty = computed(
      () => presencePenalty.value?.[0] ?? defaultSettings.presencePenalty[0],
    );
    const getMaxTokens = computed(() => maxTokens.value?.[0] ?? defaultSettings.maxTokens[0]);
    const getHistoryGroupBy = computed(() => historyGroupBy.value);
    const getSubmitOnEnter = computed(() => submitOnEnter.value);
    const getPrivacyNerActive = computed(() => privacyNerActive.value);
    const hideToolCalls = computed(() => !includeToolCalls.value);

    // Actions as functions
    function setThinkLevel(thinkingLevel: ThinkLevel) {
      if (!thinkingLevel || thinkingLevel[0] < 0 || thinkingLevel[0] > 3) {
        return;
      }
      thinkLevel.value = thinkingLevel;
    }

    function setTemperature(temp: [number]) {
      temperature.value = temp.map(t => Number(t));
    }

    function setPresencePenalty(penalty: [number]) {
      presencePenalty.value = penalty.map(t => Number(t));
    }

    function setMaxTokens(tokens: [number]) {
      maxTokens.value = tokens.map(t => Number(t));
    }

    function setHistoryGroupBy(groupBy: GroupByOption) {
      historyGroupBy.value = groupBy;
    }

    function resetSettings() {
      thinkLevel.value = defaultSettings.thinkLevel;
      temperature.value = defaultSettings.temperature;
      presencePenalty.value = defaultSettings.presencePenalty;
      maxTokens.value = defaultSettings.maxTokens;
      submitOnEnter.value = defaultSettings.submitOnEnter;
      historyGroupBy.value = defaultSettings.historyGroupBy as GroupByOption;
      includeToolCalls.value = defaultSettings.includeToolCalls;
    }

    return {
      hasSelectedAssistant,
      selectedAssistantId,
      // State
      thinkLevel,
      temperature,
      presencePenalty,
      maxTokens,
      submitOnEnter,
      historyGroupBy,
      includeToolCalls,
      privacyNerActive,
      // Getters
      getThinkLevel,
      getThinkLevelLabel,
      getTemperature,
      getPresencePenalty,
      getMaxTokens,
      getHistoryGroupBy,
      getSubmitOnEnter,
      getPrivacyNerActive,
      hideToolCalls,
      // Actions
      setThinkLevel,
      setTemperature,
      setPresencePenalty,
      setMaxTokens,
      setHistoryGroupBy,
      resetSettings,
    };
  },
  {
    persist: true,
  },
);
