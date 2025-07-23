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
    const { prompt, appId } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use ChatGPT-4.0 as Planner Agent
    const plannerResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert React Native app planner. Analyze user prompts and create detailed app structure plans.

Your response should be a JSON object with:
- appName: string
- description: string  
- screens: array of screen objects with {name, purpose, navigation}
- features: array of key features
- navigation: navigation structure (stack, tab, drawer)
- dataModels: array of data models needed
- thirdPartyServices: array of external services needed

Focus on mobile-first iOS design patterns and React Native best practices.`
          },
          {
            role: 'user',
            content: `Create a detailed app plan for: ${prompt}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const planData = await plannerResponse.json();
    const plan = JSON.parse(planData.choices[0].message.content);

    // Update app with plan data
    const { error: updateError } = await supabase
      .from('apps')
      .update({
        name: plan.appName,
        description: plan.description,
        plan_data: plan,
        status: 'designing'
      })
      .eq('id', appId);

    if (updateError) {
      throw updateError;
    }

    console.log('App planning completed:', plan);

    return new Response(JSON.stringify({ success: true, plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in app-planner function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});