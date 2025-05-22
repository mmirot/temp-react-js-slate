
// Using ESM syntax for Node.js script
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'dev'; // Default to 'dev' if no command provided
const port = args.includes('--port') ? args[args.indexOf('--port') + 1] : '8080'; // Get port or default to 8080

console.log(`🚀 Starting the application with command: ${command} on port ${port}...`);

let viteArgs = [];

// Handle different commands
switch (command) {
  case 'dev':
  case 'start':
    viteArgs = ['--port', port];
    break;
  case 'build':
    viteArgs = ['build'];
    break;
  case 'preview':
  case 'serve':
    viteArgs = ['preview', '--port', port];
    break;
  case 'build:dev':
    viteArgs = ['build', '--mode', 'development'];
    break;
  default:
    console.log(`Unknown command: ${command}`);
    console.log('Available commands: dev, start, build, build:dev, preview, serve');
    process.exit(1);
}

// Run vite with appropriate arguments
const viteProcess = spawn('node_modules/.bin/vite', viteArgs, {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

viteProcess.on('error', (error) => {
  console.error(`Failed to run command ${command}:`, error);
  process.exit(1);
});

console.log('\n💡 Quick tip: You can also run this app with:');
console.log('   - npm run start');
console.log('   - npx vite --port 8080');
console.log('   - ./start.sh\n');
