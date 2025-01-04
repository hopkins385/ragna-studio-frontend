import { defineStore } from 'pinia';

export const groupByOptions = ['day', 'month', 'year'] as const;
export type GroupByOption = (typeof groupByOptions)[number];

interface IChatSettings {
  temperature: [number];
  presencePenalty: [number];
  maxTokens: [number];
  submitOnEnter: boolean;
  historyGroupBy: GroupByOption;
}

export const useChatSettingsStore = defineStore('chat-settings', {
  state: (): IChatSettings => ({
    temperature: [80],
    presencePenalty: [0],
    maxTokens: [4000],
    submitOnEnter: true,
    historyGroupBy: 'day',
  }),
  getters: {
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
      this.temperature = [80];
      this.presencePenalty = [0];
      this.maxTokens = [4000];
    },
  },
  persist: true,
});
