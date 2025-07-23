import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Apple, Smartphone, Monitor } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PreviewDeviceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewDeviceModal = ({ isOpen, onOpenChange }: PreviewDeviceModalProps) => {
  const isMobile = useIsMobile();
  const [selectedPlatform, setSelectedPlatform] = useState("iOS");
  
  const platforms = [
    { name: "iOS", icon: Apple, active: selectedPlatform === "iOS" },
    { name: "Android", icon: Smartphone, active: selectedPlatform === "Android" },
    { name: "Web", icon: Monitor, active: selectedPlatform === "Web" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-lg font-semibold">App Clip Preview</DialogTitle>
        </DialogHeader>
        
        {/* Platform Tabs */}
        <div className="flex justify-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <Button
                key={platform.name}
                onClick={() => setSelectedPlatform(platform.name)}
                variant="ghost"
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  platform.active 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-1" />
                {platform.name}
              </Button>
            );
          })}
        </div>

        {/* Download Bloom Section */}
        <div className="py-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Apple className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Download Bloom</p>
                <p className="text-xs text-gray-500">Optional</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="text-center py-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-4">
            <div className="w-32 h-32 mx-auto bg-white rounded-lg p-2 shadow-sm">
              {/* Placeholder QR Code */}
              <div className="w-full h-full bg-gray-900 rounded grid grid-cols-8 gap-px">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'} rounded-sm`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Scan this QR code with your camera app to open the
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            App Clip instantly.
          </p>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If you experience any issues, try downloading the full app from the App Store.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};