import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MyPips = () => {
  const pips = [
    { name: "Task Manager", description: "A simple task management app", status: "Active" },
    { name: "Weather App", description: "Real-time weather information", status: "Draft" },
    { name: "Calculator", description: "Basic calculator functionality", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h1 className="text-2xl font-bold">MyPips</h1>
        <ThemeToggle />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Manage your app projects and templates.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Pip
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pips.map((pip) => (
            <Card key={pip.name} className="p-4">
              <h3 className="font-semibold mb-2">{pip.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{pip.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-muted rounded">{pip.status}</span>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPips;