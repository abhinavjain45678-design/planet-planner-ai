-- Fix search path for update_updated_at_column function
DROP TRIGGER IF EXISTS update_community_observations_updated_at ON public.community_observations;
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

CREATE TRIGGER update_community_observations_updated_at
  BEFORE UPDATE ON public.community_observations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();