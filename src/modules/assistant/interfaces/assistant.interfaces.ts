import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { AssistantTool } from '@/modules/assistant-tool/interfaces/assistant-tool.interfaces';

export interface AssistantLLM {
  provider: string;
  displayName: string;
  apiName: string;
  multiModal: boolean;
  capabilities: {
    imageInput: boolean;
    audioInput: boolean;
    videoInput: boolean;
    textOutput: boolean;
    imageOutput: boolean;
    audioOutput: boolean;
    videoOutput: boolean;
  };
}

export interface Assistant {
  id: string;
  teamId: string;
  llmId: string;
  title: string;
  description: string;
  systemPrompt: string;
  isShared: boolean;
  hasKnowledgeBase: boolean;
  hasWorkflow: boolean;
  systemPromptTokenCount: number;
  tools: AssistantTool[];
  llm: AssistantLLM;
  createdAt: string;
  updatedAt: string;
}

export interface AssistantsPaginatedResponse {
  assistants: Assistant[];
  meta: PaginateMeta;
}

export interface AssistantResponse {
  assistant: Assistant;
}

export interface PaginateParams {
  page: number;
  limit?: number;
  searchQuery?: string;
}

export interface CreateAssistantFromTemplatePayload {
  templateId: string;
  language: 'de' | 'en';
}
