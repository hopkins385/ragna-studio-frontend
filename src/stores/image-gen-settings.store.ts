import { defineStore } from 'pinia';

export const SUPPORTED_ASPECT_RATIOS = [
  '1:1',
  '2:3',
  '4:3',
  '16:9',
  '9:16',
] as const;

export const SUPPORTED_IMAGE_GENERATION_PROVIDERS = [
  'fluxpro',
  'fluxultra',
] as const;

export type ImageGenExtension = 'jpeg' | 'png';
export type ImageGenProvider = 'fluxpro' | 'fluxultra';
export type ImageAspectRatio = (typeof SUPPORTED_ASPECT_RATIOS)[number];

interface ImgGenSettings {
  provider: ImageGenProvider;
  imageAspectRatio: ImageAspectRatio;
  imageCount: number[];
  imageGuidance: number[];
  imageExtension: ImageGenExtension;
  imagePricing: number;
  promptUpsampling: boolean;
  submitOnEnter: boolean;
  showHidden: boolean;
}

function getProviderName(provider: ImageGenProvider) {
  return provider === 'fluxultra' ? 'Flux 1.1 Ultra' : 'Flux 1.1 Pro';
}

export const useImgGenSettingsStore = defineStore('img-gen.store', {
  state: (): ImgGenSettings => ({
    provider: 'fluxpro',
    imageAspectRatio: '1:1',
    imageCount: [4],
    imageGuidance: [2.5],
    imageExtension: 'jpeg',
    imagePricing: 4,
    promptUpsampling: false,
    submitOnEnter: false,
    showHidden: false,
  }),
  getters: {
    getRawProvider(state) {
      return state.provider;
    },
    getProvider(state) {
      return getProviderName(state.provider);
    },
    getImageCount(state) {
      return state.imageCount[0];
    },
    getImageWidthAndHeight(state) {
      // get image width and height based on aspect ratio
      switch (state.imageAspectRatio) {
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
    },
    getImageAspectRatio(state) {
      return state.imageAspectRatio;
    },
    getImageGuidance(state) {
      return state.imageGuidance[0];
    },
    getSubmitOnEnter(state) {
      return state.submitOnEnter;
    },
    getShowHidden(state) {
      return state.showHidden;
    },
    getImageExtension(state) {
      return state.imageExtension;
    },
    getImagePricing(state) {
      return state.imagePricing;
    },
  },
  actions: {
    getProviderDisplayName(provider: ImageGenProvider) {
      return getProviderName(provider);
    },
    setProvider(provider: ImageGenProvider) {
      this.provider = provider;
    },
    setImageCount(imageCount: number[]) {
      this.imageCount = imageCount;
    },
    setImageAspectRatio(aspectRatio: ImageAspectRatio) {
      this.imageAspectRatio = aspectRatio;
    },
    setSubmitOnEnter(submitOnEnter: boolean) {
      this.submitOnEnter = Boolean(submitOnEnter);
    },
    setShowHidden(showHidden: boolean) {
      this.showHidden = Boolean(showHidden);
    },
    togglePromptUpsampling() {
      this.promptUpsampling = !this.promptUpsampling;
    },
    toggleSubmitOnEnter() {
      this.submitOnEnter = !this.submitOnEnter;
    },
    toggleShowHidden() {
      this.showHidden = !this.showHidden;
    },
    resetSettings() {
      this.provider = 'fluxpro';
      this.imageCount = [4];
      this.imageExtension = 'jpeg';
      this.imageAspectRatio = '1:1';
      this.imageGuidance = [2.5];
      this.submitOnEnter = false;
      this.showHidden = false;
    },
  },
  persist: true,
});
