import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Outlet, useLocation } from "react-router-dom";
import { Send, Smartphone, RefreshCw, Paperclip, Share, Monitor, Puzzle, Code2, FileText, Folder, FolderOpen, Menu, QrCode, ChevronDown, Apple, PlayCircle, Github, Database, Workflow, Flame, User } from "lucide-react";
import { BuilderSidebar } from "@/components/BuilderSidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PreviewDeviceModal } from "@/components/PreviewDeviceModal";
import { AccountModal } from "@/components/AccountModal";
import { validateInput } from "@/lib/security";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import React from "react";

// Helper function to get user IP
const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
};

// Helper function to generate project name
const generateProjectName = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-project-name', {
      body: { prompt }
    });
    
    if (error) throw error;
    return data?.projectName || `Project ${Date.now()}`;
  } catch (error) {
    console.error('Error generating project name:', error);
    return `Project ${Date.now()}`;
  }
};

// Component to render generated HTML code
const HtmlRenderer = ({ htmlCode }: { htmlCode: string }) => {
  if (!htmlCode) return null;

  // Inject viewport meta tag and styling to ensure proper mobile scaling
  const enhancedHtml = htmlCode.replace(
    /<head>/i,
    `<head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { box-sizing: border-box; }
        html, body { 
          margin: 0; 
          padding: 0; 
          width: 100%; 
          height: 100vh; 
          overflow-x: hidden;
          font-size: 14px;
        }
        body { 
          display: flex; 
          flex-direction: column;
          min-height: 100vh;
        }
        .container, .main, .app { 
          flex: 1; 
          display: flex; 
          flex-direction: column;
          max-width: 100%;
        }
      </style>`
  );

  return (
    <iframe
      srcDoc={enhancedHtml}
      className="w-full h-full border-none"
      sandbox="allow-scripts allow-same-origin allow-forms"
      title="Generated App Preview"
      style={{ pointerEvents: 'auto' }}
    />
  );
};

