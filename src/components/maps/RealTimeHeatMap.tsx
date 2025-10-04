import { useState } from "react";
import GlobalLocationSelector from "../GlobalLocationSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

const RealTimeHeatMap = () => {
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
        dataType="heat"
      />

      {satelliteData && location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-accent" />
              Heat Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Average Temperature</p>
                <p className="text-2xl font-bold">{satelliteData.avgTemperature?.toFixed(1)}°C</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Max Temperature</p>
                <p className="text-2xl font-bold">{satelliteData.maxTemperature?.toFixed(1)}°C</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Heat Index</p>
                <p className="text-2xl font-bold capitalize">{satelliteData.heatIndex}</p>
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

            <div className="p-4 bg-accent/10 rounded-lg">
              <h4 className="font-semibold mb-2">Interpretation</h4>
              <p className="text-sm">
                {satelliteData.heatIndex === 'critical' && 
                  "⚠️ Critical heat stress detected. Consider implementing cooling strategies like green roofs, reflective surfaces, and increased vegetation."}
                {satelliteData.heatIndex === 'high' && 
                  "🔶 High heat stress. Urban heat island mitigation recommended through tree planting and cool pavement programs."}
                {satelliteData.heatIndex === 'moderate' && 
                  "✓ Moderate heat levels. Continue monitoring and maintain existing green infrastructure."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeHeatMap;
