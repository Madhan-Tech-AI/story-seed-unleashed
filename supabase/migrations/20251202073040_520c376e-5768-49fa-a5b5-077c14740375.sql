-- Update the trigger to automatically assign 'user' role to Google OAuth signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User')
  );

  -- Check if user signed up via OAuth (Google)
  -- OAuth users have provider in app_metadata
  IF new.app_metadata->>'provider' = 'google' THEN
    -- Automatically assign 'user' role for Google OAuth signups
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;