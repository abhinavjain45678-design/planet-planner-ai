import { useState } from "react";
import GlobalLocationSelector from "../GlobalLocationSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";

const RealTimeFloodMap = () => {
  const [satelliteData, setSatelliteData] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);

  const handleLocationSelect = (lat: number, lon: number, data: any) => {
    setLocation({ lat, lon });
    setSatelliteData(data);
  };

  return (
    <div className="space-y-4">
      <GlobalLocationSelector 
        onLocationSelect={handleLocationSelect}
        dataType="flood"
      />

      {satelliteData && location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Flood Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Elevation</p>
                <p className="text-2xl font-bold">{satelliteData.elevation?.toFixed(1)}m</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Flood Risk</p>
                <p className="text-2xl font-bold capitalize">{satelliteData.floodRisk}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Drainage</p>
                <p className="text-2xl font-bold capitalize">{satelliteData.drainageCapacity}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Data Source:</strong> {satelliteData.source}</p>
              <p><strong>Last Updated:</strong> {new Date(satelliteData.lastUpdated).toLocaleString()}</p>
              {satelliteData.note && <p><strong>Note:</strong> {satelliteData.note}</p>}
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <p className="text-sm">
                {satelliteData.floodRisk === 'high' && 
                  "⚠️ High flood risk area. Implement green infrastructure, improve drainage systems, and consider flood barriers."}
                {satelliteData.floodRisk === 'moderate' && 
                  "🔶 Moderate risk. Monitor rainfall patterns and enhance stormwater management capacity."}
                {satelliteData.floodRisk === 'low' && 
                  "✓ Low flood risk. Maintain existing drainage infrastructure and monitor for changes."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeFloodMap;
