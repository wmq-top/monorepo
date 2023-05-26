import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    // 打包文件目录
    outDir: 'dist',
    // 压缩
    // minify: false,
    // rollupOptions: {
    //   // 忽略打包vue文件
    //   external: ['vue'],
    //   input: ['components/index.ts'],
    //   output: [
    //     {
    //       // 打包格式
    //       format: 'es',
    //       // 打包后文件名
    //       entryFileNames: '[name].mjs',
    //       // 让打包目录和我们目录对应
    //       preserveModules: true,
    //       exports: 'named',
    //       // 配置打包根目录
    //       dir: '../monorepo/dist',
    //     },
    //   ],
    // },
    lib: {
      entry: './components/index.ts',
      name: 'index',
    },
  },
  plugins: [vue(), vueJsx(), dts()],
})
