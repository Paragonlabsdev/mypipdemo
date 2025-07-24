import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate API key on startup
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
if (!geminiApiKey) {
  console.error('❌ GEMINI_API_KEY is not set');
  throw new Error('GEMINI_API_KEY environment variable is required');
}
console.log('✅ GEMINI_API_KEY configured correctly');

// Simple rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(clientIP: string): void {
  const now = Date.now();
  const requests = rateLimitMap.get(clientIP) || [];
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    throw new Error('Rate limit exceeded');
  }
  
  recentRequests.push(now);
  rateLimitMap.set(clientIP, recentRequests);
}

function validatePrompt(prompt: string): string {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }
  
  if (prompt.length > 500) {
    throw new Error('Prompt too long: maximum 500 characters');
  }
  
  return prompt.trim();
}

function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    // Get client IP
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    'unknown';
    
    console.log(`📥 Request from IP: ${clientIP}`);
    
    // Rate limiting
    checkRateLimit(clientIP);
    
    // Parse request
    const body = await req.json();
    const { prompt } = body;
    
    const validatedPrompt = validatePrompt(prompt);
    console.log('🚀 Generating app for:', validatedPrompt);
    
    // Prepare Gemini request with simplified prompt
    const geminiRequest = {
      contents: [{
        parts: [{
          text: `Create a React Native mobile app for: "${validatedPrompt}"

Generate a complete working React Native app with these files:
1. package.json - with expo and react-native dependencies
2. app.json - expo configuration  
3. App.js - main app entry point
4. app/index.js - home screen
5. app/_layout.js - expo-router layout
6. README.md - setup instructions

Also create an HTML preview showing the app UI.

Return ONLY valid JSON in this exact format:
{
  "appName": "App Name",
  "description": "Brief description",
  "generatedFiles": {
    "package.json": "content here",
    "app.json": "content here", 
    "App.js": "content here",
    "app/index.js": "content here",
    "app/_layout.js": "content here",
    "README.md": "content here"
  },
  "previewCode": "HTML preview code",
  "summary": "Brief summary"
}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4000,
      }
    };

    console.log('📤 Calling Gemini API...');
    
    // Call Gemini API with 30 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiRequest),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Gemini response received');
    
    // Extract content
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('❌ No content in response:', data);
      throw new Error('No content in Gemini response');
    }
    
    const content = data.candidates[0].content.parts[0].text;
    console.log('📝 Content length:', content.length);
    
    // Parse JSON - try simple parse first, then extract from code blocks
    let appData;
    try {
      appData = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i) ||
                       content.match(/(\{[\s\S]*?"summary"[\s\S]*?\})/i) ||
                       content.match(/(\{[\s\S]*?\})/i);
      
      if (jsonMatch) {
        try {
          appData = JSON.parse(jsonMatch[1]);
        } catch (e2) {
          console.error('❌ Failed to parse extracted JSON:', e2);
          throw new Error('Failed to parse JSON from response');
        }
      } else {
        console.error('❌ No JSON found in response');
        throw new Error('No JSON found in response');
      }
    }
    
    console.log('✅ Successfully parsed app data');
    
    // Build response with defaults
    const appName = appData.appName || `${validatedPrompt} App`;
    const finalApp = {
      appName,
      appId: `app.${appName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      description: appData.description || `A React Native app for ${validatedPrompt}`,
      generatedFiles: appData.generatedFiles || {
        'package.json': JSON.stringify({
          name: appName.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          main: 'App.js',
          scripts: {
            start: 'expo start',
            android: 'expo start --android',
            ios: 'expo start --ios'
          },
          dependencies: {
            expo: '~50.0.0',
            'react-native': '~0.73.0',
            react: '18.2.0',
            'expo-router': '~3.4.0'
          }
        }, null, 2),
        'README.md': `# ${appName}\n\nRun: npm install && npx expo start`
      },
      summary: appData.summary || `Generated ${appName}`,
      previewCode: sanitizeHtml(appData.previewCode) || `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName}</title>
    <style>
        body { margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, sans-serif; min-height: 100vh; }
        .container { max-width: 375px; margin: 0 auto; background: white; min-height: 600px; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px 30px; text-align: center; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
        .content { padding: 30px 20px; text-align: center; }
        .feature { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 12px; }
        .button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; margin: 20px auto; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">${appName}</div>
        </div>
        <div class="content">
            <div class="feature">📱 React Native App</div>
            <div class="feature">🚀 Built with Expo</div>
            <div class="feature">🎨 Modern UI Design</div>
            <button class="button">Launch App</button>
        </div>
    </div>
</body>
</html>`
    };
    
    const duration = Date.now() - startTime;
    console.log(`✅ App generated successfully in ${duration}ms`);
    
    return new Response(JSON.stringify(finalApp), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error after ${duration}ms:`, error.message);
    console.error('📋 Error details:', error);
    
    // Return appropriate error responses
    if (error.message.includes('Rate limit')) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        errorCode: 'RATE_LIMIT'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (error.message.includes('Prompt')) {
      return new Response(JSON.stringify({ 
        error: error.message,
        errorCode: 'INVALID_INPUT'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new Response(JSON.stringify({ 
        error: 'Request timeout. Please try again.',
        errorCode: 'TIMEOUT'
      }), {
        status: 504,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate app. Please try again.',
      errorCode: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});