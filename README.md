
# CodeWizard Terminal AI

An AI-powered terminal and SFTP client with Ollama integration, providing contextual assistance for developers working with remote servers.

![CodeWizard Terminal AI](https://lovable.dev/opengraph-image-p98pqg.png)

## Features

- **AI Agent**: Integrated with Ollama's local API for contextual assistance
  - Activated with `Ctrl+I` hotkey
  - Command detection and execution
  - Multi-step reasoning

- **SSH & SFTP Client**:
  - In-browser SSH terminal (xterm.js)
  - SFTP file browser with uploads/downloads

- **User & Admin System**:
  - Registration & login (MySQL + JWT)
  - Email notifications (ZohoMail SMTP)
  - Configuration management

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js (or your preferred backend)
- **Database**: MySQL
- **AI**: Ollama API
- **Terminal**: xterm.js

## Installation

### Method 1: Using the Installation Script

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/codewizard-terminal-ai.git
   cd codewizard-terminal-ai
   ```

2. Run the installation script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. Follow the prompts to configure your database, SMTP, Ollama settings, and admin user.

4. Start the application:
   ```bash
   npm run start
   ```

### Method 2: Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/codewizard-terminal-ai.git
   cd codewizard-terminal-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   # Server configuration
   PORT=3000

   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=codewizard
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password

   # SMTP
   SMTP_HOST=smtp.zoho.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASSWORD=your_smtp_password
   SMTP_FROM=CodeWizard <your_email@example.com>

   # Ollama
   OLLAMA_API=http://localhost:11434
   OLLAMA_MODEL=llama2

   # JWT Secret
   JWT_SECRET=your_random_secret_here
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Start the application:
   ```bash
   npm run start
   ```

## First-Time Setup

On first run, the application will:

1. Redirect to `/setup`
2. Guide you through configuring MySQL, SMTP, and Ollama
3. Create necessary database tables
4. Set up an initial admin user
5. Redirect to the login page

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

[MIT](LICENSE)
