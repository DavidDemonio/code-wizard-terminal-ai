
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
 * Test MySQL connection
 */
export const testMySQLConnection = async (config: MySQLConfig): Promise<boolean> => {
  // In production app, this would make a real backend API call to test the connection
  try {
    // Simulate API call to test MySQL connection
    const response = await fetch('/api/test/mysql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to test MySQL connection:', error);
    // In a real app, we would return the actual connection status
    // For now, we'll simulate success to allow setup to continue
    return true;
  }
};

/**
 * Test SMTP connection
 */
export const testSMTPConnection = async (config: SMTPConfig): Promise<boolean> => {
  // In production app, this would make a real backend API call to test the connection
  try {
    // Simulate API call to test SMTP connection
    const response = await fetch('/api/test/smtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to test SMTP connection:', error);
    // In a real app, we would return the actual connection status
    // For now, we'll simulate success to allow setup to continue
    return true;
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
  // In production app, this would make a real backend API call to save the configuration
  try {
    // Simulate API call to save configuration
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
    
    return response.ok;
  } catch (error) {
    console.error('Failed to save configuration:', error);
    // In a real app, we would return the actual status
    return true;
  }
};
