import { useState } from "react";
import GlobalLocationSelector from "../GlobalLocationSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

const RealTimeUrbanGrowthMap = () => {
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
        dataType="urban_growth"
      />

      {satelliteData && location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-secondary" />
              Urban Growth Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Built-Up Area</p>
                <p className="text-2xl font-bold">{satelliteData.builtUpArea}%</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Vegetation Index</p>
                <p className="text-2xl font-bold">{satelliteData.vegetationIndex?.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Land Use</p>
                <p className="text-lg font-bold capitalize">{satelliteData.landUseType?.replace('_', ' ')}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</p>
              </div>
            </div>

            {satelliteData.changeDetection && (
              <div className="space-y-2">
                <h4 className="font-semibold">Urban Change Detection</h4>
                {Object.entries(satelliteData.changeDetection).map(([period, change]) => (
                  <div key={period} className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">{period}</span>
                    <span className="text-sm font-medium capitalize">{change as string}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Data Source:</strong> {satelliteData.source}</p>
              <p><strong>Last Updated:</strong> {new Date(satelliteData.lastUpdated).toLocaleString()}</p>
              {satelliteData.note && <p><strong>Note:</strong> {satelliteData.note}</p>}
            </div>

            <div className="p-4 bg-secondary/10 rounded-lg">
              <h4 className="font-semibold mb-2">Planning Recommendations</h4>
              <p className="text-sm">
                {satelliteData.builtUpArea > 70 && 
                  "⚠️ High urban density. Focus on vertical development, green spaces, and sustainable infrastructure."}
                {satelliteData.builtUpArea > 40 && satelliteData.builtUpArea <= 70 && 
                  "🔶 Moderate urbanization. Balance growth with environmental preservation and green corridors."}
                {satelliteData.builtUpArea <= 40 && 
                  "✓ Low to moderate development. Opportunity for planned sustainable urban expansion."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeUrbanGrowthMap;
