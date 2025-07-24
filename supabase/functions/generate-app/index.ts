import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

// Validate API key on startup
if (!anthropicApiKey) {
  console.error('❌ ANTHROPIC_API_KEY is not set');
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}

if (!anthropicApiKey.startsWith('sk-ant-')) {
  console.error('❌ Invalid ANTHROPIC_API_KEY format. Expected to start with "sk-ant-"');
  throw new Error('Invalid ANTHROPIC_API_KEY format');
}

console.log('✅ ANTHROPIC_API_KEY configured correctly');

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

  const startTime = Date.now();
  let sanitizedPrompt = '';

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    
    console.log(`📥 Request from IP: ${clientIP}`);
    
    // Check rate limit
    checkRateLimit(clientIP);
    
    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('❌ Invalid JSON in request body:', e.message);
      throw new Error('Invalid JSON in request body');
    }
    
    const { prompt } = body;
    
    if (!prompt) {
      console.error('❌ No prompt provided in request');
      throw new Error('Prompt is required');
    }
    
    // Validate and sanitize input
    sanitizedPrompt = validateAndSanitizePrompt(prompt);
    console.log('🚀 Generating React Native app for:', sanitizedPrompt.substring(0, 100) + (sanitizedPrompt.length > 100 ? '...' : ''));
    console.log(`📊 Request details: IP=${clientIP}, promptLength=${sanitizedPrompt.length}`);

    // Prepare Claude API request
    const claudeRequestBody = {
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

Return ONLY valid JSON without any other text:
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
    };

    console.log('📤 Sending request to Claude API...');
    console.log(`📋 Model: ${claudeRequestBody.model}, MaxTokens: ${claudeRequestBody.max_tokens}`);

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    let response;
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anthropicApiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'User-Agent': 'Supabase-Edge-Function/1.0'
        },
        body: JSON.stringify(claudeRequestBody),
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('❌ Claude API request timed out');
        throw new Error('Claude API request timed out after 60 seconds');
      }
      console.error('❌ Network error calling Claude API:', fetchError.message);
      throw new Error(`Network error: ${fetchError.message}`);
    }
    
    clearTimeout(timeoutId);
    
    console.log(`📡 Claude API response status: ${response.status}`);
    console.log(`📊 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('❌ Failed to parse Claude API response as JSON:', jsonError.message);
      throw new Error('Invalid JSON response from Claude API');
    }

    // Check for API errors first
    if (!response.ok) {
      console.error('❌ Claude API error response:', JSON.stringify(data, null, 2));
      
      // Handle specific error types
      if (response.status === 401) {
        console.error('❌ Authentication failed - check ANTHROPIC_API_KEY');
        throw new Error('Authentication failed: Invalid API key');
      } else if (response.status === 429) {
        console.error('❌ Rate limit exceeded');
        throw new Error('Rate limit exceeded: Too many requests to Claude API');
      } else if (response.status === 400) {
        console.error('❌ Bad request to Claude API');
        throw new Error(`Bad request: ${data.error?.message || 'Invalid request to Claude API'}`);
      } else {
        throw new Error(`Claude API error (${response.status}): ${data.error?.message || 'Unknown error'}`);
      }
    }

    console.log('✅ Claude response received successfully');
    console.log(`📊 Response details: status=${response.status}, hasContent=${!!data.content}, contentType=${Array.isArray(data.content) ? 'array' : typeof data.content}`);

    // Extract content from Claude response
    let content = '';
    if (data.content && Array.isArray(data.content)) {
      content = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('');
      console.log(`📝 Extracted content from array: ${content.length} characters`);
    } else if (data.content && typeof data.content === 'string') {
      content = data.content;
      console.log(`📝 Extracted string content: ${content.length} characters`);
    } else if (data.content && data.content.text) {
      content = data.content.text;
      console.log(`📝 Extracted text property: ${content.length} characters`);
    } else {
      console.error('❌ No valid content found in Claude response');
      console.error('📋 Full response structure:', JSON.stringify(data, null, 2));
      throw new Error('No valid content in Claude response');
    }

    if (!content || content.length < 10) {
      console.error('❌ Content too short or empty');
      console.error('📋 Raw content:', content);
      throw new Error('Claude response content is empty or too short');
    }

    console.log('📄 Content preview:', content.substring(0, 200) + (content.length > 200 ? '...' : ''));

    // Improved JSON extraction with multiple strategies
    console.log('🔍 Attempting to extract JSON from content...');
    
    let appData;
    
    // Strategy 1: Try to parse entire content as JSON (Claude should return pure JSON)
    try {
      appData = JSON.parse(content.trim());
      console.log('✅ Parsed entire content as JSON');
    } catch (e) {
      console.log('❌ Content is not pure JSON, trying extraction patterns...');
      
      // Strategy 2: Try multiple JSON extraction patterns
      const jsonPatterns = [
        /```json\s*(\{[\s\S]*?\})\s*```/gi,    // JSON in json code blocks
        /```\s*(\{[\s\S]*?\})\s*```/gi,        // JSON in generic code blocks
        /(\{[\s\S]*?"summary"[\s\S]*?\})/gi,   // Look for JSON containing summary field
        /(\{[\s\S]*?"appName"[\s\S]*?\})/gi,   // Look for JSON containing appName field
        /(\{[\s\S]*?\})/gi                     // Any JSON object
      ];
      
      for (const pattern of jsonPatterns) {
        const matches = [...content.matchAll(pattern)];
        for (const match of matches) {
          try {
            const jsonStr = match[1] || match[0];
            appData = JSON.parse(jsonStr.trim());
            console.log(`✅ Successfully parsed JSON with pattern: ${pattern.toString().substring(0, 50)}...`);
            break;
          } catch (parseError) {
            console.log(`❌ Failed to parse match with pattern: ${pattern.toString().substring(0, 30)}...`);
            continue;
          }
        }
        if (appData) break;
      }
    }
    
    if (!appData) {
      console.error('❌ No valid JSON found in response');
      console.error('📋 Content sample (first 1000 chars):', content.substring(0, 1000));
      console.error('📋 Content sample (last 500 chars):', content.substring(Math.max(0, content.length - 500)));
      throw new Error(`Failed to extract valid JSON from Claude response. Content length: ${content.length}`);
    }

    console.log('✅ Successfully extracted app data');
    console.log(`📊 App data keys: ${Object.keys(appData).join(', ')}`);
    
    // Validate required fields
    if (!appData.appName && !appData.name) {
      console.log('⚠️ No appName found, will generate default');
    }
    if (!appData.generatedFiles || Object.keys(appData.generatedFiles).length === 0) {
      console.log('⚠️ No generatedFiles found, creating minimal structure');
    }

    // Build final app object with enhanced validation and defaults
    const appName = appData.appName || appData.name || `${sanitizedPrompt.charAt(0).toUpperCase() + sanitizedPrompt.slice(1)} App`;
    const finalApp = {
      appName,
      appId: `app.mypip.${sanitizedPrompt.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`,
      description: appData.description || `A React Native app for ${sanitizedPrompt}`,
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
            react: '18.2.0'
          }
        }, null, 2),
        'README.md': `# ${appName}\n\nA React Native app built with Expo.\n\n## Installation\n\n1. npm install\n2. npx expo start\n3. Scan QR code with Expo Go app`
      },
      installInstructions: appData.installInstructions || ["npm install", "npx expo start", "Scan QR code with Expo Go"],
      summary: appData.summary || `Generated ${appName} - a React Native mobile app`,
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
        .title { font-size: 28px; font-weight: bold; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .feature { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; margin: 15px 0; border-radius: 12px; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .feature-title { font-weight: bold; color: #495057; margin-bottom: 8px; font-size: 16px; }
        .feature-desc { color: #6c757d; font-size: 14px; line-height: 1.5; }
        .button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; font-weight: 600; margin: 20px auto; display: block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: transform 0.2s; }
        .button:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">${appName}</div>
            <div class="subtitle">Your React Native App</div>
        </div>
        <div class="content">
            <div class="feature">
                <div class="feature-title">📱 Cross-Platform</div>
                <div class="feature-desc">Built with React Native and Expo for iOS and Android</div>
            </div>
            <div class="feature">
                <div class="feature-title">🚀 Ready to Deploy</div>
                <div class="feature-desc">Complete app structure with all necessary files</div>
            </div>
            <div class="feature">
                <div class="feature-title">🎨 Modern UI</div>
                <div class="feature-desc">Beautiful, responsive design optimized for mobile</div>
            </div>
            <button class="button">Launch App</button>
        </div>
    </div>
</body>
</html>`
    };

    const duration = Date.now() - startTime;
    console.log(`✅ App generation completed successfully in ${duration}ms`);
    console.log(`📊 Final app: name="${finalApp.appName}", files=${Object.keys(finalApp.generatedFiles).length}, previewLength=${finalApp.previewCode.length}`);

    return new Response(JSON.stringify(finalApp), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Generation-Time': `${duration}ms`
      },
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error generating app after ${duration}ms:`, error.message);
    console.error('📋 Full error details:', error);
    console.error('📋 Error stack:', error.stack);
    
    // Log additional context for debugging
    if (sanitizedPrompt) {
      console.error(`📋 Failed prompt: "${sanitizedPrompt.substring(0, 100)}..."`);
    }
    
    // Return appropriate error response based on error type
    if (error.message.includes('Rate limit exceeded')) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        details: 'Too many requests from your IP address',
        errorCode: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date().toISOString()
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (error.message.includes('Authentication failed') || error.message.includes('Invalid API key')) {
      return new Response(JSON.stringify({ 
        error: 'API configuration error',
        details: 'Please check the API key configuration',
        errorCode: 'AUTH_ERROR',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (error.message.includes('Invalid prompt') || error.message.includes('unsafe content') || error.message.includes('Prompt is required')) {
      return new Response(JSON.stringify({ 
        error: error.message,
        details: 'Please check your prompt and try again',
        errorCode: 'INVALID_INPUT',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (error.message.includes('timeout')) {
      return new Response(JSON.stringify({ 
        error: 'Request timeout',
        details: 'The AI service took too long to respond. Please try again.',
        errorCode: 'TIMEOUT',
        timestamp: new Date().toISOString()
      }), {
        status: 504,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generic server error with detailed logging for debugging
    return new Response(JSON.stringify({ 
      error: 'Failed to generate app',
      details: 'An internal error occurred while generating your app. Please try again.',
      errorCode: 'INTERNAL_ERROR',
      debugInfo: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});