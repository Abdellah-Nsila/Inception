import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // 1. Import the native path module

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // 2. Direct Vite to map '@' straight to your local 'src' directory
      '@': path.resolve(__dirname, './src'),
    },
  },
});
