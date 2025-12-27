-- Fix cleanup_expired_tokens function to add search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < now();
  
  UPDATE public.profiles 
  SET phone_otp = NULL, otp_expires_at = NULL 
  WHERE otp_expires_at < now();
END;
$$;