import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Star, Plus } from "lucide-react";

const Integrations = () => {
  const isMobile = useIsMobile();
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  
  const integrations = [
    { 
      name: "Supabase", 
      rating: 4.8,
      category: "IT & Software, Service",
      description: "Open source Firebase alternative for building modern applications",
      jobCount: "2,500+ apps",
      logo: "https://supabase.com/favicon.ico",
      connected: true
    },
    { 
      name: "Firebase", 
      rating: 4.6,
      category: "IT & Software, Service", 
      description: "Google's platform for building web and mobile applications",
      jobCount: "5,000+ apps",
      logo: "https://firebase.google.com/favicon.ico",
      connected: false
    },
    { 
      name: "n8n", 
      rating: 4.5,
      category: "IT & Software, Service",
      description: "Workflow automation tool for connecting apps and automating tasks",
      jobCount: "1,200+ workflows",
      logo: "https://n8n.io/favicon.ico",
      connected: false
    },
    { 
      name: "GitHub", 
      rating: 4.8,
      category: "IT & Software, Service",
      description: "The world's leading software development platform",
      jobCount: "8,000+ repos",
      logo: "https://github.com/favicon.ico",
      connected: true
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className={`flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'} border-b border-border`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Integrations</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsApiModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add API
          </Button>
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
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{integration.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{integration.rating}</span>
                    </div>
                  </div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>{integration.category}</p>
                </div>
              </div>
              
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} mb-4 leading-relaxed`}>
                {integration.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant={integration.connected ? "default" : "secondary"}
                  className={`${isMobile ? 'text-xs' : ''} ${integration.connected ? 'bg-green-100 text-green-800' : ''}`}
                >
                  {integration.connected ? "Connected" : "Available"}
                </Badge>
                <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {integration.jobCount}
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
            <DialogTitle>Add New API Integration</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-name">API Name</Label>
              <Input id="api-name" placeholder="Enter API name" />
            </div>
            
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
              <Button className="flex-1">
                Add Integration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;