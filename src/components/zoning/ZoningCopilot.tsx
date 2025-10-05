import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Sparkles, Trees, Building2, Droplets, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import GlobalLocationSelector from "../GlobalLocationSelector";

const ZoningCopilot = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [goals, setGoals] = useState("");
  const [budget, setBudget] = useState("medium");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [satelliteData, setSatelliteData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const handleLocationSelect = async (lat: number, lon: number, data: any) => {
    setSelectedLocation({ lat, lon, name: `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
    
    // Aggregate all satellite data types
    const aggregatedData = {
      heat: data,
      flood: data,
      airQuality: data,
      urbanGrowth: data
    };
    
    setSatelliteData(aggregatedData);
  };

  const generateRecommendations = async () => {
    if (!selectedLocation) {
      toast({
        title: t('zoning.selectLocationFirst'),
        variant: "destructive",
      });
      return;
    }

    if (!goals.trim()) {
      toast({
        title: t('zoning.enterGoals'),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('zoning-copilot', {
        body: {
          location: selectedLocation,
          goals: goals,
          budget: budget,
          satelliteData: satelliteData
        }
      });

      if (error) throw error;
      
      setRecommendations(data.data);
      toast({
        title: t('zoning.recommendationsGenerated'),
        description: t('zoning.reviewRecommendations'),
      });
    } catch (error) {
      console.error('Zoning copilot error:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          {t('zoning.title')}
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t('zoning.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <GlobalLocationSelector
            onLocationSelect={handleLocationSelect}
            dataType="heat"
          />

          <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
            <h3 className="text-lg font-semibold mb-4 text-primary">{t('zoning.planningParameters')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('zoning.planningGoals')}
                </label>
                <Textarea
                  placeholder={t('zoning.goalsPlaceholder')}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="min-h-[120px] border-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('zoning.budgetRange')}
                </label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('zoning.lowBudget')}</SelectItem>
                    <SelectItem value="medium">{t('zoning.mediumBudget')}</SelectItem>
                    <SelectItem value="high">{t('zoning.highBudget')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateRecommendations}
                disabled={isGenerating || !selectedLocation}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('zoning.generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('zoning.generatePlan')}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {recommendations && (
            <>
              {recommendations.primaryRecommendations && (
                <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
                  <h4 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {t('zoning.primaryRecommendations')}
                  </h4>
                  <ul className="space-y-3">
                    {(Array.isArray(recommendations.primaryRecommendations) 
                      ? recommendations.primaryRecommendations 
                      : [recommendations.primaryRecommendations]).map((rec: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-sm">
                          {typeof rec === 'string' ? rec : JSON.stringify(rec)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {recommendations.greenSpaceStrategy && (
                <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
                  <h4 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                    <Trees className="w-5 h-5" />
                    {t('zoning.greenSpaceStrategy')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {typeof recommendations.greenSpaceStrategy === 'string'
                      ? recommendations.greenSpaceStrategy
                      : JSON.stringify(recommendations.greenSpaceStrategy)}
                  </p>
                </Card>
              )}

              {recommendations.densityOptimization && (
                <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
                  <h4 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {t('zoning.densityOptimization')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {typeof recommendations.densityOptimization === 'string'
                      ? recommendations.densityOptimization
                      : JSON.stringify(recommendations.densityOptimization)}
                  </p>
                </Card>
              )}

              {recommendations.infrastructurePriorities && (
                <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
                  <h4 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    {t('zoning.infrastructurePriorities')}
                  </h4>
                  <ul className="space-y-2">
                    {(Array.isArray(recommendations.infrastructurePriorities)
                      ? recommendations.infrastructurePriorities
                      : [recommendations.infrastructurePriorities]).map((priority: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{typeof priority === 'string' ? priority : JSON.stringify(priority)}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {recommendations.scenarioComparison && (
                <Card className="p-6 backdrop-blur-sm bg-card/90 border-secondary/20">
                  <h4 className="text-lg font-semibold mb-4 text-secondary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t('zoning.scenarioComparison')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {typeof recommendations.scenarioComparison === 'string'
                      ? recommendations.scenarioComparison
                      : JSON.stringify(recommendations.scenarioComparison)}
                  </p>
                </Card>
              )}

              {recommendations.analysis && !recommendations.primaryRecommendations && (
                <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/20">
                  <h4 className="text-lg font-semibold mb-4 text-primary">{t('zoning.analysis')}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {recommendations.analysis}
                  </p>
                </Card>
              )}
            </>
          )}

          {!recommendations && (
            <Card className="p-12 backdrop-blur-sm bg-card/90 border-primary/20 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary/50" />
              <p className="text-muted-foreground">
                {t('zoning.noRecommendations')}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoningCopilot;
