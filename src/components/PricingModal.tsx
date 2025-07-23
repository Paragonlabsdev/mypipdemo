import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PricingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal = ({ isOpen, onOpenChange }: PricingModalProps) => {
  const isMobile = useIsMobile();
  
  const plans = [
    {
      name: "myPip Basic",
      price: "$20",
      description: "Basic plan for all user",
      billing: "billed every month",
      features: ["1,000 prompts per month", "25 App Morphs", "20 Monthly Remixes", "Advanced AI features"],
    },
    {
      name: "myPip Pro",
      price: "$33",
      description: "Get access to everything",
      billing: "billed every month",
      features: ["10,000 build credits", "100 App Morphs", "100 Monthly Remixes", "Priority support"],
      popular: true,
    },
    {
      name: "myPip Enterprise",
      price: "$199",
      description: "Best for larger teams",
      billing: "billed every month",
      features: ["Everything in Professional, Plus", "Unlimited remixes", "Unlimited App Morphs", "Dedicated support"],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto p-6 rounded-xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <p className="text-muted-foreground text-center">
            Select the perfect plan for your app building needs.
          </p>
        </DialogHeader>
        
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl ${isMobile ? 'p-6' : 'p-8'} ${
              plan.popular 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                : 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={`bg-white text-gray-900 px-4 py-2 rounded-full font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'} mb-2`}>{plan.name}</h3>
                <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'} mb-4`}>{plan.description}</p>
                
                <div className="mb-2">
                  <span className={`font-bold ${isMobile ? 'text-3xl' : 'text-4xl'}`}>{plan.price}</span>
                </div>
                <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>{plan.billing}</p>
              </div>
              
              <div className="mb-8">
                <h4 className={`font-semibold mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>Features Included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className={`w-full rounded-xl font-medium ${isMobile ? 'py-3 text-sm' : 'py-4'} ${
                  plan.popular 
                    ? 'bg-white text-blue-600 hover:bg-gray-100' 
                    : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};