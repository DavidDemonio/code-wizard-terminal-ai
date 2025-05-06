
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Terminal, Code, Server, Bot, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6">
                <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
                  <span className="block">AI-Powered</span>
                  <span className="block text-primary">Terminal & SFTP</span>
                </h1>
                <p className="mt-6 text-xl text-muted-foreground">
                  Access your servers with an intelligent assistant that helps you write better code and execute commands efficiently. Connect via SSH, browse files with SFTP, and get AI assistance all in one place.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <Link to="/login">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Demo Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 lg:col-span-6 flex items-center justify-center">
                <div className="w-full max-w-md p-2 bg-background/50 backdrop-blur-sm rounded-lg border shadow-xl">
                  <div className="rounded-lg bg-black p-2 overflow-hidden">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="font-mono text-sm text-green-400 p-4">
                      <p>$ ssh user@server.example.com</p>
                      <p>Password: ********</p>
                      <p>Welcome to CodeWizard SSH</p>
                      <p>user@server:~$ ls -la</p>
                      <p>total 32</p>
                      <p>drwxr-xr-x 4 user user 4096 May 6 12:34 .</p>
                      <p>drwxr-xr-x 4 user user 4096 May 6 12:34 ..</p>
                      <p>-rw-r--r-- 1 user user  220 May 6 12:34 .bash_profile</p>
                      <p>drwxr-xr-x 2 user user 4096 May 6 12:34 projects</p>
                      <p className="flex items-center">
                        <span className="animate-pulse">▋</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Powerful Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need for efficient development and server management.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Terminal className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">SSH Terminal</h3>
                <p className="mt-2 text-muted-foreground">
                  Access your servers with a full-featured terminal emulator, right in your browser.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">SFTP File Browser</h3>
                <p className="mt-2 text-muted-foreground">
                  Browse, upload, download, and manage files with an intuitive file manager.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">AI Assistant</h3>
                <p className="mt-2 text-muted-foreground">
                  Get help with commands, debugging, and code analysis from our built-in AI.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Smart Command Detection</h3>
                <p className="mt-2 text-muted-foreground">
                  Our AI can recognize commands in your queries and offer to execute them directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Documentation
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Support
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CodeWizard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
