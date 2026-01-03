import React, { useEffect } from 'react';
import L from 'leaflet';
// import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
import { RouteInfo } from '../types';

declare global {
  namespace L {
    export function routing(): any;
  }
}

interface RouteCalculatorProps {
  startPoint: [number, number];
  endPoint: [number, number];
  onRouteCalculated: (routeInfo: { distance: number; duration: number }) => void;
  routeColor?: string;
}

const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  startPoint,
  endPoint,
  onRouteCalculated,
  routeColor = '#3b82f6',
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Создаем контроллер маршрутизации
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startPoint[0], startPoint[1]),
        L.latLng(endPoint[0], endPoint[1]),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: routeColor, opacity: 0.7, weight: 5 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
      createMarker: () => null, // Отключаем стандартные маркеры
      collapsible: false,
      show: false,
    }).addTo(map);

    // Обработка расчета маршрута
    routingControl.on('routesfound', function(e: any) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        
        // Извлекаем координаты полилинии
        const coordinates = route.coordinates.map((coord: any) => [
          coord.lat,
          coord.lng,
        ]);
        
        // Передаем информацию о маршруте
        onRouteCalculated({
          distance: route.summary.totalDistance,
          duration: route.summary.totalTime,
        });
      }
    });

    // Очистка при размонтировании
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, startPoint, endPoint, routeColor, onRouteCalculated]);

  return null;
};

export default RouteCalculator;