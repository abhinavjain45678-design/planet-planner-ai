import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FloodRiskMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([29.7604, -95.3698], 11);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Simulated flood risk zones
    const floodZones = [
      { 
        coords: [[29.7804, -95.3898], [29.7804, -95.3498], [29.7404, -95.3498], [29.7404, -95.3898]],
        risk: "high",
        elevation: "< 5m"
      },
      { 
        coords: [[29.7604, -95.3698], [29.7604, -95.3298], [29.7204, -95.3298], [29.7204, -95.3698]],
        risk: "medium",
        elevation: "5-10m"
      },
    ];

    floodZones.forEach(zone => {
      const color = zone.risk === "high" ? "#4444FF" : "#4488FF";
      
      L.polygon(zone.coords as [number, number][], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
      }).addTo(map).bindPopup(`
        <strong>Flood Risk: ${zone.risk.toUpperCase()}</strong><br>
        Elevation: ${zone.elevation}<br>
        Annual Rainfall: 1200mm<br>
        Risk Level: ${zone.risk === "high" ? "8/10" : "5/10"}
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
        <strong>Flood Risk</strong><br>
        <span style="color: #4444FF;">●</span> High (< 5m elevation)<br>
        <span style="color: #4488FF;">●</span> Medium (5-10m)<br>
        <span style="color: #44AAFF;">●</span> Low (> 10m)
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

export default FloodRiskMap;
