import { useEditorService } from '../services/useEditorService';
import useMarkdown from '../useMarkdown';

export default function useEditorCompletion() {
  let ac: AbortController | null = null;
  const isLoading = ref(false);

  const { fetchPromptCompletion } = useEditorService();
  const { parseMarkdown } = useMarkdown();

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
      const { completion } = await fetchPromptCompletion(fetchPayload);
      if (!completion) {
        return '';
      }
      return parseMarkdown(completion);
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