const AppBuilder = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isBuilderRoot = location.pathname === "/builder";
  const initialPrompt = searchParams.get("prompt") || "";
  const [inputValue, setInputValue] = useState("");
  const [promptCount, setPromptCount] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'assistant', content: string}>>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Handle initial prompt and saved project loading
  useEffect(() => {
    const savedCode = searchParams.get("code");
    const projectId = searchParams.get("projectId");
    
    // If loading a saved project
    if (savedCode && projectId) {
      setGeneratedCode(savedCode);
      if (initialPrompt) {
        const validatedPrompt = validateInput(initialPrompt.trim());
        setChatHistory([
          { type: 'user', content: validatedPrompt },
          { type: 'assistant', content: "I've loaded your saved project! You can see the preview in the phone mockup." }
        ]);
        setPromptCount(1);
      }
    } else if (initialPrompt && promptCount === 0) {
      // Auto-generate new app from initial prompt
      const validatedPrompt = validateInput(initialPrompt.trim());
      setChatHistory([{ type: 'user', content: validatedPrompt }]);
      setPromptCount(1);
      generateApp(validatedPrompt);
    }
  }, [initialPrompt, searchParams]);

  const generateApp = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Step 1: Enhance the prompt with Claude Sonnet 3.7
      const { data: enhanceData, error: enhanceError } = await supabase.functions.invoke('enhance-prompt-claude', {
        body: { prompt: prompt.trim() }
      });

      if (enhanceError) throw enhanceError;

      const enhancedPrompt = enhanceData?.enhancedPrompt || prompt.trim();

      // Step 2: Generate app with the enhanced prompt
      const { data, error } = await supabase.functions.invoke('generate-app-claude', {
        body: { prompt: enhancedPrompt }
      });

      if (error) throw error;

      if (data?.success && data?.code) {
        setGeneratedCode(data.code);
        
        // Step 3: Save project to database
        try {
          const userIP = await getUserIP();
          const projectName = await generateProjectName(prompt);
          
          await supabase.functions.invoke('save-project', {
            body: {
              projectName,
              prompt: prompt.trim(),
              generatedCode: data.code,
              userIP
            }
          });
        } catch (saveError) {
          console.error('Failed to save project:', saveError);
          // Don't fail the whole generation if saving fails
        }

        setChatHistory(prev => [...prev, { 
          type: 'assistant', 
          content: "I've generated your mobile app! You can see the preview in the phone mockup and download the code if needed." 
        }]);
        toast({
          title: "Success!",
          description: "Your app has been generated successfully",
        });
      } else {
        throw new Error(data?.error || 'Failed to generate app');
      }
    } catch (error) {
      console.error('App generation error:', error);
      setChatHistory(prev => [...prev, { 
        type: 'assistant', 
        content: `Sorry, I couldn't generate your app: ${error.message}. Please try again.` 
      }]);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate app. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      try {
        // Validate input before processing
        const validatedInput = validateInput(inputValue.trim());
        
        setPromptCount(prev => prev + 1);
        
        // Add user message to chat
        setChatHistory(prev => [...prev, { type: 'user', content: validatedInput }]);
        setInputValue("");

        // Generate app with Claude
        await generateApp(validatedInput);
      } catch (validationError: any) {
        // Handle validation errors
        setChatHistory(prev => [...prev, { 
          type: 'assistant', 
          content: `Input validation failed: ${validationError.message}` 
        }]);
      }
    }
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
                <Button variant="ghost" size="sm" className="text-xs">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Mobile Chat Section */}
            <div className="flex-1 flex flex-col">
              {/* Chat History */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-background">
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
                   <div className="bg-muted text-muted-foreground mr-4 p-3 rounded-lg">
                     <p className="text-sm">myPip is building your app...</p>
                   </div>
                 )}
              </div>

              {/* App Preview */}
              <div className="flex-1 flex items-center justify-center p-4 bg-hero-bg">
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
                     <div className="flex-1 bg-white">
                       {generatedCode ? (
                         <div className="w-full h-full overflow-auto">
                           <HtmlRenderer htmlCode={generatedCode} />
                         </div>
                        ) : isGenerating ? (
                          <div className="flex flex-1 items-center justify-center h-full">
                            <div className="text-center text-gray-600">
                              <img 
                                src="/lovable-uploads/1a2e7b31-f804-4664-91f0-25cdce4a91f0.png" 
                                alt="Loading" 
                                className="w-12 h-12 mx-auto mb-3 breathe-animation"
                              />
                              <div className="text-xs font-medium">Generating...</div>
                              <div className="text-xs mt-1">myPip is building your app</div>
                            </div>
                          </div>
                       ) : (
                         <div className="flex flex-1 items-center justify-center h-full">
                           <div className="text-center text-gray-500">
                             <div className="text-xs font-medium">Ready to Build</div>
                             <div className="text-xs mt-1">Enter your app idea below</div>
                           </div>
                         </div>
                       )}
                     </div>
                     </div>
                  </div>
                </div>
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
                 <div className="bg-muted text-muted-foreground mr-4 p-3 rounded-lg">
                   <p className="text-sm">myPip is building your app...</p>
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
                {generatedCode && (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'generated-app.tsx';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Code2 className="h-4 w-4 mr-1" />
                    View Code
                  </Button>
                )}
                
                 <Popover>
                   <PopoverTrigger asChild>
                     <Button variant="ghost" size="sm" className="text-xs hover:bg-gray-200 dark:hover:bg-gray-700">
                       <Puzzle className="h-4 w-4" />
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-80 p-4" align="end">
                     <div className="space-y-4">
                       <h3 className="font-semibold text-sm">Integrations</h3>
                       <div className="space-y-3">
                         <div 
                           className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                           onClick={() => { setSelectedIntegration("GitHub"); setIsApiModalOpen(false); }}
                         >
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                               <Github className="h-4 w-4 text-white" />
                             </div>
                             <span className="text-sm font-medium">GitHub</span>
                           </div>
                           <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">Connect</Button>
                         </div>
                         <div 
                           className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                           onClick={() => { setSelectedIntegration("Supabase"); setIsApiModalOpen(true); }}
                         >
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                               <Database className="h-4 w-4 text-white" />
                             </div>
                             <span className="text-sm font-medium">Supabase</span>
                           </div>
                           <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">Add API</Button>
                         </div>
                       </div>
                     </div>
                   </PopoverContent>
                 </Popover>

                 <Popover>
                   <PopoverTrigger asChild>
                     <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm shadow-lg">
                       Publish
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-48 p-2" align="end">
                     <div className="space-y-2">
                       <Button variant="ghost" className="w-full justify-start text-left">
                         <Apple className="h-4 w-4 mr-2 text-blue-500" />
                         iOS App Store
                       </Button>
                       <Button variant="ghost" className="w-full justify-start text-left">
                         <PlayCircle className="h-4 w-4 mr-2 text-green-500" />
                         Google Play Store
                       </Button>
                     </div>
                   </PopoverContent>
                 </Popover>

                 <Button 
                   onClick={() => setIsPreviewModalOpen(true)}
                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm shadow-lg"
                 >
                   <Monitor className="h-4 w-4 mr-1" />
                   Preview on device
                 </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 rounded-full p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end" side="bottom">
                      <AccountModal isOpen={true} onOpenChange={() => {}} />
                    </PopoverContent>
                  </Popover>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 relative">
              {/* iPhone Frame - bigger size for desktop */}
              <div className="relative w-[380px] h-[780px] bg-black rounded-[50px] p-3 shadow-2xl">
                {/* iPhone Screen */}
                <div className="w-full h-full bg-white rounded-[40px] relative overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full"></div>
                  
                  {/* Status Bar */}
                  <div className="absolute top-[8px] left-0 right-0 flex justify-between items-center px-8 text-black text-sm font-medium">
                    <span>9:41</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-3 border border-black rounded-sm relative">
                        <div className="w-4 h-2 bg-green-500 rounded-sm absolute left-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>

                   {/* App Content Area */}
                   <div className="absolute top-16 left-0 right-0 bottom-12 flex flex-col overflow-hidden bg-white">
                     <div className="flex-1">
                       {generatedCode ? (
                         <div className="w-full h-full overflow-auto">
                           <HtmlRenderer htmlCode={generatedCode} />
                         </div>
                        ) : isGenerating ? (
                          <div className="flex flex-1 items-center justify-center h-full">
                            <div className="text-center text-gray-600">
                              <img 
                                src="/lovable-uploads/1a2e7b31-f804-4664-91f0-25cdce4a91f0.png" 
                                alt="Loading" 
                                className="w-16 h-16 mx-auto mb-3 breathe-animation"
                              />
                              <div className="text-sm font-medium mb-1">Generating...</div>
                              <div className="text-xs text-gray-500">myPip is building your app</div>
                            </div>
                          </div>
                       ) : (
                         <div className="flex flex-1 items-center justify-center h-full">
                           <div className="text-center text-gray-500">
                             <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                               <Smartphone className="text-white text-lg" />
                             </div>
                             <div className="text-sm font-medium mb-1">Ready to Build</div>
                             <div className="text-xs text-gray-500">Enter your app idea in the chat to get started</div>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
        </>
      )}

      <PreviewDeviceModal 
        isOpen={isPreviewModalOpen} 
        onOpenChange={setIsPreviewModalOpen} 
      />
      
      <AccountModal 
        isOpen={isAccountModalOpen} 
        onOpenChange={setIsAccountModalOpen} 
      />

      <Dialog open={isApiModalOpen} onOpenChange={setIsApiModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add {selectedIntegration} API</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" placeholder="Enter your API key" className="mt-1" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsApiModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsApiModalOpen(false)}>
                Add API
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppBuilder;