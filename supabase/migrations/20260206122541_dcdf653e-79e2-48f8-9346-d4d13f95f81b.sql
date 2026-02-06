-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reservations
CREATE POLICY "Anyone can insert reservations" 
ON public.reservations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow admins to view all reservations
CREATE POLICY "Admins can view all reservations" 
ON public.reservations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update reservations
CREATE POLICY "Admins can update reservations" 
ON public.reservations 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to generate reservation number
CREATE OR REPLACE FUNCTION public.generate_reservation_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  year_part TEXT;
  seq_num INTEGER;
BEGIN
  year_part := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(reservation_number FROM 10) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.reservations
  WHERE reservation_number LIKE 'RES-' || year_part || '-%';
  
  NEW.reservation_number := 'RES-' || year_part || '-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

-- Create trigger for auto-generating reservation number
CREATE TRIGGER generate_reservation_number_trigger
BEFORE INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.generate_reservation_number();

-- Create trigger for updating updated_at
CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();