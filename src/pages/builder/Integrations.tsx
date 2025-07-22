import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Integrations = () => {
  const integrations = [
    { name: "OpenAI", status: "Connected", type: "AI" },
    { name: "Stripe", status: "Available", type: "Payment" },
    { name: "GitHub", status: "Available", type: "Development" },
    { name: "Slack", status: "Available", type: "Communication" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <ThemeToggle />
      </div>
      
      <div className="p-6">
        <p className="text-muted-foreground mb-6">
          Connect your favorite tools and services to enhance your app building experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.name} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{integration.name}</h3>
                <Badge variant={integration.status === "Connected" ? "default" : "secondary"}>
                  {integration.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{integration.type}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;