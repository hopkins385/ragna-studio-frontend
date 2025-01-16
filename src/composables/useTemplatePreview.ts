import type { AssistantTemplate } from './services/useAssistantTemplateService';

type ColorMap = {
  [key: string]: string;
};

interface Template {
  title: string;
  description: string;
  bgColor: string;
  free?: boolean;
}

const colorMap: ColorMap = {
  lime: 'bg-lime-50',
  orange: 'bg-orange-50',
  violet: 'bg-violet-50',
  cyan: 'bg-cyan-50',
  red: 'bg-red-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  yellow: 'bg-yellow-50',
  purple: 'bg-purple-50',
  pink: 'bg-pink-50',
  indigo: 'bg-indigo-50',
  teal: 'bg-teal-50',
  gray: 'bg-gray-50',
};

export function useTemplatePreview() {
  const previewDialog = reactive({
    open: false,
    title: '',
    description: '',
    bgColor: '',
    free: false,
  });

  const getBgColor = (colorName: string) => {
    return colorMap[colorName];
  };

  const openPreviewDialog = (template: AssistantTemplate) => {
    previewDialog.open = true;
    previewDialog.title = template.title;
    previewDialog.description = template.description;
    previewDialog.bgColor = template.config.color;
    previewDialog.free = template.config.free;
  };

  const closePreviewDialog = () => {
    previewDialog.open = false;
  };

  return {
    previewDialog,
    getBgColor,
    openPreviewDialog,
    closePreviewDialog,
  };
}
