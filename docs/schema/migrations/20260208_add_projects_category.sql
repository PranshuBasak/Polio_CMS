-- Add category support for project grouping in public UI.
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS category text;

CREATE INDEX IF NOT EXISTS idx_projects_category
ON public.projects (category);
