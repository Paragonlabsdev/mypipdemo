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
    
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get app data with plan and UI
    const { data: app, error: appError } = await supabase
      .from('apps')
      .select('*')
      .eq('id', appId)
      .single();

    if (appError || !app) {
      throw new Error('App not found');
    }

    const plan = app.plan_data;
    const ui = app.ui_data;

    // Use Claude SDK as Code Generator Agent
    const codeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: `You are an expert React Native developer with TypeScript and Expo SDK expertise. Generate production-ready code for a mobile app.

App Plan: ${JSON.stringify(plan)}
UI Design: ${JSON.stringify(ui)}

Generate complete React Native code with:
1. App.tsx with navigation setup
2. All screen components with TypeScript
3. All reusable components
4. Navigation configuration
5. Utils and types
6. Package.json with dependencies
7. EAS configuration files

Use latest React Native, Expo SDK 51+, TypeScript, and navigation best practices.
Include proper error handling, loading states, and accessibility.

Return ONLY a JSON object with file structure: { "files": { "path/to/file.tsx": "file content", ... } }`
          }
        ]
      }),
    });

    const codeData = await codeResponse.json();
    const code = JSON.parse(codeData.content[0].text);

    // Update screen components with generated code
    const { data: screens } = await supabase
      .from('app_screens')
      .select('*')
      .eq('app_id', appId);

    if (screens) {
      for (const screen of screens) {
        const screenCode = code.files[`screens/${screen.component_name}.tsx`] || '';
        await supabase
          .from('app_screens')
          .update({ code: screenCode })
          .eq('id', screen.id);
      }
    }

    // Update components with generated code
    const { data: components } = await supabase
      .from('app_components')
      .select('*')
      .eq('app_id', appId);

    if (components) {
      for (const component of components) {
        const componentCode = code.files[`components/${component.name}.tsx`] || '';
        await supabase
          .from('app_components')
          .update({ code: componentCode })
          .eq('id', component.id);
      }
    }

    // Update app with code data
    const { error: updateError } = await supabase
      .from('apps')
      .update({
        code_data: code,
        status: 'completed'
      })
      .eq('id', appId);

    if (updateError) {
      throw updateError;
    }

    console.log('Code generation completed');

    return new Response(JSON.stringify({ success: true, code }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in code-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});