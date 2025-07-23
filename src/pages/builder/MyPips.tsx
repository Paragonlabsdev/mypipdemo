import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MyPips = () => {
  const isMobile = useIsMobile();
  
  const pips = [
    { name: "Task Manager", description: "A simple task management app", status: "Active" },
    { name: "Weather App", description: "Real-time weather information", status: "Draft" },
    { name: "Calculator", description: "Basic calculator functionality", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className={`flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'} border-b border-border`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>MyPips</h1>
        {!isMobile && <ThemeToggle />}
      </div>
      
      <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Manage your app projects and templates.
          </p>
          <Button className={isMobile ? 'self-start' : ''} size={isMobile ? 'sm' : 'default'}>
            <Plus className="h-4 w-4 mr-2" />
            New Pip
          </Button>
        </div>
        
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
          {pips.map((pip) => (
            <Card key={pip.name} className={`${isMobile ? 'p-3' : 'p-4'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>{pip.name}</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'}`}>{pip.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 bg-muted rounded ${isMobile ? 'text-xs' : 'text-xs'}`}>{pip.status}</span>
                <Button variant="outline" size={isMobile ? 'sm' : 'sm'}>{isMobile ? 'Edit' : 'Edit'}</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPips;