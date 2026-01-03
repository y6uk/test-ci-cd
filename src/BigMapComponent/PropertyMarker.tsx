import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Property } from '../types';

interface PropertyMarkerProps {
  position: [number, number];
  icon: L.Icon | L.DivIcon;
  property: Property;
  onSelect: (property: Property) => void;
  isSelected?: boolean;
  travelTime?: string | null;
}

const PropertyMarker: React.FC<PropertyMarkerProps> = ({
  position,
  icon,
  property,
  onSelect,
  isSelected,
  travelTime,
}) => {
  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(property),
      }}
    >
      <Popup>
        <div className="property-popup">
          <h4>{property.title}</h4>
          <p className="price">{property.price} ₽</p>
          <p className="specs">
            {property.rooms} кв. • {property.area} м²
          </p>
          {travelTime && (
            <div className="travel-time">
              <i className="fas fa-car"></i> ~{travelTime}
            </div>
          )}
          <button 
            className="details-btn"
            onClick={() => onSelect(property)}
          >
            Подробнее
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default PropertyMarker;