
#!/bin/bash
# Simple start script to launch the application
echo "🚀 Starting the application..."

# Check if command argument is provided
COMMAND=${1:-dev}
PORT=${2:-8080}

# Make executable
chmod +x node_modules/.bin/vite

# Run appropriate command
case $COMMAND in
  dev|start)
    node_modules/.bin/vite --port $PORT
    ;;
  build)
    node_modules/.bin/vite build
    ;;
  build:dev)
    node_modules/.bin/vite build --mode development
    ;;
  preview|serve)
    node_modules/.bin/vite preview --port $PORT
    ;;
  *)
    echo "Unknown command: $COMMAND"
    echo "Available commands: dev, start, build, build:dev, preview, serve"
    exit 1
    ;;
esac
