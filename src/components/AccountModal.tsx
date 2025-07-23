import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Mail, MessageCircle, MapPin, Users, LogOut, Sun, Monitor, Moon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountModal = ({ isOpen, onOpenChange }: AccountModalProps) => {
  const isMobile = useIsMobile();

  const menuItems = [
    { icon: Settings, label: "Settings", shortcut: "⌘," },
    { icon: Mail, label: "Contact Us" },
    { icon: MessageCircle, label: "Feedback" },
    { icon: MapPin, label: "Roadmap" },
    { icon: Users, label: "Discord community" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs p-0 rounded-2xl shadow-xl border-0">
        {/* Upgrade Button */}
        <div className="p-4 pb-3">
          <Button className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-xl py-3 font-medium shadow-lg">
            Upgrade
          </Button>
        </div>

        {/* Menu Items */}
        <div className="px-4 pb-4 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.label}
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
            <div className="flex items-center space-x-3">
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">Sign Out</span>
            </div>
          </div>
          
          {/* Theme Icons */}
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Sun className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Monitor className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Moon className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};