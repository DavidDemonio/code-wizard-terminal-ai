
import { testOllamaConnection } from "./api";

/**
 * Interface for MySQL configuration
 */
interface MySQLConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

/**
 * Interface for SMTP configuration
 */
interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

/**
 * Interface for Ollama configuration
 */
interface OllamaConfig {
  endpoint: string;
  model: string;
}

/**
 * Test MySQL connection with real connection attempt
 */
export const testMySQLConnection = async (config: MySQLConfig): Promise<boolean> => {
  try {
    // Real MySQL connection test
    const response = await fetch('/api/test/mysql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to connect to MySQL');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to test MySQL connection:', error);
    return false;
  }
};

/**
 * Test SMTP connection
 */
export const testSMTPConnection = async (config: SMTPConfig): Promise<boolean> => {
  try {
    // Real SMTP connection test
    const response = await fetch('/api/test/smtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to connect to SMTP server');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to test SMTP connection:', error);
    return false;
  }
};

/**
 * Test Ollama connection
 */
export const testOllamaConfiguration = async (config: OllamaConfig): Promise<boolean> => {
  return await testOllamaConnection(config.endpoint);
};

/**
 * Save all configuration
 */
export const saveConfiguration = async (
  mysqlConfig: MySQLConfig, 
  smtpConfig: SMTPConfig, 
  ollamaConfig: OllamaConfig
): Promise<boolean> => {
  try {
    // Real API call to save configuration
    const response = await fetch('/api/config/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mysql: mysqlConfig,
        smtp: smtpConfig,
        ollama: ollamaConfig,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save configuration');
    }
    
    // Store config in local storage for client-side use
    localStorage.setItem('ollamaConfig', JSON.stringify(ollamaConfig));
    
    return true;
  } catch (error) {
    console.error('Failed to save configuration:', error);
    return false;
  }
};

/**
 * Load Ollama configuration
 */
export const loadOllamaConfiguration = async (): Promise<OllamaConfig | null> => {
  try {
    // Try to get from local storage first (for faster UI)
    const localConfig = localStorage.getItem('ollamaConfig');
    if (localConfig) {
      return JSON.parse(localConfig) as OllamaConfig;
    }
    
    // If not in local storage, fetch from server
    const response = await fetch('/api/config/ollama', {
      method: 'GET',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Failed to load Ollama configuration:', error);
    return null;
  }
};
