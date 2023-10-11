import { defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig(({ mode }) => {
  plugins: [react()]
  return {
    define: {
      'process.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY': JSON.stringify(mode),
    },
  }
})