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
    { icon: "🐦", text: "Flappy bird game" },
    { icon: "🍎", text: "Calorie tracking App" },
    { icon: "📸", text: "Instagram style app" },
    { icon: "✅", text: "To-do list" },
  ];

  const handleExampleClick = (text: string) => {
    navigate(`/builder?prompt=${encodeURIComponent(text)}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          from idea to app{" "}
          <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            instantly
          </span>
        </h1>

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
              className="flex items-center gap-2"
            >
              <span>{app.icon}</span>
              {app.text}
            </Button>
          ))}
          <Button variant="pill" className="flex items-center gap-2">
            <span>...</span>
            More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;