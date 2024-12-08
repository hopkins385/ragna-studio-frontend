import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import UnheadVite from '@unhead/addons/vite';
import { unheadVueComposablesImports } from '@unhead/vue';
import vue from '@vitejs/plugin-vue';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import svgLoader from 'vite-svg-loader';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        './src/locales/**',
      ),
    }),
    imagetools({}),
    svgLoader(),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vee-validate',
        'vue-i18n',
        unheadVueComposablesImports,
      ],
      dirs: ['./composables/**'],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    // Components({
    //   dts: true,
    //   deep: false,
    // }),
    vue(),
    // vueDevTools(),
    UnheadVite(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url),
      ),
      '@ui': fileURLToPath(new URL('./src/components/ui', import.meta.url)),
      '@composables': fileURLToPath(
        new URL('./src/composables', import.meta.url),
      ),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@schemas': fileURLToPath(new URL('./src/schemas', import.meta.url)),
    },
  },
});
