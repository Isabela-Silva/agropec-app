import { MapData } from '../types/map';

export const testMapData: MapData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "nome": "Teste Simples",
        "tipo": "Área Comum",
        "color": "#ff0000",
        "opacity": 0.5,
        "borderWidth": 3,
        "borderStyle": "solid"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [500, 500],
            [500, 700],
            [700, 700],
            [700, 500]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "nome": "Teste Azul",
        "tipo": "Banheiros",
        "color": "#0000ff",
        "opacity": 0.5,
        "borderWidth": 3,
        "borderStyle": "solid"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [800, 800],
            [800, 1000],
            [1000, 1000],
            [1000, 800]
          ]
        ]
      }
    }
  ]
}; 