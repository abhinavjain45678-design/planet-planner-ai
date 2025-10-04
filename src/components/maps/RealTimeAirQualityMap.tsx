import { useState } from "react";
import GlobalLocationSelector from "../GlobalLocationSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind } from "lucide-react";

const RealTimeAirQualityMap = () => {
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
        dataType="air_quality"
      />

      {satelliteData && location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-secondary" />
              Air Quality Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Air Quality Index</p>
                <p className="text-2xl font-bold">{satelliteData.aqi}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-2xl font-bold capitalize">{satelliteData.status}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">PM2.5</p>
                <p className="text-2xl font-bold">{satelliteData.pm25} μg/m³</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">NO₂</p>
                <p className="text-2xl font-bold">{satelliteData.no2} μg/m³</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Data Source:</strong> {satelliteData.source}</p>
              <p><strong>Last Updated:</strong> {new Date(satelliteData.lastUpdated).toLocaleString()}</p>
              {satelliteData.note && <p><strong>Note:</strong> {satelliteData.note}</p>}
            </div>

            <div className="p-4 bg-secondary/10 rounded-lg">
              <h4 className="font-semibold mb-2">Health Impact & Actions</h4>
              <p className="text-sm">
                {satelliteData.aqi > 150 && 
                  "⚠️ Unhealthy air quality. Reduce traffic emissions, increase green spaces, and monitor industrial sources."}
                {satelliteData.aqi > 100 && satelliteData.aqi <= 150 && 
                  "🔶 Unhealthy for sensitive groups. Implement emission reduction strategies and air quality monitoring."}
                {satelliteData.aqi > 50 && satelliteData.aqi <= 100 && 
                  "✓ Moderate air quality. Continue monitoring and maintain emission control measures."}
                {satelliteData.aqi <= 50 && 
                  "✓ Good air quality. Maintain current environmental policies and green infrastructure."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeAirQualityMap;
