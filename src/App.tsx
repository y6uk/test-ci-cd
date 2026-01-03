import { SnackbarProvider } from 'notistack';
import MyTestComponent from './MyTestComponent/MyTestComponent'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Property, RegisterInterface, SearchFilters } from './types';
import MapComponent from './MapComponent/MapComponent';

import 'leaflet/dist/leaflet.css';
import './App.css'
import { useEffect, useState } from 'react';
import BigMapComponent from './BigMapComponent/BigMapComponent';
import PropertyFilters from './BigMapComponent/PropertyFilters';
import { BearCounter } from './Components/BearCounter/BearCounter';
import PdfComponent from './Components/pdfComponent/PdfComponent';
import { SocketProvider } from './Components/SocketComponent/SocketComponent';

const schema = yup.object({
  firstName: yup
    .string()
    .required('Имя обязательно для заполнения')
    .min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: yup
    .string()
    .required('Фамилия обязательна для заполнения')
    .min(4,'Введите корректную фамилию'),
  age: yup
    .number()
    .required('Возраст обязателен')
    .positive('Возраст должен быть положительным числом')
    .integer('Возраст должен быть целым числом'),
});

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInterface>({
    resolver: yupResolver(schema),
  });

  //  const [properties, setProperties] = useState<Property[]>([]);
  // const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  // const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  // const [filters, setFilters] = useState<SearchFilters>({
  //   priceRange: [0, 50000000],
  //   propertyType: 'all',
  //   rooms: 'any',
  //   areaRange: [0, 200],
  //   completionDate: null,
  // });

  // Получение местоположения пользователя
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setUserLocation([
  //           position.coords.latitude,
  //           position.coords.longitude,
  //         ]);
  //       },
  //       () => {
  //         console.log('Не удалось получить местоположение');
  //       }
  //     );
  //   }
  // }, []);

  // // Загрузка объектов недвижимости (пример)
  // useEffect(() => {
  //   // Здесь будет запрос к API
  //   const mockProperties: Property[] = [
  //     {
  //       id: '1',
  //       title: 'ЖК "Современный"',
  //       description: 'Новый ЖК в центре города',
  //       price: 15000000,
  //       address: 'ул. Ленина, 15',
  //       coordinates: [55.7558, 37.6173],
  //       type: 'apartment',
  //       rooms: 3,
  //       area: 75,
  //       developer: 'Группа Компаний ПИК',
  //       completionDate: '2024-12-01',
  //       images: [],
  //       amenities: ['парковка', 'детская площадка', 'фитнес-центр'],
  //     },
  //     // ... больше объектов
  //   ];
    
  //   setProperties(mockProperties);
  // }, []);


  return (   
    <SnackbarProvider 
      maxSnack={3} // максимальное количество уведомлений
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <BearCounter />
      
     {/* <MyTestComponent /> */}
     {/* <MyTestComponent /> */}

     <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('firstName')} />
      <input {...register('lastName')} />
      {errors.lastName && <p>{errors.lastName.message}!</p>}
      <input {...register('age', { pattern: /\d+/ })} />
      {errors.age && <p>{errors.age.message}Age is required.</p>}
      <input type="submit" />
    </form>

      {/* <div className="app">
      <header className="app-header">
        <h1>Поиск новостроек</h1>
        <p>Найдите свою идеальную квартиру на интерактивной карте</p>
      </header> */}

      {/* <div className="app-content">
        <div className="filters-section">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="map-section">
          <BigMapComponent
            properties={properties}
            filters={filters}
            userLocation={userLocation}
            onPropertySelect={setSelectedProperty}
            selectedProperty={selectedProperty}
          />
        </div>

        <div className="results-section">
          <h3>Найдено объектов: {properties.length}</h3>
          {/* Список объектов можно добавить здесь */}
        {/* </div> */}
      {/* </div> */} 
    {/* <MapComponent /> */}
    {/* <PdfComponent /> */}
    <SocketProvider />
    </SnackbarProvider>
  )
}

export default App