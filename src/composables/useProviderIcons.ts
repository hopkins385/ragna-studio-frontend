import AnthropicIcon from '~icons/logos/anthropic-icon';
import GoogleGemini from '~icons/logos/google-gemini';
import MetaIcon from '~icons/logos/meta-icon';
import MicrosoftAzure from '~icons/logos/microsoft-azure';
import MistralAiIcon from '~icons/logos/mistral-ai-icon';
import OpenaiIcon from '~icons/logos/openai-icon';

export function useProviderIcons() {
  const getProviderIcon = (name: string) => {
    const provider = name.toLowerCase();
    return {
      anthropic: AnthropicIcon,
      openai: OpenaiIcon,
      mistral: MistralAiIcon,
      meta: MetaIcon,
      google: GoogleGemini,
      azure: MicrosoftAzure,
      groq: MetaIcon,
    }[provider];
  };

  return { getProviderIcon };
}
