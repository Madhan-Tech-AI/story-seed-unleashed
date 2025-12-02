-- Create registrations table to store competition registration data
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 5 AND age <= 18),
  city TEXT NOT NULL,
  
  -- Story Details
  story_title TEXT NOT NULL,
  category TEXT NOT NULL,
  story_description TEXT NOT NULL,
  
  -- YouTube link (to be filled later)
  yt_link TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
ON public.registrations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own registrations
CREATE POLICY "Users can insert their own registrations"
ON public.registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update their own registrations"
ON public.registrations
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.registrations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all registrations
CREATE POLICY "Admins can update all registrations"
ON public.registrations
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();