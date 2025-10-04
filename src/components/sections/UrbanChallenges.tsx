import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeatVulnerabilityMap from "../maps/HeatVulnerabilityMap";
import FloodRiskMap from "../maps/FloodRiskMap";
import AirQualityMap from "../maps/AirQualityMap";
import UrbanGrowthMap from "../maps/UrbanGrowthMap";
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
              <CardTitle>🔥 Heat Vulnerability Index</CardTitle>
              <CardDescription>
                NASA MODIS & Landsat thermal data reveal urban heat islands and vulnerable populations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeatVulnerabilityMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• NASA MODIS Land Surface Temperature</li>
                  <li>• Landsat 8/9 Thermal Infrared Sensor (TIRS)</li>
                  <li>• SEDAC Population Density & Vulnerability Indices</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🌊 Flood Risk & Stormwater</CardTitle>
              <CardDescription>
                SRTM elevation + TRMM rainfall patterns for flood modeling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FloodRiskMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• NASA SRTM Digital Elevation Model (30m resolution)</li>
                  <li>• TRMM/GPM Precipitation Data</li>
                  <li>• Copernicus EU-DEM for European cities</li>
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
                Sentinel-5P TROPOMI & AERONET pollution tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AirQualityMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• ESA Sentinel-5P TROPOMI (NO₂, PM₂.₅, O₃)</li>
                  <li>• NASA AERONET Aerosol Optical Depth</li>
                  <li>• Copernicus Atmosphere Monitoring Service (CAMS)</li>
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
                Landsat time-series analysis for land-use change detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UrbanGrowthMap />
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Data Sources:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• NASA Landsat 8/9 Surface Reflectance (30m)</li>
                  <li>• ESA Sentinel-2 Multi-Spectral Imagery (10m)</li>
                  <li>• Copernicus Global Human Settlement Layer (GHSL)</li>
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
