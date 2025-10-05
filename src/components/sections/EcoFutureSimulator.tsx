import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trees, Waves, Factory, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import TreePlantingSimulator from "../simulator/TreePlantingSimulator";
import WetlandSimulator from "../simulator/WetlandSimulator";
import EmissionsSimulator from "../simulator/EmissionsSimulator";
import TransitHousingSimulator from "../simulator/TransitHousingSimulator";

const EcoFutureSimulator = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t('simulator.title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('simulator.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="trees" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
          <TabsTrigger value="trees" className="flex items-center gap-2">
            <Trees className="w-4 h-4" />
            <span className="hidden sm:inline">{t('simulator.treePlanting.tab')}</span>
          </TabsTrigger>
          <TabsTrigger value="wetland" className="flex items-center gap-2">
            <Waves className="w-4 h-4" />
            <span className="hidden sm:inline">{t('simulator.wetland.tab')}</span>
          </TabsTrigger>
          <TabsTrigger value="emissions" className="flex items-center gap-2">
            <Factory className="w-4 h-4" />
            <span className="hidden sm:inline">{t('simulator.emissions.tab')}</span>
          </TabsTrigger>
          <TabsTrigger value="housing" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t('simulator.transitHousing.tab')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trees">
          <TreePlantingSimulator />
        </TabsContent>

        <TabsContent value="wetland">
          <WetlandSimulator />
        </TabsContent>

        <TabsContent value="emissions">
          <EmissionsSimulator />
        </TabsContent>

        <TabsContent value="housing">
          <TransitHousingSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EcoFutureSimulator;
