
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams, Outlet, useLocation } from "react-router-dom";
import { Send, Smartphone, RefreshCw, Paperclip, Share, Monitor, Puzzle, Code2, FileText, Folder, FolderOpen } from "lucide-react";
import { BuilderSidebar } from "@/components/BuilderSidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { supabase } from "@/integrations/supabase/client";
import GeneratedAppRenderer from "./GeneratedAppRenderer";

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
  const [generatedApp, setGeneratedApp] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState("Home");
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'assistant', content: string}>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsGenerating(true);
      setPromptCount(prev => prev + 1);
      
      // Add user message to chat
      const userMessage = inputValue;
      setChatHistory(prev => [...prev, { type: 'user', content: userMessage }]);
      setInputValue("");

      try {
        // Call the AI app generator
        const { data, error } = await supabase.functions.invoke('generate-app', {
          body: { prompt: userMessage }
        });

        if (error) {
          console.error('Error generating app:', error);
          setChatHistory(prev => [...prev, { 
            type: 'assistant', 
            content: `Error generating app: ${error.message}` 
          }]);
          setAppContent({
            title: "Generation failed",
            subtitle: "Please try again with a different prompt."
          });
        } else {
          // Successfully generated app
          setGeneratedApp(data);
          setCurrentPage(data.pages[0]?.name || "Home");
          setChatHistory(prev => [...prev, { 
            type: 'assistant', 
            content: `✅ Generated your ${userMessage} app! It includes ${data.pages.length} pages: ${data.pages.map(p => p.name).join(', ')}. ${data.summary}` 
          }]);
          setAppContent({
            title: data.pages[0]?.name || "Your App",
            subtitle: data.summary || "App generated successfully!"
          });
        }
      } catch (err) {
        console.error('Failed to generate app:', err);
        setChatHistory(prev => [...prev, { 
          type: 'assistant', 
          content: "Failed to generate app. Please check your connection and try again." 
        }]);
        setAppContent({
          title: "Connection failed",
          subtitle: "Please check your connection and try again."
        });
      }

      setIsGenerating(false);
    }
  };

  const handleReload = () => {
    setAppContent({
      title: "Your app starts here",
      subtitle: "In just a moment, you'll see your app begin to take shape."
    });
    setGeneratedApp(null);
    setCurrentPage("Home");
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
              
              {chatHistory.map((message, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary/10 text-primary ml-4' 
                    : 'bg-muted text-muted-foreground mr-4'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
              
              {isGenerating && (
                <div className="bg-accent/10 p-3 rounded-lg mr-4">
                  <p className="text-sm text-accent">🤖 Generating your functional app...</p>
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
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          <span>src</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" />
                            <span>components</span>
                          </div>
                          {generatedApp?.components && Object.keys(generatedApp.components).map(comp => (
                            <div key={comp} className="ml-6 flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>{comp}.tsx</span>
                            </div>
                          ))}
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4" />
                            <span>pages</span>
                          </div>
                          {generatedApp?.pages && generatedApp.pages.map(page => (
                            <div key={page.name} className="ml-6 flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>{page.name}.tsx</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Code Content */}
                    <div className="flex-1 p-4">
                      {generatedApp ? (
                        <div className="h-full bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto">
                          <div className="mb-4">
                            <div className="text-yellow-400 mb-2">-- Generated Database Schema</div>
                            <pre className="whitespace-pre-wrap">{generatedApp.schema_sql}</pre>
                          </div>
                          <div className="mt-6">
                            <div className="text-yellow-400 mb-2">-- Generated Components</div>
                            {Object.entries(generatedApp.components).map(([name, code]) => (
                              <div key={name} className="mb-4">
                                <div className="text-blue-300 mb-2">{name}.tsx</div>
                                <pre className="whitespace-pre-wrap text-white">{code}</pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full bg-muted/10 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No app generated yet</p>
                            <p className="text-sm">Start building to see your code here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* iPhone Frame */
                <div className="relative w-[300px] h-[650px] bg-black rounded-[50px] p-2 shadow-2xl">
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
                        <div className="w-6 h-3 border border-black rounded-sm relative ml-1">
                          <div className="w-4.5 h-2 bg-green-500 rounded-sm absolute left-0.5 top-0.5"></div>
                          <div className="w-0.5 h-1.5 bg-black rounded-sm absolute -right-1 top-0.75"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Content Area */}
                    <div className="absolute top-12 left-0 right-0 bottom-12 flex flex-col overflow-hidden">
                      {generatedApp ? (
                        <>
                          {/* Functional App Content */}
                          <div className="flex-1 p-4 overflow-y-auto">
                            <GeneratedAppRenderer 
                              app={generatedApp}
                              currentPage={currentPage}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                          
                          {/* Page Navigation */}
                          <div className="border-t bg-gray-50 p-2">
                            <div className="flex justify-center gap-1">
                              {generatedApp.pages.map((page: any) => (
                                <button
                                  key={page.name}
                                  onClick={() => setCurrentPage(page.name)}
                                  className={`px-2 py-1 text-xs rounded transition-colors ${
                                    currentPage === page.name
                                      ? 'bg-blue-500 text-white'
                                      : 'text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {page.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 px-4">
                          <Smartphone className="h-10 w-10 text-gray-400" />
                          <h3 className="text-base font-semibold text-black">{appContent.title}</h3>
                          <p className="text-xs text-gray-500 px-2">{appContent.subtitle}</p>
                          {isGenerating && (
                            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
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
