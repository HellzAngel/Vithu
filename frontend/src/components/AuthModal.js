import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiArrowRight, FiSmartphone, FiMapPin, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
      setError("Enter your email first to reset password.");
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
      setError("Failed to send reset OTP.");
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
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-2xl rounded-[60px] shadow-2xl p-12 w-full max-w-xl relative overflow-hidden border border-white"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400" />
        
        <button onClick={onClose} className="absolute top-10 right-10 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all z-10 hover:rotate-90">
          <FiX size={20} />
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <span className="w-12 h-1 bg-emerald-600 rounded-full" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
               {isLogin ? 'Authentication' : isOtpStep ? 'Security' : 'Registration'}
             </span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none">
            {isOtpStep ? 'അംഗീകാരം' : isResetStep ? 'റീസെറ്റ്' : isLogin ? 'സ്വാഗതം' : 'രജിസ്റ്റർ'}
          </h2>
          <p className="text-gray-400 font-bold italic mt-3 text-lg">
            {isOtpStep ? 'Verification Code Sent' : isResetStep ? 'Create a new secure password' : isLogin ? 'Welcome back to വിത്ത്' : `Start your journey as a ${role}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="mb-8 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-500 font-black text-xs shadow-sm"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <FiAlertCircle size={18} />
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {isOtpStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Secure Verification Code</label>
                <div className="relative">
                  <FiSmartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 text-xl" />
                  <input name="otp" required maxLength="6" className="w-full bg-gray-50 border-2 border-emerald-50 rounded-[30px] pl-16 pr-6 py-5 font-black text-2xl tracking-[0.5em] outline-none focus:border-emerald-500 transition-all shadow-inner" placeholder="000000" value={formData.otp} onChange={handleInputChange} />
                </div>
             </div>
             <button type="submit" disabled={loading} className="w-full py-6 bg-emerald-600 text-white rounded-[30px] font-black shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
               {loading ? 'Verifying...' : <>Confirm & Access <FiCheckCircle /></>}
             </button>
          </form>
        ) : isResetStep ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Enter OTP</label>
                <input name="otp" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-[25px] px-8 py-5 font-bold outline-none focus:border-emerald-500 transition-all" placeholder="Reset Code" value={formData.otp} onChange={handleInputChange} />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" name="password" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-[25px] pl-16 pr-6 py-5 font-bold outline-none focus:border-emerald-500 transition-all" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                </div>
             </div>
             <button type="submit" disabled={loading} className="w-full py-6 bg-emerald-600 text-white rounded-[30px] font-black shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                {loading ? 'Updating...' : <>Set New Password <FiArrowRight /></>}
             </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="name" placeholder="Full Name" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="relative">
                    <FiSmartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="phone" placeholder="Phone" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>
                {role === 'farmer' && (
                  <div className="relative">
                    <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="farmName" placeholder="Farm Name" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.farmName} onChange={handleInputChange} />
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                   <input name="city" placeholder="City" className="col-span-2 bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.city} onChange={handleInputChange} />
                   <input name="pincode" placeholder="PIN" className="bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.pincode} onChange={handleInputChange} />
                </div>
              </>
            )}
            
            <div className="relative">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" name="email" placeholder="Email Address" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.email} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="password" placeholder="Password" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:border-emerald-500 transition-all" value={formData.password} onChange={handleInputChange} />
                {isLogin && (
                  <button type="button" onClick={handleForgotPassword} className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-all">
                    Forgot?
                  </button>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-6 bg-emerald-600 text-white rounded-[30px] font-black shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-3">
               {loading ? 'Processing...' : (
                 <>{isLogin ? 'Login Now' : 'Create Account'} <FiArrowRight /></>
               )}
            </button>

            <div className="text-center mt-10">
               <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-all flex items-center justify-center gap-2 mx-auto">
                  {isLogin ? "New to വിത്ത്? Create an account" : "Already have an account? Login here"}
               </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthModal;
