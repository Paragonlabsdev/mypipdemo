import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
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
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h1 className="text-2xl font-bold">Pricing</h1>
        <ThemeToggle />
      </div>
      
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Select the perfect plan for your app building needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`p-6 relative ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-1">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
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