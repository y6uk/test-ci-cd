export interface RegisterInterface {
  firstName: string;
  lastName: string;
  age: number;
  // confirmPassword: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  type: 'apartment' | 'house' | 'commercial';
  rooms: number;
  area: number;
  developer: string;
  completionDate: string;
  images: string[];
  amenities: string[];
}

export interface RouteInfo {
  distance: number; // в метрах
  duration: number; // в секундах
  polyline: [number, number][]; // координаты маршрута
}

export interface SearchFilters {
  priceRange: [number, number];
  propertyType: Property['type'] | 'all';
  rooms: number | string;
  areaRange: [number, number];
  completionDate: string | null;
}