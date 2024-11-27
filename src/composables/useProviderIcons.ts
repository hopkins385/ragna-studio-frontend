import AnthropicIcon from '~icons/logos/anthropic-icon';
import OpenaiIcon from '~icons/logos/openai-icon';
import MistralAiIcon from '~icons/logos/mistral-ai-icon';
import MetaIcon from '~icons/logos/meta-icon';
import GoogleGemini from '~icons/logos/google-gemini';
import MicrosoftAzure from '~icons/logos/microsoft-azure';

export function useProviderIcons() {
  const getProviderIcon = (provider: string) => {
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
