import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  define: { 'process.env': {} }, // 修复 process 报错
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 修复 @ 路径
    },
  },
  build: {
    outDir: 'assets',
    emptyOutDir: false, // 不删除 assets 里其他文件
    lib: {
      entry: 'src/main.js',
      name: 'VueTheme',
      fileName: 'vue-bundle',
      formats: ['iife'],
    },
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'vue-bundle.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'vue-bundle.css';
          }
          return '[name][extname]';
        }
      }
    }
  }
})
