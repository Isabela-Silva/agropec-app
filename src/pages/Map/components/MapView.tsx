import React, { useEffect, useRef } from 'react';

declare global {
    interface Window { L: any; }
}

const MapView: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInitializedRef = useRef(false);

    useEffect(() => {
        if (mapInitializedRef.current) return;

        const loadMap = () => {
            if (!window.L || !mapContainerRef.current) return;
            
            const customMarkerIcon = new window.L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const map = window.L.map(mapContainerRef.current).setView([-2.8616, -47.3516], 15);
      
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
      
            window.L.marker([-2.8616, -47.3516], { icon: customMarkerIcon }).addTo(map)
              .bindPopup('Parque de Exposição de Paragominas<br>Local do evento AgroPec 2025');
      
            mapInitializedRef.current = true;
        };
      
        if (window.L) {
            loadMap();
        } else {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
            script.onload = () => {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
              document.head.appendChild(link);
              loadMap();
            };
            document.head.appendChild(script);
        }
    }, []);

    return (
        <div ref={mapContainerRef} className="h-full w-full" />
    );
};

export default MapView;