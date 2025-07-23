import { useState } from "react";
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AccountDisplayProps {
  promptCount: number;
}

export const AccountDisplay = ({ promptCount }: AccountDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  return (
    <>
      <div 
        className="p-3 border-t border-border cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">myPip User</p>
            <p className="text-xs text-muted-foreground">{promptCount}/5 today</p>
          </div>
        </div>
        
        {/* Usage bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Usage</span>
            <span>{promptCount}/5 today</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-foreground h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(promptCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[600px] p-0 rounded-xl">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 bg-muted/20 border-r border-border p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl">Settings</DialogTitle>
              </DialogHeader>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "account" 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Account
                </button>
                
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "billing" 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Usage & Billing
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              {activeTab === "account" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Account</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Profile</h3>
                      <p className="text-muted-foreground mb-6">Your personal information</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">myPip User</h4>
                          <p className="text-muted-foreground">mypipuser@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Usage & Billing</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Current Usage</h3>
                      <p className="text-muted-foreground mb-6">Your current plan usage this cycle.</p>
                      
                      <div className="border border-border rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium">Free Plan</h4>
                          <span className="text-muted-foreground">Credits</span>
                        </div>
                        <p className="text-muted-foreground">Resets daily</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Usage Overview</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Today</span>
                            <span className="text-muted-foreground">{promptCount} / 5</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-foreground h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(promptCount / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-medium mb-1">Current Subscription</h4>
                          <p className="text-muted-foreground">You are currently on the Free plan.</p>
                        </div>
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};