import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/content.js'),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === 'background' || chunk.name === 'content' ? '[name].js' : 'assets/[name].js',
      },
    },
    outDir: 'dist',  // Ensure the build output is placed in the 'dist' directory
  },
  
  // Use the buildEnd hook to copy the manifest.json file after the build
  buildEnd() {
    // Define the source and destination paths for the manifest file
    const manifestSrc = path.resolve(__dirname, 'manifest.json');
    const manifestDest = path.resolve(__dirname, 'dist/manifest.json');
    
    // Check if the manifest file exists and copy it to the 'dist' folder
    if (fs.existsSync(manifestSrc)) {
      fs.copyFileSync(manifestSrc, manifestDest);
      console.log('Manifest file copied to dist folder');
    } else {
      console.error('manifest.json file not found in the root directory');
    }
  },
});
