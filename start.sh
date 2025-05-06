
#!/bin/bash

# Define colors for better readability
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}Starting CodeWizard Terminal AI...${NC}"

# Default port
PORT=3000

# Function to check if a port is available
check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
    return 1
  else
    return 0
  fi
}

# Find an available port
while ! check_port $PORT; do
  echo -e "${RED}Port $PORT is in use, trying next port...${NC}"
  PORT=$((PORT+1))
done

echo -e "${GREEN}Using port $PORT${NC}"

# Set environment variable for the server to use
export PORT=$PORT

# Start the application with the determined port
# Use --host 0.0.0.0 to make it accessible from outside localhost
echo -e "${BLUE}Starting application on port $PORT...${NC}"
npx vite --port $PORT --host 0.0.0.0
