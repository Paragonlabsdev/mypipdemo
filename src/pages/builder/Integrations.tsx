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
  });
  
  const integrations = [
    { 
      name: "Supabase", 
      category: "Backend as a Service",
      description: "Open source Firebase alternative with real-time database, authentication, and storage",
      logo: "data:image/svg+xml,%3csvg width='109' height='113' viewBox='0 0 109 113' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z' fill='url(%23paint0_linear)'/%3e%3cpath d='M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z' fill='url(%23paint1_linear)' fill-opacity='0.2'/%3e%3cpath d='M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z' fill='%233ECF8E'/%3e%3cdefs%3e%3clinearGradient id='paint0_linear' x1='53.9738' y1='54.974' x2='94.1635' y2='71.8295' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='%23249361'/%3e%3cstop offset='1' stop-color='%233ECF8E'/%3e%3c/linearGradient%3e%3clinearGradient id='paint1_linear' x1='36.1558' y1='30.578' x2='54.4844' y2='65.0806' gradientUnits='userSpaceOnUse'%3e%3cstop/%3e%3cstop offset='1' stop-opacity='0'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
      iconColor: "text-white",
    },
    { 
      name: "Firebase", 
      category: "Backend as a Service", 
      description: "Google's comprehensive platform for building web and mobile applications",
      logo: "data:image/svg+xml,%3csvg width='256' height='351' viewBox='0 0 256 351' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1.253 280.732L1.605 221.438L75.653 89.378C77.241 86.653 81.853 86.653 83.441 89.378L139.597 189.032L1.253 280.732Z' fill='%23FFC24A'/%3e%3cpath d='M1.253 280.732L1.605 221.438L75.653 89.378C77.241 86.653 81.853 86.653 83.441 89.378L139.597 189.032L1.253 280.732Z' fill='%23FFC24A'/%3e%3cpath d='M1.253 280.732L45.043 89.378C46.631 86.653 51.243 86.653 52.831 89.378L139.597 189.032L1.253 280.732Z' fill='%23FF8F00'/%3e%3cpath d='M139.598 189.032L177.455 37.073C179.043 34.348 183.655 34.348 185.243 37.073L254.95 189.032H139.598Z' fill='%23FF3270'/%3e%3cpath d='M139.598 189.032L177.455 37.073C179.043 34.348 183.655 34.348 185.243 37.073L254.95 189.032L213.47 212.979C206.734 216.881 198.714 216.881 191.978 212.979L139.598 189.032Z' fill='%23C31162'/%3e%3cpath d='M45.043 89.378L1.253 280.732L213.47 212.979C220.206 209.077 228.226 209.077 234.962 212.979L254.95 189.032L139.597 189.032L45.043 89.378Z' fill='%23FF8F00'/%3e%3c/svg%3e",
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      iconColor: "text-white",
    },
    { 
      name: "n8n", 
      category: "Workflow Automation",
      description: "Powerful workflow automation tool for connecting apps and automating tasks",
      logo: "data:image/svg+xml,%3csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cg clip-path='url(%23clip0_1_2)'%3e%3cpath d='M32.6667 20C32.6667 27.3638 26.6971 33.3333 19.3333 33.3333C11.9695 33.3333 6 27.3638 6 20C6 12.6362 11.9695 6.66667 19.3333 6.66667C26.6971 6.66667 32.6667 12.6362 32.6667 20Z' fill='%23FF6D37'/%3e%3cpath d='M19.3333 3.33333C30.0243 3.33333 38.6667 11.9757 38.6667 22.6667C38.6667 33.3576 30.0243 42 19.3333 42C8.64238 42 0 33.3576 0 22.6667C0 11.9757 8.64238 3.33333 19.3333 3.33333ZM19.3333 6.66667C10.4829 6.66667 3.33333 13.8162 3.33333 22.6667C3.33333 31.5171 10.4829 38.6667 19.3333 38.6667C28.1838 38.6667 35.3333 31.5171 35.3333 22.6667C35.3333 13.8162 28.1838 6.66667 19.3333 6.66667Z' fill='%23EA4F33'/%3e%3cpath d='M19.3333 0C30.0243 0 38.6667 8.64238 38.6667 19.3333C38.6667 30.0243 30.0243 38.6667 19.3333 38.6667C8.64238 38.6667 0 30.0243 0 19.3333C0 8.64238 8.64238 0 19.3333 0ZM19.3333 3.33333C10.4829 3.33333 3.33333 10.4829 3.33333 19.3333C3.33333 28.1838 10.4829 35.3333 19.3333 35.3333C28.1838 35.3333 35.3333 28.1838 35.3333 19.3333C35.3333 10.4829 28.1838 3.33333 19.3333 3.33333Z' fill='%23FF6D37'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='clip0_1_2'%3e%3crect width='40' height='40' fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
      bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
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