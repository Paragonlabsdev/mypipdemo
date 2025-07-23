import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Copy, TrendingUp, DollarSign, Users, Calendar, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Affiliate Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track your earnings and manage your affiliate program</p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Invite Friends
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-700"/>
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${0 * 1.25} 125.6`} className="text-green-500 transition-all duration-300"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">0%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$0</p>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-700"/>
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${0 * 1.25} 125.6`} className="text-blue-500 transition-all duration-300"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">0%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Referrals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Chart */}
            <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings Overview</h3>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Last 30 days
                </Button>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">No data available yet</p>
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Clicks</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                  <Progress value={0} className="mt-2 h-2" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Conversions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                  <Progress value={0} className="mt-2 h-2" />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Affiliate Tools */}
          <div className="space-y-6">
            {/* Affiliate Link Creator */}
            <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Affiliate Link</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-link" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Link ID
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="custom-link"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder="your-custom-id"
                      className="flex-1 rounded-xl"
                    />
                    <Button
                      variant="outline"
                      onClick={generateNewLink}
                      className="px-3 rounded-xl"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={affiliateLink}
                      readOnly
                      className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="rounded-xl"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Commission Structure */}
            <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commission Rates</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Basic Plan</span>
                  <span className="font-semibold text-green-600">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Pro Plan</span>
                  <span className="font-semibold text-green-600">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Enterprise Plan</span>
                  <span className="font-semibold text-green-600">30%</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-0 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Users className="h-4 w-4 mr-2" />
                  View Referrals
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliate;