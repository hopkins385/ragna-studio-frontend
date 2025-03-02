import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const chatStoreName = 'chat-settings';

export const groupByOptions = ['day', 'month', 'year'] as const;
export const thinkLevel = [0, 1, 2, 3] as const;
export type GroupByOption = string | undefined;
export type ThinkLevel = number[] | undefined;
export type Temperature = number[] | undefined;
export type PresencePenalty = number[] | undefined;
export type MaxTokens = number[] | undefined;

const defaultSettings = {
  thinkLevel: [0],
  temperature: [80],
  presencePenalty: [0],
  maxTokens: [4000],
  submitOnEnter: true,
  historyGroupBy: 'day',
};

export const useChatSettingsStore = defineStore(
  chatStoreName,
  () => {
    // Individual refs for each state property
    const thinkLevel = ref<ThinkLevel>(defaultSettings.thinkLevel);
    const temperature = ref<Temperature>(defaultSettings.temperature);
    const presencePenalty = ref<PresencePenalty>(defaultSettings.presencePenalty);
    const maxTokens = ref<MaxTokens>(defaultSettings.maxTokens);
    const submitOnEnter = ref(defaultSettings.submitOnEnter);
    const historyGroupBy = ref<GroupByOption>(defaultSettings.historyGroupBy);

    // Getters as computed
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
      () => (temperature.value?.[0] ?? defaultSettings.temperature[0]) / 100,
    );
    const getPresencePenalty = computed(
      () => presencePenalty.value?.[0] ?? defaultSettings.presencePenalty[0],
    );
    const getMaxTokens = computed(() => maxTokens.value?.[0] ?? defaultSettings.maxTokens[0]);
    const getHistoryGroupBy = computed(() => historyGroupBy.value);

    // Actions as functions
    function setThinkLevel(thinkingLevel: ThinkLevel) {
      if (!thinkingLevel || thinkingLevel[0] < 0 || thinkingLevel[0] > 3) {
        return;
      }
      thinkLevel.value = thinkingLevel;
    }

    function setTemperature(temp: [number]) {
      temperature.value = temp;
    }

    function setPresencePenalty(penalty: [number]) {
      presencePenalty.value = penalty;
    }

    function setMaxTokens(tokens: [number]) {
      maxTokens.value = tokens;
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
      historyGroupBy.value = defaultSettings.historyGroupBy;
    }

    return {
      // State
      thinkLevel,
      temperature,
      presencePenalty,
      maxTokens,
      submitOnEnter,
      historyGroupBy,
      // Getters
      getThinkLevel,
      getThinkLevelLabel,
      getTemperature,
      getPresencePenalty,
      getMaxTokens,
      getHistoryGroupBy,
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
    persist: false,
  },
);
