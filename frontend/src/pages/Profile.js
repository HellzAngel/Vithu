import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCheckCircle } from 'react-icons/fi';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vithu_user');
    return saved ? JSON.parse(saved) : { name: 'Ananthu', email: 'ananthu@example.com', phone: '+91 9876543210', address: 'Kochi, Kerala' };
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('vithu_user', JSON.stringify(user));
    setNotification("Profile updated successfully!");
    setIsEditing(false);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-black"
        >
          <FiCheckCircle /> {notification}
        </motion.div>
      )}

      <div className="bg-white/90 backdrop-blur-xl rounded-[50px] shadow-2xl border border-white p-10 md:p-16 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
        
        <div className="flex flex-col md:flex-row items-center gap-12 mb-12 relative">
          <div className="w-32 h-32 bg-emerald-100 rounded-[40px] flex items-center justify-center text-5xl shadow-inner border-4 border-white rotate-3">
             👤
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{user.name}</h1>
            <p className="text-emerald-600 font-black uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
               Verified Customer <FiCheckCircle />
            </p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="ml-auto px-8 py-3 bg-gray-50 text-gray-500 rounded-2xl font-black hover:bg-emerald-50 hover:text-emerald-600 transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FiUser className="text-emerald-500" /> Full Name</label>
              <input 
                disabled={!isEditing}
                type="text" 
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                className="w-full bg-gray-50/50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FiMail className="text-emerald-500" /> Email Address</label>
              <input 
                disabled={!isEditing}
                type="email" 
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                className="w-full bg-gray-50/50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FiPhone className="text-emerald-500" /> Phone Number</label>
              <input 
                disabled={!isEditing}
                type="text" 
                value={user.phone}
                onChange={(e) => setUser({...user, phone: e.target.value})}
                className="w-full bg-gray-50/50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><FiMapPin className="text-emerald-500" /> Location / City</label>
              <input 
                disabled={!isEditing}
                type="text" 
                value={user.address}
                onChange={(e) => setUser({...user, address: e.target.value})}
                className="w-full bg-gray-50/50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {isEditing && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="submit"
              className="w-full py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
            >
              <FiSave className="text-xl" /> Save Changes
            </motion.button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
