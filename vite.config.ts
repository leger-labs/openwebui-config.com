import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-label', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const extType = info[info.length - 1] || ''
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `images/[name]-[hash][extname]`
          }
          if (extType === 'css') {
            return `css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    assetsInlineLimit: 4096,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3001,
    host: true,
  },
  esbuild: {
    legalComments: 'none',
  },
})