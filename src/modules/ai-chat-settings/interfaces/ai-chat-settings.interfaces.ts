import type {
  GroupByOption,
  MaxTokens,
  PresencePenalty,
  Temperature,
  ThinkLevel,
} from '@/modules/ai-chat-settings/types/ai-chat-settings.type';

export interface DefaultSettings {
  thinkLevel: ThinkLevel;
  temperature: Temperature;
  presencePenalty: PresencePenalty;
  maxTokens: MaxTokens;
  submitOnEnter: boolean;
  historyGroupBy: GroupByOption;
}
