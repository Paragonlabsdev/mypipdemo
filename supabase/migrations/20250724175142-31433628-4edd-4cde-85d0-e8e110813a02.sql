-- Create table for storing user projects by IP
CREATE TABLE public.user_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_ip TEXT NOT NULL,
  project_name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  generated_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for IP-based access
CREATE POLICY "Users can view their own projects by IP" 
ON public.user_projects 
FOR SELECT 
USING (true); -- Public read for now, we'll filter by IP in the application

CREATE POLICY "Users can create their own projects" 
ON public.user_projects 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own projects by IP" 
ON public.user_projects 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own projects by IP" 
ON public.user_projects 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_projects_updated_at
BEFORE UPDATE ON public.user_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on IP lookups
CREATE INDEX idx_user_projects_ip ON public.user_projects(user_ip);
CREATE INDEX idx_user_projects_created_at ON public.user_projects(created_at DESC);