import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-foreground">
        MyPip
      </Link>
      
      <div className="flex items-center gap-4">
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