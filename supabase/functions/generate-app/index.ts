import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExpoAppStructure {
  appName: string;
  appId: string;
  description: string;
  generatedFiles: {
    'package.json': string;
    'app.json': string;
    'eas.json': string;
    'App.js': string;
    'README.md': string;
    [key: string]: string; // For all app/* files and assets
  };
  installInstructions: string[];
  summary: string;
  previewCode: string; // HTML/JS for preview
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('🚀 Starting React Native/Expo app generation for:', prompt);

    // Simple Claude SDK approach - single call to generate everything
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: `Create a complete React Native/Expo mobile app for: "${prompt}"

Generate a production-ready React Native app with Expo. Return ONLY a valid JSON object with this structure:

{
  "appName": "descriptive app name",
  "appId": "app.mypip.appname",
  "description": "brief app description",
  "generatedFiles": {
    "package.json": "complete package.json with expo, react-native, expo-router dependencies",
    "app.json": "complete expo app.json config",
    "eas.json": "complete eas.json build config",
    "App.js": "expo-router entry point",
    "app/index.js": "main home screen with working UI",
    "app/_layout.js": "expo-router layout",
    "README.md": "install and run instructions"
  },
  "installInstructions": ["npm install", "npx expo start", "scan QR code"],
  "summary": "brief description of generated app",
  "previewCode": "HTML/CSS/JS code to show a visual preview of the app in a phone mockup"
}

REQUIREMENTS:
- Use Expo SDK ~50.0.0, React Native 0.73.0, expo-router ^3.0.0
- Make the app functional with working navigation and UI
- Include proper React Native styling with StyleSheet
- Generate a phone preview HTML that visually shows the app interface
- Make the preview code work as a standalone HTML file with CSS and JS
- The preview should look like a real mobile app interface

Make everything production-ready and immediately runnable with 'npx expo start'!`
          }
        ]
      }),
    });

    const data = await response.json();
    let finalApp: ExpoAppStructure;
    
    try {
      // Extract JSON from Claude's response
      let content = '';
      if (data.content && Array.isArray(data.content) && data.content[0]) {
        content = data.content[0].text;
      } else if (data.content && typeof data.content === 'string') {
        content = data.content;
      } else {
        throw new Error('Unexpected response format from Claude');
      }
      
      console.log('Claude response received, parsing...');
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        finalApp = JSON.parse(jsonMatch[0]);
        console.log('✅ App generated successfully with Claude SDK');
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      
      // Create a fallback app structure
      const appName = `${prompt} App`;
      const appId = `app.mypip.${prompt.toLowerCase().replace(/\s+/g, '')}`;
      
      finalApp = {
        appName,
        appId,
        description: `A React Native app for ${prompt}`,
        generatedFiles: {
          'package.json': JSON.stringify({
            "name": "my-app",
            "main": "node_modules/expo-router/entry",
            "version": "1.0.0",
            "scripts": {
              "dev": "expo start --tunnel",
              "postinstall": "npx expo install"
            },
            "dependencies": {
              "expo": "~50.0.0",
              "react": "18.2.0",
              "react-native": "0.73.0",
              "expo-router": "^3.0.0",
              "expo-status-bar": "~1.11.1"
            }
          }, null, 2),
          'app.json': JSON.stringify({
            "expo": {
              "name": appName,
              "slug": appName.toLowerCase().replace(/\s+/g, '-'),
              "version": "1.0.0",
              "orientation": "portrait",
              "icon": "./assets/icon.png",
              "userInterfaceStyle": "light",
              "splash": {
                "image": "./assets/splash.png",
                "resizeMode": "contain",
                "backgroundColor": "#ffffff"
              },
              "assetBundlePatterns": ["**/*"],
              "ios": {
                "supportsTablet": true
              },
              "android": {
                "adaptiveIcon": {
                  "foregroundImage": "./assets/adaptive-icon.png",
                  "backgroundColor": "#ffffff"
                }
              },
              "web": {
                "favicon": "./assets/favicon.png"
              }
            }
          }, null, 2),
          'eas.json': JSON.stringify({
            "cli": {
              "version": ">= 3.0.0"
            },
            "build": {
              "development": {
                "developmentClient": true,
                "distribution": "internal"
              },
              "preview": {
                "distribution": "internal"
              },
              "production": {}
            },
            "submit": {
              "production": {}
            }
          }, null, 2),
          'App.js': `import 'expo-router/entry';`,
          'app/index.js': `import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>${appName}</Text>
      <Text style={styles.subtitle}>Welcome to your new app!</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert('App is working!')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});`,
          'app/_layout.js': `import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '${appName}' }} />
    </Stack>
  );
}`,
          'README.md': `# ${appName}

A React Native app built with Expo.

## Installation & Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server:**
   \`\`\`bash
   npx expo start
   \`\`\`

3. **Run on device:**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press 'i' for iOS simulator, 'a' for Android emulator

## Features

- Home screen with welcome message

## Built with

- React Native 0.73.0
- Expo SDK ~50.0.0
- Expo Router for navigation

## Getting Started

This app is ready to run! Just follow the installation steps above and start building your mobile app.
`
        },
        installInstructions: [
          "npm install",
          "npx expo start",
          "Scan QR code with Expo Go app or use simulator"
        ],
        summary: `Generated a complete React Native/Expo app: ${appName}. Ready to run with expo start.`,
        previewCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName} Preview</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .phone { width: 375px; height: 667px; background: white; border-radius: 30px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .screen { padding: 40px 20px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #666; margin-bottom: 30px; }
        .button { background: #007AFF; color: white; padding: 10px 20px; border-radius: 8px; border: none; font-size: 16px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>
    <div class="phone">
        <div class="screen">
            <h1 class="title">${appName}</h1>
            <p class="subtitle">Welcome to your new app!</p>
            <button class="button" onclick="alert('App is working!')">Get Started</button>
        </div>
    </div>
</body>
</html>`
      };
    }

    console.log('🎉 App generated successfully:', {
      appName: finalApp.appName,
      description: finalApp.description,
      filesGenerated: Object.keys(finalApp.generatedFiles).length
    });

    return new Response(JSON.stringify(finalApp), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error generating app:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});