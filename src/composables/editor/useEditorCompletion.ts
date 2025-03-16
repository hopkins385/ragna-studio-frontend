import { editorService } from '@/modules/editor/services/editor.service';
import { markdownService } from '@/modules/markdown/services/markdown.service';

export default function useEditorCompletion() {
  let ac: AbortController | null = null;
  const isLoading = ref(false);

  const abortCompletion = () => {
    if (ac) {
      ac.abort();
    }
  };

  const fetchCompletion = async (payload: {
    context: string;
    selectedText: string;
    prompt: string;
  }): Promise<string> => {
    if (ac) {
      ac.abort();
    }
    ac = new AbortController();
    // const markdown = toMarkdown(editor.getHTML())

    const fetchPayload = {
      // lang: options.lang,
      // action: options.action,
      context: payload.context || '',
      selectedText: payload.selectedText || '',
      prompt: payload.prompt || '',
    };

    isLoading.value = true;

    try {
      const { completion } = await editorService.fetchPromptCompletion(fetchPayload);
      if (!completion) {
        return '';
      }
      return markdownService.toHtml(completion);
      //
    } catch (error) {
      console.error('Error running completion', error);
      return ' ups something went wrong - please try again';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    fetchCompletion,
    abortCompletion,
  };
}
