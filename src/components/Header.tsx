import { Button } from "@/components/ui/button";
import { Moon, Sun, MessageCircle, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";


const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-foreground flex items-center gap-2">
        <img src="/lovable-uploads/14b0fd0b-04a2-4d8d-9fef-e552c8838e85.png" alt="MyPip Logo" className="w-8 h-8" />
        MyPip
      </Link>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="w-9 h-9"
        >
          <a 
            href="https://discord.gg/wyqp2gqy" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Join Discord"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="w-9 h-9"
        >
          <a 
            href="https://docs.lovable.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Documentation"
          >
            <BookOpen className="h-4 w-4" />
          </a>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <Button variant="ghost" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        
        <Button variant="default" asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;