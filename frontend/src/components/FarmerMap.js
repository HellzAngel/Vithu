import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiNavigation } from 'react-icons/fi';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const farmerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062327.png', // Farmer/Tractor icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // User icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Component to recenter map when location changes
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 13);
    }
  }, [coords, map]);
  return null;
}

const FarmerMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 10.8505, lng: 76.2711 }) // Default to Kerala if failed
      );
    }

    // 2. Fetch farmers from backend
    const fetchFarmers = async () => {
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
        const res = await fetch(`${baseUrl}/api/auth/farmers`);
        const data = await res.json();
        if (data.success) {
          setFarmers(data.farmers.length > 0 ? data.farmers : [
            // Fallback mock farmer if DB is empty
            { 
              _id: 'mock1', 
              name: 'Demo Organic Farm', 
              farmName: 'Demo Organic Farm', 
              location: { city: 'Kochi', coordinates: { lat: 10.0159, lng: 76.3419 } } 
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch farmers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  return (
    <div className="w-full h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white relative group">
      <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white">
         <h3 className="text-sm font-black text-emerald-900 flex items-center gap-2">
           <FiMapPin className="text-emerald-600" /> Nearby Farmers
         </h3>
      </div>

      <MapContainer 
        center={userLocation || [10.8505, 76.2711]} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold text-emerald-900">You are here</div>
            </Popup>
          </Marker>
        )}

        {farmers.map((farmer) => (
          farmer.location?.coordinates?.lat && (
            <Marker 
              key={farmer._id} 
              position={[farmer.location.coordinates.lat, farmer.location.coordinates.lng]}
              icon={farmerIcon}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-black text-emerald-900 text-lg">{farmer.farmName || farmer.name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{farmer.location.city}</p>
                  <button className="w-full py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                    <FiNavigation /> View Products
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        <RecenterMap coords={userLocation} />
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 bg-emerald-900/10 backdrop-blur-sm z-[1001] flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default FarmerMap;
