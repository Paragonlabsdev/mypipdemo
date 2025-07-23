import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Smartphone, Code, Eye, Download } from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  prompt: string;
  status: 'planning' | 'designing' | 'coding' | 'completed' | 'error';
  plan_data: any;
  ui_data: any;
  code_data: any;
  created_at: string;
}

const AgenticAppBuilder = () => {
  const [prompt, setPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentApp, setCurrentApp] = useState<App | null>(null);
  const [showCode, setShowCode] = useState(false);
  const { toast } = useToast();

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'planning': return 25;
      case 'designing': return 50;
      case 'coding': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const buildApp = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for your app",
        variant: "destructive",
      });
      return;
    }

    setIsBuilding(true);
    try {
      // Create app entry
      const { data: app, error: createError } = await supabase
        .from('apps')
        .insert({
          user_id: 'anonymous', // For demo purposes
          name: 'New App',
          description: prompt,
          prompt: prompt,
          status: 'planning'
        })
        .select()
        .single();

      if (createError) throw createError;

      setCurrentApp(app as App);

      // Step 1: Planning
      toast({
        title: "Planning Started",
        description: "AI Planner is analyzing your requirements...",
      });

      const planResponse = await supabase.functions.invoke('app-planner', {
        body: { prompt, appId: app.id }
      });

      if (planResponse.error) throw planResponse.error;

      // Step 2: UI Design
      toast({
        title: "Designing UI",
        description: "AI Designer is creating your app interface...",
      });

      const uiResponse = await supabase.functions.invoke('ui-composer', {
        body: { appId: app.id }
      });

      if (uiResponse.error) throw uiResponse.error;

      // Step 3: Code Generation
      toast({
        title: "Generating Code",
        description: "AI Developer is writing your React Native code...",
      });

      const codeResponse = await supabase.functions.invoke('code-generator', {
        body: { appId: app.id }
      });

      if (codeResponse.error) throw codeResponse.error;

      // Get final app data
      const { data: finalApp } = await supabase
        .from('apps')
        .select('*')
        .eq('id', app.id)
        .single();

      setCurrentApp(finalApp as App);

      toast({
        title: "App Built Successfully!",
        description: "Your React Native app is ready to download.",
      });

    } catch (error) {
      console.error('Build error:', error);
      toast({
        title: "Build Failed",
        description: "Failed to build your app. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const downloadApp = () => {
    if (!currentApp?.code_data) return;

    const files = currentApp.code_data.files;
    const zipContent = Object.entries(files).map(([path, content]) => 
      `// ${path}\n${content}\n\n`
    ).join('\n');

    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentApp.name.replace(/\s+/g, '-')}-react-native-app.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your React Native app code is downloading...",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Agentic App Builder</h1>
        <p className="text-muted-foreground">
          Describe your mobile app idea and let our AI agents build it for you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Build Your React Native App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe your app idea
            </label>
            <Textarea
              placeholder="e.g., A calorie tracking app with food logging, exercise tracking, and progress charts..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isBuilding}
            />
          </div>

          <Button 
            onClick={buildApp} 
            disabled={isBuilding || !prompt.trim()}
            className="w-full"
          >
            {isBuilding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Building App...
              </>
            ) : (
              'Build My App'
            )}
          </Button>
        </CardContent>
      </Card>

      {currentApp && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentApp.name}</span>
              <Badge variant={currentApp.status === 'completed' ? 'default' : 'secondary'}>
                {currentApp.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{getStatusProgress(currentApp.status)}%</span>
              </div>
              <Progress value={getStatusProgress(currentApp.status)} />
            </div>

            <p className="text-sm text-muted-foreground">
              {currentApp.description}
            </p>

            {currentApp.status === 'completed' && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCode(!showCode)}
                  className="flex-1"
                >
                  <Code className="mr-2 h-4 w-4" />
                  {showCode ? 'Hide Code' : 'View Code'}
                </Button>
                <Button onClick={downloadApp} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download App
                </Button>
              </div>
            )}

            {showCode && currentApp.code_data && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Generated Files:</h4>
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-auto">
                  {Object.entries(currentApp.code_data.files).map(([path, content]) => (
                    <details key={path} className="mb-2">
                      <summary className="cursor-pointer font-mono text-sm text-primary">
                        {path}
                      </summary>
                      <pre className="mt-2 text-xs bg-background p-2 rounded border overflow-auto">
                        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                      </pre>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {currentApp.plan_data && (
              <div>
                <h4 className="font-medium mb-2">App Plan:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Screens:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {currentApp.plan_data.screens?.map((screen: any, index: number) => (
                        <li key={index}>{screen.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Features:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {currentApp.plan_data.features?.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgenticAppBuilder;