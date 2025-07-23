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
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-1" />
                {platform.name}
              </Button>
            );
          })}
        </div>

        {/* Download Expo Go Section */}
        <div className="py-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 6c0-3.313-2.687-6-6-6s-6 2.687-6 6v4.053c0 3.313 2.687 6 6 6s6-2.687 6-6zm-5.999 0v4.053c0 2.206-1.794 4-4 4s-4-1.794-4-4V6c0-2.206 1.794-4 4-4s4 1.794 4 4z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Download Expo Go</p>
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
              <img 
                src="/lovable-uploads/200af0d0-77b3-4e5f-887a-647e97cec2b6.png" 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
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