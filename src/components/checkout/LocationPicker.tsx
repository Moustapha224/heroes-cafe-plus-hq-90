import { useEffect, useRef, useState } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  value: string;
  onChange: (address: string, coords?: { lat: number; lng: number }) => void;
}

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to recenter map
const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
  // Default location: Conakry, Guinea
  const defaultCenter: [number, number] = [9.6412, -13.5784];
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  const handleLocationSelect = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setMapCenter([lat, lng]);
    
    // Reverse geocoding with Nominatim
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
      );
      const data = await response.json();
      if (data.display_name) {
        onChange(data.display_name, { lat, lng });
      } else {
        onChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, { lat, lng });
      }
    } catch (error) {
      onChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, { lat, lng });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleLocationSelect(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
        alert('Impossible d\'obtenir votre position. Veuillez sélectionner manuellement sur la carte.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="customerAddress" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Adresse de livraison *
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Crosshair className="h-4 w-4 mr-2" />
          )}
          Ma position
        </Button>
      </div>
      
      <Input
        id="customerAddress"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cliquez sur la carte ou utilisez 'Ma position'"
        className="mb-2"
      />
      
      <div className="h-[200px] rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <RecenterMap center={mapCenter} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      <p className="text-xs text-muted-foreground">
        Cliquez sur la carte pour sélectionner votre adresse ou utilisez le bouton "Ma position"
      </p>
    </div>
  );
};

export default LocationPicker;
