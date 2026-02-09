-- Ensure site_settings.advanced exists and contains debug logging controls.

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS advanced jsonb;

-- Normalize column type for consistent JSON operations.
ALTER TABLE public.site_settings
  ALTER COLUMN advanced TYPE jsonb
  USING advanced::jsonb;

-- Set default shape for new rows.
ALTER TABLE public.site_settings
  ALTER COLUMN advanced SET DEFAULT '{"cacheDuration":60,"debugMode":false}'::jsonb;

-- Backfill existing rows with required keys.
UPDATE public.site_settings
SET advanced =
  COALESCE(advanced, '{}'::jsonb)
  || jsonb_build_object(
    'cacheDuration',
    COALESCE((advanced ->> 'cacheDuration')::integer, 60)
  )
  || jsonb_build_object(
    'debugMode',
    COALESCE((advanced ->> 'debugMode')::boolean, false)
  );
