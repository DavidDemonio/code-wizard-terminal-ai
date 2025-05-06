
/**
 * Utilities for working with shell commands
 */

// Map of common command types for contextual suggestions
const COMMAND_CATEGORIES = {
  FILE_OPERATIONS: ["ls", "cd", "mkdir", "touch", "rm", "cp", "mv", "find", "grep", "cat"],
  PACKAGE_MANAGEMENT: ["npm", "yarn", "pnpm", "pip", "apt", "yum", "brew", "apt-get"],
  GIT: ["git", "gh"],
  NETWORK: ["curl", "wget", "ssh", "nc", "ping", "dig", "host", "traceroute", "netstat"],
  PROCESS: ["ps", "top", "htop", "kill", "pkill"],
  SYSTEM: ["sudo", "systemctl", "service", "uname", "whoami", "echo", "date"]
};

/**
 * Get command category
 */
export const getCommandCategory = (command: string): keyof typeof COMMAND_CATEGORIES | null => {
  const firstWord = command.trim().split(" ")[0];
  
  for (const [category, commands] of Object.entries(COMMAND_CATEGORIES)) {
    if (commands.includes(firstWord)) {
      return category as keyof typeof COMMAND_CATEGORIES;
    }
  }
  
  return null;
};

/**
 * Parse command for potential dangerous operations
 */
export const isRiskyCommand = (command: string): boolean => {
  const riskyPatterns = [
    /rm\s+(-rf?|--recursive)\s+\//,
    /dd\s+.*of\s*=\s*\/dev\/(sd|hd|nvme)/,
    /:(){ :\|:& };:/,
    /mkfs/,
    /chmod\s+-R\s+777\s+\//,
    /mv\s+.*\s+\/dev\/null/,
    />\s+\/etc\/(passwd|shadow)/,
    /shutdown/,
    /reboot/,
    /halt/
  ];
  
  return riskyPatterns.some(pattern => pattern.test(command));
};

/**
 * Get suggested commands based on current context or history
 */
export const getSuggestedCommands = (
  currentInput: string, 
  commandHistory: string[] = []
): string[] => {
  // If empty input, suggest from history or common commands
  if (!currentInput.trim()) {
    return commandHistory.slice(-3).reverse();
  }
  
  // Get the first word to determine command type
  const [command] = currentInput.trim().split(" ");
  
  // Prepare command-specific suggestions
  const suggestions: Record<string, string[]> = {
    "git": [
      "git status",
      "git pull",
      "git push",
      "git commit -m \"\"", 
      "git checkout -b "
    ],
    "npm": [
      "npm install",
      "npm run start",
      "npm run build",
      "npm test",
      "npm update"
    ],
    "ls": [
      "ls -la",
      "ls -lh",
      "ls --color=auto"
    ],
    "docker": [
      "docker ps",
      "docker images",
      "docker-compose up -d",
      "docker build -t name ."
    ],
    "ssh": [
      "ssh user@hostname",
      "ssh -i key.pem user@hostname"
    ]
  };
  
  // Return command-specific suggestions or partial matches from history
  if (suggestions[command]) {
    return suggestions[command];
  }
  
  // Find partial matches from history
  return commandHistory.filter(cmd => 
    cmd.startsWith(currentInput)
  ).slice(-3).reverse();
};

/**
 * Analyze command output to provide contextual help
 */
export const getCommandHelp = (command: string, output: string): string | null => {
  // Common error patterns and helpful responses
  const errorPatterns = [
    {
      pattern: /command not found/i,
      help: "This command isn't installed. Try installing it with your package manager."
    },
    {
      pattern: /permission denied/i,
      help: "You don't have permission to run this command. Try using sudo (be careful!)."
    },
    {
      pattern: /no such file or directory/i,
      help: "The file or directory doesn't exist. Check the path and try again."
    },
    {
      pattern: /connection refused/i,
      help: "Connection refused. Check if the service is running and the port is open."
    }
  ];
  
  for (const { pattern, help } of errorPatterns) {
    if (pattern.test(output)) {
      return help;
    }
  }
  
  return null;
};

/**
 * Format a command for secure display (hide sensitive info)
 */
export const formatCommandForDisplay = (command: string): string => {
  // Hide sensitive information like passwords and keys
  return command
    .replace(/(-p|--password=?)(\s+\S+|\S+)/g, "$1 [HIDDEN]")
    .replace(/(TOKEN|API[_-]?KEY|SECRET)(\s*=\s*|\s+)[^\s]+/ig, "$1$2[HIDDEN]");
};
