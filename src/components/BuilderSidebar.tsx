import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Settings, DollarSign, Puzzle, Layers, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccountDisplay } from "@/components/AccountDisplay";

const sidebarItems = [
  { title: "App Builder", url: "/builder", icon: Zap },
  { title: "Integrations", url: "/builder/integrations", icon: Puzzle },
  { title: "MyPips", url: "/builder/mypips", icon: Layers },
  { title: "Pricing", url: "/builder/pricing", icon: DollarSign },
  { title: "Settings", url: "/builder/settings", icon: Settings },
];

interface BuilderSidebarProps {
  promptCount: number;
}

export const BuilderSidebar = ({ promptCount }: BuilderSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  return (
    <div className={cn(
      "bg-background border-r border-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "p-4 border-b border-border flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && <h2 className="text-lg font-semibold">Navigation</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className={cn("flex-1 p-4", isCollapsed && "flex flex-col items-center")}>
        <ul className={cn("space-y-2", isCollapsed && "flex flex-col items-center")}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isCollapsed && "justify-center w-10 h-10 p-0",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {!isCollapsed && <AccountDisplay promptCount={promptCount} />}
    </div>
  );
};