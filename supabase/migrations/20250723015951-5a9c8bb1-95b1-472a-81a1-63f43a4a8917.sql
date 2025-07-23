-- Create tables for the agentic app builder framework

-- Apps table to store generated mobile apps
CREATE TABLE public.apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning', -- planning, designing, coding, completed, error
  plan_data JSONB,
  ui_data JSONB,
  code_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Screens table for individual app screens
CREATE TABLE public.app_screens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  component_name TEXT NOT NULL,
  layout_data JSONB,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Components table for reusable components
CREATE TABLE public.app_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- card, navbar, modal, tabbar, etc.
  props_schema JSONB,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Build configurations for EAS
CREATE TABLE public.app_builds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  build_id TEXT,
  platform TEXT NOT NULL, -- ios, android, both
  status TEXT NOT NULL DEFAULT 'pending', -- pending, building, completed, error
  build_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_builds ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own apps" 
ON public.apps 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own apps" 
ON public.apps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own apps" 
ON public.apps 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own apps" 
ON public.apps 
FOR DELETE 
USING (auth.uid() = user_id);

-- Screens policies
CREATE POLICY "Users can view screens of their apps" 
ON public.app_screens 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_screens.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can create screens for their apps" 
ON public.app_screens 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_screens.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can update screens of their apps" 
ON public.app_screens 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_screens.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can delete screens of their apps" 
ON public.app_screens 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_screens.app_id AND apps.user_id = auth.uid()
));

-- Components policies
CREATE POLICY "Users can view components of their apps" 
ON public.app_components 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_components.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can create components for their apps" 
ON public.app_components 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_components.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can update components of their apps" 
ON public.app_components 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_components.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can delete components of their apps" 
ON public.app_components 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_components.app_id AND apps.user_id = auth.uid()
));

-- Builds policies
CREATE POLICY "Users can view builds of their apps" 
ON public.app_builds 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_builds.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can create builds for their apps" 
ON public.app_builds 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_builds.app_id AND apps.user_id = auth.uid()
));

CREATE POLICY "Users can update builds of their apps" 
ON public.app_builds 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.apps WHERE apps.id = app_builds.app_id AND apps.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_apps_updated_at
BEFORE UPDATE ON public.apps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_screens_updated_at
BEFORE UPDATE ON public.app_screens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_components_updated_at
BEFORE UPDATE ON public.app_components
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_builds_updated_at
BEFORE UPDATE ON public.app_builds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();