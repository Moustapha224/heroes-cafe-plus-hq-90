-- Drop all existing INSERT policies on orders table
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public order creation" ON public.orders;

-- Create a permissive INSERT policy that allows anyone to create orders
CREATE POLICY "Public can create orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);