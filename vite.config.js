
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Dynamic import for ESM-only module
const loadComponentTagger = async () => {
  try {
    const { componentTagger } = await import('lovable-tagger');
    return componentTagger;
  } catch (error) {
    console.error('Failed to load lovable-tagger:', error);
    return null;
  }
};

export default defineConfig(async ({ command, mode }) => {
  // Dynamically load the componentTagger
  const componentTaggerPlugin = mode === 'development' ? await loadComponentTagger() : null;
  
  const config = {
    plugins: [
      react(),
      mode === 'development' && componentTaggerPlugin,
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
