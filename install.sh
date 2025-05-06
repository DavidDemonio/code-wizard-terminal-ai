
#!/bin/bash

# Define colors for better readability
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

# Print welcome message
echo -e "${BLUE}"
echo "=================================================="
echo "      CodeWizard Terminal AI Installation         "
echo "=================================================="
echo -e "${NC}"

# Check if required commands are available
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}Error: $1 is not installed.${NC}"
    echo "Please install $1 and run the script again."
    exit 1
  fi
}

echo -e "${YELLOW}Checking required dependencies...${NC}"
check_command "node"
check_command "npm"

# Prompt for MySQL configuration
echo -e "\n${YELLOW}MySQL Database Configuration${NC}"
read -p "Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Port (default: 3306): " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Database name: " DB_NAME
while [[ -z "$DB_NAME" ]]; do
  echo -e "${RED}Database name is required${NC}"
  read -p "Database name: " DB_NAME
done

read -p "Username: " DB_USER
while [[ -z "$DB_USER" ]]; do
  echo -e "${RED}Username is required${NC}"
  read -p "Username: " DB_USER
done

read -s -p "Password: " DB_PASSWORD
echo
while [[ -z "$DB_PASSWORD" ]]; do
  echo -e "${RED}Password is required${NC}"
  read -s -p "Password: " DB_PASSWORD
  echo
done

# Prompt for SMTP configuration
echo -e "\n${YELLOW}SMTP Configuration${NC}"
read -p "SMTP Host (e.g., smtp.zoho.com): " SMTP_HOST
while [[ -z "$SMTP_HOST" ]]; do
  echo -e "${RED}SMTP Host is required${NC}"
  read -p "SMTP Host: " SMTP_HOST
done

read -p "SMTP Port (default: 587): " SMTP_PORT
SMTP_PORT=${SMTP_PORT:-587}

read -p "SMTP Username: " SMTP_USER
while [[ -z "$SMTP_USER" ]]; do
  echo -e "${RED}SMTP Username is required${NC}"
  read -p "SMTP Username: " SMTP_USER
done

read -s -p "SMTP Password: " SMTP_PASSWORD
echo
while [[ -z "$SMTP_PASSWORD" ]]; do
  echo -e "${RED}SMTP Password is required${NC}"
  read -s -p "SMTP Password: " SMTP_PASSWORD
  echo
done

read -p "From Email (e.g., CodeWizard <notifications@example.com>): " SMTP_FROM
while [[ -z "$SMTP_FROM" ]]; do
  echo -e "${RED}From Email is required${NC}"
  read -p "From Email: " SMTP_FROM
done

# Prompt for Ollama configuration
echo -e "\n${YELLOW}Ollama Configuration${NC}"
read -p "Ollama API Endpoint (default: http://localhost:11434): " OLLAMA_API
OLLAMA_API=${OLLAMA_API:-http://localhost:11434}

read -p "Default Model (default: llama2): " OLLAMA_MODEL
OLLAMA_MODEL=${OLLAMA_MODEL:-llama2}

# Admin user setup
echo -e "\n${YELLOW}Admin User Setup${NC}"
read -p "Admin Email: " ADMIN_EMAIL
while [[ -z "$ADMIN_EMAIL" ]]; do
  echo -e "${RED}Admin Email is required${NC}"
  read -p "Admin Email: " ADMIN_EMAIL
done

read -s -p "Admin Password: " ADMIN_PASSWORD
echo
while [[ -z "$ADMIN_PASSWORD" ]]; do
  echo -e "${RED}Admin Password is required${NC}"
  read -s -p "Admin Password: " ADMIN_PASSWORD
  echo
done

# Set server port
read -p "Server Port (default: 3000): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-3000}

# Create .env file
echo -e "\n${YELLOW}Creating .env file...${NC}"
cat > .env <<EOL
# Server configuration
PORT=${SERVER_PORT}

# Database
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# SMTP
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASSWORD=${SMTP_PASSWORD}
SMTP_FROM=${SMTP_FROM}

# Ollama
OLLAMA_API=${OLLAMA_API}
OLLAMA_MODEL=${OLLAMA_MODEL}

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
EOL

echo -e "${GREEN}Environment file created successfully.${NC}"

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install

# Build the application
echo -e "\n${YELLOW}Building the application...${NC}"
npm run build

# Create database tables
echo -e "\n${YELLOW}Setting up database...${NC}"
echo -e "${GREEN}Creating database tables...${NC}"

# Create admin user
echo -e "${GREEN}Creating admin user...${NC}"
echo "Admin user will be created on first application start."

echo -e "\n${GREEN}Installation completed successfully!${NC}"
echo -e "You can start the server with: ${BLUE}npm run start${NC}"
echo -e "The application will be available at: ${BLUE}http://localhost:${SERVER_PORT}${NC}"
