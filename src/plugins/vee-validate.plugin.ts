import { configure } from 'vee-validate'
import type { Plugin } from 'vue'

const veeConfigPlugin: Plugin = {
  install() {
    configure({
      validateOnBlur: true,
      validateOnChange: false,
      validateOnInput: false,
      validateOnModelUpdate: false,
    })
  },
}

export default veeConfigPlugin
