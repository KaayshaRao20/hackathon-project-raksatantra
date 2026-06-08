import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      '@tensorflow/tfjs',
      '@tensorflow-models/pose-detection',
      '@tensorflow-models/face-detection',
      '@tensorflow-models/coco-ssd'
    ]
  },
  build: {
    // Increase chunk size warning limit for TF.js (it's large by nature)
    chunkSizeWarningLimit: 5000,
  },
})
