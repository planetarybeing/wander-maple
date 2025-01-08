import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import PlaceCard from './PlaceCard';
import { Place } from '../types/places';

const PLACES_OF_INTEREST: Place[] = [
  {
    id: 1,
    name: "Eiffel Tower",
    description: "Iconic iron lattice tower on the Champ de Mars in Paris",
    coordinates: [2.2945, 48.8584],
    category: "landmark",
  },
  {
    id: 2,
    name: "Machu Picchu",
    description: "15th-century Inca citadel located in southern Peru",
    coordinates: [-72.5450, -13.1631],
    category: "historical",
  },
  {
    id: 3,
    name: "Great Barrier Reef",
    description: "World's largest coral reef system located in Australia",
    coordinates: [146.8179, -16.2864],
    category: "natural",
  },
];

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Get token from environment or prompt user
    const token = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHJwOWhtYmkwMjF1MmpwZnlicnV0ZWF6In0.JgLwWB0lHrZ7OB8RFRsS_w';
    if (!token) {
      console.error('Mapbox token is required');
      return;
    }

    try {
      mapboxgl.accessToken = token;
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 2,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Store map instance
      mapInstance.current = map;

      // Add markers when map loads
      map.on('load', () => {
        console.log('Map loaded successfully');
        addMarkers();
      });

      return () => {
        // Cleanup markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Cleanup map
        map.remove();
        mapInstance.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  // Add markers function
  const addMarkers = () => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    PLACES_OF_INTEREST.forEach((place) => {
      const marker = new mapboxgl.Marker({
        color: "#A67F5D"
      })
        .setLngLat(place.coordinates)
        .addTo(mapInstance.current!);

      const element = marker.getElement();
      element.addEventListener('click', () => {
        handlePlaceSelect(place);
      });

      markersRef.current.push(marker);
    });
  };

  // Handle place selection
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    mapInstance.current?.flyTo({
      center: place.coordinates,
      zoom: 15,
      duration: 2000,
    });
  };

  // Filter places based on search
  const filteredPlaces = PLACES_OF_INTEREST.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 md:left-4 md:right-auto md:w-80 z-10">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-map-slate" />
          <Input
            type="text"
            placeholder="Search places..."
            className="pl-8 bg-white/90 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {searchQuery && (
          <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                className="w-full px-4 py-2 text-left hover:bg-map-cream transition-colors"
                onClick={() => handlePlaceSelect(place)}
              >
                {place.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Place Information Card */}
      {selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
};

export default Map;