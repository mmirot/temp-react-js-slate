
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Create a dynamic import function for the ESM-only lovable-tagger
const loadComponentTagger = async (mode) => {
  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      return componentTagger();
    } catch (error) {
      console.error('Failed to load lovable-tagger:', error);
      return null;
    }
  }
  return null;
};

export default defineConfig(async ({ mode }) => {
  // Dynamically load the tagger plugin
  const taggerPlugin = await loadComponentTagger(mode);
  
  return {
    server: {
      host: "::",
      port: 8080,
      // Add a startup message to guide users
      onListening(server) {
        const { port } = server.config.server;
        console.log(`\n🚀 Server running at http://localhost:${port}/`);
        console.log(`\n💡 To start the app, run either:`);
        console.log(`   - npm run start`);
        console.log(`   - npm run dev`);
        console.log(`   - npx vite --port 8080\n`);
      }
    },
    plugins: [
      react(),
      taggerPlugin
    ].filter(Boolean),
    define: {
      'process.env': process.env
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  };
});
