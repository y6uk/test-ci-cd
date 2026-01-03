import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import PropertyMarker from './PropertyMarker';
import RouteCalculator from './RouteCalculator';
import { Property, SearchFilters } from '../types';
import './style.css';

// Иконки для разных типов недвижимости
const propertyIcons = {
  apartment: L.icon({
    iconUrl: '/icons/apartment-marker.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  house: L.icon({
    iconUrl: '/icons/house-marker.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45],
  }),
  commercial: L.icon({
    iconUrl: '/icons/commercial-marker.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
};

interface PropertyMapProps {
  properties: Property[];
  filters: SearchFilters;
  userLocation: [number, number] | null;
  onPropertySelect: (property: Property) => void;
  selectedProperty: Property | null;
}

const BigMapComponent: React.FC<PropertyMapProps> = ({
  properties,
  filters,
  userLocation,
  onPropertySelect,
  selectedProperty,
}) => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([55.7558, 37.6173]); // Москва по умолчанию
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [showRoutes, setShowRoutes] = useState<boolean>(false);

  // Фильтрация объектов
  useEffect(() => {
    const filtered = properties.filter(property => {
      // Фильтр по цене
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }
      
      // Фильтр по типу
      if (filters.propertyType !== 'all' && property.type !== filters.propertyType) {
        return false;
      }
      
      // Фильтр по количеству комнат
      if (filters.rooms !== 'any' && property.rooms !== filters.rooms) {
        return false;
      }
      
      // Фильтр по площади
      if (property.area < filters.areaRange[0] || property.area > filters.areaRange[1]) {
        return false;
      }
      
      // Фильтр по дате сдачи
      if (filters.completionDate && property.completionDate > filters.completionDate) {
        return false;
      }
      
      return true;
    });
    
    setFilteredProperties(filtered);
    
    // Центрировать карту на первом объекте или на пользователе
    if (filtered.length > 0) {
      setMapCenter(filtered[0].coordinates);
    } else if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [properties, filters, userLocation]);

  // Функция для расчета примерного времени
  const calculateTravelTime = useCallback((property: Property) => {
    if (!userLocation || !routeInfo) return null;
    
    // Здесь можно добавить более сложную логику расчета
    // на основе типа транспорта (авто/общественный)
    const hours = Math.floor(routeInfo.duration / 3600);
    const minutes = Math.floor((routeInfo.duration % 3600) / 60);
    
    return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
  }, [userLocation, routeInfo]);

  // Компонент для обработки событий карты
  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => {
        console.log('Уровень зума:', e.target.getZoom());
      },
      moveend: (e) => {
        console.log('Центр карты:', e.target.getCenter());
      },
    });
    return null;
  };

  return (
    <div className="property-map-container">
      <div className="map-controls">
        <button 
          className={`route-toggle ${showRoutes ? 'active' : ''}`}
          onClick={() => setShowRoutes(!showRoutes)}
        >
          {showRoutes ? 'Скрыть маршруты' : 'Показать маршруты'}
        </button>
        
        {userLocation && (
          <button 
            className="center-on-user"
            onClick={() => userLocation && setMapCenter(userLocation)}
          >
            Центрировать на мне
          </button>
        )}
        
        <div className="stats">
          Найдено объектов: {filteredProperties.length}
          {routeInfo && (
            <div className="route-info">
              <span>Расстояние: {(routeInfo.distance / 1000).toFixed(1)} км</span>
              <span>Время: {Math.floor(routeInfo.duration / 60)} мин</span>
            </div>
          )}
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        zoomControl={false}
        className="property-map"
        minZoom={10}
        maxZoom={18}
      >
        <MapEvents />
        <ZoomControl position="topright" />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Альтернативные тайлы (можно переключать) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        {/* Маркер пользователя */}
        {userLocation && (
          <PropertyMarker
            position={userLocation}
            icon={L.divIcon({
              html: `<div class="user-marker"><i class="fas fa-user"></i></div>`,
              className: 'user-marker-container',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            })}
            property={{
              id: 'user',
              title: 'Ваше местоположение',
              coordinates: userLocation,
            } as Property}
            onSelect={() => {}}
          />
        )}

        {/* Маркеры объектов недвижимости */}
        {filteredProperties.map(property => (
          <PropertyMarker
            key={property.id}
            position={property.coordinates}
            icon={propertyIcons[property.type]}
            property={property}
            onSelect={onPropertySelect}
            isSelected={selectedProperty?.id === property.id}
            travelTime={calculateTravelTime(property)}
          />
        ))}

        {/* Расчет маршрутов */}
        {showRoutes && userLocation && selectedProperty && (
          <RouteCalculator
            startPoint={userLocation}
            endPoint={selectedProperty.coordinates}
            onRouteCalculated={setRouteInfo}
            routeColor="#3b82f6"
          />
        )}
      </MapContainer>

      {/* Панель информации об объекте */}
      {selectedProperty && (
        <div className="property-sidebar">
          <div className="property-header">
            <h3>{selectedProperty.title}</h3>
            <button className="close-btn" onClick={() => onPropertySelect(null)}>
              ×
            </button>
          </div>
          
          <div className="property-details">
            <div className="price">{selectedProperty.price.toLocaleString()} ₽</div>
            <div className="address">
              <i className="fas fa-map-marker-alt"></i>
              {selectedProperty.address}
            </div>
            
            <div className="specs">
              <span><i className="fas fa-bed"></i> {selectedProperty.rooms} кв.</span>
              <span><i className="fas fa-ruler-combined"></i> {selectedProperty.area} м²</span>
              <span><i className="fas fa-building"></i> {selectedProperty.developer}</span>
            </div>
            
            {userLocation && routeInfo && (
              <div className="travel-info">
                <h4>Время доезда:</h4>
                <div className="transport-options">
                  <div className="transport-option active">
                    <i className="fas fa-car"></i>
                    <span>{Math.floor(routeInfo.duration / 60)} мин</span>
                    <small>{(routeInfo.distance / 1000).toFixed(1)} км</small>
                  </div>
                  <div className="transport-option">
                    <i className="fas fa-subway"></i>
                    <span>~45 мин</span>
                    <small>общественный транспорт</small>
                  </div>
                </div>
              </div>
            )}
            
            <button className="action-btn">
              <i className="fas fa-phone"></i> Записаться на просмотр
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BigMapComponent;