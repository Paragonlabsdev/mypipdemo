import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";

const Settings = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      <div className={`flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'} border-b border-border`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Settings</h1>
        {!isMobile && <ThemeToggle />}
      </div>
      
      <div className={`${isMobile ? 'p-4' : 'p-6'} max-w-2xl`}>
        <Card className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <h2 className={`font-semibold ${isMobile ? 'text-base mb-3' : 'text-lg mb-4'}`}>Profile Settings</h2>
          
          <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
              <div>
                <Label htmlFor="firstName" className={isMobile ? 'text-sm' : ''}>First Name</Label>
                <Input id="firstName" placeholder="John" className={isMobile ? 'h-10' : ''} />
              </div>
              <div>
                <Label htmlFor="lastName" className={isMobile ? 'text-sm' : ''}>Last Name</Label>
                <Input id="lastName" placeholder="Doe" className={isMobile ? 'h-10' : ''} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className={isMobile ? 'text-sm' : ''}>Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" className={isMobile ? 'h-10' : ''} />
            </div>
            
            <Separator />
            
            <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-md'}`}>Preferences</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className={isMobile ? 'text-sm' : ''}>Email Notifications</Label>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Receive updates about your apps</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className={isMobile ? 'text-sm' : ''}>Auto-save</Label>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Automatically save your work</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-2'}`}>
              <Button size={isMobile ? 'sm' : 'default'} className={isMobile ? 'w-full' : ''}>Save Changes</Button>
              <Button variant="outline" size={isMobile ? 'sm' : 'default'} className={isMobile ? 'w-full' : ''}>Cancel</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;