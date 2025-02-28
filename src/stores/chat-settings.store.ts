import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const chatStoreName = 'chat-settings';

export const groupByOptions = ['day', 'month', 'year'] as const;
export type GroupByOption = (typeof groupByOptions)[number];
export const thinkLevel = [0, 1, 2, 3] as const;
export type ThinkLevel = (typeof thinkLevel)[number];

export const useChatSettingsStore = defineStore(
  chatStoreName,
  () => {
    // Individual refs for each state property
    const thinkLevel = ref<[ThinkLevel]>([0]);
    const temperature = ref<[number]>([80]);
    const presencePenalty = ref<[number]>([0]);
    const maxTokens = ref<[number]>([4000]);
    const submitOnEnter = ref(true);
    const historyGroupBy = ref<GroupByOption>('day');

    // Getters as computed
    const getThinkLevel = computed(() => thinkLevel.value[0]);
    const getThinkLevelLabel = computed(
      () =>
        [
          'chat.settings.think.off',
          'chat.settings.think.low',
          'chat.settings.think.medium',
          'chat.settings.think.high',
        ][thinkLevel.value[0]],
    );
    const getTemperature = computed(() => temperature.value[0] / 100);
    const getPresencePenalty = computed(() => presencePenalty.value[0] / 100);
    const getMaxTokens = computed(() => maxTokens.value[0]);
    const getHistoryGroupBy = computed(() => historyGroupBy.value);

    // Actions as functions
    function setThinkLevel(thinkingLevel: [ThinkLevel]) {
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
      thinkLevel.value = [0];
      temperature.value = [80];
      presencePenalty.value = [0];
      maxTokens.value = [4000];
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
    persist: true,
  },
);
