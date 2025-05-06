
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Zap, Terminal as TerminalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendChatCompletion, isShellCommand } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export function AiChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your AI assistant. How can I help you with your terminal or code tasks today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("llama2"); // Default model
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Generate a random ID for the message
    const userId = `user-${Date.now()}`;
    const botId = `assistant-${Date.now()}`;
    
    // Add user message
    const userMessage = {
      id: userId,
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Check if input is a shell command
      const isCommand = isShellCommand(input);
      let responseContent = "";

      if (isCommand) {
        responseContent = `I detected that you're trying to run the command: \`${input}\`\n\nWould you like me to run this command for you?`;
      } else {
        // Connect to real Ollama API
        const messagesForAPI = messages
          .filter(msg => msg.id !== "welcome") // Filter out the welcome message
          .map(({ role, content }) => ({ role, content }));
        
        // Add the new user message
        messagesForAPI.push({
          role: "user",
          content: input
        });
        
        // Add a system message to provide context
        if (messagesForAPI.length === 1) {
          messagesForAPI.unshift({
            role: "system",
            content: "You are an AI assistant for a terminal application. You can help with coding questions, terminal commands, and general assistance. Be concise and helpful."
          });
        }

        try {
          const response = await sendChatCompletion(messagesForAPI, model);
          if (response && response.message && response.message.content) {
            responseContent = response.message.content;
          } else {
            throw new Error("Invalid response format from Ollama");
          }
        } catch (error) {
          console.error("Error from Ollama API:", error);
          responseContent = "Sorry, I encountered an error while processing your request. Please check your Ollama configuration and ensure the service is running.";
          
          toast({
            title: "Connection Error",
            description: "Failed to connect to Ollama API. Please check your configuration.",
            variant: "destructive",
          });
        }
      }
      
      const assistantMessage = {
        id: botId,
        role: "assistant" as const,
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col space-y-2 rounded-lg p-4",
              message.role === "user"
                ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                : "mr-auto max-w-[80%] bg-secondary"
            )}
          >
            <div className="flex items-center space-x-2">
              {message.role === "assistant" ? (
                <Bot className="h-4 w-4" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-primary-foreground flex items-center justify-center">
                  <span className="text-xs font-medium">U</span>
                </div>
              )}
              <span className="text-xs font-medium">
                {message.role === "assistant" ? "AI" : "You"}
              </span>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="mr-auto max-w-[80%] rounded-lg bg-secondary p-4">
            <div className="flex space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            className="flex-1 rounded-full"
            placeholder="Ask something or type a command... (Ctrl+I)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button size="icon" className="rounded-full" onClick={handleSend} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <TerminalIcon className="mr-1 h-3 w-3" />
            <span>Terminal commands supported</span>
          </div>
          <span>Ctrl+I to activate</span>
        </div>
      </div>
    </div>
  );
}
