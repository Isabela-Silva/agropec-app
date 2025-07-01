import React, { useEffect, useState } from 'react';
import { MapContainer, Polygon, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import mapData from '../data/mapData.json';
import { MapFeature, MapViewProps, FilterType } from '../types';

// Configuração do sistema de coordenadas simples
const CRS_SIMPLE = L.CRS.Simple;

// Componente para ajustar a visualização do mapa
const MapController: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Calcular bounds baseado nas coordenadas reais do JSON
    const allCoords: number[][] = [];
    mapData.features.forEach((feature: any) => {
      feature.geometry.coordinates[0].forEach((coord: number[]) => {
        allCoords.push(coord);
      });
    });

    const minX = Math.min(...allCoords.map(c => c[0]));
    const maxX = Math.max(...allCoords.map(c => c[0]));
    const minY = Math.min(...allCoords.map(c => c[1]));
    const maxY = Math.max(...allCoords.map(c => c[1]));

    // Calcular margem proporcional (10% do tamanho total)
    const width = maxX - minX;
    const height = maxY - minY;
    const marginX = width * 0.1;
    const marginY = height * 0.1;

    // Converter para coordenadas do Leaflet
    const bounds: L.LatLngBoundsExpression = [
      [minY, minX],
      [maxY, maxX]
    ];

    console.log('Calculated bounds:', bounds);
    console.log('Data dimensions:', { width, height });
    
    // Ajustar visualização inicial
    map.fitBounds(bounds, { padding: [20, 20] });
    
    // Definir limites máximos com margem proporcional
    const maxBounds: L.LatLngBoundsExpression = [
      [minY - marginY, minX - marginX],
      [maxY + marginY, maxX + marginX]
    ];
    
    map.setMaxBounds(maxBounds);
    console.log('Max bounds set:', maxBounds);
    console.log('Margins applied:', { marginX, marginY });
  }, [map]);

  return null;
};

// Função para converter coordenadas do sistema original para o Leaflet
const convertCoordinates = (coordinates: number[][][]): L.LatLngExpression[][] => {
  return coordinates.map(ring => 
    ring.map(([x, y]) => [y, x] as L.LatLngExpression)
  );
};

// Função para filtrar features baseada no tipo
const getFilteredFeatures = (features: MapFeature[], filter?: FilterType): MapFeature[] => {
  if (!filter) return features;
  
  const filterMap: { [key in FilterType]: string[] } = {
    'Stands': ['Stands'],
    'Comida': ['Comida'],
    'Shows': ['Shows'],
    'WC': ['Banheiros'],
    '': []
  };

  const allowedTypes = filterMap[filter];
  if (!allowedTypes || allowedTypes.length === 0) return features;

  return features.filter(feature => allowedTypes.includes(feature.properties.tipo));
};

// Função para filtrar features baseada no termo de busca
const getSearchFilteredFeatures = (features: MapFeature[], searchTerm?: string): MapFeature[] => {
  if (!searchTerm || searchTerm.trim() === '') return features;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return features.filter(feature => 
    feature.properties.nome.toLowerCase().includes(lowerSearchTerm) ||
    feature.properties.tipo.toLowerCase().includes(lowerSearchTerm) ||
    (feature.properties.localização && feature.properties.localização.toLowerCase().includes(lowerSearchTerm))
  );
};

const MapView: React.FC<MapViewProps> = ({ activeFilter, searchTerm }) => {
  const [features, setFeatures] = useState<MapFeature[]>([]);

  useEffect(() => {
    console.log('Carregando dados do mapa...', mapData.features.length, 'features');
    setFeatures(mapData.features as MapFeature[]);
  }, []);

  // Aplica filtros de tipo e busca
  let filteredFeatures = getFilteredFeatures(features, activeFilter);
  filteredFeatures = getSearchFilteredFeatures(filteredFeatures, searchTerm);

  console.log(`Mostrando ${filteredFeatures.length} de ${features.length} features`);

  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100%', 
        position: 'relative'
      }}
    >
      <MapContainer
        crs={CRS_SIMPLE}
        center={[1000, 1000]}
        zoom={-1}
        minZoom={-3}
        maxZoom={1}
        style={{ 
          height: '100vh', 
          width: '100%',
          backgroundColor: '#f8f9fa'
        }}
        zoomControl={false}
        attributionControl={false}
        className="leaflet-container"
        maxBoundsViscosity={1.0}
        bounceAtZoomLimits={true}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        <MapController />
        <ZoomControl position="bottomright" />
        
        {filteredFeatures.map((feature, index) => {
          try {
            const coordinates = convertCoordinates(feature.geometry.coordinates);
            
            return (
              <Polygon
                key={`feature-${index}`}
                positions={coordinates}
                pathOptions={{
                  color: feature.properties.color || '#2196f3',
                  weight: 2,
                  fillColor: feature.properties.color || '#2196f3',
                  fillOpacity: feature.properties.opacity || 0.3,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold text-base mb-1">
                      {feature.properties.nome}
                    </h3>
                    <p className="text-gray-600 italic">
                      {feature.properties.tipo}
                    </p>
                    {feature.properties.localização && (
                      <p className="text-gray-500 mt-1">
                        Local: {feature.properties.localização}
                      </p>
                    )}
                  </div>
                </Popup>
              </Polygon>
            );
          } catch (error) {
            console.error(`Erro ao renderizar feature ${index}:`, error);
            return null;
          }
        })}
      </MapContainer>
      
      {/* Contador de resultados - redesenhado */}
      {(activeFilter || searchTerm) && (
        <div className="absolute top-32 right-4 z-[1000]">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 floating-element">
            <span className="text-xs text-gray-600 font-medium">
              {filteredFeatures.length} local(ais)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
