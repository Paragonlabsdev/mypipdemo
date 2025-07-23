import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useSearchParams, Outlet, useLocation } from "react-router-dom";
import { Send, Smartphone, RefreshCw, Paperclip, Share, Monitor, Puzzle, Code2, FileText, Folder, FolderOpen, Menu, QrCode, ChevronDown, Apple, PlayCircle, Github, Database, Workflow, Flame } from "lucide-react";
import { BuilderSidebar } from "@/components/BuilderSidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Auto-generate app when initial prompt is provided
  useEffect(() => {
    if (initialPrompt && !isGenerating && promptCount === 0) {
      const generateFromInitialPrompt = async () => {
        setIsGenerating(true);
        setPromptCount(1);
        
        // Add initial prompt to chat history
        setChatHistory([{ type: 'user', content: initialPrompt }]);

        try {
          // Call the AI app generator
          const { data, error } = await supabase.functions.invoke('generate-app', {
            body: { prompt: initialPrompt }
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
            // Successfully generated React Native app
            setGeneratedApp(data);
            setChatHistory(prev => [...prev, { 
              type: 'assistant', 
              content: `🎉 Generated your React Native app: ${data.appName}! ${data.summary}\n\n📱 Ready to run with:\n• npm install\n• npx expo start\n• Scan QR code or use simulator` 
            }]);
            setAppContent({
              title: data.appName || "Your React Native App",
              subtitle: data.summary || "React Native app generated successfully!"
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
      };

      generateFromInitialPrompt();
    }
  }, [initialPrompt]);

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
          // Successfully generated React Native app
          setGeneratedApp(data);
          setChatHistory(prev => [...prev, { 
            type: 'assistant', 
            content: `🎉 Generated your React Native app: ${data.appName}! ${data.summary}\n\n📱 Ready to run with:\n• npm install\n• npx expo start\n• Scan QR code or use simulator` 
          }]);
          setAppContent({
            title: data.appName || "Your React Native App",
            subtitle: data.summary || "React Native app generated successfully!"
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
  };

  if (!isBuilderRoot) {
    return (
      <div className="min-h-screen bg-hero-bg flex">
        {isMobile ? (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <div className="flex-1">
              <div className="p-4 bg-background border-b border-border">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>
              <Outlet />
            </div>
            <SheetContent side="left" className="p-0 w-64">
              <BuilderSidebar promptCount={promptCount} />
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <BuilderSidebar promptCount={promptCount} />
            <div className="flex-1">
              <Outlet />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-hero-bg flex">
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <div className="p-4 bg-background border-b border-border flex items-center justify-between">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <span className="text-sm font-medium">myPip Builder</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowCodeView(!showCodeView)}
                >
                  <Code2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Mobile Chat Section */}
            <div className="flex-1 flex flex-col">
              {/* Chat History */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-background">
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
                    <p className="text-sm text-accent">🤖 Generating your app...</p>
                  </div>
                )}
              </div>

              {/* App Preview */}
              <div className="flex-1 flex items-center justify-center p-4 bg-hero-bg">
                {!showCodeView ? (
                  <div className="relative w-full max-w-[280px] h-[500px] bg-black rounded-[40px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[30px] relative overflow-hidden">
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full"></div>
                      
                      <div className="absolute top-[10px] left-0 right-0 flex justify-between items-center px-4 text-black text-xs font-medium">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 border border-black rounded-sm relative">
                            <div className="w-3 h-1 bg-green-500 rounded-sm absolute left-0.5 top-0.5"></div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-10 left-0 right-0 bottom-8 flex flex-col overflow-hidden">
                        {generatedApp ? (
                          <div className="flex-1 p-3 overflow-y-auto">
                            <div className="space-y-2">
                              <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
                                <div className="font-medium text-blue-800 mb-1">📱 {generatedApp.appName}</div>
                                <div className="text-blue-600 text-[10px]">{generatedApp.description}</div>
                              </div>
                              
                              <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
                                <div className="font-medium text-green-800 mb-1">✅ Ready to Install</div>
                                <div className="text-green-600 text-[10px]">
                                  {generatedApp.installInstructions?.slice(0, 2).join(' → ') || 'npm install → npx expo start'}
                                </div>
                              </div>
                              
                              <div className="text-xs bg-purple-50 p-2 rounded border border-purple-200">
                                <div className="font-medium text-purple-800 mb-1">📁 Files Generated</div>
                                <div className="text-purple-600 text-[10px]">
                                  {generatedApp.generatedFiles ? Object.keys(generatedApp.generatedFiles).length : 0} files ready
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-gray-500 p-4">
                              <div className="text-sm font-medium">{appContent.title}</div>
                              <div className="text-xs mt-1">{appContent.subtitle}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-background rounded-lg border border-border overflow-hidden">
                    <div className="h-full p-4">
                    {generatedApp ? (
                        <div className="h-full bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto">
                          <div className="mb-4">
                            <div className="text-yellow-400 mb-2">-- React Native App Files --</div>
                            {generatedApp.generatedFiles && Object.entries(generatedApp.generatedFiles).map(([filename, content]) => (
                              <div key={filename} className="mb-4">
                                <div className="text-blue-400 mb-1">{filename}</div>
                                <pre className="text-gray-300 text-[10px] whitespace-pre-wrap bg-gray-900 p-2 rounded max-h-32 overflow-y-auto">
                                  {typeof content === 'string' ? content.slice(0, 500) + (content.length > 500 ? '...' : '') : JSON.stringify(content, null, 2).slice(0, 500)}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full bg-muted/10 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No app generated yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Input */}
              <div className="p-4 bg-background rounded-3xl border border-border mx-4 mb-4">
                <form onSubmit={handleSubmit}>
                  <div className="relative bg-muted/30 rounded-2xl p-3">
                    <div className="flex items-center gap-2">
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
                  <div className="flex items-center justify-between mt-2 px-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                      <span>Smart</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{promptCount}/5 left</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <SheetContent side="left" className="p-0 w-64">
            <BuilderSidebar promptCount={promptCount} />
          </SheetContent>
        </Sheet>
      ) : (
        <>
          <BuilderSidebar promptCount={promptCount} />
          
          <div className="h-screen bg-background flex">
            {/* Chat Panel */}
            <div className="w-80 bg-background border-r border-border flex flex-col">
              <div className="p-4 pb-3 border-b border-border">
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
                    <p className="text-sm text-accent">🤖 Generating your app...</p>
                  </div>
                )}
              </div>

              {/* Input Section */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Ask Bloom..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="pr-20 border-border"
                      disabled={isGenerating}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Paperclip className="h-3 w-3" />
                      </Button>
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        disabled={!inputValue.trim() || isGenerating}
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                      <span>Smart</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{promptCount}/5 left</span>
                  </div>
                </form>
              </div>
            </div>

            {/* Main Content Panel */}
            <div className="flex-1 bg-hero-bg flex flex-col">
              {/* Top Header */}
              <div className="flex items-center justify-between p-4 bg-background border-b border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <span className="text-sm font-medium">Simple Study Notes</span>
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReload}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Restart
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Preview on device
                  </Button>
                </div>
              </div>
              
              {/* Phone Preview */}
              <div className="flex-1 flex items-center justify-center p-8 bg-hero-bg">
                <div className="relative w-full max-w-[320px] h-[640px] bg-black rounded-[40px] p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[30px] relative overflow-hidden">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black rounded-full"></div>
                    
                    <div className="absolute top-[10px] left-0 right-0 flex justify-between items-center px-4 text-black text-xs font-medium">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-black rounded-sm relative">
                          <div className="w-3 h-1 bg-green-500 rounded-sm absolute left-0.5 top-0.5"></div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-10 left-0 right-0 bottom-8 flex flex-col overflow-hidden">
                      {generatedApp ? (
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="space-y-3">
                            <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="font-medium text-blue-800 mb-2">📱 {generatedApp.appName}</div>
                              <div className="text-blue-600 text-xs">{generatedApp.description}</div>
                            </div>
                            
                            <div className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                              <div className="font-medium text-green-800 mb-2">✅ Ready to Install</div>
                              <div className="text-green-600 text-xs">
                                {generatedApp.installInstructions?.slice(0, 2).join(' → ') || 'npm install → npx expo start'}
                              </div>
                            </div>
                            
                            <div className="text-sm bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <div className="font-medium text-purple-800 mb-2">📁 Files Generated</div>
                              <div className="text-purple-600 text-xs">
                                {generatedApp.generatedFiles ? Object.keys(generatedApp.generatedFiles).length : 0} files ready
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center text-gray-500 p-6">
                            <div className="text-base font-medium mb-2">{appContent.title}</div>
                            <div className="text-sm">{appContent.subtitle}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppBuilder;