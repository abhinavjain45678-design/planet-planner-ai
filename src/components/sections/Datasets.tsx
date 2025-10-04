import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Satellite, Database } from "lucide-react";

const Datasets = () => {
  const datasets = [
    {
      category: "NASA Earth Observation",
      sources: [
        {
          name: "NASA Earthdata Worldview",
          description: "Interactive visualization of near real-time satellite data",
          url: "https://worldview.earthdata.nasa.gov/"
        },
        {
          name: "NASA Earth Observatory",
          description: "Images, stories, and data about climate and environment",
          url: "https://earthobservatory.nasa.gov/"
        },
        {
          name: "SEDAC Socioeconomic Data",
          description: "Population, poverty, and vulnerability datasets",
          url: "https://sedac.ciesin.columbia.edu/"
        },
        {
          name: "NASA IMPACT Toolkit",
          description: "Cloud-based geospatial data processing and analysis",
          url: "https://www.earthdata.nasa.gov/esds/impact"
        }
      ]
    },
    {
      category: "European Space Agency",
      sources: [
        {
          name: "Copernicus Open Access Hub",
          description: "Sentinel satellite data for climate and land monitoring",
          url: "https://scihub.copernicus.eu/"
        },
        {
          name: "Copernicus Services Catalogue",
          description: "Atmosphere, climate change, and emergency management data",
          url: "https://www.copernicus.eu/en/accessing-data-where-and-how/conventional-data-access-hubs"
        },
        {
          name: "Global Human Settlement Layer",
          description: "Urban extent, population density, and built-up areas",
          url: "https://ghsl.jrc.ec.europa.eu/"
        }
      ]
    },
    {
      category: "International Partners",
      sources: [
        {
          name: "WorldPop Population Data",
          description: "High-resolution population distribution maps",
          url: "https://www.worldpop.org/"
        },
        {
          name: "WRI Data Explorer",
          description: "Climate, water, and urban development indicators",
          url: "https://www.wri.org/data"
        },
        {
          name: "CSA RADARSAT (Canada)",
          description: "Synthetic aperture radar for all-weather monitoring",
          url: "https://www.asc-csa.gc.ca/eng/satellites/radarsat/"
        },
        {
          name: "INDE Brazil Spatial Data",
          description: "Brazilian National Spatial Data Infrastructure",
          url: "https://www.inde.gov.br/"
        },
        {
          name: "INPE Amazon Monitoring",
          description: "Brazil's space agency deforestation and climate data",
          url: "http://www.inpe.br/"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Data Sources</h2>
        <p className="text-muted-foreground">
          Access authoritative Earth observation data from NASA and global space agencies
        </p>
      </div>

      {datasets.map((category, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {idx === 0 ? <Satellite className="w-5 h-5" /> : <Database className="w-5 h-5" />}
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.sources.map((source, sourceIdx) => (
              <div key={sourceIdx} className="flex items-start justify-between gap-4 p-4 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{source.name}</h4>
                  <p className="text-sm text-muted-foreground">{source.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(source.url, '_blank')}
                  className="shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Datasets;
