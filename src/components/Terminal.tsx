
import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Terminal as TerminalIcon } from "lucide-react";
import "xterm/css/xterm.css";

interface TerminalProps {
  isConnected?: boolean;
  serverMessage?: string;
}

export function Terminal({ isConnected = false, serverMessage = "Not connected" }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<XTerm | null>(null);
  const [fitAddon, setFitAddon] = useState<FitAddon | null>(null);

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

      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
          // Enter key
          term.writeln("");
          term.write("$ ");
        } else if (domEvent.keyCode === 8) {
          // Backspace
          if (term.buffer.active.cursorX > 2) {
            term.write("\b \b");
          }
        } else if (printable) {
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
  }, [isConnected, serverMessage, terminal]);

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
