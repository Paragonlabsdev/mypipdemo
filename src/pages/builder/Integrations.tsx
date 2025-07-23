import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const Integrations = () => {
  const isMobile = useIsMobile();
  
  const integrations = [
    { name: "OpenAI", status: "Connected", type: "AI" },
    { name: "Stripe", status: "Available", type: "Payment" },
    { name: "GitHub", status: "Available", type: "Development" },
    { name: "Slack", status: "Available", type: "Communication" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className={`flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'} border-b border-border`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Integrations</h1>
        {!isMobile && <ThemeToggle />}
      </div>
      
      <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <p className={`text-muted-foreground ${isMobile ? 'mb-4 text-sm' : 'mb-6'}`}>
          Connect your favorite tools and services to enhance your app building experience.
        </p>
        
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
          {integrations.map((integration) => (
            <Card key={integration.name} className={`${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>{integration.name}</h3>
                <Badge 
                  variant={integration.status === "Connected" ? "default" : "secondary"}
                  className={isMobile ? 'text-xs' : ''}
                >
                  {integration.status}
                </Badge>
              </div>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{integration.type}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;