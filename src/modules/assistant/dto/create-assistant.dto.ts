export class CreateAssistantDto {
  teamId: string = '';
  llmId: string = '';
  title: string = '';
  description: string = '';
  systemPrompt: string = '';
  isShared: boolean = false;
  hasKnowledgeBase: boolean = false;
  hasWorkflow: boolean = false;
  tools: string[] = [];
}
