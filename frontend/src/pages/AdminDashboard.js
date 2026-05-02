import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMapPin, FiCheckCircle, FiAlertOctagon, FiTrendingUp, FiActivity, FiShield, FiXCircle, FiSlash, FiSearch } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [farmers, setFarmers] = useState([]);
  const [reportedFarmers, setReportedFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';

  useEffect(() => {
    const userStr = localStorage.getItem('vithu_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || user.role !== 'admin') {
      window.location.href = '/admin-login';
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem('vithu_token');
      try {
        const fRes = await fetch(`${baseUrl}/api/admin/farmers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const fData = await fRes.json();
        if (fData.success) setFarmers(fData.farmers);

        const rRes = await fetch(`${baseUrl}/api/admin/reports`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const rData = await rRes.json();
        if (rData.success) setReportedFarmers(rData.reports);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [baseUrl]);

  const handleToggleApproval = async (id) => {
    const token = localStorage.getItem('vithu_token');
    try {
      const res = await fetch(`${baseUrl}/api/admin/farmers/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFarmers(farmers.map(f => f._id === id ? { ...f, isApproved: data.isApproved } : f));
      }
    } catch (err) {
      alert("Error updating approval status");
    }
  };

  const handleToggleSuspension = async (id) => {
    const token = localStorage.getItem('vithu_token');
    try {
      const res = await fetch(`${baseUrl}/api/admin/farmers/${id}/suspend`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFarmers(farmers.map(f => f._id === id ? { ...f, isSuspended: data.isSuspended } : f));
        setReportedFarmers(reportedFarmers.map(f => f._id === id ? { ...f, isSuspended: data.isSuspended } : f));
      }
    } catch (err) {
      alert("Error updating suspension status");
    }
  };

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = (f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || f.farmName?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeTab === 'pending') return !f.isApproved && matchesSearch;
    if (activeTab === 'approved') return f.isApproved && matchesSearch;
    return matchesSearch;
  });

  const stats = [
    { label: 'Total Farmers', value: farmers.length, icon: <FiUsers />, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Pending', value: farmers.filter(f => !f.isApproved).length, icon: <FiActivity />, color: 'bg-orange-100 text-orange-600' },
    { label: 'Reports', value: reportedFarmers.length, icon: <FiAlertOctagon />, color: 'bg-red-100 text-red-600' },
    { label: 'Market Health', value: '98%', icon: <FiTrendingUp />, color: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">System Admin</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Command Center</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">വിത്ത് Command Center</h1>
            <p className="text-gray-400 font-bold italic mt-2">Overseeing the Kerala Organic Ecosystem</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search farmers..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-3xl font-bold shadow-sm outline-none focus:border-emerald-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] shadow-sm border border-white hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-6`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden min-h-[600px]">
          
          <div className="flex border-b border-gray-50 p-6 gap-2 bg-gray-50/30">
            {[
              { id: 'pending', label: 'Pending Approval', icon: <FiActivity />, count: farmers.filter(f => !f.isApproved).length },
              { id: 'approved', label: 'Approved Farmers', icon: <FiCheckCircle />, count: farmers.filter(f => f.isApproved).length },
              { id: 'reports', label: 'Reported Accounts', icon: <FiAlertOctagon />, count: reportedFarmers.length },
              { id: 'settings', label: 'System Settings', icon: <FiShield /> },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[25px] font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                  : 'text-gray-400 hover:bg-white hover:text-emerald-600'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.count > 0 && <span className={`ml-2 px-2 py-0.5 rounded-full text-[8px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>}
              </button>
            ))}
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'reports' ? (
                <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-1 gap-6">
                    {reportedFarmers.map((farmer) => (
                      <div key={farmer._id} className="bg-red-50/50 border border-red-100 p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div className="flex gap-6">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center text-3xl">⚠️</div>
                            <div>
                               <h4 className="text-xl font-black text-gray-900">{farmer.farmName || farmer.name}</h4>
                               <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Reported {farmer.reports?.length} Times</p>
                               <div className="space-y-2">
                                  {farmer.reports?.map((report, idx) => (
                                    <p key={idx} className="text-xs text-gray-600 bg-white/60 p-3 rounded-xl border border-red-50">
                                       <span className="font-black text-red-600">Report:</span> "{report.reason}"
                                    </p>
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <button className="px-6 py-3 bg-white text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">Dismiss Reports</button>
                            <button 
                              onClick={() => handleToggleSuspension(farmer._id)}
                              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                farmer.isSuspended ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                              }`}
                            >
                              {farmer.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                            </button>
                         </div>
                      </div>
                    ))}
                    {reportedFarmers.length === 0 && <p className="text-center py-20 text-gray-400 font-bold italic">No reported farmers at this time. 🌿</p>}
                  </div>
                </motion.div>
              ) : activeTab === 'settings' ? (
                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                   <h3 className="text-2xl font-black text-gray-900 mb-8">System Configuration</h3>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                         <div>
                            <p className="font-black text-gray-900">Auto-Approval Mode</p>
                            <p className="text-xs text-gray-400 font-medium">Automatically approve new farmers (Not Recommended)</p>
                         </div>
                         <div className="w-14 h-8 bg-gray-200 rounded-full relative p-1 cursor-pointer"><div className="w-6 h-6 bg-white rounded-full shadow-sm" /></div>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                         <div>
                            <p className="font-black text-gray-900">SMS Notifications</p>
                            <p className="text-xs text-gray-400 font-medium">Notify admins when a new farmer registers</p>
                         </div>
                         <div className="w-14 h-8 bg-emerald-600 rounded-full relative p-1 cursor-pointer"><div className="w-6 h-6 bg-white rounded-full shadow-sm ml-auto" /></div>
                      </div>
                   </div>
                </motion.div>
              ) : (
                <motion.div key="farmers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                          <th className="px-4 py-6">Farmer</th>
                          <th className="px-4 py-6">Location</th>
                          <th className="px-4 py-6">Coordinates</th>
                          <th className="px-4 py-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredFarmers.map((farmer) => (
                          <tr key={farmer._id} className="group hover:bg-gray-50/50 transition-all">
                            <td className="px-4 py-8">
                              <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${farmer.isSuspended ? 'bg-red-50 text-red-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                   {farmer.isSuspended ? <FiSlash /> : '👨‍🌾'}
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 text-lg leading-none mb-1">{farmer.farmName || farmer.name}</p>
                                  <p className="text-xs text-gray-400 font-bold tracking-tight">{farmer.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-8">
                              <div className="flex items-center gap-2 text-gray-600 font-black text-sm">
                                <FiMapPin className="text-emerald-500" /> {farmer.location?.city || 'Not Specified'}
                              </div>
                            </td>
                            <td className="px-4 py-8">
                              {farmer.location?.coordinates?.lat ? (
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-max mb-1">LAT: {farmer.location.coordinates.lat.toFixed(4)}</span>
                                   <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-max">LNG: {farmer.location.coordinates.lng.toFixed(4)}</span>
                                </div>
                              ) : <span className="text-[9px] font-black text-red-400 bg-red-50 px-3 py-1 rounded-full">No Coords</span>}
                            </td>
                            <td className="px-4 py-8 text-right">
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                 <button 
                                  onClick={() => handleToggleApproval(farmer._id)}
                                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    farmer.isApproved 
                                    ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
                                  }`}
                                 >
                                   {farmer.isApproved ? 'Revoke Approval' : 'Approve Farmer'}
                                 </button>
                                 <button 
                                  onClick={() => handleToggleSuspension(farmer._id)}
                                  className={`p-3 rounded-2xl text-xl transition-all ${
                                    farmer.isSuspended ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                  }`}
                                  title={farmer.isSuspended ? 'Unsuspend' : 'Suspend'}
                                 >
                                   {farmer.isSuspended ? <FiCheckCircle /> : <FiXCircle />}
                                 </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredFarmers.length === 0 && <p className="text-center py-20 text-gray-400 font-bold italic">No matching farmers found. 🌾</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
