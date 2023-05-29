import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({ include: './components' }),
  ],
  build: {
    minify: true,
    cssCodeSplit: false,
    lib: {
      formats: ['es'],
      entry: 'components/index.ts',
      name: 'components',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'axios', 'ant-design-vue', '@ant-design/icons-vue', 'ant-design-vue/dist/antd.css'],
      output: {
        dir: 'dist',
        globals: {
          vue: 'Vue',
        },
      },
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
