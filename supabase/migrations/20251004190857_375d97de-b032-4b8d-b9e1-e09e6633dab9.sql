-- Create profiles table for authenticated users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  organization TEXT,
  role TEXT CHECK (role IN ('city_planner', 'researcher', 'resident', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'resident'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update community_observations to link to authenticated users
ALTER TABLE public.community_observations
  DROP CONSTRAINT IF EXISTS community_observations_user_id_check,
  ADD CONSTRAINT community_observations_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE SET NULL;

-- Update RLS policies for authenticated observations
DROP POLICY IF EXISTS "Anyone can submit observations" ON public.community_observations;
DROP POLICY IF EXISTS "Anyone can view observations" ON public.community_observations;

-- Allow authenticated users to submit observations
CREATE POLICY "Authenticated users can submit observations"
  ON public.community_observations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow everyone to view observations
CREATE POLICY "Everyone can view observations"
  ON public.community_observations
  FOR SELECT
  USING (true);

-- Allow users to update their own observations
CREATE POLICY "Users can update their own observations"
  ON public.community_observations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own observations
CREATE POLICY "Users can delete their own observations"
  ON public.community_observations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create satellite_data_cache table for storing fetched NASA data
CREATE TABLE IF NOT EXISTS public.satellite_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL CHECK (data_type IN ('heat', 'flood', 'air_quality', 'urban_growth')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour'
);

-- Enable RLS
ALTER TABLE public.satellite_data_cache ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read cached data
CREATE POLICY "Everyone can view cached satellite data"
  ON public.satellite_data_cache
  FOR SELECT
  USING (true);

-- Create index for efficient lookups
CREATE INDEX idx_satellite_cache_location ON public.satellite_data_cache (data_type, latitude, longitude);
CREATE INDEX idx_satellite_cache_expires ON public.satellite_data_cache (expires_at);