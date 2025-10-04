-- Create community_observations table for resident submissions
CREATE TABLE IF NOT EXISTS public.community_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  observation_type TEXT NOT NULL CHECK (observation_type IN ('heat_stress', 'flooding', 'pollution')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.community_observations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read observations (public data for community benefit)
CREATE POLICY "Anyone can view observations"
  ON public.community_observations
  FOR SELECT
  USING (true);

-- Allow anyone to insert observations (no auth required for community participation)
CREATE POLICY "Anyone can submit observations"
  ON public.community_observations
  FOR INSERT
  WITH CHECK (true);

-- Create index for location-based queries
CREATE INDEX idx_observations_location ON public.community_observations (latitude, longitude);
CREATE INDEX idx_observations_type ON public.community_observations (observation_type);
CREATE INDEX idx_observations_created ON public.community_observations (created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_observations_updated_at
  BEFORE UPDATE ON public.community_observations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();