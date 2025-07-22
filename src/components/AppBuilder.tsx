import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Smartphone, RefreshCw } from "lucide-react";

const AppBuilder = () => {
  const [searchParams] = useSearchParams();
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

  return (
    <div className="min-h-screen bg-hero-bg flex">
      {/* Left Sidebar - Chat Interface */}
      <div className="w-80 bg-background border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
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
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask Bloom..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-12"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1 h-8 w-8"
              disabled={!inputValue.trim() || isGenerating}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Smart</span>
            <span>274/350 left</span>
          </div>
        </form>
      </div>

      {/* Main Content - App Preview */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border bg-background flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Daily Task Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleReload}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Reload</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-80 h-[600px] bg-background border-2 border-border rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative shadow-2xl">
            {/* Phone notch simulation */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-foreground rounded-full flex items-center justify-between px-2">
              <span className="text-xs text-background">9:41</span>
              <div className="w-16 h-4 bg-background rounded-full"></div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-background rounded-full"></div>
                <div className="w-1 h-1 bg-background rounded-full"></div>
                <div className="w-1 h-1 bg-background rounded-full"></div>
              </div>
            </div>

            {/* App content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 mt-8">
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
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-foreground rounded-full"></div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;