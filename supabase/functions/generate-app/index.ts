import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppStructure {
  schema_sql: string;
  pages: Array<{
    name: string;
    route: string;
    components: string[];
  }>;
  components: Record<string, {
    type: string;
    fields?: string[];
    data?: string;
    source?: string;
    props?: Record<string, any>;
  }>;
  pageSelectorUI: string;
  api_endpoints: string[];
  summary: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Generating app for prompt:', prompt);

    // Use OpenAI for understanding and planning
    const planningResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are MyPip's app planning agent. Analyze the user's app idea and create a detailed plan.

Return a JSON object with:
- app_type: category of app
- pages_needed: array of page names and purposes
- key_features: main features to implement
- data_entities: what data needs to be stored
- user_flow: how users will navigate

Be specific and practical.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    const planningData = await planningResponse.json();
    const appPlan = planningData.choices[0].message.content;
    console.log('App plan created:', appPlan);

    // Use Claude for generating the structured code
    const codeResponse = await fetch('https://api.anthropic.com/v1/messages', {
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
            content: `You are MyPip's code generation agent. Based on this app plan:

${appPlan}

Generate a complete app structure for: "${prompt}"

Return ONLY a valid JSON object with this exact structure:
{
  "schema_sql": "CREATE TABLE statements for Supabase PostgreSQL",
  "pages": [
    {
      "name": "PageName",
      "route": "/route",
      "components": ["Component1", "Component2"]
    }
  ],
  "components": {
    "ComponentName": {
      "type": "form|card|list|button|text",
      "fields": ["field1", "field2"],
      "data": "data_source",
      "props": {}
    }
  },
  "pageSelectorUI": "React component code for page navigation",
  "api_endpoints": ["/endpoint1", "/endpoint2"],
  "summary": "Brief description of the generated app"
}

Requirements:
- Use TailwindCSS classes for styling
- Include proper PostgreSQL schema with foreign keys
- Make components interactive and functional
- Include at least 2-3 pages
- Add proper navigation between pages
- Use realistic sample data
- Keep component types simple: form, card, list, button, text, image
- Ensure all SQL is Supabase compatible with RLS policies`
          }
        ]
      }),
    });

    const codeData = await codeResponse.json();
    let generatedApp: AppStructure;
    
    try {
      // Extract JSON from Claude's response
      const content = codeData.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedApp = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      // Fallback response
      generatedApp = {
        schema_sql: `-- Generated schema for: ${prompt}
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own items" ON public.items FOR ALL USING (auth.uid() = user_id);`,
        pages: [
          {
            name: "Home",
            route: "/",
            components: ["WelcomeCard", "QuickActions"]
          },
          {
            name: "Dashboard",
            route: "/dashboard",
            components: ["StatsCard", "ItemList", "AddButton"]
          },
          {
            name: "Profile",
            route: "/profile",
            components: ["ProfileCard", "SettingsForm"]
          }
        ],
        components: {
          "WelcomeCard": {
            type: "card",
            props: {
              title: "Welcome to Your App",
              description: "Get started with your personalized experience"
            }
          },
          "QuickActions": {
            type: "button",
            props: {
              actions: ["View Dashboard", "Add Item", "Settings"]
            }
          },
          "StatsCard": {
            type: "card",
            data: "user_stats",
            props: {
              metrics: ["Total Items", "Recent Activity", "Achievements"]
            }
          },
          "ItemList": {
            type: "list",
            source: "items",
            props: {
              fields: ["title", "description", "created_at"]
            }
          },
          "AddButton": {
            type: "button",
            props: {
              text: "Add New Item",
              action: "create_item"
            }
          },
          "ProfileCard": {
            type: "card",
            data: "user_profile",
            props: {
              fields: ["name", "email", "member_since"]
            }
          },
          "SettingsForm": {
            type: "form",
            fields: ["name", "email", "notifications"],
            props: {
              submitText: "Save Changes"
            }
          }
        },
        pageSelectorUI: `<div className="flex justify-center gap-2 p-4 bg-gray-100 border-t">
  {["Home", "Dashboard", "Profile"].map(page => (
    <button 
      key={page}
      onClick={() => setCurrentPage(page)}
      className={\`px-4 py-2 rounded-lg transition-colors \${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}\`}
    >
      {page}
    </button>
  ))}
</div>`,
        api_endpoints: ["/api/items", "/api/users", "/api/stats"],
        summary: `Generated a ${prompt} app with 3 pages: Home (welcome & quick actions), Dashboard (stats & item management), and Profile (user settings). Includes proper database schema with RLS policies and a navigation system.`
      };
    }

    console.log('Generated app structure:', generatedApp);

    return new Response(JSON.stringify(generatedApp), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating app:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});