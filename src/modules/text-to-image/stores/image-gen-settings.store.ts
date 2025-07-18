import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const SUPPORTED_ASPECT_RATIOS = ['1:1', '2:3', '4:3', '16:9', '9:16'] as const;

export const SUPPORTED_IMAGE_GENERATION_PROVIDERS = [
  'fluxpro',
  // 'fluxultra',
  'fluxkontextpro',
  // 'fluxkontextmax',
  'googleimagegen',
] as const;

export type ImageGenExtension = 'jpeg' | 'png';
export type ImageGenProvider =
  | 'fluxpro'
  | 'fluxultra'
  | 'fluxkontextpro'
  | 'fluxkontextmax'
  | 'googleimagegen';

export type ImageAspectRatio = (typeof SUPPORTED_ASPECT_RATIOS)[number];

function getProviderName(provider: ImageGenProvider) {
  switch (provider) {
    case 'fluxultra':
      return 'FLUX Ultra';
    case 'fluxkontextpro':
      return 'FLUX Kontext Pro';
    case 'fluxkontextmax':
      return 'FLUX Kontext Max';
    case 'googleimagegen':
      return 'Google Image Gen';
    default:
      return 'FLUX Pro';
  }
}

export const useImgGenSettingsStore = defineStore(
  'img-gen.store',
  () => {
    // Individual refs for state
    const provider = ref<ImageGenProvider>('fluxkontextpro');
    const imageAspectRatio = ref<ImageAspectRatio>('1:1');
    const imageCount = ref<number[]>([4]);
    const imageGuidance = ref<number[]>([2.5]);
    const imageExtension = ref<ImageGenExtension>('jpeg');
    const imagePricing = ref(4);
    const promptUpsampling = ref(false);
    const submitOnEnter = ref(false);
    const showHidden = ref(false);

    // Computed properties (getters)
    const getRawProvider = computed(() => provider.value);
    const getProvider = computed(() => getProviderName(provider.value));
    const getImageCount = computed(() => imageCount.value[0]);
    const getImageWidthAndHeight = computed(() => {
      switch (imageAspectRatio.value) {
        case '1:1':
          return { width: 1440, height: 1440 };
        case '4:3':
          return { width: 1024, height: 768 };
        case '2:3':
          return { width: 1024, height: 1440 };
        case '16:9':
          return { width: 1024, height: 576 };
        case '9:16':
          return { width: 576, height: 1024 };
        default:
          return { width: 1024, height: 1024 };
      }
    });
    const getImageAspectRatio = computed(() => imageAspectRatio.value);
    const getImageGuidance = computed(() => imageGuidance.value[0]);
    const getSubmitOnEnter = computed(() => submitOnEnter.value);
    const getShowHidden = computed(() => showHidden.value);
    const getImageExtension = computed(() => imageExtension.value);
    const getImagePricing = computed(() => imagePricing.value);

    // Actions as functions
    function getProviderDisplayName(p: ImageGenProvider) {
      return getProviderName(p);
    }

    function setProvider(p: ImageGenProvider) {
      provider.value = p;
    }

    function setImageCount(count: number[]) {
      imageCount.value = count;
    }

    function setImageAspectRatio(aspectRatio: ImageAspectRatio) {
      imageAspectRatio.value = aspectRatio;
    }

    function setSubmitOnEnter(value: boolean) {
      submitOnEnter.value = Boolean(value);
    }

    function setShowHidden(value: boolean) {
      showHidden.value = Boolean(value);
    }

    function togglePromptUpsampling() {
      promptUpsampling.value = !promptUpsampling.value;
    }

    function toggleSubmitOnEnter() {
      submitOnEnter.value = !submitOnEnter.value;
    }

    function toggleShowHidden() {
      showHidden.value = !showHidden.value;
    }

    function resetSettings() {
      provider.value = 'fluxkontextpro';
      imageCount.value = [4];
      imageExtension.value = 'jpeg';
      imageAspectRatio.value = '1:1';
      imageGuidance.value = [2.5];
      submitOnEnter.value = false;
      showHidden.value = false;
    }

    return {
      // State
      provider,
      imageAspectRatio,
      imageCount,
      imageGuidance,
      imageExtension,
      imagePricing,
      promptUpsampling,
      submitOnEnter,
      showHidden,
      // Getters
      getRawProvider,
      getProvider,
      getImageCount,
      getImageWidthAndHeight,
      getImageAspectRatio,
      getImageGuidance,
      getSubmitOnEnter,
      getShowHidden,
      getImageExtension,
      getImagePricing,
      // Actions
      getProviderDisplayName,
      setProvider,
      setImageCount,
      setImageAspectRatio,
      setSubmitOnEnter,
      setShowHidden,
      togglePromptUpsampling,
      toggleSubmitOnEnter,
      toggleShowHidden,
      resetSettings,
    };
  },
  {
    persist: true,
  },
);
