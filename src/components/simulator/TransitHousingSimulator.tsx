import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Home, Bus, TrendingDown, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const TransitHousingSimulator = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [housingUnits, setHousingUnits] = useState([500]);
  const [transitDistance, setTransitDistance] = useState([500]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke('eco-simulation', {
        body: {
          simulationType: 'transit_housing',
          parameters: {
            housingUnits: housingUnits[0],
            transitDistance: transitDistance[0]
          },
          location: {
            name: 'Transit Hub Area',
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
              <Home className="w-6 h-6" />
              {t('simulator.transitHousing.title')}
            </h3>
            <p className="text-sm text-muted-foreground">{t('simulator.transitHousing.description')}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('simulator.transitHousing.housingUnits')}: {housingUnits[0].toLocaleString()}
              </label>
              <Slider
                value={housingUnits}
                onValueChange={setHousingUnits}
                min={100}
                max={5000}
                step={100}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('simulator.transitHousing.transitDistance')}: {transitDistance[0]}m
              </label>
              <Slider
                value={transitDistance}
                onValueChange={setTransitDistance}
                min={100}
                max={2000}
                step={100}
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
              <TrendingDown className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.transitHousing.emissionsReduction')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.emissionsReduction || results.analysis}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Bus className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.transitHousing.congestionImpact')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.congestionImpact || 'Reduced traffic congestion'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.transitHousing.landUseEfficiency')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.landUseEfficiency || 'Optimized urban density'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Home className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.transitHousing.qualityOfLife')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.qualityOfLife || 'Improved accessibility and livability'}
                </p>
              </div>
            </div>
          </div>
          {results.feasibility && (
            <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="font-medium text-secondary mb-2">{t('simulator.feasibility')}</p>
              <p className="text-sm text-muted-foreground">{results.feasibility}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default TransitHousingSimulator;
