import { Satellite } from "lucide-react";
import DashboardTabs from "@/components/DashboardTabs";
import Navigation from "@/components/Navigation";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Space background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-primary/5 pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--primary-glow) / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)',
      }} />

      <header className="relative border-b bg-card/50 backdrop-blur-xl supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg backdrop-blur-sm border border-primary/20">
                <Satellite className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-sm text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        <DashboardTabs />
      </main>

      <footer className="relative border-t mt-12 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>{t('app.footer')}</p>
          <p className="mt-2">{t('app.footerSubtitle')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
