import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Valid prompt is required');
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    console.log('Sending request to Claude Sonnet 3.7...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Generate a complete mobile web app for: ${prompt}

Requirements:
- Create a fully functional HTML page with embedded CSS and JavaScript
- Use modern CSS (Flexbox/Grid) for mobile-responsive layout
- Make it touch-friendly and optimized for mobile screens
- Include interactive JavaScript functionality
- Use a clean, modern design with good UX
- Add proper semantic HTML structure
- Include viewport meta tag and mobile optimizations
- Return ONLY valid HTML code with <style> and <script> tags embedded
- Make it visually appealing with smooth animations
- Ensure all functionality works without external dependencies
- Use modern JavaScript (ES6+) features
- Add appropriate touch events for mobile interaction

Return a complete HTML document that can be directly displayed in an iframe or mobile preview.`
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedCode = data.content[0].text;

    console.log('Successfully generated app code');

    return new Response(
      JSON.stringify({ 
        success: true, 
        code: generatedCode,
        prompt: prompt
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-app-claude function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to generate app' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});