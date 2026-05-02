import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.role === 'admin') {
          localStorage.setItem('vithu_token', data.token);
          localStorage.setItem('vithu_user', JSON.stringify(data.user));
          localStorage.setItem('vithu_role', data.user.role);
          window.location.href = '/admin';
        } else {
          setError('Access denied. Not an admin account.');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-emerald-50"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-emerald-200">
            <FiLock />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Login</h2>
          <p className="text-gray-400 font-bold italic text-sm mt-2">Vithu Marketplace Management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Admin Username/Email</label>
            <div className="relative">
              <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                placeholder="vithuadmin"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Secure Password</label>
            <div className="relative">
              <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-emerald-50 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (
              <>Access Panel <FiArrowRight /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
