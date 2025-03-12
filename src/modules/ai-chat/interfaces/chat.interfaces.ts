import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { Assistant } from '@/modules/assistant/interfaces/assistant.interfaces';

export type InputChatId = string | null | undefined;

export interface Chat {
  id: string;
  title: string;
  assistant?: Assistant;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface VisionImageUrlContent {
  type: string;
  url: string;
}

export type ChatMessageVisionContent = VisionImageUrlContent;

export interface ChatMessage {
  type: 'text' | 'image';
  role: 'user' | 'assistant';
  content: string;
  visionContent?: ChatMessageVisionContent[];
}

export interface ChatsPaginatedResponse {
  chats: Chat[];
  meta: PaginateMeta;
}

export interface ChatResponse {
  chat: Chat;
}

export interface CreateChatMessagePayload {
  chatId: InputChatId;
  message: ChatMessage;
}

export interface CreateChatMessageStreamPayload {
  chatId: InputChatId;
  type: ChatMessage['type'];
  content: ChatMessage['content'];
  visionContent?: ChatMessage['visionContent'];
  model?: string;
  provider?: string;
}

export interface CreateChatStreamPayload {
  chatId: InputChatId;
  chatMessages: ChatMessage[];
  provider: string;
  model: string;
  reasoningEffort?: number;
  maxTokens?: number;
  temperature?: number;
}
