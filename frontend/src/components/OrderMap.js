import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

const farmIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062327.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const homeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/754/754854.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function RecenterMap({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

const OrderMap = ({ status }) => {
  // Demo coordinates (Kerala region)
  // Use useMemo or define outside component to avoid dependency issues if needed, 
  // but for demo we will just include them in the array.
  const farmPos = React.useMemo(() => [10.8505, 76.2711], []);
  const userPos = React.useMemo(() => [10.8750, 76.2950], []);
  const [deliveryPos, setDeliveryPos] = useState(farmPos);

  useEffect(() => {
    // Simulate movement
    const progress = status === 'delivered' ? 1 : 0.65;
    const lat = farmPos[0] + (userPos[0] - farmPos[0]) * progress;
    const lng = farmPos[1] + (userPos[1] - farmPos[1]) * progress;
    setDeliveryPos([lat, lng]);
  }, [status, farmPos, userPos]);

  const bounds = [farmPos, userPos];

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        bounds={bounds} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={farmPos} icon={farmIcon} />
        <Marker position={userPos} icon={homeIcon} />
        <Marker position={deliveryPos} icon={deliveryIcon} />
        <Polyline positions={[farmPos, userPos]} color="#10b981" dashArray="10, 10" />
        <RecenterMap bounds={bounds} />
      </MapContainer>
      
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white">
         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Live Tracking</p>
      </div>
    </div>
  );
};

export default OrderMap;
