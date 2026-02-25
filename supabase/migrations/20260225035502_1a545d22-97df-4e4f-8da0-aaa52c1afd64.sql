
-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number SERIAL,
  person_type TEXT NOT NULL DEFAULT 'pf' CHECK (person_type IN ('pf', 'pj')),
  full_name TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_reference TEXT NOT NULL,
  estimated_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Only authenticated can view/manage
CREATE POLICY "Only authenticated can view leads"
  ON public.leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated can update leads"
  ON public.leads FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated can delete leads"
  ON public.leads FOR DELETE
  USING (auth.role() = 'authenticated');
