import type { AssistantTemplate } from '@/modules/assistant-template/interfaces/assistant-template.interfaces';

type ColorMap = {
  [key: string]: string;
};

interface TemplatePreviewDialog {
  open: boolean;
  templateId: string;
  title: string;
  description: string;
  bgColorClass: string;
  free: boolean;
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
  const previewDialog = reactive<TemplatePreviewDialog>({
    open: false,
    templateId: '',
    title: '',
    description: '',
    bgColorClass: '',
    free: false,
  });

  const getBgColorClass = (colorName: string) => {
    return colorMap[colorName] || '';
  };

  const openPreviewDialog = (template: AssistantTemplate) => {
    previewDialog.open = true;
    previewDialog.templateId = template.id;
    previewDialog.title = template.title;
    previewDialog.description = template.description;
    previewDialog.bgColorClass = getBgColorClass(template.config.color);
    previewDialog.free = template.config.free;
  };

  const closePreviewDialog = () => {
    previewDialog.open = false;
  };

  return {
    previewDialog,
    getBgColorClass,
    openPreviewDialog,
    closePreviewDialog,
  };
}
