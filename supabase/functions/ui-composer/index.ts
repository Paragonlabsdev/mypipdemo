import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appId } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get app plan data
    const { data: app, error: appError } = await supabase
      .from('apps')
      .select('*')
      .eq('id', appId)
      .single();

    if (appError || !app) {
      throw new Error('App not found');
    }

    const plan = app.plan_data;

    // Use ChatGPT-4.0 as UI Composer Agent
    const uiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an expert React Native UI designer. Transform app plans into detailed screen layouts using iOS-style components.

Your response should be a JSON object with:
- screens: array of detailed screen layouts with component specifications
- components: array of reusable component definitions
- styleGuide: design system with colors, typography, spacing
- navigation: detailed navigation configuration

Use iOS design patterns: cards, navigation bars, tab bars, modals, etc.
Focus on accessibility, responsive design, and native feel.`
          },
          {
            role: 'user',
            content: `Create detailed UI layouts for this app plan: ${JSON.stringify(plan)}`
          }
        ],
        temperature: 0.6,
      }),
    });

    const uiData = await uiResponse.json();
    const ui = JSON.parse(uiData.choices[0].message.content);

    // Create component entries
    for (const component of ui.components) {
      await supabase
        .from('app_components')
        .insert({
          app_id: appId,
          name: component.name,
          type: component.type,
          props_schema: component.props || {}
        });
    }

    // Create screen entries
    for (const screen of ui.screens) {
      await supabase
        .from('app_screens')
        .insert({
          app_id: appId,
          name: screen.name,
          component_name: screen.componentName,
          layout_data: screen
        });
    }

    // Update app with UI data
    const { error: updateError } = await supabase
      .from('apps')
      .update({
        ui_data: ui,
        status: 'coding'
      })
      .eq('id', appId);

    if (updateError) {
      throw updateError;
    }

    console.log('UI composition completed:', ui);

    return new Response(JSON.stringify({ success: true, ui }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ui-composer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});