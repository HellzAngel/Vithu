import React, { useState, useEffect } from 'react';
import { FiUsers, FiMapPin } from 'react-icons/fi';

const AdminDashboard = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('vithu_user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user || user.role !== 'admin') {
      window.location.href = '/';
      return;
    }

    const fetchFarmers = async () => {
      const token = localStorage.getItem('vithu_token');
      try {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
        const res = await fetch(`${baseUrl}/api/admin/farmers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setFarmers(data.farmers);
        }
      } catch (err) {
        console.error("Failed to fetch farmers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const handleToggleApproval = async (id) => {
    const token = localStorage.getItem('vithu_token');
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
      const res = await fetch(`${baseUrl}/api/admin/farmers/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setFarmers(farmers.map(f => f._id === id ? { ...f, isApproved: data.isApproved } : f));
      } else {
        alert(data.message || "Approval failed. Are you logged in as an Admin?");
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-emerald-900 tracking-tight">Admin Control Center</h1>
          <p className="text-gray-500 font-bold italic">Manage Farmers & Marketplace Approvals</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-100 p-4 rounded-3xl text-emerald-700 text-center">
            <p className="text-[10px] font-black uppercase">Active Farmers</p>
            <p className="text-2xl font-black">{farmers.length}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-3xl text-orange-700 text-center">
            <p className="text-[10px] font-black uppercase">Pending</p>
            <p className="text-2xl font-black">{farmers.filter(f => !f.isApproved).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/50">
              <tr className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                <th className="px-8 py-6">Farmer Info</th>
                <th className="px-8 py-6">Location</th>
                <th className="px-8 py-6">Coordinates</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {farmers.map((farmer) => (
                <tr key={farmer._id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-xl">👨‍🌾</div>
                      <div>
                        <p className="font-black text-gray-900">{farmer.farmName || farmer.name}</p>
                        <p className="text-xs text-gray-400 font-bold">{farmer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                      <FiMapPin className="text-emerald-500" /> {farmer.location?.city || 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {farmer.location?.coordinates?.lat ? (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        {farmer.location.coordinates.lat.toFixed(4)}, {farmer.location.coordinates.lng.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-red-400 bg-red-50 px-3 py-1 rounded-full">Missing Coords</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      farmer.isApproved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {farmer.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleToggleApproval(farmer._id)}
                      className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        farmer.isApproved 
                        ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-100'
                      }`}
                    >
                      {farmer.isApproved ? 'Revoke' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {farmers.length === 0 && !loading && (
            <div className="text-center py-20">
              <FiUsers className="text-6xl text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-bold italic">No farmers found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
