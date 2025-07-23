import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/builder?prompt=${encodeURIComponent(inputValue)}`);
    }
  };

  const exampleApps = [
    { text: "Flappy bird game" },
    { text: "Calorie tracking App" },
    { text: "Instagram style app" },
    { text: "To-do list" },
  ];

  const handleExampleClick = (text: string) => {
    navigate(`/builder?prompt=${encodeURIComponent(text)}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <img src="/lovable-uploads/14b0fd0b-04a2-4d8d-9fef-e552c8838e85.png" alt="MyPip Logo" className="w-24 h-24" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground">
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
              className="w-full h-14 px-6 pr-16 text-lg rounded-2xl border-2 border-border bg-background"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-muted hover:bg-muted/80"
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <p className="text-sm text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {exampleApps.map((app, index) => (
            <Button
              key={index}
              variant="pill"
              onClick={() => handleExampleClick(app.text)}
              className="bg-muted hover:bg-muted/80 text-foreground"
            >
              {app.text}
            </Button>
          ))}
          <Button variant="pill" className="bg-muted hover:bg-muted/80 text-foreground flex items-center gap-2">
            <span>...</span>
            More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;