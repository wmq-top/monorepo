import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: './packages',
      outputDir: [
        'dist/types',
      ],
    }),
    Components({
      dts: 'types/env.d.ts',
    })],
  build: {
    outDir: 'dist',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'vue',
        'xlsx',
        'file-saver',
        'axios',
        'vue-draggable-next',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'ant-design-vue/dist/antd.css',
        'shepherd.js',
        'shepherd.js/dist/css/shepherd.css',
        'markdown-it',
        'highlight.js',
        'clipboard',
        /^highlight.js\/style/,
      ],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          exports: 'named',
          dir: 'dist/es',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: 'dist/lib',
        },
      ],
    },
    lib: {
      entry: 'packages/index.ts',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javaScriptEnable: true,
      },
    },
  },
})
