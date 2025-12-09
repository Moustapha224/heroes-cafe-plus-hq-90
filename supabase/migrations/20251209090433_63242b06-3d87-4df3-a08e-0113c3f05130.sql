-- Drop the current INSERT policy
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;

-- Create a truly public INSERT policy without role restrictions
CREATE POLICY "Anyone can insert orders" 
ON public.orders 
FOR INSERT 
TO public
WITH CHECK (true);