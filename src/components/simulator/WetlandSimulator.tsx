import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Waves, Droplets, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const WetlandSimulator = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [area, setArea] = useState([50]);
  const [action, setAction] = useState("preserve");
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke('eco-simulation', {
        body: {
          simulationType: 'wetland',
          parameters: {
            area: area[0],
            action: action
          },
          location: {
            name: 'Urban Wetland Area',
            lat: 28.6139,
            lon: 77.2090
          }
        }
      });

      if (error) throw error;
      setResults(data.data);
      toast({
        title: t('simulator.simulationComplete'),
        description: t('simulator.resultsGenerated'),
      });
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Error",
        description: "Failed to run simulation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
              <Waves className="w-6 h-6" />
              {t('simulator.wetland.title')}
            </h3>
            <p className="text-sm text-muted-foreground">{t('simulator.wetland.description')}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('simulator.wetland.action')}
              </label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preserve">{t('simulator.wetland.preserve')}</SelectItem>
                  <SelectItem value="restore">{t('simulator.wetland.restore')}</SelectItem>
                  <SelectItem value="build">{t('simulator.wetland.build')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('simulator.wetland.area')}: {area[0]} {t('simulator.hectares')}
              </label>
              <Slider
                value={area}
                onValueChange={setArea}
                min={10}
                max={500}
                step={10}
                className="w-full"
              />
            </div>

            <Button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('simulator.simulating')}
                </>
              ) : (
                t('simulator.runSimulation')
              )}
            </Button>
          </div>
        </div>
      </Card>

      {results && (
        <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
          <h4 className="text-lg font-semibold mb-4 text-primary">{t('simulator.results')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Droplets className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.wetland.floodMitigation')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.floodMitigation || results.analysis}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Leaf className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.wetland.carbonStorage')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.carbonStorage || 'Significant carbon sequestration capacity'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Waves className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.wetland.waterQuality')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.waterQuality || 'Natural filtration benefits'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Leaf className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.wetland.biodiversity')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.biodiversityImpact || 'Enhanced habitat value'}
                </p>
              </div>
            </div>
          </div>
          {results.recommendation && (
            <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="font-medium text-secondary mb-2">{t('simulator.recommendation')}</p>
              <p className="text-sm text-muted-foreground">{results.recommendation}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default WetlandSimulator;
