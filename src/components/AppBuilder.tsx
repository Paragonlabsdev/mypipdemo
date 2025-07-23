import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams, Outlet, useLocation } from "react-router-dom";
import { Send, Smartphone, RefreshCw, Paperclip, Share, Monitor, Puzzle, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BuilderSidebar } from "@/components/BuilderSidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const AppBuilder = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isBuilderRoot = location.pathname === "/builder";
  const initialPrompt = searchParams.get("prompt") || "";
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [appContent, setAppContent] = useState({
    title: "Your app starts here",
    subtitle: "In just a moment, you'll see your app begin to take shape."
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsGenerating(true);
      // Simulate app generation
      setTimeout(() => {
        setAppContent({
          title: "App Generated!",
          subtitle: `Your ${inputValue} app is ready to use.`
        });
        setIsGenerating(false);
        setInputValue("");
      }, 2000);
    }
  };

  const handleReload = () => {
    setAppContent({
      title: "Your app starts here",
      subtitle: "In just a moment, you'll see your app begin to take shape."
    });
  };

  if (!isBuilderRoot) {
    return (
      <div className="min-h-screen bg-hero-bg flex">
        <BuilderSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-hero-bg flex">
      <BuilderSidebar />
      
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Chat Panel */}
        <Panel defaultSize={25} minSize={20} maxSize={40}>
          <div className="h-screen bg-background border-r border-border flex flex-col">
            <div className="p-4 pb-3 border-b border-border">
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {initialPrompt && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">{initialPrompt}</p>
                </div>
              )}
              
              {isGenerating && (
                <div className="bg-accent/10 p-3 rounded-lg">
                  <p className="text-sm text-accent">Generating your app...</p>
                </div>
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* Chat messages would go here */}
              <div className="bg-muted/50 rounded-2xl p-4 ml-auto max-w-[80%]">
                <p className="text-sm">Design a fitness app with a bold UI, featuring workout logging and progress tracking.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t-0">
              <div className="bg-background rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-muted-foreground/80 hover:bg-muted/50"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Ask myPip..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border-0 bg-transparent flex-1 focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
                    disabled={isGenerating}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-muted-foreground/80 hover:bg-muted/50"
                    disabled={!inputValue.trim() || isGenerating}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-1.5"
                      >
                        <Puzzle className="h-3 w-3 mr-2" />
                        Integrations
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                          Supabase
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded-sm"></div>
                          GitHub
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                          n8n
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
                    </div>
                    <span>293/350 left</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-border hover:bg-accent transition-colors" />

        {/* Main Content - App Preview */}
        <Panel defaultSize={75} minSize={60}>
          <div className="h-screen flex flex-col">
            <div className="p-4 border-b border-border bg-background flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/f3a0d0db-666c-4a34-b0dd-247f2d32948e.png" 
                  alt="App Preview" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-muted-foreground">App Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Puzzle className="h-4 w-4 mr-1" />
                  Integrations
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-xs bg-blue-500 text-white hover:bg-blue-600">
                  <Monitor className="h-4 w-4 mr-1" />
                  Preview on device
                </Button>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-center pb-16 pt-8 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleReload}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-background/80 hover:bg-background"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Card className="w-80 h-[640px] bg-card border border-border rounded-[2.5rem] p-4 flex flex-col relative shadow-2xl overflow-hidden">
                {/* iPhone-style notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-foreground rounded-b-2xl flex items-center justify-center">
                  <div className="w-12 h-1 bg-background rounded-full opacity-50"></div>
                </div>
                
                {/* Status bar */}
                <div className="flex justify-between items-center pt-8 pb-2 px-4 text-xs text-muted-foreground">
                  <span className="font-medium">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-2 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-2 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-2 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-2 bg-muted-foreground/50 rounded-full"></div>
                    </div>
                    <div className="w-6 h-3 border border-muted-foreground rounded-sm relative ml-1">
                      <div className="w-3 h-2 bg-muted-foreground rounded-sm absolute right-0 top-0"></div>
                    </div>
                  </div>
                </div>

                {/* App content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 bg-background/50 rounded-3xl mx-2 mb-4 border border-border/50">
                  <Smartphone className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">{appContent.title}</h3>
                  <p className="text-sm text-muted-foreground px-4">
                    {appContent.subtitle}
                  </p>
                  {isGenerating && (
                    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-foreground/80 rounded-full"></div>
              </Card>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default AppBuilder;