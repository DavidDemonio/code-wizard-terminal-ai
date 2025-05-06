
import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Terminal as TerminalIcon } from "lucide-react";
import { isShellCommand } from "@/lib/shell-utils";
import { streamChatCompletion, sendChatCompletion } from "@/lib/api";
import { loadOllamaConfiguration } from "@/lib/setup-service";
import "xterm/css/xterm.css";

interface TerminalProps {
  isConnected?: boolean;
  serverMessage?: string;
}

type MessageRole = "system" | "user" | "assistant";

interface Message {
  role: MessageRole;
  content: string;
}

export function Terminal({ isConnected = false, serverMessage = "Not connected" }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<XTerm | null>(null);
  const [fitAddon, setFitAddon] = useState<FitAddon | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState("");
  const [ollamaModel, setOllamaModel] = useState("llama2");
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);

  useEffect(() => {
    // Load Ollama configuration when component mounts
    const loadConfig = async () => {
      const config = await loadOllamaConfiguration();
      if (config && config.model) {
        setOllamaModel(config.model);
      }
    };
    
    loadConfig();
  }, []);

  const executeCommand = useCallback(async (command: string) => {
    if (!terminal) return;
    
    terminal.writeln("");
    setIsProcessingCommand(true);
    
    if (isShellCommand(command)) {
      try {
        // Call Ollama AI to process the shell command
        terminal.writeln(`Executing: ${command}`);
        
        const messages: Message[] = [
          { role: "system", content: "You are a terminal assistant. Return only the expected output of the command. For commands that would require a real shell environment, explain what the command would do and what output it might produce." },
          { role: "user", content: `Process this shell command and return only the expected output: ${command}` }
        ];

        // Use streaming for better UX
        const stream = streamChatCompletion(messages, ollamaModel);
        
        // Process the stream
        let responseContent = "";
        for await (const chunk of stream) {
          if (chunk.message && chunk.message.content) {
            const newContent = chunk.message.content;
            terminal.write(newContent);
            responseContent += newContent;
          }
        }
        
        terminal.writeln("");
      } catch (error) {
        console.error('Error executing command:', error);
        terminal.writeln(`Error: ${error instanceof Error ? error.message : 'Failed to execute command'}`);
      }
    } else {
      try {
        // If not a shell command, treat it as a chat with AI
        terminal.writeln("Processing with AI...");
        
        const messages: Message[] = [
          { role: "system", content: "You are a helpful AI terminal assistant. Keep responses concise and focused." },
          { role: "user", content: command }
        ];
        
        // Use streaming for better UX
        const stream = streamChatCompletion(messages, ollamaModel);
        
        // Process the stream
        let responseContent = "";
        for await (const chunk of stream) {
          if (chunk.message && chunk.message.content) {
            const newContent = chunk.message.content;
            terminal.write(newContent);
            responseContent += newContent;
          }
        }
        
        terminal.writeln("");
      } catch (error) {
        console.error('Error processing with AI:', error);
        terminal.writeln(`Error: ${error instanceof Error ? error.message : 'Failed to process with AI'}`);
      }
    }
    
    setIsProcessingCommand(false);
    terminal.write("\n$ ");
  }, [terminal, ollamaModel]);

  useEffect(() => {
    // Only initialize if not already initialized
    if (!terminal && terminalRef.current) {
      const term = new XTerm({
        cursorBlink: true,
        fontFamily: '"Cascadia Code", Menlo, monospace',
        fontSize: 14,
        theme: {
          background: '#1E1E1E',
          foreground: '#E0E0E0',
          cursor: '#FFFFFF',
        },
        convertEol: true,
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(terminalRef.current);
      fit.fit();

      setTerminal(term);
      setFitAddon(fit);

      term.writeln("Welcome to CodeWizard Terminal");
      term.writeln("-----------------------------");
      term.writeln(serverMessage);

      if (isConnected) {
        term.writeln("Connected to server. Ready to execute commands.");
      } else {
        term.writeln("Please connect to a server to start a session.");
      }

      term.writeln("");
      term.write("$ ");

      // Buffer for current line input
      let currentLineBuffer = "";

      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        // If currently processing a command, ignore key events
        if (isProcessingCommand) {
          return;
        }

        if (domEvent.keyCode === 13) { // Enter key
          // Save command to history if it's not empty
          const command = currentLineBuffer.trim();
          if (command) {
            setCommandHistory(prev => [...prev, command]);
            executeCommand(command);
            currentLineBuffer = "";
            setHistoryIndex(-1);
          } else {
            term.writeln("");
            term.write("$ ");
          }
        } else if (domEvent.keyCode === 8) { // Backspace
          if (currentLineBuffer.length > 0) {
            currentLineBuffer = currentLineBuffer.slice(0, -1);
            term.write("\b \b");
          }
        } else if (domEvent.keyCode === 38) { // Up arrow - history navigation
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          if (newIndex >= 0 && commandHistory.length > 0) {
            // Clear current line
            term.write("\r$ " + " ".repeat(currentLineBuffer.length) + "\r$ ");
            
            const historyCommand = commandHistory[commandHistory.length - 1 - newIndex];
            currentLineBuffer = historyCommand;
            term.write(historyCommand);
            setHistoryIndex(newIndex);
          }
        } else if (domEvent.keyCode === 40) { // Down arrow - history navigation
          const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
          
          // Clear current line
          term.write("\r$ " + " ".repeat(currentLineBuffer.length) + "\r$ ");
          
          if (newIndex >= 0) {
            const historyCommand = commandHistory[commandHistory.length - 1 - newIndex];
            currentLineBuffer = historyCommand;
            term.write(historyCommand);
          } else {
            currentLineBuffer = "";
          }
          setHistoryIndex(newIndex);
        } else if (printable) {
          currentLineBuffer += key;
          term.write(key);
        }
      });
      
      // Cleanup function
      return () => {
        term.dispose();
      };
    }

    // Handle resize
    const handleResize = () => {
      if (fitAddon) {
        setTimeout(() => {
          fitAddon.fit();
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isConnected, serverMessage, terminal, commandHistory, historyIndex, executeCommand, isProcessingCommand]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between rounded-t-lg bg-terminal-background p-2">
        <div className="flex items-center gap-2 text-terminal-foreground">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div ref={terminalRef} className="terminal-container bg-terminal-background" />
    </div>
  );
}
