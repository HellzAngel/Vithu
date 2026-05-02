import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiX, FiAlertCircle } from 'react-icons/fi';

const AuthModal = ({ isOpen, onClose, initialRole = 'customer' }) => {
  const [role, setRole] = React.useState(initialRole);
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isResetStep, setIsResetStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', farmName: '', address: '', city: '', pincode: '', otp: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setIsOtpStep(false);
      setIsResetStep(false);
      setError('');
      setFormData({ name: '', email: '', password: '', phone: '', farmName: '', address: '', city: '', pincode: '', otp: '' });
    }
  }, [isOpen, initialRole]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let lat = null, lng = null;
    if (!isLogin && navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => { lat = pos.coords.latitude; lng = pos.coords.longitude; resolve(); },
          () => resolve(),
          { timeout: 5000 }
        );
      });
    }

    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
      
      if (isLogin) {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('vithu_token', data.token);
          localStorage.setItem('vithu_user', JSON.stringify(data.user));
          localStorage.setItem('vithu_role', data.user.role);
          window.location.reload();
        } else {
          setError(data.message);
        }
      } else {
        const res = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, role, lat, lng })
        });
        const data = await res.json();
        if (data.success) {
          setIsOtpStep(true);
        } else {
          setError(data.message);
        }
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('vithu_token', data.token);
        localStorage.setItem('vithu_user', JSON.stringify(data.user));
        localStorage.setItem('vithu_role', data.user.role);
        window.location.reload();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }
    setLoading(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        setIsResetStep(true);
        setIsLogin(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';
      const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, newPassword: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password reset successful! Please login.");
        setIsResetStep(false);
        setIsLogin(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[50px] shadow-2xl p-10 w-full max-w-xl relative overflow-hidden border border-white"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all z-10"><FiX /></button>

        <div className="mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            {isOtpStep ? 'അംഗീകാരം' : isResetStep ? 'പുതിയ പാസ്‌വേഡ്' : isLogin ? 'സ്വാഗതം' : 'രജിസ്റ്റർ'}
          </h2>
          <p className="text-gray-400 font-bold italic mt-2">
            {isOtpStep ? 'Verification Code Sent' : isResetStep ? 'Reset your account password' : isLogin ? 'Welcome back to വിത്ത്' : `Join as a ${role}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500 font-bold text-xs"
            >
              <FiAlertCircle className="shrink-0 text-lg" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {isOtpStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Enter 6-digit OTP</label>
                <input name="otp" required maxLength="6" className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-black text-center text-2xl tracking-[1em] outline-none focus:border-emerald-500 transition-all" value={formData.otp} onChange={handleInputChange} />
             </div>
             <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 uppercase tracking-widest text-xs">Verify Account</button>
          </form>
        ) : isResetStep ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Verification Code</label>
                <input name="otp" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.otp} onChange={handleInputChange} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">New Password</label>
                <input type="password" name="password" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.password} onChange={handleInputChange} />
             </div>
             <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase tracking-widest text-xs">Reset Password</button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Full Name</label>
                    <input name="name" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Phone</label>
                    <input name="phone" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>
                {role === 'farmer' && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Farm Name</label>
                    <input name="farmName" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.farmName} onChange={handleInputChange} />
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                   <div className="col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">City</label>
                      <input name="city" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.city} onChange={handleInputChange} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Pincode</label>
                      <input name="pincode" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.pincode} onChange={handleInputChange} />
                   </div>
                </div>
              </>
            )}
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" name="email" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.email} onChange={handleInputChange} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center pr-1">
                <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Password</label>
                {isLogin && <button type="button" onClick={handleForgotPassword} className="text-[9px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-all">Forgot?</button>}
              </div>
              <input type="password" name="password" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-xl px-4 py-3 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.password} onChange={handleInputChange} />
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 mt-6 flex items-center justify-center gap-3">
               {loading ? 'Processing...' : (
                 <>{isLogin ? 'Login Now' : 'Create Account'} <FiArrowRight /></>
               )}
            </button>

            <div className="text-center mt-8">
               <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-all">
                  {isLogin ? "Don't have an account? Join" : "Already have an account? Login"}
               </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthModal;
