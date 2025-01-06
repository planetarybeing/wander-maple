import React from 'react';
import { X } from 'lucide-react';
import { Place } from '../types/places';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PlaceCardProps {
  place: Place;
  onClose: () => void;
}

const PlaceCard = ({ place, onClose }: PlaceCardProps) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 animate-slide-up">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{place.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{place.description}</p>
          <div className="mt-4">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-map-sage/20 text-map-sage">
              {place.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceCard;