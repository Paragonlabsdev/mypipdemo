import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('🚀 Generating React Native app with Claude SDK for:', prompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Create a React Native mobile app for: "${prompt}"

Generate a complete working React Native app with Expo. The app should have:
- A beautiful, functional UI
- Proper navigation with expo-router
- Working components and interactions
- Professional styling

Create these files:
1. package.json - with expo, react-native, expo-router dependencies
2. app.json - expo configuration
3. App.js - expo-router entry point 
4. app/index.js - main home screen with working UI
5. app/_layout.js - expo-router layout
6. README.md - installation instructions

Also create an HTML preview showing what the app looks like.

Return as JSON:
{
  "appName": "App Name",
  "description": "Brief description", 
  "generatedFiles": {
    "package.json": "...",
    "app.json": "...",
    "App.js": "...",
    "app/index.js": "...",
    "app/_layout.js": "...",
    "README.md": "..."
  },
  "previewCode": "HTML code showing app preview",
  "summary": "Brief summary"
}`
          }
        ]
      }),
    });

    const data = await response.json();
    console.log('Claude response received');

    // Extract content from Claude response
    let content = '';
    if (data.content && Array.isArray(data.content)) {
      content = data.content.map(item => item.text).join('');
    } else if (data.content) {
      content = data.content;
    } else {
      throw new Error('No content in Claude response');
    }

    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    let appData;
    
    if (jsonMatch) {
      try {
        appData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Failed to parse JSON from Claude response');
      }
    } else {
      console.error('No JSON found in response');
      throw new Error('No JSON found in Claude response');
    }

    // Ensure required fields
    const finalApp = {
      appName: appData.appName || `${prompt} App`,
      appId: `app.mypip.${prompt.toLowerCase().replace(/\s+/g, '')}`,
      description: appData.description || `A React Native app for ${prompt}`,
      generatedFiles: appData.generatedFiles || {},
      installInstructions: ["npm install", "npx expo start", "Scan QR code with Expo Go"],
      summary: appData.summary || `Generated ${appData.appName || prompt + ' app'}`,
      previewCode: appData.previewCode || `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appData.appName || prompt + ' App'}</title>
    <style>
        body { margin: 0; padding: 20px; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .container { max-width: 375px; margin: 0 auto; background: white; min-height: 600px; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px 20px; text-align: center; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 30px 20px; text-align: center; }
        .button { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 10px; }
        .feature { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">${appData.appName || prompt + ' App'}</div>
            <div class="subtitle">Welcome to your mobile app</div>
        </div>
        <div class="content">
            <div class="feature">
                <strong>📱 React Native App</strong>
                <div>Built with Expo for iOS and Android</div>
            </div>
            <div class="feature">
                <strong>🚀 Ready to Deploy</strong>
                <div>Install and run with Expo Go</div>
            </div>
            <button class="button">Get Started</button>
        </div>
    </div>
</body>
</html>`
    };

    console.log('✅ App generated successfully:', finalApp.appName);

    return new Response(JSON.stringify(finalApp), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error generating app:', error.message);
    
    // Return fallback app
    const { prompt: userPrompt } = await req.json().catch(() => ({ prompt: 'Sample App' }));
    
    const fallbackApp = {
      appName: `${userPrompt} App`,
      appId: `app.mypip.${userPrompt.toLowerCase().replace(/\s+/g, '')}`,
      description: `A React Native app for ${userPrompt}`,
      generatedFiles: {
        'package.json': JSON.stringify({
          "name": "my-expo-app",
          "main": "node_modules/expo-router/entry",
          "version": "1.0.0",
          "scripts": {
            "start": "expo start",
            "dev": "expo start --tunnel"
          },
          "dependencies": {
            "expo": "~50.0.0",
            "react": "18.2.0",
            "react-native": "0.73.0",
            "expo-router": "^3.0.0"
          }
        }, null, 2),
        'app.json': JSON.stringify({
          "expo": {
            "name": `${userPrompt} App`,
            "slug": `${userPrompt.toLowerCase().replace(/\s+/g, '-')}-app`,
            "version": "1.0.0",
            "orientation": "portrait",
            "platforms": ["ios", "android", "web"]
          }
        }, null, 2),
        'App.js': 'import "expo-router/entry";',
        'app/index.js': `import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${userPrompt} App</Text>
      <Text style={styles.subtitle}>Your app is ready!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666' }
});`,
        'app/_layout.js': `import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack><Stack.Screen name="index" /></Stack>;
}`,
        'README.md': `# ${userPrompt} App\n\nReact Native app built with Expo.\n\n## Setup\n1. npm install\n2. npx expo start\n3. Scan QR code with Expo Go`
      },
      installInstructions: ["npm install", "npx expo start", "Scan QR code"],
      summary: `Generated ${userPrompt} app with React Native and Expo`,
      previewCode: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${userPrompt} App</title>
<style>body{margin:0;padding:20px;background:#f5f5f5;font-family:-apple-system,sans-serif}.container{max-width:375px;margin:0 auto;background:white;min-height:600px;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:40px 20px 20px;text-align:center}.title{font-size:24px;font-weight:bold}.content{padding:30px;text-align:center}.button{background:#667eea;color:white;border:none;padding:12px 24px;border-radius:8px;margin:10px}</style>
</head><body><div class="container"><div class="header"><div class="title">${userPrompt} App</div></div><div class="content"><button class="button">Get Started</button></div></div></body></html>`
    };

    return new Response(JSON.stringify(fallbackApp), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});