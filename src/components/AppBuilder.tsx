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
                  <p className="text-sm text-accent">🤖 Generating your app...</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-background rounded-3xl border border-border mx-4 mb-4">
              <form onSubmit={handleSubmit}>
                <div className="relative bg-muted/30 rounded-2xl p-3">
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
                      className="h-8 w-8 text-foreground hover:text-foreground/80"
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
                    <span>{promptCount}/5 left</span>
                  </div>
                </div>
              </form>
            </div>
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
                  <Code2 className="h-4 w-4" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-muted">
                      <Puzzle className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm">Integrations</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Github className="h-5 w-5" />
                            <span className="text-sm font-medium">GitHub</span>
                          </div>
                          <Button size="sm" variant="outline">Connect</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5" />
                            <span className="text-sm font-medium">Supabase</span>
                          </div>
                          <Button size="sm" variant="outline">Connect</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Workflow className="h-5 w-5" />
                            <span className="text-sm font-medium">n8n</span>
                          </div>
                          <Button size="sm" variant="outline">Connect</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Flame className="h-5 w-5" />
                            <span className="text-sm font-medium">Firebase</span>
                          </div>
                          <Button size="sm" variant="outline">Connect</Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl px-4 py-2 text-sm">
                      Publish
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Publish App</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Apple className="h-6 w-6" />
                          <div>
                            <div className="font-medium text-sm">Apple App Store</div>
                            <div className="text-xs text-muted-foreground">Publish to iOS</div>
                          </div>
                        </div>
                        <Button size="sm">Publish</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="h-6 w-6" />
                          <div>
                            <div className="font-medium text-sm">Google Play Store</div>
                            <div className="text-xs text-muted-foreground">Publish to Android</div>
                          </div>
                        </div>
                        <Button size="sm">Publish</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl px-4 py-2 text-sm">
                      <Monitor className="h-4 w-4 mr-1" />
                      Preview on device
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        <h3 className="font-semibold text-sm">App Clip Preview</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Scan this QR code with your camera app to open the App Clip instantly.
                      </p>
                      <div className="flex justify-center">
                        <img 
                          src="/lovable-uploads/7c2366f5-f687-427e-a695-2f09dfdea97b.png" 
                          alt="QR Code"
                          className="w-32 h-32 rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        If you experience any issues, try downloading the full app from the App Store.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Page Selector Above Phone */}
            {!showCodeView && generatedApp && (
              <div className="px-8 py-2 bg-background border-b border-border">
                <div className="flex justify-center">
                  <Select value={currentPage} onValueChange={setCurrentPage}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      {generatedApp && generatedApp.pages && generatedApp.pages.map((page: any) => (
                        <SelectItem key={page.name} value={page.name}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

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
                      {generatedApp ? (
                        <div className="h-full bg-gray-900 text-gray-300 p-4 rounded font-mono text-sm overflow-auto">
                          {generatedApp.generatedFiles && Object.entries(generatedApp.generatedFiles).map(([filename, content]) => (
                            <div key={filename} className="mb-6 border-b border-gray-700 pb-4">
                              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-900 py-2">
                                <FileText className="h-4 w-4 text-blue-400" />
                                <span className="text-blue-400 font-medium">{filename}</span>
                              </div>
                              <pre className="text-gray-300 text-xs whitespace-pre-wrap bg-gray-800 p-3 rounded border overflow-x-auto">
                                {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                              </pre>
                            </div>
                          ))}
                          
                          {generatedApp.schema_sql && (
                            <div className="mb-6 border-b border-gray-700 pb-4">
                              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-900 py-2">
                                <FileText className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 font-medium">schema.sql</span>
                              </div>
                              <pre className="text-gray-300 text-xs whitespace-pre-wrap bg-gray-800 p-3 rounded border overflow-x-auto">
                                {generatedApp.schema_sql}
                              </pre>
                            </div>
                          )}
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
                /* iPhone Frame - bigger size for desktop */
                <div className="relative w-[380px] h-[780px] bg-black rounded-[50px] p-3 shadow-2xl">
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
                          {/* Page Content */}
                          <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-3">
                              {(() => {
                                if (!generatedApp || !generatedApp.pages) return null;
                                const currentPageData = generatedApp.pages.find(p => p.name === currentPage);
                                if (!currentPageData) return null;
                                
                                return currentPageData.components?.map((componentName: string, index: number) => {
                                  const component = generatedApp.components?.[componentName];
                                  if (!component) return null;
                                  
                                  switch (component.type) {
                                    case 'card':
                                      return (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                                          <h4 className="font-medium text-sm text-black mb-1">
                                            {component.props?.title || componentName}
                                          </h4>
                                          <p className="text-xs text-gray-600">
                                            {component.props?.description || "Card component"}
                                          </p>
                                        </div>
                                      );
                                    case 'form':
                                      return (
                                        <div key={index} className="bg-white p-3 rounded-lg border shadow-sm">
                                          <h4 className="font-medium text-sm text-black mb-2">{componentName}</h4>
                                          {component.fields?.map((field: string, i: number) => (
                                            <div key={i} className="mb-2">
                                              <label className="text-xs text-gray-600 capitalize">{field}</label>
                                              <div className="bg-gray-100 h-6 rounded border mt-1"></div>
                                            </div>
                                          ))}
                                          <div className="bg-blue-500 text-white text-xs py-1 px-2 rounded text-center mt-2">
                                            {component.props?.submitText || "Submit"}
                                          </div>
                                        </div>
                                      );
                                    case 'list':
                                      return (
                                        <div key={index} className="bg-white rounded-lg border">
                                          <h4 className="font-medium text-sm text-black p-3 border-b">{componentName}</h4>
                                          {[1,2,3].map(item => (
                                            <div key={item} className="p-3 border-b last:border-b-0">
                                              <div className="text-xs text-gray-800">Sample Item {item}</div>
                                              <div className="text-xs text-gray-500">Sample description</div>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                    case 'button':
                                      return (
                                        <div key={index} className="bg-blue-500 text-white text-xs py-2 px-3 rounded text-center">
                                          {component.props?.text || componentName}
                                        </div>
                                      );
                                    default:
                                      return (
                                        <div key={index} className="bg-gray-100 p-2 rounded text-xs text-gray-600">
                                          {componentName} ({component.type})
                                        </div>
                                      );
                                  }
                                });
                              })()}
                            </div>
                          </div>
                          
                          {/* Page Navigation */}
                          <div className="border-t bg-gray-50 p-2">
                            <div className="flex justify-center gap-1">
                              {generatedApp && generatedApp.pages && generatedApp.pages.map((page: any) => (
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
        </>
      )}
    </div>
  );
};

export default AppBuilder;