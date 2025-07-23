import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Mail, MessageCircle, Users, LogOut, X, CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PricingModal } from "@/components/PricingModal";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountModal = ({ isOpen, onOpenChange }: AccountModalProps) => {
  const isMobile = useIsMobile();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const menuItems = [
    { icon: Settings, label: "Settings", shortcut: "⌘,", action: () => window.location.href = "/builder/settings" },
    { icon: Mail, label: "Contact Us", action: () => window.open("https://mypipdev.com/support", "_blank") },
    { icon: MessageCircle, label: "Feedback", action: () => window.open("https://mypipdev.com/support", "_blank") },
    { icon: Users, label: "Discord community", action: () => window.open("https://discord.gg/wyqp2gqy", "_blank") }
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xs p-0 rounded-2xl shadow-xl border-0 relative" style={{marginTop: '3.5rem'}}>
          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Upgrade Button */}
          <div className="p-4 pb-3">
            <Button 
              onClick={() => {
                setIsPricingModalOpen(true);
                onOpenChange(false);
              }}
              className="w-full"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "12px",
                padding: "12px",
                fontWeight: "500",
                boxShadow: "0 4px 14px 0 rgba(120, 120, 120, 0.39)"
              }}
            >
              Upgrade
            </Button>
          </div>
          
          {/* Credits Bar */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Credits remaining</span>
              <span className="text-xs font-medium">1,247 / 5,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full" style={{width: "25%"}}></div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-4 pb-4 space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-gray-400">{item.shortcut}</span>
                  )}
                  {!item.shortcut && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => window.location.href = "/"}
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">Sign Out</span>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-end">
              <ThemeToggle />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onOpenChange={setIsPricingModalOpen} 
      />
    </>
  );
};