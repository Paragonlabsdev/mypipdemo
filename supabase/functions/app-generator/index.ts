import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    console.log('Generating app for prompt:', prompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Create a complete, working mobile app for: ${prompt}

Requirements:
- Create a full HTML page with inline CSS and JavaScript
- Make it look like a professional mobile app with modern design
- Use a mobile-first approach with proper viewport settings
- Include CSS that works well in a 300px wide container
- Use touch-friendly buttons and interface elements
- Include all necessary functionality for the app
- Make the design clean, modern, and user-friendly
- Use proper color schemes and typography
- Include interactive elements and smooth animations where appropriate
- The HTML should be complete and ready to display in an iframe

Return ONLY the HTML code, no explanations or markdown formatting.`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, response.statusText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedHtml = data.content[0].text;
    
    console.log('Successfully generated app HTML');

    return new Response(JSON.stringify({ html: generatedHtml }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in app-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});