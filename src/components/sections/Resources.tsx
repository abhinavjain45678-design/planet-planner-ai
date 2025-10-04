import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, Users } from "lucide-react";

const Resources = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Learning Resources</h2>
        <p className="text-muted-foreground">
          Guides, tutorials, and community support for climate-resilient planning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Documentation
            </CardTitle>
            <CardDescription>Technical guides and best practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://appliedsciences.nasa.gov/what-we-do/capacity-building/arset" target="_blank" rel="noopener noreferrer">
                NASA ARSET Training Materials
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.earthdata.nasa.gov/learn" target="_blank" rel="noopener noreferrer">
                NASA Earthdata Learn
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.copernicus.eu/en/documentation-library" target="_blank" rel="noopener noreferrer">
                Copernicus Documentation
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Step-by-step visual guides</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.youtube.com/@NASAEarthData" target="_blank" rel="noopener noreferrer">
                NASA Earth Data YouTube
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.youtube.com/@eucosmoprogramme" target="_blank" rel="noopener noreferrer">
                Copernicus EU YouTube
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.youtube.com/playlist?list=PLO2yB4LGNlWoCMKVK4OFsZGqQmBT7uE4G" target="_blank" rel="noopener noreferrer">
                Urban Planning with GIS
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              Case Studies
            </CardTitle>
            <CardDescription>Real-world implementation examples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.c40.org/case-studies/" target="_blank" rel="noopener noreferrer">
                C40 Cities Climate Solutions
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.unep.org/explore-topics/climate-action/what-we-do/climate-adaptation/ecosystem-based-adaptation" target="_blank" rel="noopener noreferrer">
                UNEP Adaptation Case Studies
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.worldbank.org/en/topic/urbandevelopment/brief/resilient-cities-program" target="_blank" rel="noopener noreferrer">
                World Bank Resilient Cities
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Community
            </CardTitle>
            <CardDescription>Connect with other urban planners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://forum.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer">
                NASA Earthdata Forum
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://forum.sentinel-hub.com/" target="_blank" rel="noopener noreferrer">
                Sentinel Hub Community
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.reddit.com/r/UrbanPlanning/" target="_blank" rel="noopener noreferrer">
                Urban Planning Reddit
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
