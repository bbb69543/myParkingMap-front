import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // 讓 Docker 內部也能監聽檔案變更
    },
    host: '0.0.0.0',  // 允許 Docker 訪問
    port: 5173,       // 確保與 docker-compose.yml 的 port 設定一致
  }
})
