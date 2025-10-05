import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Factory, Heart, Wind, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const EmissionsSimulator = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reductionPercent, setReductionPercent] = useState([30]);
  const [timeframe, setTimeframe] = useState([10]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke('eco-simulation', {
        body: {
          simulationType: 'emissions',
          parameters: {
            reductionPercent: reductionPercent[0],
            timeframe: timeframe[0]
          },
          location: {
            name: 'Industrial Zone',
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
              <Factory className="w-6 h-6" />
              {t('simulator.emissions.title')}
            </h3>
            <p className="text-sm text-muted-foreground">{t('simulator.emissions.description')}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('simulator.emissions.reductionPercent')}: {reductionPercent[0]}%
              </label>
              <Slider
                value={reductionPercent}
                onValueChange={setReductionPercent}
                min={10}
                max={100}
                step={5}
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
                max={30}
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
                <p className="font-medium">{t('simulator.emissions.aqiImprovement')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.aqiImprovement || results.analysis}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Heart className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.emissions.healthBenefits')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.healthBenefits || 'Reduced respiratory illnesses'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <TrendingDown className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.emissions.co2Reduction')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.co2Reduction || 'Significant CO2 reduction'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
              <Factory className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{t('simulator.emissions.pollutantReduction')}</p>
                <p className="text-sm text-muted-foreground">
                  {results.pollutantReduction || 'Lower NO2, SO2, and PM2.5 levels'}
                </p>
              </div>
            </div>
          </div>
          {results.longTermImpact && (
            <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="font-medium text-secondary mb-2">{t('simulator.longTermOutlook')}</p>
              <p className="text-sm text-muted-foreground">{results.longTermImpact}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default EmissionsSimulator;
