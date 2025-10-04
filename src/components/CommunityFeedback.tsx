import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { User } from "@supabase/supabase-js";

const CommunityFeedback = () => {
  const [user, setUser] = useState<User | null>(null);
  const [observationType, setObservationType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 11);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Load existing observations
    loadObservations();

    map.on('click', (e) => {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
      
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng, {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }).addTo(map);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const loadObservations = async () => {
    const { data, error } = await supabase
      .from('community_observations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error loading observations:', error);
      return;
    }

    if (data && mapInstanceRef.current) {
      data.forEach(obs => {
        const color = obs.observation_type === 'heat_stress' ? 'orange' :
                      obs.observation_type === 'flooding' ? 'blue' : 'green';
        
        L.circleMarker([obs.latitude, obs.longitude], {
          radius: 6,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.6
        }).addTo(mapInstanceRef.current!).bindPopup(`
          <strong>${obs.observation_type.replace('_', ' ').toUpperCase()}</strong><br>
          Severity: ${obs.severity}<br>
          ${obs.description ? `Description: ${obs.description}<br>` : ''}
          Reported: ${new Date(obs.created_at).toLocaleDateString()}
        `);
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit observations",
        variant: "destructive",
      });
      return;
    }

    if (!observationType || !severity || !latitude || !longitude) {
      toast({
        title: "Missing information",
        description: "Please select location, type, and severity",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('community_observations')
      .insert({
        user_id: user.id,
        observation_type: observationType,
        severity,
        description,
        latitude,
        longitude,
      });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit observation. Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
      return;
    }

    toast({
      title: "Success!",
      description: "Your observation has been recorded. Thank you for contributing!",
    });

    // Reset form
    setObservationType("");
    setSeverity("");
    setDescription("");
    setLatitude(null);
    setLongitude(null);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Reload observations
    loadObservations();
  };

  return (
    <div className="space-y-6">
      {!user && (
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-center">
            Please <a href="/auth" className="text-primary underline">sign in</a> to submit community observations
          </p>
        </Card>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Report Local Observations</h3>
        <p className="text-sm text-muted-foreground">
          Click on the map to select a location, then describe what you've observed
        </p>
      </div>

      <Card className="p-4">
        <div ref={mapRef} className="w-full h-[400px] rounded-lg mb-4" />
        
        {latitude && longitude && (
          <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        )}
      </Card>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Observation Type</label>
          <Select value={observationType} onValueChange={setObservationType}>
            <SelectTrigger>
              <SelectValue placeholder="Select observation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heat_stress">🔥 Heat Stress</SelectItem>
              <SelectItem value="flooding">💧 Flooding</SelectItem>
              <SelectItem value="pollution">🌫️ Air Pollution</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Severity</label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="Select severity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you observed..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !latitude || !longitude || !observationType || !severity || !user}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {!user ? "Sign in to Submit" : "Submit Observation"}
        </Button>
      </div>
    </div>
  );
};

export default CommunityFeedback;
