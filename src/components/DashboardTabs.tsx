import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, AlertTriangle, Database, BookOpen, Sparkles } from "lucide-react";
import Overview from "./sections/Overview";
import UrbanChallenges from "./sections/UrbanChallenges";
import Datasets from "./sections/Datasets";
import Resources from "./sections/Resources";
import AIInsights from "./sections/AIInsights";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="challenges" className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">Challenges</span>
        </TabsTrigger>
        <TabsTrigger value="datasets" className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">Datasets</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Resources</span>
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Insights</span>
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
    </Tabs>
  );
};

export default DashboardTabs;
