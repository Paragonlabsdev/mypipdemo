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
      logo: "https://avatars.githubusercontent.com/u/54469796?s=200&v=4",
    },
    { 
      name: "Firebase", 
      category: "Backend as a Service", 
      description: "Google's comprehensive platform for building web and mobile applications",
      logo: "https://www.gstatic.com/devrel-devsite/prod/v2210deb8920cd4a55bd580441aa58e7853afc04b39a9d9ac4198e1cd7fbe04ef7/firebase/images/touchicon-180.png",
    },
    { 
      name: "n8n", 
      category: "Workflow Automation",
      description: "Powerful workflow automation tool for connecting apps and automating tasks",
      logo: "https://avatars.githubusercontent.com/u/45487711?s=200&v=4",
    },
    { 
      name: "GitHub", 
      category: "Version Control",
      description: "The world's leading software development platform with Git-based version control",
      logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
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
            <Card key={integration.name} className={`${isMobile ? 'p-4' : 'p-6'} hover:shadow-lg transition-shadow`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center border">
                  <img 
                    src={integration.logo} 
                    alt={`${integration.name} logo`}
                    className="w-10 h-10 object-contain"
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
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddApi(integration.name)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
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
            
            <div>
              <Label htmlFor="api-url">Base URL (Optional)</Label>
              <Input id="api-url" placeholder="https://api.example.com" />
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
                className="flex-1"
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