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

    // Template detection and enhanced prompts
    const getPromptTemplate = (userPrompt: string) => {
      const lowerPrompt = userPrompt.toLowerCase();
      
      // Flappy Bird template
      if (lowerPrompt.includes('flappy') || lowerPrompt.includes('bird game')) {
        return `Create a beautiful, modern mobile web app for: Flappy bird game

CRITICAL REQUIREMENTS:
- Generate a complete HTML document with embedded CSS and JavaScript
- Use modern, attractive UI design with proper spacing and typography
- Include interactive buttons, cards, forms, and visual components
- Use a professional color scheme (gradients, modern colors)
- Add proper shadows, rounded corners, and modern styling
- Make it fully responsive and touch-friendly for mobile
- Include smooth animations and transitions
- Use CSS Grid/Flexbox for perfect layouts
- Add icons using Unicode symbols or CSS-drawn icons
- Include proper input fields, buttons with hover effects
- Use modern typography with good hierarchy
- Add loading states, success messages, and interactive feedback
- Include proper navigation if needed
- Make it look like a real production mobile app

STYLING GUIDELINES:
- Use modern color palettes (blues, purples, greens with gradients)
- Include box-shadows for depth
- Use border-radius for rounded elements
- Add smooth CSS transitions for interactions
- Include proper spacing with margins and padding
- Use modern fonts (system fonts or web fonts)
- Add visual hierarchy with different font sizes/weights
- Include hover and active states for buttons
- Use modern input field styling
- Add visual feedback for user interactions

GAME-SPECIFIC FEATURES:
- Touch/tap controls for bird movement
- Pipe obstacles with collision detection
- Score tracking and high score storage
- Game over screen with restart button
- Smooth 60fps animation using requestAnimationFrame
- Bird physics (gravity, jump mechanics)
- Scrolling background
- Sound effects using Web Audio API

Return a complete HTML document that looks professional and modern, not just text. Make it visually stunning!`;
      }
      
      // Calorie tracking template
      if (lowerPrompt.includes('calorie') || lowerPrompt.includes('nutrition') || lowerPrompt.includes('food track')) {
        return `Create a beautiful, modern mobile web app for: Calorie tracking App

CRITICAL REQUIREMENTS:
- Generate a complete HTML document with embedded CSS and JavaScript
- Use modern, attractive UI design with proper spacing and typography
- Include interactive buttons, cards, forms, and visual components
- Use a professional color scheme (gradients, modern colors)
- Add proper shadows, rounded corners, and modern styling
- Make it fully responsive and touch-friendly for mobile
- Include smooth animations and transitions
- Use CSS Grid/Flexbox for perfect layouts
- Add icons using Unicode symbols or CSS-drawn icons
- Include proper input fields, buttons with hover effects
- Use modern typography with good hierarchy
- Add loading states, success messages, and interactive feedback
- Include proper navigation if needed
- Make it look like a real production mobile app

STYLING GUIDELINES:
- Use modern color palettes (blues, purples, greens with gradients)
- Include box-shadows for depth
- Use border-radius for rounded elements
- Add smooth CSS transitions for interactions
- Include proper spacing with margins and padding
- Use modern fonts (system fonts or web fonts)
- Add visual hierarchy with different font sizes/weights
- Include hover and active states for buttons
- Use modern input field styling
- Add visual feedback for user interactions

CALORIE TRACKING FEATURES:
- Food search and selection interface
- Calorie counter with daily goals
- Meal logging (breakfast, lunch, dinner, snacks)
- Progress charts and visual indicators
- Food database with common items
- Barcode scanner simulation (camera interface)
- Weight tracking with graphs
- Water intake tracker
- Exercise logging with calorie burn
- Weekly/monthly statistics dashboard

PLACEHOLDER IMAGES:
- For food photos, use: https://source.unsplash.com/featured/?food
- For meal images, use: https://source.unsplash.com/featured/?healthy-meal
- For profile avatars, use CSS gradients or Unicode symbols

Return a complete HTML document that looks professional and modern, not just text. Make it visually stunning!`;
      }
      
      // Instagram style template
      if (lowerPrompt.includes('instagram') || lowerPrompt.includes('social media') || lowerPrompt.includes('photo sharing')) {
        return `Create a beautiful, modern mobile web app for: Instagram style app

CRITICAL REQUIREMENTS:
- Generate a complete HTML document with embedded CSS and JavaScript
- Use modern, attractive UI design with proper spacing and typography
- Include interactive buttons, cards, forms, and visual components
- Use a professional color scheme (gradients, modern colors)
- Add proper shadows, rounded corners, and modern styling
- Make it fully responsive and touch-friendly for mobile
- Include smooth animations and transitions
- Use CSS Grid/Flexbox for perfect layouts
- Add icons using Unicode symbols or CSS-drawn icons
- Include proper input fields, buttons with hover effects
- Use modern typography with good hierarchy
- Add loading states, success messages, and interactive feedback
- Include proper navigation if needed
- Make it look like a real production mobile app

STYLING GUIDELINES:
- Use modern color palettes (blues, purples, greens with gradients)
- Include box-shadows for depth
- Use border-radius for rounded elements
- Add smooth CSS transitions for interactions
- Include proper spacing with margins and padding
- Use modern fonts (system fonts or web fonts)
- Add visual hierarchy with different font sizes/weights
- Include hover and active states for buttons
- Use modern input field styling
- Add visual feedback for user interactions

SOCIAL MEDIA FEATURES:
- Photo feed with infinite scroll
- Like, comment, and share buttons
- Story viewer with tap navigation
- Camera interface for taking photos
- Photo filters and editing tools
- User profiles with follower counts
- Search and discovery features
- Direct messaging interface
- Hashtag and mention support
- Notification center

PLACEHOLDER IMAGES:
- For user photos, use: https://source.unsplash.com/featured/?portrait
- For feed posts, use: https://source.unsplash.com/featured/?lifestyle
- For stories, use: https://source.unsplash.com/featured/?adventure

Return a complete HTML document that looks professional and modern, not just text. Make it visually stunning!`;
      }
      
      // To-do list template
      if (lowerPrompt.includes('todo') || lowerPrompt.includes('to-do') || lowerPrompt.includes('task') || lowerPrompt.includes('productivity')) {
        return `Create a beautiful, modern mobile web app for: To-do list

CRITICAL REQUIREMENTS:
- Generate a complete HTML document with embedded CSS and JavaScript
- Use modern, attractive UI design with proper spacing and typography
- Include interactive buttons, cards, forms, and visual components
- Use a professional color scheme (gradients, modern colors)
- Add proper shadows, rounded corners, and modern styling
- Make it fully responsive and touch-friendly for mobile
- Include smooth animations and transitions
- Use CSS Grid/Flexbox for perfect layouts
- Add icons using Unicode symbols or CSS-drawn icons
- Include proper input fields, buttons with hover effects
- Use modern typography with good hierarchy
- Add loading states, success messages, and interactive feedback
- Include proper navigation if needed
- Make it look like a real production mobile app

STYLING GUIDELINES:
- Use modern color palettes (blues, purples, greens with gradients)
- Include box-shadows for depth
- Use border-radius for rounded elements
- Add smooth CSS transitions for interactions
- Include proper spacing with margins and padding
- Use modern fonts (system fonts or web fonts)
- Add visual hierarchy with different font sizes/weights
- Include hover and active states for buttons
- Use modern input field styling
- Add visual feedback for user interactions

TO-DO LIST FEATURES:
- Add new tasks with input field and submit button
- Mark tasks as complete/incomplete with checkboxes
- Delete tasks with swipe or delete button
- Edit existing tasks inline
- Task categories or tags with color coding
- Priority levels (high, medium, low) with visual indicators
- Due date picker and reminders
- Progress bar showing completion percentage
- Filter options (all, active, completed)
- Search functionality for tasks
- Local storage to persist tasks
- Task counter and statistics
- Drag and drop reordering
- Bulk actions (select all, delete completed)

PLACEHOLDER IMAGES:
- For productivity/workspace images, use: https://source.unsplash.com/featured/?productivity
- For background patterns, use: https://source.unsplash.com/featured/?minimal

Return a complete HTML document that looks professional and modern, not just text. Make it visually stunning!`;
      }
      
      // Default template for other prompts
      return `Create a beautiful, modern mobile web app for: ${prompt}

CRITICAL REQUIREMENTS:
- Generate a complete HTML document with embedded CSS and JavaScript
- Use modern, attractive UI design with proper spacing and typography
- Include interactive buttons, cards, forms, and visual components
- Use a professional color scheme (gradients, modern colors)
- Add proper shadows, rounded corners, and modern styling
- Make it fully responsive and touch-friendly for mobile
- Include smooth animations and transitions
- Use CSS Grid/Flexbox for perfect layouts
- Add icons using Unicode symbols or CSS-drawn icons
- Include proper input fields, buttons with hover effects
- Use modern typography with good hierarchy
- Add loading states, success messages, and interactive feedback
- Include proper navigation if needed
- Make it look like a real production mobile app

STYLING GUIDELINES:
- Use modern color palettes (blues, purples, greens with gradients)
- Include box-shadows for depth
- Use border-radius for rounded elements
- Add smooth CSS transitions for interactions
- Include proper spacing with margins and padding
- Use modern fonts (system fonts or web fonts)
- Add visual hierarchy with different font sizes/weights
- Include hover and active states for buttons
- Use modern input field styling
- Add visual feedback for user interactions

Return a complete HTML document that looks professional and modern, not just text. Make it visually stunning!`;
    };

    const enhancedPrompt = getPromptTemplate(prompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: enhancedPrompt
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    let generatedCode = data.content[0].text;

    // Extract only the HTML code, removing all descriptions and explanations
    let htmlMatch = generatedCode.match(/```html\s*([\s\S]*?)\s*```/);
    if (htmlMatch) {
      generatedCode = htmlMatch[1].trim();
    } else {
      // Try to find HTML without code blocks
      htmlMatch = generatedCode.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
      if (htmlMatch) {
        generatedCode = htmlMatch[0];
      } else {
        // If still no match, look for just the html tag
        htmlMatch = generatedCode.match(/<html[\s\S]*?<\/html>/i);
        if (htmlMatch) {
          generatedCode = `<!DOCTYPE html>\n${htmlMatch[0]}`;
        } else {
          // Last resort: remove everything before and after HTML content
          generatedCode = generatedCode
            .replace(/^[\s\S]*?(?=<!DOCTYPE html>|<html)/i, '')
            .replace(/(?<=<\/html>)[\s\S]*$/i, '');
        }
      }
    }

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