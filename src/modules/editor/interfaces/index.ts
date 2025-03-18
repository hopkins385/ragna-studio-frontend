import type { Component } from 'vue';

export interface PromptCompletionPayload {
  context: string;
  selectedText: string;
  prompt: string;
}

export interface PromptCompletionResponse {
  completion: string;
}

export interface InlineCompletionPayload {}

export interface InlineCompletionResponse {
  inlineCompletion: string;
}

export interface SidebarButton {
  icon: Component;
  action: () => any;
  tooltip?: string;
}
