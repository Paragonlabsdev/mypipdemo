import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";

const Integrations = () => {
  const isMobile = useIsMobile();
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>("");
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    "Supabase": true,
    "Firebase": false,
    "n8n": false,
    "GitHub": true,
  });
  
  const integrations = [
    { 
      name: "Supabase", 
      category: "Backend as a Service",
      description: "Open source Firebase alternative with real-time database, authentication, and storage",
      logo: "https://supabase.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-logo-icon.6ce0f8f2.png&w=64&q=75",
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
      iconColor: "text-white",
    },
    { 
      name: "Firebase", 
      category: "Backend as a Service", 
      description: "Google's comprehensive platform for building web and mobile applications",
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNzEzODkgOS4xMTExMUw2LjY2OTUgNS4xOTlDNi45MzU5NCA0LjY2NjU0IDcuNjQ0MjggNC42NjY1NCA3LjkxMDczIDUuMTk5TDE5Ljk2MDkgMjguMjhMMTQuNTU1NiAzMS4wMDUzTDQuNzEzODkgOS4xMTExMVoiIGZpbGw9IiNGRkNBMjgiLz4KPHBhdGggZD0iTTE5Ljk2MDkgMjguMjhMMTQuNTU1NiAzMS4wMDUzTDQuNzEzODkgOS4xMTExMUw2LjY2OTUgNS4xOTlDNi45MzU5NCA0LjY2NjU0IDcuNjQ0MjggNC42NjY1NCA3LjkxMDczIDUuMTk5TDE5Ljk2MDkgMjguMjhaIiBmaWxsPSIjRkZDQTI4Ii8+CjxwYXRoIGQ9Ik0xMS44ODg5IDEuNzc3NzhMMTMuODQ0NSAyLjUyTDE5Ljk2MDkgMjguMjhMMTQuNTU1NiAzMS4wMDUzTDQuNzEzODkgOS4xMTExMUwxMS44ODg5IDEuNzc3NzhaIiBmaWxsPSIjRkY4RjAwIi8+CjxwYXRoIGQ9Ik00LjcxMzg5IDkuMTExMTFMMTkuOTYwOSAyOC4yOEwyMi4yMjIyIDI2LjY0NDRDMjIuNjQ1IDI2LjM3OCAyMi44ODg5IDI1LjkxMDcgMjIuODg4OSAyNS40MTMzVjEwTDIwLjkzMzMgNi4wODg4OUMyMC43MzMzIDUuNjY2NjcgMjAuMTc3OCA1LjU1NTU2IDE5Ljg0NDQgNS44NDQ0NEw0LjcxMzg5IDkuMTExMTFaIiBmaWxsPSIjRkY4RjAwIi8+Cjwvc3ZnPgo=",
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      iconColor: "text-white",
    },
    { 
      name: "n8n", 
      category: "Workflow Automation",
      description: "Powerful workflow automation tool for connecting apps and automating tasks",
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCAxMkMyNCA1LjM3MjU4IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTggMCAwIDUuMzcyNTggMCAxMkMwIDE4LjYyNzQgNS4zNzI1OCAyNCAxMiAyNFoiIGZpbGw9IiNGRjZEMzciLz4KPHBhdGggZD0iTTEyIDIxLjNDMTcuMTM4NiAyMS4zIDIxLjMgMTcuMTM4NiAyMS4zIDEyQzIxLjMgNi44NjE0NCAxNy4xMzg2IDIuNyAxMiAyLjdDNi44NjE0NCAyLjcgMi43IDYuODYxNDQgMi43IDEyQzIuNyAxNy4xMzg2IDYuODYxNDQgMjEuMyAxMiAyMS4zWiIgZmlsbD0iI0VBNDAzQyIvPgo8L3N2Zz4K",
      bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
      iconColor: "text-white",
    },
    { 
      name: "GitHub", 
      category: "Version Control",
      description: "The world's leading software development platform with Git-based version control",
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDBDNS4zNzQgMCAwIDUuNTA0IDAgMTIuMzA0QzAgMTcuNzQyIDMuNDM4IDIyLjQ1IDguMjA3IDI0LjAyNEM4LjgwNyAyNC4xNCA5LjAyNyAyMy43NCA5LjAyNyAyMy4zOTZDOS4wMjcgMjMuMDY2IDkuMDE1IDIyLjEgOS4wMDcgMjEuMTA0QzUuNjcyIDIxLjgyNCA0Ljk2OCAyMC4wMTYgNC45NjggMjAuMDE2QzQuNDIyIDIwLjcxNSAzLjYzNCAyMS4yODcgMi43MjggMjEuODc0QzIuNzI4IDIxLjg3NCAyLjcyOCAyMS44NzQgMi43MjggMjEuODc0Wk0xMiAwIiBmaWxsPSIjMTgxNzE3Ii8+Cjwvc3ZnPgo=",
      bgColor: "bg-gradient-to-br from-gray-700 to-gray-900",
      iconColor: "text-white",
    },
  ];

  const handleToggle = (integrationName: string) => {
    setToggleStates(prev => ({
      ...prev,
      [integrationName]: !prev[integrationName]
    }));
  };

  const handleAddApi = (integrationName: string) => {
    setSelectedIntegration(integrationName);
    setIsApiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'} border-b border-border`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Integrations</h1>
        <div className="flex items-center gap-4">
          {!isMobile && <ThemeToggle />}
        </div>
      </div>
      
      <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <p className={`text-muted-foreground ${isMobile ? 'mb-4 text-sm' : 'mb-6'}`}>
          Connect your favorite development tools and services to enhance your workflow.
        </p>
        
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {integrations.map((integration) => (
            <Card key={integration.name} className={`${isMobile ? 'p-4' : 'p-6'} hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 rounded-2xl border shadow-sm`}>
              <div className="flex items-start gap-4 mb-4">
                 <div className={`w-16 h-16 rounded-2xl ${integration.bgColor} flex items-center justify-center shadow-lg`}>
                   <img 
                     src={integration.logo} 
                     alt={`${integration.name} logo`}
                     className="w-8 h-8 object-contain"
                     onError={(e) => {
                       e.currentTarget.src = "/placeholder.svg";
                     }}
                   />
                 </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{integration.name}</h3>
                    <button
                      onClick={() => handleToggle(integration.name)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        toggleStates[integration.name] ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          toggleStates[integration.name] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>{integration.category}</p>
                </div>
              </div>
              
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} mb-4 leading-relaxed`}>
                {integration.description}
              </p>
              
               <div className="flex items-center justify-between">
                 <Button
                   onClick={() => handleAddApi(integration.name)}
                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2.5 text-sm font-medium shadow-lg"
                 >
                   Add API
                 </Button>
                 <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                   {toggleStates[integration.name] ? "Connected" : "Available"}
                 </span>
               </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Add API Modal */}
      <Dialog open={isApiModalOpen} onOpenChange={setIsApiModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add API Key for {selectedIntegration}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="Enter your API key" />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsApiModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg"
                onClick={() => {
                  setIsApiModalOpen(false);
                  // Auto-save API key logic would go here
                }}
              >
                Save & Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;