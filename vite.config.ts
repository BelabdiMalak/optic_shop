import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',  //  to ensure relative paths work in the Electron environment.
  build: {
    outDir: 'dist', // Specifies the output directory 
  },
  plugins: [react()],
});
