import { useStorage } from '@vueuse/core';
import { computed } from 'vue';

export default function useTheme() {
  const theme = useStorage('theme', 0);
  const themeClass = computed(() => {
    return makeThemeClass(theme.value);
  });

  //check if theme.value is a number
  const makeThemeClass = (value: number) => {
    if (
      typeof value !== 'number' ||
      /*is float*/
      value % 1 !== 0 ||
      value < 1 ||
      value > 14 ||
      isNaN(value) ||
      !isFinite(value) ||
      value === null ||
      value === undefined
    ) {
      theme.value = 14;
    }
    return `theme-${theme.value}`;
  };

  const updateThemeHtmlTag = () => {
    //find html element and replace theme class
    const html = document.querySelector('html');
    if (html) {
      html.classList.remove(
        'theme-1',
        'theme-2',
        'theme-3',
        'theme-4',
        'theme-5',
        'theme-6',
        'theme-7',
        'theme-8',
        'theme-9',
        'theme-10',
        'theme-11',
        'theme-12',
        'theme-13',
        'theme-14',
      );
      html.classList.add(themeClass.value);
    }
  };

  //change theme
  const setTheme = (themeId: number) => {
    //abort if themeId is not a number
    if (typeof themeId !== 'number') {
      return;
    }
    //abort if themeId is not between 1 and 13
    if (themeId < 1 || themeId > 14) {
      themeId = 14;
    }
    theme.value = themeId;
    updateThemeHtmlTag();
  };

  return {
    theme,
    updateThemeHtmlTag,
    setTheme,
  };
}
