-- Create skill_categories table
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

-- Create policies (assuming public read, authenticated write)
CREATE POLICY "Allow public read access" ON public.skill_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.skill_categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.skill_categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON public.skill_categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Seed default categories
INSERT INTO public.skill_categories (id, name, description, "order") VALUES
('core', 'Core Languages', 'Primary programming languages', 1),
('backend', 'Backend Development', 'Server-side frameworks and APIs', 2),
('frontend', 'Frontend Development', 'Client-side technologies and frameworks', 3),
('databases', 'Databases', 'Database systems and design', 4),
('devops', 'DevOps & Tools', 'Development operations and tooling', 5),
('architecture', 'Architecture & Design', 'System design and software architecture', 6),
('emerging', 'Emerging Tech', 'Blockchain, AI, and cutting-edge technologies', 7),
('cms', 'CMS & Platforms', 'Content management and platform development', 8),
('learning', 'Currently Learning', 'Technologies actively being mastered', 9)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    "order" = EXCLUDED."order";

-- Optional: Add foreign key constraint to skills table if it doesn't exist
-- WARNING: This might fail if there are existing skills with categories that don't exist in the new table.
-- ALTER TABLE public.skills 
-- ADD CONSTRAINT fk_skills_category 
-- FOREIGN KEY (category) 
-- REFERENCES public.skill_categories (id)
-- ON DELETE SET NULL;
