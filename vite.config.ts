import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure correct asset paths for Cloudflare Workers
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext', // Modern browsers for edge deployment
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false, // Reduce deployment size
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimize chunk splitting for edge caching
          'vendor': ['react', 'react-dom'],
          'rjsf': ['@rjsf/core', '@rjsf/validator-ajv8'],
          'ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-select', 
                '@radix-ui/react-tabs', '@radix-ui/react-label', '@radix-ui/react-slot', 
                '@radix-ui/react-switch', '@radix-ui/react-checkbox', '@radix-ui/react-toast'],
          'form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'lucide-react']
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    
    // Optimize for Cloudflare Workers
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    
    // Performance optimizations
    reportCompressedSize: true,
    cssMinify: true,
  },
  
  // Development optimization
  server: {
    port: 3000,
    host: true,
    open: false,
    cors: true
  },
  
  preview: {
    port: 3001,
    host: true,
    cors: true
  },
  
  esbuild: {
    legalComments: 'none',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@rjsf/core', '@rjsf/validator-ajv8'],
    exclude: ['@cloudflare/workers-types']
  }
})
