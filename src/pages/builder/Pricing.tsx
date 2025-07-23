import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Pricing = () => {
  const isMobile = useIsMobile();
  
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["5 Apps per month", "Basic templates", "Community support"],
    },
    {
      name: "Pro",
      price: "$29",
      features: ["Unlimited apps", "Premium templates", "Priority support", "Custom integrations"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      features: ["Everything in Pro", "White-label solutions", "Dedicated support", "Custom AI training"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className={`flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'} border-b border-border`}>
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Pricing</h1>
        {!isMobile && <ThemeToggle />}
      </div>
      
      <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
          <h2 className={`font-bold ${isMobile ? 'text-2xl mb-3' : 'text-3xl mb-4'}`}>Choose Your Plan</h2>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Select the perfect plan for your app building needs.
          </p>
        </div>
        
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'} max-w-6xl mx-auto`}>
          {plans.map((plan) => (
            <Card key={plan.name} className={`${isMobile ? 'p-4' : 'p-6'} relative ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={`bg-primary text-primary-foreground px-3 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`text-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
                <h3 className={`font-semibold ${isMobile ? 'text-lg mb-1' : 'text-xl mb-2'}`}>{plan.name}</h3>
                <div className={`font-bold ${isMobile ? 'text-2xl mb-1' : 'text-3xl mb-1'}`}>
                  {plan.price}
                  <span className={`font-normal text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>/month</span>
                </div>
              </div>
              
              <ul className={`${isMobile ? 'space-y-2 mb-4' : 'space-y-3 mb-6'}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className={`text-primary ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                size={isMobile ? 'sm' : 'default'}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;