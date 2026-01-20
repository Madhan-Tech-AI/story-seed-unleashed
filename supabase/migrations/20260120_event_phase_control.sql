-- Add payment and registration phase control columns to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS payment_deadline timestamp with time zone;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_start_date timestamp with time zone;

-- Comment on columns
COMMENT ON COLUMN public.events.payment_deadline IS 'When the payment portal closes automatically';
COMMENT ON COLUMN public.events.registration_start_date IS 'When the story registration portal opens automatically';
