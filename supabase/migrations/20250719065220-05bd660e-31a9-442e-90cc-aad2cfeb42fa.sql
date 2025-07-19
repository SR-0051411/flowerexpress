-- Add phone number to profiles table for OTP verification
ALTER TABLE public.profiles 
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_otp TEXT,
ADD COLUMN otp_expires_at TIMESTAMP WITH TIME ZONE;

-- Create password reset tokens table
CREATE TABLE public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL,
  phone_otp TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '15 minutes'),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on password_reset_tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for password_reset_tokens
CREATE POLICY "Users can view their own reset tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reset tokens" 
ON public.password_reset_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reset tokens" 
ON public.password_reset_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < now();
  
  UPDATE public.profiles 
  SET phone_otp = NULL, otp_expires_at = NULL 
  WHERE otp_expires_at < now();
END;
$$;