import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimeHeatMap from "../maps/RealTimeHeatMap";
import RealTimeFloodMap from "../maps/RealTimeFloodMap";
import RealTimeAirQualityMap from "../maps/RealTimeAirQualityMap";
import RealTimeUrbanGrowthMap from "../maps/RealTimeUrbanGrowthMap";
import CommunityFeedback from "../CommunityFeedback";

const UrbanChallenges = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Urban Climate Challenges</h2>
        <p className="text-muted-foreground">
          Interactive analysis tools powered by NASA and partner space agency data
        </p>
      </div>

      <Tabs defaultValue="heat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="heat">Heat Islands</TabsTrigger>
          <TabsTrigger value="flood">Flood Risk</TabsTrigger>
          <TabsTrigger value="air">Air Quality</TabsTrigger>
          <TabsTrigger value="growth">Urban Growth</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="heat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🔥 Real-Time Heat Vulnerability Analysis</CardTitle>
              <CardDescription>
                Search any location worldwide to analyze heat stress using NASA POWER API data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealTimeHeatMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• NASA POWER API - Solar Radiation & Temperature</li>
                  <li>• MODIS Land Surface Temperature (LST)</li>
                  <li>• Real-time global coverage at any coordinates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🌊 Global Flood Risk Assessment</CardTitle>
              <CardDescription>
                Analyze elevation and flood risk for any location using SRTM elevation data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealTimeFloodMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Open-Elevation API (SRTM data)</li>
                  <li>• NASA SRTM Digital Elevation Model</li>
                  <li>• Global coverage for elevation analysis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="air" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🌫️ Air Quality Monitoring</CardTitle>
              <CardDescription>
                Global air quality analysis (Sentinel-5P TROPOMI data simulation)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealTimeAirQualityMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sentinel-5P TROPOMI (Simulated - requires Copernicus credentials)</li>
                  <li>• NO₂, PM₂.₅, and O₃ measurements</li>
                  <li>• Real Copernicus API integration available with credentials</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🏙️ Urban Growth Scanner</CardTitle>
              <CardDescription>
                Analyze urban development patterns worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RealTimeUrbanGrowthMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Landsat 8/9 Surface Reflectance (simulated)</li>
                  <li>• Sentinel-2 Multi-Spectral Imagery</li>
                  <li>• Real analysis requires Google Earth Engine or USGS access</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🤝 Community Feedback Layer</CardTitle>
              <CardDescription>
                Resident observations integrated with satellite data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityFeedback />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UrbanChallenges;
