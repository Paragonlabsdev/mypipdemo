import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Settings, DollarSign, Puzzle, Layers, ChevronLeft, ChevronRight, Zap, User, Users, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccountDisplay } from "@/components/AccountDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sidebarItems = [
  { title: "Integrations", url: "/builder/integrations", icon: Puzzle },
  { title: "MyPips", url: "/builder/mypips", icon: Layers },
  { title: "Pricing", url: "/builder/pricing", icon: DollarSign },
  { title: "Affiliate", url: "/builder/affiliate", icon: Users },
  { title: "Settings", url: "/builder/settings", icon: Settings },
];

interface BuilderSidebarProps {
  promptCount: number;
}

export const BuilderSidebar = ({ promptCount }: BuilderSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [showMyPips, setShowMyPips] = useState(false);
  const [projects] = useState([
    { id: 1, name: "Flappy Bird Game", lastModified: "2 hours ago" },
    { id: 2, name: "Calorie Tracker", lastModified: "1 day ago" },
    { id: 3, name: "Todo App", lastModified: "3 days ago" },
  ]);
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <nav className={cn("flex-1 p-4", isCollapsed && "flex flex-col items-center")}>
        <div className={cn("mb-4", isCollapsed && "flex justify-center")}>
          <Button
            onClick={() => setIsNewProjectModalOpen(true)}
            className={cn(
              "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg",
              isCollapsed ? "w-10 h-10 rounded-full p-0" : "w-full rounded-xl"
            )}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">New Project</span>}
          </Button>
        </div>

        <div className={cn("mb-4", isCollapsed && "flex justify-center")}>
          <NavLink
            to="/builder"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full",
              isCollapsed && "justify-center w-10 h-10 p-0",
              location.pathname === "/builder"
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>App Builder</span>}
          </NavLink>
        </div>
        
        <ul className={cn("space-y-2", isCollapsed && "flex flex-col items-center")}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.url;
            
            // Special handling for MyPips to show projects dropdown
            if (item.title === "MyPips" && !isCollapsed) {
              return (
                <li key={item.title} className="w-full">
                  <button 
                    onClick={() => setShowMyPips(!showMyPips)}
                    className={cn(
                      "flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>MyPips</span>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 transition-transform", showMyPips && "rotate-90")} />
                  </button>
                  {showMyPips && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {projects.map((project) => (
                        <li key={project.id}>
                          <button 
                            onClick={() => {
                              // Navigate to builder with project data
                              window.location.href = "/builder";
                            }}
                            className="flex items-center gap-2 px-2 py-1 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full text-left"
                          >
                            <FileText className="h-3 w-3" />
                            <span className="truncate">{project.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }
            
            if (item.title === "MyPips" && isCollapsed) {
              return (
                <li key={item.title}>
                  <button
                    onClick={() => setShowMyPips(!showMyPips)}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 p-0 rounded-lg transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                  </button>
                </li>
              );
            }
            
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
      
      {isCollapsed && (
        <div className="p-2 border-t border-border flex justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
      
      {/* New Project Modal */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="My Awesome App" />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsNewProjectModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl"
                onClick={() => {
                  setIsNewProjectModalOpen(false);
                  window.location.href = "/builder";
                }}
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};