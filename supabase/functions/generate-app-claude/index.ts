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

    console.log('Building app with Claude Sonnet 4...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{
          role: 'user',
          content: `Create a fully functional mobile web app for: ${prompt}

CRITICAL REQUIREMENTS - MUST BE FULLY FUNCTIONAL:
- Generate COMPLETE HTML with embedded CSS and JavaScript
- ALL interactive elements MUST work with proper event listeners
- Use addEventListener() for every button, input, and interaction
- Include full game mechanics, form processing, and state management
- NEVER truncate or abbreviate the JavaScript - write it COMPLETELY
- Ensure every feature actually works when clicked/touched

FUNCTIONALITY REQUIREMENTS:
- All buttons must have working click handlers
- Games must have complete gameplay (scoring, physics, collision detection)
- Forms must process input and show results
- Include proper error handling and user feedback
- Add state management for dynamic content
- Make sure ALL JavaScript is complete and functional

DESIGN REQUIREMENTS:
- Modern, beautiful mobile-first UI design
- Professional color schemes with gradients
- Smooth animations and transitions
- Touch-friendly interface elements
- Responsive layout that works on all mobile screens
- Modern typography and proper spacing

TECHNICAL REQUIREMENTS:
- Complete, untruncated JavaScript code
- Proper DOM event handling
- Mobile touch event support
- Error handling and validation
- Clean, readable code structure

EXAMPLE PATTERNS TO USE:
- document.addEventListener('DOMContentLoaded', function() { /* init code */ });
- element.addEventListener('click', function() { /* handler */ });
- element.addEventListener('touchstart', function() { /* touch handler */ });
- Use setInterval() or requestAnimationFrame() for animations
- Include proper cleanup for intervals/timeouts

IMPORTANT: Write the COMPLETE HTML document with FULL JavaScript functionality. Do not truncate or abbreviate any code. Every interactive element must be fully implemented.`
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    let generatedCode = data.content[0].text;

    // Extract HTML code more reliably
    let htmlMatch = generatedCode.match(/```html\s*([\s\S]*?)\s*```/);
    if (htmlMatch) {
      generatedCode = htmlMatch[1].trim();
    } else {
      // Try to find HTML without code blocks
      htmlMatch = generatedCode.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
      if (htmlMatch) {
        generatedCode = htmlMatch[0];
      } else {
        // If no match, look for just html tag
        htmlMatch = generatedCode.match(/<html[\s\S]*?<\/html>/i);
        if (htmlMatch) {
          generatedCode = `<!DOCTYPE html>\n${htmlMatch[0]}`;
        }
      }
    }

    // Ensure the HTML is complete and properly formatted
    if (!generatedCode.includes('</html>')) {
      throw new Error('Generated HTML appears to be incomplete');
    }

    console.log('Successfully generated complete app');

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