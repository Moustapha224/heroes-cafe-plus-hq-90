import { useState } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationPickerProps {
  value: string;
  onChange: (address: string, coords?: { lat: number; lng: number }) => void;
}

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
          );
          const data = await response.json();
          if (data.display_name) {
            onChange(data.display_name, { lat: latitude, lng: longitude });
          } else {
            onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, { lat: latitude, lng: longitude });
          }
        } catch {
          onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, { lat: latitude, lng: longitude });
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert("Impossible d'obtenir votre position. Veuillez saisir votre adresse manuellement.");
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
        placeholder="Ex: Kaloum, Conakry"
      />
      <p className="text-xs text-muted-foreground">
        Saisissez votre adresse ou utilisez le bouton "Ma position" pour la détecter automatiquement
      </p>
    </div>
  );
};

export default LocationPicker;
