import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/rsp.setup_copilot/',
  plugins: [react()],
})
