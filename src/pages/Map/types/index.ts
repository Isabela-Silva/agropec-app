export interface MapFeature {
  type: string;
  properties: {
    nome: string;
    tipo: string;
    color: string;
    opacity: number;
    localização?: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: MapFeature[];
}

export type FilterType = 'Stands' | 'Comida' | 'Shows' | 'WC' | '';

export interface MapViewProps {
  activeFilter?: FilterType;
  searchTerm?: string;
} 