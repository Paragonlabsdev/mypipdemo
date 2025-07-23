import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams, Outlet, useLocation } from "react-router-dom";
import { Send, Smartphone, RefreshCw, Paperclip, Share, Monitor, Puzzle, Code2, FileText, Folder, FolderOpen } from "lucide-react";
import { BuilderSidebar } from "@/components/BuilderSidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import AgenticAppBuilder from "@/components/AgenticAppBuilder";

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
  const [showCodeView, setShowCodeView] = useState(false);
  const [promptCount, setPromptCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsGenerating(true);
      setPromptCount(prev => prev + 1);
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
        <BuilderSidebar promptCount={promptCount} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-hero-bg flex">
      <BuilderSidebar promptCount={promptCount} />
      
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Chat Panel */}
        <Panel defaultSize={25} minSize={20} maxSize={40}>
          <div className="h-screen bg-background border-r border-border flex flex-col">
            <div className="p-4 pb-3">
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

            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="relative bg-muted/30 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Ask myPip..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border-0 bg-transparent pr-12 focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60"
                    disabled={isGenerating}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    disabled={!inputValue.trim() || isGenerating}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    <span>Smart</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
                  </div>
                  <span>{promptCount}/5 left</span>
                </div>
              </div>
            </form>
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-border hover:bg-muted transition-colors" />

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
                <span className="text-sm text-muted-foreground">myPip Builder</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-muted"
                  onClick={() => setShowCodeView(!showCodeView)}
                >
                  <Code2 className="h-4 w-4 mr-1" />
                  {showCodeView ? 'Preview' : 'Code'}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs hover:bg-muted">
                  <Puzzle className="h-4 w-4 mr-1" />
                  Integrations
                </Button>
                <Button variant="ghost" size="sm" className="text-xs hover:bg-muted">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-xs bg-blue-500 text-white hover:bg-blue-600">
                  <Monitor className="h-4 w-4 mr-1" />
                  Preview on device
                </Button>
              </div>
            </div>

            <AgenticAppBuilder />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default AppBuilder;