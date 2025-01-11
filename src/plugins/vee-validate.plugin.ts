import { localize } from '@vee-validate/i18n';
import de from '@vee-validate/i18n/dist/locale/de.json';
import { configure } from 'vee-validate';
import type { Plugin } from 'vue';

const veeConfigPlugin: Plugin = {
  install() {
    configure({
      generateMessage: localize({
        de,
      }),
      validateOnBlur: true,
      validateOnChange: false,
      validateOnInput: false,
      validateOnModelUpdate: false,
    });
  },
};

export default veeConfigPlugin;
