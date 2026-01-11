-- Add missing DELETE/UPDATE policies to strengthen RLS protection

-- 1. Prevent deletion of order_items (immutable order history)
CREATE POLICY "Prevent order_items deletion" 
ON public.order_items 
FOR DELETE 
USING (false);

-- 2. Prevent update of order_items (immutable order history)
CREATE POLICY "Prevent order_items update" 
ON public.order_items 
FOR UPDATE 
USING (false);

-- 3. Prevent deletion of orders (maintain audit trail - only admins can delete if needed)
CREATE POLICY "Only admins can delete orders" 
ON public.orders 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Allow users to delete their own password reset tokens (cleanup after use)
CREATE POLICY "Users can delete their own reset tokens" 
ON public.password_reset_tokens 
FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Prevent profile deletion (users should not delete their profiles to maintain data integrity)
CREATE POLICY "Prevent profile deletion" 
ON public.profiles 
FOR DELETE 
USING (false);