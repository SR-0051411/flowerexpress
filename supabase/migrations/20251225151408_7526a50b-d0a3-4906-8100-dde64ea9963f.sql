-- Add RLS policies for otp_rate_limits table
-- This table should only be accessible by the backend/service role for rate limiting purposes
-- We'll add a restrictive policy that prevents direct user access while allowing service role access

-- Policy to allow service role to manage rate limits (service role bypasses RLS by default)
-- For authenticated users, we don't want them to see rate limit data
CREATE POLICY "Deny all access to users"
ON public.otp_rate_limits
FOR ALL
USING (false);

-- Note: Service role (used by edge functions) bypasses RLS, so rate limiting will still work