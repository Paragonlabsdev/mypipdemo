import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams, Outlet, useLocation } from "react-router-dom";
import { Send, Smartphone, RefreshCw, Paperclip, Share, Monitor, Puzzle, Code2, FileText, Folder, FolderOpen } from "lucide-react";
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
  const [showCodeView, setShowCodeView] = useState(false);

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
                  <span>293/350 left</span>
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

            <div className="flex-1 flex items-center justify-center p-8 relative">
              {!showCodeView && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleReload}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-background/80 hover:bg-background"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              
              {showCodeView ? (
                /* Code View */
                <div className="w-full h-full max-w-4xl bg-background rounded-lg border border-border overflow-hidden">
                  <div className="h-full flex">
                    {/* File Tree */}
                    <div className="w-64 bg-muted/20 border-r border-border p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Folder className="h-4 w-4" />
                          <span>.git</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          <span>app</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>_layout.tsx</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>index.tsx</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          <span>assets</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" />
                            <span>fonts</span>
                          </div>
                          <div className="ml-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>SpaceM...</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Folder className="h-4 w-4" />
                            <span>images</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Folder className="h-4 w-4" />
                          <span>convex</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>.env.example</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>.gitignore</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>app.json</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>metro.config.js</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>package.json</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>tsconfig.json</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Code Content */}
                    <div className="flex-1 p-4">
                      <div className="h-full bg-muted/10 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">No app generated yet</p>
                          <p className="text-sm">Start building to see your code here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* iPhone Frame - smaller size to fit viewport */
                <div className="relative w-[300px] h-[650px] bg-black rounded-[50px] p-2 shadow-2xl">
                  {/* iPhone Screen */}
                  <div className="w-full h-full bg-white rounded-[40px] relative overflow-hidden">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-full"></div>
                    
                    {/* Status Bar */}
                    <div className="absolute top-[10px] left-0 right-0 flex justify-between items-center px-6 text-black text-xs font-medium">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-black/40 rounded-full"></div>
                        </div>
                        <div className="w-5 h-2.5 border border-black rounded-sm relative ml-1">
                          <div className="w-3.5 h-1.5 bg-green-500 rounded-sm absolute right-0 top-0.5"></div>
                          <div className="w-0.5 h-1 bg-black rounded-sm absolute -right-1 top-1"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Content Area */}
                    <div className="absolute top-12 left-0 right-0 bottom-6 flex flex-col items-center justify-center text-center space-y-3 px-4">
                      <Smartphone className="h-10 w-10 text-gray-400" />
                      <h3 className="text-base font-semibold text-black">{appContent.title}</h3>
                      <p className="text-xs text-gray-500 px-2">
                        {appContent.subtitle}
                      </p>
                      {isGenerating && (
                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default AppBuilder;