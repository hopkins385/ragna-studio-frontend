import { defineStore } from 'pinia';

export const useThemeStore = defineStore(
  'theme',
  () => {
    const theme = useStorage<number>('theme', 0);
    const bodyClass = computed<string>(() => {
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
        theme.value = 0;
      }
      return `theme-${theme.value}`;
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
    };
    return {
      theme,
      bodyClass,
      setTheme,
      makeThemeClass,
    };
  },
  { persist: true },
);
