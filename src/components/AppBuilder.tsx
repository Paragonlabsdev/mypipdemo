import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Download, Eye, Loader2, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AppBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const { toast } = useToast();

  const generateApp = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your app",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-app-claude', {
        body: { prompt: prompt.trim() }
      });

      if (error) throw error;

      if (data?.success && data?.code) {
        setGeneratedCode(data.code);
        toast({
          title: "Success!",
          description: "Your app has been generated successfully",
        });
      } else {
        throw new Error(data?.error || 'Failed to generate app');
      }
    } catch (error) {
      console.error('App generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate app. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-app.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">MyPip App Builder</h1>
          <p className="text-muted-foreground">
            Powered by Claude Sonnet 3.7 - Describe your app and watch it come to life
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Your App</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe the mobile app you want to create... (e.g., 'A todo list app with categories and dark mode')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
                disabled={isGenerating}
              />
              <Button 
                onClick={generateApp} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating with Claude...
                  </>
                ) : (
                  "Generate App"
                )}
              </Button>
              
              {generatedCode && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCode(!showCode)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showCode ? "Hide Code" : "View Code"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadCode}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mobile Preview</h2>
            <div className="bg-muted rounded-lg p-4">
              <div className="mx-auto bg-white dark:bg-gray-900 rounded-[2rem] border-8 border-gray-800 dark:border-gray-200 shadow-xl max-w-[300px]">
                <div className="rounded-[1.5rem] overflow-hidden bg-white dark:bg-gray-900 h-[600px]">
                  {generatedCode ? (
                    <div className="h-full overflow-auto p-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Smartphone className="h-5 w-5" />
                          <h3 className="font-semibold">Generated App</h3>
                        </div>
                        <p className="text-blue-100 text-sm">Your mobile app is ready!</p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                              App Generated Successfully
                            </h4>
                            <p className="text-green-700 dark:text-green-300 text-sm">
                              Your React component has been created with TypeScript and Tailwind CSS. 
                              Use the "View Code" button to see the full source code or "Download" to save it as a file.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          💡 <strong>Ready to use:</strong> Copy the code and paste it into your React project, or download it as a .tsx file.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-8 text-center">
                      <div>
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Smartphone className="text-white text-2xl" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {isGenerating ? "Claude is generating your app..." : "Your app preview will appear here"}
                        </p>
                        {isGenerating && (
                          <div className="mt-3">
                            <Loader2 className="h-4 w-4 animate-spin mx-auto text-blue-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {showCode && generatedCode && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Code</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
              <code>{generatedCode}</code>
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppBuilder;