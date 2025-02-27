import { defineStore } from 'pinia';

const chatStoreName = 'chat-settings';

export const groupByOptions = ['day', 'month', 'year'] as const;
export type GroupByOption = (typeof groupByOptions)[number];
export const thinkLevel = [0, 1, 2, 3] as const;
export type ThinkLevel = (typeof thinkLevel)[number];

interface IChatSettings {
  thinkLevel: [ThinkLevel];
  temperature: [number];
  presencePenalty: [number];
  maxTokens: [number];
  submitOnEnter: boolean;
  historyGroupBy: GroupByOption;
}

export const useChatSettingsStore = defineStore(chatStoreName, {
  state: (): IChatSettings => ({
    thinkLevel: [0],
    temperature: [80],
    presencePenalty: [0],
    maxTokens: [4000],
    submitOnEnter: true,
    historyGroupBy: 'day',
  }),
  getters: {
    getThinkLevel(state): ThinkLevel {
      return state.thinkLevel[0];
    },
    getThinkLevelLabel(state): string {
      return [
        'chat.settings.think.off',
        'chat.settings.think.low',
        'chat.settings.think.medium',
        'chat.settings.think.high',
      ][state.thinkLevel[0]];
    },
    getTemperature(state) {
      return state.temperature[0] / 100;
    },
    getPresencePenalty(state) {
      return state.presencePenalty[0] / 100;
    },
    getMaxTokens(state) {
      return state.maxTokens[0];
    },
    getHistoryGroupBy(state) {
      return state.historyGroupBy;
    },
  },
  actions: {
    setThinkLevel(thinkingLevel: [ThinkLevel]) {
      // validate
      if (!thinkingLevel) {
        return;
      }
      if (thinkingLevel[0] < 0 || thinkingLevel[0] > 3) {
        return;
      }
      this.thinkLevel = thinkingLevel;
    },
    setTemperature(temperature: [number]) {
      this.temperature = temperature;
    },
    setPresencePenalty(presencePenalty: [number]) {
      this.presencePenalty = presencePenalty;
    },
    setMaxTokens(maxTokens: [number]) {
      this.maxTokens = maxTokens;
    },
    setHistoryGroupBy(groupBy: GroupByOption) {
      this.historyGroupBy = groupBy;
    },
    resetSettings() {
      this.thinkLevel = [0];
      this.temperature = [80];
      this.presencePenalty = [0];
      this.maxTokens = [4000];
    },
  },
  persist: true,
});
