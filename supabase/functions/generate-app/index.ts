
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratedApp {
  schema_sql: string;
  pages: Array<{
    name: string;
    route: string;
    componentCode: string;
  }>;
  components: Record<string, string>;
  summary: string;
}

const generateComponentCode = (componentName: string, type: string, props: any = {}) => {
  switch (type) {
    case 'card':
      return `import React from 'react';
import { Card } from '@/components/ui/card';

const ${componentName} = () => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">${props.title || componentName}</h3>
      <p className="text-sm text-muted-foreground">${props.description || 'Card component'}</p>
    </Card>
  );
};

export default ${componentName};`;

    case 'form':
      const fields = props.fields || ['name', 'email'];
      const fieldInputs = fields.map(field => `
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 capitalize">${field}</label>
          <input
            type="${field === 'email' ? 'email' : 'text'}"
            className="w-full p-2 border rounded-md"
            placeholder="Enter ${field}"
            value={formData.${field} || ''}
            onChange={(e) => setFormData({...formData, ${field}: e.target.value})}
          />
        </div>`).join('');

      return `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const ${componentName} = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      ${fieldInputs}
      <Button type="submit" className="w-full">
        ${props.submitText || 'Submit'}
      </Button>
    </form>
  );
};

export default ${componentName};`;

    case 'list':
      return `import React, { useState, useEffect } from 'react';

const ${componentName} = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Simulate data loading
    setItems([
      { id: 1, name: 'Sample Item 1', description: 'Sample description 1' },
      { id: 2, name: 'Sample Item 2', description: 'Sample description 2' },
      { id: 3, name: 'Sample Item 3', description: 'Sample description 3' },
    ]);
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">${componentName}</h3>
      {items.map(item => (
        <div key={item.id} className="p-3 border rounded-lg">
          <h4 className="font-medium">{item.name}</h4>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ${componentName};`;

    case 'button':
      return `import React from 'react';
import { Button } from '@/components/ui/button';

const ${componentName} = () => {
  const handleClick = () => {
    console.log('${componentName} clicked');
  };

  return (
    <Button onClick={handleClick} className="w-full">
      ${props.text || componentName}
    </Button>
  );
};

export default ${componentName};`;

    default:
      return `import React from 'react';

const ${componentName} = () => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">${componentName}</h3>
      <p className="text-sm text-muted-foreground">Component type: ${type}</p>
    </div>
  );
};

export default ${componentName};`;
  }
};

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
  "schema_sql": "CREATE TABLE statements for Supabase PostgreSQL with RLS policies",
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
      "props": {"key": "value"}
    }
  },
  "summary": "Brief description of the generated app"
}

Requirements:
- Include proper PostgreSQL schema with foreign keys and RLS policies
- Make components interactive and functional
- Include at least 2-3 pages with logical navigation
- Use realistic component types: form, card, list, button, text
- Ensure all SQL is Supabase compatible`
          }
        ]
      }),
    });

    const codeData = await codeResponse.json();
    let parsedApp: any;
    
    try {
      let content = '';
      if (codeData.content && Array.isArray(codeData.content) && codeData.content[0]) {
        content = codeData.content[0].text;
      } else if (codeData.content && typeof codeData.content === 'string') {
        content = codeData.content;
      } else {
        throw new Error('Unexpected response format from Claude');
      }
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedApp = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response, using fallback:', parseError);
      
      // Create a smart fallback based on the prompt
      const promptLower = prompt.toLowerCase();
      
      if (promptLower.includes('todo') || promptLower.includes('task')) {
        parsedApp = {
          schema_sql: `CREATE TABLE IF NOT EXISTS public.todos (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT NOW()
          );
          
          ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
          CREATE POLICY "Users can manage their todos" ON public.todos FOR ALL USING (auth.uid() = user_id);`,
          pages: [
            { name: "Dashboard", route: "/", components: ["TodoList", "AddTodoForm"] },
            { name: "Completed", route: "/completed", components: ["CompletedTodos"] }
          ],
          components: {
            "TodoList": { type: "list", props: { title: "My Todos" } },
            "AddTodoForm": { type: "form", fields: ["title", "description"], props: { submitText: "Add Todo" } },
            "CompletedTodos": { type: "list", props: { title: "Completed Tasks" } }
          },
          summary: "A todo list app with task management"
        };
      } else if (promptLower.includes('blog') || promptLower.includes('post')) {
        parsedApp = {
          schema_sql: `CREATE TABLE IF NOT EXISTS public.posts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            published BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT NOW()
          );
          
          ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
          CREATE POLICY "Users can manage their posts" ON public.posts FOR ALL USING (auth.uid() = user_id);`,
          pages: [
            { name: "Home", route: "/", components: ["PostList", "CreatePostButton"] },
            { name: "Create", route: "/create", components: ["PostForm"] },
            { name: "Profile", route: "/profile", components: ["UserProfile", "UserPosts"] }
          ],
          components: {
            "PostList": { type: "list", props: { title: "Latest Posts" } },
            "CreatePostButton": { type: "button", props: { text: "Create New Post" } },
            "PostForm": { type: "form", fields: ["title", "content"], props: { submitText: "Publish Post" } },
            "UserProfile": { type: "card", props: { title: "Profile", description: "User information" } },
            "UserPosts": { type: "list", props: { title: "My Posts" } }
          },
          summary: "A blog platform for creating and sharing posts"
        };
      } else {
        parsedApp = {
          schema_sql: `CREATE TABLE IF NOT EXISTS public.items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW()
          );
          
          ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
          CREATE POLICY "Users can manage their items" ON public.items FOR ALL USING (auth.uid() = user_id);`,
          pages: [
            { name: "Home", route: "/", components: ["ItemList", "WelcomeCard"] },
            { name: "Add", route: "/add", components: ["ItemForm"] }
          ],
          components: {
            "ItemList": { type: "list", props: { title: "My Items" } },
            "WelcomeCard": { type: "card", props: { title: "Welcome", description: "Manage your items" } },
            "ItemForm": { type: "form", fields: ["name", "description"], props: { submitText: "Add Item" } }
          },
          summary: `A ${prompt} management app`
        };
      }
    }

    // Generate React component code for each component
    const componentCodeMap: Record<string, string> = {};
    Object.entries(parsedApp.components).forEach(([name, config]: [string, any]) => {
      componentCodeMap[name] = generateComponentCode(name, config.type, config.props);
    });

    // Generate page component code
    const pagesWithCode = parsedApp.pages.map((page: any) => ({
      name: page.name,
      route: page.route,
      componentCode: `import React from 'react';
${page.components.map((comp: string) => `import ${comp} from '../components/${comp}';`).join('\n')}

const ${page.name}Page = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">${page.name}</h1>
      ${page.components.map((comp: string) => `<${comp} />`).join('\n      ')}
    </div>
  );
};

export default ${page.name}Page;`
    }));

    const generatedApp: GeneratedApp = {
      schema_sql: parsedApp.schema_sql,
      pages: pagesWithCode,
      components: componentCodeMap,
      summary: parsedApp.summary
    };

    console.log('Generated functional app structure');

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
