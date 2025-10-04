import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Loader2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GlobalLocationSelectorProps {
  onLocationSelect: (lat: number, lon: number, data: any) => void;
  dataType: 'heat' | 'flood' | 'air_quality' | 'urban_growth';
}

const GlobalLocationSelector = ({ onLocationSelect, dataType }: GlobalLocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLon, setSelectedLon] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([20, 0], 2);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      setSelectedLat(lat);
      setSelectedLon(lng);
      
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng, {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }).addTo(map);
      }

      // Fetch satellite data for this location
      await fetchSatelliteData(lat, lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const fetchSatelliteData = async (lat: number, lon: number) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-satellite-data', {
        body: { dataType, latitude: lat, longitude: lon }
      });

      if (error) throw error;

      onLocationSelect(lat, lon, data.data);
      
      toast({
        title: "Data Retrieved",
        description: data.cached ? "Showing cached data" : "Fetched fresh satellite data",
      });
    } catch (error) {
      console.error('Error fetching satellite data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch satellite data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    try {
      // Using Nominatim geocoding (free, no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );

      if (!response.ok) throw new Error('Geocoding failed');

      const results = await response.json();
      
      if (results.length === 0) {
        toast({
          title: "Location not found",
          description: "Try a different search term",
          variant: "destructive",
        });
        return;
      }

      const { lat, lon } = results[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([latNum, lonNum], 10);
        
        if (markerRef.current) {
          markerRef.current.setLatLng([latNum, lonNum]);
        } else {
          markerRef.current = L.marker([latNum, lonNum], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/marker/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }).addTo(mapInstanceRef.current);
        }
      }

      setSelectedLat(latNum);
      setSelectedLon(lonNum);
      await fetchSatelliteData(latNum, lonNum);

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to find location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search any city or location worldwide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isLoading}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        
        <div ref={mapRef} className="w-full h-[400px] rounded-lg" />
        
        {selectedLat && selectedLon && (
          <div className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Selected: {selectedLat.toFixed(6)}, {selectedLon.toFixed(6)}
          </div>
        )}
      </Card>
    </div>
  );
};

export default GlobalLocationSelector;
