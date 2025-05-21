
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    server: {
      port: 8080,
      host: true
    },
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
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
