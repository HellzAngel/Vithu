import React, { useState } from 'react';
import { FiUsers, FiBox, FiCheckCircle, FiXCircle, FiActivity, FiPieChart } from "react-icons/fi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,240', icon: <FiUsers />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Farmers', value: '86', icon: <FiCheckCircle />, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Products', value: '432', icon: <FiBox />, color: 'bg-orange-100 text-orange-600' },
    { label: 'Total Orders', value: '3,892', icon: <FiPieChart />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Admin Sidebar */}
      <div className="w-full lg:w-72 bg-slate-900 rounded-[40px] p-8 text-white flex flex-col h-max shadow-2xl">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
            🛡️
          </div>
          <h2 className="text-2xl font-black">വിത്ത് Admin</h2>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">System Controller</p>
        </div>

        <nav className="space-y-4">
          {[
            { id: 'overview', label: 'Platform Stats', icon: <FiActivity /> },
            { id: 'farmers', label: 'Manage Farmers', icon: <FiCheckCircle /> },
            { id: 'users', label: 'Manage Users', icon: <FiUsers /> },
            { id: 'products', label: 'Manage Items', icon: <FiBox /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-white text-slate-900 shadow-xl scale-105' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Admin Content */}
      <div className="flex-1 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[35px] shadow-xl border border-gray-50">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-6`}>
                {stat.icon}
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 p-10">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">Platform Analytics</h2>
              <div className="bg-slate-50 rounded-3xl p-20 flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">Chart visualization goes here</p>
              </div>
            </div>
          )}

          {activeTab === 'farmers' && (
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900">Farmer Verification</h2>
                <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-black">4 Pending Approvals</span>
              </div>
              <div className="space-y-4">
                {['Ravi Nair', 'Bindu Panicker', 'Jose Kurian'].map((name, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-emerald-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center font-bold text-emerald-700">{name[0]}</div>
                      <div>
                        <h4 className="font-black text-slate-900">{name}</h4>
                        <p className="text-xs text-slate-400">Application Date: April {20 + i}, 2026</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                        <FiCheckCircle />
                      </button>
                      <button className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-50 border border-red-50 shadow-sm">
                        <FiXCircle />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
