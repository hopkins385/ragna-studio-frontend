// Define the mapping function outside the main helper
const toolDisplayNames = {
  searchWeb: 'tool.websearch.label',
  think: 'tool.think.label',
  texteditor: 'tool.texteditor.label',
  website: 'tool.webscraper.label',
  knowledge: 'tool.knowledge.label',
  comment: 'tool.comment.label',
  directions: 'tool.directions.label',
};

export const getToolDisplayName = ({ rawName }: { rawName: string }): string => {
  return toolDisplayNames[rawName as keyof typeof toolDisplayNames] || rawName;
};
