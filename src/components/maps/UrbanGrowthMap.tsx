import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UrbanGrowthMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([19.4326, -99.1332], 11);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Simulated urban growth areas
    const growthAreas = [
      { 
        coords: [[19.4526, -99.1532], [19.4526, -99.1132], [19.4126, -99.1132], [19.4126, -99.1532]],
        year: "2000-2010",
        type: "residential",
        change: "+35%"
      },
      { 
        coords: [[19.4326, -99.1732], [19.4326, -99.1332], [19.3926, -99.1332], [19.3926, -99.1732]],
        year: "2010-2020",
        type: "commercial",
        change: "+58%"
      },
      { 
        coords: [[19.4726, -99.1332], [19.4726, -99.0932], [19.4326, -99.0932], [19.4326, -99.1332]],
        year: "2020-2025",
        type: "industrial",
        change: "+22%"
      },
    ];

    growthAreas.forEach(area => {
      const color = area.type === "residential" ? "#44AA44" : 
                    area.type === "commercial" ? "#AA8844" : "#AA4444";
      
      L.polygon(area.coords as [number, number][], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
      }).addTo(map).bindPopup(`
        <strong>Urban Expansion ${area.year}</strong><br>
        Type: ${area.type}<br>
        Built-up Change: ${area.change}<br>
        Data: Landsat 8/9 + Sentinel-2
      `);
    });

    // Add legend
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.background = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.innerHTML = `
        <strong>Urban Growth Type</strong><br>
        <span style="color: #44AA44;">●</span> Residential<br>
        <span style="color: #AA8844;">●</span> Commercial<br>
        <span style="color: #AA4444;">●</span> Industrial
      `;
      return div;
    };
    legend.addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-[500px] rounded-lg" />;
};

export default UrbanGrowthMap;
