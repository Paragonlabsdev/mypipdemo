-- Drop all agentic framework tables
DROP TABLE IF EXISTS public.app_builds CASCADE;
DROP TABLE IF EXISTS public.app_components CASCADE;
DROP TABLE IF EXISTS public.app_screens CASCADE;
DROP TABLE IF EXISTS public.apps CASCADE;

-- Drop the update function that was created for these tables
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;