import React from 'react';
import { SearchFilters } from '../types';
// import './PropertyFilters.css';

interface PropertyFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, onFiltersChange }) => {
  const propertyTypes = [
    { value: 'all', label: 'Всех типы' },
    { value: 'apartment', label: 'Квартиры' },
    { value: 'house', label: 'Дома' },
    { value: 'commercial', label: 'Коммерческая' },
  ];

  const roomOptions = [
    { value: 'any', label: 'Любое' },
    { value: 1, label: '1-комнатная' },
    { value: 2, label: '2-комнатная' },
    { value: 3, label: '3-комнатная' },
    { value: 4, label: '4-комнатная' },
  ];

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max],
    });
  };

  const handlePropertyTypeChange = (type: SearchFilters['propertyType']) => {
    onFiltersChange({
      ...filters,
      propertyType: type,
    });
  };

  const handleRoomsChange = (rooms: number | string) => {
    onFiltersChange({
      ...filters,
      rooms,
    });
  };

  const handleAreaChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      areaRange: [min, max],
    });
  };

  const handleCompletionDateChange = (date: string) => {
    onFiltersChange({
      ...filters,
      completionDate: date || null,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      priceRange: [0, 50000000],
      propertyType: 'all',
      rooms: 'any',
      areaRange: [0, 200],
      completionDate: null,
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} млн`;
    }
    return `${(price / 1000).toFixed(0)} тыс`;
  };

  return (
    <div className="property-filters">
      <div className="filters-header">
        <h3>Фильтры поиска</h3>
        <button className="reset-btn" onClick={resetFilters}>
          Сбросить
        </button>
      </div>

      <div className="filters-grid">
        {/* Цена */}
        <div className="filter-group">
          <label className="filter-label">Цена, ₽</label>
          <div className="price-slider-values">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>—</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
          <div className="price-slider">
            <input
              type="range"
              min="0"
              max="100000000"
              step="1000000"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
              className="price-slider-min"
            />
            <input
              type="range"
              min="0"
              max="100000000"
              step="1000000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
              className="price-slider-max"
            />
          </div>
          <div className="price-presets">
            <button 
              className={`price-preset ${filters.priceRange[1] <= 5000000 ? 'active' : ''}`}
              onClick={() => handlePriceChange(0, 5000000)}
            >
              до 5 млн
            </button>
            <button 
              className={`price-preset ${filters.priceRange[0] >= 5000000 && filters.priceRange[1] <= 10000000 ? 'active' : ''}`}
              onClick={() => handlePriceChange(5000000, 10000000)}
            >
              5-10 млн
            </button>
            <button 
              className={`price-preset ${filters.priceRange[0] >= 10000000 && filters.priceRange[1] <= 20000000 ? 'active' : ''}`}
              onClick={() => handlePriceChange(10000000, 20000000)}
            >
              10-20 млн
            </button>
            <button 
              className={`price-preset ${filters.priceRange[0] >= 20000000 ? 'active' : ''}`}
              onClick={() => handlePriceChange(20000000, 50000000)}
            >
              от 20 млн
            </button>
          </div>
        </div>

        {/* Тип недвижимости */}
        <div className="filter-group">
          <label className="filter-label">Тип недвижимости</label>
          <div className="type-buttons">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                className={`type-btn ${filters.propertyType === type.value ? 'active' : ''}`}
                onClick={() => handlePropertyTypeChange(type.value as SearchFilters['propertyType'])}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Количество комнат */}
        <div className="filter-group">
          <label className="filter-label">Количество комнат</label>
          <div className="room-buttons">
            {roomOptions.map((room) => (
              <button
                key={room.value}
                className={`room-btn ${filters.rooms === room.value ? 'active' : ''}`}
                onClick={() => handleRoomsChange(room.value)}
              >
                {room.label}
              </button>
            ))}
          </div>
        </div>

        {/* Площадь */}
        <div className="filter-group">
          <label className="filter-label">Площадь, м²</label>
          <div className="area-inputs">
            <div className="area-input-group">
              <span>от</span>
              <input
                type="number"
                min="0"
                max="500"
                value={filters.areaRange[0]}
                onChange={(e) => handleAreaChange(Number(e.target.value), filters.areaRange[1])}
                className="area-input"
              />
            </div>
            <div className="area-input-group">
              <span>до</span>
              <input
                type="number"
                min="0"
                max="500"
                value={filters.areaRange[1]}
                onChange={(e) => handleAreaChange(filters.areaRange[0], Number(e.target.value))}
                className="area-input"
              />
            </div>
          </div>
          <div className="area-presets">
            <button 
              className={`area-preset ${filters.areaRange[1] <= 50 ? 'active' : ''}`}
              onClick={() => handleAreaChange(0, 50)}
            >
              до 50 м²
            </button>
            <button 
              className={`area-preset ${filters.areaRange[0] >= 50 && filters.areaRange[1] <= 100 ? 'active' : ''}`}
              onClick={() => handleAreaChange(50, 100)}
            >
              50-100 м²
            </button>
            <button 
              className={`area-preset ${filters.areaRange[0] >= 100 ? 'active' : ''}`}
              onClick={() => handleAreaChange(100, 200)}
            >
              от 100 м²
            </button>
          </div>
        </div>

        {/* Дата сдачи */}
        <div className="filter-group">
          <label className="filter-label">Срок сдачи</label>
          <div className="completion-buttons">
            <button 
              className={`completion-btn ${!filters.completionDate ? 'active' : ''}`}
              onClick={() => handleCompletionDateChange('')}
            >
              Любой
            </button>
            <button 
              className={`completion-btn ${filters.completionDate === '2024-12-31' ? 'active' : ''}`}
              onClick={() => handleCompletionDateChange('2024-12-31')}
            >
              В 2024
            </button>
            <button 
              className={`completion-btn ${filters.completionDate === '2025-12-31' ? 'active' : ''}`}
              onClick={() => handleCompletionDateChange('2025-12-31')}
            >
              В 2025
            </button>
            <button 
              className={`completion-btn ${filters.completionDate === '2026-12-31' ? 'active' : ''}`}
              onClick={() => handleCompletionDateChange('2026-12-31')}
            >
              В 2026
            </button>
          </div>
        </div>

        {/* Дополнительные фильтры */}
        <div className="filter-group">
          <label className="filter-label">Дополнительно</label>
          <div className="checkbox-filters">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>С парковкой</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>С отделкой</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Ипотека доступна</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Рассрочка</span>
            </label>
          </div>
        </div>
      </div>

      <div className="filters-footer">
        <button className="apply-filters-btn">
          <i className="fas fa-search"></i>
          Показать {Math.floor(Math.random() * 100) + 50} объектов
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;