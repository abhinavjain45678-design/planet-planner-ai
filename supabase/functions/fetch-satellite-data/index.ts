import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dataType, latitude, longitude } = await req.json();

    if (!dataType || !latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first (within 1 hour)
    const { data: cached } = await supabase
      .from('satellite_data_cache')
      .select('*')
      .eq('data_type', dataType)
      .gte('latitude', latitude - 0.01)
      .lte('latitude', latitude + 0.01)
      .gte('longitude', longitude - 0.01)
      .lte('longitude', longitude + 0.01)
      .gt('expires_at', new Date().toISOString())
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    if (cached) {
      console.log('Returning cached data');
      return new Response(
        JSON.stringify({ data: cached.data, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch new data based on type
    let satelliteData;
    
    switch (dataType) {
      case 'heat':
        satelliteData = await fetchHeatData(latitude, longitude);
        break;
      case 'flood':
        satelliteData = await fetchFloodData(latitude, longitude);
        break;
      case 'air_quality':
        satelliteData = await fetchAirQualityData(latitude, longitude);
        break;
      case 'urban_growth':
        satelliteData = await fetchUrbanGrowthData(latitude, longitude);
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid data type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    // Cache the result
    await supabase
      .from('satellite_data_cache')
      .insert({
        data_type: dataType,
        latitude,
        longitude,
        data: satelliteData,
      });

    return new Response(
      JSON.stringify({ data: satelliteData, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error fetching satellite data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// NASA MODIS Land Surface Temperature (heat islands)
async function fetchHeatData(lat: number, lon: number) {
  // Using NASA POWER API for solar radiation and temperature data
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const startDateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');

  try {
    const response = await fetch(
      `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&start=${startDateStr}&end=${endDateStr}&format=JSON`
    );

    if (!response.ok) {
      throw new Error(`NASA POWER API error: ${response.status}`);
    }

    const data = await response.json();
    const temps = Object.values(data.properties.parameter.T2M || {}) as number[];
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const maxTemp = Math.max(...temps);

    return {
      avgTemperature: avgTemp,
      maxTemperature: maxTemp,
      heatIndex: maxTemp > 35 ? 'critical' : maxTemp > 30 ? 'high' : 'moderate',
      source: 'NASA POWER API',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching heat data:', error);
    // Return simulated data as fallback
    return {
      avgTemperature: 28 + Math.random() * 10,
      maxTemperature: 32 + Math.random() * 15,
      heatIndex: 'moderate',
      source: 'Simulated (API unavailable)',
      lastUpdated: new Date().toISOString(),
    };
  }
}

// SRTM elevation + precipitation estimates
async function fetchFloodData(lat: number, lon: number) {
  try {
    // Using Open-Elevation API (free, no key required)
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
    );

    if (!response.ok) {
      throw new Error(`Elevation API error: ${response.status}`);
    }

    const data = await response.json();
    const elevation = data.results[0]?.elevation || 0;

    return {
      elevation,
      floodRisk: elevation < 10 ? 'high' : elevation < 50 ? 'moderate' : 'low',
      drainageCapacity: elevation < 10 ? 'poor' : 'good',
      source: 'Open-Elevation API',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching flood data:', error);
    return {
      elevation: 50 + Math.random() * 100,
      floodRisk: 'moderate',
      drainageCapacity: 'fair',
      source: 'Simulated (API unavailable)',
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Sentinel-5P TROPOMI air quality (simplified simulation)
async function fetchAirQualityData(lat: number, lon: number) {
  // Note: Real Sentinel-5P data requires Copernicus API credentials
  // This is a simplified simulation demonstrating the data structure
  return {
    aqi: Math.floor(50 + Math.random() * 100),
    pm25: Math.floor(10 + Math.random() * 40),
    no2: Math.floor(20 + Math.random() * 60),
    o3: Math.floor(30 + Math.random() * 50),
    status: Math.random() > 0.5 ? 'moderate' : 'good',
    source: 'Simulated Sentinel-5P TROPOMI',
    lastUpdated: new Date().toISOString(),
    note: 'Real-time Copernicus data requires API credentials',
  };
}

// Landsat surface reflectance for urban change detection
async function fetchUrbanGrowthData(lat: number, lon: number) {
  // This would typically use Landsat Collection 2 data
  // Simulating urban development indicators
  return {
    builtUpArea: Math.floor(40 + Math.random() * 50),
    vegetationIndex: 0.3 + Math.random() * 0.4,
    changeDetection: {
      '2015-2020': Math.random() > 0.5 ? 'expansion' : 'stable',
      '2020-2025': Math.random() > 0.6 ? 'rapid_growth' : 'moderate_growth',
    },
    landUseType: 'mixed_urban',
    source: 'Simulated Landsat Analysis',
    lastUpdated: new Date().toISOString(),
    note: 'Real Landsat analysis requires Earth Engine or USGS EROS access',
  };
}
