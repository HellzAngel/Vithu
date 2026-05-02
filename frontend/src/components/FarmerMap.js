import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiNavigation, FiSearch, FiTarget, FiX, FiStar, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Custom Icons
const farmerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062327.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 14, { duration: 2 });
    }
  }, [coords, map]);
  return null;
}

const FarmerMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';

  useEffect(() => {
    // Initial fetch of farmers
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/auth/farmers`);
        const data = await res.json();
        if (data.success && data.farmers) {
          setFarmers(data.farmers.length > 0 ? data.farmers : [
            { 
              _id: 'mock1', 
              name: 'Demo Organic Farm', 
              farmName: 'Demo Organic Farm', 
              location: { city: 'Kochi', coordinates: { lat: 10.0159, lng: 76.3419 } },
              rating: 4.8
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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 10.8505, lng: 76.2711 })
      );
    }
  }, [baseUrl]);

  return (
    <div className="w-full h-[400px] md:h-[650px] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border-4 md:border-[12px] border-white relative group font-sans">
      
      {/* Swiggy Style Search/Top Bar - Hidden on small mobile to save space */}
      <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:left-8 z-[1000] flex gap-2 md:gap-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[25px] shadow-2xl border border-white flex items-center gap-2 md:gap-4 flex-1 pointer-events-auto">
           <FiSearch className="text-emerald-600 shrink-0" />
           <input type="text" placeholder="Search farmers..." className="bg-transparent border-none outline-none w-full font-bold text-xs md:text-sm text-gray-700 placeholder:text-gray-400" />
        </div>
        <button 
          onClick={() => navigator.geolocation.getCurrentPosition((pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }))}
          className="bg-white/90 backdrop-blur-xl p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl border border-white text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all pointer-events-auto"
        >
          <FiTarget size={18} />
        </button>
      </div>

      <MapContainer 
        center={userLocation || [10.8505, 76.2711]} 
        zoom={13} 
        zoomControl={false}
        dragging={!L.Browser.mobile} // Disable dragging on mobile to allow page scroll
        touchZoom={true}
        className="w-full h-full z-0"
      >
        {/* Cleaner CartoDB Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />}

        {farmers.map((farmer) => (
          farmer.location?.coordinates?.lat && (
            <Marker 
              key={farmer._id} 
              position={[farmer.location.coordinates.lat, farmer.location.coordinates.lng]}
              icon={farmerIcon}
              eventHandlers={{ click: () => setSelectedFarmer(farmer) }}
            />
          )
        ))}

        <RecenterMap coords={userLocation} />
      </MapContainer>

      {/* Floating Info Panel (Swiggy Style) */}
      <AnimatePresence>
        {selectedFarmer && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-8 left-8 right-8 z-[1001] bg-white rounded-[40px] shadow-2xl p-8 border border-emerald-50 flex flex-col md:flex-row items-center gap-8 overflow-hidden"
          >
             <button onClick={() => setSelectedFarmer(null)} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all"><FiX /></button>
             
             <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner rotate-3 shrink-0">👨‍🌾</div>
             
             <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <h3 className="text-2xl font-black text-gray-900">{selectedFarmer.farmName || selectedFarmer.name}</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1"><FiStar fill="currentColor" /> {selectedFarmer.rating || '4.5'}</span>
                </div>
                {userLocation && selectedFarmer.location?.coordinates && (
                  (() => {
                    const R = 6371; // Earth radius in km
                    const dLat = (selectedFarmer.location.coordinates.lat - userLocation.lat) * Math.PI / 180;
                    const dLon = (selectedFarmer.location.coordinates.lng - userLocation.lng) * Math.PI / 180;
                    const a = 
                      Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(selectedFarmer.location.coordinates.lat * Math.PI / 180) * 
                      Math.sin(dLon/2) * Math.sin(dLon/2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    const distance = R * c;
                    const arrivalTime = Math.round(distance * 3 + 15); // Simple estimate: 3 mins/km + 15 mins base

                    return (
                      <>
                        <p className="text-gray-400 font-bold text-sm mb-4 flex items-center justify-center md:justify-start gap-2">
                          <FiMapPin className="text-emerald-500" /> {selectedFarmer.location.city} • {distance.toFixed(1)} km away
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-6">
                           <div className="flex items-center gap-2">
                              <FiClock className="text-emerald-600" />
                              <span className="text-xs font-black text-gray-600">Arrives in ~{arrivalTime} mins</span>
                           </div>
                           <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedFarmer.location.coordinates.lat},${selectedFarmer.location.coordinates.lng}`)}>
                              <FiNavigation className="text-emerald-600" />
                              <span className="text-xs font-black text-gray-600 underline">Get Directions</span>
                           </div>
                        </div>
                      </>
                    );
                  })()
                )}
             </div>

             <button 
              onClick={() => window.location.href = `/products?farmer=${selectedFarmer._id}`}
              className="w-full md:w-auto px-12 py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
             >
               Explore Products
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-[1002] flex flex-col items-center justify-center gap-4">
           <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
           <p className="text-emerald-900 font-black uppercase tracking-[0.3em] text-xs">Locating Freshness...</p>
        </div>
      )}
    </div>
  );
};

export default FarmerMap;
