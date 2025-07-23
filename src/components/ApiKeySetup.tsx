import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';

const ApiKeySetup = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          To use the Agentic App Builder, you need to add your API keys to Supabase Edge Function Secrets.
          Click the buttons below to add your keys.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">OpenAI API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Required for the Planner and UI Composer agents (ChatGPT-4.0)
            </p>
            <div className="space-y-2">
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                Get your OpenAI API key
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Anthropic API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Required for the Code Generator agent (Claude)
            </p>
            <div className="space-y-2">
              <a 
                href="https://console.anthropic.com/account/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                Get your Anthropic API key
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiKeySetup;