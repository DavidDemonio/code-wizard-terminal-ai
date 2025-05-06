
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Terminal } from "@/components/Terminal";
import { FileBrowser } from "@/components/FileBrowser";
import { AiChat } from "@/components/AiChat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Server,
  ServerCog,
  Plus,
  X,
  Maximize2,
  Minimize2,
  LayoutPanelLeft,
  MessageSquare,
  MessageSquareOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const [layoutSplit, setLayoutSplit] = useState(true);

  // Handle keyboard shortcuts (Ctrl+I for AI assistant)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+I to toggle AI assistant
      if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        setShowChat(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        {/* Server sidebar */}
        <div
          className={cn(
            "border-r h-[calc(100vh-4rem)] overflow-auto transition-all",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Servers</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {/* Sample servers */}
              <div className="flex items-center p-2 rounded-md bg-secondary">
                <Server className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">Production Server</span>
              </div>
              
              <div className="flex items-center p-2 rounded-md hover:bg-secondary/50">
                <Server className="h-4 w-4 mr-2" />
                <span className="text-sm">Development Server</span>
              </div>
              
              <div className="flex items-center p-2 rounded-md hover:bg-secondary/50">
                <Server className="h-4 w-4 mr-2" />
                <span className="text-sm">Database Server</span>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Settings</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ServerCog className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Toggle sidebar button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background border rounded-r-md rounded-l-none h-12"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col md:flex-row">
          <div className={cn(
            "flex-1 p-4 transition-all duration-300",
            showChat ? "md:w-2/3" : "w-full",
            maximized ? "md:w-full" : ""
          )}>
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl font-bold">Production Server</h1>
                <p className="text-sm text-muted-foreground">user@192.168.1.100</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setLayoutSplit(!layoutSplit)}
                >
                  <LayoutPanelLeft className="h-4 w-4" />
                  {layoutSplit ? "Stack" : "Split"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setShowChat(!showChat)}
                >
                  {showChat ? (
                    <>
                      <MessageSquareOff className="h-4 w-4" />
                      Hide Chat
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      Show Chat
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setMaximized(!maximized)}
                >
                  {maximized ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      Restore
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      Maximize
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className={cn(
              "grid gap-4",
              layoutSplit ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            )}>
              {/* Terminal */}
              <div className="bg-card rounded-lg border shadow-sm p-4">
                <Terminal />
              </div>
              
              {/* File browser */}
              <div className="bg-card rounded-lg border shadow-sm p-4">
                <FileBrowser />
              </div>
            </div>
          </div>
          
          {/* AI Chat sidebar */}
          {showChat && !maximized && (
            <div className="md:w-1/3 border-l md:h-[calc(100vh-4rem)] overflow-auto relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 md:hidden z-10"
                onClick={() => setShowChat(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <AiChat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
