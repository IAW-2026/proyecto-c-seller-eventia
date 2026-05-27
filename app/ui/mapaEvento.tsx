'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  texto: string;
}

const DEFAULT_CENTER: [number, number] = [-34.6037, -58.3816];

export default function MapaEvento({ texto }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);


  useEffect(() => {
    if (!texto || texto.trim().length < 5) return;

    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texto)}&format=json&limit=1`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
        const data = await res.json();
        if (data.length > 0 && mapRef.current) {
          const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setMarkerPos(coords);
          mapRef.current.flyTo(coords, 15);
        }
      } catch {
        // silently fail
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [texto]);

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        ref={mapRef}
        center={DEFAULT_CENTER}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {markerPos && <Marker position={markerPos} />}

      </MapContainer>
    </div>
  );
}
