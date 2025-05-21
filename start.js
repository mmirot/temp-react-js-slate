
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting the application on port 8080...');

// Run vite directly
const viteProcess = spawn('node_modules/.bin/vite', ['--port', '8080'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

viteProcess.on('error', (error) => {
  console.error('Failed to start Vite server:', error);
  process.exit(1);
});
