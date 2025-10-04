import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, TreePine } from "lucide-react";

const Overview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Climate-Resilient Urban Planning</h2>
        <p className="text-muted-foreground">
          Leverage NASA Earth observation data and partner space agency datasets to design sustainable, 
          climate-adaptive cities that protect communities and the environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-accent" />
              Heat Islands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor urban heat distribution and identify vulnerable areas using thermal satellite data.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Flood Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze elevation and rainfall patterns to predict and mitigate flooding.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wind className="w-5 h-5 text-secondary" />
              Air Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track pollution hotspots and trends with satellite-based air quality monitoring.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TreePine className="w-5 h-5 text-secondary" />
              Urban Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Detect land-use changes and plan sustainable expansion with time-series analysis.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why Space Data Matters for Cities</CardTitle>
          <CardDescription>The power of Earth observation for urban resilience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">🛰️ Global Coverage</h4>
            <p className="text-sm text-muted-foreground">
              NASA and partner satellites provide continuous monitoring of every city on Earth, 
              offering insights impossible to gather from ground-level sensors alone.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📊 Historical Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Decades of archived satellite data reveal long-term climate trends and urban development 
              patterns, enabling evidence-based planning decisions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🌍 Multi-Scale Insights</h4>
            <p className="text-sm text-muted-foreground">
              From neighborhood-level heat mapping to regional watershed analysis, space data provides 
              the complete picture needed for comprehensive climate adaptation strategies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
