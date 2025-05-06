
/**
 * API utilities for connecting to backend services
 * including Ollama, SSH connections and SFTP operations
 */

// Base URL for the backend API - dynamically set based on environment
const API_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3000';

// Ollama API endpoint from environment or default
const OLLAMA_API = import.meta.env.VITE_OLLAMA_API || 'http://localhost:11434';

/**
 * Interface for Ollama API request
 */
interface OllamaRequest {
  model: string;
  prompt?: string;
  stream?: boolean;
  messages?: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  options?: Record<string, any>;
}

/**
 * Send a chat completion request to Ollama API
 */
export const sendChatCompletion = async (messages: OllamaRequest['messages'], model = 'llama2') => {
  try {
    const response = await fetch(`${OLLAMA_API}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Ollama API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat completion:', error);
    throw error;
  }
};

/**
 * Stream a chat completion from Ollama API
 */
export const streamChatCompletion = async function* (messages: OllamaRequest['messages'], model = 'llama2') {
  try {
    const response = await fetch(`${OLLAMA_API}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Ollama API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete JSON objects from the buffer
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        
        if (line.trim() === '') continue;
        
        try {
          const parsedData = JSON.parse(line);
          yield parsedData;
        } catch (error) {
          console.error('Error parsing JSON:', error, line);
        }
      }
    }
  } catch (error) {
    console.error('Error streaming chat completion:', error);
    throw error;
  }
};

/**
 * Check if the provided text is likely a shell command
 */
export const isShellCommand = (text: string): boolean => {
  // Common command prefixes and patterns
  const commandPatterns = [
    /^(cd|ls|git|npm|yarn|pnpm|docker|kubectl|ssh|scp|cat|echo|mkdir|touch|rm|cp|mv|curl|wget|sudo|apt|yum|dnf|brew)/,
    /^(python|node|bash|sh|zsh|fish|powershell|cmd|php|ruby|perl|java|go|rust|cargo)/,
    /(\||>|<|>>|<<|&&|\|\|)/,
    /^[\.\/]/
  ];
  
  return commandPatterns.some(pattern => pattern.test(text.trim()));
};

/**
 * Test Ollama connection
 */
export const testOllamaConnection = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`${endpoint}/api/version`, {
      method: 'GET',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to connect to Ollama:', error);
    return false;
  }
};
