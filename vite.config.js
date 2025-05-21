
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react()],
    server: {
      port: 8080,
      host: true
    },
    define: {
      'process.env': {}
    }
  };
  
  // Add specific configurations for development mode
  if (mode === 'development') {
    config.build = {
      sourcemap: true,
      minify: false
    };
  }
  
  return config;
});
