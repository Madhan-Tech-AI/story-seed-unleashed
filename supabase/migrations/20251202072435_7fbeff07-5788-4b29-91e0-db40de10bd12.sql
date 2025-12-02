-- Allow users to insert their own role during signup
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

CREATE POLICY "Users can insert their own role during signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also allow service role to insert (for the signup process)
CREATE POLICY "Service role can insert roles"
ON public.user_roles
FOR INSERT
TO service_role
WITH CHECK (true);