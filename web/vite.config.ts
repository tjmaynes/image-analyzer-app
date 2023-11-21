import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_HOST': JSON.stringify(
      process.env.API_HOST || 'http://localhost:8081'
    ),
  },
})
