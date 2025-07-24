import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': 'default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\';',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block'
};

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per minute per IP

// Input validation
function validateAndSanitizePrompt(prompt: string): string {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt: must be a non-empty string');
  }
  
  // Length validation
  if (prompt.length > 500) {
    throw new Error('Prompt too long: maximum 500 characters allowed');
  }
  
  // Remove potentially dangerous patterns
  const dangerous = [
    /<script/i, /<\/script/i, /javascript:/i, /vbscript:/i, /on\w+=/i,
    /data:text\/html/i, /eval\(/i, /Function\(/i, /window\./i, /document\./i
  ];
  
  for (const pattern of dangerous) {
    if (pattern.test(prompt)) {
      throw new Error('Prompt contains potentially unsafe content');
    }
  }
  
  // Basic sanitization
  return prompt
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/["']/g, '') // Remove quotes
    .trim();
}

// HTML sanitization for preview code
function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, 'data:text/plain');
}

function checkRateLimit(clientIP: string): void {
  const now = Date.now();
  const clientRequests = rateLimitMap.get(clientIP) || [];
  
  // Remove old requests outside the window
  const recentRequests = clientRequests.filter((time: number) => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  recentRequests.push(now);
  rateLimitMap.set(clientIP, recentRequests);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    
    // Check rate limit
    checkRateLimit(clientIP);
    
    const body = await req.json();
    const { prompt } = body;
    
    // Validate and sanitize input
    const sanitizedPrompt = validateAndSanitizePrompt(prompt);
    console.log('🚀 Generating React Native app with Claude SDK for:', sanitizedPrompt);

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
            content: `Create a React Native mobile app for: "${sanitizedPrompt}"

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
    console.log('Claude response received:', { status: response.status, hasContent: !!data.content });

    // Check for API errors first
    if (!response.ok) {
      console.error('Claude API error:', data);
      throw new Error(`Claude API error (${response.status}): ${data.error?.message || 'Unknown error'}`);
    }

    // Extract content from Claude response
    let content = '';
    if (data.content && Array.isArray(data.content)) {
      content = data.content.map(item => item.text).join('');
      console.log('Extracted content length:', content.length);
    } else if (data.content) {
      content = data.content;
      console.log('Extracted content length:', content.length);
    } else {
      console.error('No content in Claude response. Full response:', JSON.stringify(data, null, 2));
      throw new Error('No content in Claude response');
    }

    // Try to extract JSON from the response - improved extraction
    console.log('Attempting to extract JSON from content...');
    
    // Try multiple JSON extraction patterns
    const jsonPatterns = [
      /```json\s*(\{[\s\S]*?\})\s*```/,  // JSON in code blocks
      /(\{[\s\S]*?\})/,                  // Any JSON object
      /```\s*(\{[\s\S]*?\})\s*```/       // JSON in generic code blocks
    ];
    
    let appData;
    let jsonMatch;
    
    for (const pattern of jsonPatterns) {
      jsonMatch = content.match(pattern);
      if (jsonMatch) {
        console.log('Found JSON match with pattern:', pattern.toString());
        try {
          appData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          console.log('Successfully parsed JSON');
          break;
        } catch (e) {
          console.log('Failed to parse with this pattern, trying next...');
          continue;
        }
      }
    }
    
    if (!appData) {
      console.error('No valid JSON found in response. Content sample:', content.substring(0, 500));
      throw new Error(`Failed to extract valid JSON from Claude response. Content length: ${content.length}`);
    }

    // Ensure required fields and sanitize output
    const finalApp = {
      appName: appData.appName || `${sanitizedPrompt} App`,
      appId: `app.mypip.${sanitizedPrompt.toLowerCase().replace(/\s+/g, '')}`,
      description: appData.description || `A React Native app for ${sanitizedPrompt}`,
      generatedFiles: appData.generatedFiles || {},
      installInstructions: ["npm install", "npx expo start", "Scan QR code with Expo Go"],
      summary: appData.summary || `Generated ${appData.appName || sanitizedPrompt + ' app'}`,
      previewCode: sanitizeHtml(appData.previewCode) || `
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
        .button { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; margin: 10px; }
        .feature { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">${appData.appName || sanitizedPrompt + ' App'}</div>
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
            <div class="button">Get Started</div>
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
    console.error('Full error details:', error);
    
    // Return appropriate error response based on error type
    if (error.message.includes('Rate limit exceeded')) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        details: 'Too many requests from your IP address'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (error.message.includes('Invalid prompt') || error.message.includes('unsafe content')) {
      return new Response(JSON.stringify({ 
        error: error.message,
        details: 'Please check your prompt and try again'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Return detailed error for debugging instead of fallback
    return new Response(JSON.stringify({ 
      error: 'Failed to generate app',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});