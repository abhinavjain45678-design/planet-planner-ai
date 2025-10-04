import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AirQualityMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 11);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Simulated air quality monitoring stations
    const aqStations = [
      { coords: [40.7128, -74.0060], aqi: 85, pollutant: "PM2.5", level: "moderate" },
      { coords: [40.7328, -74.0260], aqi: 145, pollutant: "NO₂", level: "unhealthy" },
      { coords: [40.6928, -73.9860], aqi: 55, pollutant: "O₃", level: "good" },
      { coords: [40.7528, -74.0460], aqi: 120, pollutant: "PM2.5", level: "unhealthy_sensitive" },
    ];

    aqStations.forEach(station => {
      const color = station.level === "unhealthy" ? "#AA44AA" : 
                    station.level === "unhealthy_sensitive" ? "#FF8844" :
                    station.level === "moderate" ? "#FFDD44" : "#44AA44";
      
      L.circleMarker([station.coords[0], station.coords[1]], {
        radius: 12,
        color: color,
        fillColor: color,
        fillOpacity: 0.6,
      }).addTo(map).bindPopup(`
        <strong>Air Quality Index: ${station.aqi}</strong><br>
        Primary Pollutant: ${station.pollutant}<br>
        Status: ${station.level.replace('_', ' for sensitive groups')}<br>
        Data Source: Sentinel-5P TROPOMI
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
        <strong>Air Quality (AQI)</strong><br>
        <span style="color: #44AA44;">●</span> Good (0-50)<br>
        <span style="color: #FFDD44;">●</span> Moderate (51-100)<br>
        <span style="color: #FF8844;">●</span> Unhealthy for Sensitive (101-150)<br>
        <span style="color: #AA44AA;">●</span> Unhealthy (151-200)
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

export default AirQualityMap;
