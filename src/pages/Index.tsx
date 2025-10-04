import { Satellite } from "lucide-react";
import DashboardTabs from "@/components/DashboardTabs";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Satellite className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Climate-Resilient Urban Planning</h1>
                <p className="text-sm text-muted-foreground">NASA Earth Observation Dashboard</p>
              </div>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <DashboardTabs />
      </main>

      <footer className="border-t mt-12 bg-card/30">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by NASA Earthdata, Copernicus, and Global Space Agency Partners</p>
          <p className="mt-2">Helping cities build climate resilience through satellite Earth observation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
