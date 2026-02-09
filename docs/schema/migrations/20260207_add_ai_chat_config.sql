-- AI Chat configuration tables for dynamic prompt/model/context management

-- =====================================================
-- AI CHAT SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_chat_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'default',
  provider text NOT NULL DEFAULT 'google',
  model text NOT NULL DEFAULT 'gemini-3-flash-preview',
  system_prompt text NOT NULL,
  temperature double precision,
  top_p double precision,
  max_output_tokens integer,
  include_site_context boolean NOT NULL DEFAULT true,
  include_skills_context boolean NOT NULL DEFAULT true,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_chat_settings_name
  ON public.ai_chat_settings (name);

CREATE INDEX IF NOT EXISTS idx_ai_chat_settings_enabled
  ON public.ai_chat_settings (enabled);

-- =====================================================
-- AI CHAT CONTEXT BLOCKS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_chat_context_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_id uuid NOT NULL REFERENCES public.ai_chat_settings(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_context_blocks_settings
  ON public.ai_chat_context_blocks (settings_id);

CREATE INDEX IF NOT EXISTS idx_ai_chat_context_blocks_order
  ON public.ai_chat_context_blocks (settings_id, order_index);

-- =====================================================
-- AI CHAT SKILLS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_chat_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_id uuid NOT NULL REFERENCES public.ai_chat_settings(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  instructions text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_skills_settings
  ON public.ai_chat_skills (settings_id);

CREATE INDEX IF NOT EXISTS idx_ai_chat_skills_order
  ON public.ai_chat_skills (settings_id, order_index);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.ai_chat_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_context_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_skills ENABLE ROW LEVEL SECURITY;

-- Public read for runtime prompt loading from /api/chat.
CREATE POLICY "Public can view ai chat settings"
  ON public.ai_chat_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can view ai chat context blocks"
  ON public.ai_chat_context_blocks FOR SELECT
  USING (true);

CREATE POLICY "Public can view ai chat skills"
  ON public.ai_chat_skills FOR SELECT
  USING (true);

-- Authenticated write for admin CMS.
CREATE POLICY "Authenticated can manage ai chat settings"
  ON public.ai_chat_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage ai chat context blocks"
  ON public.ai_chat_context_blocks FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage ai chat skills"
  ON public.ai_chat_skills FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Default seed row for first run.
INSERT INTO public.ai_chat_settings (
  name,
  provider,
  model,
  system_prompt,
  include_site_context,
  include_skills_context,
  enabled
)
SELECT
  'default',
  'google',
  'gemini-3-flash-preview',
  'You are a helpful portfolio assistant. Keep answers concise, factual, and relevant to the portfolio context.',
  true,
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.ai_chat_settings WHERE name = 'default'
);
