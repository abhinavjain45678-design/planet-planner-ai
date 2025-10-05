import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Trees, Leaf, Droplets, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const TreePlantingSimulator = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [treeCount, setTreeCount] = useState([1000]);
  const [timeframe, setTimeframe] = useState([10]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke('eco-simulation', {
        body: {
          simulationType: 'tree_planting',
          parameters: {
            treeCount: treeCount[0],
            timeframe: timeframe[0]
          },
          location: {
            name: 'Selected Urban Area',
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
              <Trees className="w-6 h-6" />
              {t('simulator.treePlanting.title')}
            </h3>
            <p className="text-sm text-muted-foreground">{t('simulator.treePlanting.description')}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('simulator.treePlanting.numberOfTrees')}: {treeCount[0].toLocaleString()}
              </label>
              <Slider
                value={treeCount}
                onValueChange={setTreeCount}
                min={100}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('simulator.treePlanting.timeframe')}: {timeframe[0]} {t('simulator.years')}
              </label>
              <Slider
                value={timeframe}
                onValueChange={setTimeframe}
                min={5}
                max={50}
                step={5}
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
              <Wind className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.treePlanting.co2Sequestration')}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof results.co2Sequestration === 'string' 
                    ? results.co2Sequestration 
                    : typeof results.co2Sequestration === 'object'
                    ? JSON.stringify(results.co2Sequestration)
                    : results.analysis || 'Analysis in progress'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Leaf className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.treePlanting.temperatureReduction')}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof results.temperatureReduction === 'string'
                    ? results.temperatureReduction
                    : typeof results.temperatureReduction === 'object'
                    ? JSON.stringify(results.temperatureReduction)
                    : 'Calculated based on tree coverage'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Wind className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.treePlanting.airQuality')}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof results.airQualityImprovement === 'string'
                    ? results.airQualityImprovement
                    : typeof results.airQualityImprovement === 'object'
                    ? JSON.stringify(results.airQualityImprovement)
                    : 'Significant improvement in PM2.5 levels'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Droplets className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.treePlanting.stormwater')}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof results.stormwaterBenefit === 'string'
                    ? results.stormwaterBenefit
                    : typeof results.stormwaterBenefit === 'object'
                    ? JSON.stringify(results.stormwaterBenefit)
                    : 'Enhanced water absorption capacity'}
                </p>
              </div>
            </div>
          </div>
          {results.longTermOutlook && (
            <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="font-medium text-secondary mb-2">{t('simulator.longTermOutlook')}</p>
              <p className="text-sm text-muted-foreground">
                {typeof results.longTermOutlook === 'string'
                  ? results.longTermOutlook
                  : JSON.stringify(results.longTermOutlook)}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default TreePlantingSimulator;
