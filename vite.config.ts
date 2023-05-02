import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import replace from '@rollup/plugin-replace';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    replace({
      'process.env.VITE_REACT_APP_AUTH0_DOMAIN': JSON.stringify(process.env.VITE_REACT_APP_AUTH0_DOMAIN),
      'process.env.VITE_REACT_APP_AUTH0_CLIENT_ID': JSON.stringify(process.env.VITE_REACT_APP_AUTH0_CLIENT_ID),
      'process.env.VITE_REACT_APP_AUTH0_CALLBACK_URL': JSON.stringify(process.env.VITE_REACT_APP_AUTH0_CALLBACK_URL)
    })
  ],
})
