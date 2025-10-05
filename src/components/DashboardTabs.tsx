import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, AlertTriangle, Database, BookOpen, Sparkles, Sprout, Building } from "lucide-react";
import Overview from "./sections/Overview";
import UrbanChallenges from "./sections/UrbanChallenges";
import Datasets from "./sections/Datasets";
import Resources from "./sections/Resources";
import AIInsights from "./sections/AIInsights";
import EcoFutureSimulator from "./sections/EcoFutureSimulator";
import ZoningCopilot from "./zoning/ZoningCopilot";
import { useTranslation } from "react-i18next";

const DashboardTabs = () => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{t('tabs.overview')}</span>
        </TabsTrigger>
        <TabsTrigger value="challenges" className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">{t('tabs.urbanChallenges')}</span>
        </TabsTrigger>
        <TabsTrigger value="datasets" className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">{t('tabs.datasets')}</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">{t('tabs.resources')}</span>
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">{t('tabs.aiInsights')}</span>
        </TabsTrigger>
        <TabsTrigger value="simulator" className="flex items-center gap-2">
          <Sprout className="w-4 h-4" />
          <span className="hidden sm:inline">{t('tabs.ecoSimulator')}</span>
        </TabsTrigger>
        <TabsTrigger value="zoning" className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          <span className="hidden sm:inline">{t('tabs.zoningCopilot')}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Overview />
      </TabsContent>

      <TabsContent value="challenges">
        <UrbanChallenges />
      </TabsContent>

      <TabsContent value="datasets">
        <Datasets />
      </TabsContent>

      <TabsContent value="resources">
        <Resources />
      </TabsContent>

      <TabsContent value="ai">
        <AIInsights />
      </TabsContent>

      <TabsContent value="simulator">
        <EcoFutureSimulator />
      </TabsContent>

      <TabsContent value="zoning">
        <ZoningCopilot />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
