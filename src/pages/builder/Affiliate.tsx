import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const Affiliate = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [customLink, setCustomLink] = useState("mypip-user");
  
  const affiliateLink = `https://mypip.app/ref/${customLink}`;
  
  const stats = [
    {
      title: "$0.00",
      subtitle: "Won from 0 Days",
      icon: DollarSign,
      progress: 0,
    },
    {
      title: "$0.00",
      subtitle: "Daily average income",
      icon: TrendingUp,
      progress: 0,
    },
    {
      title: "0.00%",
      subtitle: "Lead conversion",
      icon: TrendingUp,
      progress: 0,
    },
    {
      title: "0",
      subtitle: "Campaign sent",
      icon: Calendar,
      progress: 0,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link copied!",
      description: "Your affiliate link has been copied to clipboard.",
    });
  };

  const generateNewLink = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    setCustomLink(`mypip-${randomSuffix}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'} border-b border-border`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Affiliate Program</h1>
        {!isMobile && <ThemeToggle />}
      </div>
      
      <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-6`}>
        {/* Stats Grid */}
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
          {stats.map((stat, index) => (
            <Card key={index} className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} mb-1`}>
                    {stat.title}
                  </div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {stat.subtitle}
                  </p>
                </div>
                <stat.icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-muted-foreground`} />
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-3 gap-8'}`}>
          {/* Left Panel - Earnings */}
          <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-6`}>
            <Card className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>Total Earnings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Month</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">All Time</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>
            </Card>

            <Card className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>Performance Overview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} text-primary`}>0</div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Clicks</p>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} text-primary`}>0</div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Conversions</p>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} text-primary`}>0%</div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Conversion Rate</p>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} text-primary`}>$0.00</div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Avg. Commission</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Link Creator */}
          <div className="space-y-6">
            <Card className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>Your Affiliate Link</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-link" className="text-sm font-medium">
                    Custom Link ID
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="custom-link"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder="your-custom-id"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={generateNewLink}
                      className="px-3"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Generated Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={affiliateLink}
                      readOnly
                      className="flex-1 bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>Commission Structure</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Basic Plan</span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pro Plan</span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Enterprise Plan</span>
                  <span className="font-semibold">30%</span>
                </div>
              </div>
            </Card>

            <Card className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-4`}>Getting Started</h3>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>1. Share your affiliate link with your audience</p>
                <p>2. Earn 30% commission on all successful referrals</p>
                <p>3. Track your performance in real-time</p>
                <p>4. Get paid monthly via PayPal or bank transfer</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliate;