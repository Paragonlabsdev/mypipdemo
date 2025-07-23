import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";


const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/builder?prompt=${encodeURIComponent(inputValue)}`);
      setInputValue(""); // Clear input after navigation
    }
  };

  const exampleApps = [
    { text: "Flappy bird game" },
    { text: "Calorie tracking App" },
    { text: "Instagram style app" },
    { text: "To-do list" },
  ];

  const handleExampleClick = (text: string) => {
    setInputValue(""); // Clear any existing input
    navigate(`/builder?prompt=${encodeURIComponent(text)}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
        <div className="flex flex-col items-center space-y-4 md:space-y-6">
          <img 
            src="/lovable-uploads/14b0fd0b-04a2-4d8d-9fef-e552c8838e85.png" 
            alt="MyPip Logo" 
            className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} pulse-logo`} 
          />
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl lg:text-5xl'} font-normal text-foreground`}>
            From idea to app{" "}
            <span className="font-cursive bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              instantly
            </span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask anything"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`w-full ${isMobile ? 'h-12 px-4 pr-14 text-base' : 'h-14 px-6 pr-16 text-lg'} rounded-2xl border-2 border-border bg-background`}
            />
            <Button
              type="submit"
              size="icon"
              className={`absolute ${isMobile ? 'right-1 top-1 h-10 w-10' : 'right-2 top-2 h-10 w-10'} rounded-xl bg-foreground hover:bg-foreground/90`}
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4 text-background" fill="currentColor" />
            </Button>
          </div>
        </form>

        {!isMobile && (
          <p className="text-sm text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </p>
        )}

        <div className={`flex flex-wrap justify-center gap-2 md:gap-3 ${isMobile ? 'mt-6' : 'mt-8'}`}>
          {exampleApps.map((app, index) => (
            <Button
              key={index}
              variant="pill"
              onClick={() => handleExampleClick(app.text)}
              className={`bg-muted hover:bg-muted/80 text-foreground ${isMobile ? 'text-sm px-3 py-1' : ''}`}
            >
              {app.text}
            </Button>
          ))}
          <Button 
            variant="pill" 
            className={`bg-muted hover:bg-muted/80 text-foreground flex items-center gap-2 ${isMobile ? 'text-sm px-3 py-1' : ''}`}
          >
            <span>...</span>
            More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;