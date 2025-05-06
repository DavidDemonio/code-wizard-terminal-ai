
#!/bin/bash

# Define colors for better readability
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}Starting CodeWizard Terminal AI...${NC}"

# Fixed port
PORT=55555

echo -e "${GREEN}Using port $PORT${NC}"

# Set environment variable for the server to use
export PORT=$PORT

# Start the application with the determined port
# Use --host 0.0.0.0 to make it accessible from outside localhost
echo -e "${BLUE}Starting application on port $PORT...${NC}"
npx vite --port $PORT --host 0.0.0.0

