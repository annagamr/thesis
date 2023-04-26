import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const MapComponent = ({ street, city, zipCode }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const customIcon = L.icon({
    iconUrl: icon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: iconShadow,
    shadowSize: [41, 41],
  });

  useEffect(() => {
    const fetchLocationAndRenderMap = async () => {
      const query = encodeURIComponent(`${street}, ${city}, ${zipCode}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];

        if (!mapInstance.current) {
          const initialMap = L.map(mapRef.current).setView([lat, lon], 16);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(initialMap);

          const initialMarker = L.marker([lat, lon], { icon: customIcon }).addTo(initialMap);

          mapInstance.current = initialMap;
          markerRef.current = initialMarker;
        } else {
          mapInstance.current.setView([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);
        }
      }
    };

    if (mapRef.current) {
      fetchLocationAndRenderMap();
    }
  }, [street, city, zipCode, customIcon]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

export default MapComponent;
