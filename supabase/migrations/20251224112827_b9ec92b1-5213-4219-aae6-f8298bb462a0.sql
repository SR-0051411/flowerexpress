-- Add order_notifications column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS order_notifications boolean DEFAULT true;