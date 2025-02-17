import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'




export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the output directory is set to 'dist'
    chunkSizeWarningLimit: 2000, // Adjust the limit as needed
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; 
          }
        }
      }
    }
  }
});
